const { logAccesoDenegado } = require("../config/logger");

const MAX_INTENTOS = parseInt(process.env.LOGIN_MAX_INTENTOS || "5", 10);
const BLOQUEO_MINUTOS = parseInt(process.env.LOGIN_BLOQUEO_MINUTOS || "15", 10);
const BLOQUEO_MS = BLOQUEO_MINUTOS * 60 * 1000;

const intentos = new Map();

function clave(email, ip) {
  return `${(email || "").toLowerCase()}::${ip}`;
}

function limpiarSiExpiro(registro) {
  if (registro.bloqueadoHasta && Date.now() >= registro.bloqueadoHasta) {
    intentos.delete(registro._clave);
    return null;
  }
  return registro;
}

function verificarBloqueoLogin(req, res, next) {
  const { email } = req.body || {};
  const ip = req.ip;
  const k = clave(email, ip);
  let registro = intentos.get(k);

  if (registro) {
    registro._clave = k;
    registro = limpiarSiExpiro(registro);
  }

  if (registro && registro.bloqueadoHasta) {
    const minutosRestantes = Math.ceil((registro.bloqueadoHasta - Date.now()) / 60000);
    logAccesoDenegado(req, 429, `Cuenta bloqueada temporalmente por intentos fallidos (${minutosRestantes} min restantes)`);
    return res.status(429).json({
      ok: false,
      mensaje: `Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta nuevamente en ${minutosRestantes} minuto(s).`,
    });
  }

  req._loginKey = k;
  next();
}

function registrarIntentoFallido(req) {
  const k = req._loginKey || clave(req.body?.email, req.ip);
  const registro = intentos.get(k) || { fallidos: 0, bloqueadoHasta: null };
  registro.fallidos += 1;
  if (registro.fallidos >= MAX_INTENTOS) {
    registro.bloqueadoHasta = Date.now() + BLOQUEO_MS;
  }
  intentos.set(k, registro);
}

function registrarIntentoExitoso(req) {
  const k = req._loginKey || clave(req.body?.email, req.ip);
  intentos.delete(k);
}

module.exports = { verificarBloqueoLogin, registrarIntentoFallido, registrarIntentoExitoso };