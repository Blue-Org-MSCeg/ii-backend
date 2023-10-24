const mongoose = require('mongoose');
const validator = require('validator');

const subDocumentSchema = new mongoose.Schema({ foodItem: String, cost: Number });

const clientSchema = new mongoose.Schema({
	businessName: {
		type: String,
		required: [true, 'A client must have a name'],
		unique: true,
	},
	GSTno: {
		type: String,
		unique: true,
	},
	phoneNo: {
		type: Number,
		required: [true, 'A client must have a contact number'],
		unique: true,
		maxLength: [40, 'A mobile number can have atmost 10 digits'],
		minLength: [10, 'A mobile number must have atleast 10 digits'],
	},
	emailAddress: {
		type: String,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	address: {
		type: String,
		minLength: [10, 'Address must have atleast 10 characters'],
	},
	agreementStartDate: {
		type: Date,
		required: [true, 'A client must have a aggreement start date'],
	},
	agreementEndDate: {
		type: Date,
		required: [true, 'A client must have a aggreement end date'],
	},
	lastInvoiceGeneratedDate: {
		type: Date,
		default: Date.now(),
	},
	menuCost: [subDocumentSchema],
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
