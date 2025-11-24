const pool = require('../config/database');
const { createProfile } = require('../models/Profile');

/**
 * ProfileRepository - Data access layer for profile operations
 */
class ProfileRepository {
  
  /**
   * Create a new profile in the database
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data object
   * @returns {Promise<Object>} - Created profile object
   */
  async create(userId, profileData) {
    const query = `
      INSERT INTO profiles (user_id, age, gender, height, weight, activity_level, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING profile_id, user_id, age, gender, height, weight, activity_level, created_at, updated_at
    `;
    
    try {
      const result = await pool.query(query, [
        userId,
        profileData.age,
        profileData.gender,
        profileData.height,
        profileData.weight,
        profileData.activity_level
      ]);
      
      const profile = result.rows[0];
      return createProfile(profile);
    } catch (error) {
      // Handle foreign key constraint violation
      if (error.code === '23503' && error.constraint === 'profiles_user_id_fkey') {
        const fkError = new Error('User not found');
        fkError.code = 'USER_NOT_FOUND';
        fkError.status = 404;
        throw fkError;
      }
      
      // Handle unique constraint violation (if user already has a profile)
      if (error.code === '23505') {
        const duplicateError = new Error('Profile already exists for this user');
        duplicateError.code = 'PROFILE_DUPLICATE';
        duplicateError.status = 409;
        throw duplicateError;
      }
      
      // Handle other database errors
      const dbError = new Error('Database error during profile creation');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Update an existing profile in the database
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data object
   * @returns {Promise<Object>} - Updated profile object
   */
  async update(userId, profileData) {
    const query = `
      UPDATE profiles 
      SET age = $2, gender = $3, height = $4, weight = $5, activity_level = $6, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING profile_id, user_id, age, gender, height, weight, activity_level, created_at, updated_at
    `;
    
    try {
      const result = await pool.query(query, [
        userId,
        profileData.age,
        profileData.gender,
        profileData.height,
        profileData.weight,
        profileData.activity_level
      ]);
      
      if (result.rows.length === 0) {
        const notFoundError = new Error('Profile not found for this user');
        notFoundError.code = 'PROFILE_NOT_FOUND';
        notFoundError.status = 404;
        throw notFoundError;
      }
      
      const profile = result.rows[0];
      return createProfile(profile);
    } catch (error) {
      // Re-throw our custom errors
      if (error.code === 'PROFILE_NOT_FOUND') {
        throw error;
      }
      
      // Handle other database errors
      const dbError = new Error('Database error during profile update');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Find a profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} - Profile object or null if not found
   */
  async findByUserId(userId) {
    const query = `
      SELECT profile_id, user_id, age, gender, height, weight, activity_level, created_at, updated_at
      FROM profiles
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const profile = result.rows[0];
      return createProfile(profile);
    } catch (error) {
      const dbError = new Error('Database error during profile lookup');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Check if a profile exists for a user
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if profile exists, false otherwise
   */
  async existsByUserId(userId) {
    const query = `
      SELECT 1 FROM profiles WHERE user_id = $1 LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows.length > 0;
    } catch (error) {
      const dbError = new Error('Database error during profile existence check');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }

  /**
   * Delete a profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if profile was deleted, false if not found
   */
  async deleteByUserId(userId) {
    const query = `
      DELETE FROM profiles WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rowCount > 0;
    } catch (error) {
      const dbError = new Error('Database error during profile deletion');
      dbError.code = 'DATABASE_ERROR';
      dbError.status = 500;
      dbError.originalError = error;
      throw dbError;
    }
  }
}

module.exports = ProfileRepository;