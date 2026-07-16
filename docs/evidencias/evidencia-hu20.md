# Evidencia HU-20 — Crear categorías dentro de un menú

**Fecha** 13/07/2026  
**QA** María José Linares Cortés  
**Rama** test/hu20-categorias  
**URL probada** https://editor-menu-ausx.vercel.app/editor



## Estado de la HU

 **BLOQUEADA** — La funcionalidad no está implementada completamente.



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Endpoint POST /api/categorias en backend |  No implementado |
| Formulario de creación de categorías en editor |  No visible en el editor |
| Tabla categorias en base de datos | ⏳ No verificado |
| Usuario autenticado |  Disponible |
| Editor de menús disponible |  Disponible |



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Crear categoría desde el editor | Sistema crea categoría y la muestra en el editor | No existe formulario de creación de categorías en el editor |  FAIL |
| CA-02 | Validación de nombre vacío | Sistema muestra mensaje de error | No existe formulario para probar la validación |  FAIL |
| RN-01 | Solo usuarios autenticados crean categorías | Endpoint protegido con JWT | Endpoint POST /api/categorias no existe en el backend |  FAIL |
| RN-03 | Categoría asociada a un menú existente | Categoría se guarda con menu_id | Endpoint no implementado, no se puede verificar |  FAIL |
| RN-05 | Categoría visible inmediatamente en el editor | La categoría aparece en el editor al crearla | No implementado |  FAIL |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 5 | 0 | 0 | 5 |



## Observaciones

- El editor actual muestra secciones como "ENTRADAS" pero no cuenta con un formulario para crear categorías mediante el endpoint POST /api/categorias.
- El endpoint POST /api/categorias no existe en menu-back/index.js.
- La HU no puede considerarse terminada hasta que el backend implemente el endpoint y el frontend integre el formulario.



## Recomendaciones

1. El equipo de Backend debe implementar el endpoint POST /api/categorias
2. El equipo de Frontend debe agregar el formulario de creación de categorías en el editor
3. Una vez implementado, se ejecutarán nuevamente las pruebas



