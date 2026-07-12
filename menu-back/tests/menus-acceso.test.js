const request = require("supertest");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

// Simulamos la app sin conectar a la BD real
const express = require("express");
const app = express();
app.use(express.json());

// Middleware verificarToken (igual que en index.js)
const verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, mensaje: "Token requerido" });
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado" });
  }
};

// Base de datos simulada en memoria
const menusFake = [
  { id: 1, user_id: 10, nombre: "Menú Usuario A" },
  { id: 2, user_id: 20, nombre: "Menú Usuario B" },
];

// Endpoints simulados para pruebas
app.get("/api/menus", verificarToken, (req, res) => {
  // ✅ Correcto: filtra por usuario autenticado
  const misMenus = menusFake.filter(m => m.user_id === req.usuario.id);
  res.json({ ok: true, menus: misMenus });
});

app.get("/api/menus/:id", verificarToken, (req, res) => {
  const menu = menusFake.find(m => m.id === parseInt(req.params.id));
  if (!menu) return res.status(404).json({ ok: false, mensaje: "No encontrado" });
  if (menu.user_id !== req.usuario.id) {
    return res.status(403).json({ ok: false, mensaje: "Acceso denegado" });
  }
  res.json({ ok: true, menu });
});

app.put("/api/menus/:id", verificarToken, (req, res) => {
  const menu = menusFake.find(m => m.id === parseInt(req.params.id));
  if (!menu) return res.status(404).json({ ok: false, mensaje: "No encontrado" });
  if (menu.user_id !== req.usuario.id) {
    return res.status(403).json({ ok: false, mensaje: "Acceso denegado" });
  }
  res.json({ ok: true, mensaje: "Actualizado" });
});

app.delete("/api/menus/:id", verificarToken, (req, res) => {
  const menu = menusFake.find(m => m.id === parseInt(req.params.id));
  if (!menu) return res.status(404).json({ ok: false, mensaje: "No encontrado" });
  if (menu.user_id !== req.usuario.id) {
    return res.status(403).json({ ok: false, mensaje: "Acceso denegado" });
  }
  res.json({ ok: true });
});

// ── Tokens de prueba ──────────────────────────────────
const tokenUsuarioA = jwt.sign({ id: 10, email: "usuarioa@test.com" }, JWT_SECRET);
const tokenUsuarioB = jwt.sign({ id: 20, email: "usuariob@test.com" }, JWT_SECRET);

// ════════════════════════════════════════════════════════
// PRUEBAS
// ════════════════════════════════════════════════════════

describe("HU-78 — Control de acceso entre usuarios", () => {

  // CA-01: Aislamiento en listado
  describe("CA-01 — Aislamiento en GET /api/menus", () => {

    test("Usuario A solo ve sus propios menús", async () => {
      const res = await request(app)
        .get("/api/menus")
        .set("Authorization", `Bearer ${tokenUsuarioA}`);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.menus.every(m => m.user_id === 10)).toBe(true);
    });

    test("Usuario B solo ve sus propios menús", async () => {
      const res = await request(app)
        .get("/api/menus")
        .set("Authorization", `Bearer ${tokenUsuarioB}`);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.menus.every(m => m.user_id === 20)).toBe(true);
    });

    test("Usuario A no ve menús de Usuario B en su listado", async () => {
      const res = await request(app)
        .get("/api/menus")
        .set("Authorization", `Bearer ${tokenUsuarioA}`);
      const tieneMenusDeB = res.body.menus.some(m => m.user_id === 20);
      expect(tieneMenusDeB).toBe(false);
    });

  });

  // CA-02: 403 en operaciones ajenas
  describe("CA-02 — 403 Forbidden en operaciones sobre menús ajenos", () => {

    test("GET menú ajeno → 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/menus/2") // menú del usuario B
        .set("Authorization", `Bearer ${tokenUsuarioA}`); // token usuario A
      expect(res.status).toBe(403);
      expect(res.body.ok).toBe(false);
    });

    test("PUT menú ajeno → 403 Forbidden", async () => {
      const res = await request(app)
        .put("/api/menus/2")
        .set("Authorization", `Bearer ${tokenUsuarioA}`)
        .send({ nombre: "Intento editar menú ajeno", estado: "Borrador" });
      expect(res.status).toBe(403);
      expect(res.body.ok).toBe(false);
    });

    test("DELETE menú ajeno → 403 Forbidden", async () => {
      const res = await request(app)
        .delete("/api/menus/2")
        .set("Authorization", `Bearer ${tokenUsuarioA}`);
      expect(res.status).toBe(403);
      expect(res.body.ok).toBe(false);
    });

    test("Acceso sin token → 401 Unauthorized", async () => {
      const res = await request(app).get("/api/menus");
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
    });

  });

});