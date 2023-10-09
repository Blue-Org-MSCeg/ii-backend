const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION..💥💥Shutting down server');
	console.log(err.name, err.message);
	process.exit(1);
});

// config file location
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
	.connect(DB)
	.then((con) => {
		console.log('Database connection successfull');
	})
	.catch((err) => {
		console.log('Something went wrong with establishing database connection', err);
	});

const server = app.listen(3000, () => {
	console.log('listening to the port 3000');
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION..💥Shutting down server');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
