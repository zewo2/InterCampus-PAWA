const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaEstagioController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public routes (search offers)
router.get('/', ofertaController.getAll);
router.get('/:id', ofertaController.getById);

// Protected routes
router.use(authenticate);

// Create offer (Empresa only)
router.post('/', authorize('Empresa'), ofertaController.create);

// Update offer (Empresa/Gestor only)
router.put('/:id', authorize('Empresa', 'Gestor'), ofertaController.update);

// Delete offer (Empresa/Gestor only)
router.delete('/:id', authorize('Empresa', 'Gestor'), ofertaController.delete);

// Get applications for an offer (Empresa/Gestor only)
router.get('/:id/candidaturas', authorize('Empresa', 'Gestor'), ofertaController.getCandidaturas);

module.exports = router;
