const path = require('path');
const DatabaseInitializer = require('../src/database/initDb');
const DatabaseCleanup = require('./utils/databaseCleanup');
const pool = require('../src/config/database');

// Load test environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.test') });

// Global test setup
beforeAll(async () => {
  console.log('Setting up test environment...');
  
  // Ensure we're in test mode
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'nutriabb_test';
  
  // Initialize test database
  const initializer = new DatabaseInitializer();
  try {
    console.log('Initializing test database schema...');
    // Try to drop tables, but don't fail if they don't exist
    try {
      await initializer.dropAllTables();
    } catch (dropError) {
      console.log('No existing tables to drop (this is normal for first run)');
    }
    
    await initializer.initializeDatabase();
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}, 30000); // 30 second timeout for database setup

// Global test teardown
afterAll(async () => {
  console.log('Cleaning up test environment...');
  try {
    await DatabaseCleanup.cleanAll();
    await pool.end();
    console.log('Test cleanup complete');
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
});

// Clean up data between tests
afterEach(async () => {
  try {
    await DatabaseCleanup.cleanAll();
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
});