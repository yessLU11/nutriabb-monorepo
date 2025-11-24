# Database Setup - Nutriabb MVP

This directory contains all database-related files for the Nutriabb MVP application.

## Files Structure

```
src/database/
├── README.md              # This file
├── schema.sql             # Complete database schema
├── indexes.sql            # Database indexes for performance
├── init.sql              # Combined initialization script
├── initDb.js             # Node.js database initializer
├── migrate.js            # Migration runner
└── migrations/
    └── 001_initial_schema.sql  # Initial schema migration
```

## Database Schema

The database includes the following tables:

### Core Tables
- **users**: User authentication data (user_id, email, password_hash)
- **profiles**: User personal information for nutrition calculations (age, gender, height, weight, activity_level)

### Future Feature Tables
- **glucose_logs**: For glucose tracking functionality
- **ingredients**: For nutrition data and recipe management
- **recipes**: For recipe management functionality

## Setup Instructions

### Prerequisites
- PostgreSQL installed and running
- Node.js with npm/yarn
- Environment variables configured (see .env.example)

### Environment Variables
Create a `.env` file with the following variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutriabb
DB_USER=postgres
DB_PASSWORD=your_password
```

### Database Initialization

#### Option 1: Using Node.js Script (Recommended)
```bash
# Initialize complete database schema
node src/database/initDb.js init

# Reset database (drop and recreate all tables)
node src/database/initDb.js reset

# Drop all tables
node src/database/initDb.js drop
```

#### Option 2: Using SQL Files Directly
```bash
# Connect to PostgreSQL and run:
psql -U postgres -d nutriabb -f src/database/init.sql
```

#### Option 3: Using Migration System
```bash
# Run all pending migrations
node src/database/migrate.js up

# Check migration status
node src/database/migrate.js status
```

## Database Constraints and Validation

### Users Table
- Email must be unique
- Password hash is required

### Profiles Table
- One profile per user (unique constraint on user_id)
- Age: 1-120 years
- Height: 1-300 cm
- Weight: 1-500 kg
- Gender: 'male' or 'female'
- Activity level: 'sedentary', 'light', 'moderate', 'active', 'very_active'

### Glucose Logs Table
- Glucose level: 1-1000 mg/dL
- Linked to users with cascade delete

### Ingredients Table
- Name must be unique
- All nutritional values must be non-negative

### Recipes Table
- Servings must be positive
- Time values must be non-negative

## Indexes

Performance indexes are created for:
- User email lookups
- Profile queries by user_id
- Glucose log queries by user and date
- Ingredient and recipe name searches
- Date-based queries for all timestamped tables

## Foreign Key Relationships

- `profiles.user_id` → `users.user_id` (CASCADE DELETE)
- `glucose_logs.user_id` → `users.user_id` (CASCADE DELETE)

## Migration System

The migration system allows for versioned database changes:

1. Create new migration files in `migrations/` directory
2. Name them with incrementing numbers: `002_add_new_feature.sql`
3. Run migrations with `node src/database/migrate.js up`

Each migration is tracked in the `migrations` table to prevent duplicate execution.

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running
- Check environment variables
- Ensure database exists: `createdb nutriabb`

### Permission Issues
- Ensure PostgreSQL user has CREATE privileges
- Check database ownership and permissions

### Schema Issues
- Use `initDb.js reset` to completely recreate schema
- Check migration status with `migrate.js status`