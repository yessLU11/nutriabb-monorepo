const ProfileRepository = require('../repositories/ProfileRepository');
const { validateProfile } = require('../models/Profile');
const { 
  ValidationError, 
  NotFoundError, 
  DatabaseError, 
  InternalServerError 
} = require('../utils/errors');

/**
 * ProfileService - Business logic for profile management
 */
class ProfileService {
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  /**
   * Create or update a user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data object
   * @returns {Promise<Object>} - Created or updated profile object
   */
  async createOrUpdateProfile(userId, profileData) {
    try {
      // Validate profile data
      const validatedData = validateProfile(profileData);

      // Check if profile already exists
      const existingProfile = await this.profileRepository.findByUserId(userId);

      let profile;
      if (existingProfile) {
        // Update existing profile
        profile = await this.profileRepository.update(userId, validatedData);
      } else {
        // Create new profile
        profile = await this.profileRepository.create(userId, validatedData);
      }

      return profile;

    } catch (error) {
      // Re-throw known error types
      if (error instanceof ValidationError || 
          error instanceof NotFoundError || 
          error instanceof DatabaseError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Profile operation failed');
    }
  }

  /**
   * Get user profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} - Profile object or null if not found
   */
  async getProfile(userId) {
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      return profile;

    } catch (error) {
      // Re-throw known error types
      if (error instanceof DatabaseError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Failed to retrieve profile');
    }
  }

  /**
   * Check if user has a profile
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if profile exists, false otherwise
   */
  async hasProfile(userId) {
    try {
      return await this.profileRepository.existsByUserId(userId);

    } catch (error) {
      // Re-throw known error types
      if (error instanceof DatabaseError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Failed to check profile existence');
    }
  }

  /**
   * Delete user profile
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if profile was deleted, false if not found
   */
  async deleteProfile(userId) {
    try {
      return await this.profileRepository.deleteByUserId(userId);

    } catch (error) {
      // Re-throw known error types
      if (error instanceof DatabaseError) {
        throw error;
      }

      // Handle unexpected errors
      throw new InternalServerError('Failed to delete profile');
    }
  }

  /**
   * Validate profile data without saving
   * @param {Object} profileData - Profile data object
   * @returns {Object} - Validated profile data
   */
  validateProfileData(profileData) {
    return validateProfile(profileData);
  }
}

module.exports = ProfileService;