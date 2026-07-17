"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

// RN-04 (purgaPapelera.js): mismo valor por defecto que el backend usa para purgar definitivamente
const DIAS_RETENCION = 30;

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Mis Diseños", href: "#" },
  { icon: "🖼️", label: "Medios", href: "#" },
  { icon: "🗑️", label: "Papelera", href: "/papelera" },
  { icon: "🏢", label: "Mi Negocio", href: "/mi-negocio" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "/configuracion" },
];

type MenuEliminado = {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  eliminado_at: string;
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

// CA-03: días restantes antes de la purga definitiva
function diasRestantes(eliminadoAt: string) {
  const diasTranscurridos = Math.floor((Date.now() - new Date(eliminadoAt).getTime()) / 86400000);
  return Math.max(DIAS_RETENCION - diasTranscurridos, 0);
}

export default function Papelera() {
  const [menus, setMenus] = useState<MenuEliminado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [restaurandoId, setRestaurandoId] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const cargarPapelera = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/menus/papelera`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok) {
        setMenus(data.menus);
      } else {
        alert(data.mensaje || "No se pudo cargar la papelera.");
      }
    } catch {
      alert("Error de conexión al cargar la papelera.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarPapelera(); }, []);

  const restaurarMenu = async (id: number) => {
    setRestaurandoId(id);
    try {
      const res = await fetch(`${API}/api/menus/${id}/restaurar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok) {
        setMenus(prev => prev.filter(m => m.id !== id));
      } else {
        alert(data.mensaje || "No se pudo restaurar el menú.");
      }
    } catch {
      alert("Error de conexión al restaurar el menú.");
    } finally {
      setRestaurandoId(null);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      <aside
        style={{
          width: mobile ? "100%" : 220,
          background: "#16161d",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          borderRight: "1px solid #2a2a35",
          position: mobile ? "relative" : "fixed",
          height: mobile ? "fit-content" : "100vh",
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
            flexDirection: mobile ? "row" : "column",
            overflowX: mobile ? "auto" : "visible",
            gap: 8,
          }}
        >
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: item.label === "Papelera" ? "#7c3aed22" : "transparent", color: item.label === "Papelera" ? "#a855f7" : "#888", cursor: "pointer", fontSize: 13, fontWeight: item.label === "Papelera" ? 600 : 400, borderLeft: item.label === "Papelera" ? "2px solid #a855f7" : "2px solid transparent" }}>
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
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      <main
        style={{
          marginLeft: mobile ? 0 : 220,
          flex: 1,
          padding: mobile ? 16 : 32,
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Papelera</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>
            Los menús eliminados se borran definitivamente después de {DIAS_RETENCION} días.
          </p>
        </div>

        <div
          style={{
            background: "#1e1e28",
            border: "1px solid #2a2a35",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.3fr 1fr", padding: "14px 20px", borderBottom: "1px solid #2a2a35", color: "#555", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            <span>Nombre</span><span>Eliminado</span><span>Días restantes</span><span>Acciones</span>
          </div>

          {cargando ? (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Cargando papelera...</div>
          ) : menus.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
              🗑️ La papelera está vacía.
            </div>
          ) : menus.map((menu, i) => {
            const restantes = diasRestantes(menu.eliminado_at);
            const porVencer = restantes <= 5;
            return (
              <div key={menu.id}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.3fr 1fr", padding: "16px 20px", borderBottom: i < menus.length - 1 ? "1px solid #2a2a35" : "none", alignItems: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#16161d", border: "1px solid #2a2a35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{getEmoji(menu.id)}</div>
                  <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{menu.nombre}</span>
                </div>

                <span style={{ color: "#aaa", fontSize: 13 }}>{tiempoRelativo(menu.eliminado_at)}</span>

                <div>
                  <span style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: porVencer ? "#dc262622" : "#16161d",
                    color: porVencer ? "#f87171" : "#aaa",
                    border: `1px solid ${porVencer ? "#dc262644" : "#2a2a35"}`,
                  }}>
                    {restantes === 0 ? "Se elimina hoy" : `${restantes} día${restantes === 1 ? "" : "s"}`}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => restaurarMenu(menu.id)}
                    disabled={restaurandoId === menu.id}
                    style={{ background: restaurandoId === menu.id ? "#555" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 6, padding: "8px 14px", color: "white", cursor: restaurandoId === menu.id ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    {restaurandoId === menu.id ? "Restaurando..." : "↩️ Restaurar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={cargarPapelera} style={{ background: "transparent", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 24px", color: "#888", cursor: "pointer", fontSize: 13 }}>🔄 Actualizar</button>
        </div>
      </main>
    </div>
  );
}