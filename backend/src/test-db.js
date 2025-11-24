const pool = require('./config/database');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database time:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    pool.end();
  }
}

testConnection();
