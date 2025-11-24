const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const authConfig = require('../config/auth');
const { 
  ValidationError, 
  AuthenticationError, 
  ConflictError, 
  NotFoundError, 
  InternalServerError 
} = require('../utils/errors');

/**
 * AuthService - Business logic for user authentication and management
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} - Created user object (without password hash)
   */
  async register(email, password) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictError('Email already exists');
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Create the user
      const user = await this.userRepository.create(email, passwordHash);

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      // Re-throw known errors
      if (error instanceof ConflictError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Registration failed');
    }
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} - Object containing user and JWT token
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user.user_id);

      // Return user without password hash and token
      const { password_hash, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };

    } catch (error) {
      // Re-throw known errors
      if (error instanceof AuthenticationError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Login failed');
    }
  }

  /**
   * Generate JWT token for user
   * @param {number} userId - User ID
   * @returns {string} - JWT token
   */
  generateToken(userId) {
    try {
      const payload = {
        userId,
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(payload, authConfig.jwt.secret, {
        expiresIn: authConfig.jwt.expiresIn
      });

      return token;
    } catch (error) {
      throw new InternalServerError('Token generation failed');
    }
  }

  /**
   * Verify JWT token and return user
   * @param {string} token - JWT token
   * @returns {Promise<Object>} - User object (without password hash)
   */
  async verifyToken(token) {
    try {
      // Verify and decode token
      const decoded = jwt.verify(token, authConfig.jwt.secret);
      
      // Find user by ID from token
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      // Handle JWT errors
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      }

      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }

      // Re-throw known errors
      if (error instanceof AuthenticationError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Token verification failed');
    }
  }

  /**
   * Refresh JWT token for authenticated user
   * @param {string} token - Current JWT token
   * @returns {Promise<Object>} - Object containing user and new JWT token
   */
  async refreshToken(token) {
    try {
      // Verify current token and get user
      const user = await this.verifyToken(token);
      
      // Generate new token
      const newToken = this.generateToken(user.user_id);

      return {
        user,
        token: newToken
      };

    } catch (error) {
      // Re-throw verification errors
      throw error;
    }
  }
}

module.exports = AuthService;