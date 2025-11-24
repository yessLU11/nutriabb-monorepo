/**
 * NutritionCalculatorService - Business logic for nutrition calculations
 * Implements Mifflin-St Jeor BMR formula and macro distribution calculations
 */
class NutritionCalculatorService {
  constructor() {
    // Activity level multipliers for Total Daily Energy Expenditure (TDEE)
    this.activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise/sports 1-3 days/week
      moderate: 1.55,      // Moderate exercise/sports 3-5 days/week
      active: 1.725,       // Hard exercise/sports 6-7 days a week
      very_active: 1.9     // Very hard exercise/sports & physical job
    };

    // Macro distribution ranges (as percentages)
    this.macroRanges = {
      carbohydrates: { min: 45, max: 60 },  // 45-60%
      proteins: { min: 10, max: 20 },       // 10-20%
      fats: { min: 20, max: 35 }            // 20-35%
    };

    // Default macro distribution (middle of ranges)
    this.defaultMacroDistribution = {
      carbohydrates: 52.5,  // 52.5% (middle of 45-60%)
      proteins: 15,         // 15% (middle of 10-20%)
      fats: 32.5           // 32.5% (middle of 20-35%)
    };

    // Fiber recommendation range
    this.fiberRecommendation = { min: 25, max: 30 }; // 25-30g
  }

  /**
   * Calculate complete nutrition requirements for a user profile
   * @param {Object} profile - User profile object
   * @returns {Object} - Complete nutrition calculation results
   */
  calculateNutrition(profile) {
    try {
      // Validate profile data
      this._validateProfile(profile);

      // Calculate BMR using Mifflin-St Jeor equation
      const bmr = this.calculateBMR(profile.age, profile.gender, profile.height, profile.weight);

      // Adjust BMR for activity level to get TDEE
      const calories = this.adjustForActivity(bmr, profile.activity_level);

      // Calculate macro distribution
      const macros = this.calculateMacros(calories);

      // Calculate fiber recommendation
      const fiber = this.calculateFiber();

      return {
        calories: Math.round(calories),
        bmr: Math.round(bmr),
        macros: {
          carbohydrates: Math.round(macros.carbohydrates),
          proteins: Math.round(macros.proteins),
          fats: Math.round(macros.fats),
          fiber: fiber
        },
        percentages: {
          carbohydrates: this.defaultMacroDistribution.carbohydrates,
          proteins: this.defaultMacroDistribution.proteins,
          fats: this.defaultMacroDistribution.fats
        }
      };

    } catch (error) {
      // Re-throw validation errors
      if (error.code === 'VALIDATION_ERROR') {
        throw error;
      }

      // Handle unexpected errors
      const serviceError = new Error('Nutrition calculation failed');
      serviceError.code = 'NUTRITION_CALCULATION_ERROR';
      serviceError.status = 500;
      serviceError.originalError = error;
      throw serviceError;
    }
  }

  /**
   * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
   * @param {number} age - Age in years
   * @param {string} gender - Gender ('male' or 'female')
   * @param {number} height - Height in centimeters
   * @param {number} weight - Weight in kilograms
   * @returns {number} - BMR in calories per day
   */
  calculateBMR(age, gender, height, weight) {
    // Mifflin-St Jeor Equation:
    // Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
    // Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161

    const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
    
    if (gender === 'male') {
      return baseBMR + 5;
    } else if (gender === 'female') {
      return baseBMR - 161;
    } else {
      const error = new Error('Invalid gender. Must be "male" or "female"');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }
  }

  /**
   * Adjust BMR for activity level to calculate Total Daily Energy Expenditure (TDEE)
   * @param {number} bmr - Basal Metabolic Rate
   * @param {string} activityLevel - Activity level
   * @returns {number} - Total daily calories needed
   */
  adjustForActivity(bmr, activityLevel) {
    const multiplier = this.activityMultipliers[activityLevel];
    
    if (!multiplier) {
      const error = new Error(`Invalid activity level: ${activityLevel}`);
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    return bmr * multiplier;
  }

  /**
   * Calculate macro distribution in grams based on total calories
   * @param {number} calories - Total daily calories
   * @returns {Object} - Macro distribution in grams
   */
  calculateMacros(calories) {
    // Calculate calories for each macro
    const carbCalories = calories * (this.defaultMacroDistribution.carbohydrates / 100);
    const proteinCalories = calories * (this.defaultMacroDistribution.proteins / 100);
    const fatCalories = calories * (this.defaultMacroDistribution.fats / 100);

    // Convert calories to grams
    // Carbohydrates: 4 calories per gram
    // Proteins: 4 calories per gram
    // Fats: 9 calories per gram
    return {
      carbohydrates: carbCalories / 4,
      proteins: proteinCalories / 4,
      fats: fatCalories / 9
    };
  }

  /**
   * Calculate fiber recommendation
   * @returns {number} - Fiber recommendation in grams (middle of 25-30g range)
   */
  calculateFiber() {
    // Return middle of recommended range (25-30g)
    return Math.round((this.fiberRecommendation.min + this.fiberRecommendation.max) / 2);
  }

  /**
   * Get activity level multipliers
   * @returns {Object} - Activity level multipliers
   */
  getActivityMultipliers() {
    return { ...this.activityMultipliers };
  }

  /**
   * Get macro distribution ranges
   * @returns {Object} - Macro distribution ranges
   */
  getMacroRanges() {
    return { ...this.macroRanges };
  }

  /**
   * Validate profile data for nutrition calculations
   * @param {Object} profile - Profile object
   * @private
   */
  _validateProfile(profile) {
    if (!profile) {
      const error = new Error('Profile is required for nutrition calculations');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    const requiredFields = ['age', 'gender', 'height', 'weight', 'activity_level'];
    const missingFields = requiredFields.filter(field => !profile[field]);

    if (missingFields.length > 0) {
      const error = new Error(`Missing required profile fields: ${missingFields.join(', ')}`);
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Validate numeric fields
    if (profile.age <= 0 || profile.age > 120) {
      const error = new Error('Age must be between 1 and 120 years');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    if (profile.height <= 0 || profile.height > 300) {
      const error = new Error('Height must be between 1 and 300 cm');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    if (profile.weight <= 0 || profile.weight > 500) {
      const error = new Error('Weight must be between 1 and 500 kg');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Validate gender
    if (!['male', 'female'].includes(profile.gender)) {
      const error = new Error('Gender must be "male" or "female"');
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }

    // Validate activity level
    if (!this.activityMultipliers[profile.activity_level]) {
      const error = new Error(`Invalid activity level: ${profile.activity_level}`);
      error.code = 'VALIDATION_ERROR';
      error.status = 400;
      throw error;
    }
  }
}

module.exports = NutritionCalculatorService;