const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Authentication pages
router.get('/login', viewController.loginPage);
router.get('/register', viewController.registerPage);

// Dashboard
router.get('/dashboard', viewController.dashboardPage);

// Ofertas de Estágio
router.get('/ofertas', viewController.ofertasPage);
router.get('/ofertas/:id', viewController.ofertaDetailPage);

// User profile
router.get('/perfil', viewController.perfilPage);

// Candidaturas
router.get('/candidaturas', viewController.candidaturasPage);

// Estágios
router.get('/estagios', viewController.estagiosPage);

// Avaliações
router.get('/avaliacoes', viewController.avaliacoesPage);

// Empresas
router.get('/empresas', viewController.empresasPage);

// Alunos
router.get('/alunos', viewController.alunosPage);

// Professores
router.get('/professores', viewController.professoresPage);

// 404 handler - must be last
router.use(viewController.notFoundPage);

module.exports = router;
