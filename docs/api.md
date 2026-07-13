# DEFINICIÓN DE RUTAS 

## BASE URL (cuando esté desplegado):

https://[proyecto].up.railway.app

─────────────────────────────────────

## Validaciones globales

- **Correo electrónico**: Debe cumplir formato válido (ejemplo@dominio.com)
- **Contraseña**: Mínimo 8 caracteres
- **Nombres**: Máximo 255 caracteres, no pueden estar vacíos
- **JSON**: Cualquier campo JSON debe ser válido
- **Tipos de datos**: Se validan los tipos de entrada en todos los endpoints

─────────────────────────────────────

## Códigos de respuesta HTTP

- **200**: Solicitud exitosa
- **201**: Recurso creado exitosamente
- **400**: Error de validación o solicitud malformada
- **401**: No autorizado / Token inválido o expirado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

─────────────────────────────────────

AUTENTICACIÓN (no requieren JWT)

─────────────────────────────────────

## POST /api/auth/register
### Descripción: Crear cuenta nueva

**Validaciones:**
- nombre: string obligatorio, 1-255 caracteres
- email: string obligatorio, formato válido
- password: string obligatorio, mínimo 8 caracteres
- negocio: string opcional

Body que recibe:

{
    "nombre": "string",
    "email": "string",
    "password": "string",
    "negocio": "string (opcional)"
}

Respuesta exitosa (201): { "ok": true, "mensaje": "Usuario registrado correctamente", "userId": 1 }

Error validación (400): { "ok": false, "mensaje": "El correo electrónico no es válido" }

Error email duplicado (400): { "ok": false, "mensaje": "Este correo ya está registrado" }

## POST /api/auth/login
### Descripción: Iniciar sesión

**Validaciones:**
- email: string obligatorio, formato válido
- password: string obligatorio

Body que recibe:

{
    "email": "string",
    "password": "string"
}

Respuesta exitosa (200): 
{
  "ok": true,
  "mensaje": "Login exitoso",
  "usuario": { "id": 1, "nombre": "string", "email": "string", "plan": "string" },
  "token": "jwt_token_aqui"
}

Error credenciales incorrectas (401): { "ok": false, "mensaje": "Correo o contraseña incorrectos" }

Error validación (400): { "ok": false, "mensaje": "El correo electrónico no es válido" }

## POST /api/auth/forgot-password
### Descripción: Solicitar recuperación de contraseña

**Validaciones:**
- email: string obligatorio, formato válido

Body que recibe:

{
    "email": "string"
}

Respuesta exitosa (200): { "ok": true, "mensaje": "Si el correo existe en el sistema, se ha enviado un enlace de recuperación" }

Error validación (400): { "ok": false, "mensaje": "El correo electrónico no es válido" }

## GET /api/auth/reset-password/:token
### Descripción: Validar token de recuperación

Parámetros:
- token: string (en la URL)

Respuesta exitosa (200): { "ok": true, "mensaje": "Token válido" }

Error token inválido (400): { "ok": false, "mensaje": "Token inválido o expirado" }

## POST /api/auth/reset-password
### Descripción: Restablecer contraseña

**Validaciones:**
- token: string obligatorio
- password: string obligatorio, mínimo 8 caracteres

Body que recibe:

{
    "token": "string",
    "password": "string"
}

Respuesta exitosa (200): { "ok": true, "mensaje": "Contraseña actualizada correctamente" }

Error validación (400): { "ok": false, "mensaje": "La contraseña debe tener al menos 8 caracteres" }

─────────────────────────────────────

MENÚS (todos requieren JWT)

Header: Authorization: Bearer [token]

─────────────────────────────────────

## GET /api/menus
### Descripción: Obtener todos los menús del usuario

**Protección**: JWT requerido
**Validaciones:**
- user_id (query): número opcional

Parámetros:
- user_id (query parameter): número de usuario (opcional)

Respuesta exitosa (200): { "ok": true, "total": 5, "menus": [...] }

Error sin JWT (401): { "ok": false, "mensaje": "Token no proporcionado" }

Error token inválido (401): { "ok": false, "mensaje": "Token inválido o malformado" }

## GET /api/menus/:id
### Descripción: Obtener un menú por ID

**Protección**: JWT requerido
**Validaciones:**
- id: número válido

Parámetros:
- id (path): número del menú

Respuesta exitosa (200): { "ok": true, "menu": {...} }

Error sin JWT (401): { "ok": false, "mensaje": "Token no proporcionado" }

Error menú no encontrado (404): { "ok": false, "mensaje": "Menú no encontrado" }

## POST /api/menus
### Descripción: Crear menú nuevo

**Protección**: JWT requerido
**Validaciones:**
- nombre: string obligatorio, 1-255 caracteres
- estado: string opcional (Borrador, Publicado, Archivado)
- data_json: string opcional, debe ser JSON válido
- user_id: número opcional

Body que recibe:

{
    "nombre": "string",
    "estado": "Borrador | Publicado | Archivado (opcional)",
    "data_json": "string JSON válido (opcional)",
    "user_id": "número (opcional)"
}

Respuesta exitosa (201): { "ok": true, "mensaje": "Menú creado correctamente", "menuId": 1 }

Error validación (400): { "ok": false, "mensaje": "El nombre es obligatorio y debe ser texto" }

Error estado inválido (400): { "ok": false, "mensaje": "Estado de menú inválido. Debe ser: Borrador, Publicado o Archivado" }

Error sin JWT (401): { "ok": false, "mensaje": "Token no proporcionado" }

## PUT /api/menus/:id
### Descripción: Editar un menú existente

**Protección**: JWT requerido
**Validaciones:**
- nombre: string opcional, 1-255 caracteres si se proporciona
- estado: string opcional (Borrador, Publicado, Archivado)
- data_json: string opcional, debe ser JSON válido

Body que recibe:

{
    "nombre": "string (opcional)",
    "estado": "Borrador | Publicado | Archivado (opcional)",
    "data_json": "string JSON válido (opcional)"
}

Respuesta exitosa (200): { "ok": true, "mensaje": "Menú actualizado correctamente" }

Error validación (400): { "ok": false, "mensaje": "El nombre debe tener entre 1 y 255 caracteres" }

Error menú no encontrado (404): { "ok": false, "mensaje": "Menú no encontrado" }

Error sin JWT (401): { "ok": false, "mensaje": "Token no proporcionado" }

## DELETE /api/menus/:id
### Descripción: Eliminar un menú

**Protección**: JWT requerido
**Validaciones:**
- id: número válido

Parámetros:
- id (path): número del menú

Respuesta exitosa (200): { "ok": true, "mensaje": "Menú eliminado correctamente" }

Error menú no encontrado (404): { "ok": false, "mensaje": "Menú no encontrado" }

Error sin JWT (401): { "ok": false, "mensaje": "Token no proporcionado" }

─────────────────────────────────────

NOTA: Este documento es el diseño del API con validaciones y protección JWT.
Las pruebas con Postman se realizarán cuando el backend esté construido y desplegado en Railway.

─────────────────────────────────────
