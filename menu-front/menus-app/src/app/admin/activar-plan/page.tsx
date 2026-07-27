"use client";
import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

type Solicitud = {
  id: number;
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string;
  usuario_nombre: string;
  usuario_email: string;
  plan_id: number;
  plan_nombre: string;
  plan_precio: number;
};

export default function AdminSolicitudes() {
  const [adminKey, setAdminKey] = useState("");
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [error, setError] = useState("");

  const cargarSolicitudes = useCallback(async (key: string) => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/admin/solicitudes`, {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (data.ok) {
        setSolicitudes(data.solicitudes);
        setDesbloqueado(true);
      } else {
        setError(data.mensaje || "Llave incorrecta");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }, []);

  const resolver = async (id: number, accion: "aprobar" | "rechazar") => {
    setProcesando(id);
    try {
      const res = await fetch(`${API}/api/admin/solicitudes/${id}/${accion}`, {
        method: "POST",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (data.ok) {
        setSolicitudes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, estado: accion === "aprobar" ? "aprobado" : "rechazado" } : s))
        );
      } else {
        alert(data.mensaje || "No se pudo procesar la solicitud");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setProcesando(null);
    }
  };

  useEffect(() => {
    if (desbloqueado) {
      const interval = setInterval(() => cargarSolicitudes(adminKey), 15000);
      return () => clearInterval(interval);
    }
  }, [desbloqueado, adminKey, cargarSolicitudes]);

  if (!desbloqueado) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f0f13", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
        padding: 20,
      }}>
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 16, padding: 32, width: "100%", maxWidth: 380 }}>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700, marginTop: 0 }}>🔐 Panel de solicitudes</h1>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && cargarSolicitudes(adminKey)}
            placeholder="ADMIN_SECRET_KEY"
            style={inputStyle}
          />
          <button
            onClick={() => cargarSolicitudes(adminKey)}
            disabled={cargando}
            style={{
              width: "100%", marginTop: 16, padding: "12px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none",
              borderRadius: 10, color: "white", fontWeight: 700, cursor: "pointer",
              opacity: cargando ? 0.6 : 1,
            }}
          >
            {cargando ? "Verificando..." : "Entrar"}
          </button>
          {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    );
  }

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const resueltas = solicitudes.filter((s) => s.estado !== "pendiente");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", fontFamily: "'Segoe UI', sans-serif", padding: 32 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: 0 }}>Solicitudes de plan</h1>
          <button
            onClick={() => cargarSolicitudes(adminKey)}
            style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, color: "#aaa", padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
          >
            ⟳ Actualizar
          </button>
        </div>

        <h2 style={{ color: "#a855f7", fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>
          Pendientes ({pendientes.length})
        </h2>
        {pendientes.length === 0 && <p style={{ color: "#666", fontSize: 14 }}>No hay solicitudes pendientes 🎉</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {pendientes.map((s) => (
            <div key={s.id} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12,
              padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{s.usuario_nombre} — {s.usuario_email}</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
                  Plan {s.plan_nombre} (${s.plan_precio}) · {new Date(s.fecha_solicitud).toLocaleString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => resolver(s.id, "aprobar")}
                  disabled={procesando === s.id}
                  style={{ background: "#16a34a", border: "none", borderRadius: 8, color: "white", padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: procesando === s.id ? 0.6 : 1 }}
                >
                  ✓ Aprobar
                </button>
                <button
                  onClick={() => resolver(s.id, "rechazar")}
                  disabled={procesando === s.id}
                  style={{ background: "#dc2626", border: "none", borderRadius: 8, color: "white", padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: procesando === s.id ? 0.6 : 1 }}
                >
                  ✕ Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: "#666", fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>
          Resueltas ({resueltas.length})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {resueltas.map((s) => (
            <div key={s.id} style={{
              background: "#16161d", border: "1px solid #2a2a35", borderRadius: 10,
              padding: "10px 16px", display: "flex", justifyContent: "space-between", fontSize: 13,
            }}>
              <span style={{ color: "#aaa" }}>{s.usuario_nombre} — {s.plan_nombre}</span>
              <span style={{ color: s.estado === "aprobado" ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                {s.estado === "aprobado" ? "✓ Aprobado" : "✕ Rechazado"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8, marginTop: 16,
  background: "#16161d", border: "1px solid #2a2a35",
  color: "white", fontSize: 14, boxSizing: "border-box",
};