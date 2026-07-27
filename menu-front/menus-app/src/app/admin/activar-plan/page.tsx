"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

type Plan = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

export default function AdminActivarPlan() {
  const [adminKey, setAdminKey] = useState("");
  const [email, setEmail] = useState("");
  const [planId, setPlanId] = useState<number | "">("");
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/planes`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPlanes(data.planes);
      });
  }, []);

  const handleActivar = async () => {
    setMensaje(null);
    if (!adminKey || !email || !planId) {
      setMensaje({ tipo: "error", texto: "Completa la llave de admin, el correo y el plan." });
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/admin/activar-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ email, planId }),
      });
      const data = await res.json();
      if (data.ok) {
        setMensaje({ tipo: "ok", texto: data.mensaje });
        setEmail("");
        setPlanId("");
      } else {
        setMensaje({ tipo: "error", texto: data.mensaje || "No se pudo activar el plan." });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f13", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
      padding: 20,
    }}>
      <div style={{
        background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16,
        padding: 32, width: "100%", maxWidth: 420,
      }}>
        <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, marginTop: 0 }}>
          🔐 Activar plan manualmente
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginTop: -8, marginBottom: 24 }}>
          Solo para uso interno. Confirma el pago fuera del sistema antes de activar.
        </p>

        <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>Llave de admin</label>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="ADMIN_SECRET_KEY"
          style={inputStyle}
        />

        <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6, marginTop: 16 }}>
          Correo del usuario
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
          style={inputStyle}
        />

        <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6, marginTop: 16 }}>
          Plan a activar
        </label>
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value ? Number(e.target.value) : "")}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Selecciona un plan</option>
          {planes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — ${p.precio}
            </option>
          ))}
        </select>

        <button
          onClick={handleActivar}
          disabled={cargando}
          style={{
            width: "100%", marginTop: 24, padding: "12px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: "none", borderRadius: 10, color: "white",
            fontWeight: 700, fontSize: 14, cursor: cargando ? "default" : "pointer",
            opacity: cargando ? 0.6 : 1,
          }}
        >
          {cargando ? "Activando..." : "Activar plan"}
        </button>

        {mensaje && (
          <div style={{
            marginTop: 16, padding: "10px 12px", borderRadius: 8, fontSize: 13,
            background: mensaje.tipo === "ok" ? "#16351f" : "#3a1a1a",
            color: mensaje.tipo === "ok" ? "#4ade80" : "#f87171",
          }}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  background: "#16161d", border: "1px solid #2a2a35",
  color: "white", fontSize: 14, boxSizing: "border-box",
};