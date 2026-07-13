# Cambios de Seguridad - Filtrado de Menús por JWT

## Resumen
Se implementó autenticación JWT en los endpoints de menús para garantizar que cada usuario únicamente pueda acceder y manipular sus propios menús, eliminando la vulnerabilidad de seguridad que permitía consultar información de otros usuarios.

## Cambios Realizados

### 1. Instalación de Dependencias
- Agregada `jsonwebtoken` (v9.0.0) a `package.json`
- Ejecutar `npm install` para instalar

### 2. Variables de Entorno
Agregar a `.env`:
```
JWT_SECRET=your_secret_key_here_change_in_production
```

### 3. Middleware de Autenticación
Se creó el middleware `verifyJWT` que:
- Valida tokens JWT en el header `Authorization: Bearer <token>`
- Decodifica el token y extrae los datos del usuario
- Almacena la información del usuario en `req.usuario`
- Retorna error 401 si el token es inválido o no está presente

### 4. Endpoint de Login (POST /api/auth/login)
**Cambios:**
- Ahora genera un JWT válido con `expiresIn: "24h"`
- El token contiene: `id`, `nombre`, `email` del usuario
- Retorna el token en el campo `token` (no más "token-id-menumaster")

**Uso:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}

Respuesta:
{
  "ok": true,
  "mensaje": "Login exitoso",
  "usuario": { "id": 1, "nombre": "Juan", "email": "juan@example.com", "plan": "básico" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Endpoint GET /api/menus (PROTEGIDO - CA-01 & CA-02)
**Cambios principales:**
- ✅ Ahora requiere autenticación JWT
- ✅ **Ignora completamente el parámetro `user_id` del cliente** (CA-02)
- ✅ Obtiene el `user_id` exclusivamente del token JWT decodificado (CA-01)
- Retorna solo los menús del usuario autenticado

**Antes (Vulnerable):**
```bash
GET /api/menus?user_id=2  # ❌ Podía consultar menús de otros usuarios
```

**Ahora (Seguro):**
```bash
GET /api/menus
Authorization: Bearer <token_jwt>
```

**Respuesta:**
```json
{
  "ok": true,
  "total": 3,
  "menus": [
    { "id": 1, "nombre": "Menú Principal", "estado": "Activo", "user_id": 1, "created_at": "2024-01-15" },
    { "id": 2, "nombre": "Promociones", "estado": "Borrador", "user_id": 1, "created_at": "2024-01-14" },
    { "id": 3, "nombre": "Bebidas", "estado": "Activo", "user_id": 1, "created_at": "2024-01-13" }
  ]
}
```

### 6. Endpoint GET /api/menus/:id (PROTEGIDO)
**Cambios:**
- ✅ Requiere autenticación JWT
- ✅ Verifica que el menú pertenece al usuario autenticado
- Retorna 404 si el menú no existe o no pertenece al usuario

**Uso:**
```bash
GET /api/menus/1
Authorization: Bearer <token_jwt>
```

### 7. Endpoint POST /api/menus (PROTEGIDO)
**Cambios principales:**
- ✅ Requiere autenticación JWT
- ✅ **Ya no acepta el parámetro `user_id` del cliente**
- ✅ Utiliza automáticamente el `user_id` del usuario autenticado
- El menú se crea asociado al usuario del JWT

**Antes (Vulnerable):**
```bash
POST /api/menus
{ "nombre": "Mi Menú", "user_id": 2 }  # ❌ Podía crear menús para otros usuarios
```

**Ahora (Seguro):**
```bash
POST /api/menus
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
  "nombre": "Mi Menú",
  "estado": "Borrador",
  "data_json": "{}"
}
```

**Respuesta:**
```json
{
  "ok": true,
  "mensaje": "Menú creado correctamente",
  "menuId": 42
}
```

### 8. Endpoint PUT /api/menus/:id (PROTEGIDO)
**Cambios:**
- ✅ Requiere autenticación JWT
- ✅ Verifica que el menú pertenece al usuario autenticado
- ✅ Retorna error 403 (Forbidden) si no es el propietario

**Uso:**
```bash
PUT /api/menus/1
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
  "nombre": "Menú Actualizado",
  "estado": "Activo",
  "data_json": "{}"
}
```

### 9. Endpoint DELETE /api/menus/:id (PROTEGIDO)
**Cambios:**
- ✅ Requiere autenticación JWT
- ✅ Verifica que el menú pertenece al usuario autenticado
- ✅ Retorna error 403 (Forbidden) si intenta eliminar menú ajeno

**Uso:**
```bash
DELETE /api/menus/1
Authorization: Bearer <token_jwt>
```

## Criterios de Aceptación Cumplidos

✅ **CA-01: Filtrado por JWT**
- El endpoint GET /api/menus ahora devuelve únicamente menús asociados a `req.usuario.id`

✅ **CA-02: Eliminación del parámetro inseguro**
- El sistema ignora completamente cualquier parámetro `user_id` enviado por el cliente
- El filtrado se realiza exclusivamente con el usuario autenticado

## Reglas de Negocio Implementadas

✅ **RN-01:** El identificador del usuario se obtiene exclusivamente del token JWT
✅ **RN-02:** El backend no confía en parámetros enviados por el cliente
✅ **RN-03:** Cada usuario únicamente puede consultar sus propios menús
✅ **RN-04:** Todos los endpoints de menús requieren JWT válido
✅ **RN-05:** Tokens inválidos o inexistentes retornan error 401

## Códigos de Error Esperados

| Código | Escenario |
|--------|-----------|
| 200    | Operación exitosa (GET, PUT, DELETE) |
| 201    | Menú creado correctamente (POST) |
| 400    | Datos inválidos o faltantes |
| 401    | Token no proporcionado o inválido |
| 403    | Usuario no tiene permiso (menú de otro usuario) |
| 404    | Menú no encontrado |
| 500    | Error del servidor |

## Testing

### Pruebas de Seguridad
```bash
# 1. ✅ Login y obtener token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# 2. ✅ Consultar menús propios con token
curl -H "Authorization: Bearer <token>" \
  http://localhost:4000/api/menus

# 3. ❌ Intento de consultar sin token
curl http://localhost:4000/api/menus
# Respuesta: 401 "Token no proporcionado"

# 4. ❌ Intento de manipular user_id
curl -H "Authorization: Bearer <token>" \
  "http://localhost:4000/api/menus?user_id=999"
# Respuesta: Solo menús del usuario autenticado (no del usuario 999)

# 5. ❌ Intento de actualizar menú ajeno
curl -X PUT http://localhost:4000/api/menus/999 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Hacked"}'
# Respuesta: 403 "No tienes permiso para actualizar este menú"

# 6. ✅ Crear menú (user_id se asigna automáticamente)
curl -X POST http://localhost:4000/api/menus \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo Menú"}'
```

## Migración desde el Código Anterior

Si tienes clientes que usaban:
```bash
GET /api/menus?user_id=1
```

Ahora deben usar:
```bash
GET /api/menus
Headers: Authorization: Bearer <token>
```

El `user_id` se infiere automáticamente del JWT, eliminando la necesidad de pasarlo como parámetro.

## Seguridad en Producción

⚠️ **IMPORTANTE:**
1. Cambiar `JWT_SECRET` a un valor seguro y único
2. Usar variables de entorno seguras
3. Usar HTTPS en producción
4. Implementar rate limiting en `/api/auth/login`
5. Considerar usar refresh tokens para mejor seguridad

## Archivos Modificados

- ✅ `menu-back/index.js` - Agregado middleware JWT y actualizado todos los endpoints
- ✅ `menu-back/package.json` - Agregada dependencia jsonwebtoken
- ✅ `menu-back/.env.example` - Agregada variable JWT_SECRET
- ✅ `menu-back/SECURITY_CHANGES.md` - Este archivo

## Próximos Pasos Recomendados

1. [ ] Implementar refresh tokens
2. [ ] Agregar rate limiting al login
3. [ ] Implementar roles y permisos
4. [ ] Agregar auditoría de cambios
5. [ ] Implementar 2FA (autenticación de dos factores)
