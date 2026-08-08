"use client";
import { useState } from "react";
import { IconSearch, IconHeart, IconMessageCircle, IconMapPin } from "@/components/Icons";

// Ícono + gradiente propios por tipo de comida, en vez del mismo plato genérico para todos.
const ESTILO_POR_TIPO: Record<string, { emoji: string; gradient: string }> = {
  "Cafetería": { emoji: "☕", gradient: "linear-gradient(160deg, #3e2723 0%, #6d4c41 100%)" },
  "Parrilla": { emoji: "🥩", gradient: "linear-gradient(160deg, #2b0f0f 0%, #6b1d1d 100%)" },
  "Sushi": { emoji: "🍣", gradient: "linear-gradient(160deg, #0d0d0d 0%, #2c1320 100%)" },
  "Italiana": { emoji: "🍕", gradient: "linear-gradient(160deg, #2b1010 0%, #7a2020 100%)" },
  "Mexicana": { emoji: "🌮", gradient: "linear-gradient(160deg, #3d1a05 0%, #a8460d 100%)" },
  "Saludable": { emoji: "🥗", gradient: "linear-gradient(160deg, #0d2b12 0%, #245c2e 100%)" },
};

// TODO: reemplazar por fetch("/api/public/explorar") cuando el backend esté listo
const cartasMock = [
  { id: 1, negocio: "Café Aurora", categoria: "Cafetería", tipo: "Cafetería", distancia: "0.8 km", likes: 24, comentarios: 5, nuevo: true },
  { id: 2, negocio: "La Parrilla Grill", categoria: "Parrilla", tipo: "Parrilla • Carnes", distancia: "1.2 km", likes: 58, comentarios: 12 },
  { id: 3, negocio: "Sushi House", categoria: "Sushi", tipo: "Sushi • Japonés", distancia: "2.1 km", likes: 31, comentarios: 7 },
  { id: 4, negocio: "Pizza Napoli", categoria: "Italiana", tipo: "Italiana • Pizzas", distancia: "1.5 km", likes: 45, comentarios: 9 },
  { id: 5, negocio: "Taquería El Sabor", categoria: "Mexicana", tipo: "Mexicana • Tacos", distancia: "0.5 km", likes: 67, comentarios: 15 },
  { id: 6, negocio: "Verde Fresco", categoria: "Saludable", tipo: "Saludable • Vegetariana", distancia: "1.8 km", likes: 19, comentarios: 3 },
];

const CATEGORIAS = ["Todas", "Cafetería", "Parrilla", "Sushi", "Italiana", "Mexicana", "Saludable"];

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"recientes" | "populares" | "cerca">("recientes");
  const [categoria, setCategoria] = useState("Todas");

  let cartasFiltradas = cartasMock.filter((c) => {
    const coincideBusqueda = c.negocio.toLowerCase().includes(busqueda.toLowerCase()) || c.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "Todas" || c.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  if (orden === "populares") cartasFiltradas = [...cartasFiltradas].sort((a, b) => b.likes - a.likes);
  if (orden === "cerca") cartasFiltradas = [...cartasFiltradas].sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>
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

        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          {([
            ["recientes", "Más recientes"],
            ["populares", "Más populares"],
            ["cerca", "📍 Cerca de mí"],
          ] as const).map(([valor, texto]) => (
            <button
              key={valor}
              onClick={() => setOrden(valor)}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                background: orden === valor ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#16161d",
                color: orden === valor ? "white" : "#888",
                transition: "all 0.15s",
              }}
            >
              {texto}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              style={{
                padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                background: categoria === cat ? "#2a1f45" : "transparent",
                border: categoria === cat ? "1px solid #a855f7" : "1px solid #2a2a35",
                color: categoria === cat ? "#c4a3f7" : "#888",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginTop: 28 }}>
          {cartasFiltradas.map((c) => {
            const estilo = ESTILO_POR_TIPO[c.categoria] || { emoji: "🍽️", gradient: "linear-gradient(160deg,#1a1a1a,#2d2d2d)" };
            return (
              <a key={c.id} href={`/explorar/${c.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "#16161d", border: "1px solid #2a2a35", borderRadius: 14,
                    overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#7c3aed"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#2a2a35"; }}
                >
                  <div style={{ position: "relative", aspectRatio: "4/3", background: estilo.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.nuevo && (
                      <span style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(90deg,#7c3aed,#a855f7)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6 }}>
                        Nuevo
                      </span>
                    )}
                    <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.5)", color: "#ddd", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <IconMapPin size={11} /> {c.distancia}
                    </span>
                    <span style={{ fontSize: 40, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))" }}>{estilo.emoji}</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{c.negocio}</div>
                    <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{c.tipo}</div>
                    <div style={{ display: "flex", gap: 14, marginTop: 12, color: "#888", fontSize: 12, borderTop: "1px solid #222229", paddingTop: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconHeart size={14} /> {c.likes}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconMessageCircle /> {c.comentarios}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {cartasFiltradas.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <p style={{ color: "#888", margin: 0 }}>No se encontraron negocios con ese nombre o categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}