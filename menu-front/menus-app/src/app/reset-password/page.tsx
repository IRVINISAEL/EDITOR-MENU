"use client";

import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token") || "";
    setToken(queryToken);

    if (!queryToken) {
      setTokenValid(false);
      setMessage("Token de recuperación no encontrado.");
      return;
    }

    const verifyToken = async () => {
      const API = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await fetch(`${API}/api/auth/reset-password/${queryToken}`);
        const data = await res.json();
        if (data.ok) {
          setTokenValid(true);
          setMessage("");
        } else {
          setTokenValid(false);
          setMessage(data.mensaje || "Token inválido o expirado.");
        }
      } catch (error) {
        setTokenValid(false);
        setMessage("Error de conexión. Intenta nuevamente más tarde.");
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setStatus("error");
      setMessage("Completa ambos campos.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setStatus("loading");
    const API = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setMessage("Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      } else {
        setStatus("error");
        setMessage(data.mensaje || "No se pudo restablecer la contraseña.");
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
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Restablecer contraseña</h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>
          Crea una nueva contraseña segura para tu cuenta.
        </p>

        {tokenValid === false ? (
          <p style={{ color: "#f87171", fontSize: 14 }}>{message}</p>
        ) : tokenValid === null ? (
          <p style={{ color: "#888", fontSize: 14 }}>Validando token...</p>
        ) : (
          <>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
              NUEVA CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", background: "#0f0f13", border: "1px solid #2a2a35",
                borderRadius: 10, padding: "14px 16px", color: "white", fontSize: 14,
                marginBottom: 16, outline: "none", boxSizing: "border-box",
              }}
            />

            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
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
              {status === "loading" ? "Restableciendo..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}

        {message && tokenValid !== false && (
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
          <a href="/login" style={{ color: "#a855f7", fontWeight: 600 }}>Volver al login</a>
        </p>
      </div>
    </div>
  );
}
