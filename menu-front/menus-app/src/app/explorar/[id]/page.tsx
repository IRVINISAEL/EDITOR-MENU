"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { IconHeart, IconMessageCircle, IconMapPin } from "@/components/Icons";

// TODO: reemplazar por fetch(`/api/public/explorar/${id}`) cuando el backend esté listo
const comentariosMock = [
  { id: 1, nombre: "María López", texto: "Se ve delicioso todo 😋", hace: "Hace 2 horas", likes: 3 },
  { id: 2, nombre: "Andrés García", texto: "¿Tienen opción vegetariana?", hace: "Hace 3 horas", likes: 2 },
];

export default function DetalleCartaPage() {
  const { id } = useParams();
  const [haDadoLike, setHaDadoLike] = useState(false);
  const [likes, setLikes] = useState(58);
  const [hayToken] = useState(false); // TODO: leer token real de auth

  const toggleLike = () => {
    if (!hayToken) return; // requiere login, igual que comentar
    setHaDadoLike((v) => !v);
    setLikes((v) => (haDadoLike ? v - 1 : v + 1));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 320 }}>
          <a href="/explorar" style={{ color: "#888", fontSize: 13, textDecoration: "none" }}>← Volver a explorar</a>

          <div style={{ marginTop: 16, background: "#3e1a1a", borderRadius: 12, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
            🍽️
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 16 }}>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 18 }}>Negocio #{id}</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>Parrilla · Carnes</div>
            </div>
            <button style={{ background: "#a855f7", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <IconMapPin /> Ver ubicación
            </button>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <button
              onClick={toggleLike}
              style={{ background: "none", border: "none", cursor: "pointer", color: haDadoLike ? "#ef4444" : "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >
              <IconHeart size={18} filled={haDadoLike} /> {likes}
            </button>
            <span style={{ color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <IconMessageCircle /> {comentariosMock.length}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 280, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: 20, alignSelf: "flex-start" }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Comentarios ({comentariosMock.length})
          </div>

          {comentariosMock.map((c) => (
            <div key={c.id} style={{ marginBottom: 16 }}>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{c.nombre}</div>
              <div style={{ color: "#666", fontSize: 11 }}>{c.hace}</div>
              <div style={{ color: "#ccc", fontSize: 13, marginTop: 4 }}>{c.texto}</div>
            </div>
          ))}

          {!hayToken && (
            <div style={{ background: "#0d0d12", borderRadius: 10, padding: 16, textAlign: "center", marginTop: 12 }}>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Inicia sesión para comentar</div>
              <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Únete a la comunidad y comparte tu opinión</div>
              <a href="/login">
                <button style={{ marginTop: 12, background: "#a855f7", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}>
                  Iniciar sesión
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}