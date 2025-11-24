const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const schemas = require('../validation/schemas');

const router = express.Router();
const profileController = new ProfileController();

// CREATE / UPDATE PROFILE
router.post(
  '/',
  authenticateToken,
  validate(schemas.profile.create),
  asyncHandler(profileController.createOrUpdateProfile.bind(profileController))
);

// GET PROFILE
router.get(
  '/',
  authenticateToken,
  asyncHandler(profileController.getProfile.bind(profileController))
);

// DELETE PROFILE
router.delete(
  '/',
  authenticateToken,
  asyncHandler(profileController.deleteProfile.bind(profileController))
);

// CHECK PROFILE EXISTS
router.get(
  '/exists',
  authenticateToken,
  asyncHandler(profileController.checkProfileExists.bind(profileController))
);

module.exports = router;
