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
  IconArrowLeft,
  IconBulb,
} from "@/components/Icons";
import { plantillas } from "@/data/plantillas";

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

const IconCorona = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8l4.5 4.5L12 4l5.5 8.5L22 8l-2.5 12h-15L2 8z" />
    <circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="2" cy="8" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="22" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const IconCerrarX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconPlato = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M3 3l3.5 3.5M21 3l-3.5 3.5" />
  </svg>
);

const IconTaza = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3.5c-.6.7-.6 1.3 0 2M12 3.5c-.6.7-.6 1.3 0 2" />
  </svg>
);

const IconSushiIcono = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="15" rx="9" ry="4" />
    <path d="M4.5 15c0-4.5 2-9 7.5-9s7.5 4.5 7.5 9" />
    <circle cx="12" cy="11" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const IconCarne = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4c-3 1-4 4-2.5 7 1 2 .5 3.5-1 5 2 1.5 5 1 6.5-1.5 2.5 2 6-.5 6-4 0-3-2-5-4-5.5" />
    <circle cx="15.5" cy="9.5" r="2.3" />
  </svg>
);

const plantillasPopulares = plantillas.filter((p) => p.popular);

export default function Dashboard() {
  const [activeNav] = useState("Dashboard");
  const [usuario, setUsuario] = useState<{ id?: string; email?: string; nombre: string; plan: string } | null>(null);
  const [menuRecientes, setMenuRecientes] = useState<{ id: number; nombre: string; estado: string }[]>([]);

  const [mobile, setMobile] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [carruselIndex, setCarruselIndex] = useState(0);

  const porPagina = mobile ? 2 : 4;
  const totalPaginas = Math.ceil(plantillasPopulares.length / porPagina);
  const siguientePagina = () => setCarruselIndex((i) => (i + 1) % totalPaginas);
  const anteriorPagina = () => setCarruselIndex((i) => (i - 1 + totalPaginas) % totalPaginas);
  const plantillasVisibles = plantillasPopulares.slice(carruselIndex * porPagina, carruselIndex * porPagina + porPagina);

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

        const plan = (usuario.plan || "").toString().trim().toLowerCase();
        const acabaDeIniciarSesion = sessionStorage.getItem("acaba-de-iniciar-sesion");

        console.log("DEBUG popup ->", { plan, acabaDeIniciarSesion });

        if (acabaDeIniciarSesion && plan === "free") {
          setMostrarPremium(true);
        }

        // Consumimos la bandera para que no vuelva a activarse en un refresh
        sessionStorage.removeItem("acaba-de-iniciar-sesion");
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
          <a href="/explorar" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 8,
              color: "#a855f7", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span><IconGlobe /></span> Explorar cartas
              </span>
              <span style={{
                background: "#a855f7", color: "white", fontSize: 9, fontWeight: 700,
                padding: "2px 6px", borderRadius: 6,
              }}>Nuevo</span>
            </div>
          </a>
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
            <style>{`
              @keyframes overlayIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes modalIn {
                from { opacity: 0; transform: translate(-50%, -46%) scale(.96); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              }
              @keyframes crownGlow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,.45); }
                50% { box-shadow: 0 0 0 10px rgba(168,85,247,0); }
              }
              .premium-benefit-row {
                transition: transform .15s ease, background .15s ease;
              }
              .premium-benefit-row:hover {
                transform: translateX(2px);
                background: #1e1e28;
              }
              .premium-cta-btn {
                transition: transform .15s ease, box-shadow .15s ease;
              }
              .premium-cta-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 24px -6px rgba(124,58,237,.55);
              }
              .premium-close-x {
                transition: background .15s ease, color .15s ease, transform .15s ease;
              }
              .premium-close-x:hover {
                background: #2a2a35;
                color: #fff;
                transform: rotate(90deg);
              }
            `}</style>

            <div
              onClick={cerrarPopupPremium}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(8,7,12,.8)",
                backdropFilter: "blur(8px)",
                zIndex: 999,
                animation: "overlayIn .25s ease",
              }}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 480,
                maxWidth: "92%",
                background: "linear-gradient(180deg, #1a1a24, #15151d)",
                border: "1px solid #2a2a3a",
                borderRadius: 20,
                padding: 0,
                zIndex: 1000,
                overflow: "hidden",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(168,85,247,.08)",
                animation: "modalIn .32s cubic-bezier(.2,.8,.2,1)",
              }}
            >
              {/* Botón cerrar */}
              <button
                className="premium-close-x"
                onClick={cerrarPopupPremium}
                aria-label="Cerrar"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid #2a2a35",
                  background: "#1a1a22",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <IconCerrarX />
              </button>

              {/* Header con degradado */}
              <div
                style={{
                  padding: "34px 30px 22px",
                  background: "radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,.16), transparent 60%)",
                  borderBottom: "1px solid #24242e",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    margin: "0 auto 16px",
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    animation: "crownGlow 2.4s ease-in-out infinite",
                  }}
                >
                  <IconCorona />
                </div>

                <div
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: 22,
                    letterSpacing: "-0.3px",
                    marginBottom: 6,
                  }}
                >
                  Desbloquea Menu Master Premium
                </div>

                <p
                  style={{
                    color: "#9a9aa8",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    margin: "0 auto",
                    maxWidth: 340,
                  }}
                >
                  Todo lo que necesitas para llevar tu negocio al siguiente nivel, sin límites.
                </p>
              </div>

              {/* Beneficios */}
              <div style={{ padding: "18px 16px" }}>
                {[
                  "Descargas ilimitadas",
                  "Menús ilimitados",
                  "Plantillas Premium exclusivas",
                  "Publicaciones sin restricciones",
                  "Herramientas profesionales avanzadas",
                  "Reduce tus costos operativos",
                ].map((beneficio) => (
                  <div
                    key={beneficio}
                    className="premium-benefit-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 12px",
                      borderRadius: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: "rgba(168,85,247,.12)",
                        color: "#a855f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconCheckCircle />
                    </span>
                    <span style={{ color: "#d8d8de", fontSize: 13.5, fontWeight: 500 }}>
                      {beneficio}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding: "8px 24px 26px" }}>
                <a href="/planes" style={{ textDecoration: "none", display: "block" }}>
                  <button
                    className="premium-cta-btn"
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: "none",
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    Activar Premium ahora
                    <IconArrowRight />
                  </button>
                </a>

                <button
                  onClick={cerrarPopupPremium}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: 10,
                    border: "none",
                    background: "transparent",
                    color: "#666",
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                >
                  Tal vez más tarde
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
              <a href="/configuracion">
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
              </a>

            </div>
        </div>

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

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={anteriorPagina} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", width: 32, height: 32, cursor: "pointer", flexShrink: 0 }}>
                <IconArrowLeft />
              </button>

              <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16, flex: 1 }}>
                {plantillasVisibles.map((p) => (
                  <a key={p.id} href="/plantillas" style={{ textDecoration: "none" }}>
                    <div style={{
                      background: p.color, borderRadius: 12, aspectRatio: "3/4",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: 8, cursor: "pointer", position: "relative",
                      border: "1px solid rgba(212,175,55,0.35)",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
                    }}>
                      {p.premium && (
                        <div style={{
                          position: "absolute", top: 8, right: 8,
                          background: "linear-gradient(90deg,#d4af37,#f5e08a)",
                          color: "#2b2118", fontSize: 9, fontWeight: 800,
                          letterSpacing: 0.5, padding: "3px 7px", borderRadius: 6,
                        }}>PREMIUM</div>
                      )}
                      <div style={{ fontSize: 36 }}>{p.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: p.textColor, textAlign: "center", padding: "0 6px" }}>{p.nombre}</div>
                    </div>
                  </a>
                ))}
              </div>

              <button onClick={siguientePagina} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", width: 32, height: 32, cursor: "pointer", flexShrink: 0 }}>
                <IconArrowRight />
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <span key={i} onClick={() => setCarruselIndex(i)} style={{
                  width: 6, height: 6, borderRadius: "50%", cursor: "pointer",
                  background: i === carruselIndex ? "#a855f7" : "rgba(255,255,255,0.25)",
                }} />
              ))}
            </div>
          </div>

      </main>
    </div>
  );
}