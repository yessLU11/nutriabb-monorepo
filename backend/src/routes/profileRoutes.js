console.log("➡️ Cargando profileRoutes");


const express = require('express');
const router = express.Router();

// Importar correctamente el middleware desde middleware/authMiddleware.js
const { authenticateToken } = require('../middleware/authMiddleware');

const { createOrUpdateProfile, getProfile } = require('../controllers/ProfileController');

// Ruta para crear o actualizar el perfil (requiere token)
router.post('/', authenticateToken, createOrUpdateProfile);

// Ruta para obtener el perfil del usuario autenticado (requiere token)
router.get('/', authenticateToken, getProfile);

module.exports = router;
