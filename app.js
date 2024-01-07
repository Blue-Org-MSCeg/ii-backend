const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const clientRouter = require('./routes/clientRoutes');
const menuRouter = require('./routes/menuRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const AppError = require('./utils/appError');

const app = express();

// security HTTP headers
app.use(helmet());

// body-parser, reading data from body into req.body
app.use(express.json());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// serving static files
app.use(cors({ origin: true, credentials: true }));

app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/menus', menuRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
	return next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use((err, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status,
		err: err,
		message: err.message,
	});
});
module.exports = app;
