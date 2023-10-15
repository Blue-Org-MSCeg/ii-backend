const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
	foodItem: {
		type: String,
		required: [true, 'A food must have a name'],
		unique: true,
	},
	cost: {
		type: Number,
		required: [true, 'A food item must have a cost'],
		validate: {
			validator: function (amt) {
				return amt > 0;
			},
			message: 'cost cannot be below Rs1',
		},
	},
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
