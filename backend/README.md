# Nutriabb MVP

Nutriabb MVP es una aplicación backend de seguimiento nutricional que proporciona cálculos personalizados de calorías y macronutrientes basados en la fórmula Mifflin-St Jeor. La aplicación incluye autenticación JWT, gestión de perfiles de usuario y una calculadora nutricional que proporciona recomendaciones personalizadas.

## Características

- ✅ **Autenticación de usuarios** con JWT
- ✅ **Gestión de perfiles** con información personal
- ✅ **Calculadora nutricional** usando fórmula Mifflin-St Jeor
- ✅ **Validación de datos** con Joi
- ✅ **Manejo de errores** centralizado
- ✅ **Base de datos PostgreSQL** con esquema completo
- ✅ **Pruebas de integración** con Jest y Supertest

## Requisitos del Sistema

- **Node.js** (versión 16 o superior)
- **PostgreSQL** (versión 12 o superior)
- **npm** (incluido con Node.js)

## Instalación Rápida

### Opción 1: Setup Automático (Recomendado)

```bash
# Clona el repositorio
git clone <repository-url>
cd nutriabb-mvp

# Ejecuta el setup automático
npm run setup
```

### Opción 2: Setup Manual

```bash
# 1. Instala dependencias
npm install

# 2. Configura variables de entorno
cp .env.example .env
# Edita .env con tus configuraciones

# 3. Configura la base de datos
npm run db:setup

# 4. Ejecuta pruebas (opcional)
npm test
```

## Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

```bash
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutriabb_mvp
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db

# Configuración JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
JWT_EXPIRES_IN=24h

# Configuración Bcrypt
BCRYPT_ROUNDS=12
```

### Base de Datos

La aplicación requiere PostgreSQL. El setup automático creará las tablas necesarias:

- `users` - Información de usuarios registrados
- `profiles` - Perfiles con datos personales
- `glucose_logs` - Logs de glucosa (para futuras funcionalidades)
- `ingredients` - Ingredientes (para futuras funcionalidades)
- `recipes` - Recetas (para futuras funcionalidades)

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Servidor con auto-reload
npm start            # Servidor en modo producción
npm run prod         # Servidor con verificaciones pre-vuelo
```

### Base de Datos
```bash
npm run db:init      # Inicializar esquema de BD
npm run db:reset     # Resetear todas las tablas
npm run db:migrate   # Ejecutar migraciones
npm run setup        # Setup completo del proyecto
```

### Pruebas
```bash
npm test                # Ejecutar todas las pruebas
npm run test:watch      # Pruebas en modo watch
npm run test:integration # Solo pruebas de integración
npm run test:coverage   # Pruebas con cobertura
```

## Estructura del Proyecto

```
nutriabb-mvp/
├── src/
│   ├── config/           # Configuración de la aplicación
│   ├── controllers/      # Controladores REST
│   ├── database/         # Scripts de BD y migraciones
│   ├── middleware/       # Middleware personalizado
│   ├── models/          # Modelos de datos
│   ├── repositories/    # Capa de acceso a datos
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades y helpers
│   ├── validation/      # Esquemas de validación
│   └── server.js        # Punto de entrada
├── tests/
│   ├── integration/     # Pruebas de integración
│   ├── factories/       # Factories para datos de prueba
│   └── utils/           # Utilidades de testing
├── scripts/             # Scripts de setup y utilidades
└── docs/                # Documentación adicional
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Autenticación

#### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "user_id": 1,
    "email": "usuario@ejemplo.com",
    "registration_date": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

### Gestión de Perfiles

#### Crear/Actualizar Perfil
```http
POST /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "activity_level": "moderate"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Perfil guardado exitosamente",
  "profile": {
    "profile_id": 1,
    "user_id": 1,
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activity_level": "moderate",
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

### Calculadora Nutricional

#### Obtener Cálculos Nutricionales
```http
GET /calculate
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Cálculo nutricional completado",
  "nutrition": {
    "calories": 2156,
    "macros": {
      "carbohydrates": 269,
      "proteins": 108,
      "fats": 72,
      "fiber": 27
    },
    "percentages": {
      "carbohydrates": 50,
      "proteins": 20,
      "fats": 30
    }
  }
}
```

### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token faltante o inválido |
| 403 | Forbidden - Acceso denegado |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Email ya registrado |
| 500 | Internal Server Error - Error del servidor |

**Formato de Error:**
```json
{
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Fórmulas Nutricionales

### Tasa Metabólica Basal (TMB) - Mifflin-St Jeor

**Hombres:**
```
TMB = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad_años) + 5
```

**Mujeres:**
```
TMB = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad_años) - 161
```

### Factores de Actividad

| Nivel | Factor | Descripción |
|-------|--------|-------------|
| sedentary | 1.2 | Poco o ningún ejercicio |
| light | 1.375 | Ejercicio ligero 1-3 días/semana |
| moderate | 1.55 | Ejercicio moderado 3-5 días/semana |
| active | 1.725 | Ejercicio intenso 6-7 días/semana |
| very_active | 1.9 | Ejercicio muy intenso, trabajo físico |

### Distribución de Macronutrientes

- **Carbohidratos:** 45-60% de calorías totales (4 kcal/g)
- **Proteínas:** 10-20% de calorías totales (4 kcal/g)
- **Grasas:** 20-35% de calorías totales (9 kcal/g)
- **Fibra:** 25-30g diarios (recomendación fija)

## Pruebas

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Solo pruebas de integración
npm run test:integration

# Con cobertura
npm run test:coverage
```

### Casos de Prueba Incluidos

- ✅ Registro y autenticación de usuarios
- ✅ Gestión de perfiles de usuario
- ✅ Cálculos nutricionales precisos
- ✅ Validación de datos de entrada
- ✅ Manejo de errores y casos edge
- ✅ Autorización y seguridad

## Despliegue

### Producción

```bash
# Verificar configuración
npm run prod

# O usar PM2 (recomendado)
pm2 start ecosystem.config.js
```

### Variables de Entorno para Producción

Asegúrate de configurar:
- `NODE_ENV=production`
- `JWT_SECRET` con una clave segura única
- Credenciales de base de datos de producción
- `BCRYPT_ROUNDS=12` para mayor seguridad

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Documentación Adicional

- 📖 **[Setup Guide](docs/SETUP.md)** - Guía detallada de instalación y configuración
- 🔌 **[API Documentation](docs/API.md)** - Documentación completa de endpoints
- 🗄️ **[Database Schema](docs/DATABASE.md)** - Esquema y estructura de la base de datos
- 🚀 **[Deployment Guide](docs/DEPLOYMENT.md)** - Guía de despliegue para producción

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor abre un issue en el repositorio.

### Recursos Útiles

- **Troubleshooting**: Ver [Setup Guide](docs/SETUP.md#troubleshooting) para problemas comunes
- **API Testing**: Usar [API Documentation](docs/API.md#example-usage-flow) para ejemplos
- **Database Issues**: Consultar [Database Documentation](docs/DATABASE.md#troubleshooting)