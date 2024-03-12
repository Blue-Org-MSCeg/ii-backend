const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const clientRouter = require('./routes/clientRoutes');
const menuRouter = require('./routes/menuRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const invoiceCounterRouter = require('./routes/invoiceCounterRoutes');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

// security HTTP headers
app.use(helmet());

// body-parser, reading data from body into req.body
app.use(express.json());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// serving static files
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/menus', menuRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/invoiceCounter', invoiceCounterRouter);

app.all('*', (req, res, next) => {
	return next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
