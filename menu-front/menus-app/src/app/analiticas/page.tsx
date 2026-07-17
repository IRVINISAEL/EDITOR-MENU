"use client";
import { useEffect, useState } from "react";

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

type TendenciaPunto = { fecha: string; vistas: number };
type TopMenu = { nombre: string; vistas: number };

type Estadisticas = {
  vistasTotales: number;
  vistasHoy: number;
  menusPublicados: number;
  tendencia: TendenciaPunto[];
  topMenus: TopMenu[];
};

function formatearFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export default function Analiticas() {
  const [activeNav] = useState("Dashboard");
  const [datos, setDatos] = useState<Estadisticas | null>(null);
  const [estado, setEstado] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const cargarEstadisticas = async () => {
      try {
        const res = await fetch(`${API}/api/menus/estadisticas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const json = await res.json();
        if (json.ok) {
          setDatos(json);
          setEstado("ok");
        } else {
          setEstado("error");
        }
      } catch {
        setEstado("error");
      }
    };

    cargarEstadisticas();
  }, []);

  const tendencia = datos?.tendencia || [];
  const topMenus = datos?.topMenus || [];
  const maxVistas = Math.max(1, ...tendencia.map((d) => d.vistas));
  const maxTopMenu = Math.max(1, ...topMenus.map((m) => m.vistas));

  const promedioDiario =
    tendencia.length > 0
      ? Math.round(tendencia.reduce((acc, d) => acc + d.vistas, 0) / tendencia.length)
      : 0;

  const statsCards = [
    { label: "Vistas totales", value: datos?.vistasTotales ?? 0, icon: "👁️" },
    { label: "Vistas hoy", value: datos?.vistasHoy ?? 0, icon: "📅" },
    { label: "Promedio diario", value: promedioDiario, icon: "📊" },
    { label: "Menús publicados", value: datos?.menusPublicados ?? 0, icon: "📋" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside className="app-sidebar" style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Menu Master" style={{ width: 36, height: 36, borderRadius: 10 }} />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                background: activeNav === item.label ? "linear-gradient(135deg, #7c3aed22, #a855f722)" : "transparent",
                color: activeNav === item.label ? "#a855f7" : "#888",
                cursor: "pointer", fontSize: 13, fontWeight: activeNav === item.label ? 600 : 400,
                borderLeft: activeNav === item.label ? "2px solid #a855f7" : "2px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>
        <div
            onClick={() => {
              localStorage.removeItem("usuario");
              document.cookie = "usuario=; path=/; max-age=0";
              window.location.href = "/login";
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}>
            <span>🚪</span> Cerrar sesión
          </div>
      </aside>

      {/* MAIN */}
      <main className="app-main" style={{ marginLeft: 220, flex: 1, padding: 32 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Analíticas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Métricas reales de tus menús publicados (últimos 30 días)</p>
          </div>
        </div>

        {estado === "error" && (
          <div style={{
            background: "#dc262622", border: "1px solid #dc262644", color: "#f87171",
            borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 13,
          }}>
            No se pudieron cargar las estadísticas. Intenta recargar la página.
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          {statsCards.map((stat) => (
            <div key={stat.label} style={{
              background: "#1e1e28", border: "1px solid #2a2a35",
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
              </div>
              <div style={{ color: "white", fontSize: 26, fontWeight: 700 }}>
                {estado === "loading" ? "…" : stat.value.toLocaleString("es-MX")}
              </div>
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Gráfica + Top menús */}
       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {/* Gráfica de vistas */}
          <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 24px" }}>Vistas por día</h2>

            {estado === "loading" && (
              <p style={{ color: "#666", fontSize: 13 }}>Cargando…</p>
            )}

            {estado === "ok" && tendencia.length === 0 && (
              <p style={{ color: "#666", fontSize: 13 }}>
                Todavía no hay vistas registradas. En cuanto alguien abra uno de tus menús publicados, aparecerán aquí.
              </p>
            )}

            {estado === "ok" && tendencia.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingBottom: 8, overflowX: "auto" }}>
                  {tendencia.map((d) => (
                    <div key={d.fecha} style={{ flex: 1, minWidth: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#666", fontSize: 10 }}>{d.vistas}</span>
                      <div style={{
                        width: "100%", borderRadius: "4px 4px 0 0",
                        background: "linear-gradient(180deg, #a855f7, #7c3aed)",
                        height: `${(d.vistas / maxVistas) * 120}px`,
                        transition: "height 0.3s",
                        minHeight: 4,
                      }} />
                      <span style={{ color: "#555", fontSize: 10, textAlign: "center" }}>{formatearFecha(d.fecha)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #2a2a35", marginTop: 8 }} />
              </>
            )}
          </div>

          {/* Top menús */}
          <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 20px" }}>Top menús</h2>

            {estado === "loading" && (
              <p style={{ color: "#666", fontSize: 13 }}>Cargando…</p>
            )}

            {estado === "ok" && topMenus.length === 0 && (
              <p style={{ color: "#666", fontSize: 13 }}>Aún no tienes menús con vistas registradas.</p>
            )}

            {estado === "ok" && topMenus.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {topMenus.map((menu, i) => (
                  <div key={`${menu.nombre}-${i}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: i === 0 ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#2a2a35",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 10, fontWeight: 700,
                        }}>{i + 1}</span>
                        <span style={{ color: "white", fontSize: 12 }}>{menu.nombre}</span>
                      </div>
                      <span style={{ color: "#666", fontSize: 12 }}>{menu.vistas}</span>
                    </div>
                    {/* Barra de progreso */}
                    <div style={{ background: "#2a2a35", borderRadius: 4, height: 4 }}>
                      <div style={{
                        height: 4, borderRadius: 4,
                        background: i === 0 ? "linear-gradient(90deg, #7c3aed, #a855f7)" : "#3a3a45",
                        width: `${(menu.vistas / maxTopMenu) * 100}%`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}