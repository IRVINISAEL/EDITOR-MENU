# Menu Master

## Documento de Arquitectura del Sistema

**Proyecto:** Menu Master

**Rol:** Tech Lead

**Responsable:** Irvin Isael Martínez Alejo

**Versión:** 1.0

---

# 1. Introducción

Menu Master es una plataforma SaaS diseñada para permitir a restaurantes crear, administrar y compartir menús digitales de forma sencilla y eficiente.

La arquitectura propuesta busca garantizar escalabilidad, seguridad y facilidad de mantenimiento utilizando tecnologías modernas ampliamente adoptadas en la industria.

---

# 2. Arquitectura General

La solución sigue una arquitectura de tres capas:

* Frontend
* Backend
* Base de Datos

El frontend consume servicios REST expuestos por el backend, mientras que el backend se comunica con la base de datos para almacenar y recuperar información.

---

# 3. Stack Tecnológico

| Componente        | Tecnología          |
| ----------------- | ------------------- |
| Frontend          | Next.js             |
| Lenguaje Frontend | TypeScript          |
| Estilos           | Tailwind CSS        |
| Backend           | Node.js             |
| API               | Express             |
| Base de Datos     | MySQL               |
| Hosting Frontend  | Vercel              |
| Hosting Backend   | Railway             |
| Autenticación     | JWT                 |
| Exportación PDF   | jsPDF + html2canvas |

---

# 4. Justificación Tecnológica

## Frontend

Next.js fue seleccionado por ofrecer renderizado eficiente, estructura escalable y una excelente experiencia de desarrollo.

## Backend

Express proporciona una arquitectura ligera y flexible para la construcción de APIs REST.

## Base de Datos

MySQL permite manejar relaciones entre categorías, menús y platillos de forma eficiente.

## JWT

Permite autenticación stateless sin necesidad de almacenar sesiones en el servidor.

## Railway

Facilita el despliegue automático y la administración de infraestructura.

## Vercel

Integra perfectamente aplicaciones Next.js y despliegues continuos.

---

# 5. Flujo del Sistema

1. Usuario accede a la aplicación.
2. Se registra mediante la API.
3. El backend almacena la información en MySQL.
4. El usuario inicia sesión.
5. Se genera un JWT.
6. El JWT es almacenado en el navegador.
7. El usuario crea o modifica menús.
8. La información se persiste en MySQL.
9. El usuario exporta el menú a PDF.

---

# 6. Seguridad

* Contraseñas protegidas mediante bcrypt.
* JWT con expiración de 24 horas.
* Variables sensibles almacenadas mediante .env.
* Restricción CORS.
* Validación de entradas del usuario.

---

# 7. Escalabilidad

La arquitectura permite:

* Separación de frontend y backend.
* Migración sencilla a servicios cloud dedicados.
* Integración futura con Redis.
* Implementación de balanceadores de carga.

---

# 8. Diseño de Base de Datos y Normalización

La base de datos de Menu Master fue diseñada utilizando MySQL y siguiendo principios de normalización con el objetivo de reducir la redundancia de datos, mejorar la integridad de la información y facilitar el mantenimiento del sistema.

## Entidades Principales

### Usuarios

* id_usuario (PK)
* nombre
* correo
* contraseña

### Menús

* id_menu (PK)
* id_usuario (FK)
* nombre
* descripcion

### Categorías

* id_categoria (PK)
* id_menu (FK)
* nombre
* orden

### Platillos

* id_platillo (PK)
* id_categoria (FK)
* nombre
* descripcion
* precio
* imagen_url
* disponible

## Primera Forma Normal (1FN)

Se cumple debido a que todos los atributos contienen valores atómicos y cada tabla posee una clave primaria única.

## Segunda Forma Normal (2FN)

Se cumple porque todos los atributos dependen completamente de la clave primaria de cada tabla y no existen dependencias parciales.

## Tercera Forma Normal (3FN)

Se cumple debido a que no existen dependencias transitivas. La información se encuentra separada en entidades independientes relacionadas mediante claves foráneas.

La aplicación de estas formas normales permite mantener una estructura eficiente, consistente y escalable para la gestión de menús digitales.


# 9. Conclusión

La arquitectura propuesta proporciona una base sólida para el crecimiento de Menu Master, permitiendo mantener un sistema seguro, escalable y fácil de mantener.
