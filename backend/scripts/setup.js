#!/usr/bin/env node

/**
 * Nutriabb MVP Setup Script
 * This script helps set up the development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectSetup {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
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

        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    /**
     * Execute command and handle errors
     */
    exec(command, description) {
        try {
            this.log(`${description}...`, 'info');
            execSync(command, { stdio: 'inherit', cwd: this.projectRoot });
            this.log(`✓ ${description} completed`, 'success');
        } catch (error) {
            this.log(`✗ ${description} failed`, 'error');
            throw error;
        }
    }

    /**
     * Check if .env file exists, if not copy from .env.example
     */
    setupEnvironmentFile() {
        const envPath = path.join(this.projectRoot, '.env');
        const envExamplePath = path.join(this.projectRoot, '.env.example');

        if (!fs.existsSync(envPath)) {
            if (fs.existsSync(envExamplePath)) {
                fs.copyFileSync(envExamplePath, envPath);
                this.log('✓ Created .env file from .env.example', 'success');
                this.log('⚠️  Please update .env with your actual database credentials', 'warning');
            } else {
                this.log('✗ .env.example not found', 'error');
                throw new Error('.env.example file is missing');
            }
        } else {
            this.log('✓ .env file already exists', 'success');
        }
    }

    /**
     * Check if PostgreSQL is running
     */
    checkPostgreSQL() {
        try {
            execSync('psql --version', { stdio: 'pipe' });
            this.log('✓ PostgreSQL is installed', 'success');
        } catch (error) {
            this.log('✗ PostgreSQL not found or not in PATH', 'error');
            this.log('Please install PostgreSQL and ensure it\'s running', 'warning');
            throw error;
        }
    }

    /**
     * Install dependencies
     */
    installDependencies() {
        this.exec('npm install', 'Installing dependencies');
    }

    /**
     * Setup database
     */
    setupDatabase() {
        this.exec('npm run db:setup', 'Setting up database schema');
    }

    /**
     * Run tests to verify setup
     */
    runTests() {
        this.exec('npm test', 'Running tests to verify setup');
    }

    /**
     * Main setup process
     */
    async run() {
        try {
            this.log('🚀 Starting Nutriabb MVP setup...', 'info');
            console.log('');

            // Step 1: Environment file
            this.log('Step 1: Setting up environment configuration', 'info');
            this.setupEnvironmentFile();
            console.log('');

            // Step 2: Check PostgreSQL
            this.log('Step 2: Checking PostgreSQL installation', 'info');
            this.checkPostgreSQL();
            console.log('');

            // Step 3: Install dependencies
            this.log('Step 3: Installing Node.js dependencies', 'info');
            this.installDependencies();
            console.log('');

            // Step 4: Setup database
            this.log('Step 4: Setting up database', 'info');
            this.setupDatabase();
            console.log('');

            // Step 5: Run tests (optional)
            const runTests = process.argv.includes('--with-tests');
            if (runTests) {
                this.log('Step 5: Running tests', 'info');
                this.runTests();
                console.log('');
            }

            // Success message
            this.log('🎉 Setup completed successfully!', 'success');
            console.log('');
            this.log('Next steps:', 'info');
            this.log('1. Update .env with your database credentials', 'info');
            this.log('2. Start development server: npm run dev', 'info');
            this.log('3. Run tests: npm test', 'info');

        } catch (error) {
            this.log('❌ Setup failed!', 'error');
            this.log('Please check the error messages above and try again.', 'error');
            process.exit(1);
        }
    }
}

// CLI interface
if (require.main === module) {
    const setup = new ProjectSetup();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'env':
            setup.setupEnvironmentFile();
            break;
        case 'deps':
            setup.installDependencies();
            break;
        case 'db':
            setup.setupDatabase();
            break;
        case 'test':
            setup.runTests();
            break;
        default:
            setup.run();
    }
}

module.exports = ProjectSetup;