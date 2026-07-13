# Historia de Usuario - COMPLETADA ✅

## Filtrado Seguro de Menús por JWT

**Como** usuario autenticado de MenuMaster,

**Quiero** que el backend me devuelva únicamente mis propios menús al consultar el endpoint **GET /api/menus**,

**Para** que la información de otros negocios no quede expuesta en las respuestas de la API.

---

## Estado: ✅ COMPLETADA

### Branch
- **Nombre:** `fix/secure-menu-filtering-jwt`
- **Commit:** `460fad5`
- **Base:** `feat/replace-logo-with-image`

---

## Cambios Implementados

### 1. Autenticación JWT (Middleware)
✅ Creado middleware `verifyJWT` que:
- Valida tokens JWT de los headers
- Decodifica información del usuario
- Protege endpoints sensibles

### 2. Endpoint GET /api/menus (PROTEGIDO)
✅ **CA-01 - Filtrado por JWT:**
- Obtiene user_id exclusivamente de `req.usuario.id`
- Retorna solo menús del usuario autenticado
- Require JWT válido

✅ **CA-02 - Eliminación del parámetro inseguro:**
- Ignora completamente parámetro `user_id` del cliente
- Imposible consultar menús de otros usuarios
- Fortalece seguridad

### 3. Endpoints Protegidos
✅ GET `/api/menus` - Listado seguro
✅ GET `/api/menus/:id` - Obtener menú con validación de propiedad
✅ POST `/api/menus` - Crear menú con usuario autenticado
✅ PUT `/api/menus/:id` - Actualizar solo menús propios
✅ DELETE `/api/menus/:id` - Eliminar solo menús propios

### 4. Login Mejorado
✅ Genera JWT válido con `expiresIn: "24h"`
✅ Token contiene: `id`, `nombre`, `email`
✅ Formato estándar: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Validación de Propiedad
✅ Verifica que menú pertenece al usuario autenticado
✅ Retorna 403 (Forbidden) si intenta acceder a menú ajeno
✅ Previene manipulación de IDs

---

## Criterios de Aceptación

| Criterio | Estado | Descripción |
|----------|--------|-------------|
| CA-01 | ✅ | Endpoint filtra por `req.usuario.id` del JWT |
| CA-02 | ✅ | Parámetro `user_id` es ignorado completamente |

---

## Reglas de Negocio

| Regla | Estado | Implementación |
|-------|--------|----------------|
| RN-01 | ✅ | Usuario se obtiene exclusivamente del JWT |
| RN-02 | ✅ | Backend no confía en parámetros del cliente |
| RN-03 | ✅ | Cada usuario solo ve sus propios menús |
| RN-04 | ✅ | Todos los endpoints requieren JWT válido |
| RN-05 | ✅ | Token inválido retorna error 401 |

---

## Archivos Modificados

```
menu-back/
├── index.js                    ✅ Actualizado con JWT y endpoints seguros
├── package.json               ✅ Agregada dependencia jsonwebtoken
├── .env.example               ✅ Agregada variable JWT_SECRET
└── SECURITY_CHANGES.md        ✅ Documentación de cambios
```

---

## Instalación y Uso

### 1. Instalar dependencias
```bash
cd menu-back
npm install
```

### 2. Configurar variables de entorno
```bash
# Crear archivo .env con:
JWT_SECRET=your_secret_key_change_in_production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root1234
DB_NAME=menumaster
DB_PORT=3306
PORT=4000
```

### 3. Iniciar servidor
```bash
npm start
```

---

## Ejemplos de Uso

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Respuesta:
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nombre": "Juan", "email": "user@example.com" }
}
```

### Obtener menús del usuario autenticado
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:4000/api/menus

# Respuesta:
{
  "ok": true,
  "total": 3,
  "menus": [
    { "id": 1, "nombre": "Menú Principal", "estado": "Activo", "user_id": 1 },
    { "id": 2, "nombre": "Promociones", "estado": "Borrador", "user_id": 1 }
  ]
}
```

### Crear menú (user_id automático)
```bash
curl -X POST http://localhost:4000/api/menus \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo Menú"}'

# Respuesta:
{
  "ok": true,
  "mensaje": "Menú creado correctamente",
  "menuId": 42
}
```

---

## Pruebas de Seguridad Realizadas

✅ **Acceso sin JWT:** Retorna error 401
```bash
curl http://localhost:4000/api/menus
# 401: Token no proporcionado
```

✅ **Intento de consultar menús de otro usuario:** Ignorado
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:4000/api/menus?user_id=999"
# Retorna menús del usuario autenticado, no del 999
```

✅ **Intento de actualizar menú ajeno:** Rechazado con 403
```bash
curl -X PUT http://localhost:4000/api/menus/999 \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre":"Hacked"}'
# 403: No tienes permiso para actualizar este menú
```

✅ **JWT inválido:** Retorna error 401
```bash
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:4000/api/menus
# 401: Token inválido o expirado
```

---

## Métricas de la Historia

| Métrica | Valor |
|---------|-------|
| Story Points | 5 |
| Tiempo Estimado | 12 horas |
| Tiempo Actual | ✅ Completado |
| Vulnerabilidades Corregidas | 1 (Acceso no autorizado) |
| Endpoints Protegidos | 5 |
| Middlewares Agregados | 1 (verifyJWT) |
| Archivos Modificados | 4 |

---

## Definition of Done ✅

- ✅ Endpoint filtra únicamente por `req.usuario.id`
- ✅ Parámetro `user_id` deja de influir en resultados
- ✅ Imposible consultar menús de otros usuarios
- ✅ Todos los criterios de aceptación aprobados
- ✅ Código integrado mediante commit
- ✅ Pruebas funcionales completadas
- ✅ Documentación actualizada

---

## Recomendaciones Futuras

1. [ ] Implementar refresh tokens para mejor seguridad
2. [ ] Agregar rate limiting en `/api/auth/login`
3. [ ] Implementar roles y permisos granulares
4. [ ] Agregar auditoría de cambios
5. [ ] Implementar 2FA (autenticación de dos factores)
6. [ ] Usar bcrypt para hash de contraseñas
7. [ ] Implementar CORS más restrictivo en producción

---

## Notas Técnicas

- JWT Secret debe ser secreto en producción
- Token expira en 24 horas
- Solo se acepta Bearer tokens en header `Authorization`
- Base de datos requiere columna `user_id` en tabla `menus`
- Todos los errores retornan respuesta JSON estándar

---

**Fecha:** 12 de Julio de 2026
**Branch:** fix/secure-menu-filtering-jwt
**Responsable:** Backend Team
**Status:** ✅ COMPLETADA Y TESTEADA
