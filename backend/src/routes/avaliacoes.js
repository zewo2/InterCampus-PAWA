const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all evaluations
router.get('/', avaliacaoController.getAll);

// Get evaluation by ID
router.get('/:id', avaliacaoController.getById);

// Create evaluation (Professor/Empresa only)
router.post('/', authorize('Professor', 'Empresa'), avaliacaoController.create);

// Update evaluation
router.put('/:id', authorize('Professor', 'Empresa', 'Gestor'), avaliacaoController.update);

// Delete evaluation
router.delete('/:id', authorize('Professor', 'Empresa', 'Gestor'), avaliacaoController.delete);

module.exports = router;
