const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.get('/protect', authController.protect);

router.route('/').get(authController.restrictTo('admin'), userController.getAllUsers).patch(authController.updateUserPassword);
router.route('/:id').delete(authController.protect, authController.restrictTo('admin'), userController.removeUser);

module.exports = router;
