"use client";
import { useState, useEffect } from "react";
import {
  IconEdit,
  IconChart,
  IconBuilding,
  IconCard,
  IconImage,
  IconTrash,
  IconSettings,
  IconGlobe,
  IconLogout,
  IconArrowRight,
  IconBulb,
  IconCamera,
  IconX,
  IconLink,
  IconMusic,
  IconMessageCircle,
  IconCheck,
  IconSave,
} from "@/components/Icons";

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: <IconEdit />, label: "Mis Diseños", href: "#" },
  { icon: <IconImage />, label: "Medios", href: "#" },
  { icon: <IconTrash />, label: "Papelera", href: "/papelera" },
  { icon: <IconBuilding />, label: "Mi Negocio", href: "/mi-negocio" },
  { icon: <IconCard />, label: "Facturación", href: "/planes" },
  { icon: <IconSettings />, label: "Configuración", href: "/configuracion" },
];

export default function MiNegocio() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [logo, setLogo] = useState<string>("");
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Restaurante");
  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [noExterior, setNoExterior] = useState("");
  const [horario, setHorario] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarNegocio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/negocio`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.ok && data.negocio) {
          const n = data.negocio;
          setLogo(n.logo || "");
          setNombre(n.nombre || "");
          setTipo(n.tipo || "Restaurante");
          setDescripcion(n.descripcion || "");
          setTelefono(n.telefono || "");
          setEmail(n.email || "");
          setSitioWeb(n.sitioWeb || "");
          setHorario(n.horario || "");
          setCalle(n.direccion?.calle || "");
          setColonia(n.direccion?.colonia || "");
          setNoExterior(n.direccion?.noExterior || "");
          setInstagram(n.redes?.instagram || "");
          setFacebook(n.redes?.facebook || "");
          setTiktok(n.redes?.tiktok || "");
          setWhatsapp(n.redes?.whatsapp || "");
        }
      } catch (err) {
        console.error("Error cargando la información del negocio:", err);
      }
    };
    cargarNegocio();
  }, []);

  const handleLogo = async (file: File) => {
    setSubiendoLogo(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("imagen", file);
      const res = await fetch(`${API}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (data.ok && data.url) setLogo(data.url);
      else alert("No se pudo subir el logo: " + (data.mensaje || "error desconocido"));
    } catch (err) {
      console.error(err);
      alert(" Error de conexión al subir el logo.");
    } finally {
      setSubiendoLogo(false);
    }
  };

  const guardar = async () => {
    if (!nombre.trim()) { alert("El nombre del negocio es obligatorio"); return; }
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/negocio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nombre, descripcion, tipo, telefono, email, sitioWeb, logo, horario,
          direccion: { calle, colonia, noExterior },
          redes: { facebook, instagram, whatsapp, tiktok },
        }),
      });
      const data = await res.json();
      if (data.ok) { setGuardado(true); setTimeout(() => setGuardado(false), 2000); }
      else alert(" No se pudo guardar: " + (data.mensaje || "error desconocido"));
    } catch (err) {
      console.error(err);
      alert(" Error de conexión al guardar la información del negocio.");
    } finally {
      setGuardando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
    color: "white", fontSize: 13, outline: "none", padding: "10px 14px",
    width: "100%", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>
      <button className="hamburger-btn" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}

      {/* SIDEBAR */}
      <aside className={`app-sidebar ${menuAbierto ? "abierto" : ""}`} style={{ width: 220, background: "#16161d", display: "flex", flexDirection: "column", padding: "24px 0", borderRight: "1px solid #2a2a35", position: "fixed", height: "100vh", zIndex: 10 }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Menu Master" style={{ width: 36, height: 36, borderRadius: 10 }} />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: item.label === "Mi Negocio" ? "#7c3aed22" : "transparent", color: item.label === "Mi Negocio" ? "#a855f7" : "#888", fontSize: 13, fontWeight: item.label === "Mi Negocio" ? 600 : 400, borderLeft: item.label === "Mi Negocio" ? "2px solid #a855f7" : "2px solid transparent", cursor: "pointer" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
              </div>
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #2a2a35" }}>
          <div
            onClick={() => {
              localStorage.removeItem("usuario");
              document.cookie = "usuario=; path=/; max-age=0";
              window.location.href = "/login";
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}
          >
            <span><IconLogout /></span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="app-main" style={{ marginLeft: 220, flex: 1, padding: 32, maxWidth: 800 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Mi Negocio</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Información de tu restaurante o negocio</p>
        </div>

        {/* LOGO */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Logo del negocio</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: 12, background: "#16161d", border: "2px dashed #2a2a35", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {logo ? <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 32 }}><IconBuilding /></span>}
            </div>
            <div>
              <label style={{ cursor: "pointer" }}>
                <div style={{ background: "#7c3aed22", border: "1px solid #7c3aed44", borderRadius: 8, padding: "10px 18px", color: "#a855f7", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-block" }}>
                  <IconCamera /> Subir logo
                </div>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleLogo(f); }} />
              </label>
              {logo && <button onClick={() => setLogo("")} style={{ display: "block", marginTop: 8, background: "transparent", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}><IconX /> Quitar logo</button>}
              <p style={{ color: "#555", fontSize: 11, marginTop: 8 }}>PNG, JPG. Recomendado: 400x400px</p>
            </div>
          </div>
        </div>

        {/* DATOS PRINCIPALES */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Información principal</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>NOMBRE DEL NEGOCIO</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: La Trattoria" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>TIPO DE NEGOCIO</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["Restaurante", "Cafetería", "Pastelería", "Pizzería", "Bar", "Food Truck", "Mariscos", "Sushi", "Vegano", "Otro"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describe tu negocio en pocas palabras..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* CONTACTO */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Contacto y ubicación</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>TELÉFONO</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+52 55 1234 5678" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="contacto@minegocio.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CALLE</label>
              <input value={calle} onChange={e => setCalle(e.target.value)} placeholder="Av. Principal" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>COLONIA</label>
              <input value={colonia} onChange={e => setColonia(e.target.value)} placeholder="Centro" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>NO. EXTERIOR</label>
              <input value={noExterior} onChange={e => setNoExterior(e.target.value)} placeholder="123" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>HORARIO DE ATENCIÓN</label>
              <input value={horario} onChange={e => setHorario(e.target.value)} placeholder="Lun-Dom 9:00 - 22:00" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>SITIO WEB</label>
              <input value={sitioWeb} onChange={e => setSitioWeb(e.target.value)} placeholder="https://minegocio.com" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Redes sociales</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "INSTAGRAM", icon: <IconCamera />, value: instagram, set: setInstagram, placeholder: "@minegocio" },
              { label: "FACEBOOK", icon: <IconLink />, value: facebook, set: setFacebook, placeholder: "facebook.com/minegocio" },
              { label: "TIKTOK", icon: <IconMusic />, value: tiktok, set: setTiktok, placeholder: "@minegocio" },
              { label: "WHATSAPP", icon: <IconMessageCircle />, value: whatsapp, set: setWhatsapp, placeholder: "+52 55 1234 5678" },
            ].map(r => (
              <div key={r.label}>
                <label style={labelStyle}>{r.icon} {r.label}</label>
                <input value={r.value} onChange={e => r.set(e.target.value)} placeholder={r.placeholder} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={guardar} style={{ background: guardado ? "#16a34a" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 10, padding: "14px 32px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s" }}>
           {guardando ? "Guardando..." : guardado ? (<><IconCheck /> Guardado</>) : (<><IconSave /> Guardar cambios</>)}
        </button>
      </main>
    </div>
  );
}