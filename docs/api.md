# DEFINICIÓN DE RUTAS 
## BASE URL (cuando esté desplegado):

https://[proyecto].up.railway.app

─────────────────────────────────────

AUTENTICACIÓN (no requieren JWT)

─────────────────────────────────────

## POST /api/auth/register
### Descripción: Crear cuenta nueva

Body que recibe:

{
    "nombre": "string",
    "email": "string",
    "password": "string"
}

Respuesta exitosa (201): { "message": "Usuario creado exitosamente", "userId": 1 }

Error si el email ya existe (400): { "error": "El email ya está registrado" }

## POST /api/auth/login
### Descripción: Iniciar sesión

Body que recibe:

{
    "email": "string",
    "password": "string"
  }
Respuesta exitosa (200): { "token": "eyJhbGciOiJIUzI1NiIs..."}

Error si credenciales incorrectas (401): { "error": "Credenciales inválidas" }


## POST /api/menus
### Descripción: Crear menú nuevo

Body: { "nombre": "string", "descripcion": "string" }

Respuesta (201): { "message": "Menú creado", "menuId": 1 }

## POST /api/platillos
### Descripción: Agregar platillo

Body: { "categoria_id", "nombre", "precio", "descripcion" }

Respuesta (201): { "message": "Platillo creado", "platilloId": 1 }

─────────────────────────────────────

MENÚS (todos requieren JWT)

Header: Authorization: Bearer [token]

─────────────────────────────────────

PLATILLOS (todos requieren JWT)

─────────────────────────────────────

## GET /api/menus
### Descripción: Obtener todos los menús del usuario

Respuesta (200): [ { id, nombre, descripcion, fecha_creacion } ]

## GET /api/platillos/:menuId
### Descripción: Obtener platillos de un menú

Respuesta (200): [ { id, nombre, precio, disponible } ]

## PUT /api/menus/:id
### Descripción: Editar un menú existente

Body: { "nombre": "string", "descripcion": "string" }

Respuesta (200): { "message": "Menú actualizado" }

## PUT /api/platillos/:id
### Descripción: Editar platillo

Body: { "nombre", "precio", "disponible" }

Respuesta (200): { "message": "Platillo actualizado" }

## DELETE /api/menus/:id
### Descripción: Eliminar un menú

Respuesta (200): { "message": "Menú eliminado" }


## DELETE /api/platillos/:id
### Descripción: Eliminar platillo

Respuesta (200): { "message": "Platillo eliminado" }


─────────────────────────────────────

NOTA: Este documento es el diseño del API.

Las pruebas con Postman se realizarán cuando el backend esté construido y desplegado en Railway.

─────────────────────────────────────
