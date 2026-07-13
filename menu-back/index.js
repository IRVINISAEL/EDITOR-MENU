const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("./cloudinary");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-super-segura-cambiar-en-produccion";
const PASSWORD_RESET_EXPIRATION_MINUTES = parseInt(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || "60", 10);

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

// RN-04: solo formatos permitidos | RN-05: tamaño máximo (5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const permitidos = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!permitidos.includes(file.mimetype)) {
      return cb(new Error("Formato no soportado. Usa JPG, PNG o WEBP"));
    }
    cb(null, true);
  },
});

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
<<<<<<< HEAD
  const user_id = req.query.user_id;
  const sql = user_id ? "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC" : "SELECT * FROM menus ORDER BY created_at DESC";
  const params = user_id ? [user_id] : [];
  db.query(sql, params, (err, results) => {
    if (err) { console.error("ERROR GET MENUS:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
    res.json({ ok: true, menus: results });
=======
  const userId = req.userId;
  const sql = "SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener menús:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menús" });
    }
    res.json({ ok: true, total: results.length, menus: results });
>>>>>>> 8d201bb (fix: secure menu ownership by authenticated user)
  });
});

// Se agregó verificarToken aquí (antes era pública, hallazgo de seguridad corregido)
app.get("/api/menus/:id", verificarToken, (req, res) => {
<<<<<<< HEAD
  db.query("SELECT * FROM menus WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
=======
  const menuId = parseInt(req.params.id, 10);
  const userId = req.userId;

  if (isNaN(menuId)) {
    return res.status(400).json({ ok: false, mensaje: "El ID del menú debe ser un número" });
  }

  const sql = "SELECT * FROM menus WHERE id = ? AND user_id = ?";
  db.query(sql, [menuId, userId], (err, results) => {
    if (err) {
      console.error("Error al obtener menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al obtener menú" });
    }
    if (results.length === 0) {
      return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
    }
>>>>>>> 8d201bb (fix: secure menu ownership by authenticated user)
    res.json({ ok: true, menu: results[0] });
  });
});

app.post("/api/menus", verificarToken, (req, res) => {
<<<<<<< HEAD
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
=======
  const { nombre, estado, data_json } = req.body;
  const userId = req.userId;
>>>>>>> 8d201bb (fix: secure menu ownership by authenticated user)

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

<<<<<<< HEAD
    const newHash = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE usuarios SET password = ? WHERE id = ?", [newHash, req.usuario.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ ok: false, mensaje: updateErr.message });
      res.json({ ok: true, mensaje: "Contraseña actualizada" });
=======
  // Validación de data_json si se proporciona
  if (data_json && !isValidJSON(data_json)) {
    return res.status(400).json({ ok: false, mensaje: "data_json debe ser un JSON válido" });
  }

  const sql = "INSERT INTO menus (nombre, estado, data_json, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [trimmedNombre, menuState, data_json || "{}", userId], (err, result) => {
    if (err) {
      console.error("Error al crear menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al crear menú" });
    }
    res.status(201).json({
      ok: true,
      mensaje: "Menú creado correctamente",
      menuId: result.insertId,
>>>>>>> 8d201bb (fix: secure menu ownership by authenticated user)
    });
  });
});

<<<<<<< HEAD
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

// Nuevo endpoint: subir imagen a Cloudinary y asociarla a un menú
app.post("/api/upload", verificarToken, (req, res) => {
  upload.single("imagen")(req, res, async (err) => {
    // CA-04 / RN-07: si falla la validación del archivo, no se toca la BD
    if (err) {
      return res.status(400).json({ ok: false, mensaje: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, mensaje: "Imagen requerida" });
    }

    try {
      // CA-01: subir a Cloudinary
      const resultado = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "menumaster/menus" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      const imageUrl = resultado.secure_url;
      const { menu_id } = req.body;

      // CA-03 / RN-06: guardar la URL en data_json del menú, si se indicó uno
      if (menu_id) {
        db.query("SELECT data_json FROM menus WHERE id = ?", [menu_id], (err2, rows) => {
          if (err2 || rows.length === 0) {
            return res.status(201).json({
              ok: true, url: imageUrl,
              mensaje: "Imagen subida, pero no se pudo asociar al menú"
            });
          }
          let data = {};
          try { data = JSON.parse(rows[0].data_json || "{}"); } catch { data = {}; }
          data.imagen_url = imageUrl;

          db.query("UPDATE menus SET data_json = ? WHERE id = ?",
            [JSON.stringify(data), menu_id],
            (err3) => {
              if (err3) {
                return res.status(201).json({
                  ok: true, url: imageUrl,
                  mensaje: "Imagen subida, pero error al guardar en el menú"
                });
              }
              res.status(201).json({ ok: true, url: imageUrl, menuActualizado: true });
            });
        });
      } else {
        res.status(201).json({ ok: true, url: imageUrl });
      }
    } catch (cloudErr) {
      // CA-04 / RN-07: falla Cloudinary → no se guarda nada en BD
      console.error("ERROR CLOUDINARY:", cloudErr);
      res.status(500).json({ ok: false, mensaje: "Error al subir la imagen" });
    }
  });
});

=======
// PUT - Actualizar menú
app.put("/api/menus/:id", verificarToken, (req, res) => {
  const menuId = parseInt(req.params.id, 10);
  const userId = req.userId;

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

  const checkSql = "SELECT id FROM menus WHERE id = ? AND user_id = ?";
  db.query(checkSql, [menuId, userId], (err, results) => {
    if (err) {
      console.error("Error al verificar menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar menú" });
    }
    if (results.length === 0) {
      return res.status(403).json({ ok: false, mensaje: "No tienes permiso para actualizar este menú" });
    }

    const updateSql = "UPDATE menus SET nombre = COALESCE(?, nombre), estado = COALESCE(?, estado), data_json = COALESCE(?, data_json) WHERE id = ? AND user_id = ?";
    db.query(updateSql, [nombre || null, estado || null, data_json || null, menuId, userId], (err, result) => {
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
});

// DELETE - Eliminar menú
app.delete("/api/menus/:id", verificarToken, (req, res) => {
  const menuId = parseInt(req.params.id, 10);
  const userId = req.userId;

  if (isNaN(menuId)) {
    return res.status(400).json({ ok: false, mensaje: "El ID del menú debe ser un número" });
  }

  const checkSql = "SELECT id FROM menus WHERE id = ? AND user_id = ?";
  db.query(checkSql, [menuId, userId], (err, results) => {
    if (err) {
      console.error("Error al verificar menú:", err);
      return res.status(500).json({ ok: false, mensaje: "Error al eliminar menú" });
    }
    if (results.length === 0) {
      return res.status(403).json({ ok: false, mensaje: "No tienes permiso para eliminar este menú" });
    }

    const deleteSql = "DELETE FROM menus WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [menuId, userId], (err, result) => {
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
>>>>>>> 8d201bb (fix: secure menu ownership by authenticated user)
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});