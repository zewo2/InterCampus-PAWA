const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all professors
router.get('/', professorController.getAll);

// Get professor by ID
router.get('/:id', professorController.getById);

// Update professor
router.put('/:id', authorize('Professor', 'Gestor'), professorController.update);

// Get professor's supervised internships
router.get('/:id/estagios', professorController.getEstagios);

module.exports = router;
