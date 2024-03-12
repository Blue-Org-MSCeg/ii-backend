const catchAsync = require('./../utils/catchAsync');
const Client = require('./../models/clientModel');
const AppError = require('../utils/appError');
const Menu = require('./../models/menuModel');

exports.getAllClients = catchAsync(async (req, res, next) => {
	const clients = await Client.find();

	res.status(200).json({
		status: 'success',
		noOfClients: clients.length,
		data: {
			clients: clients,
		},
	});
});

exports.getClient = catchAsync(async (req, res, next) => {
	const client = await Client.findById(req.params.id);

	if (!client) {
		return next(new AppError('No client found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			client: client,
		},
	});
});

exports.createClient = catchAsync(async (req, res, next) => {
	const menu = await Menu.find();
	req.body.menuQuotation = menu;
	const newClient = await Client.create(req.body);

	res.status(200).json({
		status: 'success',
		data: {
			client: newClient,
		},
	});
});

exports.updateClient = catchAsync(async (req, res, next) => {
	const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!client) {
		return next(new AppError('No client found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			client: client,
		},
	});
});

exports.addMenuQuotation = catchAsync(async (req, res, next) => {
	const client = await Client.findById(req.params.id);

	if (!client) {
		return next(new AppError('No client found with that businessName', 404));
	}

	// if (!req.body.menuQuotation) {
	// 	return next(new AppError('No menu quotations to add', 400));
	// }

	// req.body.menuQuotation.forEach((item) => {
	// 	client.menuQuotation.push(item);
	// });

	if (!req.body) {
		return next(new AppError('No menu quotations to add', 400));
	}

	client.menuQuotation.push(req.body);

	const updatedClient = await client.save();

	res.status(200).json({
		status: 'success',
		data: {
			client: updatedClient,
		},
	});
});

exports.editMenuQuotation = catchAsync(async (req, res, next) => {
	const updatedClient = await Client.findOneAndUpdate(
		{
			_id: req.params.id,
			'menuQuotation.foodItem': req.body.foodItem,
		},
		{
			$set: {
				'menuQuotation.$.foodItem': req.body.newFoodItem,
				'menuQuotation.$.cost': req.body.cost,
			},
		},
		{ new: true, runValidators: true }
	);

	if (!updatedClient) {
		return next(new AppError('No order found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order: updatedClient,
		},
	});
});

exports.getMenuQuotations = catchAsync(async (req, res, next) => {
	const client = await Client.findById(req.params.id);

	if (!client) {
		return next(new AppError('No client found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			menuQuotations: client.menuQuotation,
		},
	});
});

exports.removeClient = catchAsync(async (req, res, next) => {
	const client = await Client.findByIdAndDelete(req.params.id);

	if (!client) {
		return next(new AppError('No client found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: null,
	});
});

exports.removeMenuQuotation = catchAsync(async (req, res, next) => {
	const client = await Client.findOneAndUpdate({ _id: req.params.clientId }, { $pull: { menuQuotation: { _id: req.params.id } } }, { new: true });

	if (!client) {
		return next(new AppError('No client found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: client,
	});
});
