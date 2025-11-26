const NutritionCalculatorService = require('../services/NutritionCalculatorService');
const ProfileService = require('../services/ProfileService'); // no es clase
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError } = require('../utils/errors');

/**
 * NutritionController - Handles nutrition calculation HTTP requests
 */
class NutritionController {
  constructor() {
    this.nutritionCalculatorService = new NutritionCalculatorService();
  }

  /**
   * Calculate nutrition requirements for authenticated user
   * GET /calculate
   */
  calculateNutrition = asyncHandler(async (req, res) => {
    const userId = req.user.user_id;

    // CORRECTO: usar getProfileByUserId
    const profile = await ProfileService.getProfileByUserId(userId);

    if (!profile) {
      throw new NotFoundError(
        'Profile not found. Please create a profile first to get nutrition calculations.'
      );
    }

    // calculate nutrition
    const nutritionResults = this.nutritionCalculatorService.calculateNutrition(profile);

    res.status(200).json({
      message: 'Nutrition calculation completed successfully',
      data: {
        user_id: userId,
        profile: {
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          activity_level: profile.activity_level,
        },
        nutrition: {
          calories: nutritionResults.calories,
          bmr: nutritionResults.bmr,
          macros: {
            carbohydrates: nutritionResults.macros.carbohydrates,
            proteins: nutritionResults.macros.proteins,
            fats: nutritionResults.macros.fats,
            fiber: nutritionResults.macros.fiber,
          },
          percentages: {
            carbohydrates: nutritionResults.percentages.carbohydrates,
            proteins: nutritionResults.percentages.proteins,
            fats: nutritionResults.percentages.fats,
          },
        },
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /calculate/activity-levels
   */
  getActivityLevels = asyncHandler(async (req, res) => {
    const activityMultipliers = this.nutritionCalculatorService.getActivityMultipliers();

    res.status(200).json({
      message: 'Activity levels retrieved successfully',
      data: {
        activity_levels: {
          sedentary: {
            multiplier: activityMultipliers.sedentary,
            description: 'Little or no exercise',
          },
          light: {
            multiplier: activityMultipliers.light,
            description: 'Light exercise/sports 1-3 days/week',
          },
          moderate: {
            multiplier: activityMultipliers.moderate,
            description: 'Moderate exercise/sports 3-5 days/week',
          },
          active: {
            multiplier: activityMultipliers.active,
            description: 'Hard exercise/sports 6-7 days a week',
          },
          very_active: {
            multiplier: activityMultipliers.very_active,
            description: 'Very hard exercise/sports & physical job',
          },
        },
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /calculate/macro-ranges
   */
  getMacroRanges = asyncHandler(async (req, res) => {
    const macroRanges = this.nutritionCalculatorService.getMacroRanges();

    res.status(200).json({
      message: 'Macro ranges retrieved successfully',
      data: {
        macro_ranges: {
          carbohydrates: {
            min_percentage: macroRanges.carbohydrates.min,
            max_percentage: macroRanges.carbohydrates.max,
            description: 'Primary energy source',
          },
          proteins: {
            min_percentage: macroRanges.proteins.min,
            max_percentage: macroRanges.proteins.max,
            description: 'Muscle building and repair',
          },
          fats: {
            min_percentage: macroRanges.fats.min,
            max_percentage: macroRanges.fats.max,
            description: 'Essential fatty acids and hormone production',
          },
        },
        fiber_recommendation: {
          min_grams: 25,
          max_grams: 30,
          description: 'Daily fiber intake recommendation',
        },
      },
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = NutritionController;
