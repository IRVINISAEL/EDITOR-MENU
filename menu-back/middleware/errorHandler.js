const { logError } = require("../config/logger");

function notFoundHandler(req, res) {
  return res.status(404).json({
    ok: false,
    mensaje: "Recurso no encontrado",
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  logError(req, err, statusCode);

  return res.status(statusCode).json({
    ok: false,
    mensaje:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};