# Test Cases - LANDING PAGE MenuMaster
**URL** https://editor-menu.vercel.app/landing
**FECHA** 23/05/2026
**RAMA** test/landing-qa

---

| # | Qué probé | Cómo lo probé | Qué esperaba | Qué pasó | Estado |
|---|-----------|---------------|--------------|----------|--------|
| 1 | La página carga sin errores | Abrí la URL en Edge y revisé la consola con F12 | La página carga completa sin errores en consola | La consola muestra "No errors" |  PASS |
| 2 | El botón CTA funciona | Hice clic en el botón "Agenda ahora!!" | Redirigir al usuario a una acción | Abre un formulario de Google correctamente |  PASS |
| 3 | Se ve bien en celular | Chrome DevTools F12 → iPhone 12 Pro en Edge | Todos los elementos se adaptan correctamente | La página es responsive pero hay un espacio vacío grande en la sección intermedia |  WARN |
| 4 | Compatibilidad en Firefox | Abrí la URL en Firefox y revisé visualmente | La página se ve igual que en Edge | La página se visualiza correctamente, idéntica a Edge |  PASS |
| 5 | Los textos se leen bien | Scroll completo por toda la página en Edge y Firefox | Todos los textos legibles sin cortes ni desbordamiento | Todos los textos se leen correctamente, buen contraste y orden |  PASS |
| 6 | No hay imágenes rotas | Revisé visualmente toda la página haciendo scroll | No aparece ningún ícono de imagen rota | Todas las imágenes y elementos visuales cargan correctamente |  PASS |
| 7 | Navegación interna funciona | Hice clic en links "Solución" y "Contacto" del nav | Llevar al usuario a la sección correcta | "Solución" muestra contenido incorrecto y "Contacto" redirige al CTA en lugar de la sección de contacto |  FAIL |
| 8 | Se ve bien en tablet | Abrí la URL en tablet Samsung | La página se adapta al 100% del ancho | La página deja un espacio en blanco del lado derecho y el email en Contacto se desborda del contenedor |  WARN |
---

## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 7 | 5 | 2 | 1 |

---

## Bugs encontrados

### BUG-01 — Navegación interna no ancla correctamente
- **Severidad** Media
- **Sección afectada** Navbar
- **Pasos para reproducir**
  1. Entrar a la landing page en Vercel
  2. Hacer clic en "Solución" del menú de navegación
  3. Hacer clic en "Contacto" del menú de navegación
- **Comportamiento esperado** Llevar al usuario a la sección correspondiente
- **Comportamiento actual** "Solución" muestra contenido de la sección siguiente y "Contacto" redirige al CTA
- **Issue** #6

### BUG-02 — Espacio vacío en vista móvil
- **Severidad** Baja
- **Sección afectada** Sección intermedia en móvil
- **Pasos para reproducir**
  1. Abrir la landing en modo móvil (DevTools iPhone 12 Pro)
  2. Hacer scroll hasta la sección intermedia
- **Comportamiento esperado** Contenido bien distribuido sin espacios vacíos
- **Comportamiento actual** Aparece un espacio negro vacío grande entre secciones
- **Issue** #7

### BUG-03 — Layout no se adapta completamente en vista tablet
- **Severidad** Media
- **Sección afectada** General y sección Contacto
- **Pasos para reproducir**
  1. Abrir la landing en tablet Samsung
  2. Revisar el lado derecho de la pantalla
  3. Hacer scroll hasta la sección Contacto
- **Comportamiento esperado** La página ocupa el 100% del ancho y el email se mantiene dentro del contenedor
- **Comportamiento actual** Aparece un espacio en blanco del lado derecho y el email de contacto se desborda fuera del contenedor
- **Issue** #8

---

## Evidencia

### Prueba 1 - f12 Navegador Edge 
![Prueba 1](./evidencia/evidenciaF12.png)

### Prueba 2 - CTA funciona 
![Prueba 2](./evidencia/CTA1.png)
![Prueba 2.1](./evidencia/CTA2.png)

### Prueba 3 - vista móvil
![Prueba 3](./evidencia/evidenciaMovil1.png)
![Prueba3.1](./evidencia/evidenciaMovil2.png)
![Prueba3.2](./evidencia/evidenciaMovil3.png)
![Prueba3.3](./evidencia/evidenciaMovil4.png)
![Prueba3.4](./evidencia/evidenciaMovil5.png)
![Prueba3.5](./evidencia/evidenciaMovil6.png)
![Prueba3.6](./evidencia/evidenciaMovil7.png)

### Prueba 4 - navegador FireFox
![Prueba ](./evidencia/firefoxnavegacion.png)

### Prueba 7 - navegacion interna
![Prueba 7](./evidencia/navegacion1.png)
![Prueba 7.1](./evidencia/navegacion2.png)

### Prueba 8 - vista tablet samsung 
![Prueba 8](./evidencia/tablet1.jpeg)
![Prueba 8.1](./evidencia/tablet2.jpeg)



---

## Resultados ACT-6 — Sistema desplegado

| # | Prueba | URL probada | Estado | Notas |
|---|--------|-------------|--------|-------|
| 1 | Landing carga | editor-menu-ausx.vercel.app/ |  PASS | Carga inmediata |
| 2 | CTA funciona | editor-menu-ausx.vercel.app/landing |  PASS | Redirige al registro |
| 3 | Responsive móvil landing | editor-menu-ausx.vercel.app/landing |  WARN | Secciones de precios y opiniones no se adaptan completas |
| 4 | Responsive tablet | editor-menu-ausx.vercel.app/ |  WARN | Contenido no se adapta en 2 secciones del dashboard |
| 5 | Backend responde | editor-menu-production.up.railway.app/ |  PASS | API activa, responde JSON |
| 6 | Login funciona | editor-menu-ausx.vercel.app/login |  PASS | Inicia sesión correctamente |
| 7 | Registro funciona | editor-menu-ausx.vercel.app/login |  PASS | Crea cuenta y confirma registro |
| 8 | Dashboard carga | editor-menu-ausx.vercel.app/ |  WARN | Carga pero error 500 en /api/menus |



## Evidencia ACT-6

### Prueba 3 — Responsive móvil landing
![Móvil Landing](./evidencia/evidencia-movilLanding.png)
![Móvil Landing 2](./evidencia/evidencia-movilLanding2.png)
![Móvil Landing 3](./evidencia/evidencia-movilLanding3.png)

### Prueba 3.1 — Responsive móvil dashboard
![Móvil MM](./evidencia/evidencia-movilDashboard.png)

### Prueba 4 — Responsive tablet
![Tablet Landing](./evidencia/evidencia-tabletLanding.png)
![Tablet Mis Menús](./evidencia/evidencia-tabletMisMenus.png)
![Tablet Facturación](./evidencia/evidencia-tabletFacturacion.png)

### Prueba 7 — Registro
![Registro](./evidencia/evidencia-registroMM.png)

### Prueba 8 — Error 500
![Error 500](./evidencia/evidencia-error500.png)




## Casos de Prueba — HU: Ver plantillas disponibles

**Fecha** 29/06/2026
**QA** María José Linares Cortés
**URL probada** https://editor-menu-ausx.vercel.app/plantillas

| # | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido | Estado |
|---|----------------|-------|-------------------|-------------------|--------|
| 1 | La página de plantillas carga correctamente | Entrar a /plantillas y revisar consola con F12 | La página carga sin errores en consola | La consola no muestra errores |  PASS |
| 2 | Se muestran todas las plantillas disponibles | Entrar a /plantillas y contar plantillas | Se muestran 16 plantillas | Muestra 12 inicialmente con opción "Ver más" que carga las 4 restantes |  WARN |
| 3 | Cada plantilla muestra su nombre | Revisar visualmente cada plantilla | Todas tienen nombre visible | Todas las plantillas muestran su nombre correctamente |  PASS |
| 4 | Cada plantilla muestra su categoría | Revisar visualmente cada plantilla | Todas tienen categoría visible | Todas las plantillas muestran su categoría correctamente |  PASS |
| 5 | Cada plantilla muestra vista previa | Revisar visualmente cada plantilla | Todas tienen imagen o preview visible | Todas las plantillas muestran vista previa correctamente |  PASS |
| 6 | Se pueden filtrar plantillas por categoría | Hacer clic en cada categoría disponible | Solo muestra las plantillas de esa categoría | El filtro funciona correctamente, muestra solo las plantillas de la categoría seleccionada | PASS |
| 7 | El botón "Me gusta" funciona | Hacer clic en me gusta de una plantilla | Se marca como favorita | El corazón cambia de blanco a rojo correctamente |  PASS |
| 8 | El botón "Editar" funciona | Hacer clic en editar de una plantilla | Redirige al editor con esa plantilla cargada | Abre el editor correctamente permitiendo modificar título, texto y contenido general de la plantilla |  PASS |
| 9 | La página se ve bien en móvil | Abrir en DevTools modo iPhone SE | Las plantillas se adaptan correctamente | Las plantillas se adaptan bien en móvil, pero se detectaron 2 observaciones: 1: El sidebar deja espacio vacío al desplegarse, 2: El editor en móvil no es funcional, los elementos se mueven al intentar editar |  WARN |
| 10 | La página se ve bien en tablet | Abrir en DevTools modo iPad Air | Las plantillas se adaptan correctamente | Las plantillas se muestran en grid de 2 columnas correctamente, pero la consola muestra  Error: Minified React error #418; |  WARN |

## Resumen

| Total pruebas | PASS | WARN | FAIL |
|---|---|---|---|
| 10 | 7 | 3 | 0 |