# Database Schema Documentation

## Overview

Nutriabb MVP utiliza PostgreSQL como base de datos principal. El esquema está diseñado para soportar las funcionalidades actuales del MVP y permitir expansiones futuras.

## Database Configuration

### Connection Settings
```javascript
{
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nutriabb_mvp',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}
```

### Environment Variables
- `DB_HOST`: Hostname del servidor PostgreSQL
- `DB_PORT`: Puerto del servidor PostgreSQL (default: 5432)
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña del usuario

## Tables

### users

Almacena información básica de usuarios registrados.

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `user_id` (SERIAL, PRIMARY KEY): Identificador único del usuario
- `email` (VARCHAR(255), UNIQUE, NOT NULL): Email del usuario (usado para login)
- `password_hash` (VARCHAR(255), NOT NULL): Hash bcrypt de la contraseña
- `registration_date` (TIMESTAMP): Fecha y hora de registro

**Indexes:**
- Primary key en `user_id`
- Unique index en `email`

**Constraints:**
- Email debe ser único
- Email no puede ser NULL
- Password hash no puede ser NULL

### profiles

Almacena información personal de los usuarios para cálculos nutricionales.

```sql
CREATE TABLE profiles (
  profile_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `profile_id` (SERIAL, PRIMARY KEY): Identificador único del perfil
- `user_id` (INTEGER, FOREIGN KEY): Referencia al usuario propietario
- `age` (INTEGER, NOT NULL): Edad en años
- `gender` (VARCHAR(10), NOT NULL): Género ('male' o 'female')
- `height` (DECIMAL(5,2), NOT NULL): Altura en centímetros
- `weight` (DECIMAL(5,2), NOT NULL): Peso en kilogramos
- `activity_level` (VARCHAR(20), NOT NULL): Nivel de actividad física
- `created_at` (TIMESTAMP): Fecha de creación del perfil
- `updated_at` (TIMESTAMP): Fecha de última actualización

**Indexes:**
- Primary key en `profile_id`
- Index en `user_id` para búsquedas rápidas

**Constraints:**
- Foreign key a `users.user_id` con CASCADE DELETE
- Gender debe ser 'male' o 'female'
- Activity level debe ser uno de los valores permitidos
- Todos los campos son NOT NULL excepto timestamps

**Activity Levels:**
- `sedentary`: Poco o ningún ejercicio
- `light`: Ejercicio ligero 1-3 días/semana
- `moderate`: Ejercicio moderado 3-5 días/semana
- `active`: Ejercicio intenso 6-7 días/semana
- `very_active`: Ejercicio muy intenso, trabajo físico

### glucose_logs (Future Use)

Tabla preparada para funcionalidades futuras de seguimiento de glucosa.

```sql
CREATE TABLE glucose_logs (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  glucose_level DECIMAL(5,2),
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `log_id` (SERIAL, PRIMARY KEY): Identificador único del log
- `user_id` (INTEGER, FOREIGN KEY): Referencia al usuario
- `glucose_level` (DECIMAL(5,2)): Nivel de glucosa medido
- `measured_at` (TIMESTAMP): Fecha y hora de la medición

### ingredients (Future Use)

Tabla preparada para funcionalidades futuras de ingredientes.

```sql
CREATE TABLE ingredients (
  ingredient_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories_per_100g DECIMAL(6,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `ingredient_id` (SERIAL, PRIMARY KEY): Identificador único del ingrediente
- `name` (VARCHAR(255), NOT NULL): Nombre del ingrediente
- `calories_per_100g` (DECIMAL(6,2)): Calorías por 100 gramos
- `created_at` (TIMESTAMP): Fecha de creación

### recipes (Future Use)

Tabla preparada para funcionalidades futuras de recetas.

```sql
CREATE TABLE recipes (
  recipe_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `recipe_id` (SERIAL, PRIMARY KEY): Identificador único de la receta
- `name` (VARCHAR(255), NOT NULL): Nombre de la receta
- `description` (TEXT): Descripción de la receta
- `created_at` (TIMESTAMP): Fecha de creación

## Relationships

### Entity Relationship Diagram

```
users (1) ----< profiles (*)
  |
  |----< glucose_logs (*)

ingredients (*) ----< recipe_ingredients (future) >---- recipes (*)
```

### Current Relationships

1. **users → profiles**: One-to-Many
   - Un usuario puede tener múltiples perfiles (histórico)
   - Actualmente se usa solo el más reciente
   - CASCADE DELETE: Si se elimina un usuario, se eliminan sus perfiles

2. **users → glucose_logs**: One-to-Many (Future)
   - Un usuario puede tener múltiples logs de glucosa
   - CASCADE DELETE: Si se elimina un usuario, se eliminan sus logs

## Indexes

### Current Indexes

```sql
-- Primary keys (automatic)
CREATE UNIQUE INDEX users_pkey ON users(user_id);
CREATE UNIQUE INDEX profiles_pkey ON profiles(profile_id);
CREATE UNIQUE INDEX glucose_logs_pkey ON glucose_logs(log_id);
CREATE UNIQUE INDEX ingredients_pkey ON ingredients(ingredient_id);
CREATE UNIQUE INDEX recipes_pkey ON recipes(recipe_id);

-- Unique constraints
CREATE UNIQUE INDEX users_email_key ON users(email);

-- Foreign key indexes (for performance)
CREATE INDEX profiles_user_id_idx ON profiles(user_id);
CREATE INDEX glucose_logs_user_id_idx ON glucose_logs(user_id);
```

### Performance Considerations

- **Email lookups**: Unique index en `users.email` para login rápido
- **Profile lookups**: Index en `profiles.user_id` para búsquedas por usuario
- **Glucose logs**: Index en `glucose_logs.user_id` para consultas por usuario

## Data Validation

### Application Level (Joi Schemas)

```javascript
// User validation
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Profile validation
const profileSchema = Joi.object({
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string().valid('male', 'female').required(),
  height: Joi.number().min(50).max(300).required(),
  weight: Joi.number().min(20).max(500).required(),
  activity_level: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active').required()
});
```

### Database Level (Constraints)

- **NOT NULL constraints**: Campos obligatorios
- **CHECK constraints**: Validación de valores permitidos
- **UNIQUE constraints**: Prevención de duplicados
- **FOREIGN KEY constraints**: Integridad referencial

## Migration Strategy

### Current Approach

1. **Initial Schema**: Creado via `src/database/schema.sql`
2. **Future Migrations**: Via `src/database/migrate.js`
3. **Migration Tracking**: Tabla `migrations` para control de versiones

### Migration Files Structure

```
src/database/migrations/
├── 001_initial_schema.sql
├── 002_add_indexes.sql
└── 003_future_migration.sql
```

### Running Migrations

```bash
# Check migration status
npm run db:migrate:status

# Run pending migrations
npm run db:migrate

# Initialize fresh database
npm run db:init
```

## Backup and Recovery

### Backup Commands

```bash
# Full database backup
pg_dump -h localhost -U postgres -d nutriabb_mvp > backup.sql

# Schema only
pg_dump -h localhost -U postgres -d nutriabb_mvp --schema-only > schema.sql

# Data only
pg_dump -h localhost -U postgres -d nutriabb_mvp --data-only > data.sql
```

### Recovery Commands

```bash
# Restore full backup
psql -h localhost -U postgres -d nutriabb_mvp < backup.sql

# Restore schema
psql -h localhost -U postgres -d nutriabb_mvp < schema.sql
```

## Security Considerations

### Password Security
- Passwords nunca se almacenan en texto plano
- Se usa bcrypt con 12 rounds (configurable)
- Salt automático por bcrypt

### SQL Injection Prevention
- Todas las queries usan parámetros preparados
- No se construyen queries con concatenación de strings
- Validación de entrada en capa de aplicación

### Access Control
- Conexiones autenticadas a la base de datos
- Principio de menor privilegio para usuarios de BD
- Separación de credenciales por ambiente

## Performance Optimization

### Query Optimization
- Indexes en columnas de búsqueda frecuente
- Foreign key indexes para JOINs eficientes
- EXPLAIN ANALYZE para análisis de queries

### Connection Pooling
```javascript
const pool = new Pool({
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Monitoring Queries
- Log de queries lentas
- Monitoreo de conexiones activas
- Análisis de uso de indexes

## Testing Database

### Test Environment
- Base de datos separada: `nutriabb_test`
- Configuración en `.env.test`
- Setup automático antes de pruebas

### Test Data Management
```javascript
// Factory functions para datos de prueba
const createTestUser = async () => {
  return await userRepository.create('test@example.com', hashedPassword);
};

// Cleanup después de pruebas
afterEach(async () => {
  await cleanupTestData();
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verificar que PostgreSQL esté corriendo
   - Verificar credenciales en .env
   - Verificar firewall/network

2. **Permission Denied**
   - Verificar permisos del usuario de BD
   - Verificar que la BD existe
   - Verificar configuración de pg_hba.conf

3. **Table Does Not Exist**
   - Ejecutar `npm run db:init`
   - Verificar migraciones pendientes
   - Verificar conexión a BD correcta

### Diagnostic Commands

```bash
# Test database connection
psql -h localhost -U postgres -d nutriabb_mvp -c "SELECT 1;"

# List tables
psql -h localhost -U postgres -d nutriabb_mvp -c "\dt"

# Check table structure
psql -h localhost -U postgres -d nutriabb_mvp -c "\d users"
```