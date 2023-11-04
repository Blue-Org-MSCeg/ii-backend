const express = require('express');
const router = express.Router();
const clientController = require('./../controllers/clientController');

router.route('/').get(clientController.getAllClients).post(clientController.createClient);
router.route('/:id').get(clientController.getClient).delete(clientController.removeClient).patch(clientController.updateClient);
router.route('/quotation/:id').get(clientController.getMenuQuotations).put(clientController.addMenuQuotation).patch(clientController.editMenuQuotation);
router.route('/quotation/:clientId/:id').delete(clientController.removeMenuQuotation);
module.exports = router;
