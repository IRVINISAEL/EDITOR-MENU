# Evidencia HU-23 — Agregar platillos a una categoría

**Fecha** 01/08/2026  
**QA** María José Linares Cortés  
**Rama** test/hu23-agregar-platillos  
**URL probada** https://editor-menu-ausx.vercel.app/editor



## Estado de la HU

 **PARCIALMENTE IMPLEMENTADA** — El editor permite agregar platillos visualmente pero no los persiste en el backend mediante POST /api/platillos.



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Endpoint POST /api/platillos |  No implementado |
| Tabla platillos en base de datos |  No verificada |
| Formulario de creación en editor |  Disponible |
| Editor de menús disponible |  Disponible |
| Usuario autenticado |  Disponible |



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Agregar platillo desde el editor | Platillo se crea y aparece en el editor | Platillo se agrega visualmente en el editor |  PASS |
| CA-01 | Platillo persiste en backend | Platillo se guarda mediante POST /api/platillos | Los platillos se pierden al recargar la página |  FAIL |
| CA-02 | Validación de precio negativo | Sistema muestra error y no guarda | No existe validación de precio, acepta cualquier valor |  FAIL |
| CA-02 | Validación de precio no numérico | Sistema muestra error y no guarda | No existe validación, acepta texto como precio |  FAIL |
| RN-03 | Nombre del platillo obligatorio | Sistema no permite nombre vacío | No existe validación de nombre obligatorio |  FAIL |
| RN-04 | Precio numérico mayor o igual a cero | Sistema valida el precio | No existe validación de precio |  FAIL |
| Extra | Placeholder se borra al editar | Campo se limpia al hacer clic | El texto placeholder no se borra automáticamente al editar |  WARN |


## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 7 | 1 | 1 | 5 |



## Observaciones

- El editor permite agregar platillos visualmente con nombre, descripción y precio pero estos no se persisten en el backend.
- Al recargar la página los platillos desaparecen porque no existe el endpoint POST /api/platillos.
- No existe validación de precio negativo, precio no numérico ni nombre obligatorio.
- El texto placeholder no se borra automáticamente al hacer clic para editar, el usuario debe borrarlo manualmente generando textos como "Descripciónppastel de tres leches".



## Recomendaciones

1. Backend debe implementar el endpoint POST /api/platillos
2. Backend debe crear la tabla platillos con llave foránea a categorías
3. Frontend debe conectar el botón "Agregar nuevo platillo" al endpoint
4. Frontend debe agregar validaciones de nombre obligatorio y precio numérico
5. Frontend debe limpiar el placeholder al hacer clic en el campo



## Evidencia

 *[Captura del editor con platillos agregados]*  
  ![Prueba1](./evidencia/PlatillosAgregados.png)

 *[Captura de platillos desaparecidos al recargar]*  
  ![Prueba2](./evidencia/PlatillosDesaparecidosRecargar.png)

 *[Captura del backend sin endpoint POST /api/platillos]*
  ![Prueba3](./evidencia/BackendSNEndpointPOST.png)