// Rutas de autenticación
const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/login — pública, no requiere token
router.post('/login', login);

module.exports = router;
