"use client";
import { useState } from "react";

const features = [
  { icon: "✏️", titulo: "Editor Profesional", desc: "Diseña tu menú con drag & drop. Sin conocimientos de diseño." },
  { icon: "⚡", titulo: "Actualización Instantánea", desc: "Cambia precios y platillos en segundos desde tu celular." },
  { icon: "📄", titulo: "Exporta a PDF y QR", desc: "Descarga tu menú en PDF o comparte el link con un código QR." },
  { icon: "🎨", titulo: "Plantillas Premium", desc: "Más de 20 plantillas profesionales para todo tipo de negocio." },
  { icon: "📱", titulo: "Vista Móvil", desc: "Tus clientes pueden ver el menú desde cualquier celular." },
  { icon: "💰", titulo: "Ahorra dinero", desc: "Olvídate de pagar $1,000 MXN cada vez que actualizas tu menú." },
];

const testimonios = [
  { nombre: "Ema Martha", negocio: "Gaabanny Postres", texto: "Antes pagábamos mucho en impresión. Ahora actualizamos el menú en segundos.", emoji: "🍰" },
  { nombre: "Angel Rosas", negocio: "Cocina Alcatraz", texto: "Ya no perdemos menús físicos ni tenemos quejas por precios incorrectos.", emoji: "🍽️" },
  { nombre: "Juan Sánchez", negocio: "Islas Cafe", texto: "El diseño quedó increíble y mis clientes siempre tienen los precios correctos.", emoji: "☕" },
];

const planes = [
  { nombre: "BÁSICO", precio: 99, features: ["1 Menú", "5 Plantillas", "Exportar PDF", "Soporte email"], popular: false },
  { nombre: "PROFESIONAL", precio: 399, features: ["Menús ilimitados", "Plantillas Premium", "PDF + QR", "Soporte prioritario"], popular: true },
  { nombre: "EMPRESARIAL", precio: 799, features: ["Todo en Pro", "Múltiples usuarios", "Marca Blanca", "Soporte 24/7"], popular: false },
];

const WHATSAPP_NUMBER = "529001234567";

export default function Landing() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleWhatsApp = (plan: string, precio: number) => {
    const msg = `¡Hola! 👋 Quiero el plan *${plan}* ($${precio}/mes) de Menu Master.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13", color: "white", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,15,19,0.95)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid #2a2a35",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="Menu Master" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <div>
            <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>MENU</span>
            <span style={{ color: "#a855f7", fontWeight: 800, fontSize: 16 }}>MASTER</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Características", "Precios", "Testimonios"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "#888", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}
            >{item}</a>
          ))}
          <a href="/login">
            <button style={{
              background: "transparent", border: "1px solid #2a2a35",
              borderRadius: 8, padding: "8px 16px", color: "#aaa",
              cursor: "pointer", fontSize: 13,
            }}>Iniciar sesión</button>
          </a>
          <a href="/login">
            <button style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 8, padding: "8px 16px",
              color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>Empezar gratis →</button>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center", padding: "120px 48px 80px",
        position: "relative",
      }}>
        {/* Fondo decorativo */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, #7c3aed18, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />

        <div style={{
          background: "#7c3aed22", border: "1px solid #7c3aed44",
          borderRadius: 20, padding: "6px 16px", fontSize: 12,
          color: "#a855f7", fontWeight: 600, marginBottom: 24,
          display: "inline-block",
        }}>
          ✨ La herramienta #1 para menús digitales en México
        </div>

        <h1 style={{ fontSize: 56, fontWeight: 800, margin: "0 0 24px", lineHeight: 1.15, maxWidth: 700 }}>
          Diseña menús{" "}
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            profesionales
          </span>{" "}
          en minutos
        </h1>

        <p style={{ fontSize: 18, color: "#888", maxWidth: 520, lineHeight: 1.7, margin: "0 0 40px" }}>
          Crea, edita y comparte menús digitales para tu restaurante o cafetería. Sin diseñadores, sin impresiones costosas.
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          <a href="/login">
            <button style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 12, padding: "16px 32px",
              color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer",
            }}>Empezar gratis →</button>
          </a>
          <a href="#características">
            <button style={{
              background: "transparent", border: "1px solid #2a2a35",
              borderRadius: 12, padding: "16px 32px",
              color: "#aaa", fontSize: 16, cursor: "pointer",
            }}>Ver cómo funciona</button>
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, marginTop: 64, padding: "24px 48px", background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16 }}>
          {[
            { valor: "500+", label: "Negocios activos" },
            { valor: "$1,000", label: "MXN ahorrados por menú" },
            { valor: "100%", label: "Clientes satisfechos" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.valor}</div>
              <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section id="características" style={{ padding: "80px 48px", background: "#16161d" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px" }}>Todo lo que necesitas</h2>
          <p style={{ color: "#666", fontSize: 16 }}>Una plataforma completa para gestionar tus menús digitales</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {features.map(f => (
            <div key={f.titulo} style={{
              background: "#1e1e28", border: "1px solid #2a2a35",
              borderRadius: 16, padding: 28,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{f.titulo}</div>
              <div style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" style={{ padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px" }}>Lo que dicen nuestros clientes</h2>
          <p style={{ color: "#666", fontSize: 16 }}>Negocios reales de Tehuacán que ya usan Menu Master</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
          {testimonios.map(t => (
            <div key={t.nombre} style={{
              background: "#1e1e28", border: "1px solid #2a2a35",
              borderRadius: 16, padding: 28,
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{t.emoji}</div>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                "{t.texto}"
              </p>
              <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{t.nombre}</div>
              <div style={{ color: "#666", fontSize: 12 }}>{t.negocio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" style={{ padding: "80px 48px", background: "#16161d" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px" }}>Precios simples y transparentes</h2>
          <p style={{ color: "#666", fontSize: 16 }}>Sin contratos. Cancela cuando quieras.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 860, margin: "0 auto" }}>
          {planes.map(p => (
            <div key={p.nombre} style={{ position: "relative" }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  borderRadius: 20, padding: "4px 16px",
                  color: "white", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                }}>⭐ MÁS POPULAR</div>
              )}
              <div style={{
                background: p.popular ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
                border: p.popular ? "none" : "1px solid #2a2a35",
                borderRadius: 16, padding: 28,
                display: "flex", flexDirection: "column", gap: 20,
              }}>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{p.nombre}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: "white", fontSize: 32, fontWeight: 800 }}>${p.precio}</span>
                    <span style={{ color: p.popular ? "rgba(255,255,255,0.7)" : "#666", fontSize: 13 }}>/mes</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: p.popular ? "white" : "#a855f7" }}>✓</span>
                      <span style={{ color: p.popular ? "rgba(255,255,255,0.9)" : "#aaa", fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleWhatsApp(p.nombre, p.precio)} style={{
                  background: p.popular ? "white" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none", borderRadius: 10, padding: "12px",
                  color: p.popular ? "#7c3aed" : "white",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                  💬 Empezar ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "80px 48px", textAlign: "center" }}>
        <div style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          borderRadius: 24, padding: "64px 48px", maxWidth: 700, margin: "0 auto",
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 16px" }}>
            ¿Listo para digitalizar tu menú?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, margin: "0 0 32px" }}>
            Únete a más de 500 negocios que ya usan Menu Master
          </p>
          <a href="/login">
            <button style={{
              background: "white", border: "none", borderRadius: 12,
              padding: "16px 40px", color: "#7c3aed",
              fontWeight: 800, fontSize: 16, cursor: "pointer",
            }}>Empezar gratis →</button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", borderTop: "1px solid #2a2a35", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <img src="/logo.png" alt="Menu Master" style={{ width: 28, height: 28, borderRadius: 8 }} />
          <span style={{ color: "white", fontWeight: 700 }}>MENU</span>
          <span style={{ color: "#a855f7", fontWeight: 700 }}>MASTER</span>
        </div>
        <p style={{ color: "#555", fontSize: 13 }}>© 2024 Menu Master. Hecho con ❤️ en Tehuacán, México.</p>
      </footer>

    </div>
  );
}