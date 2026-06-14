const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root1234",
  database: process.env.DB_NAME || "menumaster",
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err.message);
    return;
  }
  console.log("Conectado a MySQL correctamente");
});

app.get("/", (req, res) => {
  res.json({ mensaje: "✅ Menu Master API funcionando con MySQL", version: "2.0.0" });
});

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
    res.status(201).json({ ok: true, mensaje: "Usuario registrado correctamente", userId: result.insertId });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, mensaje: "Email y contraseña son obligatorios" });
  }
  const sql = "SELECT id, nombre, email, plan FROM usuarios WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    if (results.length === 0) return res.status(401).json({ ok: false, mensaje: "Correo o contraseña incorrectos" });
    res.json({ ok: true, mensaje: "Login exitoso", usuario: results[0], token: "token-" + results[0].id + "-menumaster" });
  });
});

app.get("/api/menus", (req, res) => {
  const user_id = req.query.user_id;
  const sql = user_id ? "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC" : "SELECT * FROM menus ORDER BY created_at DESC";
  db.query(sql, user_id ? [user_id] : [], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: "Error al obtener menús" });
    res.json({ ok: true, total: results.length, menus: results });
  });
});

app.get("/api/menus/:id", (req, res) => {
  db.query("SELECT * FROM menus WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: "Error al obtener menú" });
    if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    res.json({ ok: true, menu: results[0] });
  });
});

app.post("/api/menus", (req, res) => {
  const { nombre, estado, data_json, user_id } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio" });
  db.query("INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)",
    [nombre, estado || "Borrador", data_json || "{}", user_id || 1],
    (err, result) => {
      if (err) return res.status(500).json({ ok: false, mensaje: "Error al crear menú" });
      res.status(201).json({ ok: true, mensaje: "Menú creado correctamente", menuId: result.insertId });
    });
});

app.put("/api/menus/:id", (req, res) => {
  const { nombre, estado, data_json } = req.body;
  db.query("UPDATE menus SET nombre = ?, estado = ?, data_json = ? WHERE id = ?",
    [nombre, estado, data_json, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      res.json({ ok: true, mensaje: "Menú actualizado correctamente" });
    });
});

app.delete("/api/menus/:id", (req, res) => {
  db.query("DELETE FROM menus WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    res.json({ ok: true, mensaje: "Menú eliminado correctamente" });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});