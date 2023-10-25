const mongoose = require('mongoose');
const validator = require('validator');

const subDocumentSchema = new mongoose.Schema({
	foodItem: {
		type: String,
	},
	cost: {
		type: Number,
		required: [true, 'A food must have a cost'],
	},
});

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
	// lastInvoiceGeneratedDate: {
	// 	type: Date,
	// 	default: Date.now(),
	// },
	menuQuotation: {
		type: [subDocumentSchema],
		default: [],
	},
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
