# Esquema de Pruebas — Sistema MenuMaster

**QA:** María José Linares Cortés  
**Rama:** docs/test-schema

---

## Pruebas de Autenticación

| # | Caso de prueba | Resultado esperado | Tipo | Estado |
|---|----------------|-------------------|------|--------|
| 1 | Registro con datos válidos | Crea cuenta en Railway MySQL | Integración |  Planificado |
| 2 | Registro con email repetido | Devuelve error 400 | Unitaria |  Planificado |
| 3 | Login correcto | Devuelve JWT válido | Integración |  Planificado |
| 4 | Login con password incorrecto | Devuelve error 401 | Unitaria |  Planificado |
| 5 | Acceder a /api/menus sin JWT | Devuelve error 403 | Integración |  Planificado |

---

## Pruebas de Menús

| # | Caso de prueba | Resultado esperado | Tipo | Estado |
|---|----------------|-------------------|------|--------|
| 6 | Crear menú logueado | Se guarda en Railway MySQL | Integración |  Planificado |
| 7 | Ver mis menús | Devuelve solo los menús del usuario | Unitaria | Planificado |
| 8 | Editar menú de otro usuario | Debe rechazarlo | Integración |  Planificado |
| 9 | Eliminar menú propio | Desaparece de la lista | Integración |  Planificado |

---

## Pruebas de UI (Vercel Frontend)

| # | Caso de prueba | Resultado esperado | Tipo | Estado |
|---|----------------|-------------------|------|--------|
| 10 | Landing carga en menos de 3 segundos | Tiempo de carga menor a 3s | Humo |  Planificado |
| 11 | Login funciona en celular y computadora | Responsive y funcional | Integración |  Planificado |
| 12 | Dashboard muestra los menús del usuario | Datos correctos del usuario | Integración |  Planificado |
| 13 | Exportar PDF genera el archivo en el browser | Archivo PDF descargado | Integración |  Planificado |

---

## Pruebas de Infraestructura

| # | Caso de prueba | Resultado esperado | Tipo | Estado |
|---|----------------|-------------------|------|--------|
| 14 | Vercel responde en menos de 2 segundos | Tiempo de respuesta menor a 2s | Humo |  Planificado |
| 15 | Railway API responde en menos de 1 segundo | Tiempo de respuesta menor a 1s | Humo |  Planificado |
| 16 | Conexión Vercel → Railway sin errores CORS | Sin errores CORS | Integración |  Planificado |

---

## Tipos de Prueba

| Tipo | Descripción |
|---|---|
| **Unitaria** | Cada función del backend por separado |
| **Integración** | Frontend (Vercel) + Backend (Railway) + DB |
| **Humo** | Verificar que login y crear menú funcionen |
| **Regresión** | Verificar que nada se rompe al hacer deploy |

---

## Resumen

| Total casos | Autenticación | Menús | UI | Infraestructura |
|---|---|---|---|---|
| 16 | 5 | 4 | 4 | 3 |