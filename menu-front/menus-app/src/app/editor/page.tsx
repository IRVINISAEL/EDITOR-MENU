"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const fuentes = [
  "Playfair Display", "Georgia", "Arial", "Montserrat", "Times New Roman",
  "Lora", "Raleway", "Oswald", "Merriweather", "Poppins",
  "EB Garamond", "Cinzel", "Dancing Script", "Josefin Sans", "Libre Baskerville"
];

const fondos = [
  { nombre: "Clásico", bg: "linear-gradient(135deg, #fefefe, #f8f4ee)", texto: "#2c1810", acento: "#8b4513" },
  { nombre: "Oscuro", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", texto: "#ffffff", acento: "#a855f7" },
  { nombre: "Verde", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#16a34a" },
  { nombre: "Azul", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", texto: "#1e3a5f", acento: "#2563eb" },
  { nombre: "Rosa", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)", texto: "#831843", acento: "#ec4899" },
  { nombre: "Sepia", bg: "linear-gradient(135deg, #fdf6e3, #f5e6c8)", texto: "#3b2a1a", acento: "#a0522d" },
  { nombre: "Noche Azul", bg: "linear-gradient(135deg, #0f172a, #1e293b)", texto: "#e2e8f0", acento: "#38bdf8" },
  { nombre: "Menta", bg: "linear-gradient(135deg, #f0faf5, #c6f0dc)", texto: "#134e2a", acento: "#10b981" },
  { nombre: "Lavanda", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)", texto: "#3b0764", acento: "#7c3aed" },
  { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
  { nombre: "Carbón", bg: "linear-gradient(135deg, #18181b, #27272a)", texto: "#fafafa", acento: "#facc15" },
  { nombre: "Rojo Vino", bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", texto: "#4c0519", acento: "#be123c" },
];

const API = process.env.NEXT_PUBLIC_API_URL;

type Platillo = { 
  nombre: string; 
  precio: string; 
  descripcion: string; 
  imagen?: string;
  colorTexto?: string;
  imagenPos?: { x: number; y: number };
  disponible?: boolean;
};

type Seccion = { id: number; nombre: string; platillos: Platillo[] };

const seccionesIniciales: Seccion[] = [
  { id: 1, nombre: "ENTRADAS", platillos: [
    { nombre: "Bruschetta Clásica", precio: "$85", descripcion: "Pan tostado con tomate" },
    { nombre: "Ensalada César", precio: "$90", descripcion: "Lechuga romana, crutones" },
    { nombre: "Sopa del Día", precio: "$70", descripcion: "Pregunta al mesero" },
  ]},
  { id: 2, nombre: "PLATOS FUERTES", platillos: [
    { nombre: "Salmón al Grill", precio: "$220", descripcion: "Con vegetales asados" },
    { nombre: "Filete a la Parrilla", precio: "$250", descripcion: "Término a tu elección" },
    { nombre: "Pasta Alfredo", precio: "$180", descripcion: "Con crema y parmesano" },
  ]},
  { id: 3, nombre: "POSTRES", platillos: [
    { nombre: "Cheesecake de Fresa", precio: "$90", descripcion: "Con salsa de fresas" },
    { nombre: "Volcán de Chocolate", precio: "$95", descripcion: "Con helado de vainilla" },
    { nombre: "Tiramisú", precio: "$85", descripcion: "Receta italiana original" },
  ]},
];

export default function Editor() {
  const [menuId, setMenuId] = useState<string | number | null>(null);
  const [nombreMenu, setNombreMenu] = useState("Menú Restaurante");
  const [subtitulo, setSubtitulo] = useState("RESTAURANTE");
  const [fuenteActiva, setFuenteActiva] = useState("Playfair Display");
  const [fondoActivo, setFondoActivo] = useState(fondos[0]);
  const [tamaño, setTamaño] = useState(48);
  const [guardado, setGuardado] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [secciones, setSecciones] = useState<Seccion[]>(seccionesIniciales);
  const [editando, setEditando] = useState<{tipo: string, seccionId?: number, platilloIdx?: number, campo?: string} | null>(null);
  const [herramienta, setHerramienta] = useState("Texto");
  const [mostrarDescripciones, setMostrarDescripciones] = useState(true);
  const [mostrarImagenes, setMostrarImagenes] = useState(true);
  const [orientacion, setOrientacion] = useState<"vertical" | "horizontal">("vertical");
  const [colorTitulo, setColorTitulo] = useState("");
  const [colorSubtitulo, setColorSubtitulo] = useState("");
  const [fuenteTitulo, setFuenteTitulo] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const guardada = localStorage.getItem("plantilla_cargada");
    if (guardada) {
      try {
        const config = JSON.parse(guardada);
        if (config.id) setMenuId(config.id);
        if (config.fuenteActiva) setFuenteActiva(config.fuenteActiva);
        if (config.fondoActivo) setFondoActivo(config.fondoActivo);
        if (config.tamaño) setTamaño(config.tamaño);
        if (config.subtitulo) setSubtitulo(config.subtitulo);
        if (config.secciones) setSecciones(config.secciones);
        localStorage.removeItem("plantilla_cargada");
      } catch {}
    }
  }, []);

  const router = useRouter();

  const parsePrecioNumerico = (valor: string | number) => {
    if (typeof valor === "number") return valor;
    const parsed = Number(String(valor).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const guardarPlatillos = async (id: string | number) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token no disponible");

    const platillos = secciones.flatMap((seccion) =>
      seccion.platillos.map((platillo) => ({
        menu_id: id,
        nombre_p: platillo.nombre,
        descripcion_p: platillo.descripcion,
        precio: parsePrecioNumerico(platillo.precio),
        imagen_url: platillo.imagen || null,
        disponible: platillo.disponible === false ? 0 : 1,
      }))
    );

    const res = await fetch(`${API}/api/platillos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ platillos }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.mensaje || "No se pudieron guardar los platillos");
    }
    return data;
  };

  // Confirm before closing tab or navigating away when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!guardado && !guardando) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
        return "";
      }
      return undefined as unknown as string;
    };

    const handlePopState = () => {
      if (!guardado && !guardando) {
        const leave = window.confirm("¿Estás seguro que quieres salir sin guardar tus cambios?");
        if (!leave) {
          history.pushState(null, "", location.href);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [guardado, guardando]);

  const handleBackClick = (e: any) => {
    e.preventDefault();
    if (!guardado && !guardando) {
      const leave = window.confirm("¿Estás seguro que quieres salir sin guardar tus cambios?");
      if (!leave) return;
    }
    router.push("/mis-menus");
  };

  const editarNombreSeccion = (seccionId: number, valor: string) => {
    setSecciones(prev => prev.map(s => s.id === seccionId ? { ...s, nombre: valor } : s));
  };

  const editarPlatillo = (seccionId: number, idx: number, campo: keyof Platillo, valor: string | { x: number; y: number }) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: s.platillos.map((p, i) => i === idx ? { ...p, [campo]: valor } : p) } : s
    ));
  };

  const subirImagen = async (seccionId: number, idx: number, file: File) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("imagen", file);
    if (menuId) formData.append("menu_id", String(menuId));

    const res = await fetch(`${API}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();

    if (data.ok && data.url) {
      editarPlatillo(seccionId, idx, "imagen", data.url);
      setGuardado(false);
    } else {
      alert("❌ No se pudo subir la imagen: " + (data.mensaje || "error desconocido"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error de conexión al subir la imagen.");
  }
};

  const eliminarImagen = (seccionId: number, idx: number) => {
    editarPlatillo(seccionId, idx, "imagen", "");
    setGuardado(false);
  };

  const agregarPlatillo = (seccionId: number) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: [...s.platillos, { nombre: "Nuevo platillo", precio: "$0", descripcion: "Descripción" }] } : s
    ));
    setGuardado(false);
  };

  const eliminarPlatillo = (seccionId: number, idx: number) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: s.platillos.filter((_, i) => i !== idx) } : s
    ));
    setGuardado(false);
  };

  const agregarSeccion = () => {
    const nuevaId = secciones.length > 0 ? Math.max(...secciones.map(s => s.id)) + 1 : 1;
    setSecciones(prev => [...prev, { id: nuevaId, nombre: "NUEVA SECCIÓN", platillos: [{ nombre: "Nuevo platillo", precio: "$0", descripcion: "Descripción" }] }]);
    setGuardado(false);
  };

  const eliminarSeccion = (seccionId: number) => {
    if (secciones.length <= 1) return;
    setSecciones(prev => prev.filter(s => s.id !== seccionId));
    setGuardado(false);
  };

  const exportarPDF = async () => {
    if (!menuRef.current) return;

    // Guardamos el estado de edición actual para limpiar inputs antes del render
    setEditando(null);

    // Pequeña espera para asegurar el render limpio de estados
    setTimeout(async () => {
      const canvas = await html2canvas(menuRef.current!, {
        scale: 2, // Excelente calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Evita cuadros blancos de fondo
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: orientacion === "horizontal" ? "landscape" : "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${nombreMenu}.pdf`);
    }, 150);
  };

  const handleGuardar = async (estado: "Borrador" | "Publicado") => {
    if (!nombreMenu || nombreMenu.trim() === "") {
      alert("⚠️ Escribe un nombre para el menú antes de guardar");
      return;
    }

    setGuardando(true);
    setGuardado(false);
    try {
      const usuarioData = localStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : { id: 1 };

      const res = await fetch(`${API}/api/menus${menuId ? "/" + menuId : ""}`, {
        method: menuId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nombre: nombreMenu,
          estado,
          data_json: JSON.stringify({
            categorias: secciones,
            fuenteActiva,
            fondoActivo,
            tamaño,
            subtitulo,
          }),
          user_id: usuario.id || 1,
        }),
      });

      const data = await res.json();
      if (data.ok || res.ok) {
        const savedMenuId = data.menuId || menuId;
        if (savedMenuId) {
          setMenuId(savedMenuId);
          try {
            await guardarPlatillos(savedMenuId);
          } catch (platillosError) {
            console.error(platillosError);
            alert("❌ El menú se guardó, pero no se pudieron guardar los platillos.");
            setGuardando(false);
            return;
          }
        }
        setGuardado(true);
        alert(estado === "Publicado" ? "🚀 ¡Menú guardado y publicado exitosamente!" : "💾 ¡Borrador guardado correctamente!");
        window.location.href = "/mis-menus";
      } else {
        alert("❌ Error: " + (data.mensaje || "No se pudo guardar el menú"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error de conexión al servidor.");
    } finally {
      setGuardando(false);
    }
  };
  
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13", overflow: "hidden" }}>

      {/* SIDEBAR IZQUIERDO */}
      <aside style={{
        width: 56, background: "#16161d", borderRight: "1px solid #2a2a35",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "12px 0", gap: 4, zIndex: 10,
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <img src="/logo.png" alt="Menu Master" style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 12 }} />
        </a>
        {[{ icon: "T", label: "Texto" }, { icon: "🎨", label: "Fondos" }, { icon: "☰", label: "Secciones" }, { icon: "🖼️", label: "Imágenes" }].map(h => (
          <button key={h.label} onClick={() => setHerramienta(h.label)} style={{
            width: 44, height: 44, borderRadius: 8, border: "none",
            background: herramienta === h.label ? "#7c3aed33" : "transparent",
            color: herramienta === h.label ? "#a855f7" : "#666",
            cursor: "pointer", fontSize: 16,
            borderLeft: herramienta === h.label ? "2px solid #a855f7" : "2px solid transparent",
          }} title={h.label}>{h.icon}</button>
        ))}
      </aside>

      {/* PANEL CENTRAL + BARRA SUPERIOR */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* BARRA SUPERIOR */}
        <div style={{
          minHeight: 52, background: "#16161d", borderBottom: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px", gap: 8, flexWrap: "wrap",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/mis-menus" onClick={handleBackClick} style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>← Volver</a>
            <span style={{ color: "#333" }}>|</span>
            
            <input
              value={nombreMenu}
              onChange={e => { setNombreMenu(e.target.value); setGuardado(false); }}
              style={{
                background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
                color: "white", fontSize: 13, fontWeight: 600, outline: "none",
                padding: "4px 10px", width: 180,
              }}
            />
            <span style={{
              background: guardado ? "#16a34a22" : "#ca8a0422",
              color: guardado ? "#4ade80" : "#fbbf24",
              border: `1px solid ${guardado ? "#16a34a44" : "#ca8a0444"}`,
              borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600,
            }}>
              {guardando ? "● Guardando..." : guardado ? "● Guardado" : "● Sin guardar"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select value={fuenteActiva} onChange={e => { setFuenteActiva(e.target.value); setGuardado(false); }} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 8px", fontSize: 11, outline: "none",
            }}>
              {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input type="number" value={tamaño} onChange={e => { setTamaño(Number(e.target.value)); setGuardado(false); }} style={{
              width: 48, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 6px", fontSize: 11, outline: "none", textAlign: "center",
            }} />
            <button onClick={() => setMostrarDescripciones(!mostrarDescripciones)} style={{
              background: mostrarDescripciones ? "#7c3aed33" : "#1e1e28",
              border: "1px solid #2a2a35", borderRadius: 6,
              color: mostrarDescripciones ? "#a855f7" : "#aaa",
              padding: "4px 8px", cursor: "pointer", fontSize: 11,
            }}>📝</button>
            <button onClick={() => setMostrarImagenes(!mostrarImagenes)} style={{
              background: mostrarImagenes ? "#7c3aed33" : "#1e1e28",
              border: "1px solid #2a2a35", borderRadius: 6,
              color: mostrarImagenes ? "#a855f7" : "#aaa",
              padding: "4px 8px", cursor: "pointer", fontSize: 11,
            }}>🖼️</button>
            <select value={orientacion} onChange={e => setOrientacion(e.target.value as "vertical" | "horizontal")} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 8px", fontSize: 11, outline: "none",
            }}>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={exportarPDF} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "7px 12px", cursor: "pointer", fontSize: 12,
            }}>📄 PDF</button>
            <button onClick={() => handleGuardar("Borrador")} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "7px 12px", cursor: "pointer", fontSize: 12,
            }}> Guardar borrador</button>
            <button onClick={() => handleGuardar("Publicado")} style={{
              background: "#7c3aed", border: "1px solid #7c3aed", borderRadius: 8,
              color: "white", padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>🚀 Publicar menú</button>
          </div>
        </div>

        {/* GUÍA RÁPIDA */}
          <div
            style={{
              background: "#16161d",
              borderBottom: "1px solid #2a2a35",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 600 }}>
              🚀 Guía rápida para crear tu menú
            </span>

            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              <span>① Escribe el nombre del menú</span>
              <span>② Edita secciones y platillos</span>
              <span>③ Personaliza colores y fuente</span>
              <span>④ Guarda o exporta tu menú</span>
            </div>
          </div>

        {/* CANVAS DE TRABAJO */}
        <div style={{
          flex: 1, overflow: "auto", background: "#0a0a0e",
          display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 32,
        }}>
          <div ref={menuRef} style={{
            width: orientacion === "vertical" ? "210mm" : "297mm",
            minHeight: orientacion === "vertical" ? "297mm" : "210mm",
            display: orientacion === "horizontal" ? "grid" : "block",
            gridTemplateColumns: orientacion === "horizontal" ? "repeat(2, 1fr)" : undefined,
            gap: orientacion === "horizontal" ? 24 : undefined,
            background: fondoActivo.bg,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            padding: "20mm",
            boxSizing: "border-box",
            fontFamily: fuenteActiva,
          }}>
            
            {/* HEADER - TÍTULO Y SUBTÍTULO */}
            <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `2px solid ${fondoActivo.acento}` }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: fondoActivo.acento, marginBottom: 8, opacity: 0.6 }}>✦ ✦ ✦</div>
              
              {editando?.tipo === "titulo" ? (
                <input
                  value={nombreMenu}
                  autoFocus
                  onChange={e => { setNombreMenu(e.target.value); setGuardado(false); }}
                  onBlur={() => setEditando(null)}
                  style={{
                    background: "transparent", border: "none",
                    borderBottom: `2px solid ${fondoActivo.acento}`,
                    outline: "none", fontSize: tamaño / 2.8,
                    color: colorTitulo || fondoActivo.texto,
                    fontWeight: 700, fontFamily: fuenteTitulo || fuenteActiva,
                    letterSpacing: 4, textAlign: "center", width: "100%"
                  }}
                />
              ) : (
                <h1 
                  onClick={() => setEditando({ tipo: "titulo" })}
                  style={{
                    fontSize: tamaño / 2.8, color: colorTitulo || fondoActivo.texto,
                    fontWeight: 700, fontFamily: fuenteTitulo || fuenteActiva,
                    letterSpacing: 4, textAlign: "center", width: "100%", cursor: "text", margin: 0, textTransform: "uppercase"
                  }}
                >
                  {nombreMenu || "MENÚ RESTAURANTE"}
                </h1>
              )}

              {editando?.tipo === "subtitulo" ? (
                <input
                  value={subtitulo}
                  autoFocus
                  onChange={e => { setSubtitulo(e.target.value); setGuardado(false); }}
                  onBlur={() => setEditando(null)}
                  style={{
                    background: "transparent", border: "none",
                    borderBottom: `2px solid ${fondoActivo.acento}`,
                    outline: "none", fontSize: tamaño / 5,
                    color: colorSubtitulo || fondoActivo.acento,
                    fontWeight: 400, fontFamily: fuenteTitulo || fuenteActiva,
                    letterSpacing: 6, textAlign: "center", width: "100%", marginTop: 4
                  }}
                />
              ) : (
                <p 
                  onClick={() => setEditando({ tipo: "subtitulo" })}
                  style={{
                    fontSize: tamaño / 5, color: colorSubtitulo || fondoActivo.acento,
                    fontWeight: 400, fontFamily: fuenteTitulo || fuenteActiva,
                    letterSpacing: 6, textAlign: "center", width: "100%", cursor: "text", marginTop: 4, marginBottom: 0, textTransform: "uppercase"
                  }}
                >
                  {subtitulo || "RESTAURANTE"}
                </p>
              )}
              <div style={{ fontSize: 10, letterSpacing: 4, color: fondoActivo.acento, marginTop: 8, opacity: 0.6 }}>✦ ✦ ✦</div>
            </div>

            {/* SECCIONES */}
            {secciones.map((seccion) => (
              <div key={seccion.id} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                  
                  {editando?.tipo === "seccion" && editando?.seccionId === seccion.id ? (
                    <input
                      value={seccion.nombre}
                      autoFocus
                      onChange={e => { editarNombreSeccion(seccion.id, e.target.value); setGuardado(false); }}
                      onBlur={() => setEditando(null)}
                      style={{
                        background: "transparent", border: "none",
                        borderBottom: `1px solid ${fondoActivo.acento}`,
                        outline: "none", fontSize: 11, letterSpacing: 3,
                        color: fondoActivo.acento, fontWeight: 700, textAlign: "center",
                        fontFamily: fuenteActiva,
                      }}
                    />
                  ) : (
                    <h2
                      onClick={() => setEditando({ tipo: "seccion", seccionId: seccion.id })}
                      style={{
                        fontSize: 11, letterSpacing: 3, color: fondoActivo.acento, 
                        fontWeight: 700, textAlign: "center", cursor: "text", 
                        fontFamily: fuenteActiva, margin: 0, textTransform: "uppercase"
                      }}
                    >
                      {seccion.nombre}
                    </h2>
                  )}
                  <button onClick={() => eliminarSeccion(seccion.id)} style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", fontSize: 11, padding: 0, opacity: 0.4 }}>✕</button>
                </div>

                {seccion.platillos.map((platillo, idx) => (
                  <div key={idx} style={{ marginBottom: 10, padding: "6px 0", borderBottom: `1px dotted ${fondoActivo.acento}44` }}>
                    
                    {/* Imagen del platillo */}
                    {mostrarImagenes && (
                      <div style={{ marginBottom: 6 }}>
                        {platillo.imagen ? (
                          <div style={{ position: "relative", height: 100, overflow: "hidden", borderRadius: 6 }}>
                            <img src={platillo.imagen} alt={platillo.nombre} style={{ position: "absolute", left: platillo.imagenPos?.x ?? 0, top: platillo.imagenPos?.y ?? 0, width: "100%", height: "auto", borderRadius: 6 }} />
                            <button onClick={(e) => { e.stopPropagation(); eliminarImagen(seccion.id, idx); }} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer", width: 20, height: 20, fontSize: 10, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                          </div>
                        ) : (
                          <label style={{ cursor: "pointer", display: "block" }}>
                            <div style={{ border: `1px dashed ${fondoActivo.acento}55`, borderRadius: 6, padding: "8px", textAlign: "center", opacity: 0.5, color: fondoActivo.acento, fontSize: 10 }}>📷 Agregar imagen</div>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (file) subirImagen(seccion.id, idx, file); }} />
                          </label>
                        )}
                      </div>
                    )}

                    {/* Fila del Nombre y Precio */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1, marginRight: 8 }}>
                        {editando?.seccionId === seccion.id && editando?.platilloIdx === idx && editando?.campo === "nombre" ? (
                          <input
                            value={platillo.nombre}
                            autoFocus
                            onChange={e => { editarPlatillo(seccion.id, idx, "nombre", e.target.value); setGuardado(false); }}
                            onBlur={() => setEditando(null)}
                            style={{ background: "transparent", border: "none", borderBottom: `1px solid ${fondoActivo.acento}`, outline: "none", fontSize: 12, color: platillo.colorTexto || fondoActivo.texto, fontFamily: fuenteActiva, width: "100%" }}
                          />
                        ) : (
                          <span 
                            onClick={() => setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "nombre" })}
                            style={{ fontSize: 12, color: platillo.colorTexto || fondoActivo.texto, fontFamily: fuenteActiva, cursor: "text", display: "block" }}
                          >
                            {platillo.nombre}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {editando?.seccionId === seccion.id && editando?.platilloIdx === idx && editando?.campo === "precio" ? (
                          <input
                            value={platillo.precio}
                            autoFocus
                            onChange={e => { editarPlatillo(seccion.id, idx, "precio", e.target.value); setGuardado(false); }}
                            onBlur={() => setEditando(null)}
                            style={{ background: "transparent", border: "none", borderBottom: `1px solid ${fondoActivo.acento}`, outline: "none", fontSize: 12, color: fondoActivo.acento, fontFamily: fuenteActiva, width: 55, textAlign: "right", fontWeight: 600 }}
                          />
                        ) : (
                          <span 
                            onClick={() => setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "precio" })}
                            style={{ fontSize: 12, color: fondoActivo.acento, fontFamily: fuenteActiva, fontWeight: 600, cursor: "text", textAlign: "right", display: "inline-block", minWidth: 40 }}
                          >
                            {platillo.precio}
                          </span>
                        )}
                        <button onClick={() => eliminarPlatillo(seccion.id, idx)} style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", fontSize: 10, opacity: 0.4 }}>✕</button>
                      </div>
                    </div>

                    {/* Descripción del Platillo */}
                    {mostrarDescripciones && (
                      <div style={{ marginTop: 2, width: "100%" }}>
                        {editando?.seccionId === seccion.id && editando?.platilloIdx === idx && editando?.campo === "descripcion" ? (
                          <input
                            value={platillo.descripcion}
                            autoFocus
                            onChange={e => { editarPlatillo(seccion.id, idx, "descripcion", e.target.value); setGuardado(false); }}
                            onBlur={() => setEditando(null)}
                            style={{ background: "transparent", border: "none", borderBottom: `1px solid ${fondoActivo.acento}77`, outline: "none", fontSize: 10, color: platillo.colorTexto || fondoActivo.texto, fontFamily: fuenteActiva, width: "100%", opacity: 0.8 }}
                          />
                        ) : (
                          <p 
                            onClick={() => setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "descripcion" })}
                            style={{ fontSize: 10, color: platillo.colorTexto || fondoActivo.texto, fontFamily: fuenteActiva, opacity: 0.6, margin: 0, cursor: "text", minHeight: 12 }}
                          >
                            {platillo.descripcion || "Haz clic para añadir descripción..."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => agregarPlatillo(seccion.id)} style={{ background: "transparent", border: `1px dashed ${fondoActivo.acento}55`, borderRadius: 4, color: fondoActivo.acento, cursor: "pointer", fontSize: 10, padding: "4px 12px", marginTop: 4, width: "100%", opacity: 0.7 }}>🍽️ Agregar nuevo platillo</button>
              </div>
            ))}
            <button onClick={agregarSeccion} style={{ background: "transparent", border: `2px dashed ${fondoActivo.acento}33`, borderRadius: 8, color: fondoActivo.acento, cursor: "pointer", fontSize: 11, padding: "8px 16px", width: "100%", fontWeight: 600, marginTop: 8 }}>➕ Agregar una nueva sección</button>
          </div>
        </div>
      </div>

      {/* SIDEBAR DERECHO DE PROPIEDADES */}
      <aside style={{
        width: 260, background: "#16161d", borderLeft: "1px solid #2a2a35",
        display: "flex", flexDirection: "column", padding: 16, overflowY: "auto", gap: 20
      }}>
        <h3 style={{ color: "white", fontSize: 14, margin: 0, fontWeight: 600, borderBottom: "1px solid #2a2a35", paddingBottom: 8 }}>
          Propiedades ({herramienta})
        </h3>
        <div
            style={{
              background: "#1e1e28",
              border: "1px solid #2a2a35",
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div style={{ color: "#a855f7", fontWeight: 600, marginBottom: 6 }}>
              💡 Consejo
            </div>

            <p
              style={{
                color: "#aaa",
                fontSize: 12,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Haz clic sobre cualquier título, sección o platillo para editarlo directamente.
              Utiliza el panel izquierdo para cambiar herramientas y el panel derecho para
              personalizar el diseño de tu menú.
            </p>
          </div>

        {herramienta === "Texto" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 6 }}>Estilo Global de Fuente</label>
              <select value={fuenteActiva} onChange={e => setFuenteActiva(e.target.value)} style={{ width: "100%", background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "white", padding: 6, fontSize: 12, outline: "none" }}>
                {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {editando?.tipo === "titulo" || editando?.tipo === "subtitulo" ? (
              <div style={{ background: "#1e1e28", padding: 10, borderRadius: 6, border: "1px solid #7c3aed44" }}>
                <span style={{ color: "#a855f7", fontSize: 11, fontWeight: 600 }}>Personalizar {editando.tipo}</span>
                <div style={{ marginTop: 8 }}>
                  <label style={{ color: "#aaa", fontSize: 10, display: "block", marginBottom: 4 }}>Color Personalizado</label>
                  <input type="color" value={editando.tipo === "titulo" ? colorTitulo || fondoActivo.texto : colorSubtitulo || fondoActivo.acento} onChange={e => { if (editando.tipo === "titulo") setColorTitulo(e.target.value); else setColorSubtitulo(e.target.value); setGuardado(false); }} style={{ width: "100%", height: 28, border: "none", borderRadius: 4, cursor: "pointer", background: "transparent" }} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <label style={{ color: "#aaa", fontSize: 10, display: "block", marginBottom: 4 }}>Fuente de Títulos</label>
                  <select value={fuenteTitulo || fuenteActiva} onChange={e => setFuenteTitulo(e.target.value)} style={{ width: "100%", background: "#16161d", border: "1px solid #2a2a35", borderRadius: 4, color: "white", padding: 4, fontSize: 11 }}>
                    {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <p style={{ color: "#555", fontSize: 11, fontStyle: "italic", margin: 0 }}>
                Haz clic en cualquier texto del menú (Título, plato, sección) para editar su contenido directamente en caliente.
              </p>
            )}
          </div>
        )}

        {herramienta === "Fondos" && (
          <div>
            <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 8 }}>Selecciona un Tema Estilizado</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fondos.map(f => (
                <button key={f.nombre} onClick={() => { setFondoActivo(f); setGuardado(false); }} style={{ width: "100%", padding: "10px", background: f.bg, border: fondoActivo.nombre === f.nombre ? "2px solid #a855f7" : "1px solid #2a2a35", borderRadius: 6, textAlign: "left", cursor: "pointer" }}>
                  <span style={{ color: f.texto, fontWeight: 600, fontSize: 12 }}>{f.nombre}</span>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: f.acento, display: "inline-block", float: "right" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {herramienta === "Secciones" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ color: "#888", fontSize: 11 }}>Lista de Categorías</span>
            {secciones.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e1e28", padding: "6px 10px", borderRadius: 6 }}>
                <span style={{ color: "white", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: 160 }}>{s.nombre}</span>
                <button onClick={() => eliminarSeccion(s.id)} style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            ))}
            <button onClick={agregarSeccion} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 6, color: "white", padding: 8, cursor: "pointer", fontSize: 12, marginTop: 6 }}>
              + Nueva Categoría
            </button>
          </div>
        )}

        {herramienta === "Imágenes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ color: "#888", fontSize: 11 }}>Visualización</span>
            <button onClick={() => setMostrarImagenes(!mostrarImagenes)} style={{ width: "100%", background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6, color: "white", padding: 8, fontSize: 12, cursor: "pointer" }}>
              {mostrarImagenes ? "👁️ Ocultar Todas las Imágenes" : "👁️ Mostrar Imágenes"}
            </button>
            <p style={{ color: "#555", fontSize: 10, margin: "4px 0" }}>
              💡 Consejo: Al exportar, la aplicación limpiará los focos activos de edición de forma automática para asegurar un acabado limpio y profesional.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}