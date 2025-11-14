const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { handleUploadError } = require('../middlewares/uploadMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/recover-password', authController.recoverPassword);

// Protected routes
router.get('/me', authenticate, authController.me);
router.put('/update-profile', authenticate, handleUploadError, authController.updateProfile);

module.exports = router;
