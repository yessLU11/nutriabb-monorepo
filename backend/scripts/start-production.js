#!/usr/bin/env node

/**
 * Production startup script for Nutriabb MVP
 * This script performs pre-flight checks before starting the server
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

class ProductionStarter {
    constructor() {
        // Load environment variables
        require('dotenv').config();
        
        this.requiredEnvVars = [
            'DB_HOST',
            'DB_PORT', 
            'DB_NAME',
            'DB_USER',
            'DB_PASSWORD',
            'JWT_SECRET'
        ];
    }

    /**
     * Print colored output to console
     */
    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m',   // Red
            reset: '\x1b[0m'     // Reset
        };

        const timestamp = new Date().toISOString();
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    /**
     * Check if all required environment variables are set
     */
    checkEnvironmentVariables() {
        this.log('Checking environment variables...', 'info');
        
        const missing = [];
        
        for (const envVar of this.requiredEnvVars) {
            if (!process.env[envVar]) {
                missing.push(envVar);
            }
        }

        if (missing.length > 0) {
            this.log(`Missing required environment variables: ${missing.join(', ')}`, 'error');
            return false;
        }

        // Check for insecure defaults
        if (process.env.JWT_SECRET === 'your_jwt_secret_key_here' || 
            process.env.JWT_SECRET === 'test_jwt_secret_key_for_testing') {
            this.log('JWT_SECRET is using default value - this is insecure for production!', 'error');
            return false;
        }

        this.log('✓ All environment variables are set', 'success');
        return true;
    }

    /**
     * Test database connection
     */
    async checkDatabaseConnection() {
        this.log('Testing database connection...', 'info');
        
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        try {
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
            await pool.end();
            
            this.log('✓ Database connection successful', 'success');
            return true;
        } catch (error) {
            this.log(`Database connection failed: ${error.message}`, 'error');
            await pool.end();
            return false;
        }
    }

    /**
     * Check if required tables exist
     */
    async checkDatabaseSchema() {
        this.log('Checking database schema...', 'info');
        
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        try {
            const client = await pool.connect();
            
            const result = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users', 'profiles')
            `);
            
            const tables = result.rows.map(row => row.table_name);
            const requiredTables = ['users', 'profiles'];
            const missingTables = requiredTables.filter(table => !tables.includes(table));
            
            client.release();
            await pool.end();
            
            if (missingTables.length > 0) {
                this.log(`Missing required tables: ${missingTables.join(', ')}`, 'error');
                this.log('Run "npm run db:init" to create the database schema', 'info');
                return false;
            }
            
            this.log('✓ Database schema is ready', 'success');
            return true;
        } catch (error) {
            this.log(`Schema check failed: ${error.message}`, 'error');
            await pool.end();
            return false;
        }
    }

    /**
     * Perform all pre-flight checks
     */
    async performPreflightChecks() {
        this.log('Starting pre-flight checks...', 'info');
        
        const checks = [
            () => this.checkEnvironmentVariables(),
            () => this.checkDatabaseConnection(),
            () => this.checkDatabaseSchema()
        ];

        for (const check of checks) {
            const result = await check();
            if (!result) {
                this.log('Pre-flight checks failed!', 'error');
                process.exit(1);
            }
        }

        this.log('✓ All pre-flight checks passed', 'success');
    }

    /**
     * Start the server
     */
    startServer() {
        this.log('Starting Nutriabb MVP server...', 'info');
        
        // Set production environment
        process.env.NODE_ENV = 'production';
        
        // Start the server
        require('../src/server.js');
    }

    /**
     * Main startup process
     */
    async run() {
        try {
            await this.performPreflightChecks();
            this.startServer();
        } catch (error) {
            this.log(`Startup failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const starter = new ProductionStarter();
    starter.run();
}

module.exports = ProductionStarter;