# CloudMovie API

Backend Node.js + TypeScript (CommonJS) con Express y Mongoose. Implementa un CRUD básico de usuarios siguiendo una separación por capas (DAO/Controller/Routes) y un endpoint de health.
Además, incluye login por email y password con bcrypt y emisión de JWT stateless, integración con Pexels (explorar catálogo de videos) y control de reproducción (play/pausa/stop) persistiendo estado en MongoDB.

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
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=1h
PEXELS_API_KEY=tu-api-key-de-pexels
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
  routes/movieRoutes.ts  # Rutas de películas (montadas en /api/v1/movies)
  controllers/
    globalController.ts  # Controlador base (create/read/list/update/delete)
    UserController.ts    # Controlador de Usuario (usa el DAO)
    movieController.ts   # Controlador de Películas (explore + CRUD + play/pause/stop)
  dao/
    globalDao.ts         # DAO base (create/read/list/update/delete)
    userDao.ts           # DAO de Usuario (inyecta el modelo de Mongoose)
    movieDao.ts          # DAO de Películas
    playSessionDao.ts    # DAO de sesiones de reproducción
  model/user.ts          # Esquema y modelo de Mongoose para Usuario
  model/movie.ts         # Esquema y modelo de Mongoose para Película
  model/playSession.ts   # Esquema y modelo para sesiones de reproducción
  config/db.ts           # Conexión a MongoDB (dotenv + mongoose)
  services/pexelsService.ts # Cliente simple para Pexels Videos API
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
  - POST `/users/login` → Login con email y password (devuelve user sin password y un JWT)
  - POST `/users/logout` → Logout stateless (el servidor responde 200; el cliente debe borrar el token)
  - POST `/users/forgot-password` → Envía email con link de restablecimiento
  - POST `/users/reset-password` → Cambia la contraseña con email + token

- Películas (montado en `/movies`)
  - GET `/movies/explore` → Explorar catálogo desde Pexels. Query params: `query`, `page`, `per_page`, `popular=true`
  - POST `/movies` → Crea una película en la BD (requiere auth)
  - GET `/movies` → Lista películas guardadas en la BD
  - GET `/movies/:id` → Obtiene película por id
  - PUT `/movies/:id` → Actualiza película (requiere auth)
  - DELETE `/movies/:id` → Elimina película (requiere auth)
  - POST `/movies/:id/play` → Inicia/continúa reproducción (requiere auth). Body: `{ positionSec?: number }`
  - POST `/movies/:id/pause` → Pausa reproducción (requiere auth). Body: `{ positionSec: number }`
  - POST `/movies/:id/stop` → Detiene reproducción (requiere auth)

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

Logout (stateless):
```powershell
curl.exe -X POST http://localhost:4000/api/v1/users/logout ^
  -H "Authorization: Bearer <TU_TOKEN>"
```
Nota: en este flujo, el servidor no mantiene blacklist ni estado de sesión. Para cerrar sesión, el cliente debe eliminar el token (p. ej., borrar del almacenamiento local o limpiar cookies httpOnly).

Explorar catálogo (Pexels):
```powershell
# Populares
curl.exe "http://localhost:4000/api/v1/movies/explore?popular=true"

# Búsqueda
curl.exe "http://localhost:4000/api/v1/movies/explore?query=nature&page=1&per_page=10"
```

Reproducción (requiere token JWT):
```powershell
# Play (posición opcional)
curl.exe -X POST "http://localhost:4000/api/v1/movies/<MOVIE_ID>/play" ^
  -H "Authorization: Bearer <TU_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"positionSec\":30}"

# Pause (requiere posición)
curl.exe -X POST "http://localhost:4000/api/v1/movies/<MOVIE_ID>/pause" ^
  -H "Authorization: Bearer <TU_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"positionSec\":45}"

# Stop
curl.exe -X POST "http://localhost:4000/api/v1/movies/<MOVIE_ID>/stop" ^
  -H "Authorization: Bearer <TU_TOKEN>"
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
MAILTRAP_PORT=2525
MAILTRAP_USER=tu-user-mailtrap
MAILTRAP_PASS=tu-pass-mailtrap
# Opcional TLS en desarrollo (si hay proxy/cert autofirmado):
# MAILTRAP_SECURE=false
# MAILTRAP_TLS_REJECT_UNAUTHORIZED=true

# Opción B: SMTP genérico
# SMTP_HOST=smtp.tu-proveedor.com
# SMTP_PORT=587
# SMTP_USER=usuario
# SMTP_PASS=clave
# SMTP_SECURE=false
# SMTP_TLS_REJECT_UNAUTHORIZED=true

FROM_EMAIL="App <no-reply@tu-dominio.com>"
APP_URL=http://localhost:4000
RESET_TTL_MS=900000
```

## Scripts disponibles
- `npm run dev`: arranca en desarrollo con recarga (tsx + TypeScript)
  - Nota sobre aliases de paths (`@/` y `@server/`): con CommonJS y `tsx`, puede que los aliases no se resuelvan en runtime. Opciones:
    1) Pre-cargar `tsconfig-paths/register` en Windows PowerShell:
       ```powershell
       $env:NODE_OPTIONS="--require tsconfig-paths/register"; npm run dev
       ```
    2) Cambiar imports con alias a rutas relativas (ej. `require('./server/server')`).
    3) Usar una herramienta como `ts-node-dev` con `tsconfig-paths/register` (ya presente en devDependencies).

## Esquema de MongoDB
- Modelo `Movie` → colección `movies` (nombre pluralizado por Mongoose).
- Modelo `PlaySession` → colección `playsessions`.
  - Índice único por `(userId, movieId)` para mantener una sesión por usuario/película.
  - Campos: `status` (`playing|paused|stopped`) y `positionSec` (segundos).

## Siguientes pasos sugeridos
- Ocultar `password` en respuestas (sanitizar salida del DAO/Controller).
- Validar payloads con Zod/Joi (create/update).
- Añadir paginación a `GET /users` (query: `page`, `limit`).
- Tests (unit y de integración con Mongo Memory Server).
- JWT: añade `jsonwebtoken`, `JWT_SECRET` y genera token en `/users/login` si lo necesitas.

---
Si necesitas un ejemplo de colección para Postman con los endpoints preconfigurados, avísame y la agrego.
