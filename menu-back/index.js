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
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";
const PASSWORD_RESET_EXPIRATION_MINUTES = parseInt(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || "60", 10);
const C = require("./config/dbColumns");

app.use(cors({
  origin: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
}));
app.use(express.json());

const verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    console.error("AUTH HEADER INVALID:", auth);
    return res.status(401).json({ ok: false, mensaje: "Token requerido" });
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    console.error("JWT VERIFICATION FAILED:", error?.message, "HEADER:", auth);
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
  const user_id = req.query.user_id;
  const columns = [
    C.menus.id,
    C.menus.usuarioId,
    C.menus.nombre,
    C.menus.estado,
    C.menus.fechaCreacion,
  ].join(", ");
  const sql = user_id
    ? `SELECT ${columns} FROM ${C.menus.table} WHERE ${C.menus.usuarioId} = ? ORDER BY ${C.menus.fechaCreacion} DESC`
    : `SELECT ${columns} FROM ${C.menus.table} ORDER BY ${C.menus.fechaCreacion} DESC`;
  const params = user_id ? [user_id] : [];
  db.query(sql, params, (err, results) => {
    if (err) { console.error("ERROR GET MENUS:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
    res.json({ ok: true, menus: results });
  });
});

// Se agregó verificarToken aquí (antes era pública, hallazgo de seguridad corregido)
app.get("/api/menus/:id", verificarToken, (req, res) => {
  const columns = [
    C.menus.id,
    C.menus.usuarioId,
    C.menus.nombre,
    C.menus.estado,
    C.menus.fechaCreacion,
  ].join(", ");
  db.query(
    `SELECT ${columns} FROM ${C.menus.table} WHERE ${C.menus.id} = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      res.json({ ok: true, menu: results[0] });
    }
  );
});

app.post("/api/menus", verificarToken, (req, res) => {
  console.log("BODY:", req.body);
  const { nombre, estado, data_json, user_id } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query(
    `INSERT INTO ${C.menus.table} (${C.menus.nombre}, ${C.menus.estado}, data_json, ${C.menus.usuarioId}) VALUES (?, ?, ?, ?)`,
    [nombre, estado || "Borrador", dataJson, user_id || 1],
    (err, result) => {
      if (err) { console.error("ERROR INSERT:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      res.status(201).json({ ok: true, menuId: result.insertId });
    }
  );
});

app.put("/api/menus/:id", verificarToken, (req, res) => {
  const { nombre, estado, data_json } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query(
    `UPDATE ${C.menus.table} SET ${C.menus.nombre} = ?, ${C.menus.estado} = ?, data_json = ? WHERE ${C.menus.id} = ?`,
    [nombre, estado, dataJson, req.params.id],
    (err, result) => {
      if (err) { console.error("ERROR UPDATE:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      res.json({ ok: true, mensaje: "Actualizado" });
    }
  );
});

app.delete("/api/menus/:id", verificarToken, (req, res) => {
  db.query(`DELETE FROM ${C.menus.table} WHERE ${C.menus.id} = ?`, [req.params.id], (err, result) => {
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
    db.query(
      `INSERT INTO ${C.usuarios.table} (${C.usuarios.nombre}, ${C.usuarios.email}, ${C.usuarios.password}, ${C.usuarios.negocio}) VALUES (?, ?, ?, ?)`,
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

  db.query(`SELECT ${C.usuarios.password} FROM ${C.usuarios.table} WHERE ${C.usuarios.id} = ?`, [req.usuario.id], async (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });
    if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });

    const currentHash = results[0][C.usuarios.password];
    console.log(currentHash)
    const matches = await bcrypt.compare(currentPassword, currentHash);
    if (!matches) return res.status(401).json({ ok: false, mensaje: "Contraseña actual incorrecta" });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.query(
      `UPDATE ${C.usuarios.table} SET ${C.usuarios.password} = ? WHERE ${C.usuarios.id} = ?`,
      [newHash, req.usuario.id],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ ok: false, mensaje: updateErr.message });
        res.json({ ok: true, mensaje: "Contraseña actualizada" });
      }
    );
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, mensaje: "Campos obligatorios" });
  db.query(
    `SELECT ${C.usuarios.id} AS id, ${C.usuarios.nombre} AS nombre, ${C.usuarios.email} AS email, ${C.usuarios.plan} AS plan, ${C.usuarios.password} AS password FROM ${C.usuarios.table} WHERE ${C.usuarios.email} = ?`,
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      if (results.length === 0) return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
      const valido = await bcrypt.compare(password, results[0].password);
      if (!valido) return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
      const { password: _, ...usuario } = results[0];
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ ok: true, usuario, token });
    }
  );
});

// Nuevo endpoint: subir imagen a Cloudinary y asociarla a un menú
app.post("/api/upload", (req, res) => {
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
        db.query(`SELECT data_json FROM ${C.menus.table} WHERE ${C.menus.id} = ?`, [menu_id], (err2, rows) => {
          if (err2 || rows.length === 0) {
            return res.status(201).json({
              ok: true, url: imageUrl,
              mensaje: "Imagen subida, pero no se pudo asociar al menú"
            });
          }
          let data = {};
          try { data = JSON.parse(rows[0].data_json || "{}"); } catch { data = {}; }
          data.imagen_url = imageUrl;

          db.query(`UPDATE ${C.menus.table} SET data_json = ? WHERE ${C.menus.id} = ?`,
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
      res.status(500).json({ ok: false, mensaje: "Error al subir la imagen", error: cloudErr.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});