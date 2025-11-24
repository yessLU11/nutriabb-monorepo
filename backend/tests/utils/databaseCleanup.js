const pool = require('../../src/config/database');

class DatabaseCleanup {
  /**
   * Clean all test data from database tables
   */
  static async cleanAll() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete in order to respect foreign key constraints
      await client.query('DELETE FROM profiles');
      await client.query('DELETE FROM glucose_logs');
      await client.query('DELETE FROM users');
      await client.query('DELETE FROM recipes');
      await client.query('DELETE FROM ingredients');
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Clean specific table
   */
  static async cleanTable(tableName) {
    await pool.query(`DELETE FROM ${tableName}`);
  }

  /**
   * Reset auto-increment sequences
   */
  static async resetSequences() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Reset sequences for primary keys
      await client.query('ALTER SEQUENCE users_user_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE profiles_profile_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE glucose_logs_log_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE ingredients_ingredient_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE recipes_recipe_id_seq RESTART WITH 1');
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get count of records in a table
   */
  static async getTableCount(tableName) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return parseInt(result.rows[0].count);
  }

  /**
   * Verify database is clean
   */
  static async verifyClean() {
    const tables = ['users', 'profiles', 'glucose_logs', 'ingredients', 'recipes'];
    const counts = {};
    
    for (const table of tables) {
      counts[table] = await this.getTableCount(table);
    }
    
    return counts;
  }
}

module.exports = DatabaseCleanup;