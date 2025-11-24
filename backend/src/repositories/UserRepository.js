const pool = require('../config/database');
const { createUser } = require('../models/User');

/**
 * UserRepository - Data access layer for user operations
 */
class UserRepository {
  
  /**
   * Create a new user in the database
   * @param {string} email - User email
   * @param {string} passwordHash - Hashed password
   * @returns {Promise<Object>} - Created user object
   */
  async create(email, passwordHash) {
    const query = `
      INSERT INTO users (email, password_hash, registration_date)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING user_id, email, password_hash, registration_date
    `;
    
    try {
      const result = await pool.query(query, [email, passwordHash]);
      const userData = result.rows[0];
      return createUser(userData);
    } catch (error) {
      // Handle unique constraint violation for email
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        const duplicateError = new Error('Email already exists');
        duplicateError.code = 'EMAIL_DUPLICATE';
        duplicateError.status = 409;
        throw duplicateError;
      }
      
      // Handle other database errors
      const dbError = new Error('Database error during user creation');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Find a user by email address
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByEmail(email) {
    const query = `
      SELECT user_id, email, password_hash, registration_date
      FROM users
      WHERE email = $1
    `;
    
    try {
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const userData = result.rows[0];
      return createUser(userData);
    } catch (error) {
      const dbError = new Error('Database error during user lookup by email');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Find a user by user ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findById(id) {
    const query = `
      SELECT user_id, email, password_hash, registration_date
      FROM users
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const userData = result.rows[0];
      return createUser(userData);
    } catch (error) {
      const dbError = new Error('Database error during user lookup by ID');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Check if a user exists by email (lightweight check)
   * @param {string} email - User email
   * @returns {Promise<boolean>} - True if user exists, false otherwise
   */
  async existsByEmail(email) {
    const query = `
      SELECT 1 FROM users WHERE email = $1 LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows.length > 0;
    } catch (error) {
      const dbError = new Error('Database error during user existence check');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }
}

module.exports = UserRepository;