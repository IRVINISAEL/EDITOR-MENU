"use client";
import { useEffect } from "react";

// La sección "Explorar cartas" ahora vive dentro del Dashboard (Inicio).
// Esta ruta se conserva para no romper links guardados o compartidos.
export default function ExplorarRedirect() {
  useEffect(() => {
    window.location.replace("/#explorar");
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888", fontSize: 13 }}>Redirigiendo a Explorar...</p>
    </div>
  );
}