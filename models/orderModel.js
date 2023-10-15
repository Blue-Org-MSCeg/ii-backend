const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	businessName: {
		type: String,
		required: [true, 'order must have a business name'],
	},
	clientId: {
		type: String,
		required: [true, 'client must have a id'],
	},
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
	orderDate: {
		type: Date,
		default: Date.now(),
		required: [true, 'order must have a order date '],
	},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
