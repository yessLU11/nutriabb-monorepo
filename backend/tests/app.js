const express = require('express');
const path = require('path');

// Load test environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.test') });

// Import middleware and routes
const { globalErrorHandler } = require('../src/middleware/errorHandler');
const authRoutes = require('../src/routes/authRoutes');
const profileRoutes = require('../src/routes/profileRoutes');
const nutritionRoutes = require('../src/routes/nutritionRoutes');

// Create Express app for testing
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/calculate', nutritionRoutes);

// Health check endpoint for testing
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;