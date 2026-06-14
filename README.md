# <img src="https://img.magnific.com/vector-premium/icono-tarjeta-menu-ilustracion-simple-icono-vector-tarjeta-menu-diseno-web-aislado-sobre-fondo-blanco_98396-28746.jpg?semt=ais_hybrid&w=740&q=80" width="40"/> Menu Master
> SaaS para restaurantes y negocios de comida que permite crear, personalizar y compartir menús digitales de forma rápida, sin necesidad de conocimientos de diseño.

---

## <img src="https://img.shields.io/badge/Equipo-4B0082?style=flat" /> Equipo

| Nombre | Rol |
|---|---|
| Irvin Martínez | Tech Lead / Software Architect |
| Ángel Romero | Product Engineer / Full Stack |
| Kevin Rojas | Product Owner / Business Lead |
| María José Linares | QA / Delivery / Operations |

---

## <img src="https://img.shields.io/badge/ Stack Tecnológico-1a1a2e?style=flat" /> > Stack tecnológico

**Frontend** → `menu-front/`
- Next.js 15
- TypeScript
- Tailwind CSS
- jsPDF + html2canvas (exportar PDF)

**Backend** → `menu-back/`
- Node.js
- Express.js
- MySQL2
- dotenv · cors

---

## <img src="https://img.shields.io/badge/ Estructura-0d3b66?style=flat" /> Estructura del proyecto

```
EDITOR-MENU/
├── menu-front/     # Frontend en Next.js
├── menu-back/      # Backend en Express
├── docs/           # Documentación del equipo
│   ├── github-flow.md
│   └── propuesta-de-valor.md
├── CONTRIBUTING.md
└── README.md
```

---

## <img src="https://img.shields.io/badge/ Cómo Correrlo-006400?style=flat" /> Cómo correr el proyecto

### Frontend

```bash
cd menu-front
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Backend

```bash
cd menu-back
npm install
cp .env.example .env
# Llena las variables del .env con tus credenciales
node index.js
```

---

## <img src="https://img.shields.io/badge/ Variables de Entorno-8B0000?style=flat" /> Variables de entorno

Crea un archivo `.env` dentro de `menu-back/` basándote en `.env.example`:

```env
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
PORT=3001
```

> <img src="https://img.shields.io/badge/Equipo-4B0082?style=flat" /> Nunca subas el archivo `.env` al repositorio.

---

## <img src="https://img.shields.io/badge/ Ramas-2d6a4f?style=flat" /> Ramas y flujo de trabajo

Usamos **GitHub Flow**. Consulta [`docs/github-flow.md`](docs/github-flow.md) para el flujo completo.

| Prefijo | Para qué se usa |
|---|---|
| `feature/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `docs/` | Documentación |
| `chore/` | Configuración o setup |
| `test/` | Pruebas |

**Reglas:**
- ❌ Nadie trabaja directo en `main`
- ✅ Todo cambio entra por Pull Request
- ✅ Todo PR necesita revisión de un compañero antes del merge

---

## <img src="https://img.shields.io/badge/ Deploy-FF6B00?style=flat" /> Deploy

| Servicio | URL |
|---|---|
| Frontend | Vercel |
| Backend | Railway |
| Base de datos | MySQL |

---

## 📄 Licencia

Proyecto académico — SAAS Studio · 9° Cuatrimestre · 2025
