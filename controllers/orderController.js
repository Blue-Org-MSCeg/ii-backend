const Order = require('./../models/orderModel');
const Client = require('./../models/clientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Menu = require('./../models/menuModel');

exports.createOrder = catchAsync(async (req, res, next) => {
	const client = await Client.findOne({ businessName: req.body.businessName });

	if (!client) {
		return next(new AppError('No client found with that businessName', 404));
	}

	if (!req.body.orders) {
		return next(new AppError('No orders to add', 400));
	}
	console.log(req.body.orders, client);
	req.body.orders.forEach((order) => {
		if (!order.foodCost) {
			client.menuQuotation.forEach((menu) => {
				if (menu.foodItem === order.foodItem) {
					order.foodCost = menu.cost;
				}
			});
		}
	});

	const order = await Order.create({
		businessName: req.body.businessName,
		clientId: client._id.toString(),
		orderDate: req.body.orderDate,
		orders: req.body.orders,
	});

	res.status(200).json({
		status: 'success',
		data: {
			order: order,
		},
	});
});

exports.editOrder = catchAsync(async (req, res, next) => {
	const updatedOrder = await Order.findOneAndUpdate(
		{
			_id: req.params.id,
			'orders.foodItem': req.body.foodItem,
		},
		{
			$set: {
				'orders.$.foodItem': req.body.newFoodItem,
				'orders.$.numberOfHeads': req.body.numberOfHeads,
				'orders.$.foodCost': req.body.foodCost,
			},
		},
		{ new: true, runValidators: true }
	);

	if (!updatedOrder) {
		return next(new AppError('No order found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order: updatedOrder,
		},
	});
});

exports.addOrder = catchAsync(async (req, res, next) => {
	const client = await Client.findOne({ businessName: req.body.businessName });

	if (!client) {
		return next(new AppError('No client found with that businessName', 404));
	}

	if (!req.body.orders) {
		return next(new AppError('No orders to add', 400));
	}

	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that id', 404));
	}

	req.body.orders.forEach((item) => {
		if (!item.foodCost) {
			client.menuCost.forEach((menu) => {
				if (menu.foodItem === item.foodItem) {
					item.foodCost = menu.cost;
				}
			});
		}
		order.orders.push(item);
	});

	const updatedOrder = await order.save();

	res.status(200).json({
		status: 'success',
		data: {
			order: updatedOrder,
		},
	});
});

exports.deleteEntireOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndDelete(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order: order,
		},
	});
});

exports.removeOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that id', 404));
	}

	order.orders.pop({ _id: req.body.id });
	const updatedOrder = await order.save();

	res.status(200).json({
		status: 'success',
		data: {
			order: updatedOrder,
		},
	});
});

exports.viewOrders = catchAsync(async (req, res, next) => {
	const orders = await Order.find({ businessName: req.params.businessName });

	if (!orders) {
		return next(new AppError('No orders found for that client', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			orders: orders,
		},
	});
});

exports.getOrderDetails = catchAsync(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order: order,
		},
	});
});

exports.getInvoiceDetails = catchAsync(async (req, res, next) => {
	const businessName = req.params.businessName;

	// finding the client document from Client collection to get their lastInvoiceGeneratedDate
	const client = await Client.findOne({ businessName: businessName });

	if (!client) {
		return next(new AppError('No client found with that businessName', 404));
	}

	const startDate = req.body.startDate;
	const endDate = req.body.endDate;

	const invoice = await Order.aggregate([
		{
			$match: {
				businessName: businessName,
				orderDate: {
					$gte: new Date(startDate),
					$lte: new Date(endDate),
				},
			},
		},
		{
			$unwind: '$orders',
		},
		{
			$group: {
				_id: '$orders.foodItem',
				quantity: { $sum: '$orders.numberOfHeads' },
				cost: { $first: '$orders.foodCost' },
			},
		},
		{
			$project: {
				quantity: 1,
				cost: 1,
				amount: { $multiply: ['$quantity', '$cost'] },
			},
		},
	]);

	if (!invoice) {
		return next(new AppError('No orders after the lastly generated invoice', 404));
	}

	// update the client's last invoice generation date
	// const updatedClient = await Client.findOneAndUpdate({ businessName: businessName }, { lastInvoiceGeneratedDate: Date.now() });
	// if (!updatedClient) {
	// 	return next(new AppError('No client found with that businessName', 404));
	// }

	res.status(200).json({
		status: 'success',
		data: {
			invoice: invoice,
		},
	});
});

exports.getReportSheetDetails = catchAsync(async (req, res, next) => {
	const businessName = req.params.businessName;

	// finding the client document from Client collection to get their lastInvoiceGeneratedDate
	const client = await Client.findOne({ businessName: businessName });

	if (!client) {
		return next(new AppError('No client found with that businessName', 404));
	}

	const startDate = req.body.startDate;
	const endDate = req.body.endDate;

	const reportSheet = await Order.aggregate([
		{
			$match: {
				businessName: businessName,
				orderDate: {
					$gte: new Date(startDate),
					$lte: new Date(endDate),
				},
			},
		},
		{
			$project: {
				orderDate: 1,
				orders: 1,
			},
		},
	]);

	if (!reportSheet) {
		return next(new AppError('No orders after the lastly generated reportSheet', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			reportSheet: reportSheet,
		},
	});
});
