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

type Negocio = {
  nombre: string;
  descripcion?: string;
  telefono?: string;
  sitioWeb?: string;
  logo?: string;
  horario?: string;
  direccion?: { calle?: string; colonia?: string; noExterior?: string };
  redes?: { facebook?: string; instagram?: string; whatsapp?: string; tiktok?: string };
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
  const [negocio, setNegocio] = useState<Negocio | null>(null);
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
          setNegocio(json.negocio || null);
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

        {negocio && negocio.nombre && (
          <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${fondo.acento}33` }}>
            {negocio.logo && (
              <img src={negocio.logo} alt={negocio.nombre} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", marginBottom: 10 }} />
            )}
            <h2 style={{ color: fondo.texto, fontSize: 18, fontWeight: 700, margin: 0 }}>{negocio.nombre}</h2>
            {negocio.descripcion && (
              <p style={{ color: fondo.texto, opacity: 0.7, fontSize: 12, margin: "4px 0 0" }}>{negocio.descripcion}</p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 10, fontSize: 12, color: fondo.texto, opacity: 0.75 }}>
              {(negocio.direccion?.calle || negocio.direccion?.colonia) && (
                <span>📍 {[negocio.direccion?.calle, negocio.direccion?.noExterior, negocio.direccion?.colonia].filter(Boolean).join(" ")}</span>
              )}
              {negocio.telefono && <span>📞 {negocio.telefono}</span>}
              {negocio.horario && <span>🕒 {negocio.horario}</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, fontSize: 18 }}>
              {negocio.redes?.instagram && <a href={negocio.redes.instagram} target="_blank" rel="noopener noreferrer">📸</a>}
              {negocio.redes?.facebook && <a href={negocio.redes.facebook} target="_blank" rel="noopener noreferrer">📘</a>}
              {negocio.redes?.tiktok && <a href={negocio.redes.tiktok} target="_blank" rel="noopener noreferrer">🎵</a>}
              {negocio.redes?.whatsapp && <a href={`https://wa.me/${negocio.redes.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">💬</a>}
              {negocio.sitioWeb && <a href={negocio.sitioWeb} target="_blank" rel="noopener noreferrer" style={{ color: fondo.acento, textDecoration: "none", fontSize: 12, alignSelf: "center" }}>🌐 Sitio web</a>}
            </div>
          </div>
        )}

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