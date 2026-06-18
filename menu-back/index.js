const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// ============================
// CONEXIÓN A MYSQL
// ============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error MySQL:", err);
    return;
  }

  console.log("✅ Conectado a MySQL correctamente");
  connection.release();
});

// ============================
// RUTA DE PRUEBA
// ============================
app.get("/", (req, res) => {
  res.json({
    mensaje: "✅ Menu Master API funcionando con MySQL",
    version: "2.0.0",
  });
});

// ============================
// RUTAS DE USUARIOS
// ============================

// POST - Registro
app.post("/api/auth/register", (req, res) => {
  const { nombre, email, password, negocio } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO usuarios (nombre, email, password, negocio) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, email, password, negocio || ""], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ ok: false, mensaje: "Este correo ya está registrado" });
      }
      return res.status(500).json({ ok: false, mensaje: "Error al registrar usuario" });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente",
      userId: result.insertId,
    });
  });
});

// POST - Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, mensaje: "Email y contraseña son obligatorios" });
  }

  const sql = "SELECT id, nombre, email, plan FROM usuarios WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(401).json({ ok: false, mensaje: "Correo o contraseña incorrectos" });
    }
    res.json({
      ok: true,
      mensaje: "Login exitoso",
      usuario: results[0],
      token: "token-" + results[0].id + "-menumaster",
    });
  });
});

// ============================
// RUTAS DE MENÚS
// ============================

// GET - Obtener todos los menús
app.get("/api/menus", (req, res) => {
  const user_id = req.query.user_id;

  const sql = user_id
    ? "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC"
    : "SELECT * FROM menus ORDER BY created_at DESC";

  const params = user_id ? [user_id] : [];

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menús" });
    }
    res.json({ ok: true, total: results.length, menus: results });
  });
});

// GET - Obtener un menú por ID
app.get("/api/menus/:id", (req, res) => {
  const sql = "SELECT * FROM menus WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menú" });
    }
    if (results.length === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, menu: results[0] });
  });
});

// POST - Crear menú
app.post("/api/menus", (req, res) => {
  console.log("BODY MENUS:", req.body);

  const { nombre, estado, data_json, user_id } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio" });
  }

  const sql = "INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, estado || "Borrador", data_json || "{}", user_id || 1], (err, result) => {
   if (err) {
  console.error("ERROR INSERT MENU:", err);

  return res.status(500).json({
    ok: false,
    mensaje: err.message
  });
}
    res.status(201).json({
      ok: true,
      mensaje: "Menú creado correctamente",
      menuId: result.insertId,
    });
  });
});

// PUT - Actualizar menú
app.put("/api/menus/:id", (req, res) => {
  const { nombre, estado, data_json } = req.body;
  const sql = "UPDATE menus SET nombre = ?, estado = ?, data_json = ? WHERE id = ?";
  db.query(sql, [nombre, estado, data_json, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, mensaje: "Menú actualizado correctamente" });
  });
});

// DELETE - Eliminar menú
app.delete("/api/menus/:id", (req, res) => {
  const sql = "DELETE FROM menus WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, mensaje: "Menú eliminado correctamente" });
  });
});

// ============================
// ARRANCAR SERVIDOR
// ============================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🗄️  DB_HOST: ${process.env.DB_HOST}`);
  console.log(`🗄️  DB_NAME: ${process.env.DB_NAME}`);
  console.log(`🗄️  DB_PORT: ${process.env.DB_PORT}`);
});
