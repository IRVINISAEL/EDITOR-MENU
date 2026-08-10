"use client";
import { useState, useEffect } from "react";
import {
  IconSearch,
  IconMapPin,
  IconEdit,
  IconBuilding,
  IconCard,
  IconImage,
  IconTrash,
  IconSettings,
  IconLogout,
} from "@/components/Icons";

const API = process.env.NEXT_PUBLIC_API_URL;

const navItems = [
  { icon: "⊞", label: "Inicio", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "🧭", label: "Explorar", href: "/explorar" },
  { icon: <IconEdit />, label: "Mis Diseños", href: "#" },
  { icon: <IconImage />, label: "Medios", href: "#" },
  { icon: <IconTrash />, label: "Papelera", href: "/papelera" },
  { icon: <IconBuilding />, label: "Mi Negocio", href: "/mi-negocio" },
  { icon: <IconCard />, label: "Facturación", href: "/planes" },
  { icon: <IconSettings />, label: "Configuración", href: "/configuracion" },
];

const ESTILO_POR_TIPO: Record<string, { emoji: string; gradient: string }> = {
  "Cafetería": { emoji: "☕", gradient: "linear-gradient(160deg, #3e2723 0%, #6d4c41 100%)" },
  "Parrilla": { emoji: "🥩", gradient: "linear-gradient(160deg, #2b0f0f 0%, #6b1d1d 100%)" },
  "Sushi": { emoji: "🍣", gradient: "linear-gradient(160deg, #0d0d0d 0%, #2c1320 100%)" },
  "Italiana": { emoji: "🍕", gradient: "linear-gradient(160deg, #2b1010 0%, #7a2020 100%)" },
  "Mexicana": { emoji: "🌮", gradient: "linear-gradient(160deg, #3d1a05 0%, #a8460d 100%)" },
  "Saludable": { emoji: "🥗", gradient: "linear-gradient(160deg, #0d2b12 0%, #245c2e 100%)" },
};
const ESTILO_DEFAULT = { emoji: "🍽️", gradient: "linear-gradient(160deg,#1a1a1a,#2d2d2d)" };

type Carta = { id: number; negocio: string; categoria: string; tipo: string };

const CATEGORIAS = ["Todas", "Cafetería", "Parrilla", "Sushi", "Italiana", "Mexicana", "Saludable"];

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [mobile, setMobile] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
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
            }))
          );
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  const cartasFiltradas = cartas.filter((c) => {
    const coincideBusqueda =
      c.negocio.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "Todas" || c.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  const conteoPorCategoria = (cat: string) =>
    cat === "Todas" ? cartas.length : cartas.filter((c) => c.categoria === cat).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0d0d12" }}>
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
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: item.label === "Explorar" ? "#7c3aed22" : "transparent",
                  color: item.label === "Explorar" ? "#a855f7" : "#888",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: item.label === "Explorar" ? 600 : 400,
                  borderLeft: item.label === "Explorar" ? "2px solid #a855f7" : "2px solid transparent",
                }}
              >
                <span style={{ fontSize: 16, display: "flex" }}>{item.icon}</span>
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
      <main className="app-main" style={{ marginLeft: mobile ? 0 : 220, flex: 1, padding: mobile ? "16px" : "32px 40px 48px" }}>
        {/* HERO */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 20,
            padding: mobile ? "28px 22px" : "40px 44px",
            background: "radial-gradient(circle at 85% 20%, #3a2166 0%, #16161d 55%), linear-gradient(135deg, #1c1230 0%, #0d0d12 100%)",
            border: "1px solid #2a2a35",
            marginBottom: 28,
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -20, fontSize: 160, opacity: 0.08, filter: "blur(1px)", lineHeight: 1 }}>🍽️</div>
          <div style={{ position: "relative", maxWidth: 560 }}>
            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "#7c3aed22", border: "1px solid #7c3aed55", color: "#c4a3f7", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            Directorio de sabores
            </span>
            <h1 style={{ color: "white", fontSize: mobile ? 24 : 32, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Explora cartas de restaurantes y cafeterías
            </h1>
            <p style={{ color: "#9a97a8", fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
              Descubre menús creados por otros negocios en Menu Master y ve cómo presentan sus platillos.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 22,
                background: "#0d0d12",
                border: "1px solid #2a2a35",
                borderRadius: 12,
                padding: "12px 16px",
                maxWidth: 420,
              }}
            >
              <IconSearch />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por negocio o tipo de comida..."
                style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CATEGORIAS.map((cat) => {
            const activo = categoria === cat;
            const estilo = ESTILO_POR_TIPO[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: activo ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#16161d",
                  border: activo ? "1px solid transparent" : "1px solid #2a2a35",
                  color: activo ? "white" : "#9a97a8",
                  transition: "border-color 0.15s, color 0.15s",
                }}
              >
                {estilo && <span style={{ fontSize: 13 }}>{estilo.emoji}</span>}
                {cat}
                {!cargando && !error && (
                  <span style={{ fontSize: 11, opacity: 0.7 }}>{conteoPorCategoria(cat)}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO */}
        {cargando && (
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {Array.from({ length: mobile ? 3 : 8 }).map((_, i) => (
              <div key={i} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ aspectRatio: "4/3", background: "#1c1c24" }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ height: 12, width: "60%", background: "#1c1c24", borderRadius: 4 }} />
                  <div style={{ height: 10, width: "40%", background: "#1c1c24", borderRadius: 4, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign: "center", marginTop: 60, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 14, padding: "48px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
            <p style={{ color: "white", fontWeight: 600, margin: 0 }}>No se pudieron cargar las cartas</p>
            <p style={{ color: "#888", fontSize: 13, marginTop: 6 }}>Intenta más tarde o recarga la página.</p>
          </div>
        )}

        {!cargando && !error && (
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {cartasFiltradas.map((c) => {
              const estilo = ESTILO_POR_TIPO[c.categoria] || ESTILO_DEFAULT;
              return (
                <a key={c.id} href={`/explorar/${c.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      background: "#16161d",
                      border: "1px solid #2a2a35",
                      borderRadius: 14,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "#7c3aed";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(124,58,237,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "#2a2a35";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "4/3", background: estilo.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 40, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))" }}>{estilo.emoji}</span>
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: "rgba(13,13,18,0.7)",
                          backdropFilter: "blur(4px)",
                          color: "#c4a3f7",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 20,
                          border: "1px solid rgba(168,85,247,0.35)",
                        }}
                      >
                        {c.categoria}
                      </span>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{c.negocio}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <IconMapPin size={12} /> {c.tipo}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {!cargando && !error && cartasFiltradas.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <p style={{ color: "white", fontWeight: 600, margin: 0 }}>No se encontraron negocios</p>
            <p style={{ color: "#888", fontSize: 13, marginTop: 6 }}>Prueba con otro nombre o categoría.</p>
          </div>
        )}
      </main>
    </div>
  );
}