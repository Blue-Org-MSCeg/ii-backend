const express = require('express');
const router = express.Router();
const clientController = require('./../controllers/clientController');

router.route('/').get(clientController.getAllClients).post(clientController.createClient);
router.route('/:id').get(clientController.getClient).delete(clientController.removeClient).patch(clientController.updateClient);
router.route('/quotation/:id').put(clientController.addMenuQuotation).patch(clientController.editMenuQuotation);

module.exports = router;
