"use client";
import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [negocio, setNegocio] = useState("");

  const handleSubmit = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    if (modo === "login") {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        // Guardar cookie para el middleware
        document.cookie = `usuario=${data.usuario.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
        window.location.href = "/";
      } else {
        alert(data.mensaje);
      }
    } else {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, negocio }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("¡Cuenta creada! Ahora inicia sesión.");
        setModo("login");
      } else {
        alert(data.mensaje);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f13",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>

      {/* Fondo decorativo */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, #7c3aed22, transparent 70%)",
        top: -100, right: -100, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, #a855f722, transparent 70%)",
        bottom: -100, left: -100, pointerEvents: "none",
      }} />

      <div style={{ display: "flex", width: "100%", maxWidth: 900, minHeight: 560, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", zIndex: 1 }}>

        {/* Panel izquierdo - decorativo */}
        <div style={{
          flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          padding: 48, display: "flex", flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 100,
                            overflow: "hidden",
                            padding: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #7c3aed",
                            boxShadow: "0 6px 20px rgba(124,58,237,.25)",
                          }}
                        >
                          <Image
                            src="/mm.png"
                            alt="Menu Master"
                            width={46}
                            height={46}
                            priority
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>

          {/* Texto central */}
          <div>
            <h2 style={{ color: "white", fontSize: 28, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.3 }}>
              Diseña menús profesionales en minutos
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Crea, edita y comparte menús digitales para tu restaurante, cafetería o negocio de alimentos.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "✓ Editor drag & drop profesional",
              "✓ Exporta a PDF y QR al instante",
              "✓ Actualiza precios en segundos",
              "✓ Más de 20 plantillas premium",
            ].map((f) => (
              <div key={f} style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{f}</div>
            ))}
          </div>
        </div>

        {/* Panel derecho - formulario */}
        <div style={{
          width: 400, background: "#16161d",
          padding: 48, display: "flex", flexDirection: "column", justifyContent: "center",
        }}>

          {/* Tabs login / registro */}
          <div style={{
            display: "flex", background: "#0f0f13", borderRadius: 10,
            padding: 4, marginBottom: 32,
          }}>
            {(["login", "registro"] as const).map((m) => (
              <button key={m} onClick={() => setModo(m)} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 8,
                background: modo === m ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                color: modo === m ? "white" : "#666",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                textTransform: "capitalize",
              }}>
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {/* Título */}
          <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            {modo === "login" ? "¡Bienvenido de vuelta! 👋" : "Crea tu cuenta gratis 🚀"}
          </h1>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 28px" }}>
            {modo === "login" ? "Ingresa tus datos para continuar" : "Empieza a diseñar menús hoy mismo"}
          </p>

          {/* Formulario */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {modo === "registro" && (
              <div>
                <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text" placeholder="Ej. Juan Pérez"
                  value={nombre} onChange={e => setNombre(e.target.value)}
                  style={{
                    width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
                    borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = "#2a2a35")}
                />
              </div>
            )}

            {modo === "registro" && (
              <div>
                <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  NOMBRE DEL NEGOCIO
                </label>
                <input
                  type="text" placeholder="Ej. Restaurante El Buen Sabor"
                  value={negocio} onChange={e => setNegocio(e.target.value)}
                  style={{
                    width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
                    borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = "#2a2a35")}
                />
              </div>
            )}

            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email" placeholder="tucorreo@gmail.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
                  borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 13,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "#a855f7")}
                onBlur={e => (e.target.style.borderColor = "#2a2a35")}
              />
            </div>

            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                CONTRASEÑA
              </label>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
                  borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 13,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "#a855f7")}
                onBlur={e => (e.target.style.borderColor = "#2a2a35")}
              />
            </div>

            {modo === "login" && (
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#a855f7", fontSize: 12, cursor: "pointer" }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            )}

            <button onClick={handleSubmit} style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 10, padding: "13px",
              color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
              marginTop: 4, transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {modo === "login" ? "Iniciar sesión →" : "Crear cuenta gratis →"}
            </button>

          </div>

          {/* Footer */}
          <p style={{ color: "#555", fontSize: 12, textAlign: "center", marginTop: 24 }}>
            {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <span
              onClick={() => setModo(modo === "login" ? "registro" : "login")}
              style={{ color: "#a855f7", cursor: "pointer", fontWeight: 600 }}
            >
              {modo === "login" ? "Regístrate gratis" : "Inicia sesión"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}