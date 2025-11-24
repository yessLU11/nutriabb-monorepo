const { Pool } = require('pg');
require('dotenv').config();

// Test database configuration
const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.NODE_ENV === 'test' ? 'nutriabb_test' : process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 5, // Smaller pool for testing
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection handlers
testPool.on('connect', () => {
  console.log('Connected to test PostgreSQL database');
});

testPool.on('error', (err) => {
  console.error('Test database connection error:', err);
});

module.exports = testPool;