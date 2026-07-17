# Evidencia HU-88 — Estadísticas reales de vistas de menús

**Fecha** 16/07/2026  
**QA** María José Linares Cortés  
**Rama** test/hu88-analiticas  
**URL probada** https://editor-menu-ausx.vercel.app/analiticas



## Estado de la HU
 **PARCIALMENTE BLOQUEADA** — El frontend muestra datos simulados y el backend no tiene el endpoint de estadísticas implementado.



## Verificación de dependencias

| Dependencia | Estado |
|---|---|
| Endpoint GET /api/menus/:id/estadisticas |  No implementado |
| Registro de vistas en backend |  No implementado |
| Tabla vistas_menu en base de datos |  No verificado |
| Frontend mostrando datos reales |  Datos hardcodeados (simulados) |
| Menú público funcionando |  Disponible |
| Usuario autenticado |  Disponible |

---

## Pruebas realizadas

| # | Caso de prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| CA-01 | Registro de vista al abrir menú público | Sistema registra una vista en la BD | No existe endpoint ni tabla de vistas en el backend |  FAIL |
| CA-02 | Dashboard muestra estadísticas reales | Datos reales de vistas del usuario | El dashboard muestra datos simulados hardcodeados (1,256 vistas, 342 descargas, 786 QR escaneos) |  FAIL |
| RN-01 | Solo se registran vistas de menús publicados | Sistema valida estado del menú | No implementado |  FAIL |
| RN-02 | Vista asociada al menú correspondiente | Vista con menu_id correcto | No implementado |  FAIL |
| RN-03 | Solo el propietario consulta estadísticas | Endpoint protegido con JWT | No implementado |  FAIL |
| RN-04 | Estadísticas se actualizan automáticamente | Datos en tiempo real | No implementado |  FAIL |



## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 6 | 0 | 0 | 6 |



## Observaciones

- El módulo de Analíticas en el frontend muestra datos hardcodeados: 1,256 vistas, 342 descargas, 786 QR escaneos con fecha "01 May 2024 - 31 May 2024".
- El backend no tiene ningún endpoint relacionado con vistas o estadísticas en `menu-back/index.js`.
- La tabla `vistas_menu` no fue verificada pero se infiere que no existe dado que el backend no la utiliza.



## Recomendaciones

1. Backend debe crear la tabla `vistas_menu` con la estructura definida en la HU
2. Backend debe implementar el registro de vistas en `GET /api/public/menus/:id`
3. Backend debe crear el endpoint `GET /api/menus/:id/estadisticas`
4. Frontend debe consumir el endpoint real y eliminar los datos hardcodeados



## Evidencia

Captura 1 — del dashboard de Analíticas mostrando datos simulados
![Prueba1](./evidencia/evidencia-Analíticas mostrando datos simulados.png)

Captura 2 — del frontend con datos hardcodeados en page.tsx 
![Prueba2](./evidencia/evidencia-frontend con datos hardcodeados en page-tsx.png)

