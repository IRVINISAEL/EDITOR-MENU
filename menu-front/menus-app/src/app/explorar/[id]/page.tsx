"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconMapPin, IconClock, IconPhone, IconLink, IconArrowLeft, IconArrowRight, IconHeart, IconMessageCircle } from "@/components/Icons";

type Platillo = { nombre: string; precio: string; descripcion?: string };
type Seccion = { id: number; nombre: string; platillos: Platillo[]; imagenes?: string[] };
type MenuData = { secciones: Seccion[]; nombreMenu?: string; imagen_url?: string };
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
    <div className="menu-page">
      <style>{`
        .menu-page {
          min-height: 100vh;
          padding: 32px 24px 64px;
          background:
            radial-gradient(1200px 500px at 15% -10%, rgba(168,85,247,0.18), transparent 60%),
            radial-gradient(900px 500px at 100% 0%, rgba(196,163,247,0.10), transparent 55%),
            #0b0b10;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
        .menu-wrap { max-width: 1100px; margin: 0 auto; }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #9a9aa5; font-size: 13px; text-decoration: none;
          transition: color .2s ease, transform .2s ease;
        }
        .back-link:hover { color: #c4a3f7; transform: translateX(-3px); }

        .card {
          background: linear-gradient(180deg, #17171f 0%, #131319 100%);
          border: 1px solid #262631;
          border-radius: 16px;
        }
        .card-hover { transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
        .card-hover:hover { border-color: #3d2f5c; box-shadow: 0 8px 24px rgba(168,85,247,0.12); }

        .header-card {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 14px; margin-top: 18px; padding: 20px 24px;
        }
        .logo-ring {
          width: 56px; height: 56px; border-radius: 14px; object-fit: cover;
          padding: 2px; background: linear-gradient(135deg,#a855f7,#6d28d9);
        }
        .logo-fallback {
          width: 56px; height: 56px; border-radius: 14px;
          background: linear-gradient(135deg,#2a1f45,#1a1424);
          display: flex; align-items: center; justify-content: center; font-size: 24px;
          border: 1px solid #3d2f5c;
        }
        .biz-name {
          color: #fff; font-weight: 800; font-size: 19px; letter-spacing: .2px;
          background: linear-gradient(90deg,#fff,#d8c3fb);
          -webkit-background-clip: text; background-clip: text;
        }
        .cta-btn {
          background: linear-gradient(135deg,#a855f7,#7e22ce);
          color: #fff; border: none; border-radius: 10px; padding: 10px 16px;
          font-size: 13px; font-weight: 700; text-decoration: none;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(168,85,247,0.35);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(168,85,247,0.45); }

        .carta-img-wrap { margin-top: 22px; padding: 20px; text-align: center; }
        .carta-img {
          display: block; margin: 0 auto; max-width: 100%; max-height: 720px;
          border-radius: 12px; object-fit: contain;
          box-shadow: 0 10px 40px rgba(0,0,0,0.45);
          transition: transform .3s ease;
        }
        .carta-img:hover { transform: scale(1.01); }

        .layout { display: flex; gap: 22px; margin-top: 22px; flex-wrap: wrap; }

        .sidebar { min-width: 190px; padding: 14px; align-self: flex-start; position: sticky; top: 20px; }
        .sidebar-title { color: #7d7d8a; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px 12px; }
        .cat-btn {
          display: block; width: 100%; text-align: left; padding: 11px 14px; margin-bottom: 6px;
          border-radius: 10px; border: 1px solid transparent; cursor: pointer; font-size: 13.5px; font-weight: 600;
          background: transparent; color: #9c9ca8; transition: all .18s ease;
        }
        .cat-btn:hover { background: #1c1c26; color: #d8c3fb; }
        .cat-btn.active {
          background: linear-gradient(135deg, rgba(168,85,247,0.22), rgba(126,34,206,0.12));
          border-color: #4d3572; color: #d8c3fb;
        }

        .content-panel { flex: 1; min-width: 300px; }
        .dish-card { padding: 22px; }
        .dish-title {
          color: #d8c3fb; font-size: 16px; font-weight: 800; letter-spacing: .3px;
          border-bottom: 1px solid #262631; padding-bottom: 12px; margin: 0 0 6px;
        }
        .dish-row {
          display: flex; justify-content: space-between; gap: 14px; padding: 13px 4px;
          border-bottom: 1px solid #1c1c24; border-radius: 8px; transition: background .15s ease;
        }
        .dish-row:hover { background: #1a1a22; }
        .dish-name { color: #f2f2f5; font-weight: 600; font-size: 14.5px; }
        .dish-desc { color: #8b8b96; font-size: 12.5px; margin-top: 3px; }
        .dish-price {
          color: #c4a3f7; font-weight: 800; font-size: 14px; white-space: nowrap;
          background: rgba(168,85,247,0.10); padding: 4px 10px; border-radius: 20px; height: fit-content;
        }

        .action-bar {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
          gap: 12px; margin-top: 16px; padding: 14px 20px;
        }
        .like-btn { background: none; border: none; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; transition: transform .15s ease; }
        .like-btn:not(:disabled) { cursor: pointer; }
        .like-btn:not(:disabled):hover { transform: scale(1.08); }
        .share-icon { font-size: 18px; text-decoration: none; transition: transform .15s ease; }
        .share-icon:hover { transform: translateY(-2px) scale(1.15); }
        .copy-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; }

        .comments-card { margin-top: 16px; padding: 20px; }
        .comment-input {
          flex: 1; background: #0d0d12; border: 1px solid #2a2a35; border-radius: 10px;
          padding: 11px 14px; color: #fff; font-size: 13px; outline: none; transition: border-color .15s ease;
        }
        .comment-input:focus { border-color: #a855f7; }
        .send-btn {
          background: linear-gradient(135deg,#a855f7,#7e22ce); color: #fff; border: none; border-radius: 10px;
          padding: 0 18px; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s ease;
        }

        .about-card { min-width: 250px; max-width: 270px; padding: 20px; align-self: flex-start; position: sticky; top: 20px; }
        .about-title { color: #fff; font-weight: 800; font-size: 14px; margin-bottom: 12px; letter-spacing: .3px; }
        .about-row { display: flex; gap: 9px; color: #a3a3ad; font-size: 12.5px; margin-bottom: 10px; line-height: 1.5; }
        .link-btn {
          width: 100%; border-radius: 10px; padding: 10px 12px; font-size: 12.5px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .2s ease;
        }

        @media (max-width: 700px) {
          .sidebar, .about-card { position: static; max-width: 100%; }
          .layout { flex-direction: column; }
        }
      `}</style>
      <div className="menu-wrap">
        <a href="/#explorar" className="back-link">← Volver a explorar</a>

        {/* Header del negocio */}
        <div className="card header-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {negocio?.logo ? (
              <img src={negocio.logo} alt={negocio.nombre} className="logo-ring" />
            ) : (
              <div className="logo-fallback">🍽️</div>
            )}
            <div>
              <div className="biz-name">{negocio?.nombre || nombre}</div>
              {negocio?.descripcion && <div style={{ color: "#8b8b96", fontSize: 12.5, marginTop: 2 }}>{negocio.descripcion}</div>}
            </div>
          </div>
          {direccionTexto && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionTexto)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              <IconMapPin size={14} /> Cómo llegar
            </a>
          )}
        </div>

        {/* Imagen de la carta tal como fue publicada por el negocio */}
        {data?.imagen_url && (
          <div className="card carta-img-wrap">
            <img
              src={data.imagen_url}
              alt={`Carta publicada de ${negocio?.nombre || nombre}`}
              className="carta-img"
            />
          </div>
        )}

        {secciones.length === 0 ? (
          <p style={{ color: "#888", marginTop: 40, textAlign: "center" }}>
            Este negocio aún no tiene platillos publicados.
          </p>
        ) : (
          <div className="layout">
            {/* Sidebar de categorías */}
            <div className="card sidebar">
              <div className="sidebar-title">Categorías</div>
              {secciones.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => cambiarCategoria(idx)}
                  className={`cat-btn ${idx === categoriaActiva ? "active" : ""}`}
                >
                  {s.nombre}
                </button>
              ))}
            </div>

            {/* Contenido: carrusel de fotos o lista de platillos + barra de acciones */}
            <div className="content-panel">
              <div className="card dish-card">
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
                    <h2 className="dish-title">{seccion?.nombre}</h2>
                    {seccion?.platillos.map((p, i) => (
                      <div key={i} className="dish-row">
                        <div>
                          <div className="dish-name">{p.nombre}</div>
                          {p.descripcion && <div className="dish-desc">{p.descripcion}</div>}
                        </div>
                        <div className="dish-price">{p.precio}</div>
                      </div>
                    ))}
                    {(!seccion?.platillos || seccion.platillos.length === 0) && (
                      <p style={{ color: "#888", fontSize: 13 }}>Esta categoría aún no tiene platillos.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Barra de likes / comentarios / compartir */}
              <div className="card action-bar">
                <div style={{ display: "flex", gap: 22 }}>
                  <button
                    onClick={toggleLike}
                    disabled={!hayToken}
                    title={hayToken ? "" : "Inicia sesión para dar like"}
                    className="like-btn"
                    style={{ color: yaDioLike ? "#ef4444" : "#888" }}
                  >
                    <IconHeart size={18} filled={yaDioLike} /> {likes}
                  </button>
                  <span style={{ color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <IconMessageCircle /> {comentarios.length}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {botonesCompartir.map((b) => (
                    <a key={b.label} href={b.url} target="_blank" rel="noopener noreferrer" title={b.label} className="share-icon">
                      {b.emoji}
                    </a>
                  ))}
                  <button
                    onClick={copiarLink}
                    title="Copiar enlace"
                    className="copy-btn"
                    style={{ color: copiado ? "#4ade80" : "#888" }}
                  >
                    <IconLink size={14} /> {copiado ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Comentarios */}
              <div className="card comments-card">
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
                      className="comment-input"
                    />
                    <button
                      onClick={enviarComentario}
                      disabled={enviando || !nuevoComentario.trim()}
                      className="send-btn"
                      style={{ opacity: enviando || !nuevoComentario.trim() ? 0.6 : 1 }}
                    >
                      Enviar
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#0d0d12", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 18 }}>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Inicia sesión para comentar</div>
                    <a href="/login">
                      <button className="send-btn" style={{ marginTop: 10, padding: "8px 16px" }}>
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
            <div className="card about-card">
              <div className="about-title">Acerca del lugar</div>
              {negocio?.descripcion && (
                <p style={{ color: "#c3c3cc", fontSize: 12.5, marginBottom: 14, lineHeight: 1.6 }}>{negocio.descripcion}</p>
              )}
              {negocio?.horario && (
                <div className="about-row">
                  <IconClock size={14} /> {negocio.horario}
                </div>
              )}
              {negocio?.telefono && (
                <div className="about-row">
                  <IconPhone size={14} /> {negocio.telefono}
                </div>
              )}
              {direccionTexto && (
                <div className="about-row">
                  <IconMapPin size={14} /> {direccionTexto}
                </div>
              )}
              <button
                onClick={copiarLink}
                className="link-btn"
                style={{
                  background: copiado ? "#16a34a" : "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(126,34,206,0.10))",
                  color: copiado ? "white" : "#c4a3f7",
                  border: `1px solid ${copiado ? "#16a34a" : "#5b3f8c"}`,
                }}
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