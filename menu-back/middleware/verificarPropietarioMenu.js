const db = require("../config/db");

async function verificarPropietarioMenu(req, res, next) {
  try {
    const menuId = req.params.id;
    const usuarioId = req.usuario.id;

    const [menus] = await db.query(
      "SELECT user_id FROM menus WHERE id = ?",
      [menuId]
    );

    if (menus.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Menú no encontrado",
      });
    }

    if (menus[0].user_id !== usuarioId) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes permisos para modificar este menú",
      });
    }

    next();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      mensaje: "Error verificando propietario del menú",
    });
  }
}

module.exports = verificarPropietarioMenu;