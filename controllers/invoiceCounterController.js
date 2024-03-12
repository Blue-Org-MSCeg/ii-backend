const InvoiceCounter = require('../models/invoiceCounterModel');
const catchAsync = require('../utils/catchAsync');

exports.getInvoiceNumber = catchAsync(async (req, res, next) => {
	const invoiceNumber = await InvoiceCounter.findOne();

	res.status(200).json({
		status: 'success',
		invoiceNumber: invoiceNumber,
	});
});

exports.updateInvoiceNumber = catchAsync(async (req, res, next) => {
	// Assuming you only have one document for the invoice counter
	const counterDocument = await InvoiceCounter.findOne();

	// If the counter document exists, increment the invoiceNumber
	if (counterDocument) {
		counterDocument.invoiceNumber += 1;
		await counterDocument.save();
	} else {
		// If the counter document doesn't exist, create a new one with invoiceNumber starting from 1
		await InvoiceCounter.create({ invoiceNumber: 1 });
	}

	res.status(200).json({
		status: 'success',
		invoiceNumber: counterDocument.invoiceNumber,
	});
});
