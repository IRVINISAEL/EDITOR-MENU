"use client";
import { useState, useEffect } from "react";
import {
  IconEdit,
  IconChart,
  IconBuilding,
  IconCard,
  IconSettings,
  IconGlobe,
  IconLogout,
  IconArrowRight,
  IconBulb,
} from "@/components/Icons";

const navItems = [
  { icon: "⊞", label: "Inicio", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: <IconEdit />, label: "Editor", href: "/editor" },
  { icon: <IconChart />, label: "Analíticas", href: "/analiticas" },
  { icon: <IconBuilding />, label: "Mi Negocio", href: "/mi-negocio" },
  { icon: <IconCard />, label: "Facturación", href: "/planes" },
  { icon: <IconSettings />, label: "Configuración", href: "/configuracion" },
];
const plantillasPopulares = [
  { id: 2, nombre: "Moderno Minimalista", color: "#1a1a1a", textColor: "#ffffff", emoji: "⬛" },
  { id: 4, nombre: "Pastelería Dulce",    color: "#fce4ec", textColor: "#880e4f", emoji: "🍰" },
  { id: 8, nombre: "Tacos & Antojitos",   color: "#fff3e0", textColor: "#bf360c", emoji: "🌮" },
  { id: 9, nombre: "Sushi & Japonés",     color: "#0d0d0d", textColor: "#e8d5b0", emoji: "🍱" },
];

const IconoCampana = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconoEstadisticas = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default function Dashboard() {
  const [activeNav] = useState("Dashboard");
  const [usuario, setUsuario] = useState<{ nombre: string; plan: string } | null>(null);
  const [menuRecientes, setMenuRecientes] = useState<{ id: number; nombre: string; estado: string }[]>([]);

  const [mobile, setMobile] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= 768);

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    // Cargar usuario del localStorage
      const data = localStorage.getItem("usuario");

      if (data) {
        const usuario = JSON.parse(data);
        setUsuario(usuario);

        const popupVisto = localStorage.getItem("popup-premium");

        if (!popupVisto && usuario.plan === "Basico") {
          setMostrarPremium(true);
        }
      }

    // Cargar menús reales del backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMenuRecientes(data.menus.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  const cerrarPopupPremium = () => {
  localStorage.setItem("popup-premium", "true");
  setMostrarPremium(false);
};

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    document.cookie = "usuario=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>
      <button className="hamburger-btn" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}

      {/* SIDEBAR */}
      <aside className={`app-sidebar ${menuAbierto ? "abierto" : ""}`} style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
        top: 0, left: 0,
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

        <nav
            style={{
              flex: 1,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center", gap: 10,
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
              <span><IconGlobe /></span> Landing Page
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
            <span><IconLogout /></span> Cerrar sesión
          </div>
        </div>
      </aside>

      {mostrarPremium && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.75)",
                backdropFilter: "blur(6px)",
                zIndex: 999,
              }}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 520,
                maxWidth: "92%",
                background: "#17171f",
                border: "1px solid #2a2a35",
                borderRadius: 18,
                padding: 30,
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 24,
                  marginBottom: 12,
                }}
              >
                🚀 Activa Premium
              </div>

              <p
                style={{
                  color: "#999",
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                Disfruta de una experiencia completa con Menu Master.
              </p>

              <div style={{ color: "#ddd", lineHeight: 2 }}>
                ✅ Descargas ilimitadas<br />
                ✅ Menús ilimitados<br />
                ✅ Plantillas Premium<br />
                ✅ Publicaciones sin restricciones<br />
                ✅ Más herramientas profesionales<br />
                ✅ Reduce costos operativos
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 30,
                }}
              >
                <a
                  href="/planes"
                  style={{
                    flex: 1,
                    textDecoration: "none",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: 14,
                      border: "none",
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Activar Premium
                  </button>
                </a>

                <button
                  onClick={cerrarPopupPremium}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "1px solid #2a2a35",
                    background: "#20202a",
                    color: "#aaa",
                    cursor: "pointer",
                  }}
                >
                  Más tarde
                </button>
              </div>
            </div>
          </>
        )}
        
      {/* MAIN */}
      <main className="app-main" style={{ marginLeft: 220, flex: 1, padding: mobile ? 16 : 32 }}>

        {/* Header */}
        <div style={{ display: "flex",
            flexDirection: mobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: mobile ? "flex-start" : "center",
            gap: mobile ? 16 : 0, marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>
              ¡Bienvenido, {usuario?.nombre || "Usuario"}! 
            </h1>
            <p
              style={{
                color: "#999",
                fontSize: 13,
                margin: "4px 0 0",
                lineHeight: 1.6,
              }}
            >
              Desde este panel puedes crear, editar y administrar todos tus menús de
              forma rápida.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

              {/* Notificaciones */}
              <button
                title="Notificaciones"
                style={{
                  width: 42,
                  height: 42,
                  background: "#1e1e28",
                  border: "1px solid #2a2a35",
                  borderRadius: 10,
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#a855f7";
                  e.currentTarget.style.borderColor = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#888";
                  e.currentTarget.style.borderColor = "#2a2a35";
                }}
              >
                <IconoCampana />
              </button>

              {/* Analíticas */}
              <a href="/analiticas">
                <button
                  title="Analíticas"
                  style={{
                    width: 42,
                    height: 42,
                    background: "#1e1e28",
                    border: "1px solid #2a2a35",
                    borderRadius: 10,
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#a855f7";
                    e.currentTarget.style.borderColor = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#888";
                    e.currentTarget.style.borderColor = "#2a2a35";
                  }}
                >
                  <IconoEstadisticas />
                </button>
              </a>

              {/* Crear menú */}
              <a href="/editor">
                <button
                  title="Crear menú"
                  style={{
                    width: 42,
                    height: 42,
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <IconEdit />
                </button>
              </a>

              {/* Mis Menús */}
              <a href="/mis-menus">
                <button
                  title="Mis menús"
                  style={{
                    width: 42,
                    height: 42,
                    background: "#1e1e28",
                    border: "1px solid #2a2a35",
                    borderRadius: 10,
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#a855f7";
                    e.currentTarget.style.borderColor = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#888";
                    e.currentTarget.style.borderColor = "#2a2a35";
                  }}
                >
                  <IconBuilding />
                </button>
              </a>

              {/* Plantillas */}
              <a href="/plantillas">
                <button
                  title="Plantillas"
                  style={{
                    width: 42,
                    height: 42,
                    background: "#1e1e28",
                    border: "1px solid #2a2a35",
                    borderRadius: 10,
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#a855f7";
                    e.currentTarget.style.borderColor = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#888";
                    e.currentTarget.style.borderColor = "#2a2a35";
                  }}
                >
                  <IconCard />
                </button>
              </a>

              {/* Perfil */}
              <div
                title="Perfil"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  marginLeft: 4,
                  cursor: "pointer",
                }}
              >
                {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>

            </div>
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
              <span style={{ color: "#a855f7", fontSize: 12, fontWeight: 600 }}>Ver analíticas <IconArrowRight /></span> 
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16 }}>
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

        <div
            style={{
              background: "#16161d",
              border: "1px solid #2a2a35",
              borderLeft: "4px solid #a855f7",
              padding: 18,
              borderRadius: 10,
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                color: "#a855f7",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              <IconBulb /> Consejo
            </div>

            <div
              style={{
                color: "#bbb",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Si es tu primera vez utilizando Menu Master, comienza creando un nuevo
              menú o selecciona una plantilla para acelerar el proceso.
            </div>
          </div>

        {/* PLANTILLAS */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex",
              flexDirection: mobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: mobile ? "flex-start" : "center",
              gap: mobile ? 16 : 0, marginBottom: 16 }}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0 }}>Plantillas populares</h2>
              <a href="/plantillas" style={{ color: "#a855f7", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Ver todas <IconArrowRight /></a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16 }}>
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