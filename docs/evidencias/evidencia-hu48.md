# Evidencia HU-48 — Vista previa del negocio antes de publicar

**Fecha** 01/08/2026  
**QA** María José Linares Cortés  
**Rama** test/hu48-vista-previa-negocio  
**URL probada** https://editor-menu-ausx.vercel.app/mi-negocio



## Estado de la HU

 **BLOQUEADA** — El módulo Mi Negocio está implementado pero no existe funcionalidad de vista previa.


## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Módulo Mi Negocio disponible |  Implementado |
| Formulario de edición del negocio |  Funcional |
| Botón "Vista previa" |  No existe |
| Modal o panel de vista previa |  No implementado |
| Estado temporal sin persistencia |  No implementado |
| Reutilización del encabezado del menú público |  No implementado |



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Botón "Vista previa" visible en Mi Negocio | Botón disponible en la interfaz | No existe botón de vista previa |  FAIL |
| CA-01 | Vista previa muestra encabezado del menú público | Simulación del encabezado con datos ingresados | No implementado |  FAIL |
| CA-02 | Cerrar vista previa sin guardar descarta cambios | Cambios temporales no se persisten | No implementado |  FAIL |
| Extra | Módulo Mi Negocio carga correctamente | Página carga sin errores | Carga correctamente |  PASS |
| Extra | Campos del formulario son editables | Se puede editar nombre, descripción y contacto | Campos editables correctamente |  PASS |
| Extra | Datos se guardan y persisten | Al guardar los datos permanecen al recargar | Datos persisten correctamente |  PASS |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 6 | 3 | 0 | 3 |



## Observaciones

- El módulo Mi Negocio está implementado y funcional con campos editables y persistencia de datos.
- No existe ningún botón ni funcionalidad de "Vista previa" en la página.
- La HU-48 requiere implementar un modal o panel que muestre una simulación del encabezado del menú público con los datos actuales del formulario.



## Recomendaciones

1. Frontend debe agregar botón "Vista previa" en Mi Negocio
2. Frontend debe crear componente de vista previa reutilizando el encabezado del menú público
3. Frontend debe implementar estado temporal que descarte cambios al cerrar sin guardar



## Evidencia

 *[Captura de Mi Negocio sin botón de Vista previa]*  
  ![Prueba1](./evidencia/SinBotonVistaPrevia.png)

 *[Captura de datos guardados correctamente]*
  ![Prueba2](./evidencia/GuardadoCorrectamente.png)