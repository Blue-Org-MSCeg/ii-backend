const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	if (users.length === 0) {
		return next(new AppError('No users have signed up to the app', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			users: users,
		},
	});
});

exports.removeUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new AppError('No user found with that id', 404));
	}

	res.status(200).json({
		status: 'success',
		message: 'user removed',
	});
});
