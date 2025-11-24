const Joi = require('joi');

/**
 * Profile model interface and validation schemas
 */

// Profile data structure interface (for documentation)
const ProfileInterface = {
  profile_id: 'number',
  user_id: 'number',
  age: 'number',
  gender: 'string', // 'male' | 'female'
  height: 'number', // cm
  weight: 'number', // kg
  activity_level: 'string', // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  created_at: 'Date',
  updated_at: 'Date'
};

// Valid activity levels
const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const GENDERS = ['male', 'female'];

// Validation schema for profile creation/update
const profileSchema = Joi.object({
  age: Joi.number()
    .integer()
    .min(13)
    .max(120)
    .required()
    .messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age must be at least 13 years',
      'number.max': 'Age must be less than 120 years',
      'any.required': 'Age is required'
    }),
  
  gender: Joi.string()
    .valid(...GENDERS)
    .required()
    .messages({
      'any.only': 'Gender must be either "male" or "female"',
      'any.required': 'Gender is required'
    }),
  
  height: Joi.number()
    .precision(2)
    .min(100)
    .max(250)
    .required()
    .messages({
      'number.base': 'Height must be a number',
      'number.min': 'Height must be at least 100 cm',
      'number.max': 'Height must be less than 250 cm',
      'any.required': 'Height is required'
    }),
  
  weight: Joi.number()
    .precision(2)
    .min(30)
    .max(300)
    .required()
    .messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight must be at least 30 kg',
      'number.max': 'Weight must be less than 300 kg',
      'any.required': 'Weight is required'
    }),
  
  activity_level: Joi.string()
    .valid(...ACTIVITY_LEVELS)
    .required()
    .messages({
      'any.only': 'Activity level must be one of: sedentary, light, moderate, active, very_active',
      'any.required': 'Activity level is required'
    })
});

// Profile factory function for creating profile objects
const createProfile = (profileData) => {
  return {
    profile_id: profileData.profile_id,
    user_id: profileData.user_id,
    age: profileData.age,
    gender: profileData.gender,
    height: parseFloat(profileData.height),
    weight: parseFloat(profileData.weight),
    activity_level: profileData.activity_level,
    created_at: profileData.created_at || new Date(),
    updated_at: profileData.updated_at || new Date()
  };
};

// Validation helper function
const validateProfile = (profileData) => {
  const { error, value } = profileSchema.validate(profileData, { abortEarly: false });
  
  if (error) {
    const validationError = new Error('Profile validation failed');
    validationError.code = 'VALIDATION_ERROR';
    validationError.status = 400;
    validationError.details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    throw validationError;
  }
  
  return value;
};

module.exports = {
  ProfileInterface,
  profileSchema,
  createProfile,
  validateProfile,
  ACTIVITY_LEVELS,
  GENDERS
};