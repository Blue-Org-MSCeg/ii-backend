const catchAsync = require('./../utils/catchAsync');
const Client = require('./../models/clientModel');
const AppError = require('../utils/AppError');

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
