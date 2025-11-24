# Setup Guide

## Quick Start

Para comenzar rápidamente con Nutriabb MVP:

```bash
git clone <repository-url>
cd nutriabb-mvp
npm run setup
npm run dev
```

## Detailed Setup Instructions

### Prerequisites

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (v16 o superior)
   - Descarga desde [nodejs.org](https://nodejs.org/)
   - Verifica la instalación: `node --version`

2. **PostgreSQL** (v12 o superior)
   - **Windows**: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql` o descarga desde el sitio oficial
   - **Ubuntu/Debian**: `sudo apt install postgresql postgresql-contrib`
   - **CentOS/RHEL**: `sudo yum install postgresql-server postgresql-contrib`

3. **Git**
   - Descarga desde [git-scm.com](https://git-scm.com/)
   - Verifica la instalación: `git --version`

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd nutriabb-mvp
```

### Step 2: Install Dependencies

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- **Production**: express, pg, bcrypt, jsonwebtoken, joi, dotenv
- **Development**: jest, supertest, nodemon

### Step 3: Environment Configuration

#### Automatic Setup
```bash
cp .env.example .env
```

#### Manual Configuration
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutriabb_mvp
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgresql

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt_muy_segura_minimo_32_caracteres
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_ROUNDS=12
```

**Importante**: 
- Cambia `DB_PASSWORD` por tu contraseña de PostgreSQL
- Genera una `JWT_SECRET` segura (mínimo 32 caracteres)
- Para producción, usa valores más seguros

### Step 4: Database Setup

#### Option A: Automatic Database Setup
```bash
npm run db:setup
```

#### Option B: Manual Database Setup

1. **Crear la base de datos:**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE nutriabb_mvp;

# Crear usuario (opcional)
CREATE USER nutriabb_user WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE nutriabb_mvp TO nutriabb_user;

# Salir
\q
```

2. **Inicializar esquema:**
```bash
npm run db:init
```

### Step 5: Verify Installation

#### Run Tests
```bash
npm test
```

Deberías ver algo como:
```
✓ Authentication tests
✓ Profile management tests  
✓ Nutrition calculation tests
✓ Error handling tests

Test Suites: 5 passed, 5 total
Tests: 25 passed, 25 total
```

#### Start Development Server
```bash
npm run dev
```

Deberías ver:
```
Server running on port 3000
Database connected successfully
```

### Step 6: Test API Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error

**Error**: `ECONNREFUSED` o `password authentication failed`

**Solutions**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Start PostgreSQL if not running
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS

# Reset password (if needed)
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';
```

#### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

#### 3. Database Does Not Exist

**Error**: `database "nutriabb_mvp" does not exist`

**Solution**:
```bash
# Create database manually
createdb -U postgres nutriabb_mvp

# Or via psql
psql -U postgres -c "CREATE DATABASE nutriabb_mvp;"
```

#### 4. Permission Denied

**Error**: `permission denied for relation users`

**Solution**:
```bash
# Grant permissions
psql -U postgres -d nutriabb_mvp
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

#### 5. JWT Secret Error

**Error**: `JWT_SECRET must be provided`

**Solution**:
- Verifica que el archivo `.env` existe
- Verifica que `JWT_SECRET` está definido en `.env`
- Genera una clave segura: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Environment-Specific Issues

#### Windows

1. **PowerShell Execution Policy**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

2. **Path Issues**:
- Asegúrate de que Node.js y PostgreSQL están en el PATH
- Reinicia la terminal después de instalar

#### macOS

1. **Homebrew PostgreSQL**:
```bash
# If using Homebrew
brew services start postgresql
createdb nutriabb_mvp
```

2. **Permission Issues**:
```bash
sudo chown -R $(whoami) /usr/local/var/postgres
```

#### Linux

1. **PostgreSQL Service**:
```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

2. **Firewall**:
```bash
sudo ufw allow 5432  # PostgreSQL
sudo ufw allow 3000  # Application
```

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Run tests in watch mode (separate terminal)
npm run test:watch

# Check test coverage
npm run test:coverage
```

### Database Operations

```bash
# Reset database (careful!)
npm run db:reset

# Check migration status
npm run db:migrate:status

# Run pending migrations
npm run db:migrate
```

### Code Quality

```bash
# Run all tests
npm test

# Run only integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## IDE Setup

### VS Code Extensions (Recommended)

1. **JavaScript/Node.js**:
   - ES6 String HTML
   - JavaScript (ES6) code snippets
   - Node.js Modules Intellisense

2. **Database**:
   - PostgreSQL
   - SQL Tools

3. **Testing**:
   - Jest
   - Jest Runner

4. **General**:
   - Prettier
   - ESLint
   - GitLens

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "jest.autoRun": "watch",
  "files.exclude": {
    "**/node_modules": true,
    "**/coverage": true
  }
}
```

## Next Steps

### After Setup

1. **Explore the API**:
   - Read `docs/API.md` for detailed endpoint documentation
   - Test endpoints with Postman or curl
   - Review the database schema in `docs/DATABASE.md`

2. **Understand the Architecture**:
   - Review `docs/ARCHITECTURE.md` (if available)
   - Explore the codebase structure
   - Read the requirements and design documents

3. **Development**:
   - Make changes to the code
   - Write tests for new features
   - Follow the existing patterns and conventions

4. **Deployment**:
   - Read `docs/DEPLOYMENT.md` for production deployment
   - Set up CI/CD pipeline (if needed)
   - Configure monitoring and logging

### Learning Resources

1. **Node.js & Express**:
   - [Express.js Guide](https://expressjs.com/en/guide/)
   - [Node.js Documentation](https://nodejs.org/en/docs/)

2. **PostgreSQL**:
   - [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
   - [Node.js PostgreSQL Tutorial](https://node-postgres.com/)

3. **Testing**:
   - [Jest Documentation](https://jestjs.io/docs/getting-started)
   - [Supertest Guide](https://github.com/visionmedia/supertest)

4. **JWT Authentication**:
   - [JWT.io](https://jwt.io/)
   - [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## Support

Si encuentras problemas durante el setup:

1. **Check the logs**: Los errores suelen tener información útil
2. **Review this guide**: Asegúrate de haber seguido todos los pasos
3. **Check the troubleshooting section**: Problemas comunes y soluciones
4. **Search existing issues**: En el repositorio del proyecto
5. **Create an issue**: Si el problema persiste

## Contributing

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request