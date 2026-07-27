"use client";

// HU-99 / CA-02 / RN-06: modal mostrado cuando el usuario alcanza el límite
// de descargas de su plan e invita a actualizarlo.
export default function ModalUpgrade({
  open,
  onClose,
  mensaje,
}: {
  open: boolean;
  onClose: () => void;
  mensaje?: string;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 200,
      }}
    >
      <div style={{
        background: "#1e1e28", border: "1px solid #7c3aed44", borderRadius: 12,
        padding: 28, width: 420, maxWidth: "90vw", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
        <div style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
          Llegaste al límite de descargas
        </div>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
          {mensaje || "Tu plan actual alcanzó su límite de descargas. Actualiza a un plan Básico, Plus o Premium para seguir descargando tus menús."}
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: "transparent", border: "1px solid #2a2a35", borderRadius: 8,
              padding: "10px 16px", color: "#aaa", fontSize: 13, cursor: "pointer",
            }}
          >
            Cerrar
          </button>
          <a href="/planes" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none",
                borderRadius: 8, padding: "10px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}
            >
              Actualizar plan
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}