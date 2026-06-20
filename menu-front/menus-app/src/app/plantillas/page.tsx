"use client";
import { useState } from "react";

const categorias = ["Todas", "Restaurante", "Cafetería", "Postres", "Italiano", "Moderno"];

const plantillas = [
  {
    id: 1, nombre: "Clásico Elegante", categoria: "Restaurante",
    color: "#f5f0e8", textColor: "#2c1810", emoji: "🍽️", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "RESTAURANTE",
      fondoActivo: { nombre: "Clásico", bg: "linear-gradient(135deg, #fefefe, #f8f4ee)", texto: "#2c1810", acento: "#8b4513" },
      secciones: [
        { id: 1, nombre: "ENTRADAS", platillos: [{ nombre: "Bruschetta Clásica", precio: "$85", descripcion: "Pan tostado con tomate" }, { nombre: "Ensalada César", precio: "$90", descripcion: "Lechuga romana, crutones" }] },
        { id: 2, nombre: "PLATOS FUERTES", platillos: [{ nombre: "Filete a la Parrilla", precio: "$250", descripcion: "Término a tu elección" }, { nombre: "Salmón al Grill", precio: "$220", descripcion: "Con vegetales asados" }] },
        { id: 3, nombre: "POSTRES", platillos: [{ nombre: "Volcán de Chocolate", precio: "$95", descripcion: "Con helado de vainilla" }] },
      ],
    },
  },
  {
    id: 2, nombre: "Moderno Minimalista", categoria: "Moderno",
    color: "#1a1a1a", textColor: "#ffffff", emoji: "⬛", popular: true,
    config: {
      fuenteActiva: "Montserrat", tamaño: 44, subtitulo: "EXPERIENCIA GASTRONÓMICA",
      fondoActivo: { nombre: "Oscuro", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", texto: "#ffffff", acento: "#a855f7" },
      secciones: [
        { id: 1, nombre: "STARTERS", platillos: [{ nombre: "Tartar de Atún", precio: "$130", descripcion: "Con aguacate y sésamo" }] },
        { id: 2, nombre: "MAINS", platillos: [{ nombre: "Risotto Negro", precio: "$195", descripcion: "Con tinta de calamar" }, { nombre: "Pato Confitado", precio: "$280", descripcion: "Con reducción de cereza" }] },
        { id: 3, nombre: "DESSERTS", platillos: [{ nombre: "Coulant", precio: "$95", descripcion: "Chocolate belga 70%" }] },
      ],
    },
  },
  {
    id: 3, nombre: "Cafetería Vintage", categoria: "Cafetería",
    color: "#3d2b1f", textColor: "#f5deb3", emoji: "☕", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 42, subtitulo: "CAFÉ & REPOSTERÍA",
      fondoActivo: { nombre: "Sepia", bg: "linear-gradient(135deg, #fdf6e3, #f5e6c8)", texto: "#3b2a1a", acento: "#a0522d" },
      secciones: [
        { id: 1, nombre: "BEBIDAS CALIENTES", platillos: [{ nombre: "Espresso", precio: "$35", descripcion: "Grano de origen único" }, { nombre: "Cappuccino", precio: "$55", descripcion: "Leche vaporizada y espuma" }] },
        { id: 2, nombre: "REPOSTERÍA", platillos: [{ nombre: "Croissant", precio: "$45", descripcion: "Horneado cada mañana" }, { nombre: "Cheesecake NY", precio: "$75", descripcion: "Con coulis de frutos rojos" }] },
      ],
    },
  },
  {
    id: 4, nombre: "Pastelería Dulce", categoria: "Postres",
    color: "#fce4ec", textColor: "#880e4f", emoji: "🍰", popular: true,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 52, subtitulo: "POSTRES ARTESANALES",
      fondoActivo: { nombre: "Rosa", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)", texto: "#831843", acento: "#ec4899" },
      secciones: [
        { id: 1, nombre: "PASTELES", platillos: [{ nombre: "Red Velvet", precio: "$85", descripcion: "Con frosting de queso crema" }, { nombre: "Tres Leches", precio: "$75", descripcion: "Receta de la abuela" }] },
        { id: 2, nombre: "CUPCAKES", platillos: [{ nombre: "Chocolate & Nutella", precio: "$45", descripcion: "Relleno y cubierto" }] },
      ],
    },
  },
  {
    id: 5, nombre: "Restaurante Italiano", categoria: "Italiano",
    color: "#1b5e20", textColor: "#ffffff", emoji: "🍝", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "CUCINA ITALIANA",
      fondoActivo: { nombre: "Verde", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#16a34a" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI", platillos: [{ nombre: "Burrata Fresca", precio: "$140", descripcion: "Con prosciutto di Parma" }] },
        { id: 2, nombre: "PASTA", platillos: [{ nombre: "Cacio e Pepe", precio: "$160", descripcion: "Receta romana original" }, { nombre: "Tagliatelle al Ragù", precio: "$180", descripcion: "Cocido 4 horas" }] },
        { id: 3, nombre: "DOLCI", platillos: [{ nombre: "Tiramisú della Casa", precio: "$90", descripcion: "Con mascarpone y café" }] },
      ],
    },
  },
  {
    id: 6, nombre: "Brunch Moderno", categoria: "Moderno",
    color: "#fff8e1", textColor: "#4e342e", emoji: "🍳", popular: false,
    config: {
      fuenteActiva: "Poppins", tamaño: 44, subtitulo: "BRUNCH & CAFÉ",
      fondoActivo: { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "BRUNCH", platillos: [{ nombre: "Eggs Benedict", precio: "$120", descripcion: "Con salsa holandesa" }, { nombre: "Pancakes de Arándano", precio: "$95", descripcion: "Con maple syrup" }] },
        { id: 2, nombre: "BEBIDAS", platillos: [{ nombre: "Mimosa", precio: "$85", descripcion: "Jugo de naranja y prosecco" }] },
      ],
    },
  },
  {
    id: 7, nombre: "Mariscos Frescos", categoria: "Restaurante",
    color: "#e3f2fd", textColor: "#0d47a1", emoji: "🦞", popular: false,
    config: {
      fuenteActiva: "Merriweather", tamaño: 44, subtitulo: "MARISCOS & MÁS",
      fondoActivo: { nombre: "Azul", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", texto: "#1e3a5f", acento: "#2563eb" },
      secciones: [
        { id: 1, nombre: "DEL MAR", platillos: [{ nombre: "Ceviche Clásico", precio: "$145", descripcion: "Con leche de tigre" }, { nombre: "Langosta al Ajillo", precio: "$380", descripcion: "Con mantequilla de hierbas" }] },
        { id: 2, nombre: "POSTRES", platillos: [{ nombre: "Flan de Coco", precio: "$75", descripcion: "Con caramelo artesanal" }] },
      ],
    },
  },
  {
    id: 8, nombre: "Tacos & Antojitos", categoria: "Restaurante",
    color: "#fff3e0", textColor: "#bf360c", emoji: "🌮", popular: true,
    config: {
      fuenteActiva: "Oswald", tamaño: 48, subtitulo: "ANTOJERÍA MEXICANA",
      fondoActivo: { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "TACOS", platillos: [{ nombre: "Taco al Pastor", precio: "$25", descripcion: "Con piña y cilantro" }, { nombre: "Taco de Birria", precio: "$30", descripcion: "Con consomé" }, { nombre: "Taco de Canasta", precio: "$18", descripcion: "Frijol, chicharrón, papa" }] },
        { id: 2, nombre: "ANTOJITOS", platillos: [{ nombre: "Quesadilla de Flor", precio: "$65", descripcion: "Con queso Oaxaca" }, { nombre: "Tostada de Tinga", precio: "$55", descripcion: "Con crema y aguacate" }] },
      ],
    },
  },
  {
    id: 9, nombre: "Sushi & Japonés", categoria: "Moderno",
    color: "#0d0d0d", textColor: "#e8d5b0", emoji: "🍱", popular: true,
    config: {
      fuenteActiva: "Josefin Sans", tamaño: 44, subtitulo: "JAPANESE CUISINE",
      fondoActivo: { nombre: "Carbón", bg: "linear-gradient(135deg, #18181b, #27272a)", texto: "#fafafa", acento: "#facc15" },
      secciones: [
        { id: 1, nombre: "NIGIRI & SASHIMI", platillos: [{ nombre: "Nigiri de Salmón", precio: "$65", descripcion: "Arroz de sushi, salmón fresco" }, { nombre: "Sashimi Premium", precio: "$180", descripcion: "Selección del chef, 12 piezas" }] },
        { id: 2, nombre: "ROLLS ESPECIALES", platillos: [{ nombre: "Dragon Roll", precio: "$155", descripcion: "Camarón tempura, aguacate, anguila" }, { nombre: "Spider Roll", precio: "$145", descripcion: "Cangrejo suave, pepino, masago" }, { nombre: "Rainbow Roll", precio: "$160", descripcion: "Variedad de pescados frescos" }] },
        { id: 3, nombre: "HOT DISHES", platillos: [{ nombre: "Ramen Tonkotsu", precio: "$145", descripcion: "Caldo 12 horas, chashu, huevo" }, { nombre: "Gyozas al Vapor", precio: "$85", descripcion: "6 piezas, salsa ponzu" }] },
      ],
    },
  },
  {
    id: 10, nombre: "Fine Dining Noir", categoria: "Moderno",
    color: "#050508", textColor: "#c9a96e", emoji: "✨", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 46, subtitulo: "HAUTE CUISINE",
      fondoActivo: { nombre: "Noche Azul", bg: "linear-gradient(135deg, #0f172a, #1e293b)", texto: "#e2e8f0", acento: "#38bdf8" },
      secciones: [
        { id: 1, nombre: "AMUSE-BOUCHE", platillos: [{ nombre: "Ostión Rockefeller", precio: "$180", descripcion: "Espinaca, parmesano, mignonette" }, { nombre: "Foie Gras Torchon", precio: "$240", descripcion: "Brioche, compota de higo, flor de sal" }] },
        { id: 2, nombre: "ENTRÉES", platillos: [{ nombre: "Vieira Sellada", precio: "$290", descripcion: "Puré de coliflor, trufa negra, caviar" }, { nombre: "Tartare de Wagyu", precio: "$320", descripcion: "Yema curada, mostaza Dijon, alcaparras" }] },
        { id: 3, nombre: "PLATS PRINCIPAUX", platillos: [{ nombre: "Wagyu A5 Japonés", precio: "$850", descripcion: "200g, chimichurri de hierbas finas" }, { nombre: "Langosta Термидор", precio: "$580", descripcion: "Mantequilla de estragón, gratinada" }] },
        { id: 4, nombre: "DESSERTS", platillos: [{ nombre: "Soufflé Grand Marnier", precio: "$145", descripcion: "Preparación 20 min, crème anglaise" }] },
      ],
    },
  },
  {
    id: 11, nombre: "Pizzería Napolitana", categoria: "Italiano",
    color: "#7f1d1d", textColor: "#fef2f2", emoji: "🍕", popular: false,
    config: {
      fuenteActiva: "Oswald", tamaño: 48, subtitulo: "PIZZERIA NAPOLETANA",
      fondoActivo: { nombre: "Rojo Vino", bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", texto: "#4c0519", acento: "#be123c" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI", platillos: [{ nombre: "Tabla de Embutidos", precio: "$180", descripcion: "Prosciutto, salami, mortadela, olivas" }, { nombre: "Bruschetta al Pomodoro", precio: "$75", descripcion: "Tomate San Marzano, albahaca, EVOO" }] },
        { id: 2, nombre: "PIZZE", platillos: [{ nombre: "Margherita D.O.P.", precio: "$185", descripcion: "Tomate, fior di latte, albahaca" }, { nombre: "Diavola", precio: "$195", descripcion: "Nduja picante, salami, mozzarella" }, { nombre: "Tartufo", precio: "$245", descripcion: "Crema de trufa, champiñones, rúcula" }] },
        { id: 3, nombre: "DOLCI", platillos: [{ nombre: "Cannolo Siciliano", precio: "$85", descripcion: "Ricotta, pistache, naranja confitada" }, { nombre: "Panna Cotta", precio: "$75", descripcion: "Frutos rojos, menta fresca" }] },
      ],
    },
  },
  {
    id: 12, nombre: "Terraza Mediterránea", categoria: "Restaurante",
    color: "#dbeafe", textColor: "#1e3a5f", emoji: "🌊", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 44, subtitulo: "COCINA MEDITERRÁNEA",
      fondoActivo: { nombre: "Azul", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", texto: "#1e3a5f", acento: "#2563eb" },
      secciones: [
        { id: 1, nombre: "PARA COMPARTIR", platillos: [{ nombre: "Hummus Artesanal", precio: "$95", descripcion: "Tahini, paprika ahumada, pita caliente" }, { nombre: "Tabla de Quesos", precio: "#220", descripcion: "Selección europea, miel, nueces, uvas" }, { nombre: "Pulpo a la Gallega", precio: "$185", descripcion: "Papas, pimentón, aceite de oliva" }] },
        { id: 2, nombre: "DEL MAR", platillos: [{ nombre: "Paella de Mariscos", precio: "$280", descripcion: "Arroz bomba, azafrán, mariscos frescos" }, { nombre: "Dorada a la Sal", precio: "$320", descripcion: "Entera, limón, hierbas provenzales" }] },
        { id: 3, nombre: "DE LA TIERRA", platillos: [{ nombre: "Cordero Confitado", precio: "$295", descripcion: "12 horas, romero, ajo negro" }] },
      ],
    },
  },
  {
    id: 13, nombre: "Steakhouse Premium", categoria: "Restaurante",
    color: "#1c0a00", textColor: "#f5e6d0", emoji: "🥩", popular: true,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 50, subtitulo: "PRIME STEAKHOUSE",
      fondoActivo: { nombre: "Oscuro", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", texto: "#ffffff", acento: "#facc15" },
      secciones: [
        { id: 1, nombre: "STARTERS", platillos: [{ nombre: "French Onion Soup", precio: "$95", descripcion: "Gruyère gratinado, caldo oscuro" }, { nombre: "Wedge Salad", precio: "$115", descripcion: "Lechuga iceberg, blue cheese, bacon" }] },
        { id: 2, nombre: "THE CUTS", platillos: [{ nombre: "Ribeye 400g", precio: "$580", descripcion: "Dry-aged 45 días, mantequilla de hierbas" }, { nombre: "New York Strip 350g", precio: "$520", descripcion: "USDA Prime, sal rosa del Himalaya" }, { nombre: "Tomahawk 1kg", precio: "$980", descripcion: "Para dos, presentación espectacular" }, { nombre: "Filet Mignon 250g", precio: "$490", descripcion: "El corte más tierno, salsa béarnaise" }] },
        { id: 3, nombre: "SIDES", platillos: [{ nombre: "Mac & Cheese Trufado", precio: "$125", descripcion: "Pasta artesanal, trufa negra, 3 quesos" }, { nombre: "Creamed Spinach", precio: "$85", descripcion: "Espinaca, crema, nuez moscada" }] },
      ],
    },
  },
  {
    id: 14, nombre: "Healthy & Vegano", categoria: "Moderno",
    color: "#f0fdf4", textColor: "#14532d", emoji: "🥗", popular: false,
    config: {
      fuenteActiva: "Raleway", tamaño: 42, subtitulo: "PLANT BASED KITCHEN",
      fondoActivo: { nombre: "Verde", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#16a34a" },
      secciones: [
        { id: 1, nombre: "BOWLS", platillos: [{ nombre: "Buddha Bowl", precio: "$135", descripcion: "Quinoa, garbanzos, tahini, vegetales asados" }, { nombre: "Acai Bowl", precio: "$115", descripcion: "Acai, granola, frutos del bosque, coco" }] },
        { id: 2, nombre: "PLATOS", platillos: [{ nombre: "Curry de Lentejas", precio: "$125", descripcion: "Leche de coco, espinaca, arroz basmati" }, { nombre: "Tacos de Coliflor", precio: "$115", descripcion: "Coliflor asada, guacamole, pico de gallo" }, { nombre: "Ramen Vegano", precio: "$145", descripcion: "Caldo dashi vegetal, tofu, setas shiitake" }] },
        { id: 3, nombre: "SMOOTHIES", platillos: [{ nombre: "Green Power", precio: "$75", descripcion: "Espinaca, mango, jengibre, leche de almendra" }, { nombre: "Berry Bliss", precio: "$75", descripcion: "Frambuesa, arándano, plátano, linaza" }] },
      ],
    },
  },
  {
    id: 15, nombre: "Cantina Mexicana", categoria: "Restaurante",
    color: "#431407", textColor: "#fde68a", emoji: "🌶️", popular: false,
    config: {
      fuenteActiva: "Merriweather", tamaño: 46, subtitulo: "COCINA TRADICIONAL",
      fondoActivo: { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "ANTOJITOS", platillos: [{ nombre: "Guacamole de Molcajete", precio: "$95", descripcion: "Aguacate Hass, jitomate, cilantro, chile" }, { nombre: "Sopa Azteca", precio: "$85", descripcion: "Tortilla, epazote, chile pasilla, crema" }] },
        { id: 2, nombre: "ESPECIALIDADES", platillos: [{ nombre: "Mole Negro Oaxaqueño", precio: "$195", descripcion: "30 ingredientes, pollo de rancho, arroz rojo" }, { nombre: "Cochinita Pibil", precio: "$175", descripcion: "Cerdo marinado en achiote, habanero encurtido" }, { nombre: "Chiles en Nogada", precio: "$210", descripcion: "Temporada, nuez de castilla, granada, perejil" }] },
        { id: 3, nombre: "BEBIDAS", platillos: [{ nombre: "Mezcal Artesanal", precio: "$95", descripcion: "Espadín, sal de gusano, naranja" }, { nombre: "Agua de Jamaica", precio: "$35", descripcion: "Flor de jamaica, azúcar de caña" }] },
      ],
    },
  },
  {
    id: 16, nombre: "Bakery & Café", categoria: "Cafetería",
    color: "#fdf6e3", textColor: "#5c3d11", emoji: "🥐", popular: false,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 50, subtitulo: "BOULANGERIE & CAFÉ",
      fondoActivo: { nombre: "Sepia", bg: "linear-gradient(135deg, #fdf6e3, #f5e6c8)", texto: "#3b2a1a", acento: "#a0522d" },
      secciones: [
        { id: 1, nombre: "VIENNOISERIE", platillos: [{ nombre: "Croissant au Beurre", precio: "$55", descripcion: "Mantequilla Échiré, 72 capas" }, { nombre: "Pain au Chocolat", precio: "$60", descripcion: "Chocolate Valrhona, masa hojaldrada" }, { nombre: "Kouign-Amann", precio: "$65", descripcion: "Caramelizado, sal de Bretaña" }] },
        { id: 2, nombre: "TARTAS & PASTELES", platillos: [{ nombre: "Tarte au Citron", precio: "$85", descripcion: "Lemon curd, merengue italiano" }, { nombre: "Éclair de Chocolate", precio: "$75", descripcion: "Crema pastelera, glasé negro brillante" }] },
        { id: 3, nombre: "CAFÉ DE ESPECIALIDAD", platillos: [{ nombre: "Flat White", precio: "$65", descripcion: "Doble espresso, leche texturizada" }, { nombre: "Matcha Latte", precio: "$75", descripcion: "Matcha ceremonial japonés, leche de avena" }, { nombre: "Cold Brew 24h", precio: "$70", descripcion: "Extracción en frío, notas de chocolate" }] },
      ],
    },
  },
];

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Mis Diseños", href: "#" },
  { icon: "🖼️", label: "Medios", href: "#" },
  { icon: "🏢", label: "Mi Negocio", href: "/mi-negocio" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "/configuracion" },
];

type Plantilla = typeof plantillas[0];

export default function Plantillas() {
  const [activeNav] = useState("Plantillas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [preview, setPreview] = useState<Plantilla | null>(null);

  const plantillasFiltradas = plantillas.filter((p) => {
    const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const usarPlantilla = (p: Plantilla) => {
    localStorage.setItem("plantilla_cargada", JSON.stringify(p.config));
    window.location.href = "/editor";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
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
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                background: activeNav === item.label ? "#7c3aed22" : "transparent",
                color: activeNav === item.label ? "#a855f7" : "#888",
                cursor: "pointer", fontSize: 13, fontWeight: activeNav === item.label ? 600 : 400,
                borderLeft: activeNav === item.label ? "2px solid #a855f7" : "2px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
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
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Plantillas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Elige una plantilla para empezar tu menú</p>
          </div>
          <input
            type="text" placeholder="🔍 Buscar plantillas..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: 220 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)} style={{
              background: categoriaActiva === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: categoriaActiva === cat ? "none" : "1px solid #2a2a35",
              borderRadius: 20, padding: "8px 18px",
              color: categoriaActiva === cat ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: categoriaActiva === cat ? 600 : 400,
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plantillasFiltradas.map((p) => (
            <div key={p.id} style={{ position: "relative" }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
            >
              {p.popular && (
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 20, padding: "3px 10px", color: "white", fontSize: 10, fontWeight: 700 }}>⭐ Popular</div>
              )}
              <div style={{ background: p.color, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a35", cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
                <div style={{ fontSize: 48 }}>{p.emoji}</div>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16, color: p.textColor, textAlign: "center" }}>MENÚ</div>
                <div style={{ color: p.textColor, opacity: 0.6, fontSize: 11, textAlign: "center" }}>
                  — Entradas —<br />— Platos Fuertes —<br />— Postres —
                </div>

                <div className="overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s", borderRadius: 12 }}>
                  <button
                    onClick={() => usarPlantilla(p)}
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px 20px", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer", width: 140 }}
                  >✓ Usar plantilla</button>
                  <button
                    onClick={() => setPreview(p)}
                    style={{ background: "transparent", border: "1px solid #ffffff44", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, cursor: "pointer", width: 140 }}
                  >👁 Vista previa</button>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{p.categoria}</div>
              </div>
            </div>
          ))}

          <div
            onClick={() => { localStorage.removeItem("plantilla_cargada"); window.location.href = "/editor"; }}
            style={{ border: "2px dashed #2a2a35", borderRadius: 12, cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
          >
            <div style={{ fontSize: 36, color: "#a855f7" }}>+</div>
            <div style={{ color: "#666", fontSize: 13 }}>Crear desde cero</div>
          </div>
        </div>
      </main>

      {/* MODAL VISTA PREVIA */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: preview.config.fondoActivo.bg, borderRadius: 16, padding: "40px 36px", width: 360, maxHeight: "80vh", overflowY: "auto", fontFamily: preview.config.fuenteActiva, boxShadow: "0 30px 80px rgba(0,0,0,0.8)", position: "relative" }}>
            <button onClick={() => setPreview(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 28, height: 28, color: preview.config.fondoActivo.texto, cursor: "pointer", fontSize: 14 }}>✕</button>

            <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${preview.config.fondoActivo.acento}` }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginBottom: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
              <div style={{ fontSize: preview.config.tamaño / 2.8, color: preview.config.fondoActivo.texto, fontWeight: 700, letterSpacing: 4 }}>MENÚ</div>
              <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, letterSpacing: 6, marginTop: 4 }}>{preview.config.subtitulo}</div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginTop: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
            </div>

            {preview.config.secciones.map(sec => (
              <div key={sec.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: preview.config.fondoActivo.acento, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>{sec.nombre}</div>
                {sec.platillos.map((pl, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dotted ${preview.config.fondoActivo.acento}44`, padding: "5px 0" }}>
                    <div>
                      <div style={{ fontSize: 11, color: preview.config.fondoActivo.texto, fontWeight: 600 }}>{pl.nombre}</div>
                      <div style={{ fontSize: 9, color: preview.config.fondoActivo.texto, opacity: 0.6 }}>{pl.descripcion}</div>
                    </div>
                    <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, fontWeight: 700 }}>{pl.precio}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setPreview(null)} style={{ flex: 1, background: "transparent", border: `1px solid ${preview.config.fondoActivo.acento}`, borderRadius: 8, padding: "10px", color: preview.config.fondoActivo.acento, cursor: "pointer", fontSize: 12 }}>Cerrar</button>
              <button onClick={() => usarPlantilla(preview)} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>✓ Usar esta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}