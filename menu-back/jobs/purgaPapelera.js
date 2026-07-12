const { logger } = require("../config/logger");
const C = require("../config/dbColumns");

const DIAS_RETENCION = parseInt(process.env.PAPELERA_DIAS_RETENCION || "30", 10);
const INTERVALO_MINUTOS = parseInt(process.env.PAPELERA_INTERVALO_MINUTOS || "60", 10);

function purgarPapelera(db) {
  const sql = `DELETE FROM ${C.menus.table} WHERE ${C.menus.eliminadoAt} IS NOT NULL AND ${C.menus.eliminadoAt} < (NOW() - INTERVAL ? DAY)`;
  db.query(sql, [DIAS_RETENCION], (err, result) => {
    if (err) {
      logger.error("Error al ejecutar la purga automática de la papelera", { stack: err.stack });
      return;
    }
    if (result.affectedRows > 0) {
      logger.info("Purga automática de papelera ejecutada", {
        registrosEliminados: result.affectedRows,
        diasRetencion: DIAS_RETENCION,
      });
    }
  });
}

function iniciarPurgaProgramada(db) {
  purgarPapelera(db);
  const intervalMs = INTERVALO_MINUTOS * 60 * 1000;
  setInterval(() => purgarPapelera(db), intervalMs);
  logger.info("Tarea programada de purga de papelera iniciada", {
    diasRetencion: DIAS_RETENCION,
    intervaloMinutos: INTERVALO_MINUTOS,
  });
}

module.exports = { iniciarPurgaProgramada, purgarPapelera };