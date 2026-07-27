const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const { Resend } = require("resend");
const cloudinary = require("./cloudinary");
require("dotenv").config();
const { logAccesoDenegado } = require("./config/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { verificarBloqueoLogin, registrarIntentoFallido, registrarIntentoExitoso } = require("./middleware/loginLimiter");
const { iniciarPurgaProgramada } = require("./jobs/purgaPapelera");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-super-segura-cambiar-en-produccion";
const PASSWORD_RESET_EXPIRATION_MINUTES = parseInt(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || "60", 10);
const C = require("./config/dbColumns");

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

const verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    logAccesoDenegado(req, 401, "Token requerido");
    return res.status(401).json({ ok: false, mensaje: "Token requerido" });
  }
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret_dev");
    req.usuario = payload;
    next();
  } catch {
    logAccesoDenegado(req, 401, "Token inválido o expirado");
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

const dbAsync = db.promise();

db.getConnection((err, connection) => {
  if (err) { console.error("❌ Error MySQL:", err); return; }
  console.log("✅ Conectado a MySQL correctamente");
  connection.release();
  iniciarPurgaProgramada(db);

  db.query(
    `CREATE TABLE IF NOT EXISTS ${C.vistasMenu.table} (
      ${C.vistasMenu.id} INT AUTO_INCREMENT PRIMARY KEY,
      ${C.vistasMenu.menuId} INT NOT NULL,
      ${C.vistasMenu.fecha} TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY menu_id (${C.vistasMenu.menuId})
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    (errTabla) => {
      if (errTabla) {
        console.error("❌ Error creando tabla vistas_menu:", errTabla);
      } else {
        console.log("✅ Tabla vistas_menu lista");
      }
    }
  );

  db.query(
    `CREATE TABLE IF NOT EXISTS ${C.configuracionUsuario.table} (
      ${C.configuracionUsuario.id} INT AUTO_INCREMENT PRIMARY KEY,
      ${C.configuracionUsuario.usuarioId} INT NOT NULL UNIQUE,
      ${C.configuracionUsuario.moneda} VARCHAR(10) NOT NULL DEFAULT 'MXN',
      ${C.configuracionUsuario.idioma} VARCHAR(10) NOT NULL DEFAULT 'es',
      ${C.configuracionUsuario.autoguardado} TINYINT(1) NOT NULL DEFAULT 1,
      ${C.configuracionUsuario.notificacionesEmail} TINYINT(1) NOT NULL DEFAULT 1,
      ${C.configuracionUsuario.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ${C.configuracionUsuario.updatedAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_config_usuario FOREIGN KEY (${C.configuracionUsuario.usuarioId}) REFERENCES ${C.usuarios.table}(${C.usuarios.id}) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    (errTablaConfig) => {
      if (errTablaConfig) {
        console.error("❌ Error creando tabla configuracion_usuario:", errTablaConfig);
      } else {
        console.log("✅ Tabla configuracion_usuario lista");
      }
    }
  );

  db.query(
    `CREATE TABLE IF NOT EXISTS ${C.descargas.table} (
      ${C.descargas.id} INT AUTO_INCREMENT PRIMARY KEY,
      ${C.descargas.usuarioId} INT NOT NULL,
      ${C.descargas.menuId} INT NULL,
      ${C.descargas.fecha} TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY user_id (${C.descargas.usuarioId}),
      CONSTRAINT fk_descargas_usuario FOREIGN KEY (${C.descargas.usuarioId}) REFERENCES ${C.usuarios.table}(${C.usuarios.id}) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    (errTablaDescargas) => {
      if (errTablaDescargas) {
        console.error("❌ Error creando tabla descargas:", errTablaDescargas);
      } else {
        console.log("✅ Tabla descargas lista");
      }
    }
  );
});

// Middleware: verificar que el usuario sea propietario del menú
const verificarPropietarioMenu = (req, res, next) => {
  const menuId = req.params.id;
  const usuarioId = req.usuario.id;

  db.query(
    `SELECT ${C.menus.usuarioId} 
     FROM ${C.menus.table} 
     WHERE ${C.menus.id} = ?`,
    [menuId],
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Menú no encontrado",
        });
      }

      const propietarioId = results[0][C.menus.usuarioId];

      if (Number(propietarioId) !== Number(usuarioId)) {
        logAccesoDenegado(
          req,
          403,
          "Intento de acceso a menú de otro usuario"
        );

        return res.status(403).json({
          ok: false,
          mensaje: "No tienes permisos para modificar este menú",
        });
      }

      next();
    }
  );
};

async function notificarSiHabilitado(usuarioId, { email, subject, html }) {
  try {
    const [rows] = await dbAsync.query(
      `SELECT ${C.configuracionUsuario.notificacionesEmail} FROM ${C.configuracionUsuario.table} WHERE ${C.configuracionUsuario.usuarioId} = ?`,
      [usuarioId]
    );
    const habilitado = rows.length === 0 ? true : !!rows[0][C.configuracionUsuario.notificacionesEmail];
    if (!habilitado || !email) return;

    await resend.emails.send({
      from: process.env.SMTP_FROM || "onboarding@resend.dev",
      to: email,
      subject,
      html,
    });
  } catch (mailErr) {
    console.error("ERROR NOTIFICACION EMAIL:", mailErr);
  }
}

app.get("/", (req, res) => res.json({ ok: true, version: "3.0.1" }));

// Obter menus, opcionalmente filtrando por user_id
// CA-01/CA-03: consulta pública de un menú, sin autenticación y sin datos del propietario
app.get("/api/public/menus/:id", (req, res, next) => {
  db.query(
    `SELECT ${C.menus.id}, ${C.menus.nombre}, ${C.menus.dataJson}, ${C.menus.usuarioId} FROM ${C.menus.table} WHERE ${C.menus.id} = ? AND ${C.menus.estado} = 'Publicado' AND ${C.menus.eliminadoAt} IS NULL`,
    [req.params.id],
    (err, results) => {
      if (err) return next(err);
      if (results.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "Menú no disponible" });
      }

      db.query(
        `INSERT INTO ${C.vistasMenu.table} (${C.vistasMenu.menuId}) VALUES (?)`,
        [req.params.id],
        (errVista) => {
          if (errVista) console.error("ERROR registrando vista:", errVista);
        }
      );

      const menu = results[0];
      const usuarioId = menu[C.menus.usuarioId];
      const menuPublico = { id: menu[C.menus.id], nombre: menu[C.menus.nombre], data_json: menu[C.menus.dataJson] };

      // CA-03: agrega la info pública del negocio, sin exponer usuario_id ni datos internos
      db.query(
        `SELECT * FROM ${C.negocios.table} WHERE ${C.negocios.usuarioId} = ?`,
        [usuarioId],
        (errNegocio, negocioRows) => {
          if (errNegocio || negocioRows.length === 0) {
            return res.json({ ok: true, menu: menuPublico, negocio: null });
          }
          const n = negocioRows[0];
          db.query(
            `SELECT * FROM ${C.direcciones.table} WHERE ${C.direcciones.negocioId} = ?`,
            [n[C.negocios.id]],
            (errDir, direccionRows) => {
              const d = (direccionRows && direccionRows[0]) || {};
              db.query(
                `SELECT * FROM ${C.redesSociales.table} WHERE ${C.redesSociales.negocioId} = ?`,
                [n[C.negocios.id]],
                (errRedes, redesRows) => {
                  const r = (redesRows && redesRows[0]) || {};
                  res.json({
                    ok: true,
                    menu: menuPublico,
                    negocio: {
                      nombre: n[C.negocios.nombre] || "",
                      descripcion: n[C.negocios.descripcion] || "",
                      telefono: n[C.negocios.telefono] || "",
                      email: n[C.negocios.email] || "",
                      sitioWeb: n[C.negocios.sitioWeb] || "",
                      logo: n[C.negocios.logo] || "",
                      horario: n[C.negocios.horario] || "",
                      direccion: { calle: d[C.direcciones.calle] || "", colonia: d[C.direcciones.colonia] || "", noExterior: d[C.direcciones.noExterior] || "" },
                      redes: { facebook: r[C.redesSociales.facebook] || "", instagram: r[C.redesSociales.instagram] || "", whatsapp: r[C.redesSociales.whatsapp] || "", tiktok: r[C.redesSociales.tiktok] || "" },
                    },
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

app.get("/api/menus", verificarToken, (req, res, next) => {
  // RN-05: el usuario se obtiene del token verificado, nunca de un parámetro
  // enviado por el cliente (evita que un usuario vea menús de otro).
  const columns = [
    C.menus.id, C.menus.usuarioId, C.menus.nombre, C.menus.estado, C.menus.dataJson, C.menus.fechaCreacion,
  ].join(", ");
  db.query(
    `SELECT ${columns} FROM ${C.menus.table} WHERE ${C.menus.usuarioId} = ? AND ${C.menus.eliminadoAt} IS NULL ORDER BY ${C.menus.fechaCreacion} DESC`,
    [req.usuario.id],
    (err, results) => {
      if (err) return next(err);
      res.json({ ok: true, menus: results });
    }
  );
});

app.get("/api/menus/papelera", verificarToken, (req, res, next) => {
  const columns = [
    C.menus.id, C.menus.usuarioId, C.menus.nombre, C.menus.estado, C.menus.fechaCreacion, C.menus.eliminadoAt,
  ].join(", ");
  db.query(
    `SELECT ${columns} FROM ${C.menus.table} WHERE ${C.menus.usuarioId} = ? AND ${C.menus.eliminadoAt} IS NOT NULL ORDER BY ${C.menus.eliminadoAt} DESC`,
    [req.usuario.id],
    (err, results) => {
      if (err) return next(err);
      res.json({ ok: true, menus: results });
    }
  );
});

app.get("/api/menus/estadisticas", verificarToken, async (req, res, next) => {
  const usuarioId = req.usuario.id;
  try {
    const [[{ total }]] = await dbAsync.query(
      `SELECT COUNT(*) AS total
       FROM ${C.vistasMenu.table} v
       JOIN ${C.menus.table} m ON m.${C.menus.id} = v.${C.vistasMenu.menuId}
       WHERE m.${C.menus.usuarioId} = ? AND m.${C.menus.eliminadoAt} IS NULL`,
      [usuarioId]
    );

    const [[{ hoy }]] = await dbAsync.query(
      `SELECT COUNT(*) AS hoy
       FROM ${C.vistasMenu.table} v
       JOIN ${C.menus.table} m ON m.${C.menus.id} = v.${C.vistasMenu.menuId}
       WHERE m.${C.menus.usuarioId} = ? AND m.${C.menus.eliminadoAt} IS NULL
         AND DATE(v.${C.vistasMenu.fecha}) = CURDATE()`,
      [usuarioId]
    );

    const [tendencia] = await dbAsync.query(
      `SELECT DATE(v.${C.vistasMenu.fecha}) AS fecha, COUNT(*) AS vistas
       FROM ${C.vistasMenu.table} v
       JOIN ${C.menus.table} m ON m.${C.menus.id} = v.${C.vistasMenu.menuId}
       WHERE m.${C.menus.usuarioId} = ? AND m.${C.menus.eliminadoAt} IS NULL
         AND v.${C.vistasMenu.fecha} >= (NOW() - INTERVAL 30 DAY)
       GROUP BY DATE(v.${C.vistasMenu.fecha})
       ORDER BY fecha ASC`,
      [usuarioId]
    );

    const [topMenus] = await dbAsync.query(
      `SELECT m.${C.menus.nombre} AS nombre, COUNT(v.${C.vistasMenu.id}) AS vistas
       FROM ${C.menus.table} m
       LEFT JOIN ${C.vistasMenu.table} v ON v.${C.vistasMenu.menuId} = m.${C.menus.id}
       WHERE m.${C.menus.usuarioId} = ? AND m.${C.menus.eliminadoAt} IS NULL
       GROUP BY m.${C.menus.id}
       ORDER BY vistas DESC
       LIMIT 5`,
      [usuarioId]
    );

    const [[{ publicados }]] = await dbAsync.query(
      `SELECT COUNT(*) AS publicados
       FROM ${C.menus.table}
       WHERE ${C.menus.usuarioId} = ? AND ${C.menus.estado} = 'Publicado' AND ${C.menus.eliminadoAt} IS NULL`,
      [usuarioId]
    );

    res.json({
      ok: true,
      vistasTotales: total,
      vistasHoy: hoy,
      menusPublicados: publicados,
      tendencia,
      topMenus,
    });
  } catch (errStats) {
    next(errStats);
  }
});

// Se agregó verificarToken aquí (antes era pública, hallazgo de seguridad corregido)
app.get("/api/menus/:id", verificarToken, verificarPropietarioMenu, (req, res, next) => {
  const columns = [
    C.menus.id,
    C.menus.usuarioId,
    C.menus.nombre,
    C.menus.estado,
    C.menus.dataJson,
    C.menus.fechaCreacion,
  ].join(", ");
  db.query(
    `SELECT ${columns} FROM ${C.menus.table} WHERE ${C.menus.id} = ? AND ${C.menus.eliminadoAt} IS NULL`,
    [req.params.id],
    (err, results) => {
      if (err) return next(err);
      if (results.length === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      res.json({ ok: true, menu: results[0] });
    }
  );
});

app.get("/api/menus/:id/estadisticas", verificarToken, verificarPropietarioMenu, async (req, res, next) => {
  try {
    const [[{ total }]] = await dbAsync.query(
      `SELECT COUNT(*) AS total FROM ${C.vistasMenu.table} WHERE ${C.vistasMenu.menuId} = ?`,
      [req.params.id]
    );

    const [tendencia] = await dbAsync.query(
      `SELECT DATE(${C.vistasMenu.fecha}) AS fecha, COUNT(*) AS vistas
       FROM ${C.vistasMenu.table}
       WHERE ${C.vistasMenu.menuId} = ? AND ${C.vistasMenu.fecha} >= (NOW() - INTERVAL 30 DAY)
       GROUP BY DATE(${C.vistasMenu.fecha})
       ORDER BY fecha ASC`,
      [req.params.id]
    );

    res.json({ ok: true, vistasTotales: total, tendencia });
  } catch (errStats) {
    next(errStats);
  }
});

app.post("/api/menus", verificarToken, (req, res, next) => {
  const { nombre, estado, data_json, user_id } = req.body;

  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query(
    `INSERT INTO ${C.menus.table} (${C.menus.nombre}, ${C.menus.estado}, data_json, ${C.menus.usuarioId}) VALUES (?, ?, ?, ?)`,
    [nombre, estado || "Borrador", dataJson, user_id || 1],
    (err, result) => {
      if (err) { console.error("ERROR INSERT:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      if (estado === "Publicado") {
        notificarSiHabilitado(req.usuario.id, {
          email: req.usuario.email,
          subject: "Tu menú fue publicado - MenuMaster",
          html: `<p>Tu menú "<strong>${nombre}</strong>" se publicó correctamente y ya está disponible para tus clientes.</p>`,
        });
      }
      res.status(201).json({ ok: true, menuId: result.insertId });
    }
  );
});

app.put("/api/menus/:id", verificarToken, verificarPropietarioMenu, (req, res) => {
  const { nombre, estado, data_json } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, mensaje: "Nombre requerido" });
  const dataJson = typeof data_json === "object" ? JSON.stringify(data_json) : (data_json || "{}");
  db.query(
    `UPDATE ${C.menus.table} SET ${C.menus.nombre} = ?, ${C.menus.estado} = ?, data_json = ? WHERE ${C.menus.id} = ?`,
    [nombre, estado, dataJson, req.params.id],
    (err, result) => {
      if (err) { console.error("ERROR UPDATE:", err); return res.status(500).json({ ok: false, mensaje: err.message }); }
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "Menú no encontrado" });
      if (estado === "Publicado") {
        notificarSiHabilitado(req.usuario.id, {
          email: req.usuario.email,
          subject: "Tu menú fue publicado - MenuMaster",
          html: `<p>Tu menú "<strong>${nombre}</strong>" se publicó correctamente y ya está disponible para tus clientes.</p>`,
        });
      }
      res.json({ ok: true, mensaje: "Actualizado" });
    }
  );
});

app.delete("/api/menus/:id", verificarToken, verificarPropietarioMenu, (req, res, next) => {
  db.query(
    `UPDATE ${C.menus.table} SET ${C.menus.eliminadoAt} = NOW() WHERE ${C.menus.id} = ? AND ${C.menus.eliminadoAt} IS NULL`,
    [req.params.id],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "No encontrado" });
      res.json({ ok: true, mensaje: "Menú movido a la papelera" });
    }
  );
});

app.put("/api/menus/:id/restaurar", verificarToken, verificarPropietarioMenu, (req, res, next) => {
  db.query(
    `UPDATE ${C.menus.table} SET ${C.menus.eliminadoAt} = NULL WHERE ${C.menus.id} = ? AND ${C.menus.eliminadoAt} IS NOT NULL`,
    [req.params.id],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: "El menú no está en la papelera" });
      res.json({ ok: true, mensaje: "Menú restaurado" });
    }
  );
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

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ ok: false, mensaje: "Correo electrónico requerido" });

  db.query(`SELECT ${C.usuarios.id} FROM ${C.usuarios.table} WHERE ${C.usuarios.email} = ?`, [email], (err, results) => {
    if (err) return res.status(500).json({ ok: false, mensaje: err.message });

    if (results.length === 0) {
      return res.json({ ok: true, mensaje: "Si el correo existe, se enviará un enlace de recuperación" });
    }

    const userId = results[0][C.usuarios.id];
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expira = new Date(Date.now() + PASSWORD_RESET_EXPIRATION_MINUTES * 60 * 1000);

    db.query(
      `UPDATE ${C.usuarios.table} SET ${C.usuarios.resetToken} = ?, ${C.usuarios.resetTokenExpira} = ? WHERE ${C.usuarios.id} = ?`,
      [hashedToken, expira, userId],
      async (updateErr) => {
        if (updateErr) return res.status(500).json({ ok: false, mensaje: updateErr.message });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
        try {
          await resend.emails.send({
            from: process.env.SMTP_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Recupera tu contraseña - MenuMaster",
            html: `<p>Solicitaste recuperar tu contraseña.</p><p><a href="${resetLink}">Haz clic aquí para restablecerla</a></p><p>Este enlace expira en ${PASSWORD_RESET_EXPIRATION_MINUTES} minutos. Si tú no lo solicitaste, ignora este correo.</p>`,
          });
        } catch (mailErr) {
          console.error("ERROR RESEND:", mailErr);
        }

        res.json({ ok: true, mensaje: "Si el correo existe, se enviará un enlace de recuperación" });
      }
    );
  });
});

app.get("/api/auth/reset-password/:token", (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  db.query(
    `SELECT ${C.usuarios.id} FROM ${C.usuarios.table} WHERE ${C.usuarios.resetToken} = ? AND ${C.usuarios.resetTokenExpira} > NOW()`,
    [hashedToken],
    (err, results) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      if (results.length === 0) return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });
      res.json({ ok: true });
    }
  );
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ ok: false, mensaje: "Token y contraseña son obligatorios" });
  if (password.length < 8) return res.status(400).json({ ok: false, mensaje: "La contraseña debe tener al menos 8 caracteres" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  db.query(
    `SELECT ${C.usuarios.id} FROM ${C.usuarios.table} WHERE ${C.usuarios.resetToken} = ? AND ${C.usuarios.resetTokenExpira} > NOW()`,
    [hashedToken],
    async (err, results) => {
      if (err) return res.status(500).json({ ok: false, mensaje: err.message });
      if (results.length === 0) return res.status(400).json({ ok: false, mensaje: "Token inválido o expirado" });

      const userId = results[0][C.usuarios.id];
      const newHash = await bcrypt.hash(password, 10);
      db.query(
        `UPDATE ${C.usuarios.table} SET ${C.usuarios.password} = ?, ${C.usuarios.resetToken} = NULL, ${C.usuarios.resetTokenExpira} = NULL WHERE ${C.usuarios.id} = ?`,
        [newHash, userId],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ ok: false, mensaje: updateErr.message });
          res.json({ ok: true, mensaje: "Contraseña actualizada correctamente" });
        }
      );
    }
  );
});

app.post("/api/auth/login", verificarBloqueoLogin, (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, mensaje: "Campos obligatorios" });
  db.query(
    `SELECT ${C.usuarios.id} AS id, ${C.usuarios.nombre} AS nombre, ${C.usuarios.email} AS email, ${C.usuarios.plan} AS plan, ${C.usuarios.password} AS password FROM ${C.usuarios.table} WHERE ${C.usuarios.email} = ?`,
    [email],
    async (err, results) => {
      if (err) return next(err);
      if (results.length === 0) {
        registrarIntentoFallido(req);
        logAccesoDenegado(req, 401, "Credenciales incorrectas (correo no encontrado)");
        return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
      }
      try {
        const valido = await bcrypt.compare(password, results[0].password);
        if (!valido) {
          registrarIntentoFallido(req);
          logAccesoDenegado(req, 401, "Credenciales incorrectas");
          return res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
        }
        registrarIntentoExitoso(req);
        const { password: _, ...usuario } = results[0];
        const token = jwt.sign(
          { id: usuario.id, email: usuario.email },
          process.env.JWT_SECRET || "secret_dev",
          { expiresIn: "7d" }
        );
        res.json({ ok: true, usuario, token });
      } catch (e) {
        next(e);
      }
    }
  );
});

// HU-89: eliminación permanente de cuenta.
// RN-01: solo el propietario (req.usuario.id viene del token, no del cliente).
// RN-02: exige la contraseña actual como confirmación explícita.
// RN-04: se eliminan en cascada las vistas y los menús asociados antes de
// eliminar la cuenta, para no dejar datos huérfanos.
app.delete("/api/auth/account", verificarToken, async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ ok: false, mensaje: "Debes ingresar tu contraseña para confirmar" });
  }

  try {
    const [rows] = await dbAsync.query(
      `SELECT ${C.usuarios.password} FROM ${C.usuarios.table} WHERE ${C.usuarios.id} = ?`,
      [req.usuario.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    const coincide = await bcrypt.compare(password, rows[0][C.usuarios.password]);
    if (!coincide) {
      return res.status(401).json({ ok: false, mensaje: "Contraseña incorrecta" });
    }

    await dbAsync.query(
      `DELETE v FROM ${C.vistasMenu.table} v
       INNER JOIN ${C.menus.table} m ON m.${C.menus.id} = v.${C.vistasMenu.menuId}
       WHERE m.${C.menus.usuarioId} = ?`,
      [req.usuario.id]
    );

    await dbAsync.query(
      `DELETE FROM ${C.menus.table} WHERE ${C.menus.usuarioId} = ?`,
      [req.usuario.id]
    );

    await dbAsync.query(
      `DELETE FROM ${C.usuarios.table} WHERE ${C.usuarios.id} = ?`,
      [req.usuario.id]
    );

    res.json({ ok: true, mensaje: "Cuenta eliminada correctamente" });
  } catch (errDelete) {
    next(errDelete);
  }
});

const MONEDAS_VALIDAS = ["MXN", "USD", "EUR", "COP", "ARS", "CLP", "PEN", "BRL"];
const IDIOMAS_VALIDOS = ["es", "en", "fr", "it", "pt"];

app.get("/api/configuracion", verificarToken, async (req, res, next) => {
  try {
    const columns = [
      C.configuracionUsuario.moneda,
      C.configuracionUsuario.idioma,
      C.configuracionUsuario.autoguardado,
      C.configuracionUsuario.notificacionesEmail,
    ].join(", ");

    const [rows] = await dbAsync.query(
      `SELECT ${columns} FROM ${C.configuracionUsuario.table} WHERE ${C.configuracionUsuario.usuarioId} = ?`,
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.json({
        ok: true,
        configuracion: { moneda: "MXN", idioma: "es", autoguardado: true, notificaciones_email: true },
      });
    }

    const config = rows[0];
    res.json({
      ok: true,
      configuracion: {
        moneda: config[C.configuracionUsuario.moneda],
        idioma: config[C.configuracionUsuario.idioma],
        autoguardado: !!config[C.configuracionUsuario.autoguardado],
        notificaciones_email: !!config[C.configuracionUsuario.notificacionesEmail],
      },
    });
  } catch (err) {
    next(err);
  }
});

app.put("/api/configuracion", verificarToken, async (req, res, next) => {
  const { moneda, idioma, autoguardado, notificaciones_email } = req.body;

  if (moneda !== undefined && !MONEDAS_VALIDAS.includes(moneda)) {
    return res.status(400).json({ ok: false, mensaje: "Moneda no válida" });
  }
  if (idioma !== undefined && !IDIOMAS_VALIDOS.includes(idioma)) {
    return res.status(400).json({ ok: false, mensaje: "Idioma no válido" });
  }
  if (autoguardado !== undefined && typeof autoguardado !== "boolean") {
    return res.status(400).json({ ok: false, mensaje: "autoguardado debe ser booleano" });
  }
  if (notificaciones_email !== undefined && typeof notificaciones_email !== "boolean") {
    return res.status(400).json({ ok: false, mensaje: "notificaciones_email debe ser booleano" });
  }

  try {
    const monedaFinal = moneda ?? "MXN";
    const idiomaFinal = idioma ?? "es";
    const autoguardadoFinal = autoguardado ?? true;
    const notifFinal = notificaciones_email ?? true;

    await dbAsync.query(
      `INSERT INTO ${C.configuracionUsuario.table}
        (${C.configuracionUsuario.usuarioId}, ${C.configuracionUsuario.moneda}, ${C.configuracionUsuario.idioma}, ${C.configuracionUsuario.autoguardado}, ${C.configuracionUsuario.notificacionesEmail})
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ${C.configuracionUsuario.moneda} = VALUES(${C.configuracionUsuario.moneda}),
        ${C.configuracionUsuario.idioma} = VALUES(${C.configuracionUsuario.idioma}),
        ${C.configuracionUsuario.autoguardado} = VALUES(${C.configuracionUsuario.autoguardado}),
        ${C.configuracionUsuario.notificacionesEmail} = VALUES(${C.configuracionUsuario.notificacionesEmail})`,
      [req.usuario.id, monedaFinal, idiomaFinal, autoguardadoFinal, notifFinal]
    );

    res.json({
      ok: true,
      mensaje: "Preferencias guardadas",
      configuracion: { moneda: monedaFinal, idioma: idiomaFinal, autoguardado: autoguardadoFinal, notificaciones_email: notifFinal },
    });
  } catch (err) {
    next(err);
  }
});

// HU-97: obtiene la información del negocio del usuario autenticado (CA-04)
app.get("/api/negocio", verificarToken, async (req, res, next) => {
  try {
    const [negocioRows] = await dbAsync.query(
      `SELECT * FROM ${C.negocios.table} WHERE ${C.negocios.usuarioId} = ?`,
      [req.usuario.id]
    );

    if (negocioRows.length === 0) {
      return res.json({
        ok: true,
        negocio: {
          nombre: "", descripcion: "", tipo: "Restaurante", telefono: "", email: "",
          sitioWeb: "", logo: "", horario: "",
          direccion: { calle: "", colonia: "", noExterior: "" },
          redes: { facebook: "", instagram: "", whatsapp: "", tiktok: "" },
        },
      });
    }

    const n = negocioRows[0];
    const [direccionRows] = await dbAsync.query(
      `SELECT * FROM ${C.direcciones.table} WHERE ${C.direcciones.negocioId} = ?`,
      [n[C.negocios.id]]
    );
    const [redesRows] = await dbAsync.query(
      `SELECT * FROM ${C.redesSociales.table} WHERE ${C.redesSociales.negocioId} = ?`,
      [n[C.negocios.id]]
    );
    const d = direccionRows[0] || {};
    const r = redesRows[0] || {};

    res.json({
      ok: true,
      negocio: {
        nombre: n[C.negocios.nombre] || "",
        descripcion: n[C.negocios.descripcion] || "",
        tipo: n[C.negocios.tipo] || "Restaurante",
        telefono: n[C.negocios.telefono] || "",
        email: n[C.negocios.email] || "",
        sitioWeb: n[C.negocios.sitioWeb] || "",
        logo: n[C.negocios.logo] || "",
        horario: n[C.negocios.horario] || "",
        direccion: {
          calle: d[C.direcciones.calle] || "",
          colonia: d[C.direcciones.colonia] || "",
          noExterior: d[C.direcciones.noExterior] || "",
        },
        redes: {
          facebook: r[C.redesSociales.facebook] || "",
          instagram: r[C.redesSociales.instagram] || "",
          whatsapp: r[C.redesSociales.whatsapp] || "",
          tiktok: r[C.redesSociales.tiktok] || "",
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// HU-97: crea o actualiza la información del negocio (CA-01/CA-02, RN-01, RN-02, RN-05)
const REDES_REGEX = /^[a-zA-Z0-9_.@+\- /:]{0,150}$/; // RN-04: formato básico permitido

app.put("/api/negocio", verificarToken, async (req, res, next) => {
  const { nombre, descripcion, tipo, telefono, email, sitioWeb, logo, horario, direccion, redes } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ ok: false, mensaje: "El nombre del negocio es obligatorio" });
  }

  const camposRedes = redes || {};
  for (const key of ["facebook", "instagram", "whatsapp", "tiktok"]) {
    const valor = camposRedes[key];
    if (valor && !REDES_REGEX.test(valor)) {
      return res.status(400).json({ ok: false, mensaje: `El campo ${key} tiene un formato inválido` });
    }
  }

  try {
    await dbAsync.query(
      `INSERT INTO ${C.negocios.table}
        (${C.negocios.usuarioId}, ${C.negocios.nombre}, ${C.negocios.descripcion}, ${C.negocios.tipo}, ${C.negocios.telefono}, ${C.negocios.email}, ${C.negocios.sitioWeb}, ${C.negocios.logo}, ${C.negocios.horario})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ${C.negocios.nombre} = VALUES(${C.negocios.nombre}),
        ${C.negocios.descripcion} = VALUES(${C.negocios.descripcion}),
        ${C.negocios.tipo} = VALUES(${C.negocios.tipo}),
        ${C.negocios.telefono} = VALUES(${C.negocios.telefono}),
        ${C.negocios.email} = VALUES(${C.negocios.email}),
        ${C.negocios.sitioWeb} = VALUES(${C.negocios.sitioWeb}),
        ${C.negocios.logo} = VALUES(${C.negocios.logo}),
        ${C.negocios.horario} = VALUES(${C.negocios.horario})`,
      [req.usuario.id, nombre.trim(), descripcion || "", tipo || "Restaurante", telefono || "", email || "", sitioWeb || "", logo || "", horario || ""]
    );

    const [negocioRows] = await dbAsync.query(
      `SELECT ${C.negocios.id} FROM ${C.negocios.table} WHERE ${C.negocios.usuarioId} = ?`,
      [req.usuario.id]
    );
    const negocioId = negocioRows[0][C.negocios.id];

    const dir = direccion || {};
    await dbAsync.query(
      `INSERT INTO ${C.direcciones.table}
        (${C.direcciones.negocioId}, ${C.direcciones.calle}, ${C.direcciones.colonia}, ${C.direcciones.noExterior})
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ${C.direcciones.calle} = VALUES(${C.direcciones.calle}),
        ${C.direcciones.colonia} = VALUES(${C.direcciones.colonia}),
        ${C.direcciones.noExterior} = VALUES(${C.direcciones.noExterior})`,
      [negocioId, dir.calle || "", dir.colonia || "", dir.noExterior || null]
    );

    const red = redes || {};
    await dbAsync.query(
      `INSERT INTO ${C.redesSociales.table}
        (${C.redesSociales.negocioId}, ${C.redesSociales.facebook}, ${C.redesSociales.instagram}, ${C.redesSociales.whatsapp}, ${C.redesSociales.tiktok})
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        ${C.redesSociales.facebook} = VALUES(${C.redesSociales.facebook}),
        ${C.redesSociales.instagram} = VALUES(${C.redesSociales.instagram}),
        ${C.redesSociales.whatsapp} = VALUES(${C.redesSociales.whatsapp}),
        ${C.redesSociales.tiktok} = VALUES(${C.redesSociales.tiktok})`,
      [negocioId, red.facebook || "", red.instagram || "", red.whatsapp || "", red.tiktok || ""]
    );

    res.json({ ok: true, mensaje: "Información del negocio actualizada" });
  } catch (err) {
    next(err);
  }
});

const LIMITES_POR_PLAN = {
  Basico: 10,
  Premium: 100,
  Empresarial: null,
};

function obtenerLimitePlan(plan) {
  return Object.prototype.hasOwnProperty.call(LIMITES_POR_PLAN, plan) ? LIMITES_POR_PLAN[plan] : 10;
}

app.get("/api/descargas", verificarToken, async (req, res, next) => {
  try {
    const [[usuarioRow]] = await dbAsync.query(
      `SELECT ${C.usuarios.plan} FROM ${C.usuarios.table} WHERE ${C.usuarios.id} = ?`,
      [req.usuario.id]
    );
    if (!usuarioRow) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });

    const plan = usuarioRow[C.usuarios.plan];
    const limite = obtenerLimitePlan(plan);

    const [[{ total }]] = await dbAsync.query(
      `SELECT COUNT(*) AS total FROM ${C.descargas.table} WHERE ${C.descargas.usuarioId} = ?`,
      [req.usuario.id]
    );

    res.json({
      ok: true,
      plan,
      descargasRealizadas: total,
      limiteDescargas: limite,
      descargasRestantes: limite === null ? null : Math.max(limite - total, 0),
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/descargas", verificarToken, async (req, res, next) => {
  const { menu_id } = req.body;

  try {
    const [[usuarioRow]] = await dbAsync.query(
      `SELECT ${C.usuarios.plan} FROM ${C.usuarios.table} WHERE ${C.usuarios.id} = ?`,
      [req.usuario.id]
    );
    if (!usuarioRow) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });

    const plan = usuarioRow[C.usuarios.plan];
    const limite = obtenerLimitePlan(plan);

    const [[{ total }]] = await dbAsync.query(
      `SELECT COUNT(*) AS total FROM ${C.descargas.table} WHERE ${C.descargas.usuarioId} = ?`,
      [req.usuario.id]
    );

    if (limite !== null && total >= limite) {
      return res.status(403).json({
        ok: false,
        limiteAlcanzado: true,
        mensaje: "Alcanzaste el límite de descargas de tu plan. Actualiza tu plan para seguir descargando.",
        plan,
        descargasRealizadas: total,
        limiteDescargas: limite,
        descargasRestantes: 0,
      });
    }

    await dbAsync.query(
      `INSERT INTO ${C.descargas.table} (${C.descargas.usuarioId}, ${C.descargas.menuId}) VALUES (?, ?)`,
      [req.usuario.id, menu_id || null]
    );

    const nuevoTotal = total + 1;
    res.status(201).json({
      ok: true,
      plan,
      descargasRealizadas: nuevoTotal,
      limiteDescargas: limite,
      descargasRestantes: limite === null ? null : Math.max(limite - nuevoTotal, 0),
    });
  } catch (err) {
    next(err);
  }
});

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
      res.status(500).json({ ok: false, mensaje: "Error al subir la imagen" });
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});