# Validación y Seguridad del Backend

## Descripción General

Este documento describe los mecanismos de validación y seguridad implementados en el backend de MenuMaster.

---

## 1. Middleware de Autenticación JWT

### Propósito
Verificar que las solicitudes a rutas protegidas incluyan un JWT válido.

### Ubicación
`menu-back/index.js` - Función `verificarToken`

### Uso
```javascript
app.get("/api/menus", verificarToken, (req, res) => {
  // Lógica protegida
});
```

### Validaciones
- Busca el token en:
  - Header: `Authorization: Bearer [token]`
  - Query Parameter: `?token=[token]`
- Valida la firma del JWT usando `JWT_SECRET`
- Verifica la expiración del token (24 horas)

### Respuestas de Error
- **401 Token no proporcionado**: Cuando no se envía un token
- **401 Token inválido o malformado**: Cuando el JWT no es válido
- **401 Token expirado**: Cuando el JWT ha expirado

---

## 2. Validaciones de Datos

### 2.1 Validación de Email
```javascript
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```
- Verifica formato: `usuario@dominio.com`
- Utilizado en: Login, Registro, Recuperación de contraseña

### 2.2 Validación de Contraseña
- **Longitud mínima**: 8 caracteres
- **Hash**: Se almacena con bcrypt (algoritmo seguro)
- **Comparación**: Se usa `bcrypt.compare()` en login

### 2.3 Validación de Números
- Valida que campos numéricos sean números enteros
- Utilizado en: `user_id`, `menu_id`

### 2.4 Validación de JSON
```javascript
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
```
- Verifica que `data_json` sea JSON válido

### 2.5 Validación de Estado de Menú
```javascript
function isValidMenuState(estado) {
  return ["Borrador", "Publicado", "Archivado"].includes(estado);
}
```
- Estados permitidos: `Borrador`, `Publicado`, `Archivado`

---

## 3. Validaciones por Endpoint

### POST /api/auth/register
| Campo | Validaciones |
|-------|--------------|
| nombre | string obligatorio, 1-255 caracteres |
| email | string obligatorio, formato válido |
| password | string obligatorio, mínimo 8 caracteres |
| negocio | string opcional |

**Respuestas de error:**
- 400: Campo inválido o formato incorrecto
- 400: Email ya registrado

### POST /api/auth/login
| Campo | Validaciones |
|-------|--------------|
| email | string obligatorio, formato válido |
| password | string obligatorio |

**Respuestas de error:**
- 400: Email o contraseña inválidos
- 401: Credenciales incorrectas

### GET /api/menus
**Protección**: JWT obligatorio

| Campo | Validaciones |
|-------|--------------|
| user_id (query) | número opcional |

**Respuestas de error:**
- 401: Token no proporcionado o inválido
- 400: user_id no es un número

### GET /api/menus/:id
**Protección**: JWT obligatorio

| Campo | Validaciones |
|-------|--------------|
| id (path) | número obligatorio |

**Respuestas de error:**
- 401: Token no proporcionado o inválido
- 400: id no es un número
- 404: Menú no encontrado

### POST /api/menus
**Protección**: JWT obligatorio

| Campo | Validaciones |
|-------|--------------|
| nombre | string obligatorio, 1-255 caracteres |
| estado | string opcional (Borrador, Publicado, Archivado) |
| data_json | string opcional, JSON válido |
| user_id | número opcional |

**Respuestas de error:**
- 401: Token no proporcionado o inválido
- 400: Validación de datos fallida
- 400: Estado de menú inválido

### PUT /api/menus/:id
**Protección**: JWT obligatorio

| Campo | Validaciones |
|-------|--------------|
| id (path) | número obligatorio |
| nombre | string opcional, 1-255 caracteres |
| estado | string opcional (Borrador, Publicado, Archivado) |
| data_json | string opcional, JSON válido |

**Respuestas de error:**
- 401: Token no proporcionado o inválido
- 400: Validación de datos fallida
- 404: Menú no encontrado

### DELETE /api/menus/:id
**Protección**: JWT obligatorio

| Campo | Validaciones |
|-------|--------------|
| id (path) | número obligatorio |

**Respuestas de error:**
- 401: Token no proporcionado o inválido
- 400: id no es un número
- 404: Menú no encontrado

---

## 4. Middleware Centralizado de Errores

### Propósito
Capturar y manejar todas las excepciones del servidor de forma centralizada.

### Ubicación
`menu-back/index.js` - Middleware al final

### Características
- Registra errores en la consola con timestamp
- No expone detalles sensibles al cliente
- Devuelve respuestas consistentes
- Mantiene status HTTP apropiados

### Ejemplo de Error
```javascript
app.use((err, req, res, next) => {
  console.error("Error capturado:", {
    mensaje: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || 500;
  const mensaje = statusCode === 500 ? "Error interno del servidor" : err.message;

  res.status(statusCode).json({
    ok: false,
    mensaje: mensaje,
  });
});
```

---

## 5. Variables de Entorno

### Requeridas
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=contraseña
DB_NAME=menumaster
DB_PORT=3306
```

### Opcionales
```env
PORT=4000
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
PASSWORD_RESET_EXPIRATION_MINUTES=60
```

### En Producción
- **JWT_SECRET**: Cambiar a una clave fuerte y única
- **Usar HTTPS**: No HTTPS = vulnerabilidad
- **Validar Origins**: Configurar CORS apropiadamente

---

## 6. Flujo de Autenticación

### Registro
```
POST /api/auth/register
├─ Validar nombre, email, password
├─ Hash de password con bcrypt
├─ Insertar usuario en BD
└─ Responder con userId
```

### Login
```
POST /api/auth/login
├─ Validar email y password
├─ Buscar usuario en BD
├─ Comparar password con bcrypt
├─ Generar JWT con expiración 24h
└─ Responder con token
```

### Solicitud Protegida
```
GET /api/menus
├─ Extraer token del header/query
├─ Verificar firma del JWT
├─ Decodificar para obtener userId
├─ Procesar solicitud
└─ Responder con datos
```

---

## 7. Pruebas Recomendadas

### Con cURL
```bash
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","password":"12345678"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'

# Obtener menús (con token)
curl -X GET "http://localhost:4000/api/menus" \
  -H "Authorization: Bearer [TOKEN_AQUI]"
```

### Con Postman
1. Ejecutar POST /api/auth/login
2. Copiar el token de la respuesta
3. En siguiente solicitud, ir a "Authorization"
4. Seleccionar "Bearer Token"
5. Pegar el token

---

## 8. Buenas Prácticas

✅ **Hacer**
- Validar TODOS los inputs
- Usar JWT con expiración
- Hash de contraseñas con bcrypt
- Manejo centralizado de errores
- Logging de eventos sensibles
- HTTPS en producción
- Secrets en variables de entorno

❌ **Evitar**
- Almacenar contraseñas en texto plano
- Exponer detalles internos en respuestas
- Confiar en validaciones del cliente
- Tokens sin expiración
- Hardcodear secrets en código
- HTTP en producción

---

## 9. Cambios Implementados

### Sprint de Validación y Seguridad
- ✅ Middleware `verificarToken` para JWT
- ✅ Validación de tipos de datos
- ✅ Validación de email
- ✅ Validación de contraseña (mínimo 8 caracteres)
- ✅ Validación de estados de menú
- ✅ Validación de JSON
- ✅ Protección de rutas de menús
- ✅ Middleware centralizado de errores
- ✅ Respuestas HTTP consistentes
- ✅ Documentación completa
