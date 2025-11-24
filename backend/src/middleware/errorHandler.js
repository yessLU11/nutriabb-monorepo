/**
 * Global Error Handler Middleware
 * Provides centralized error handling with logging and consistent API responses
 */

const { AppError } = require('../utils/errors');

/**
 * Error logger utility
 * @param {Error} error - The error to log
 * @param {Object} req - Express request object
 */
const logError = (error, req) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;

  console.error(`[${timestamp}] ERROR: ${error.message}`);
  console.error(`Request: ${method} ${url}`);
  console.error(`User-Agent: ${userAgent}`);
  console.error(`IP: ${ip}`);
  
  if (error.stack && process.env.NODE_ENV !== 'production') {
    console.error(`Stack: ${error.stack}`);
  }
  
  if (error.details) {
    console.error(`Details: ${JSON.stringify(error.details, null, 2)}`);
  }
  
  console.error('---');
};

/**
 * Format error response based on error type
 * @param {Error} error - The error to format
 * @returns {Object} Formatted error response
 */
const formatErrorResponse = (error) => {
  const baseResponse = {
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR'
    },
    timestamp: new Date().toISOString()
  };

  // Add details for validation errors
  if (error.details) {
    baseResponse.error.details = error.details;
  }

  // Don't expose stack traces in production
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    baseResponse.error.stack = error.stack;
  }

  return baseResponse;
};

/**
 * Determine HTTP status code from error
 * @param {Error} error - The error to analyze
 * @returns {number} HTTP status code
 */
const getStatusCode = (error) => {
  // If it's our custom AppError, use its statusCode
  if (error instanceof AppError) {
    return error.statusCode;
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return 400;
  }

  if (error.name === 'UnauthorizedError' || error.message.includes('unauthorized')) {
    return 401;
  }

  if (error.name === 'ForbiddenError' || error.message.includes('forbidden')) {
    return 403;
  }

  if (error.name === 'NotFoundError' || error.message.includes('not found')) {
    return 404;
  }

  if (error.code === '23505') { // PostgreSQL unique violation
    return 409;
  }

  // Default to 500 for unknown errors
  return 500;
};

/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const globalErrorHandler = (err, req, res, next) => {
  // Log the error
  logError(err, req);

  // Determine status code
  const statusCode = getStatusCode(err);

  // Format error response
  const errorResponse = formatErrorResponse(err);

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle 404 errors for unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

module.exports = {
  globalErrorHandler,
  asyncHandler,
  notFoundHandler,
  logError,
  formatErrorResponse
};