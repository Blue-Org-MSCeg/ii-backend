const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(newUser._id);

	res.status(200).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) check if email and password exist
	if (!email || !password) return next(new AppError('Please provide email and password', 400));

	// 2) check is user exists and password is correct
	const user = await User.findOne({ email: email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// 3) if everything is ok send token to client
	token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token: token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	let token, decoded;
	// 1) get the token and check if it's there
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Your are not logged in! Please login to get access', 401));
	}

	// 2) verify token
	try {
		decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({
				status: 'failed',
				message: 'Please login again',
			});
		}

		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({
				status: 'failed',
				message: 'Your token has expired! Please login again',
			});
		}
	}

	// 3) check if the user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to the id no longer exist', 401));
	}

	// GRANT ACCESS TO THE USER
	req.user = currentUser;
	next();
});
