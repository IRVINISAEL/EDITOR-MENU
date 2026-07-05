"use client";
import { useState, useEffect } from "react";

export default function Login() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [negocio, setNegocio] = useState("");
    const [showPassword, setShowPassword] = useState(false);


  const [mobile, setMobile] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordFuerte, setPasswordFuerte] = useState(false);

  const validarPassword = (val: string) => {
    setPassword(val);
    if (val.length === 0) { setPasswordError(""); setPasswordFuerte(false); return; }
    if (val.length < 8) { setPasswordError("Mínimo 8 caracteres"); setPasswordFuerte(false); return; }
    if (!/[A-Z]/.test(val)) { setPasswordError("Incluye al menos una mayúscula"); setPasswordFuerte(false); return; }
    if (!/[0-9]/.test(val)) { setPasswordError("Incluye al menos un número"); setPasswordFuerte(false); return; }
    setPasswordError("");
    setPasswordFuerte(true);
  };
  
  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= 768);

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
}, []);

  const handleSubmit = async () => {
    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    const API = process.env.NEXT_PUBLIC_API_URL;
    setShowPassword(false);

    if (modo === "login") {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token);
        // Guardar cookie para el middleware
        document.cookie = `usuario=${data.usuario.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
        window.location.href = "/";
      } else {
        const res = await fetch(`${API}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password, negocio }),
        });
        const data = await res.json();
        if (data.ok) {
          setErrors({ submit: "¡Cuenta creada! Ahora inicia sesión." });
          setTimeout(() => {
            setModo("login");
            setNombre("");
            setEmail("");
            setPassword("");
            setNegocio("");
            setErrors({});
          }, 1500);
        } else {
          setErrors({ submit: data.mensaje || "Error al registrar" });
        }
      }
    } catch (error) {
      setErrors({ submit: "Error de conexión. Intenta más tarde." });
    } finally {
      setLoading(false);
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
        position: "absolute", width: "100%",
        maxWidth: mobile ? "100%" : 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, #a855f722, transparent 70%)",
        bottom: -100, left: -100, pointerEvents: "none",
      }} />

      <div
        style={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          width: "100%",
          maxWidth: mobile ? 420 : 900,
          minHeight: mobile ? "auto" : 560,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          zIndex: 1,
          margin: mobile ? 15 : 0,
        }}
      >

        {/* Panel izquierdo - decorativo */}
        <div style={{
          flex: mobile ? "none" : 1,
          width: mobile ? "100%" : "auto",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          padding: mobile ? 24 : 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: mobile ? "flex-start" : "space-between",
          gap: mobile ? 20 : 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="Menu Master" style={{ width: mobile ? 30 : 42,
            height: mobile ? 30 : 42, borderRadius: 12 }} />
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>

          {/* Texto central */}
          <div>
            <h2 style={{ color: "white", fontSize: mobile ? 18 : 28, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>
              Diseña menús profesionales en minutos
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Crea, edita y comparte menús digitales para tu restaurante, cafetería o negocio de alimentos.
            </p>
          </div>

          {/* Features */}
          {!mobile && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              "✓ Editor drag & drop profesional",
              "✓ Exporta a PDF y QR al instante",
              "✓ Actualiza precios en segundos",
              "✓ Más de 20 plantillas premium",
            ].map((f) => (
              <div key={f} style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{f}</div>
            ))}
          </div>
)}
        </div>

        {/* Panel derecho - formulario */}
        <div style={{
          width: "100%",
          maxWidth: mobile ? "100%" : 400, background: "#16161d",
          padding: mobile ? 28 : 48,display: "flex", flexDirection: "column", justifyContent: "center",
        }}>

          {/* Tabs login / registro */}
          <div style={{
            display: "flex", background: "#0f0f13", borderRadius: 10,
            padding: 4, marginBottom: 32,
          }}>
            {(["login", "registro"] as const).map((m) => (
              <button key={m} onClick={() => setModo(m)} style={{
                flex: 1, padding: mobile ? "12px 8px" : "10px",
                whiteSpace: "nowrap", border: "none", borderRadius: 8,
                background: modo === m ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                color: modo === m ? "white" : "#666",
                fontWeight: 600, fontSize: mobile ? 12 : 13, cursor: "pointer",
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
                    borderRadius: 8, padding: mobile ? "14px 16px" : "11px 14px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = errors.nombre ? "#ef4444" : "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = errors.nombre ? "#ef4444" : "#2a2a35")}
                />
                {errors.nombre && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{errors.nombre}</p>}
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
                    borderRadius: 8, padding: mobile ? "14px 16px" : "11px 14px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = errors.negocio ? "#ef4444" : "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = errors.negocio ? "#ef4444" : "#2a2a35")}
                />
                {errors.negocio && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{errors.negocio}</p>}
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
                  borderRadius: 8, padding: mobile ? "14px 16px" : "11px 14px", color: "white", fontSize: 13,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = errors.email ? "#ef4444" : "#a855f7")}
                onBlur={e => (e.target.style.borderColor = errors.email ? "#ef4444" : "#2a2a35")}
              />
              {errors.email && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                CONTRASEÑA
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password} onChange={e => validarPassword(e.target.value)}
                  style={{
                    width: "100%", background: "#0f0f13",
                    border: `1px solid ${passwordError ? "#ef4444" : passwordFuerte ? "#22c55e" : "#2a2a35"}`,
                    borderRadius: 8, padding: mobile ? "14px 16px" : "11px 14px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = passwordError ? "#ef4444" : passwordFuerte ? "#22c55e" : "#2a2a35")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: mobile ? 14 : 11,
                    right: 14,
                    background: "transparent",
                    border: "none",
                    color: "#a855f7",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {modo === "registro" && password.length === 0 && (
                <p style={{ color: "#666", fontSize: 11, marginTop: 5 }}>
                  Mínimo 8 caracteres, una mayúscula y un número
                </p>
              )}
              {passwordError && (
                <p style={{ color: "#ef4444", fontSize: 11, marginTop: 5 }}>⚠ {passwordError}</p>
              )}
              {passwordFuerte && (
                <p style={{ color: "#22c55e", fontSize: 11, marginTop: 5 }}>✓ Contraseña segura</p>
              )}
            </div>

            {modo === "login" && (
              <div style={{ textAlign: "right" }}>
                <a href="/forgot-password" style={{ color: "#a855f7", fontSize: 12, textDecoration: "none" }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            {errors.submit && (
              <div style={{
                background: errors.submit.includes("Error") || errors.submit.includes("no es válido") ? "#7f1d1d" : "#166534",
                border: errors.submit.includes("Error") || errors.submit.includes("no es válido") ? "1px solid #ef4444" : "1px solid #22c55e",
                borderRadius: 8,
                padding: "12px",
                color: errors.submit.includes("Error") || errors.submit.includes("no es válido") ? "#fecaca" : "#86efac",
                fontSize: 12,
              }}>
                {errors.submit}
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={loading || Object.keys(errors).length > 0}
              style={{
                background: loading || Object.keys(errors).length > 0 ? "#7c3aed66" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none", borderRadius: 10, padding: "13px",
                color: "white", fontWeight: 700, fontSize: 14, cursor: loading || Object.keys(errors).length > 0 ? "not-allowed" : "pointer",
                marginTop: 4, transition: "opacity 0.2s", opacity: loading || Object.keys(errors).length > 0 ? 0.6 : 1,
              }}
              onMouseEnter={e => !loading && Object.keys(errors).length === 0 && (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => !loading && Object.keys(errors).length === 0 && (e.currentTarget.style.opacity = "1")}
            >
              {loading ? "Procesando..." : (modo === "login" ? "Iniciar sesión →" : "Crear cuenta gratis →")}
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