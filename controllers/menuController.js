const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Menu = require('./../models/menuModel');

exports.viewMenu = catchAsync(async (req, res, next) => {
	const menu = await Menu.find();

	res.status(200).json({
		status: 'success',
		data: {
			menu: menu,
		},
	});
});

exports.getFoodItem = catchAsync(async (req, res, next) => {
	const food = await Menu.findById(req.params.id);

	if (!food) {
		return next(new AppError('No food found', 400));
	}

	res.status(200).json({
		status: 'success',
		data: {
			food: food,
		},
	});
});

exports.addFood = catchAsync(async (req, res, next) => {
	const food = await Menu.create(req.body);

	if (!food) {
		return next(new AppError('No food to add', 400));
	}

	res.status(200).json({
		status: 'success',
		data: {
			food: food,
		},
	});
});

exports.editFoodItem = catchAsync(async (req, res, next) => {
	const food = await Menu.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!food) {
		return next(new AppError('No food found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			food: food,
		},
	});
});

exports.removeFood = catchAsync(async (req, res, next) => {
	const food = await Menu.findByIdAndDelete(req.params.id);

	if (!food) {
		return next(new AppError('No food found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			food: food,
		},
	});
});
