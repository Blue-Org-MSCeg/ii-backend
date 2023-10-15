const express = require('express');
const menuController = require('./../controllers/menuController');
const router = express.Router();

router.route('/').get(menuController.viewMenu).post(menuController.addFood);
router.route('/:id').get(menuController.getFoodItem).delete(menuController.removeFood).patch(menuController.editFoodItem);

module.exports = router;
