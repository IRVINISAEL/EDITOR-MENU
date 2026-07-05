# Evidencia ACT-9 — Pruebas Manuales con Postman

**Fecha:** 05/07/2026
**QA:** María José Linares Cortés
**Rama:** test/act9-qa
**URL Backend:** https://editor-menu-production.up.railway.app

---

## Resumen de pruebas

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 7 | 6 | 1 | 0 |

---

## CA-02 — Pruebas manuales con Postman

### Prueba 1 — Registro de usuario
**Endpoint:** `POST /api/auth/register`  
**Body:**
```json
{
  "nombre": "QA Test",
  "email": "qa.act9@menumaster.com",
  "password": "Test1234"
}
```
**Respuesta:**
```json
{
  "ok": true,
  "userId": 4
}
```
**Código HTTP:** 200  
**Estado:**  PASS  




### Prueba 2 — Login exitoso
**Endpoint:** `POST /api/auth/login`  
**Body:**
```json
{
  "email": "qa.act9@menumaster.com",
  "password": "Test1234"
}
```
**Respuesta:**
```json
{
  "ok": true,
  "usuario": {
    "id": 4,
    "nombre": "QA Test",
    "email": "qa.act9@menumaster.com",
    "plan": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Código HTTP:** 200  
**Estado:**  PASS  


### Prueba 3 — Login con contraseña incorrecta
**Endpoint:** `POST /api/auth/login`  
**Body:**
```json
{
  "email": "qa.act9@menumaster.com",
  "password": "ContraseñaMal123"
}
```
**Respuesta:**
```json
{
  "ok": false,
  "mensaje": "Credenciales incorrectas"
}
```
**Código HTTP:** 401  
**Estado:**  PASS  


### Prueba 4 — Crear menú sin token
**Endpoint:** `POST /api/menus`  
**Headers:** Sin Authorization  
**Body:**
```json
{
  "nombre": "Menú de prueba QA"
}
```
**Respuesta:**
```json
{
  "ok": false,
  "mensaje": "Token requerido"
}
```
**Código HTTP:** 401  
**Estado:**  PASS — La ruta está correctamente protegida  



### Prueba 5 — Crear menú con token
**Endpoint:** `POST /api/menus`  
**Headers:** `Authorization: Bearer [token]`  
**Body:**
```json
{
  "nombre": "Menú QA ACT-9"
}
```
**Respuesta:**
```json
{
  "ok": true,
  "menuId": 10
}
```
**Código HTTP:** 200  
**Estado:**  PASS  



### Prueba 6 — Obtener mis menús con token
**Endpoint:** `GET /api/menus`  
**Headers:** `Authorization: Bearer [token]`  
**Respuesta:**
```json
{
  "ok": true,
  "menus": [...]
}
```
**Código HTTP:** 200  
**Estado:**  WARN  
**Observación:** El endpoint devuelve los menús de todos los usuarios en la base de datos, no solo los del usuario autenticado. Cada usuario debería ver únicamente sus propios menús.  


### Prueba 7 — Obtener menú por ID con token
**Endpoint:** `GET /api/menus/10`  
**Headers:** `Authorization: Bearer [token]`  
**Respuesta:**
```json
{
  "ok": true,
  "menu": {
    "id": 10,
    "nombre": "Menú QA ACT-9",
    "estado": "Borrador",
    "created_at": "2026-07-05T03:59:45.000Z"
  }
}
```
**Código HTTP:** 200  
**Estado:**  PASS  



## Observaciones generales

| # | Observación | Severidad |
|---|---|---|
| 1 | `GET /api/menus` devuelve menús de todos los usuarios, no solo del autenticado | Alta |
| 2 | El `user_id` del menú creado no coincide con el `userId` devuelto en el registro | Media |

---

## Evidencia adjunta

Captura 1 — Registro exitoso  
![Prueba 1](./evidencia/evidencia-RegistroExitoso.png)

Captura 2 — Login exitoso con token  
![Prueba 2](./evidencia/evidencia-LoginExitoso.png)

Captura 3 — Login fallido 401  
![Prueba 3](./evidencia/evidencia-LoginFallido.png)

Captura 4 — Crear menú sin token 401  
![Prueba 4](./evidencia/evidencia-CrearMenusnToken.png)

Captura 5 — Crear menú con token exitoso  
![Prueba 5](./evidencia/evidencia-ObtenermisMenuscnToken.png)

Captura 6 — GET menús (observación de seguridad)  
![Prueba 5.1](./evidencia/evidencia-obtenermisMenuscnToken.png)

Captura 7 — GET menú por ID exitoso
![Prueba 7](./evidencia/evidencia-ObtenerMenuIDexitoso.png)