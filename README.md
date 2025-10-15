# CloudMovie API

Backend Node.js + TypeScript (CommonJS) con Express y Mongoose. Implementa un CRUD básico de usuarios siguiendo una separación por capas (DAO/Controller/Routes) y un endpoint de health.

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

Notas de validación (según `src/model/user.ts`):
- `firstName` y `lastName`: requeridos, trim y longitud máxima 50.
- `email`: requerido, único, lowercase, trim, validado con regex.
- `password`: requerido, mínimo 8, con mayúscula, número y carácter especial.

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

## Scripts disponibles
- `npm run dev`: arranca en desarrollo con recarga (tsx + TypeScript)

## Siguientes pasos sugeridos
- Ocultar `password` en respuestas (sanitizar salida del DAO/Controller).
- Validar payloads con Zod/Joi (create/update).
- Añadir paginación a `GET /users` (query: `page`, `limit`).
- Tests (unit y de integración con Mongo Memory Server).

---
Si necesitas un ejemplo de colección para Postman con los endpoints preconfigurados, avísame y la agrego.
