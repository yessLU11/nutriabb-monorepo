const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Database migration runner for Nutriabb MVP
 * This script runs database migrations in order
 */

class MigrationRunner {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'nutriabb',
            password: process.env.DB_PASSWORD || 'password',
            port: process.env.DB_PORT || 5432,
        });
        
        this.migrationsDir = path.join(__dirname, 'migrations');
    }

    /**
     * Get list of migration files
     * @returns {Array} Sorted array of migration filenames
     */
    getMigrationFiles() {
        if (!fs.existsSync(this.migrationsDir)) {
            console.log('No migrations directory found');
            return [];
        }

        return fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
    }

    /**
     * Get executed migrations from database
     * @returns {Array} Array of executed migration names
     */
    async getExecutedMigrations() {
        try {
            // Create migrations table if it doesn't exist
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id SERIAL PRIMARY KEY,
                    migration_name VARCHAR(255) UNIQUE NOT NULL,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            const result = await this.pool.query('SELECT migration_name FROM migrations ORDER BY id');
            return result.rows.map(row => row.migration_name);
        } catch (error) {
            console.error('Error getting executed migrations:', error.message);
            return [];
        }
    }

    /**
     * Execute a single migration
     * @param {string} filename - Migration filename
     */
    async executeMigration(filename) {
        try {
            const filePath = path.join(this.migrationsDir, filename);
            const sql = fs.readFileSync(filePath, 'utf8');
            
            console.log(`Executing migration: ${filename}...`);
            
            // Execute the migration in a transaction
            await this.pool.query('BEGIN');
            await this.pool.query(sql);
            await this.pool.query('COMMIT');
            
            console.log(`✓ Migration ${filename} completed successfully`);
            
        } catch (error) {
            await this.pool.query('ROLLBACK');
            console.error(`✗ Migration ${filename} failed:`, error.message);
            throw error;
        }
    }

    /**
     * Run all pending migrations
     */
    async runMigrations() {
        try {
            console.log('Starting database migrations...\n');

            const migrationFiles = this.getMigrationFiles();
            const executedMigrations = await this.getExecutedMigrations();

            if (migrationFiles.length === 0) {
                console.log('No migration files found');
                return;
            }

            // Filter out already executed migrations
            const pendingMigrations = migrationFiles.filter(file => {
                const migrationName = path.basename(file, '.sql');
                return !executedMigrations.includes(migrationName);
            });

            if (pendingMigrations.length === 0) {
                console.log('All migrations are up to date');
                return;
            }

            console.log(`Found ${pendingMigrations.length} pending migration(s):`);
            pendingMigrations.forEach(file => console.log(`  - ${file}`));
            console.log('');

            // Execute pending migrations
            for (const filename of pendingMigrations) {
                await this.executeMigration(filename);
            }

            console.log('\n🎉 All migrations completed successfully!');

        } catch (error) {
            console.error('\n❌ Migration failed:', error.message);
            process.exit(1);
        } finally {
            await this.pool.end();
        }
    }

    /**
     * Show migration status
     */
    async showStatus() {
        try {
            const migrationFiles = this.getMigrationFiles();
            const executedMigrations = await this.getExecutedMigrations();

            console.log('Migration Status:\n');

            if (migrationFiles.length === 0) {
                console.log('No migration files found');
                return;
            }

            migrationFiles.forEach(file => {
                const migrationName = path.basename(file, '.sql');
                const isExecuted = executedMigrations.includes(migrationName);
                const status = isExecuted ? '✓ Executed' : '○ Pending';
                console.log(`${status} ${file}`);
            });

        } catch (error) {
            console.error('Error showing migration status:', error.message);
        } finally {
            await this.pool.end();
        }
    }
}

// CLI interface
if (require.main === module) {
    const runner = new MigrationRunner();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'up':
        case 'migrate':
            runner.runMigrations();
            break;
        case 'status':
            runner.showStatus();
            break;
        default:
            console.log('Usage:');
            console.log('  node migrate.js up      - Run pending migrations');
            console.log('  node migrate.js status  - Show migration status');
            process.exit(1);
    }
}

module.exports = MigrationRunner;