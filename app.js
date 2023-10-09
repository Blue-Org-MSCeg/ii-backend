const express = require('express');
const clientRouter = require('./routes/clientRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1/clients', clientRouter);

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