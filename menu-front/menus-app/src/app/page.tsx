"use client";
import { useState, useEffect } from "react";

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Editor", href: "/editor" },
  { icon: "📊", label: "Analíticas", href: "/analiticas" },
  { icon: "🏢", label: "Mi Negocio", href: "/mi-negocio" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "/configuracion" },
];
const plantillasPopulares = [
  { id: 2, nombre: "Moderno Minimalista", color: "#1a1a1a", textColor: "#ffffff", emoji: "⬛" },
  { id: 4, nombre: "Pastelería Dulce",    color: "#fce4ec", textColor: "#880e4f", emoji: "🍰" },
  { id: 8, nombre: "Tacos & Antojitos",   color: "#fff3e0", textColor: "#bf360c", emoji: "🌮" },
  { id: 9, nombre: "Sushi & Japonés",     color: "#0d0d0d", textColor: "#e8d5b0", emoji: "🍱" },
];

export default function Dashboard() {
  const [activeNav] = useState("Dashboard");
  const [usuario, setUsuario] = useState<{ nombre: string; plan: string } | null>(null);
  const [menuRecientes, setMenuRecientes] = useState<{ id: number; nombre: string; estado: string }[]>([]);

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= 768);

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    // Cargar usuario del localStorage
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));

    // Cargar menús reales del backend
    fetch("https://menu-master-backend-production-9bfc.up.railway.app/api/menus")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMenuRecientes(data.menus.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: mobile ? "100%" : 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: mobile ? "relative" : "fixed",
        height: mobile ? "auto" : "100vh", zIndex: 10,
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
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (activeNav !== item.label) (e.currentTarget as HTMLElement).style.color = "white"; }}
                onMouseLeave={e => { if (activeNav !== item.label) (e.currentTarget as HTMLElement).style.color = "#888"; }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid #2a2a35", display: "flex", flexDirection: "column", gap: 4 }}>
          <a href="/landing" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8,
              color: "#888", cursor: "pointer", fontSize: 13,
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "white")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#888")}
            >
              <span>🌐</span> Landing Page
            </div>
          </a>
          <div onClick={handleCerrarSesion} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8,
            color: "#888", cursor: "pointer", fontSize: 13,
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "white")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#888")}
          >
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: mobile ? 0 : 220, flex: 1, padding: 32 }}>

        {/* Header */}
        <div style={{ display: "flex",
            flexDirection: mobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: mobile ? "flex-start" : "center",
            gap: mobile ? 16 : 0, marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>
              ¡Bienvenido, {usuario?.nombre || "Usuario"}! 👋
            </h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>
              Aquí tienes un resumen de tu cuenta
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 12px", color: "#888", cursor: "pointer", fontSize: 18 }}>🔔</button>
            <a href="/analiticas">
              <button style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 12px", color: "#888", cursor: "pointer", fontSize: 18 }}>📊</button>
            </a>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Menús guardados", value: String(menuRecientes.length || 0), icon: "", href: "/mis-menus" },
            { label: "Estadisticas", value: "256", icon: "", href: "/analiticas" },
            { label: "Plan actual", value: usuario?.plan || "Basico", icon: "", highlight: true, href: "/planes" },
          ].map((stat) => (
            <a key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: stat.highlight ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
                border: stat.highlight ? "none" : "1px solid #2a2a35",
                borderRadius: 12, padding: "20px", cursor: "pointer",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ color: "white", fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: stat.highlight ? "rgba(255,255,255,0.8)" : "#666", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
              </div>
            </a>
          ))}
        </div>


        {/* Estadísticas rápidas */}
        <a href="/analiticas" style={{ textDecoration: "none" }}>
          <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, cursor: "pointer" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "#a855f7")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "#2a2a35")}
          >
            <div style={{ display: "flex",
                flexDirection: mobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: mobile ? "flex-start" : "center",
                gap: mobile ? 16 : 0, marginBottom: 20 }}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0 }}>Estadísticas rápidas</h2>
              <span style={{ color: "#a855f7", fontSize: 12, fontWeight: 600 }}>Ver analíticas →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Vistas totales", value: "1,256" },
                { label: "Descargas", value: "342" },
                { label: "Impresiones", value: "128" },
                { label: "QR Escaneos", value: "786" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ color: "white", fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </a>

        {/* PLANTILLAS */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex",
              flexDirection: mobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: mobile ? "flex-start" : "center",
              gap: mobile ? 16 : 0, marginBottom: 16 }}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0 }}>Plantillas populares</h2>
              <a href="/plantillas" style={{ color: "#a855f7", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Ver todas →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
              {plantillasPopulares.map((p) => (
                <a key={p.id} href="/plantillas" style={{ textDecoration: "none" }}>
                  <div style={{
                    background: p.color, borderRadius: 12, aspectRatio: "3/4",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 8, cursor: "pointer",
                    border: "1px solid #2a2a35",
                  }}>
                    <div style={{ fontSize: 36 }}>{p.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: p.textColor }}>{p.nombre}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

      </main>
    </div>
  );
}