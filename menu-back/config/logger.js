const path = require("path");
const fs = require("fs");
const winston = require("winston");

const logsDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const CAMPOS_SENSIBLES = [
  "password",
  "contraseña",
  "currentPassword",
  "newPassword",
  "token",
  "authorization",
  "jwt",
  "secret",
];

function sanitizar(valor) {
  if (Array.isArray(valor)) return valor.map(sanitizar);

  if (valor && typeof valor === "object") {
    const limpio = {};

    for (const [clave, val] of Object.entries(valor)) {
      if (
        CAMPOS_SENSIBLES.some((campo) =>
          clave.toLowerCase().includes(campo.toLowerCase())
        )
      ) {
        limpio[clave] = "[REDACTED]";
      } else {
        limpio[clave] = sanitizar(val);
      }
    }

    return limpio;
  }

  return valor;
}

const sanitizeFormat = winston.format((info) => {
  const { level, message, timestamp, stack, ...meta } = info;
  Object.assign(info, sanitizar(meta));
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    winston.format.errors({ stack: true }),
    sanitizeFormat(),
    winston.format.json()
  ),
  defaultMeta: {
    servicio: "menu-back",
  },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, ...meta }) => {
            const { servicio, ...resto } = meta;
            const extra = Object.keys(resto).length
              ? ` ${JSON.stringify(resto)}`
              : "";

            return `[${timestamp}] ${level}: ${message}${extra}`;
          }
        )
      ),
    })
  );
}

function logError(req, err, statusCode = 500) {
  logger.error(err.message || "Error interno", {
    endpoint: req.originalUrl,
    metodo: req.method,
    statusCode,
    usuario: req.usuario ? req.usuario.id : null,
    ip: req.ip,
    stack: err.stack,
  });
}

function logAccesoDenegado(req, statusCode, motivo) {
  logger.warn("Acceso denegado", {
    endpoint: req.originalUrl,
    metodo: req.method,
    statusCode,
    usuario: req.usuario ? req.usuario.id : null,
    ip: req.ip,
    motivo,
  });
}

module.exports = {
  logger,
  logError,
  logAccesoDenegado,
};