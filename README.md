# CloudMovie API

Backend Node.js + TypeScript (CommonJS) con Express y Mongoose. Implementa un CRUD básico de usuarios siguiendo una separación por capas (DAO/Controller/Routes) y un endpoint de health.
Además, incluye login por email y password con bcrypt.

## Requisitos
- Node.js 18+
- npm 8+
- MongoDB en ejecución (local o remoto)

## Configuración
1) Instala dependencias:
```powershell
npm install
```

2) Variables de entorno (crea un archivo `.env` en la raíz):
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/cloudmovie
SALT_ROUNDS=10
```

3) Arranque en desarrollo (watch con tsx):
```powershell
npm run dev
```

Si todo va bien verás en consola: `Server is running on port 4000`.

## Estructura del proyecto
```
src/
  app.ts                 # Punto de entrada (carga .env, DB y arranca servidor)
  server/server.ts       # App de Express (middlewares y montaje de rutas)
  routes/routes.ts       # Router principal (/api/v1)
  routes/userRoutes.ts   # Rutas de usuarios (montadas en /api/v1/users)
  controllers/
    globalController.ts  # Controlador base (create/read/list/update/delete)
    UserController.ts    # Controlador de Usuario (usa el DAO)
  dao/
    globalDao.ts         # DAO base (create/read/list/update/delete)
    userDao.ts           # DAO de Usuario (inyecta el modelo de Mongoose)
  model/user.ts          # Esquema y modelo de Mongoose para Usuario
  config/db.ts           # Conexión a MongoDB (dotenv + mongoose)
```

Patrón usado: DAO + Controller + Routes
- DAO: Acceso a datos (Mongoose Model, sin lógica de negocio).
- Controller: Orquesta peticiones HTTP ↔ DAO, maneja errores/códigos.
- Routes: Define endpoints y enlaza handlers del controller.

## Endpoints
Base URL: `http://localhost:4000/api/v1`

- Health
  - GET `/health` → 200 "api is healthy"

- Usuarios (montado en `/users`)
  - POST `/users` → Crea usuario
  - GET `/users` → Lista usuarios
  - GET `/users/:id` → Obtiene usuario por id
  - PUT `/users/:id` → Actualiza usuario
  - DELETE `/users/:id` → Elimina usuario
  - POST `/users/login` → Login con email y password (devuelve user sin password; puedes añadir JWT)

Notas de validación (según `src/model/user.ts`):
- `firstName` y `lastName`: requeridos, trim y longitud máxima 50.
- `email`: requerido, único, lowercase, trim, validado con regex.
- `password`: requerido, mínimo 8, con mayúscula, número y carácter especial.
  - Se hashea automáticamente con bcrypt en un hook `pre('save')`. Configurable vía `SALT_ROUNDS`.

## Pruebas rápidas (PowerShell)
Crear usuario:
```powershell
curl.exe -X POST http://localhost:4000/api/v1/users ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Ana\",\"lastName\":\"Pérez\",\"email\":\"ana.perez@example.com\",\"password\":\"Segura1!\"}"
```

Listar usuarios:
```powershell
curl.exe http://localhost:4000/api/v1/users
```

Obtener por id:
```powershell
curl.exe http://localhost:4000/api/v1/users/<ID>
```

Actualizar:
```powershell
curl.exe -X PUT http://localhost:4000/api/v1/users/<ID> ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Ana María\"}"
```

Eliminar:
```powershell
curl.exe -X DELETE http://localhost:4000/api/v1/users/<ID>
```

Login:
```powershell
curl.exe -X POST http://localhost:4000/api/v1/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ana.perez@example.com\",\"password\":\"Segura1!\"}"
```

## Recuperación de contraseña

Endpoints nuevos:
- POST `/api/v1/users/forgot-password`
  - body JSON: `{ "email": "ana.perez@example.com" }`
  - respuesta: 200 con mensaje genérico (evita enumeración de usuarios)
- POST `/api/v1/users/reset-password`
  - body JSON: `{ "email": "ana.perez@example.com", "token": "<token del email>", "newPassword": "NuevoPass1!" }`
  - respuesta: 200 si se actualizó la contraseña

Variables de entorno adicionales (.env):
```env
# Email (para recuperación de contraseña)
# Opción A: Mailtrap (recomendado para testing)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=tu-user-mailtrap
MAILTRAP_PASS=tu-pass-mailtrap

# Opción B: SMTP genérico
# SMTP_HOST=smtp.tu-proveedor.com
# SMTP_PORT=587
# SMTP_USER=usuario
# SMTP_PASS=clave
FROM_EMAIL="App <no-reply@tu-dominio.com>"
APP_URL=http://localhost:4000
RESET_TTL_MS=900000
```

## Scripts disponibles
- `npm run dev`: arranca en desarrollo con recarga (tsx + TypeScript)
  - Si usas CommonJS con `require`, los aliases como `@server/server` pueden no resolverse en runtime. En ese caso cambia a rutas relativas (`require('./server/server')`).

## Siguientes pasos sugeridos
- Ocultar `password` en respuestas (sanitizar salida del DAO/Controller).
- Validar payloads con Zod/Joi (create/update).
- Añadir paginación a `GET /users` (query: `page`, `limit`).
- Tests (unit y de integración con Mongo Memory Server).
- JWT: añade `jsonwebtoken`, `JWT_SECRET` y genera token en `/users/login` si lo necesitas.

---
Si necesitas un ejemplo de colección para Postman con los endpoints preconfigurados, avísame y la agrego.
