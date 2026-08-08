"use client";
import { useState, useEffect } from "react";
import { IconSearch, IconMapPin } from "@/components/Icons";

const ESTILO_POR_TIPO: Record<string, { emoji: string; gradient: string }> = {
  "Cafetería": { emoji: "☕", gradient: "linear-gradient(160deg, #3e2723 0%, #6d4c41 100%)" },
  "Parrilla": { emoji: "🥩", gradient: "linear-gradient(160deg, #2b0f0f 0%, #6b1d1d 100%)" },
  "Sushi": { emoji: "🍣", gradient: "linear-gradient(160deg, #0d0d0d 0%, #2c1320 100%)" },
  "Italiana": { emoji: "🍕", gradient: "linear-gradient(160deg, #2b1010 0%, #7a2020 100%)" },
  "Mexicana": { emoji: "🌮", gradient: "linear-gradient(160deg, #3d1a05 0%, #a8460d 100%)" },
  "Saludable": { emoji: "🥗", gradient: "linear-gradient(160deg, #0d2b12 0%, #245c2e 100%)" },
};

type Carta = { id: number; negocio: string; categoria: string; tipo: string };

const CATEGORIAS = ["Todas", "Cafetería", "Parrilla", "Sushi", "Italiana", "Mexicana", "Saludable"];

export default function ExplorarPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API}/api/public/explorar`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setCartas(
            json.cartas.map((c: any) => ({
              id: c.id,
              negocio: c.negocio || c.nombre_menu || "Negocio",
              categoria: c.tipo || "Otro",
              tipo: c.tipo || "Restaurante",
            }))
          );
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  const cartasFiltradas = cartas.filter((c) => {
    const coincideBusqueda =
      c.negocio.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "Todas" || c.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>
          Explora cartas de otros negocios
        </h1>
        <p style={{ color: "#888", fontSize: 14, marginTop: 6 }}>
          Descubre menús creados por restaurantes y cafeterías.
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

        {cargando && (
          <p style={{ color: "#888", textAlign: "center", marginTop: 60 }}>Cargando cartas...</p>
        )}

        {!cargando && error && (
          <p style={{ color: "#888", textAlign: "center", marginTop: 60 }}>
            No se pudieron cargar las cartas. Intenta más tarde.
          </p>
        )}

        {!cargando && !error && (
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
                      <span style={{ fontSize: 40, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))" }}>{estilo.emoji}</span>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{c.negocio}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{c.tipo}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {!cargando && !error && cartasFiltradas.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <p style={{ color: "#888", margin: 0 }}>No se encontraron negocios con ese nombre o categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}