const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-super-segura-cambiar-en-produccion";
const PASSWORD_RESET_EXPIRATION_MINUTES = parseInt(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || "60", 10);

// Middlewares
app.use(cors());
app.use(express.json());

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDateToMySql(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function isValidMenuState(estado) {
  return ["Borrador", "Publicado", "Archivado"].includes(estado);
}

// ============================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================
const verificarToken = (req, res, next) => {
  // Buscar el token en el header Authorization o en el query string
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: "Token no proporcionado" });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ ok: false, mensaje: "Token expirado" });
    }
    return res.status(401).json({ ok: false, mensaje: "Token inválido o malformado" });
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
app.post("/api/auth/register", async (req, res) => {
  const { nombre, email, password, negocio } = req.body;

  // Validación de campos obligatorios y tipos
  if (!nombre || typeof nombre !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio y debe ser texto" });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El correo es obligatorio y debe ser texto" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ ok: false, mensaje: "La contraseña es obligatoria y debe ser texto" });
  }

  // Validación de formato del nombre
  const trimmedNombre = nombre.trim();
  if (trimmedNombre.length === 0 || trimmedNombre.length > 255) {
    return res.status(400).json({ ok: false, mensaje: "El nombre debe tener entre 1 y 255 caracteres" });
  }

  // Validación de email
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, mensaje: "El correo electrónico no es válido" });
  }

  // Validación de contraseña
  if (password.length < 8) {
    return res.status(400).json({ ok: false, mensaje: "La contraseña debe tener al menos 8 caracteres" });
  }

  // Validación de negocio si se proporciona
  if (negocio && typeof negocio !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El nombre del negocio debe ser texto" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO usuarios (nombre, email, password, negocio) VALUES (?, ?, ?, ?)";
    db.query(sql, [trimmedNombre, email.toLowerCase(), hashedPassword, negocio?.trim() || ""], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ ok: false, mensaje: "Este correo ya está registrado" });
        }
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({ ok: false, mensaje: "Error al registrar usuario" });
      }
      res.status(201).json({
        ok: true,
        mensaje: "Usuario registrado correctamente",
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Error al procesar la contraseña:", error);
    return res.status(500).json({ ok: false, mensaje: "Error al procesar la contraseña" });
  }
});

// POST - Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Validación de campos obligatorios y tipos
  if (!email || typeof email !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El correo es obligatorio y debe ser texto" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ ok: false, mensaje: "La contraseña es obligatoria y debe ser texto" });
  }

  // Validación de email
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, mensaje: "El correo electrónico no es válido" });
  }

  const sql = "SELECT id, nombre, email, plan, password FROM usuarios WHERE email = ?";
  db.query(sql, [email.toLowerCase()], async (err, results) => {
    if (err) {
      console.error("Error al consultar usuario:", err);
      return res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(401).json({ ok: false, mensaje: "Correo o contraseña incorrectos" });
    }

    const user = results[0];
    try {
      const storedPassword = user.password;
      const passwordMatch = storedPassword?.startsWith("$2")
        ? await bcrypt.compare(password, storedPassword)
        : password === storedPassword;

      if (!passwordMatch) {
        return res.status(401).json({ ok: false, mensaje: "Correo o contraseña incorrectos" });
      }

      // Migrar contraseña antigua a bcrypt si es necesario
      if (storedPassword && !storedPassword.startsWith("$2")) {
        const newHash = await bcrypt.hash(password, 10);
        db.query("UPDATE usuarios SET password = ? WHERE id = ?", [newHash, user.id], () => {});
      }

      // Generar JWT token con expiración de 24 horas
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

      res.json({
        ok: true,
        mensaje: "Login exitoso",
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          plan: user.plan,
        },
        token: token,
      });
    } catch (error) {
      console.error("Error al verificar la contraseña:", error);
      return res.status(500).json({ ok: false, mensaje: "Error al verificar la contraseña" });
    }
  });
});

// POST - Solicitar recuperación de contraseña
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, mensaje: "El correo electrónico no es válido" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRATION_MINUTES * 60 * 1000);
  const tokenExpiration = formatDateToMySql(expiresAt);

  const sql = "UPDATE usuarios SET reset_token = ?, reset_token_expiration = ? WHERE email = ?";
  db.query(sql, [token, tokenExpiration, email], (err) => {
    if (err) {
      console.error("Error al guardar el token de recuperación:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al procesar la solicitud" });
    }

    console.log(`🔐 Recovery token for ${email}: ${token}`);
    return res.json({ ok: true, mensaje: "Si el correo existe, se ha enviado un enlace de recuperación" });
  });
});

// GET - Validar token de recuperación
app.get("/api/auth/reset-password/:token", (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ ok: false, mensaje: "Token inválido" });
  }

  const sql = "SELECT id, reset_token_expiration FROM usuarios WHERE reset_token = ?";
  db.query(sql, [token], (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });
    }

    const expiration = results[0].reset_token_expiration;
    if (!expiration || new Date(expiration) < new Date()) {
      return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });
    }

    res.json({ ok: true, mensaje: "Token válido" });
  });
});

// POST - Restablecer contraseña
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ ok: false, mensaje: "Token y contraseña son obligatorios" });
  }

  if (password.length < 8) {
    return res.status(400).json({ ok: false, mensaje: "La contraseña debe tener al menos 8 caracteres" });
  }

  const sql = "SELECT id, reset_token_expiration FROM usuarios WHERE reset_token = ?";
  db.query(sql, [token], async (err, results) => {
    if (err) {
      return res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });
    }

    const row = results[0];
    if (!row.reset_token_expiration || new Date(row.reset_token_expiration) < new Date()) {
      return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateSql = "UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?";
      db.query(updateSql, [hashedPassword, row.id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ ok: false, mensaje: "Error al actualizar la contraseña" });
        }
        res.json({ ok: true, mensaje: "Contraseña actualizada correctamente" });
      });
    } catch (hashError) {
      return res.status(500).json({ ok: false, mensaje: "Error al cifrar la contraseña" });
    }
  });
});

// ============================
// RUTAS DE MENÚS
// ============================

// GET - Obtener todos los menús
app.get("/api/menus", verificarToken, (req, res) => {
  const user_id = req.query.user_id;

  // Validar que user_id sea número si se proporciona
  if (user_id && isNaN(parseInt(user_id, 10))) {
    return res.status(400).json({ ok: false, mensaje: "El ID de usuario debe ser un número" });
  }

  const sql = user_id
    ? "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC"
    : "SELECT * FROM menus ORDER BY created_at DESC";

  const params = user_id ? [user_id] : [];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener menús:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menús" });
    }
    res.json({ ok: true, total: results.length, menus: results });
  });
});

// GET - Obtener un menú por ID
app.get("/api/menus/:id", verificarToken, (req, res) => {
  const menuId = parseInt(req.params.id, 10);

  if (isNaN(menuId)) {
    return res.status(400).json({ ok: false, mensaje: "El ID del menú debe ser un número" });
  }

  const sql = "SELECT * FROM menus WHERE id = ?";
  db.query(sql, [menuId], (err, results) => {
    if (err) {
      console.error("Error al obtener menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menú" });
    }
    if (results.length === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, menu: results[0] });
  });
});

// POST - Crear menú
app.post("/api/menus", verificarToken, (req, res) => {
  const { nombre, estado, data_json, user_id } = req.body;

  // Validación de campos obligatorios
  if (!nombre || typeof nombre !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio y debe ser texto" });
  }

  // Validación de nombre (no vacío, máximo 255 caracteres)
  const trimmedNombre = nombre.trim();
  if (trimmedNombre.length === 0 || trimmedNombre.length > 255) {
    return res.status(400).json({ ok: false, mensaje: "El nombre debe tener entre 1 y 255 caracteres" });
  }

  // Validación de estado
  const menuState = estado || "Borrador";
  if (!isValidMenuState(menuState)) {
    return res.status(400).json({ ok: false, mensaje: "Estado de menú inválido. Debe ser: Borrador, Publicado o Archivado" });
  }

  // Validación de data_json si se proporciona
  if (data_json && !isValidJSON(data_json)) {
    return res.status(400).json({ ok: false, mensaje: "data_json debe ser un JSON válido" });
  }

  // Validación de user_id
  const finalUserId = user_id || req.userId || 1;
  if (isNaN(parseInt(finalUserId, 10))) {
    return res.status(400).json({ ok: false, mensaje: "El ID de usuario debe ser un número" });
  }

  const sql = "INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [trimmedNombre, menuState, data_json || "{}", finalUserId], (err, result) => {
    if (err) {
      console.error("Error al crear menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al crear menú" });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Menú creado correctamente",
      menuId: result.insertId,
    });
  });
});

// PUT - Actualizar menú
app.put("/api/menus/:id", verificarToken, (req, res) => {
  const menuId = parseInt(req.params.id, 10);

  if (isNaN(menuId)) {
    return res.status(400).json({ ok: false, mensaje: "El ID del menú debe ser un número" });
  }

  const { nombre, estado, data_json } = req.body;

  // Validación de campos
  if (nombre && typeof nombre !== "string") {
    return res.status(400).json({ ok: false, mensaje: "El nombre debe ser texto" });
  }

  if (nombre) {
    const trimmedNombre = nombre.trim();
    if (trimmedNombre.length === 0 || trimmedNombre.length > 255) {
      return res.status(400).json({ ok: false, mensaje: "El nombre debe tener entre 1 y 255 caracteres" });
    }
  }

  if (estado && !isValidMenuState(estado)) {
    return res.status(400).json({ ok: false, mensaje: "Estado de menú inválido. Debe ser: Borrador, Publicado o Archivado" });
  }

  if (data_json && !isValidJSON(data_json)) {
    return res.status(400).json({ ok: false, mensaje: "data_json debe ser un JSON válido" });
  }

  const sql = "UPDATE menus SET nombre = COALESCE(?, nombre), estado = COALESCE(?, estado), data_json = COALESCE(?, data_json) WHERE id = ?";
  db.query(sql, [nombre || null, estado || null, data_json || null, menuId], (err, result) => {
    if (err) {
      console.error("Error al actualizar menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, mensaje: "Menú actualizado correctamente" });
  });
});

// DELETE - Eliminar menú
app.delete("/api/menus/:id", verificarToken, (req, res) => {
  const menuId = parseInt(req.params.id, 10);

  if (isNaN(menuId)) {
    return res.status(400).json({ ok: false, mensaje: "El ID del menú debe ser un número" });
  }

  const sql = "DELETE FROM menus WHERE id = ?";
  db.query(sql, [menuId], (err, result) => {
    if (err) {
      console.error("Error al eliminar menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
    res.json({ ok: true, mensaje: "Menú eliminado correctamente" });
  });
});

// ============================
// MIDDLEWARE CENTRALIZADO DE ERRORES
// ============================
app.use((err, req, res, next) => {
  console.error("Error capturado:", {
    mensaje: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  // No exponer detalles del error al cliente
  const statusCode = err.statusCode || 500;
  const mensaje = statusCode === 500 ? "Error interno del servidor" : err.message;

  res.status(statusCode).json({
    ok: false,
    mensaje: mensaje,
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: "Ruta no encontrada",
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
