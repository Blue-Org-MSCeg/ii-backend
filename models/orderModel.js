const mongoose = require('mongoose');

const subDocumentSchema = new mongoose.Schema({
	foodItem: {
		type: String,
		required: [true, 'order must have a food item'],
	},
	numberOfHeads: {
		type: Number,
		required: [true, 'order must have a number of heads'],
		validate: {
			validator: function (val) {
				return val > 0;
			},
		},
	},
	foodCost: {
		type: Number,
		required: [true, 'An order must have a food cost'],
		validate: {
			validator: function (val) {
				return val > 0;
			},
		},
	},
});

const orderSchema = new mongoose.Schema({
	businessName: {
		type: String,
		required: [true, 'order must have a business name'],
	},
	clientId: {
		type: String,
		required: [true, 'client must have a id'],
	},
	orderDate: {
		type: Date,
		default: Date.now(),
		required: [true, 'order must have a order date '],
	},
	orders: [subDocumentSchema],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
