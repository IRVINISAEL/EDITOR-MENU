"use client";
import { useState, useEffect } from "react";
import {
  IconEdit,
  IconBuilding,
  IconCard,
  IconImage,
  IconTrash,
  IconSettings,
  IconLogout,
  IconEye,
  IconX,
  IconRefresh,
  IconCamera,
  IconCheck,
} from "@/components/Icons";

const API = process.env.NEXT_PUBLIC_API_URL;

const navItems = [
  { icon: "⊞", label: "Inicio", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: <IconEdit />, label: "Mis Diseños", href: "#" },
  { icon: <IconImage />, label: "Medios", href: "#" },
  { icon: <IconTrash />, label: "Papelera", href: "/papelera" },
  { icon: <IconBuilding />, label: "Mi Negocio", href: "/mi-negocio" },
  { icon: <IconCard />, label: "Facturación", href: "/planes" },
  { icon: <IconSettings />, label: "Configuración", href: "/configuracion" },
];

type Menu = {
  id: number;
  nombre: string;
  estado: string;
  data_json: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const emojis: Record<number, string> = { 0: "🍽️", 1: "☕", 2: "🍰", 3: "🥤", 4: "🍳", 5: "🌮", 6: "🦞", 7: "🍝" };
const getEmoji = (id: number) => emojis[id % 8];

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const dias = Math.floor(diff / 86400000);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Hace 1 día";
  if (dias < 7) return `Hace ${dias} días`;
  if (dias < 14) return "Hace 1 semana";
  if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
  return `Hace ${Math.floor(dias / 30)} meses`;
}

export default function MisMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [menuViendo, setMenuViendo] = useState<Menu | null>(null);
  const [menuPortada, setMenuPortada] = useState<Menu | null>(null);
  const [portadaUrl, setPortadaUrl] = useState<string>("");
  const [descripcionPublica, setDescripcionPublica] = useState("");
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  const [guardandoDetalles, setGuardandoDetalles] = useState(false);
  const [detallesGuardados, setDetallesGuardados] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [mobile, setMobile] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cargar menús del backend
  const cargarMenus = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/menus`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      // CA-04: el backend ya filtra por el usuario del token; si la
      // respuesta no es válida, se informa al usuario en vez de fallar en silencio.
      if (data.ok) {
        setMenus(data.menus);
      } else {
        console.error("Error cargando menús:", data.mensaje);
        alert(data.mensaje || "No se pudieron cargar tus menús.");
      }
    } catch {
      console.error("Error cargando menús");
      alert("Error de conexión al cargar tus menús.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
  const resize = () => setMobile(window.innerWidth <= 768);

  resize();
  window.addEventListener("resize", resize);

  return () => window.removeEventListener("resize", resize);
}, []);

  useEffect(() => { cargarMenus(); }, []);

  // Eliminar menú del backend
  const eliminarMenu = async (id: number) => {
    setEliminando(true);
    try {
      const res = await fetch(`${API}/api/menus/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
      const data = await res.json();
      if (data.ok) {
        setMenus(prev => prev.filter(m => m.id !== id));
        setConfirmEliminar(null);
      } else {
        alert("Error al eliminar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setEliminando(false);
    }
  };

  // Cargar menú en editor
  const editarMenu = (menu: Menu) => {
    try {
      const config = typeof menu.data_json === "string" && menu.data_json
        ? JSON.parse(menu.data_json)
        : (menu.data_json || {});
      config.id = menu.id;
      config.nombre = menu.nombre;
      localStorage.setItem("plantilla_cargada", JSON.stringify(config));
    } catch (err) {
      console.error("Error al cargar el menu para editar:", err);
      alert("No se pudo cargar el menu para editar.");
      return;
    }
    window.location.href = "/editor";
  };

  // Abrir modal de portada/descripción, precargando lo que ya haya guardado
  const abrirPortada = (menu: Menu) => {
    let data: any = {};
    try { data = JSON.parse(menu.data_json || "{}"); } catch { data = {}; }
    setPortadaUrl(data.imagen_url || "");
    setDescripcionPublica(data.descripcion_publica || "");
    setDetallesGuardados(false);
    setMenuPortada(menu);
  };

  // Subir nueva imagen de portada para la carta (se guarda de inmediato en el backend)
  const subirPortada = async (file: File) => {
    if (!menuPortada) return;
    setSubiendoPortada(true);
    try {
      const formData = new FormData();
      formData.append("imagen", file);
      formData.append("menu_id", String(menuPortada.id));
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setPortadaUrl(data.url);
        setMenus((prev) =>
          prev.map((m) => {
            if (m.id !== menuPortada.id) return m;
            let json: any = {};
            try { json = JSON.parse(m.data_json || "{}"); } catch { json = {}; }
            json.imagen_url = data.url;
            return { ...m, data_json: JSON.stringify(json) };
          })
        );
      } else {
        alert(data.mensaje || "No se pudo subir la imagen");
      }
    } catch {
      alert("Error de conexión al subir la imagen");
    } finally {
      setSubiendoPortada(false);
    }
  };

  // Guardar la descripción corta que se muestra en Explorar, sin tocar
  // secciones ni platillos ya guardados en el menú
  const guardarDetalles = async () => {
    if (!menuPortada) return;
    setGuardandoDetalles(true);
    try {
      const resGet = await fetch(`${API}/api/menus/${menuPortada.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const dataGet = await resGet.json();
      if (!dataGet.ok) throw new Error();
      let json: any = {};
      try { json = JSON.parse(dataGet.menu.data_json || "{}"); } catch { json = {}; }
      json.descripcion_publica = descripcionPublica;

      const resPut = await fetch(`${API}/api/menus/${menuPortada.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ nombre: menuPortada.nombre, estado: menuPortada.estado, data_json: json }),
      });
      const dataPut = await resPut.json();
      if (dataPut.ok) {
        setMenus((prev) => prev.map((m) => (m.id === menuPortada.id ? { ...m, data_json: JSON.stringify(json) } : m)));
        setDetallesGuardados(true);
        setTimeout(() => setDetallesGuardados(false), 2000);
      } else {
        alert(dataPut.mensaje || "No se pudo guardar la descripción");
      }
    } catch {
      alert("Error de conexión al guardar la descripción");
    } finally {
      setGuardandoDetalles(false);
    }
  };

  const menusFiltrados = menus.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === "Todos" || m.estado === filtro;
    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>
      <button className="hamburger-btn" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}

      {/* SIDEBAR */}
      <aside
        className={`app-sidebar ${menuAbierto ? "abierto" : ""}`}
        style={{
          width: 220,
          background: "#16161d",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          borderRight: "1px solid #2a2a35",
          position: "fixed",
          height: "100vh",
          zIndex: 10,
        }}
      >
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Menu Master" style={{ width: 36, height: 36, borderRadius: 10 }} />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>
        <nav
            style={{
              flex: 1,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: item.label === "Mis Menús Guardados" ? "#7c3aed22" : "transparent", color: item.label === "Mis Menús" ? "#a855f7" : "#888", cursor: "pointer", fontSize: 13, fontWeight: item.label === "Mis Menús" ? 600 : 400, borderLeft: item.label === "Mis Menús" ? "2px solid #a855f7" : "2px solid transparent" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #2a2a35" }}>
          <div
            onClick={() => {
              localStorage.removeItem("usuario");
              document.cookie = "usuario=; path=/; max-age=0";
              window.location.href = "/login";
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}
          >
            <span><IconLogout /></span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className="app-main"
        style={{
          marginLeft: 220,
          flex: 1,
          padding: mobile ? 16 : 32,
        }}
      >

        <div
            style={{
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: mobile ? "flex-start" : "center",
              gap: mobile ? 16 : 0,
              marginBottom: 32,
            }}
          >
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Mis Menús Guardados</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Administra todos tus menús</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem("plantilla_cargada"); window.location.href = "/editor"; }}
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 10, padding: "12px 20px", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >+ Crear nuevo menú</button>
        </div>

        <div
            style={{
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              gap: 12,
              marginBottom: 24,
              alignItems: mobile ? "stretch" : "center",
            }}
          >
          <input
            type="text" placeholder=" Buscar menú..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: mobile ? "100%" : 240 }}
          />
          {["Todos", "Publicado", "Borrador"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} style={{ background: filtro === f ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28", border: filtro === f ? "none" : "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: filtro === f ? "white" : "#888", cursor: "pointer", fontSize: 13, fontWeight: filtro === f ? 600 : 400 }}>{f}</button>
          ))}
          <button onClick={cargarMenus} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 12px", color: "#aaa", cursor: "pointer", fontSize: 13 }} title="Recargar"><IconRefresh /></button>
        </div>

        <div
            style={{
              background: "#1e1e28",
              border: "1px solid #2a2a35",
              borderRadius: 12,
              overflowX: "auto",
            }}
          >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid #2a2a35", color: "#555", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            <span>Nombre</span><span>Estado</span><span>Creado</span><span>Actualizado</span><span>Acciones</span>
          </div>

          {cargando ? (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Cargando menús...</div>
          ) : menusFiltrados.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
              {menus.length === 0 ? "No tienes menús aún. ¡Crea el primero!" : "No se encontraron menús"}
            </div>
          ) : menusFiltrados.map((menu, i) => (
            <div key={menu.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < menusFiltrados.length - 1 ? "1px solid #2a2a35" : "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#252530")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#16161d", border: "1px solid #2a2a35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{getEmoji(menu.id)}</div>
                <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{menu.nombre}</span>
              </div>

              <div>
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: menu.estado === "Publicado" ? "#16a34a22" : "#ca8a0422", color: menu.estado === "Publicado" ? "#4ade80" : "#fbbf24", border: `1px solid ${menu.estado === "Publicado" ? "#16a34a44" : "#ca8a0444"}` }}>{menu.estado}</span>
              </div>

              <span style={{ color: "#aaa", fontSize: 13 }}>{tiempoRelativo(menu.created_at)}</span>
              <span style={{ color: "#666", fontSize: 13 }}>{tiempoRelativo(menu.updated_at)}</span>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setMenuViendo(menu)} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#aaa", cursor: "pointer", fontSize: 14 }} title="Ver"><IconEye /></button>
                <button onClick={() => abrirPortada(menu)} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#a855f7", cursor: "pointer", fontSize: 14 }} title="Editar portada y descripción para Explorar"><IconCamera /></button>
                <button onClick={() => editarMenu(menu)} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#a855f7", cursor: "pointer", fontSize: 14 }} title="Editar"><IconEdit /></button>
                <button onClick={() => setConfirmEliminar(menu.id)} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 6, padding: "6px 10px", color: "#f87171", cursor: "pointer", fontSize: 14 }} title="Eliminar"><IconTrash /></button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={cargarMenus} style={{ background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 24px", color: "#888", cursor: "pointer", fontSize: 13 }}><IconRefresh /> Actualizar</button>
        </div>
      </main>

      {/* MODAL VER */}
      {menuViendo && (
        <div onClick={() => setMenuViendo(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 28, width: 420, position: "relative" }}>
            <button onClick={() => setMenuViendo(null)} style={{ position: "absolute", top: 12, right: 12, background: "#16161d", border: "1px solid #2a2a35", borderRadius: "50%", width: 28, height: 28, color: "#aaa", cursor: "pointer", fontSize: 14 }}><IconX /></button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 40 }}>{getEmoji(menuViendo.id)}</div>
              <div>
                <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{menuViendo.nombre}</div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: menuViendo.estado === "Publicado" ? "#16a34a22" : "#ca8a0422", color: menuViendo.estado === "Publicado" ? "#4ade80" : "#fbbf24", border: `1px solid ${menuViendo.estado === "Publicado" ? "#16a34a44" : "#ca8a0444"}` }}>{menuViendo.estado}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#16161d", borderRadius: 8, padding: 14 }}>
                <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>CREADO</div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{tiempoRelativo(menuViendo.created_at)}</div>
              </div>
              <div style={{ background: "#16161d", borderRadius: 8, padding: 14 }}>
                <div style={{ color: "#666", fontSize: 11, marginBottom: 4 }}>ÚLTIMA EDICIÓN</div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{tiempoRelativo(menuViendo.updated_at)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setMenuViendo(null); editarMenu(menuViendo); }} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>✏️ Editar</button>
              <button onClick={() => setMenuViendo(null)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PORTADA Y DESCRIPCIÓN */}
      {menuPortada && (
        <div onClick={() => setMenuPortada(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 28, width: 440, maxWidth: "100%", position: "relative" }}>
            <button onClick={() => setMenuPortada(null)} style={{ position: "absolute", top: 12, right: 12, background: "#16161d", border: "1px solid #2a2a35", borderRadius: "50%", width: 28, height: 28, color: "#aaa", cursor: "pointer", fontSize: 14 }}><IconX /></button>

            <div style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Portada de tu carta</div>
            <div style={{ color: "#666", fontSize: 12, marginBottom: 20 }}>Así se verá "{menuPortada.nombre}" en Explorar</div>

            {/* Vista previa + subida de portada */}
            <label
              htmlFor="input-portada"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                aspectRatio: "16/9", borderRadius: 12, cursor: subiendoPortada ? "wait" : "pointer",
                background: portadaUrl ? `#0d0d12 url(${portadaUrl}) center/cover no-repeat` : "#16161d",
                border: "1px dashed #3a3a45", position: "relative", overflow: "hidden", marginBottom: 8,
              }}
            >
              {!portadaUrl && (
                <>
                  <div style={{ fontSize: 24, marginBottom: 6 }}><IconCamera size={24} /></div>
                  <span style={{ color: "#888", fontSize: 12 }}>Sube una foto de tu carta o platillos</span>
                </>
              )}
              {subiendoPortada && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,18,0.7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 600 }}>
                  Subiendo...
                </div>
              )}
              {portadaUrl && !subiendoPortada && (
                <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(13,13,18,0.75)", color: "white", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                  Cambiar foto
                </span>
              )}
              <input
                id="input-portada"
                type="file"
                accept="image/*"
                disabled={subiendoPortada}
                onChange={(e) => { const file = e.target.files?.[0]; if (file) subirPortada(file); e.target.value = ""; }}
                style={{ display: "none" }}
              />
            </label>
            <p style={{ color: "#555", fontSize: 11, margin: "0 0 20px" }}>JPG o PNG. Se guarda automáticamente al subirla.</p>

            {/* Descripción corta para Explorar */}
            <label style={{ color: "#aaa", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>Descripción corta</label>
            <textarea
              value={descripcionPublica}
              onChange={(e) => setDescripcionPublica(e.target.value.slice(0, 140))}
              placeholder="Ej. Cocina casera con toque mediterráneo, ideal para comer en familia."
              rows={3}
              style={{ width: "100%", resize: "none", background: "#16161d", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 12px", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <div style={{ color: "#555", fontSize: 11, textAlign: "right", marginTop: 4, marginBottom: 20 }}>{descripcionPublica.length}/140</div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={guardarDetalles}
                disabled={guardandoDetalles}
                style={{ flex: 1, background: detallesGuardados ? "#16a34a" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: guardandoDetalles ? "not-allowed" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {detallesGuardados ? (<><IconCheck size={14} /> Guardado</>) : guardandoDetalles ? "Guardando..." : "Guardar descripción"}
              </button>
              <button onClick={() => setMenuPortada(null)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {confirmEliminar !== null && (
        <div onClick={() => setConfirmEliminar(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 28, width: 360, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}><IconTrash /></div>
            <div style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>¿Eliminar este menú?</div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>Se borrará permanentemente de la base de datos.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => eliminarMenu(confirmEliminar)}
                disabled={eliminando}
                style={{ flex: 1, background: eliminando ? "#555" : "#dc2626", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: eliminando ? "not-allowed" : "pointer", fontSize: 13 }}
              >{eliminando ? "Eliminando..." : "Sí, eliminar"}</button>
              <button onClick={() => setConfirmEliminar(null)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}