# Evidencia HU-89 — Eliminar cuenta de usuario

**Fecha** 28/07/2026  
**QA** María José Linares Cortés  
**Rama** test/hu89-eliminar-cuenta  
**URL probada** https://editor-menu-ausx.vercel.app/configuracion



## Estado de la HU

 **IMPLEMENTADA Y FUNCIONAL**



## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Botón "Eliminar mi cuenta" visible en Configuración | Botón visible y accesible | Botón visible correctamente | ✅ PASS |
| CA-01 | Modal de confirmación abre al hacer clic | Modal se abre con campo de contraseña | Modal abre correctamente solicitando contraseña | ✅ PASS |
| CA-01 | Validación de contraseña obligatoria | Sistema muestra error si contraseña vacía | Sistema solicita contraseña nuevamente si está vacía |  PASS |
| CA-02 | Eliminación correcta al confirmar | Cuenta se elimina correctamente | Cuenta eliminada exitosamente | ✅ PASS |
| CA-02 | Cierre automático de sesión | Sesión se cierra al eliminar | Sesión cerrada automáticamente y redirige al login | ✅ PASS |
| CA-02 | Imposibilidad de volver a iniciar sesión | Cuenta eliminada no puede iniciar sesión | Muestra "Credenciales incorrectas" al intentar login | PASS |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 6 | 6 | 0 | 0 |



## Evidencia

 *[Captura del botón Eliminar mi cuenta en Configuración]*  
 ![Prueba1](./evidencia/BotonDeEliminar.png)

 *[Captura del modal de confirmación con campo de contraseña]*  
 ![Prueba2](./evidencia/ConfirmaciónConCampoContraseña.png)

 *[Captura de validación de contraseña obligatoria]*  
 ![Prueba3](./evidencia/ValidaciónContraseñaObligatoria.png)

 *[Captura del login con "Credenciales incorrectas"]*
 ![Prueba4](./evidencia/CredencialesIncorrectas.png)