"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    if (!email.trim()) {
      setStatus("error");
      setMessage("Ingresa tu correo electrónico.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setMessage("Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña.");
      } else {
        setStatus("error");
        setMessage(data.mensaje || "No fue posible procesar tu solicitud.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error de conexión. Intenta nuevamente más tarde.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f13",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#16161d", borderRadius: 24, padding: 36, boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Recuperar contraseña</h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>
          Ingresa el correo asociado a tu cuenta y te indicaremos los pasos para restablecer tu contraseña.
        </p>

        <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
          CORREO ELECTRÓNICO
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          style={{
            width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
            borderRadius: 10, padding: "14px 16px", color: "white", fontSize: 14,
            marginBottom: 20, outline: "none", boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          style={{
            width: "100%", border: "none", borderRadius: 12,
            padding: "14px 16px", background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
            opacity: status === "loading" ? 0.8 : 1,
          }}
        >
          {status === "loading" ? "Enviando..." : "Solicitar recuperación"}
        </button>

        {message && (
          <p style={{
            marginTop: 20,
            color: status === "success" ? "#4ade80" : "#f87171",
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 28, color: "#666", fontSize: 13 }}>
          ¿Recordaste tu contraseña?&nbsp;
          <a href="/login" style={{ color: "#a855f7", fontWeight: 600 }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
