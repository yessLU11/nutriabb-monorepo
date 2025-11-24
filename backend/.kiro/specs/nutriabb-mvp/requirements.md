# Requirements Document

## Introduction

Nutriabb es una aplicación MVP de seguimiento nutricional que permite a los usuarios registrarse, crear un perfil con información personal y obtener cálculos personalizados de calorías y macronutrientes basados en la fórmula Mifflin-St Jeor. El sistema incluye autenticación básica, gestión de perfiles de usuario y una calculadora nutricional core que proporciona recomendaciones personalizadas de ingesta calórica y distribución de macronutrientes.

## Requirements

### Requirement 1

**User Story:** Como usuario nuevo, quiero poder registrarme en la aplicación con mi email y contraseña, para poder acceder a las funcionalidades de seguimiento nutricional.

#### Acceptance Criteria

1. WHEN un usuario envía datos de registro válidos THEN el sistema SHALL crear una nueva cuenta de usuario con email único
2. WHEN un usuario intenta registrarse con un email ya existente THEN el sistema SHALL devolver un error de email duplicado
3. WHEN un usuario envía una contraseña THEN el sistema SHALL almacenar un hash seguro de la contraseña
4. WHEN se crea un usuario exitosamente THEN el sistema SHALL almacenar user_id, email, password_hash y registration_date

### Requirement 2

**User Story:** Como usuario registrado, quiero poder iniciar sesión con mi email y contraseña, para acceder a mi cuenta y datos personales.

#### Acceptance Criteria

1. WHEN un usuario envía credenciales válidas THEN el sistema SHALL autenticar al usuario y devolver un token de acceso
2. WHEN un usuario envía credenciales inválidas THEN el sistema SHALL devolver un error de autenticación
3. WHEN un usuario se autentica exitosamente THEN el sistema SHALL generar un token JWT válido

### Requirement 3

**User Story:** Como usuario autenticado, quiero poder crear y actualizar mi perfil con información personal (edad, género, altura, peso, nivel de actividad), para recibir cálculos nutricionales personalizados.

#### Acceptance Criteria

1. WHEN un usuario envía datos de perfil válidos THEN el sistema SHALL guardar o actualizar la información del perfil
2. WHEN un usuario envía datos de perfil THEN el sistema SHALL validar que edad, altura y peso sean valores numéricos positivos
3. WHEN un usuario envía nivel de actividad THEN el sistema SHALL validar que sea uno de los valores permitidos (sedentario, ligero, moderado, activo, muy activo)
4. WHEN se guarda un perfil THEN el sistema SHALL asociarlo correctamente con el user_id del usuario autenticado

### Requirement 4

**User Story:** Como usuario con perfil completo, quiero obtener un cálculo personalizado de mis necesidades calóricas y distribución de macronutrientes, para planificar mi alimentación diaria.

#### Acceptance Criteria

1. WHEN un usuario solicita cálculo nutricional THEN el sistema SHALL calcular TMB usando la fórmula Mifflin-St Jeor
2. WHEN se calcula TMB THEN el sistema SHALL ajustar por nivel de actividad para obtener calorías diarias totales
3. WHEN se calculan calorías diarias THEN el sistema SHALL distribuir macronutrientes: carbohidratos 45-60%, proteínas 10-20%, grasas 20-35%
4. WHEN se calculan macronutrientes THEN el sistema SHALL incluir recomendación de fibra de 25-30g
5. WHEN se completa el cálculo THEN el sistema SHALL devolver calorías objetivo y gramos de carbohidratos, proteínas y grasas

### Requirement 5

**User Story:** Como desarrollador del sistema, quiero una base de datos estructurada con tablas para usuarios, perfiles y datos futuros, para soportar las funcionalidades actuales y futuras expansiones.

#### Acceptance Criteria

1. WHEN se inicializa la base de datos THEN el sistema SHALL crear tabla users con campos user_id, email, password_hash, registration_date
2. WHEN se inicializa la base de datos THEN el sistema SHALL crear tabla profiles relacionada con users
3. WHEN se inicializa la base de datos THEN el sistema SHALL crear tabla glucose_logs para funcionalidades futuras
4. WHEN se inicializa la base de datos THEN el sistema SHALL crear tablas ingredients y recipes con estructura básica
5. WHEN se crean las tablas THEN el sistema SHALL establecer relaciones de clave foránea apropiadas

### Requirement 6

**User Story:** Como cliente de la API, quiero endpoints REST bien definidos para todas las operaciones, para integrar fácilmente con interfaces de usuario.

#### Acceptance Criteria

1. WHEN se implementa la API THEN el sistema SHALL proporcionar endpoint POST /auth/register para crear usuarios
2. WHEN se implementa la API THEN el sistema SHALL proporcionar endpoint POST /auth/login para autenticación
3. WHEN se implementa la API THEN el sistema SHALL proporcionar endpoint POST /profile para guardar/actualizar perfiles
4. WHEN se implementa la API THEN el sistema SHALL proporcionar endpoint GET /calculate para obtener cálculos nutricionales
5. WHEN se accede a endpoints protegidos THEN el sistema SHALL validar tokens de autenticación JWT