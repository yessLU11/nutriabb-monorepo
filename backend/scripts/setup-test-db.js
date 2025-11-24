const { Client } = require('pg');
require('dotenv').config();

async function setupTestDatabase() {
  // Connect to PostgreSQL server (not to a specific database)
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if test database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'nutriabb_test'
    `;
    
    const result = await client.query(checkDbQuery);
    
    if (result.rows.length === 0) {
      // Create test database
      console.log('Creating test database...');
      await client.query('CREATE DATABASE nutriabb_test');
      console.log('✓ Test database "nutriabb_test" created successfully');
    } else {
      console.log('✓ Test database "nutriabb_test" already exists');
    }

  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupTestDatabase();
}

module.exports = setupTestDatabase;