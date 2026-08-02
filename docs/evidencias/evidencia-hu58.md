# Evidencia HU-58 — Platillos más vistos

**Fecha** 01/08/2026  
**QA** María José Linares Cortés  
**Rama** test/hu58-platillos-vistos  
**URL probada** https://editor-menu-ausx.vercel.app/analiticas



## Estado de la HU

 **PARCIALMENTE IMPLEMENTADA** — El módulo de Analíticas ya muestra datos reales de menús pero no implementa el ranking de platillos más vistos específicamente.



## Comparativa con HU-88

| Aspecto | HU-88 (anterior) | HU-58 (actual) |
|---|---|---|
| Datos en Analíticas | Hardcodeados (simulados) | Datos reales desde backend  |
| Endpoint de estadísticas | No existía | GET /api/menus/estadisticas |
| Vistas totales | Valor fijo 1,256 | Valor real (0 para usuario nuevo)  |
| Top menús | No existía | Implementado  |
| Platillos más vistos | No existía | No implementado  |



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Endpoint GET /api/analiticas/platillos |  No implementado |
| Tabla interacciones_platillo en BD |  No implementada |
| Sección "Platillos más vistos" en frontend |  No existe |
| Endpoint GET /api/menus/estadisticas |  Implementado |
| Analíticas con datos reales de menús |  Funcionando |
| Menú público funcionando |  Disponible |



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Registro de interacción al ver platillo en menú público | Sistema registra la interacción en BD | No existe tabla ni endpoint de interacciones de platillos |  FAIL |
| CA-02 | Sección "Platillos más vistos" en Analíticas | Ranking ordenado de platillos por vistas | No existe sección de platillos más vistos, solo "Top menús" |  FAIL |
| RN-01 | Vista de platillo genera interacción | Cada vista registra una interacción | No implementado |  FAIL |
| RN-04 | Ranking ordenado de mayor a menor | Platillos ordenados descendentemente | No implementado |  FAIL |
| Extra | Analíticas muestra datos reales de menús | Datos reales en dashboard |  Mejoró desde HU-88, ahora muestra datos reales |  PASS |
| Extra | Top menús funciona | Muestra menús con más vistas | Sección implementada con mensaje correcto para usuario sin vistas |  PASS |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 6 | 2 | 0 | 4 |



## Observaciones

- El módulo de Analíticas mejoró significativamente desde la evaluación anterior (HU-88), ya no muestra datos hardcodeados sino datos reales del backend.
- Se implementó correctamente el endpoint GET /api/menus/estadisticas y la sección "Top menús".
- La HU-58 específicamente requiere ranking de **platillos**, no de menús. Esa funcionalidad no está implementada.
- Pendiente: implementar tabla interacciones_platillo, endpoint GET /api/analiticas/platillos y sección "Platillos más vistos" en el frontend.



## Recomendaciones

1. Backend debe crear la tabla `interacciones_platillo`
2. Backend debe registrar interacciones cuando se consulte el detalle de un platillo en el menú público
3. Backend debe crear el endpoint `GET /api/analiticas/platillos`
4. Frontend debe agregar sección "Platillos más vistos" en `analiticas/page.tsx`



## Evidencia

 *[Captura del módulo de Analíticas con datos reales]*  
  ![Prueba1](./evidencia/ModuloAnalíticas.png)

 *[Captura del backend sin endpoint de platillos]*
  ![Prueba2](./evidencia/BackendEndpointPlatillos.png)