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
  IconoPlantilla,
  IconSearch,
  IconMapPin,
  IconHeart,
  IconMessageCircle,
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

const plantillasPopulares = plantillas.filter((p) => p.popular);

// --- Explorar cartas (unido al dashboard) ---
const API = process.env.NEXT_PUBLIC_API_URL;

const ACENTO_POR_TIPO: Record<string, string> = {
  "Cafetería": "#a1662f",
  "Parrilla": "#b3452f",
  "Sushi": "#7c3aed",
  "Italiana": "#c23b3b",
  "Mexicana": "#d97706",
  "Saludable": "#22a35a",
};
const ACENTO_DEFAULT = "#6b6b78";

type Carta = {
  id: number;
  negocio: string;
  categoria: string;
  tipo: string;
  portada: string | null;
  descripcion: string;
  likes: number;
  likedByMe: boolean;
  comentarios: number;
};

const CATEGORIAS_EXPLORAR = ["Todas", "Cafetería", "Parrilla", "Sushi", "Italiana", "Mexicana", "Saludable"];


export default function Dashboard() {
  const [activeNav] = useState("Dashboard");
  const [usuario, setUsuario] = useState<{ id?: string; email?: string; nombre: string; plan: string } | null>(null);
  const [menuRecientes, setMenuRecientes] = useState<{ id: number; nombre: string; estado: string }[]>([]);

  const [mobile, setMobile] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [carruselIndex, setCarruselIndex] = useState(0);

  // --- Explorar cartas ---
  const [busquedaCartas, setBusquedaCartas] = useState("");
  const [categoriaCartas, setCategoriaCartas] = useState("Todas");
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [cargandoCartas, setCargandoCartas] = useState(true);
  const [errorCartas, setErrorCartas] = useState(false);
  const [buscadorEnfocado, setBuscadorEnfocado] = useState(false);
  const [comentandoId, setComentandoId] = useState<number | null>(null);
  const [textoComentario, setTextoComentario] = useState("");

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMenuRecientes(data.menus.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Cargar cartas públicas de otros negocios (sección Explorar)
    fetch(`${API}/api/public/explorar`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setCartas(
            json.cartas.map((c: any) => ({
              id: c.id,
              negocio: c.negocio || c.nombre_menu || "Negocio",
              categoria: c.tipo || "Otro",
              tipo: c.tipo || "Restaurante",
              portada: c.portada || null,
              descripcion: c.descripcion || "",
              likes: c.likes ?? 0,
              likedByMe: !!c.liked_by_me,
              comentarios: c.comentarios ?? 0,
            }))
          );
        } else {
          setErrorCartas(true);
        }
      })
      .catch(() => setErrorCartas(true))
      .finally(() => setCargandoCartas(false));
  }, []);

  const cartasFiltradas = cartas.filter((c) => {
    const coincideBusqueda =
      c.negocio.toLowerCase().includes(busquedaCartas.toLowerCase()) ||
      c.tipo.toLowerCase().includes(busquedaCartas.toLowerCase());
    const coincideCategoria = categoriaCartas === "Todas" || c.categoria === categoriaCartas;
    return coincideBusqueda && coincideCategoria;
  });

  const conteoPorCategoria = (cat: string) =>
    cat === "Todas" ? cartas.length : cartas.filter((c) => c.categoria === cat).length;

  const cerrarPopupPremium = () => {
    setMostrarPremium(false);
  };

  const handleLike = (carta: Carta, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const yaLeDioLike = carta.likedByMe;

    // Actualización optimista en pantalla
    setCartas((prev) =>
      prev.map((c) =>
        c.id === carta.id
          ? { ...c, likedByMe: !yaLeDioLike, likes: c.likes + (yaLeDioLike ? -1 : 1) }
          : c
      )
    );

    // TODO: reemplazar por el endpoint real del backend cuando exista
    // DESPUÉS
    const token = localStorage.getItem("token");
    fetch(`${API}/api/public/menus/${carta.id}/likes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {
      // Si falla, regresamos el estado anterior
      setCartas((prev) =>
        prev.map((c) =>
          c.id === carta.id
            ? { ...c, likedByMe: yaLeDioLike, likes: c.likes + (yaLeDioLike ? 1 : -1) }
            : c
        )
      );
    });
  };

  const handleAbrirComentar = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setComentandoId((actual) => (actual === id ? null : id));
    setTextoComentario("");
  };

  const handleEnviarComentario = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const texto = textoComentario.trim();
    if (!texto) return;

    // Actualización optimista del contador
    setCartas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, comentarios: c.comentarios + 1 } : c))
    );
    setComentandoId(null);
    setTextoComentario("");

    // TODO: reemplazar por el endpoint real del backend cuando exista
    // DESPUÉS
    const token = localStorage.getItem("token");
    fetch(`${API}/api/public/menus/${id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ texto }),
    }).catch(() => {
      setCartas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, comentarios: Math.max(0, c.comentarios - 1) } : c))
      );
    });
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
          <a href="#explorar" style={{ textDecoration: "none" }}>
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

        {/* EXPLORAR CARTAS DE OTROS NEGOCIOS (ahora primero, con buscador destacado arriba) */}
        <div id="explorar" style={{ scrollMarginTop: 24 }}>

          {/* Buscador destacado */}
          <div
            style={{
              position: "relative",
              background: buscadorEnfocado
                ? "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(168,85,247,0.06))"
                : "#16161d",
              border: buscadorEnfocado ? "1px solid #7c3aed" : "1px solid #2a2a35",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: buscadorEnfocado
                ? "0 0 0 4px rgba(124,58,237,0.14), 0 10px 28px -12px rgba(124,58,237,0.35)"
                : "none",
              transition: "border-color .2s ease, box-shadow .2s ease, background .2s ease",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: 10,
                background: buscadorEnfocado ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#1e1e28",
                border: buscadorEnfocado ? "none" : "1px solid #2a2a35",
                color: buscadorEnfocado ? "white" : "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .2s ease",
              }}
            >
              <IconSearch size={16} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                value={busquedaCartas}
                onChange={(e) => setBusquedaCartas(e.target.value)}
                onFocus={() => setBuscadorEnfocado(true)}
                onBlur={() => setBuscadorEnfocado(false)}
                placeholder="Busca por nombre de negocio o tipo de comida..."
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              />
              <div style={{ color: "#666", fontSize: 11.5, marginTop: 2 }}>
                Explora cartas publicadas por otros negocios en Menu Master
              </div>
            </div>
            {busquedaCartas && (
              <button
                onClick={() => setBusquedaCartas("")}
                aria-label="Limpiar búsqueda"
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: "1px solid #2a2a35",
                  background: "#1e1e28",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#7c3aed"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a35"; }}
              >
                <IconCerrarX />
              </button>
            )}
          </div>

          <div style={{ display: "flex",
            flexDirection: mobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: mobile ? "flex-start" : "center",
            gap: mobile ? 16 : 0, marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                Explora cartas de otros negocios
                <span style={{ background: "#a855f7", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>Nuevo</span>
              </h2>
              <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>Descubre menús publicados por otros negocios en Menu Master</p>
            </div>
          </div>

          {/* Filtros por categoría */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {CATEGORIAS_EXPLORAR.map((cat) => {
              const activo = categoriaCartas === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaCartas(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: activo ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#16161d",
                    border: activo ? "1px solid transparent" : "1px solid #2a2a35",
                    color: activo ? "white" : "#9a97a8",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  {cat !== "Todas" && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACENTO_POR_TIPO[cat] || ACENTO_DEFAULT, display: "inline-block" }} />
                  )}
                  {cat}
                  {!cargandoCartas && !errorCartas && (
                    <span style={{ fontSize: 10.5, opacity: 0.7 }}>{conteoPorCategoria(cat)}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid de cartas */}
          {cargandoCartas && (
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {Array.from({ length: mobile ? 4 : 8 }).map((_, i) => (
                <div key={i} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "4/3", background: "#1c1c24" }} />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ height: 11, width: "60%", background: "#1c1c24", borderRadius: 4 }} />
                    <div style={{ height: 9, width: "40%", background: "#1c1c24", borderRadius: 4, marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!cargandoCartas && errorCartas && (
            <div style={{ textAlign: "center", background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: "40px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
              <p style={{ color: "white", fontWeight: 600, margin: 0, fontSize: 14 }}>No se pudieron cargar las cartas</p>
              <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Intenta más tarde o recarga la página.</p>
            </div>
          )}

          {!cargandoCartas && !errorCartas && (
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {cartasFiltradas.map((c) => {
                const acento = ACENTO_POR_TIPO[c.categoria] || ACENTO_DEFAULT;
                return (
                  <a key={c.id} href={`/explorar/${c.id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "#16161d",
                        border: "1px solid #2a2a35",
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.borderColor = "#7c3aed";
                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(124,58,237,0.18)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "#2a2a35";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ position: "relative", aspectRatio: "4/3", background: "#0d0d12" }}>
                        {c.portada ? (
                          <img src={c.portada} alt={c.negocio} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "linear-gradient(160deg, #1a1a20 0%, #101014 100%)",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              <div style={{ width: 30, height: 3, borderRadius: 2, background: acento, margin: "0 auto 8px" }} />
                              <span style={{ color: "#555", fontSize: 10.5, letterSpacing: 0.5 }}>Sin portada aún</span>
                            </div>
                          </div>
                        )}
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "rgba(13,13,18,0.72)",
                            backdropFilter: "blur(4px)",
                            color: "white",
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "3px 9px 3px 7px",
                            borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.12)",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: acento, display: "inline-block" }} />
                          {c.categoria}
                        </span>
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{c.negocio}</div>
                        {c.descripcion ? (
                          <div style={{ color: "#888", fontSize: 11.5, marginTop: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {c.descripcion}
                          </div>
                        ) : (
                          <div style={{ color: "#888", fontSize: 11.5, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                            <IconMapPin size={11} /> {c.tipo}
                          </div>
                        )}

                        {/* Barra de acciones: like y comentar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            marginTop: 10,
                            paddingTop: 10,
                            borderTop: "1px solid #232330",
                          }}
                        >
                          <button
                            onClick={(e) => handleLike(c, e)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              color: c.likedByMe ? "#e0245e" : "#888",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <IconHeart size={15} filled={c.likedByMe} />
                            {c.likes}
                          </button>

                          <button
                            onClick={(e) => handleAbrirComentar(c.id, e)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              color: comentandoId === c.id ? "#7c3aed" : "#888",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <IconMessageCircle size={15} />
                            {c.comentarios}
                          </button>
                        </div>

                        {/* Caja para escribir un comentario */}
                        {comentandoId === c.id && (
                          <div
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            style={{ marginTop: 8, display: "flex", gap: 6 }}
                          >
                            <input
                              autoFocus
                              value={textoComentario}
                              onChange={(e) => setTextoComentario(e.target.value)}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onKeyDown={(e) => e.key === "Enter" && handleEnviarComentario(c.id, e as any)}
                              placeholder="Escribe un comentario..."
                              style={{
                                flex: 1,
                                background: "#0d0d12",
                                border: "1px solid #2a2a35",
                                borderRadius: 8,
                                color: "white",
                                fontSize: 11.5,
                                padding: "6px 8px",
                                outline: "none",
                              }}
                            />
                            <button
                              onClick={(e) => handleEnviarComentario(c.id, e)}
                              style={{
                                background: "#7c3aed",
                                border: "none",
                                borderRadius: 8,
                                color: "white",
                                fontSize: 11.5,
                                fontWeight: 700,
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Enviar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {!cargandoCartas && !errorCartas && cartasFiltradas.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <p style={{ color: "white", fontWeight: 600, margin: 0, fontSize: 14 }}>No se encontraron negocios</p>
              <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Prueba con otro nombre o categoría.</p>
            </div>
          )}
        </div>

        <div
            style={{
              background: "#16161d",
              border: "1px solid #2a2a35",
              borderLeft: "4px solid #a855f7",
              padding: 18,
              borderRadius: 10,
              marginTop: 48,
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

              <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: 16, flex: 1, minWidth: 0 }}>
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
                      <div style={{ color: p.textColor }}>
                        <IconoPlantilla categoria={p.categoria} size={36} />
                      </div>
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