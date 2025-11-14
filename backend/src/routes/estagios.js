const express = require('express');
const router = express.Router();
const estagioController = require('../controllers/estagioController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all internships
router.get('/', estagioController.getAll);

// Get internship by ID
router.get('/:id', estagioController.getById);

// Create internship (Gestor only)
router.post('/', authorize('Gestor'), estagioController.create);

// Update internship
router.put('/:id', authorize('Gestor', 'Professor'), estagioController.update);

// Get evaluations for an internship
router.get('/:id/avaliacoes', estagioController.getAvaliacoes);

module.exports = router;
