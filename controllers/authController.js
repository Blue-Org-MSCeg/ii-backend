const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1)  get user based on email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('No user found with that email', 404));
	}

	// 2) generate random reset token
	const resetToken = user.generatePasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) send email
	try {
		sendEmail({
			email: user.email,
			subject: 'Your password reset token(valid for 10mins)',
			message: resetToken,
		});

		res.status(200).json({
			status: 'success',
			message: 'reset token sent to email',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpiresIn = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email', 500));
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) get user based on token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpiresIn: { $gt: Date.now() } });

	// 2) check if token has not expired and set new password
	if (!user) {
		return next(new AppError('Token is invalid or expired', 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetTokenExpiresIn = undefined;
	await user.save({ validateBeforeSave: false });

	// 3) log the user in
	const token = signToken(user._id);

	res.status(201).json({
		status: 'success',
		token: token,
	});
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
	// 1) get the current user
	const user = await User.findById(req.user._id).select('+password');

	// 2) check whether the given password is correct
	if (!user.correctPassword(req.body.password, user.oldPassword)) {
		return next(new AppError('Password is not correct', 400));
	}

	// 3) update password
	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPasswordConfirm;
	await user.save();

	// 4) Log the new user in
	const token = signToken(user._id);

	res.status(201).json({
		status: 'success',
		token,
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

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You dont have permission to perform this action'));
		}
		next();
	};
};
