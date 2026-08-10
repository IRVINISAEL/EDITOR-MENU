"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconMapPin, IconClock, IconPhone, IconLink, IconArrowLeft, IconArrowRight, IconHeart, IconMessageCircle } from "@/components/Icons";

type Platillo = { nombre: string; precio: string; descripcion?: string };
type Seccion = { id: number; nombre: string; platillos: Platillo[]; imagenes?: string[] };
type MenuData = { secciones: Seccion[]; nombreMenu?: string };
type Negocio = {
  nombre: string;
  descripcion?: string;
  telefono?: string;
  horario?: string;
  logo?: string;
  direccion?: { calle?: string; colonia?: string; noExterior?: string };
};
type Comentario = { id: number; nombre: string; texto: string; fecha: string };

function tiempoDesde(fechaIso: string) {
  const diffMs = Date.now() - new Date(fechaIso).getTime();
  const horas = Math.floor(diffMs / 3600000);
  if (horas < 1) return "Hace unos minutos";
  if (horas < 24) return `Hace ${horas} hora${horas === 1 ? "" : "s"}`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} día${dias === 1 ? "" : "s"}`;
}

export default function DetalleCartaPage() {
  const { id } = useParams();
  const [data, setData] = useState<MenuData | null>(null);
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<"loading" | "ok" | "no-disponible">("loading");
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [hayToken, setHayToken] = useState(false);

  const [likes, setLikes] = useState(0);
  const [yaDioLike, setYaDioLike] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setHayToken(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/public/menus/${id}`)
      .then((r) => r.json())
      .then((json) => {
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
      })
      .catch(() => setEstado("no-disponible"));

    const token = localStorage.getItem("token");
    fetch(`${API}/api/public/menus/${id}/likes`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setLikes(json.total);
          setYaDioLike(json.yaDioLike);
        }
      })
      .catch(() => {});

    fetch(`${API}/api/public/menus/${id}/comentarios`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setComentarios(json.comentarios);
      })
      .catch(() => {});
  }, [id, API]);

  const toggleLike = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setYaDioLike((v) => !v);
    setLikes((v) => (yaDioLike ? v - 1 : v + 1));
    fetch(`${API}/api/public/menus/${id}/likes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setYaDioLike(json.yaDioLike);
      })
      .catch(() => {
        setYaDioLike((v) => !v);
        setLikes((v) => (yaDioLike ? v + 1 : v - 1));
      });
  };

  const enviarComentario = () => {
    const token = localStorage.getItem("token");
    const texto = nuevoComentario.trim();
    if (!token || !texto || enviando) return;
    setEnviando(true);
    fetch(`${API}/api/public/menus/${id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ texto }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setComentarios((prev) => [json.comentario, ...prev]);
          setNuevoComentario("");
        }
      })
      .finally(() => setEnviando(false));
  };

  const centrado: React.CSSProperties = {
    minHeight: "100vh", background: "#0d0d12",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  if (estado === "loading") {
    return <div style={centrado}><p style={{ color: "white" }}>Cargando...</p></div>;
  }

  if (estado === "no-disponible") {
    return (
      <div style={centrado}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
          <p style={{ color: "white" }}>Esta carta no está disponible.</p>
          <a href="/#explorar" style={{ color: "#a855f7", fontSize: 13 }}>← Volver a explorar</a>
        </div>
      </div>
    );
  }

  const secciones = data?.secciones || [];
  const seccion = secciones[categoriaActiva];
  const tieneFotos = !!seccion?.imagenes && seccion.imagenes.length > 0;
  const direccionTexto = [negocio?.direccion?.calle, negocio?.direccion?.noExterior, negocio?.direccion?.colonia]
    .filter(Boolean)
    .join(" ");
  const linkPublico = typeof window !== "undefined" ? `${window.location.origin}/menu/${id}` : "";
  const tituloCompartir = `${negocio?.nombre || nombre} - Ver menú`;

  const copiarLink = () => {
    navigator.clipboard.writeText(linkPublico);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };

  const cambiarCategoria = (idx: number) => {
    setCategoriaActiva(idx);
    setFotoActiva(0);
  };

  const botonesCompartir = [
    { emoji: "💬", label: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`${tituloCompartir}: ${linkPublico}`)}` },
    { emoji: "📘", label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkPublico)}` },
    { emoji: "🐦", label: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tituloCompartir)}&url=${encodeURIComponent(linkPublico)}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <a href="/#explorar" style={{ color: "#888", fontSize: 13, textDecoration: "none" }}>← Volver a explorar</a>

        {/* Header del negocio */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {negocio?.logo ? (
              <img src={negocio.logo} alt={negocio.nombre} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#2a1f45", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
            )}
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{negocio?.nombre || nombre}</div>
              {negocio?.descripcion && <div style={{ color: "#888", fontSize: 12 }}>{negocio.descripcion}</div>}
            </div>
          </div>
          {direccionTexto && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionTexto)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "#a855f7", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
            >
              <IconMapPin size={14} /> Cómo llegar
            </a>
          )}
        </div>

        {secciones.length === 0 ? (
          <p style={{ color: "#888", marginTop: 40, textAlign: "center" }}>
            Este negocio aún no tiene platillos publicados.
          </p>
        ) : (
          <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {/* Sidebar de categorías */}
            <div style={{ minWidth: 180, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: 12, alignSelf: "flex-start" }}>
              <div style={{ color: "#888", fontSize: 12, fontWeight: 700, padding: "4px 8px 10px" }}>Categorías</div>
              {secciones.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => cambiarCategoria(idx)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 4,
                    borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    background: idx === categoriaActiva ? "#2a1f45" : "transparent",
                    color: idx === categoriaActiva ? "#c4a3f7" : "#aaa",
                  }}
                >
                  {s.nombre}
                </button>
              ))}
            </div>

            {/* Contenido: carrusel de fotos o lista de platillos + barra de acciones */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: 20 }}>
                {tieneFotos ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={seccion.imagenes![fotoActiva]}
                      alt={seccion.nombre}
                      style={{ width: "100%", maxHeight: 480, objectFit: "contain", borderRadius: 10, background: "#0d0d12" }}
                    />
                    {seccion.imagenes!.length > 1 && (
                      <>
                        <button
                          onClick={() => setFotoActiva((v) => (v === 0 ? seccion.imagenes!.length - 1 : v - 1))}
                          style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <IconArrowLeft size={16} />
                        </button>
                        <button
                          onClick={() => setFotoActiva((v) => (v === seccion.imagenes!.length - 1 ? 0 : v + 1))}
                          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <IconArrowRight size={16} />
                        </button>
                        <div style={{ textAlign: "center", marginTop: 10, color: "#888", fontSize: 12 }}>
                          {fotoActiva + 1} / {seccion.imagenes!.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 style={{ color: "#a855f7", fontSize: 16, fontWeight: 700, borderBottom: "1px solid #2a2a35", paddingBottom: 8, marginTop: 0 }}>
                      {seccion?.nombre}
                    </h2>
                    {seccion?.platillos.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid #1c1c22" }}>
                        <div>
                          <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{p.nombre}</div>
                          {p.descripcion && <div style={{ color: "#888", fontSize: 12 }}>{p.descripcion}</div>}
                        </div>
                        <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{p.precio}</div>
                      </div>
                    ))}
                    {(!seccion?.platillos || seccion.platillos.length === 0) && (
                      <p style={{ color: "#888", fontSize: 13 }}>Esta categoría aún no tiene platillos.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Barra de likes / comentarios / compartir */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 14, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: "12px 18px" }}>
                <div style={{ display: "flex", gap: 20 }}>
                  <button
                    onClick={toggleLike}
                    disabled={!hayToken}
                    title={hayToken ? "" : "Inicia sesión para dar like"}
                    style={{ background: "none", border: "none", cursor: hayToken ? "pointer" : "not-allowed", color: yaDioLike ? "#ef4444" : "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}
                  >
                    <IconHeart size={18} filled={yaDioLike} /> {likes}
                  </button>
                  <span style={{ color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <IconMessageCircle /> {comentarios.length}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {botonesCompartir.map((b) => (
                    <a key={b.label} href={b.url} target="_blank" rel="noopener noreferrer" title={b.label} style={{ fontSize: 18, textDecoration: "none" }}>
                      {b.emoji}
                    </a>
                  ))}
                  <button
                    onClick={copiarLink}
                    title="Copiar enlace"
                    style={{ background: "none", border: "none", cursor: "pointer", color: copiado ? "#4ade80" : "#888", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
                  >
                    <IconLink size={14} /> {copiado ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Comentarios */}
              <div style={{ marginTop: 14, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: 18 }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
                  Comentarios ({comentarios.length})
                </div>

                {hayToken ? (
                  <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                    <input
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") enviarComentario(); }}
                      placeholder="Escribe un comentario..."
                      maxLength={500}
                      style={{ flex: 1, background: "#0d0d12", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 12px", color: "white", fontSize: 13, outline: "none" }}
                    />
                    <button
                      onClick={enviarComentario}
                      disabled={enviando || !nuevoComentario.trim()}
                      style={{ background: "#a855f7", color: "white", border: "none", borderRadius: 8, padding: "0 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: enviando || !nuevoComentario.trim() ? 0.6 : 1 }}
                    >
                      Enviar
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#0d0d12", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 18 }}>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Inicia sesión para comentar</div>
                    <a href="/login">
                      <button style={{ marginTop: 10, background: "#a855f7", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Iniciar sesión
                      </button>
                    </a>
                  </div>
                )}

                {comentarios.map((c) => (
                  <div key={c.id} style={{ marginBottom: 16 }}>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{c.nombre}</div>
                    <div style={{ color: "#666", fontSize: 11 }}>{tiempoDesde(c.fecha)}</div>
                    <div style={{ color: "#ccc", fontSize: 13, marginTop: 4 }}>{c.texto}</div>
                  </div>
                ))}

                {comentarios.length === 0 && (
                  <p style={{ color: "#666", fontSize: 12, textAlign: "center" }}>Sé el primero en comentar.</p>
                )}
              </div>
            </div>

            {/* Panel "Acerca del lugar" */}
            <div style={{ minWidth: 240, maxWidth: 260, background: "#16161d", border: "1px solid #2a2a35", borderRadius: 12, padding: 18, alignSelf: "flex-start" }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Acerca del lugar</div>
              {negocio?.descripcion && (
                <p style={{ color: "#ccc", fontSize: 12, marginBottom: 12 }}>{negocio.descripcion}</p>
              )}
              {negocio?.horario && (
                <div style={{ display: "flex", gap: 8, color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                  <IconClock size={14} /> {negocio.horario}
                </div>
              )}
              {negocio?.telefono && (
                <div style={{ display: "flex", gap: 8, color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                  <IconPhone size={14} /> {negocio.telefono}
                </div>
              )}
              {direccionTexto && (
                <div style={{ display: "flex", gap: 8, color: "#aaa", fontSize: 12, marginBottom: 14 }}>
                  <IconMapPin size={14} /> {direccionTexto}
                </div>
              )}
              <button
                onClick={copiarLink}
                style={{ width: "100%", background: copiado ? "#16a34a" : "#2a1f45", color: copiado ? "white" : "#c4a3f7", border: "1px solid #a855f7", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <IconLink size={14} /> {copiado ? "¡Enlace copiado!" : "Copiar enlace del menú"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}