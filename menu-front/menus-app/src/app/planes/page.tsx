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

type Plan = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  beneficios: string[];
};

// Iconos por plan (SVG en vez de emojis)
const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const IconBolt = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconRocket = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
const IconDiamond = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9Z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const PLAN_ICON: Record<string, React.ReactNode> = {
  Free: <IconLeaf />,
  "Básico": <IconBolt />,
  Plus: <IconRocket />,
  Premium: <IconDiamond />,
};
const PLAN_POPULAR = "Plus"; // nombre del plan que se resalta como más popular

export default function Planes() {
  const [activeNav] = useState("Facturación");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planActivo, setPlanActivo] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [activando, setActivando] = useState<number | null>(null);
  const [solicitado, setSolicitado] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/planes`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPlanes(data.planes);
      })
      .finally(() => setCargando(false));
  }, []);

  const handleActivar = async (planId: number, nombre: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setActivando(planId);
    try {
      const res = await fetch(`${API}/api/planes/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.ok) {
        setSolicitado(planId);
        alert(`Solicitud enviada para el plan ${nombre}. Te avisaremos cuando esté aprobado ✅`);
      } else {
        alert(data.mensaje || "No se pudo enviar la solicitud");
      }
    } catch {
      alert("Error de conexión al solicitar el plan");
    } finally {
      setActivando(null);
    }
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
      <main className="app-main" style={{ marginLeft: 220, flex: 1, padding: 32 }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 700, margin: 0 }}>Planes y Precios</h1>
          <p style={{ color: "#666", fontSize: 15, margin: "10px 0 0" }}>Elige el plan perfecto para tu negocio</p>
        </div>

        {/* Cards */}
        {cargando ? (
          <p style={{ color: "#888", textAlign: "center" }}>Cargando planes...</p>
        ) : planes.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>No hay planes disponibles por ahora.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
            {planes.map((plan) => {
              const esPopular = plan.nombre === PLAN_POPULAR;
              const esActivo = planActivo === plan.id;
              const precioNum = Number(plan.precio) || 0;
              return (
                <div key={plan.id} style={{ position: "relative" }}>
                  {esPopular && (
                    <div style={{
                      position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      borderRadius: 20, padding: "4px 16px",
                      color: "white", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", zIndex: 2,
                    }}><IconStar /> MÁS POPULAR</div>
                  )}
                  <div style={{
                    background: esPopular ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
                    border: esPopular ? "none" : "1px solid #2a2a35",
                    borderRadius: 16, padding: 24,
                    display: "flex", flexDirection: "column", gap: 20,
                    height: "100%", boxSizing: "border-box",
                  }}>
                    <div>
                      <div style={{ color: esPopular ? "white" : "#a855f7", marginBottom: 8 }}>{PLAN_ICON[plan.nombre] || <IconPackage />}</div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{plan.nombre.toUpperCase()}</div>
                      <div style={{ color: esPopular ? "rgba(255,255,255,0.7)" : "#666", fontSize: 12, marginTop: 4 }}>{plan.descripcion}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        {precioNum > 0 && (
                          <span style={{
                            color: esPopular ? "rgba(255,255,255,0.6)" : "#666",
                            fontSize: 16, fontWeight: 600,
                            textDecoration: "line-through",
                          }}>${precioNum.toFixed(2)}</span>
                        )}
                        <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>
                          ${(precioNum / 2).toFixed(2)}
                        </span>
                        <span style={{ color: esPopular ? "rgba(255,255,255,0.7)" : "#666", fontSize: 13 }}>/mes</span>
                      </div>
                      {precioNum > 0 && (
                        <span style={{
                          display: "inline-block", marginTop: 6,
                          background: esPopular ? "rgba(255,255,255,0.2)" : "#a855f722",
                          color: esPopular ? "white" : "#a855f7",
                          fontSize: 11, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 20,
                        }}>-50% OFERTA</span>
                      )}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      {(plan.beneficios || []).map((f) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: esPopular ? "white" : "#a855f7", fontSize: 14 }}>✓</span>
                          <span style={{ color: esPopular ? "rgba(255,255,255,0.9)" : "#aaa", fontSize: 13 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleActivar(plan.id, plan.nombre)}
                      disabled={esActivo || solicitado === plan.id || activando === plan.id}
                      style={{
                        background: esActivo ? "#333" : "white",
                        border: "none", borderRadius: 10, padding: "12px",
                        color: esActivo ? "#888" : "#7c3aed",
                        fontWeight: 700, fontSize: 13,
                        cursor: esActivo ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        opacity: activando === plan.id ? 0.6 : 1,
                      }}
                    >
                      {esActivo
                        ? "✅ Plan Activo"
                        : solicitado === plan.id
                        ? "⏳ En revisión"
                        : activando === plan.id
                        ? "Enviando..."
                        : "Solicitar Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{
          textAlign: "center", marginTop: 40,
          background: "#1e1e28", border: "1px solid #2a2a35",
          borderRadius: 12, padding: "20px", maxWidth: 500, margin: "40px auto 0",
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}><IconLock /></div>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Tus datos están 100% seguros</div>
          <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
            Al dar clic en "Activar Plan" tu suscripción se actualiza de inmediato en tu cuenta.
          </div>
        </div>

      </main>
    </div>
  );
}