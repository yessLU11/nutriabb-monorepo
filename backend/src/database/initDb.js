const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Database initialization script for Nutriabb MVP
 * This script creates all necessary tables, constraints, and indexes
 */

class DatabaseInitializer {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'nutriabb',
            password: process.env.DB_PASSWORD || 'password',
            port: process.env.DB_PORT || 5432,
        });
    }

    /**
     * Read SQL file content
     * @param {string} filename - SQL file name
     * @returns {string} SQL content
     */
    readSqlFile(filename) {
        const filePath = path.join(__dirname, filename);
        return fs.readFileSync(filePath, 'utf8');
    }

    /**
     * Execute SQL script
     * @param {string} sql - SQL content to execute
     * @param {string} description - Description of the operation
     */
    async executeSql(sql, description) {
        try {
            console.log(`Executing: ${description}...`);
            await this.pool.query(sql);
            console.log(`✓ ${description} completed successfully`);
        } catch (error) {
            console.error(`✗ Error in ${description}:`, error.message);
            throw error;
        }
    }

    /**
     * Initialize the complete database schema
     */
    async initializeDatabase() {
        try {
            console.log('Starting database initialization...\n');

            // Create schema (tables with constraints)
            const schemaSql = this.readSqlFile('schema.sql');
            await this.executeSql(schemaSql, 'Creating database schema');

            // Create indexes
            const indexesSql = this.readSqlFile('indexes.sql');
            await this.executeSql(indexesSql, 'Creating database indexes');

            console.log('\n🎉 Database initialization completed successfully!');
            
            // Verify tables were created
            await this.verifyTables();

        } catch (error) {
            console.error('\n❌ Database initialization failed:', error.message);
            process.exit(1);
        } finally {
            await this.pool.end();
        }
    }

    /**
     * Verify that all expected tables were created
     */
    async verifyTables() {
        try {
            const result = await this.pool.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            `);

            const expectedTables = ['users', 'profiles', 'glucose_logs', 'ingredients', 'recipes'];
            const createdTables = result.rows.map(row => row.table_name);

            console.log('\nVerifying tables:');
            expectedTables.forEach(table => {
                if (createdTables.includes(table)) {
                    console.log(`✓ Table '${table}' created successfully`);
                } else {
                    console.log(`✗ Table '${table}' not found`);
                }
            });

        } catch (error) {
            console.error('Error verifying tables:', error.message);
        }
    }

    /**
     * Drop all tables (for clean reset)
     */
    async dropAllTables() {
        try {
            console.log('Dropping all tables...');
            
            const dropSql = `
                DROP TABLE IF EXISTS glucose_logs CASCADE;
                DROP TABLE IF EXISTS profiles CASCADE;
                DROP TABLE IF EXISTS recipes CASCADE;
                DROP TABLE IF EXISTS ingredients CASCADE;
                DROP TABLE IF EXISTS users CASCADE;
            `;
            
            await this.executeSql(dropSql, 'Dropping existing tables');
            console.log('✓ All tables dropped successfully');
            
        } catch (error) {
            console.error('Error dropping tables:', error.message);
            throw error;
        }
    }
}

// CLI interface
if (require.main === module) {
    const initializer = new DatabaseInitializer();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'init':
            initializer.initializeDatabase();
            break;
        case 'reset':
            initializer.dropAllTables()
                .then(() => initializer.initializeDatabase());
            break;
        case 'drop':
            initializer.dropAllTables()
                .then(() => process.exit(0));
            break;
        default:
            console.log('Usage:');
            console.log('  node initDb.js init   - Initialize database schema');
            console.log('  node initDb.js reset  - Drop and recreate all tables');
            console.log('  node initDb.js drop   - Drop all tables');
            process.exit(1);
    }
}

module.exports = DatabaseInitializer;