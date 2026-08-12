"use client";
import { useState, useEffect } from "react";

const IconMail = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconUser = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);

const IconBuilding = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
  </svg>
);

const IconLock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const IconEye = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.5 9.5 0 0 1 12 4c7 0 11 7 11 7a17.6 17.6 0 0 1-3.06 3.94M6.1 6.1C3.6 7.7 2 10.5 2 11c0 0 4 7 11 7 1.5 0 2.9-.3 4.1-.9M1 1l22 22" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

const IconArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconCheck = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconAlert = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const IconMenuBadge = ({ size = 46 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3v18M4 3c0 3 3 3 3 6s-3 3-3 6" />
    <path d="M9 3v7a2 2 0 0 0 2 2v9" />
    <path d="M13 3v9" />
    <circle cx="19" cy="7" r="4" />
    <path d="M19 11v10" />
  </svg>
);

const IconShieldCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconStar = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
);

const IconUsers = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function Login() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [negocio, setNegocio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("acaba-de-iniciar-sesion", "true");
        document.cookie = `usuario=${data.usuario.id}; path=/; max-age=${60 * 60 * 24 * (rememberMe ? 30 : 7)}`;
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
        sessionStorage.setItem("mm-recien-registrado", "true");
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
      position: "relative", overflow: "hidden", padding: mobile ? "20px 0" : 0,
    }}>

      <style>{`
        @keyframes mmFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes mmFloatSlow { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(10px) scale(1.04); } }
        @keyframes mmCardIn { 0% { opacity: 0; transform: translateY(24px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes mmPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); } 70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); } }
        .mm-card-shell { animation: mmCardIn .55s cubic-bezier(.16,1,.3,1) both; }
        .mm-trust-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); border-radius: 999px; padding: 6px 12px; color: rgba(255,255,255,0.92); font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); }
        .mm-avatar { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #16161d; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; margin-left: -8px; }
        .mm-avatar:first-child { margin-left: 0; }
        .mm-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block; animation: mmPulse 2s infinite; }
        .mm-field { position: relative; }
        .mm-field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #666; pointer-events: none; transition: color .15s ease; display:flex; }
        .mm-field:focus-within .mm-field-icon { color: #a855f7; }
        .mm-input { width: 100%; background: #0f0f13; border: 1px solid #2a2a35; border-radius: 8px; color: white; font-size: 13px; outline: none; box-sizing: border-box; transition: border-color .15s ease; font-family: inherit; }
        .mm-input::placeholder { color: #4a4a55; }
        .mm-tab { flex: 1; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-transform: capitalize; transition: background .2s ease, color .2s ease; }
        .mm-btn-primary { background: linear-gradient(135deg, #7c3aed, #a855f7); border: none; border-radius: 10px; color: white; font-weight: 700; cursor: pointer; transition: opacity .2s ease, transform .1s ease; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        .mm-btn-primary:hover { opacity: .92; }
        .mm-btn-primary:active { transform: scale(.98); }
        .mm-eye-btn { position: absolute; top: 50%; transform: translateY(-50%); right: 12px; background: transparent; border: none; color: #777; cursor: pointer; padding: 4px; display: flex; align-items: center; transition: color .15s ease; }
        .mm-eye-btn:hover { color: #a855f7; }
        .mm-checkbox { accent-color: #a855f7; width: 15px; height: 15px; cursor: pointer; }
        .mm-link { color: #a855f7; text-decoration: none; transition: opacity .15s ease; }
        .mm-link:hover { opacity: .8; }
        @media (max-width: 480px) {
          .mm-card-shell { border-radius: 16px !important; }
        }
      `}</style>

      {/* Fondo decorativo global */}
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
        className="mm-card-shell"
        style={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          width: "100%",
          maxWidth: mobile ? 420 : 920,
          minHeight: mobile ? "auto" : 580,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          zIndex: 1,
          margin: mobile ? "0 15px" : 0,
        }}
      >

        {/* Panel izquierdo - decorativo con blobs */}
        <div style={{
          flex: mobile ? "none" : 1,
          width: mobile ? "100%" : "auto",
          minHeight: mobile ? 200 : "auto",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          padding: mobile ? "24px 24px 0" : 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: mobile ? "flex-start" : "space-between",
          gap: mobile ? 16 : 0,
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Blobs orgánicos de fondo (estilo wave) */}
          <svg
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, pointerEvents: "none" }}
          >
            <path
              d="M-40,180 C40,80 140,260 220,150 C300,40 380,180 440,120 L440,640 L-40,640 Z"
              fill="rgba(255,255,255,0.07)"
            />
            <path
              d="M-40,420 C60,340 120,480 230,400 C330,330 380,470 440,400 L440,640 L-40,640 Z"
              fill="rgba(0,0,0,0.10)"
            />
          </svg>

          {/* Circulos flotantes decorativos */}
          <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.08)", top: 30, right: 40, animation: "mmFloat 7s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.10)", bottom: 60, right: 90, animation: "mmFloat 5s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.25)", bottom: 110, right: 60, animation: "mmFloat 6s ease-in-out infinite", pointerEvents: "none" }} />

          {/* Logo + badge de seguridad */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/logo.png" alt="Menu Master" style={{
                width: mobile ? 30 : 42, height: mobile ? 30 : 42, borderRadius: 12,
              }} />
              <div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>MENU</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 18, lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>MASTER</div>
              </div>
            </div>
            {!mobile && (
              <div className="mm-trust-pill">
                <IconShieldCheck size={13} />
                Plataforma verificada
              </div>
            )}
          </div>

          {/* Texto central */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ color: "white", fontSize: mobile ? 18 : 28, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>
              Diseña menús profesionales en minutos
            </h2>
            {!mobile && (
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
                Crea, edita y comparte menús digitales para tu restaurante, cafetería o negocio de alimentos.
              </p>
            )}

            {/* Barra de confianza: reseñas + negocios activos */}
            <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 18, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", color: "#facc15" }}>
                  {[1, 2, 3, 4, 5].map(i => <IconStar key={i} size={mobile ? 11 : 13} />)}
                </div>
                <span style={{ color: "white", fontSize: mobile ? 11 : 12, fontWeight: 700 }}>4.9</span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {["#f472b6", "#60a5fa", "#34d399", "#fbbf24"].map((c, i) => (
                  <div key={i} className="mm-avatar" style={{ background: c }}>
                    {["MJ", "RA", "SP", "LT"][i]}
                  </div>
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: mobile ? 11 : 12, fontWeight: 500 }}>
                +500 negocios confían en nosotros*
              </span>
            </div>
          </div>

          {/* Insignia central ilustrativa (solo desktop) */}
          {!mobile && (
            <div style={{
              position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
              width: 130, height: 130, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "mmFloatSlow 8s ease-in-out infinite",
            }}>
              <div style={{ color: "white" }}>
                <IconMenuBadge size={52} />
              </div>
            </div>
          )}

          {/* Features */}
          {!mobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
              {[
                "Editor drag & drop profesional",
                "Exporta a PDF y QR al instante",
                "Actualiza precios en segundos",
                "Más de 20 plantillas premium",
              ].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.9)", fontSize: 13 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <IconCheck size={11} />
                  </span>
                  {f}
                </div>
              ))}
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, margin: "4px 0 0" }}>
                *Cifra de ejemplo — reemplázala con tus datos reales
              </p>
            </div>
          )}
        </div>

        {/* Panel derecho - formulario */}
        <div style={{
          width: "100%",
          maxWidth: mobile ? "100%" : 400, background: "#16161d",
          padding: mobile ? "28px 24px 32px" : 48, display: "flex", flexDirection: "column", justifyContent: "center",
        }}>

          {/* Tabs login / registro */}
          <div style={{
            display: "flex", background: "#0f0f13", borderRadius: 10,
            padding: 4, marginBottom: 28,
          }}>
            {(["login", "registro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className="mm-tab"
                style={{
                  padding: mobile ? "12px 8px" : "10px",
                  whiteSpace: "nowrap",
                  background: modo === m ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                  color: modo === m ? "white" : "#666",
                  fontSize: mobile ? 12 : 13,
                }}
              >
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {/* Título */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 6px" }}>
            <span style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed33, #a855f733)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", flexShrink: 0,
            }}>
              {modo === "login" ? <IconUser size={17} /> : <IconMenuBadge size={17} />}
            </span>
            <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              {modo === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta gratis"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 26px" }}>
            <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
              {modo === "login" ? "Ingresa tus datos para continuar" : "Empieza a diseñar menús hoy mismo"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 11, fontWeight: 600 }}>
              <span className="mm-live-dot" />
              Servicio activo
            </div>
          </div>

          {/* Formulario */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {modo === "registro" && (
              <div>
                <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  NOMBRE COMPLETO
                </label>
                <div className="mm-field">
                  <span className="mm-field-icon"><IconUser /></span>
                  <input
                    type="text" placeholder="Ej. Juan Pérez"
                    value={nombre} onChange={e => setNombre(e.target.value)}
                    className="mm-input"
                    style={{
                      padding: mobile ? "14px 16px 14px 40px" : "11px 14px 11px 40px",
                      borderColor: "#2a2a35",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#a855f7")}
                    onBlur={e => (e.target.style.borderColor = "#2a2a35")}
                  />
                </div>
              </div>
            )}

            {modo === "registro" && (
              <div>
                <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  NOMBRE DEL NEGOCIO
                </label>
                <div className="mm-field">
                  <span className="mm-field-icon"><IconBuilding /></span>
                  <input
                    type="text" placeholder="Ej. Restaurante El Buen Sabor"
                    value={negocio} onChange={e => setNegocio(e.target.value)}
                    className="mm-input"
                    style={{
                      padding: mobile ? "14px 16px 14px 40px" : "11px 14px 11px 40px",
                      borderColor: "#2a2a35",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#a855f7")}
                    onBlur={e => (e.target.style.borderColor = "#2a2a35")}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                CORREO ELECTRÓNICO
              </label>
              <div className="mm-field">
                <span className="mm-field-icon"><IconMail /></span>
                <input
                  type="email" placeholder="tucorreo@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="mm-input"
                  style={{
                    padding: mobile ? "14px 16px 14px 40px" : "11px 14px 11px 40px",
                    borderColor: "#2a2a35",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = "#2a2a35")}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                CONTRASEÑA
              </label>
              <div className="mm-field">
                <span className="mm-field-icon"><IconLock /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password} onChange={e => validarPassword(e.target.value)}
                  className="mm-input"
                  style={{
                    padding: mobile ? "14px 40px 14px 40px" : "11px 40px 11px 40px",
                    borderColor: passwordError ? "#ef4444" : passwordFuerte ? "#22c55e" : "#2a2a35",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#a855f7")}
                  onBlur={e => (e.target.style.borderColor = passwordError ? "#ef4444" : passwordFuerte ? "#22c55e" : "#2a2a35")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mm-eye-btn"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {modo === "registro" && password.length === 0 && (
                <p style={{ color: "#666", fontSize: 11, marginTop: 5 }}>
                  Mínimo 8 caracteres, una mayúscula y un número
                </p>
              )}
              {passwordError && (
                <p style={{ color: "#ef4444", fontSize: 11, marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <IconAlert /> {passwordError}
                </p>
              )}
              {passwordFuerte && (
                <p style={{ color: "#22c55e", fontSize: 11, marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <IconCheck size={11} /> Contraseña segura
                </p>
              )}
            </div>

            {modo === "login" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, color: "#888", fontSize: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    className="mm-checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  Recordarme
                </label>
                <a href="/forgot-password" className="mm-link" style={{ fontSize: 12 }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button onClick={handleSubmit} className="mm-btn-primary" style={{ padding: "13px", fontSize: 14, marginTop: 4 }}>
              {modo === "login" ? "Iniciar sesión" : "Crear cuenta gratis"}
              <IconArrowRight />
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#555", fontSize: 11, marginTop: 2 }}>
              <IconLock size={11} />
              Conexión segura · cifrado SSL
            </div>

          </div>

          {/* Footer */}
          <p style={{ color: "#555", fontSize: 12, textAlign: "center", marginTop: 24 }}>
            {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <span
              onClick={() => setModo(modo === "login" ? "registro" : "login")}
              className="mm-link"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              {modo === "login" ? "Regístrate gratis" : "Inicia sesión"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}