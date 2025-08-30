const express = require('express');
const router = express.Router();
const clientController = require('./../controllers/clientController');
const authController = require('./../controllers/authController');
const { body, param } = require('express-validator');

router.route('/').get(clientController.getAllClients).post(clientController.createClient);
router
	.route('/:id', [param('id').isMongoId().withMessage('Enter a valid id')])
	.get(clientController.getClient)
	.delete(clientController.removeClient)
	.patch(clientController.updateClient);
router
	.route('/quotation/:id', [param('id').isMongoId().withMessage('Enter a valid id')])
	.get(clientController.getMenuQuotations)
	.put(clientController.addMenuQuotation)
	.patch(clientController.editMenuQuotation);
router
	.route('/quotation/:clientId/:id', [param('id').isMongoId().withMessage('Enter a valid id'), param('clientId').isMongoId().withMessage('Enter a valid client id')])
	.delete(clientController.removeMenuQuotation);
module.exports = router;
