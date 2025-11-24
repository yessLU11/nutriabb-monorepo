const ProfileService = require('../services/ProfileService');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError } = require('../utils/errors');

/**
 * ProfileController - Handles profile-related HTTP requests
 */
class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * Create or update user profile
   * POST /profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createOrUpdateProfile = asyncHandler(async (req, res) => {
    // Get user ID from authenticated user (set by auth middleware)
    const userId = req.user.user_id;
    
    // Extract profile data from request body
    const { age, gender, height, weight, activity_level } = req.body;
    
    const profileData = {
      age,
      gender,
      height,
      weight,
      activity_level
    };

    // Check if profile exists before operation
    const existingProfile = await this.profileService.getProfile(userId);
    const isUpdate = existingProfile !== null;

    // Create or update profile through ProfileService
    const profile = await this.profileService.createOrUpdateProfile(userId, profileData);

    // Determine response based on operation type
    const statusCode = isUpdate ? 200 : 201;
    const message = isUpdate ? 'Profile updated successfully' : 'Profile created successfully';

    // Return success response
    res.status(statusCode).json({
      message,
      data: {
        profile: {
          profile_id: profile.profile_id,
          user_id: profile.user_id,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          activity_level: profile.activity_level,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Get user profile
   * GET /profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProfile = asyncHandler(async (req, res) => {
    // Get user ID from authenticated user (set by auth middleware)
    const userId = req.user.user_id;

    // Get profile through ProfileService
    const profile = await this.profileService.getProfile(userId);

    if (!profile) {
      throw new NotFoundError('Profile');
    }

    // Return success response
    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: {
        profile: {
          profile_id: profile.profile_id,
          user_id: profile.user_id,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          activity_level: profile.activity_level,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Delete user profile
   * DELETE /profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteProfile = asyncHandler(async (req, res) => {
    // Get user ID from authenticated user (set by auth middleware)
    const userId = req.user.user_id;

    // Delete profile through ProfileService
    const deleted = await this.profileService.deleteProfile(userId);

    if (!deleted) {
      throw new NotFoundError('Profile');
    }

    // Return success response
    res.status(200).json({
      message: 'Profile deleted successfully',
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Check if user has a profile
   * GET /profile/exists
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  checkProfileExists = asyncHandler(async (req, res) => {
    // Get user ID from authenticated user (set by auth middleware)
    const userId = req.user.user_id;

    // Check if profile exists through ProfileService
    const exists = await this.profileService.hasProfile(userId);

    // Return success response
    res.status(200).json({
      message: 'Profile existence check completed',
      data: {
        exists
      },
      timestamp: new Date().toISOString()
    });
  });


}

module.exports = ProfileController;