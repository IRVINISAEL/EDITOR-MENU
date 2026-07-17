"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Platillo = {
  nombre: string;
  precio: string;
  descripcion: string;
  imagen?: string;
  colorTexto?: string;
  imagenPos?: { x: number; y: number };
};

type Seccion = { id: number; nombre: string; platillos: Platillo[] };

type Fondo = { nombre: string; bg: string; texto: string; acento: string };

type MenuData = {
  secciones: Seccion[];
  nombreMenu?: string;
  fuenteActiva?: string;
  fondoActivo?: Fondo;
  tamaño?: number;
  subtitulo?: string;
};

const fondoDefault: Fondo = {
  nombre: "Clásico",
  bg: "linear-gradient(135deg, #fefefe, #f8f4ee)",
  texto: "#2c1810",
  acento: "#8b4513",
};

export default function MenuPublicoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<MenuData | null>(null);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<"loading" | "ok" | "no-disponible">("loading");

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const cargarMenu = async () => {
      try {
        const res = await fetch(`${API}/api/public/menus/${id}`);
        const json = await res.json();

        if (json.ok && json.menu) {
          setNombre(json.menu.nombre);
          try {
            setData(JSON.parse(json.menu.data_json || "{}"));
          } catch {
            setData({ secciones: [] });
          }
          setEstado("ok");
        } else {
          setEstado("no-disponible");
        }
      } catch {
        setEstado("no-disponible");
      }
    };

    if (id) cargarMenu();
  }, [id]);

  if (estado === "loading") {
    return (
      <div style={estilosCentrado(fondoDefault)}>
        <p style={{ color: fondoDefault.texto, fontSize: 16 }}>Cargando menú...</p>
      </div>
    );
  }

  if (estado === "no-disponible") {
    return (
      <div style={estilosCentrado(fondoDefault)}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <h1 style={{ color: fondoDefault.texto, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Menú no disponible
          </h1>
          <p style={{ color: fondoDefault.texto, opacity: 0.7, fontSize: 14 }}>
            Este menú no existe, fue eliminado o aún no ha sido publicado.
          </p>
        </div>
      </div>
    );
  }

  const fondo = data?.fondoActivo || fondoDefault;
  const secciones = data?.secciones || [];
  const fuente = data?.fuenteActiva || "Playfair Display";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: fondo.bg,
        fontFamily: fuente,
        padding: "32px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {data?.subtitulo && (
            <p style={{ color: fondo.acento, fontSize: 13, letterSpacing: 2, fontWeight: 600, marginBottom: 8 }}>
              {data.subtitulo}
            </p>
          )}
          <h1
            style={{
              color: fondo.texto,
              fontSize: `clamp(28px, 6vw, ${data?.tamaño || 48}px)`,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {data?.nombreMenu || nombre}
          </h1>
        </div>

        {secciones.length === 0 && (
          <p style={{ textAlign: "center", color: fondo.texto, opacity: 0.6 }}>
            Este menú aún no tiene platillos.
          </p>
        )}

        {secciones.map((seccion) => (
          <div key={seccion.id} style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: fondo.acento,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 1.5,
                marginBottom: 16,
                borderBottom: `1px solid ${fondo.acento}33`,
                paddingBottom: 8,
              }}
            >
              {seccion.nombre}
            </h2>

            {seccion.platillos.map((platillo, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: 18,
                }}
              >
                {platillo.imagen && (
                  <img
                    src={platillo.imagen}
                    alt={platillo.nombre}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span
                      style={{
                        color: platillo.colorTexto || fondo.texto,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {platillo.nombre}
                    </span>
                    <span style={{ color: fondo.acento, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                      {platillo.precio}
                    </span>
                  </div>
                  {platillo.descripcion && (
                    <p style={{ color: fondo.texto, opacity: 0.65, fontSize: 13, margin: "4px 0 0" }}>
                      {platillo.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function estilosCentrado(fondo: Fondo): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: fondo.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };
}