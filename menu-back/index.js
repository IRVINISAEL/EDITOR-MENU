const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "menumaster_secret_key";

// Middlewares
app.use(cors());
app.use(express.json());

// ============================
// MIDDLEWARE DE AUTENTICACIÓN JWT
// ============================
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado" });
  }
};

// ============================
// CONEXIÓN A MYSQL
// ============================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root1234",
  database: process.env.DB_NAME || "menumaster",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
    console.log("⚠️ Servidor corriendo sin base de datos");
    return;
  }
  console.log("✅ Conectado a MySQL correctamente");
  console.log(`🗄️  DB_HOST: ${process.env.DB_HOST}`);
  console.log(`🗄️  DB_NAME: ${process.env.DB_NAME}`);
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
    
    const usuario = results[0];
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.json({
      ok: true,
      mensaje: "Login exitoso",
      usuario: usuario,
      token: token,
    });
  });
});

// ============================
// RUTAS DE MENÚS
// ============================

// GET - Obtener todos los menús (PROTEGIDO - Solo del usuario autenticado)
app.get("/api/menus", verifyJWT, (req, res) => {
  // CA-01: Obtener el user_id exclusivamente del JWT
  const user_id = req.usuario.id;

  // CA-02: Ignorar completamente cualquier parámetro user_id enviado por el cliente
  const sql = "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menús" });
    }
    res.json({ ok: true, total: results.length, menus: results });
  });
});

// GET - Obtener un menú por ID (PROTEGIDO - Verificar propiedad)
app.get("/api/menus/:id", verifyJWT, (req, res) => {
  const user_id = req.usuario.id;
  const menu_id = req.params.id;

  const sql = "SELECT * FROM menus WHERE id = ? AND user_id = ?";
  db.query(sql, [menu_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menú" });
    }
    if (results.length === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, menu: results[0] });
  });
});

// POST - Crear menú (PROTEGIDO - Usar usuario autenticado)
app.post("/api/menus", verifyJWT, (req, res) => {
  const { nombre, estado, data_json } = req.body;
  const user_id = req.usuario.id;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio" });
  }

  const sql = "INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, estado || "Borrador", data_json || "{}", user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al crear menú" });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Menú creado correctamente",
      menuId: result.insertId,
    });
  });
});

// PUT - Actualizar menú (PROTEGIDO - Verificar propiedad)
app.put("/api/menus/:id", verifyJWT, (req, res) => {
  const { nombre, estado, data_json } = req.body;
  const user_id = req.usuario.id;
  const menu_id = req.params.id;

  // Verificar que el menú pertenece al usuario autenticado
  const checkSql = "SELECT id FROM menus WHERE id = ? AND user_id = ?";
  db.query(checkSql, [menu_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
    }
    if (results.length === 0) {
      return res.status(403).json({ ok: false, mensaje: "No tienes permiso para actualizar este menú" });
    }

    const updateSql = "UPDATE menus SET nombre = ?, estado = ?, data_json = ? WHERE id = ?";
    db.query(updateSql, [nombre, estado, data_json, menu_id], (err, result) => {
      if (err) {
        return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
      }
      res.json({ ok: true, mensaje: "Menú actualizado correctamente" });
    });
  });
});

// DELETE - Eliminar menú (PROTEGIDO - Verificar propiedad)
app.delete("/api/menus/:id", verifyJWT, (req, res) => {
  const user_id = req.usuario.id;
  const menu_id = req.params.id;

  // Verificar que el menú pertenece al usuario autenticado antes de eliminar
  const checkSql = "SELECT id FROM menus WHERE id = ? AND user_id = ?";
  db.query(checkSql, [menu_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
    }
    if (results.length === 0) {
      return res.status(403).json({ ok: false, mensaje: "No tienes permiso para eliminar este menú" });
    }

    const deleteSql = "DELETE FROM menus WHERE id = ?";
    db.query(deleteSql, [menu_id], (err, result) => {
      if (err) {
        return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
      }
      res.json({ ok: true, mensaje: "Menú eliminado correctamente" });
    });
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
