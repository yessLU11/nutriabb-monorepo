const Joi = require('joi');

/**
 * User model interface and validation schemas
 */

// User data structure interface (for documentation)
const UserInterface = {
  user_id: 'number',
  email: 'string',
  password_hash: 'string',
  registration_date: 'Date'
};

// Validation schema for user registration
const userRegistrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

// Validation schema for user login
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// User factory function for creating user objects
const createUser = (userData) => {
  return {
    user_id: userData.user_id,
    email: userData.email,
    password_hash: userData.password_hash,
    registration_date: userData.registration_date || new Date()
  };
};

module.exports = {
  UserInterface,
  userRegistrationSchema,
  userLoginSchema,
  createUser
};