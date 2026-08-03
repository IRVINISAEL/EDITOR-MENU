# Evidencia HU-47 — Horario de atención por día

**Fecha:** 2/08/2026  
**QA:** María José Linares Cortés  
**Rama:** test/hu47-horario-atencion  
**URL probada:** https://editor-menu-ausx.vercel.app/mi-negocio



## Estado de la HU

 **PARCIALMENTE IMPLEMENTADA** — Existe un campo de horario como texto libre pero no el configurador por día que requiere la HU.



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Campo horario en frontend |  Existe como input de texto |
| Campo horario en backend |  Se guarda y persiste |
| Configurador por día (lunes-domingo) |  No implementado |
| Campos de apertura y cierre por día |  No implementado |
| Opción de marcar días como cerrados |  No implementado |
| Almacenamiento en formato JSON estructurado |  Solo texto libre |
| Etiqueta "Cerrado ahora" en menú público |  No implementado |



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Configurar horario por día de la semana | Formulario con campos por día | Solo existe un campo de texto libre para horario |  FAIL |
| CA-01 | Guardar horarios estructurados por día | JSON con horarios por día en BD | Se guarda como texto libre sin estructura |  FAIL |
| CA-02 | Mostrar "Cerrado ahora" en menú público | Etiqueta visible cuando el negocio está cerrado | No implementado |  FAIL |
| RN-03 | Validar hora apertura anterior a cierre | Sistema valida el orden de horas | No existe validación, es texto libre |  FAIL |
| RN-04 | Días marcados como cerrados sin horario | Opción de marcar día como cerrado | No existe esta opción |  FAIL |
| Extra | Campo horario existe y es editable | Campo disponible en Mi Negocio | Campo de texto libre funcional |  PASS |
| Extra | Horario se guarda y persiste | Datos permanecen al recargar | Texto libre se guarda correctamente |  PASS |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 7 | 2 | 0 | 5 |



## Observaciones

- El campo de horario existe como input de texto libre con placeholder "Lun-Dom 9:00 - 22:00".
- No existe configurador por día con campos independientes de apertura y cierre.
- Los horarios no se almacenan en formato JSON estructurado sino como texto plano.
- No existe funcionalidad para mostrar "Cerrado ahora" en el menú público.



## Recomendaciones

1. Frontend debe reemplazar el input de texto por un configurador por día
2. Cada día debe tener campos de apertura, cierre y opción de marcar como cerrado
3. Backend debe validar la estructura JSON recibida
4. Frontend debe mostrar etiqueta "Cerrado ahora" en el menú público según el horario configurado



## Evidencia

 *[Captura del campo horario como texto libre en Mi Negocio]*
 ![Prueba1](./evidencia/campohorariocomotextolibre.png)