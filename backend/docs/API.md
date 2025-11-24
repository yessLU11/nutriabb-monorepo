# Nutriabb MVP - API Documentation

## Overview

La API de Nutriabb MVP proporciona endpoints RESTful para autenticación de usuarios, gestión de perfiles y cálculos nutricionales personalizados. Todos los endpoints protegidos requieren autenticación JWT.

## Base URL

```
http://localhost:3000
```

## Authentication

La API utiliza JWT (JSON Web Tokens) para autenticación. Después del login exitoso, incluye el token en el header `Authorization` de las siguientes requests:

```
Authorization: Bearer <your-jwt-token>
```

## Content Type

Todos los endpoints que reciben datos esperan:
```
Content-Type: application/json
```

## Error Handling

Todos los errores siguen el mismo formato de respuesta:

```json
{
  "error": {
    "message": "Descripción legible del error",
    "code": "ERROR_CODE_SPECIFIC",
    "details": {
      "field": "información adicional si aplica"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token faltante, inválido o expirado |
| 403 | Forbidden | Token válido pero sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 500 | Internal Server Error | Error interno del servidor |

## Endpoints

### Authentication Endpoints

#### POST /auth/register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

**Success Response (201):**
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

**Error Responses:**

*400 - Validation Error:*
```json
{
  "error": {
    "message": "Datos de entrada inválidos",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Email es requerido y debe ser válido",
      "password": "Password debe tener al menos 6 caracteres"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

*409 - Email Already Exists:*
```json
{
  "error": {
    "message": "El email ya está registrado",
    "code": "EMAIL_ALREADY_EXISTS"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### POST /auth/login

Autentica un usuario existente y devuelve un JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXN1YXJpb0BlamVtcGxvLmNvbSIsImlhdCI6MTcwNTMxNDYwMCwiZXhwIjoxNzA1NDAxMDAwfQ.signature",
  "user": {
    "user_id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

**Error Responses:**

*400 - Validation Error:*
```json
{
  "error": {
    "message": "Email y password son requeridos",
    "code": "VALIDATION_ERROR"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

*401 - Invalid Credentials:*
```json
{
  "error": {
    "message": "Credenciales inválidas",
    "code": "INVALID_CREDENTIALS"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Profile Management Endpoints

#### POST /profile

Crea o actualiza el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "age": "number (required, 1-120)",
  "gender": "string (required, 'male' or 'female')",
  "height": "number (required, 50-300 cm)",
  "weight": "number (required, 20-500 kg)",
  "activity_level": "string (required, see activity levels below)"
}
```

**Activity Levels:**
- `sedentary` - Poco o ningún ejercicio
- `light` - Ejercicio ligero 1-3 días/semana
- `moderate` - Ejercicio moderado 3-5 días/semana
- `active` - Ejercicio intenso 6-7 días/semana
- `very_active` - Ejercicio muy intenso, trabajo físico

**Success Response (201 for new, 200 for update):**
```json
{
  "message": "Perfil guardado exitosamente",
  "profile": {
    "profile_id": 1,
    "user_id": 1,
    "age": 25,
    "gender": "male",
    "height": 175.5,
    "weight": 70.2,
    "activity_level": "moderate",
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**

*400 - Validation Error:*
```json
{
  "error": {
    "message": "Datos de perfil inválidos",
    "code": "VALIDATION_ERROR",
    "details": {
      "age": "Edad debe estar entre 1 y 120 años",
      "gender": "Género debe ser 'male' o 'female'",
      "height": "Altura debe estar entre 50 y 300 cm",
      "weight": "Peso debe estar entre 20 y 500 kg",
      "activity_level": "Nivel de actividad inválido"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

*401 - Unauthorized:*
```json
{
  "error": {
    "message": "Token de acceso requerido",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Nutrition Calculator Endpoints

#### GET /calculate

Calcula las necesidades nutricionales personalizadas basadas en el perfil del usuario.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
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

**Response Fields Explanation:**
- `calories`: Calorías diarias totales (TDEE)
- `macros.carbohydrates`: Gramos de carbohidratos por día
- `macros.proteins`: Gramos de proteínas por día
- `macros.fats`: Gramos de grasas por día
- `macros.fiber`: Gramos de fibra recomendados por día (25-30g)
- `percentages`: Distribución porcentual de macronutrientes

**Error Responses:**

*401 - Unauthorized:*
```json
{
  "error": {
    "message": "Token de acceso requerido",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

*404 - Profile Not Found:*
```json
{
  "error": {
    "message": "Perfil de usuario no encontrado. Crea un perfil primero.",
    "code": "PROFILE_NOT_FOUND"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Calculation Formulas

### Basal Metabolic Rate (BMR) - Mifflin-St Jeor Equation

**For Males:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age_years) + 5
```

**For Females:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age_years) - 161
```

### Total Daily Energy Expenditure (TDEE)

```
TDEE = BMR × Activity Factor
```

**Activity Factors:**
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Macronutrient Distribution

**Carbohydrates (45-60% of total calories):**
```
Carb_grams = (TDEE × carb_percentage) / 4
```

**Proteins (10-20% of total calories):**
```
Protein_grams = (TDEE × protein_percentage) / 4
```

**Fats (20-35% of total calories):**
```
Fat_grams = (TDEE × fat_percentage) / 9
```

**Fiber:**
Fixed recommendation of 25-30g per day (default: 27g)

## Example Usage Flow

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login to get token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create profile
```bash
curl -X POST http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "activity_level": "moderate"
  }'
```

### 4. Get nutrition calculations
```bash
curl -X GET http://localhost:3000/calculate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting to prevent abuse.

## Security Considerations

1. **JWT Tokens**: Tokens expire in 24 hours by default
2. **Password Hashing**: Uses bcrypt with 12 rounds (configurable)
3. **Input Validation**: All inputs are validated using Joi schemas
4. **SQL Injection**: Protected by parameterized queries
5. **CORS**: Configure appropriately for your frontend domain

## Testing

The API includes comprehensive integration tests. Run them with:

```bash
npm test
```

Test coverage includes:
- User registration and authentication
- Profile management
- Nutrition calculations
- Error handling
- Edge cases and validation