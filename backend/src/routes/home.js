const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// GET /api/home - Get home page data (public route)
router.get('/', homeController.getHomeData);

module.exports = router;
