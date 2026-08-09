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
  IconLock,
  IconPackage,
  IconStar,
} from "@/components/Icons";
import { plantillas, categorias } from "@/data/plantillas";

const API = process.env.NEXT_PUBLIC_API_URL;


const IconRestaurante = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M3 3l3.5 3.5M21 3l-3.5 3.5" />
  </svg>
);

const IconCafeteria = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3.5c-.6.7-.6 1.3 0 2M12 3.5c-.6.7-.6 1.3 0 2" />
  </svg>
);

const IconPostres = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10h12l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 10z" />
    <path d="M7 10c0-3 2-5.5 5-5.5S17 7 17 10" />
    <path d="M12 4.5V2" />
  </svg>
);

const IconItaliano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l7 7M11 4l7 7" />
    <path d="M4 4c0 5 3 8 7 8s7-3 7-8" />
    <path d="M12 12v8" />
    <path d="M9 20h6" />
  </svg>
);

const IconModernoCat = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M4 15h16" />
    <path d="M9 4v11" />
  </svg>
);

const IconMexicano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12c0-4 4-7 9-7s9 3 9 7" />
    <path d="M4.5 12c1.5 3 4 5.5 7.5 5.5s6-2.5 7.5-5.5" />
    <path d="M8 12v2M12 12v3M16 12v2" />
  </svg>
);

const IconJapones = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="15" rx="9" ry="4" />
    <path d="M4.5 15c0-4.5 2-9 7.5-9s7.5 4.5 7.5 9" />
    <circle cx="12" cy="11" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const IconVegano = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19c-1-7 2-13 14-14-1 12-7 15-14 14z" />
    <path d="M6 18c3-4 6-7 12-11" />
  </svg>
);

const ICONO_POR_CATEGORIA: Record<string, (props: { size?: number }) => React.ReactElement> = {
  "Restaurante": IconRestaurante,
  "Cafetería": IconCafeteria,
  "Postres": IconPostres,
  "Italiano": IconItaliano,
  "Moderno": IconModernoCat,
  "Mexicano": IconMexicano,
  "Japonés": IconJapones,
  "Vegano": IconVegano,
};

const IconoPlantilla = ({ categoria, size = 36 }: { categoria: string; size?: number }) => {
  const Icono = ICONO_POR_CATEGORIA[categoria] || IconRestaurante;
  return <Icono size={size} />;
};

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

type Plantilla = typeof plantillas[number] & { premium?: boolean };

export default function Plantillas() {
  const [activeNav] = useState("Plantillas");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [preview, setPreview] = useState<Plantilla | null>(null);

  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("favoritos_plantillas") || "[]"); } catch { return []; }
  });
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 12;

  // Plan real del usuario, consultado directo al backend (no localStorage viejo,
  // que podía quedar desactualizado si el admin activaba el plan sin que el
  // usuario volviera a iniciar sesión).
  const [planUsuario, setPlanUsuario] = useState<string>("Free");
  const [cargandoPlan, setCargandoPlan] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargandoPlan(false);
      return;
    }
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPlanUsuario(data.usuario.plan);
      })
      .finally(() => setCargandoPlan(false));
  }, []);

  useEffect(() => {
    try {
      const yaRespondio = localStorage.getItem("preferencia_plantillas");
      if (!yaRespondio) {
        const t = setTimeout(() => setMostrarEncuesta(true), 600);
        return () => clearTimeout(t);
      }
      const datos = JSON.parse(yaRespondio);
      if (datos.negocio) setNegocioElegido(datos.negocio);
      if (datos.preferencia) setPreferenciaElegida(datos.preferencia);
    } catch {}
  }, []);

  const tienePlanPremium = planUsuario === "Plus" || planUsuario === "Premium";

  const NEGOCIOS_ENCUESTA = ["Restaurante", "Cafetería", "Postres", "Italiano", "Mexicano", "Japonés", "Vegano", "Moderno"];
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [pasoEncuesta, setPasoEncuesta] = useState<1 | 2>(1);
  const [negocioElegido, setNegocioElegido] = useState<string | null>(null);
  const [preferenciaElegida, setPreferenciaElegida] = useState<"Premium" | "Gratuitas" | "Ambas" | null>(null);

  const guardarPreferencia = (negocio: string, preferencia: "Premium" | "Gratuitas" | "Ambas") => {
    const datos = { negocio, preferencia, fecha: new Date().toISOString() };
    try {
      localStorage.setItem("preferencia_plantillas", JSON.stringify(datos));
    } catch {}

    const token = localStorage.getItem("token");
    fetch(`${API}/api/preferencias-plantillas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(datos),
    }).catch(() => {});

    setNegocioElegido(negocio);
    setPreferenciaElegida(preferencia);
    if (NEGOCIOS_ENCUESTA.includes(negocio)) setCategoriaActiva(negocio);
    setMostrarEncuesta(false);
  };

  const toggleFavorito = (id: number) => {
    setFavoritos(prev => {
      const nuevo = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("favoritos_plantillas", JSON.stringify(nuevo));
      return nuevo;
    });
  };

  const plantillasFiltradas = plantillas
    .filter((p) => {
      if (categoriaActiva === "Favoritos") return favoritos.includes(p.id);
      const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
      const q = busqueda.toLowerCase();
      const coincideBusqueda = p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (preferenciaElegida === "Premium") return (b.premium ? 1 : 0) - (a.premium ? 1 : 0);
      if (preferenciaElegida === "Gratuitas") return (a.premium ? 1 : 0) - (b.premium ? 1 : 0);
      return 0;
    });

  const totalPaginas = Math.ceil(plantillasFiltradas.length / POR_PAGINA);
  const plantillasPagina = plantillasFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const usarPlantilla = (p: Plantilla) => {
    if (p.premium && !tienePlanPremium) {
      alert("Esta plantilla es exclusiva para planes Plus o Premium. Actualiza tu plan para usarla.");
      return;
    }
    localStorage.setItem("plantilla_cargada", JSON.stringify(p.config));
    window.location.href = "/editor";
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
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                background: activeNav === item.label ? "#7c3aed22" : "transparent",
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
      <main className="app-main" style={{ marginLeft: "clamp(0px, 220px, 220px)", flex: 1, padding: "clamp(16px, 4vw, 32px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Plantillas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Elige una plantilla para empezar tu menú</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setPasoEncuesta(1); setMostrarEncuesta(true); }}
              title="Editar tus preferencias"
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 14px", color: "#a855f7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              🎯 {negocioElegido ? `Para ti: ${negocioElegido}` : "Personalizar"}
            </button>
            <input
              type="text" placeholder="🔍 Buscar plantillas..."
              value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: 220 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button key={cat} onClick={() => { setCategoriaActiva(cat); setPagina(1); }} style={{
              background: categoriaActiva === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: categoriaActiva === cat ? "none" : "1px solid #2a2a35",
              borderRadius: 20, padding: "8px 18px",
              color: categoriaActiva === cat ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: categoriaActiva === cat ? 600 : 400,
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {plantillasPagina.map((p) => (
            <div key={p.id} className={p.premium ? "plantilla-card-premium" : undefined} style={{ position: "relative" }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
            >
              {p.popular && (
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 20, padding: "3px 10px", color: "white", fontSize: 10, fontWeight: 700 }}>⭐ Popular</div>
              )}
              {p.premium && (
                <div style={{ position: "absolute", top: p.popular ? 34 : 10, right: 10, zIndex: 2, background: !tienePlanPremium ? "rgba(0,0,0,0.65)" : "linear-gradient(135deg, #facc15, #ca8a04)", borderRadius: 20, padding: "3px 10px", color: !tienePlanPremium ? "#facc15" : "#1a1a1a", fontSize: 10, fontWeight: 700, border: !tienePlanPremium ? "1px solid #facc15" : "none" }}>
                  {!tienePlanPremium ? "🔒 Premium" : "✨ Premium"}
                </div>
              )}
              <div style={{ background: p.color, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a35", cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
                <button
                  onClick={e => { e.stopPropagation(); toggleFavorito(p.id); }}
                  style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 15, lineHeight: "28px" }}
                  title={favoritos.includes(p.id) ? "Quitar favorito" : "Agregar favorito"}
                >
                  {favoritos.includes(p.id) ? "❤️" : "🤍"}
                </button>
                <div style={{ color: p.textColor }}>
                  <IconoPlantilla categoria={p.categoria} size={48} />
                </div>
                <div style={{ fontFamily: p.config.fuenteActiva + ", serif", fontWeight: 700, fontSize: 14, color: p.textColor, textAlign: "center", padding: "0 8px" }}>MENÚ</div>
                <div style={{ color: p.textColor, opacity: 0.6, fontSize: 10, textAlign: "center", padding: "0 12px" }}>
                  {p.config.secciones.map(s => s.nombre).slice(0, 3).join(" · ")}
                </div>

                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 12px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)", textAlign: "left" }}>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{p.nombre}</div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 2 }}>{p.categoria}</div>
                </div>

                <div className="overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s", borderRadius: 12 }}>
                  <button
                    onClick={() => usarPlantilla(p)}
                    style={{ background: (p.premium && !tienePlanPremium) ? "#3a3a45" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: (p.premium && !tienePlanPremium) ? "1px solid #facc15" : "none", borderRadius: 8, padding: "10px 20px", color: (p.premium && !tienePlanPremium) ? "#facc15" : "white", fontWeight: 600, fontSize: 13, cursor: "pointer", width: 140 }}
                  >{(p.premium && !tienePlanPremium) ? "🔒 Actualizar plan" : "✓ Usar plantilla"}</button>
                  <button
                    onClick={() => setPreview(p)}
                    style={{ background: "transparent", border: "1px solid #ffffff44", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, cursor: "pointer", width: 140 }}
                  >👁 Vista previa</button>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => { localStorage.removeItem("plantilla_cargada"); window.location.href = "/editor"; }}
            style={{ border: "2px dashed #2a2a35", borderRadius: 12, cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
          >
            <div style={{ fontSize: 36, color: "#a855f7" }}>+</div>
            <div style={{ color: "#666", fontSize: 13 }}>Crear desde cero</div>
          </div>
        </div>
      {totalPaginas > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 16px", color: pagina === 1 ? "#444" : "white", cursor: pagina === 1 ? "default" : "pointer" }}>← Anterior</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPagina(n)}
                style={{ background: pagina === n ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 14px", color: "white", cursor: "pointer", fontWeight: pagina === n ? 700 : 400 }}>{n}</button>
            ))}
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 16px", color: pagina === totalPaginas ? "#444" : "white", cursor: pagina === totalPaginas ? "default" : "pointer" }}>Siguiente →</button>
          </div>
        )}
      </main>

      {/* MODAL ENCUESTA DE PREFERENCIAS */}
      {mostrarEncuesta && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 16, padding: "32px 28px", width: 380, maxWidth: "90vw", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
            <button
              onClick={() => setMostrarEncuesta(false)}
              style={{ float: "right", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 16 }}
            >✕</button>

            {pasoEncuesta === 1 && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>¿Qué tipo de negocio tienes?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Así te mostramos primero las plantillas que más te pueden gustar.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {NEGOCIOS_ENCUESTA.map((neg) => (
                    <button
                      key={neg}
                      onClick={() => { setNegocioElegido(neg); setPasoEncuesta(2); }}
                      style={{
                        background: negocioElegido === neg ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#1e1e28",
                        border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 8px",
                        color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {neg}
                    </button>
                  ))}
                </div>
              </>
            )}

            {pasoEncuesta === 2 && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>¿Qué te gustaría ver primero?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Puedes cambiarlo cuando quieras desde los filtros.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {([
                    ["Premium", "✨ Plantillas premium primero"],
                    ["Gratuitas", "🆓 Plantillas gratuitas primero"],
                    ["Ambas", "🔀 Mostrarme de todo, sin orden fijo"],
                  ] as const).map(([valor, texto]) => (
                    <button
                      key={valor}
                      onClick={() => guardarPreferencia(negocioElegido || "Todas", valor)}
                      style={{
                        background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
                        padding: "12px 14px", color: "white", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", textAlign: "left",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPasoEncuesta(1)}
                  style={{ marginTop: 14, background: "transparent", border: "none", color: "#666", fontSize: 12, cursor: "pointer" }}
                >← Volver</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL VISTA PREVIA */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: preview.config.fondoActivo.bg, borderRadius: 16, padding: "40px 36px", width: 360, maxHeight: "80vh", overflowY: "auto", fontFamily: preview.config.fuenteActiva, boxShadow: "0 30px 80px rgba(0,0,0,0.8)", position: "relative" }}>
            <button onClick={() => setPreview(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 28, height: 28, color: preview.config.fondoActivo.texto, cursor: "pointer", fontSize: 14 }}>✕</button>

            <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${preview.config.fondoActivo.acento}` }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginBottom: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
              <div style={{ fontSize: preview.config.tamaño / 2.8, color: preview.config.fondoActivo.texto, fontWeight: 700, letterSpacing: 4 }}>MENÚ</div>
              <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, letterSpacing: 6, marginTop: 4 }}>{preview.config.subtitulo}</div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginTop: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
            </div>

            {preview.config.secciones.map(sec => (
              <div key={sec.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: preview.config.fondoActivo.acento, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>{sec.nombre}</div>
                {sec.platillos.map((pl, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dotted ${preview.config.fondoActivo.acento}44`, padding: "5px 0" }}>
                    <div>
                      <div style={{ fontSize: 11, color: preview.config.fondoActivo.texto, fontWeight: 600 }}>{pl.nombre}</div>
                      <div style={{ fontSize: 9, color: preview.config.fondoActivo.texto, opacity: 0.6 }}>{pl.descripcion}</div>
                    </div>
                    <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, fontWeight: 700 }}>{pl.precio}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setPreview(null)} style={{ flex: 1, background: "transparent", border: `1px solid ${preview.config.fondoActivo.acento}`, borderRadius: 8, padding: "10px", color: preview.config.fondoActivo.acento, cursor: "pointer", fontSize: 12 }}>Cerrar</button>
              <button onClick={() => usarPlantilla(preview)} style={{ flex: 1, background: (preview.premium && !tienePlanPremium) ? "#3a3a45" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: (preview.premium && !tienePlanPremium) ? "1px solid #facc15" : "none", borderRadius: 8, padding: "10px", color: (preview.premium && !tienePlanPremium) ? "#facc15" : "white", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>{(preview.premium && !tienePlanPremium) ? "🔒 Actualizar plan" : "✓ Usar esta"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}