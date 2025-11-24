/**
 * Joi Validation Schemas for Nutriabb MVP
 * Comprehensive validation schemas for all API endpoints
 */

const Joi = require('joi');

// Common validation patterns
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  });

const passwordSchema = Joi.string()
  .min(6)
  .max(128)
  .required()
  .messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required'
  });

// Authentication schemas
const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

// Profile schemas
const profileSchema = Joi.object({
  age: Joi.number()
    .integer()
    .min(13)
    .max(120)
    .required()
    .messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be a whole number',
      'number.min': 'Age must be at least 13 years',
      'number.max': 'Age cannot exceed 120 years',
      'any.required': 'Age is required'
    }),
  
  gender: Joi.string()
    .valid('male', 'female')
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
      'number.max': 'Height cannot exceed 250 cm',
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
      'number.max': 'Weight cannot exceed 300 kg',
      'any.required': 'Weight is required'
    }),
  
  activity_level: Joi.string()
    .valid('sedentary', 'light', 'moderate', 'active', 'very_active')
    .required()
    .messages({
      'any.only': 'Activity level must be one of: sedentary, light, moderate, active, very_active',
      'any.required': 'Activity level is required'
    })
});

// Parameter schemas
const userIdParamSchema = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'User ID must be a number',
      'number.integer': 'User ID must be a whole number',
      'number.positive': 'User ID must be positive',
      'any.required': 'User ID is required'
    })
});

// Query parameter schemas
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be a whole number',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

// Export validation schemas organized by endpoint
module.exports = {
  // Authentication endpoints
  auth: {
    register: {
      body: registerSchema
    },
    login: {
      body: loginSchema
    }
  },

  // Profile endpoints
  profile: {
    create: {
      body: profileSchema
    },
    update: {
      body: profileSchema
    },
    getById: {
      params: userIdParamSchema
    }
  },

  // Nutrition calculator endpoints
  nutrition: {
    calculate: {
      // No additional validation needed - uses authenticated user's profile
    }
  },

  // Common schemas for reuse
  common: {
    pagination: paginationSchema,
    userId: userIdParamSchema
  },

  // Individual field schemas for custom validation
  fields: {
    email: emailSchema,
    password: passwordSchema
  }
};