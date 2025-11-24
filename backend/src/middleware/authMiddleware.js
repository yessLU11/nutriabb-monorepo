const AuthService = require('../services/AuthService');

/**
 * JWT Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Authorization header is required',
          code: 'MISSING_AUTH_HEADER'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check if header follows Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Authorization header must be in format: Bearer <token>',
          code: 'INVALID_AUTH_FORMAT'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Extract token from header
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Token is required',
          code: 'MISSING_TOKEN'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify token and get user
    const authService = new AuthService();
    
    const decoded = require("jsonwebtoken").verify(
      token,
      process.env.JWT_SECRET
    );

    // en lugar de buscar en BD, solo pasa el userId
    req.user = { id: decoded.userId };
    req.token = token;

    next();


  } catch (error) {
    // Handle authentication errors
    let statusCode = 401;
    let errorCode = 'AUTHENTICATION_ERROR';
    let message = 'Authentication failed';

    if (error.code === 'INVALID_TOKEN') {
      message = 'Invalid token';
      errorCode = 'INVALID_TOKEN';
    } else if (error.code === 'TOKEN_EXPIRED') {
      message = 'Token expired';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error.code === 'USER_NOT_FOUND') {
      message = 'User not found';
      errorCode = 'USER_NOT_FOUND';
    } else if (error.status) {
      statusCode = error.status;
      errorCode = error.code;
      message = error.message;
    }

    return res.status(statusCode).json({
      error: {
        message,
        code: errorCode
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      req.user = null;
      return next();
    }

    // Try to verify token
    const authService = new AuthService();
    const user = await authService.verifyToken(token);
    
    req.user = user;
    req.token = token;
    
    next();

  } catch (error) {
    // If token verification fails, continue without authentication
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};