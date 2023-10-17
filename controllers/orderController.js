const Order = require('./../models/orderModel');
const Client = require('./../models/clientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createOrder = catchAsync(async (req, res, next) => {
	const client = await Client.find({ businessName: req.body.businessName });
	const order = await Order.create({
		businessName: req.body.businessName,
		clientId: client[0]._id.toString(),
		foodItem: req.body.foodItem,
		numberOfHeads: req.body.numberOfHeads,
		orderDate: req.body.orderDate,
	});

	res.status(200).json({
		status: 'success',
		data: {
			order: order,
		},
	});
});

exports.editOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

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

exports.deleteOrder = catchAsync(async (req, res, next) => {
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
	const invoice = await Order.aggregate([
		{
			$group: {
				_id: '$foodItem',
				quantity: { $sum: '$numberOfHeads' },
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			invoice: invoice,
		},
	});
});
