const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/').post(orderController.createOrder);
router.route('/:businessName/:date').get(orderController.viewOrders);
router.route('/invoice/:businessName/:startDate/:endDate').get(orderController.getInvoiceDetails);
router.route('/reportSheet/:businessName/:startDate/:endDate').get(orderController.getReportSheetDetails);
router.route('/order/:id').get(orderController.getOrderDetails).put(orderController.addOrder).patch(orderController.editOrder).delete(orderController.deleteEntireOrder);
router.route('/order/remove/:id').delete(orderController.removeOrder);

module.exports = router;
