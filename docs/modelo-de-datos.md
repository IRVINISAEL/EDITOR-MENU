# Modelo de Datos

## BASE DE DATOS: `menumaster` (Railway MySQL)

---

## TABLA: usuarios

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Número único autoincremental | Identificador único |
| `nombre` | Texto | Nombre del usuario |
| `email` | Texto único | Correo electrónico único |
| `password` | Texto | Contraseña encriptada con bcrypt |
| `plan` | Enum | Puede ser `free` o `pro` |
| `fecha_registro` | Fecha automática | Fecha de registro asignada al crear la cuenta |

---

## TABLA: menus

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Número único | Identificador único |
| `usuario_id` | Número entero | Referencia a `usuarios.id` |
| `nombre` | Texto | Nombre del menú (ej: "Carta verano") |
| `descripcion` | Texto opcional | Descripción del menú |
| `fecha_creacion` | Fecha automática | Fecha de creación asignada al crear el menú |

---

## TABLA: categorias

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Número único | Identificador único |
| `menu_id` | Número entero | Referencia a `menus.id` |
| `nombre` | Texto | Nombre de la categoría (ej: Entradas, Postres, Bebidas) |
| `orden` | Número entero | Número para ordenar las categorías |

---

## TABLA: platillos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Número único | Identificador único |
| `categoria_id` | Número entero | Referencia a `categorias.id` |
| `nombre` | Texto | Nombre del platillo |
| `descripcion` | Texto opcional | Descripción del platillo |
| `precio` | Decimal | Precio del platillo |
| `imagen_url` | Texto opcional | Link de la imagen |
| `disponible` | Booleano | Indica si el platillo está disponible (`true`/`false`) |

---

## RELACIONES

- 1 usuario → muchos menús
- 1 menú → muchas categorías
- 1 categoría → muchos platillos
