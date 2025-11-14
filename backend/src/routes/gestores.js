const express = require('express');
const router = express.Router();
const gestorController = require('../controllers/gestorController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication and Gestor role
router.use(authenticate);
router.use(authorize('Gestor'));

// Get all managers
router.get('/', gestorController.getAll);

// Get manager by ID
router.get('/:id', gestorController.getById);

// Dashboard stats
router.get('/dashboard/stats', gestorController.getStats);

module.exports = router;
