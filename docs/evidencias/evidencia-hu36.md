# Evidencia HU-36 — Generar código QR del menú

**Fecha** 2/08/2026  
**QA** María José Linares Cortés  
**Rama** test/hu36-generar-qr  
**URL probada** https://editor-menu-ausx.vercel.app/mis-menus



## Estado de la HU

 **BLOQUEADA** — No existe ninguna implementación de generación de código QR en el proyecto.



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Librería qrcode instalada |  No instalada |
| Botón "Generar QR" en Mis Menús |  No existe |
| Botón "Generar QR" en Editor |  No existe |
| Endpoint en backend para URL pública |  No implementado |
| Descarga en formato PNG |  No implementado |
| Vista previa del QR |  No implementado |
| Menús publicados disponibles |  Disponible |

---

## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Botón "Generar QR" visible para menús publicados | Botón disponible en Mis Menús o Editor | No existe botón de generar QR |  FAIL |
| CA-01 | Generación del código QR | Sistema genera QR con URL pública del menú | No implementado |  FAIL |
| CA-02 | Descarga del QR en formato PNG | Archivo PNG descargable | No implementado |  FAIL |
| RN-02 | QR solo para menús publicados | Botón deshabilitado para borradores | No implementado |  FAIL |
| RN-03 | QR contiene URL pública correcta | QR apunta al menú correcto | No implementado |  FAIL |
| RN-05 | QR corresponde solo al menú seleccionado | Cada QR es único por menú | No implementado |  FAIL |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 6 | 0 | 0 | 6 |



## Observaciones

- No existe ninguna referencia a `qrcode`, `QR` ni generación de código en el frontend ni en el backend.
- La librería `qrcode` no está instalada en el proyecto.
- No hay botón de generación de QR en ninguna sección del sistema.



## Recomendaciones

1. Frontend debe instalar la librería `qrcode` con `npm install qrcode`
2. Frontend debe agregar botón "Generar QR" en Mis Menús o en el Editor
3. El botón debe estar habilitado solo para menús en estado Publicado
4. Frontend debe mostrar vista previa del QR y opción de descarga en PNG
5. Backend debe validar que el menú pertenece al usuario y está publicado



## Evidencia

 *[Captura del backend sin implementación de QR]*
 ![Prueba1](./evidencia/BackendsinImplementacionQR.png)

 *[Captura de Mis Menús sin botón de QR]* 
 ![Prueba2](./evidencia/MisMenússinBotonQR.png)