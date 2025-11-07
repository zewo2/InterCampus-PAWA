const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public routes (no authentication required)
// Get all companies
router.get('/', empresaController.getAll);

// Get company by ID
router.get('/:id', empresaController.getById);

// Get company's job offers
router.get('/:id/ofertas', empresaController.getOfertas);

// Protected routes (require authentication)
// Create company (after user registration)
router.post('/', authenticate, authorize('Empresa'), empresaController.create);

// Update company
router.put('/:id', authenticate, authorize('Empresa', 'Gestor'), empresaController.update);

// Validate company (Gestor only)
router.patch('/:id/validate', authenticate, authorize('Gestor'), empresaController.validate);

module.exports = router;
