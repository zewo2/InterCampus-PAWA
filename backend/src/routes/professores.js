const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { handleDocumentUpload } = require('../middlewares/documentUploadMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all professors
router.get('/', professorController.getAll);

// Dashboard overview for logged professor
router.get('/me/dashboard', authorize('Professor'), professorController.getDashboardStats);

// Supervised students list
router.get('/me/alunos', authorize('Professor'), professorController.getSupervisedStudents);

// Supervised internships list
router.get('/me/estagios', authorize('Professor'), professorController.getSupervisedInternships);

// Documents management
router.get('/me/documentos', authorize('Professor'), professorController.getDocuments);
router.post('/me/documentos', authorize('Professor'), handleDocumentUpload, professorController.uploadDocument);
router.delete('/me/documentos/:id', authorize('Professor'), professorController.deleteDocument);

// Get professor by ID
router.get('/:id', professorController.getById);

// Update professor
router.put('/:id', authorize('Professor', 'Gestor'), professorController.update);

// Get professor's supervised internships
router.get('/:id/estagios', professorController.getEstagios);

module.exports = router;
