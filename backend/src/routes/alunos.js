const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all students (Gestor/Professor only)
router.get('/', authorize('Gestor', 'Professor'), alunoController.getAll);

// Get student by ID
router.get('/:id', alunoController.getById);

// Update student profile
router.put('/:id', authorize('Aluno', 'Gestor'), alunoController.update);

// Get student's applications
router.get('/:id/candidaturas', alunoController.getCandidaturas);

// Get student's internship
router.get('/:id/estagio', alunoController.getEstagio);

module.exports = router;
