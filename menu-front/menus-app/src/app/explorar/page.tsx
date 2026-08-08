"use client";
import { useState } from "react";
import { IconSearch, IconHeart, IconMessageCircle } from "@/components/Icons";

// TODO: reemplazar por fetch("/api/public/explorar") cuando el backend esté listo
const cartasMock = [
  { id: 1, negocio: "Café Aurora", tipo: "Cafetería", distancia: "0.8 km", likes: 24, comentarios: 5, nuevo: true, color: "#3e2723" },
  { id: 2, negocio: "La Parrilla Grill", tipo: "Parrilla • Carnes", distancia: "1.2 km", likes: 58, comentarios: 12, color: "#4a1518" },
  { id: 3, negocio: "Sushi House", tipo: "Sushi • Japonés", distancia: "2.1 km", likes: 31, comentarios: 7, color: "#0d0d0d" },
  { id: 4, negocio: "Pizza Napoli", tipo: "Italiana • Pizzas", distancia: "1.5 km", likes: 45, comentarios: 9, color: "#5d1a1a" },
  { id: 5, negocio: "Taquería El Sabor", tipo: "Mexicana • Tacos", distancia: "0.5 km", likes: 67, comentarios: 15, color: "#bf360c" },
  { id: 6, negocio: "Verde Fresco", tipo: "Saludable • Vegetariana", distancia: "1.8 km", likes: 19, comentarios: 3, color: "#1b5e20" },
];

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"recientes" | "populares">("recientes");

  const cartasFiltradas = cartasMock.filter((c) =>
    c.negocio.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: 0 }}>
          Explora cartas de otros negocios
        </h1>
        <p style={{ color: "#888", fontSize: 14, marginTop: 6 }}>
          Descubre menús creados por restaurantes y cafeterías cerca de ti.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 10, padding: "10px 14px" }}>
          <IconSearch />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre del negocio o tipo de comida..."
            style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, flex: 1 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {(["recientes", "populares"] as const).map((op) => (
            <button
              key={op}
              onClick={() => setOrden(op)}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                background: orden === op ? "#a855f7" : "#16161d",
                color: orden === op ? "white" : "#888",
              }}
            >
              {op === "recientes" ? "Más recientes" : "Más populares"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginTop: 24 }}>
          {cartasFiltradas.map((c) => (
            <a key={c.id} href={`/explorar/${c.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", background: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.nuevo && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#a855f7", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                      Nuevo
                    </span>
                  )}
                  <span style={{ fontSize: 32 }}>🍽️</span>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{c.negocio}</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{c.tipo} · {c.distancia}</div>
                  <div style={{ display: "flex", gap: 14, marginTop: 10, color: "#888", fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconHeart size={14} /> {c.likes}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconMessageCircle /> {c.comentarios}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {cartasFiltradas.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No se encontraron negocios con ese nombre.</p>
        )}
      </div>
    </div>
  );
}