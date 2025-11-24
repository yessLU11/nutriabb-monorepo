/**
 * Validation Middleware using Joi schemas
 * Provides request validation for different parts of the request (body, params, query)
 */

const { ValidationError } = require('../utils/errors');

/**
 * Create validation middleware for request body
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown properties
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      const validationError = new ValidationError('Request body validation failed', validationErrors);
      return next(validationError);
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Create validation middleware for request parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      const validationError = new ValidationError('Request parameters validation failed', validationErrors);
      return next(validationError);
    }

    req.params = value;
    next();
  };
};

/**
 * Create validation middleware for query parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      const validationError = new ValidationError('Query parameters validation failed', validationErrors);
      return next(validationError);
    }

    req.query = value;
    next();
  };
};

/**
 * Generic validation middleware that can validate any part of the request
 * @param {Object} schemas - Object containing validation schemas for different parts
 * @param {Object} schemas.body - Joi schema for request body
 * @param {Object} schemas.params - Joi schema for request parameters
 * @param {Object} schemas.query - Joi schema for query parameters
 * @returns {Function} - Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body if schema provided
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map(detail => ({
          location: 'body',
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        })));
      } else {
        req.body = value;
      }
    }

    // Validate params if schema provided
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map(detail => ({
          location: 'params',
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        })));
      } else {
        req.params = value;
      }
    }

    // Validate query if schema provided
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map(detail => ({
          location: 'query',
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        })));
      } else {
        req.query = value;
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      const validationError = new ValidationError('Request validation failed', errors);
      return next(validationError);
    }

    next();
  };
};

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
  validate
};