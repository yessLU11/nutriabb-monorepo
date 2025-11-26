console.log("➡️ Cargando authRoutes");


const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const schemas = require('../validation/schemas');

const router = express.Router();
const authController = new AuthController();

// REGISTER
router.post(
  '/register',
  validate(schemas.auth.register),
  asyncHandler(authController.register.bind(authController))
);

// LOGIN
router.post(
  '/login',
  validate(schemas.auth.login),
  asyncHandler(authController.login.bind(authController))
);

// REFRESH TOKEN
router.post(
  '/refresh',
  authenticateToken,
  asyncHandler(authController.refreshToken.bind(authController))
);

// GET CURRENT USER
router.get(
  '/me',
  authenticateToken,
  asyncHandler(authController.getCurrentUser.bind(authController))
);

module.exports = router;
