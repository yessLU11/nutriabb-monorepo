const AuthService = require('../services/AuthService');
const { asyncHandler } = require('../middleware/errorHandler');
const { AuthenticationError } = require('../utils/errors');

/**
 * AuthController - Handles authentication-related HTTP requests
 */
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * POST /auth/register
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Register user through AuthService
    const user = await this.authService.register(email, password);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          registration_date: user.registration_date
        }
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Authenticate user login
   * POST /auth/login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user through AuthService
    const result = await this.authService.login(email, password);

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          user_id: result.user.user_id,
          email: result.user.email,
          registration_date: result.user.registration_date
        },
        token: result.token
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Refresh JWT token
   * POST /auth/refresh
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  refreshToken = asyncHandler(async (req, res) => {
    // Token is available from auth middleware
    const currentToken = req.token;

    if (!currentToken) {
      const error = new AuthenticationError('Token is required for refresh');
      throw error;
    }

    // Refresh token through AuthService
    const result = await this.authService.refreshToken(currentToken);

    // Return success response with new token
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        user: {
          user_id: result.user.user_id,
          email: result.user.email,
          registration_date: result.user.registration_date
        },
        token: result.token
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Get current user profile
   * GET /auth/me
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    // User is available from auth middleware
    const user = req.user;

    res.status(200).json({
      message: 'User profile retrieved successfully',
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          registration_date: user.registration_date
        }
      },
      timestamp: new Date().toISOString()
    });
  });


}

module.exports = AuthController;