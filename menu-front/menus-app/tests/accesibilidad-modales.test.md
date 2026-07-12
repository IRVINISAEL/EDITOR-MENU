# Pruebas de Accesibilidad — Modales MenuMaster
**HU** HU-82  
**Fecha** 12/07/2026  
**QA** María José Linares Cortés  
**Rama** test/hu82-accesibilidad  
**Páginas probadas**
- https://editor-menu-ausx.vercel.app/mis-menus
- https://editor-menu-ausx.vercel.app/editor



## Criterios evaluados

| Criterio | Descripción |
|---|---|
| CA-01 | El foco permanece dentro del modal al navegar con Tab |
| CA-02 | La tecla Escape cierra el modal sin ejecutar acción destructiva |
| RN-01 | El foco inicial se posiciona en un elemento interactivo del modal |
| RN-04 | Al cerrar el modal, el foco regresa al elemento que lo abrió |



## Modal 1 — Ver menú (`mis-menus/page.tsx`)

| # | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| ACC-01 | Foco inicial al abrir modal Ver | Hacer clic en 👁️ y presionar Tab | Foco se posiciona en primer elemento interactivo del modal | Al abrir el modal y presionar Tab no se resalta ningún elemento interactivo |  FAIL |
| ACC-02 | Foco atrapado dentro del modal Ver | Abrir modal y presionar Tab varias veces | Foco no sale del modal | El foco navega primero por elementos del fondo y luego llega a los botones del modal, no queda atrapado dentro |  FAIL |
| ACC-03 | Cerrar modal Ver con Escape | Abrir modal y presionar Escape | Modal se cierra sin ejecutar acción | Al presionar Escape el modal no se cierra, pero el foco se mueve al fondo hacia el botón 👁️ |  FAIL |
| ACC-04 | Foco regresa al botón que abrió el modal | Cerrar modal con botón Cerrar | Foco regresa al botón 👁️ | El foco no regresa al botón que abrió el modal |  FAIL |



## Modal 2 — Eliminar menú (`mis-menus/page.tsx`)

| # | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| ACC-05 | Foco inicial al abrir modal Eliminar | Hacer clic en 🗑️ y presionar Tab | Foco se posiciona en primer elemento interactivo del modal | El foco sí resalta botones dentro del modal al presionar Tab |  PASS |
| ACC-06 | Foco atrapado dentro del modal Eliminar | Abrir modal y presionar Tab varias veces | Foco no sale del modal | El foco recorre los botones del modal pero después sale y navega elementos del fondo | FAIL |
| ACC-07 | Cerrar modal Eliminar con Escape | Abrir modal y presionar Escape | Modal se cierra sin ejecutar eliminación | Al presionar Escape el modal no se cierra, pero el foco se mueve al botón 🗑️ en el fondo |  FAIL |
| ACC-08 | Foco regresa al botón que abrió el modal | Cerrar modal con botón Cancelar | Foco regresa al botón 🗑️ | El foco no regresa al botón que abrió el modal, aparece en el botón Actualizar como cursor de texto |  FAIL |



## Resultados

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 8 | 1 | 0 | 7 |



## Bugs encontrados

| # | Modal | Descripción | Severidad | Criterio incumplido |
|---|---|---|---|---|
| BUG-01 | Ver | Al abrir el modal el foco no se posiciona en ningún elemento interactivo | Media | RN-01 |
| BUG-02 | Ver y Eliminar | El foco navega primero por el fondo antes de llegar a los botones del modal | Alta | CA-01 |
| BUG-03 | Ver y Eliminar | La tecla Escape no cierra el modal; en su lugar mueve el foco al botón que abrió el modal (👁️ o 🗑️) sin cerrarlo | Alta | CA-02 |
| BUG-04 | Ver y Eliminar | Al cerrar el modal el foco no regresa al elemento que lo abrió | Media | RN-04 |



## Recomendaciones para el equipo Frontend

1. Implementar **Focus Trap** en ambos modales para que el Tab quede atrapado dentro
2. Agregar listener de **keydown Escape** para cerrar el modal
3. Guardar referencia del elemento que abrió el modal y restaurar el foco al cerrar
4. Usar `useRef` para posicionar el foco automáticamente al abrir el modal



## Evidencia del Tab se Muestra de fondo antes de seleccionar el boton de en frente
![evidencia 1](./evidencia/evidencia-tabFondo.pnq)
![evidencia 1.1](./evidencia/evidencia-Tabdespuesde5veces.pnq)
![evidencia 1.2](./evidencia/evidencia-TabDespuesdeunIntentoBotonbasura.png)

## Evidencia del Esc no cierra pero marca el boton de fondo [en ambos casos]
![evidencia 2](./evidencia/evidencia-ESCnocierrasoloseleccionabotonFondo.png)

## Evidencia que al cerrar el modal con Cancelar el cursor de texto aparece dentro del botón Actualizar en lugar de regresar al botón seleccionado anterior mente 
![evidencia 3](./evidencia/evidencia-BotoncnCursorTexto.png)