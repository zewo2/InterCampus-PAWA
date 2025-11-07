const express = require('express');
const router = express.Router();
const candidaturaController = require('../controllers/candidaturaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all applications (filtered by role)
router.get('/', candidaturaController.getAll);

// Get application by ID
router.get('/:id', candidaturaController.getById);

// Create application (Aluno only)
router.post('/', authorize('Aluno'), candidaturaController.create);

// Update application status (Empresa/Gestor only)
router.patch('/:id/status', authorize('Empresa', 'Gestor'), candidaturaController.updateStatus);

// Delete application
router.delete('/:id', authorize('Aluno', 'Gestor'), candidaturaController.delete);

module.exports = router;
