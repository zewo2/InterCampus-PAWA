const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const homeRoutes = require('./home');
const alunoRoutes = require('./alunos');
const empresaRoutes = require('./empresas');
const ofertaRoutes = require('./ofertas');
const candidaturaRoutes = require('./candidaturas');
const estagioRoutes = require('./estagios');
const avaliacaoRoutes = require('./avaliacoes');
const professorRoutes = require('./professores');
const gestorRoutes = require('./gestores');
const { health } = require('../controllers/healthController');

// Health check
router.get('/health', health);

// Register routes
router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/alunos', alunoRoutes);
router.use('/empresas', empresaRoutes);
router.use('/ofertas', ofertaRoutes);
router.use('/candidaturas', candidaturaRoutes);
router.use('/estagios', estagioRoutes);
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/professores', professorRoutes);
router.use('/gestores', gestorRoutes);

module.exports = router;