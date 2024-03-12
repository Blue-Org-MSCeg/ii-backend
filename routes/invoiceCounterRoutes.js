const express = require('express');
const router = express.Router();
const invoiceCounterController = require('./../controllers/invoiceCounterController');

router.route('/').get(invoiceCounterController.getInvoiceNumber).patch(invoiceCounterController.updateInvoiceNumber);

module.exports = router;
