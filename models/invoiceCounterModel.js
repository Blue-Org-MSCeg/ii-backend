const mongoose = require('mongoose');

const invoiceCounterSchema = new mongoose.Schema({
	invoiceNumber: {
		type: Number,
		default: 1,
	},
});

const InvoiceCounter = mongoose.model('InvoiceCounterSchema', invoiceCounterSchema);

module.exports = InvoiceCounter;
