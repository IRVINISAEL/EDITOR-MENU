const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, mensaje: "Token requerido" });
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret_dev");
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado" });
  }
};

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
  if (err) { console.error("❌ Error MySQL:", err); return; }
  console.log("✅ Conectado a MySQL correctamente");
  connection.release();
});

app.get("/", (req, res) => res.json({ ok: true, version: "3.0.1" }));

// Obter menus, opcionalmente filtrando por user_id
app.get("/api/menus", verificarToken, (req, res) => {
  const user_id = req.query.user_id;
  const sql = user_id ? "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC" : "SELECT * FROM menus ORDER BY created_at DESC";
  const params = user_id ? [user_id] : [];
  db.query(sql, params, (err, results) => {
    if (err) { console.error("ERROR GET MENUS:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
    res.json({ ok: true, menus: results });
  });
});

app.get("/api/menus/:id", (req, res) => {
  db.query("SELECT * FROM menus WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    res.json({ ok: true, menu: results[0] });
  });
});

app.post("/api/menus", verificarToken, (req, res) => {
  console.log("BODY:", req.body);
  const { nombre, estado, data_json, user_id } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query("INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)",
    [nombre, estado || "Borrador", dataJson, user_id || 1],
    (err, result) => {
      if (err) { console.error("ERROR INSERT:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      res.status(201).json({ ok: true, menuId: result.insertId });
    });
});

app.put("/api/menus/:id", verificarToken, (req, res) => {
  const { nombre, estado, data_json } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query("UPDATE menus SET nombre = ?, estado = ?, data_json = ? WHERE id = ?",
    [nombre, estado, dataJson, req.params.id],
    (err, result) => {
      if (err) { console.error("ERROR UPDATE:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      res.json({ ok: true, mensaje: "Actualizado" });
    });
});

app.delete("/api/menus/:id", verificarToken, (req, res) => {
  db.query("DELETE FROM menus WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "No encontrado" });
    res.json({ ok: true });
  });
});

app.post("/api/auth/register", async (req, res) => {
  const { nombre, email, password, negocio} = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ ok: false, mensaje: "Campos obligatorios" });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query("INSERT INTO usuarios (nombre, email, password, negocio) VALUES (?, ?, ?, ?)",
      [nombre, email, hash,  negocio || ""],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ ok: false, mensaje: "Correo ya registrado" });
          return res.status(500).json({ ok: false, mensaje: err.message });
        }
        res.status(201).json({ ok: true, userId: result.insertId });
      });
  } catch (e) {
    res.status(500).json({ ok: false, mensaje: "Error al procesar contraseña" });
  }
});

app.put("/api/auth/password", verificarToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, mensaje: "Contraseña actual y nueva son obligatorias" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ ok: false, mensaje: "La nueva contraseña debe tener al menos 8 caracteres" });
  }

  db.query("SELECT password FROM usuarios WHERE id = ?", [req.usuario.id], async (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });

    const currentHash = results[0].password;
    const matches = await bcrypt.compare(currentPassword, currentHash);
    if (!matches) return res.status(401).json({ ok: false, mensaje: "Contraseña actual incorrecta" });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE usuarios SET password = ? WHERE id = ?", [newHash, req.usuario.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ ok: false, mensaje: updateErr.message });
      res.json({ ok: true, mensaje: "Contraseña actualizada" });
    });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, mensaje: "Campos obligatorios" });
  db.query("SELECT id, nombre, email, plan, password FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      if (results.length === 0) return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
      const valido = await bcrypt.compare(password, results[0].password);
      if (!valido) return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
      const { password: _, ...usuario } = results[0];
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || "secret_dev",
        { expiresIn: "7d" }
      );
      res.json({ ok: true, usuario, token });
    });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});
