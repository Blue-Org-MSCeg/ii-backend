const express = require('express');
const clientRouter = require('./routes/clientRoutes');
const menuRouter = require('./routes/menuRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const AppError = require('./utils/appError');

const app = express();
app.use(express.json());
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
