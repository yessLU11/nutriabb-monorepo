const express = require('express');
const NutritionController = require('../controllers/NutritionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();
const nutritionController = new NutritionController();

// CALCULATE NUTRITION
router.get(
  '/',
  authenticateToken,
  asyncHandler(nutritionController.calculateNutrition.bind(nutritionController))
);

// ACTIVITY LEVELS
router.get(
  '/activity-levels',
  authenticateToken,
  asyncHandler(nutritionController.getActivityLevels.bind(nutritionController))
);

// MACRO RANGES
router.get(
  '/macro-ranges',
  authenticateToken,
  asyncHandler(nutritionController.getMacroRanges.bind(nutritionController))
);

module.exports = router;
