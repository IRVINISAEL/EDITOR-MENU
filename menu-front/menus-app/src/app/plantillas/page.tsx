"use client";
import { useState, useEffect } from "react";
import {
  IconEdit,
  IconBuilding,
  IconCard,
  IconImage,
  IconTrash,
  IconSettings,
  IconLogout,
  IconLock,
  IconPackage,
  IconStar,
} from "@/components/Icons";

const API = process.env.NEXT_PUBLIC_API_URL;

const categorias = ["Todas", "Restaurante", "Cafetería", "Postres", "Italiano", "Moderno", "Mexicano", "Japonés", "Vegano", "Favoritos"];


const plantillas = [
  {
    id: 1, nombre: "Clásico Elegante", categoria: "Restaurante",
    color: "#f5f0e8", textColor: "#2c1810", emoji: "🍽️", popular: true,
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
    color: "#3d2b1f", textColor: "#f5deb3", emoji: "☕", popular: true,
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
    id: 13, nombre: "Steakhouse Premium", categoria: "Restaurante", premium: true,
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
{
    id: 17, nombre: "Omakase Kaiseki", categoria: "Japonés", premium: true,
    color: "#0a0a0a", textColor: "#d4af37", emoji: "🍣", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 46, subtitulo: "OMAKASE EXPERIENCE",
      fondoActivo: { nombre: "Onix Dorado", bg: "linear-gradient(135deg, #0a0a0a, #1c1c1c)", texto: "#f5f0e0", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "SAKIZUKE", platillos: [{ nombre: "Uni de Hokkaido", precio: "$320", descripcion: "Erizo de mar, yema de codorniz, alga nori" }, { nombre: "Toro Tartare", precio: "$280", descripcion: "Atún graso, caviar osetra, wasabi fresco" }] },
        { id: 2, nombre: "OMAKASE NIGIRI", platillos: [{ nombre: "Selección del Chef 10 pzs", precio: "$650", descripcion: "Pescado de temporada, importación diaria" }, { nombre: "Wagyu Nigiri", precio: "$220", descripcion: "A5 flameado, trufa negra" }] },
        { id: 3, nombre: "SHIRUMONO", platillos: [{ nombre: "Dashi de Kombu Añejo", precio: "$95", descripcion: "Caldo dashi 3 años, tofu de seda" }] },
      ],
    },
  },
  {
    id: 18, nombre: "Château Bistro", categoria: "Restaurante", premium: true,
    color: "#2c1e12", textColor: "#e8d9b5", emoji: "🍷", popular: true,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "MAISON GASTRONOMIQUE",
      fondoActivo: { nombre: "Borgoña", bg: "linear-gradient(135deg, #1f0f0f, #3a1717)", texto: "#f0e4d0", acento: "#9e2a2b" },
      secciones: [
        { id: 1, nombre: "ENTRÉES", platillos: [{ nombre: "Foie Gras Poêlé", precio: "$310", descripcion: "Manzana caramelizada, reducción de Sauternes" }, { nombre: "Escargots de Bourgogne", precio: "$195", descripcion: "Mantequilla de ajo y perejil, 6 piezas" }] },
        { id: 2, nombre: "PLATS SIGNATURE", platillos: [{ nombre: "Canard à l'Orange", precio: "$390", descripcion: "Pato de granja, salsa de naranja sanguina" }, { nombre: "Côte de Bœuf 500g", precio: "$620", descripcion: "Para compartir, salsa bordelesa" }] },
        { id: 3, nombre: "FROMAGES & DESSERTS", platillos: [{ nombre: "Plateau de Fromages", precio: "$220", descripcion: "Selección francesa, mermelada de higo" }] },
      ],
    },
  },
  {
    id: 19, nombre: "Rooftop Skyline", categoria: "Moderno", premium: true,
    color: "#0f172a", textColor: "#f8fafc", emoji: "🌆", popular: true,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "SKY LOUNGE & GRILL",
      fondoActivo: { nombre: "Medianoche", bg: "linear-gradient(135deg, #0f172a, #1e1b4b)", texto: "#e0e7ff", acento: "#818cf8" },
      secciones: [
        { id: 1, nombre: "RAW BAR", platillos: [{ nombre: "Torre de Mariscos", precio: "$450", descripcion: "Ostras, camarón, langosta, ceviche" }, { nombre: "Tartare de Atún Aleta Azul", precio: "$260", descripcion: "Ponzu de yuzu, aire de sésamo" }] },
        { id: 2, nombre: "SIGNATURE", platillos: [{ nombre: "Chuletón Ibérico", precio: "$540", descripcion: "Bellota 50 meses, sal Maldon" }, { nombre: "Langosta Termidor Skyline", precio: "$480", descripcion: "Gratinada, mantequilla de coñac" }] },
        { id: 3, nombre: "MIXOLOGY", platillos: [{ nombre: "Cóctel de Autor", precio: "$180", descripcion: "Mezcal ahumado, humo en vivo" }] },
      ],
    },
  },
  {
    id: 20, nombre: "Trattoria Riserva", categoria: "Italiano", premium: true,
    color: "#3d0c11", textColor: "#f3e5d8", emoji: "🍷", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "CUCINA D'AUTORE",
      fondoActivo: { nombre: "Vino Riserva", bg: "linear-gradient(135deg, #2b0a0d, #4a1116)", texto: "#f5e6d3", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI DELLA CASA", platillos: [{ nombre: "Carpaccio di Manzo", precio: "$210", descripcion: "Trufa negra, parmigiano 36 meses" }, { nombre: "Vitello Tonnato", precio: "$185", descripcion: "Receta piamontesa clásica" }] },
        { id: 2, nombre: "PRIMI RISERVA", platillos: [{ nombre: "Risotto al Tartufo Bianco", precio: "$320", descripcion: "Arborio, trufa blanca d'Alba en mesa" }, { nombre: "Agnolotti del Plin", precio: "$245", descripcion: "Relleno de tres carnes, mantequilla y salvia" }] },
        { id: 3, nombre: "SECONDI", platillos: [{ nombre: "Ossobuco alla Milanese", precio: "$290", descripcion: "Gremolata, risotto allo zafferano" }] },
      ],
    },
  },
  {
    id: 21, nombre: "Jardín Botánico Vegano", categoria: "Vegano", premium: true,
    color: "#0b2e13", textColor: "#eafbe7", emoji: "🌿", popular: false,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 46, subtitulo: "FINE PLANT-BASED DINING",
      fondoActivo: { nombre: "Bosque", bg: "linear-gradient(135deg, #0b2e13, #143d1e)", texto: "#eafbe7", acento: "#4ade80" },
      secciones: [
        { id: 1, nombre: "DE LA HUERTA", platillos: [{ nombre: "Carpaccio de Remolacha", precio: "$135", descripcion: "Queso de anacardo, eneldo, cítricos" }, { nombre: "Tártar de Hongos Ostra", precio: "$150", descripcion: "Trufa, alcaparras, pan de masa madre" }] },
        { id: 2, nombre: "SIGNATURE PLANT", platillos: [{ nombre: "Wellington de Setas Silvestres", precio: "$285", descripcion: "Hojaldre, paté de nuez, jus de vino tinto" }, { nombre: "Risotto de Espárragos Verdes", precio: "$210", descripcion: "Caldo de kombu, aceite de albahaca" }] },
        { id: 3, nombre: "POSTRES", platillos: [{ nombre: "Tarta de Chocolate 70% Sin Lácteos", precio: "$110", descripcion: "Praliné de avellana, sal de mar" }] },
      ],
    },
  },
  {
    id: 22, nombre: "Taquería Urbana", categoria: "Mexicano",
    color: "#fff1e6", textColor: "#7c2d12", emoji: "🌮", popular: false,
    config: {
      fuenteActiva: "Oswald", tamaño: 46, subtitulo: "TAQUERÍA DE BARRIO",
      fondoActivo: { nombre: "Terracota", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "TACOS AL CARBÓN", platillos: [{ nombre: "Taco de Arrachera", precio: "$32", descripcion: "Con guacamole y cebollitas" }, { nombre: "Taco de Chorizo", precio: "$22", descripcion: "Con papa y salsa verde" }] },
        { id: 2, nombre: "PARA COMPARTIR", platillos: [{ nombre: "Molcajete Mixto", precio: "$210", descripcion: "Carnes, nopal y queso panela" }, { nombre: "Guacamole en Molcajete", precio: "$95", descripcion: "Preparado en mesa" }] },
        { id: 3, nombre: "BEBIDAS", platillos: [{ nombre: "Agua de Horchata", precio: "$35", descripcion: "Canela y vainilla" }] },
      ],
    },
  },
  {
    id: 23, nombre: "Chocolatería Artesanal", categoria: "Postres",
    color: "#3e2723", textColor: "#f5e6d3", emoji: "🍫", popular: false,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 50, subtitulo: "CHOCOLATE ARTESANAL",
      fondoActivo: { nombre: "Cacao", bg: "linear-gradient(135deg, #3e2723, #4e342e)", texto: "#f5e6d3", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "BOMBONES", platillos: [{ nombre: "Trufas 70% Cacao", precio: "$65", descripcion: "Caja de 6 piezas" }, { nombre: "Bombón de Avellana", precio: "$45", descripcion: "Praliné casero" }] },
        { id: 2, nombre: "BEBIDAS", platillos: [{ nombre: "Chocolate Caliente Belga", precio: "$60", descripcion: "Con malvaviscos artesanales" }] },
      ],
    },
  },
  {
    id: 24, nombre: "Ramen Bar Tokyo", categoria: "Japonés",
    color: "#1a1a1a", textColor: "#f5e6c8", emoji: "🍜", popular: true,
    config: {
      fuenteActiva: "Josefin Sans", tamaño: 44, subtitulo: "RAMEN & IZAKAYA",
      fondoActivo: { nombre: "Carbón", bg: "linear-gradient(135deg, #18181b, #27272a)", texto: "#fafafa", acento: "#f97316" },
      secciones: [
        { id: 1, nombre: "RAMEN", platillos: [{ nombre: "Shoyu Ramen", precio: "$135", descripcion: "Caldo de soya, chashu, huevo marinado" }, { nombre: "Miso Ramen", precio: "$140", descripcion: "Caldo de miso, maíz, mantequilla" }] },
        { id: 2, nombre: "IZAKAYA", platillos: [{ nombre: "Karaage", precio: "$95", descripcion: "Pollo frito estilo japonés" }, { nombre: "Edamame", precio: "$55", descripcion: "Con sal de mar" }] },
      ],
    },
  },
  {
    id: 25, nombre: "Costa Café", categoria: "Cafetería",
    color: "#e0f2f1", textColor: "#00695c", emoji: "🌊", popular: false,
    config: {
      fuenteActiva: "Raleway", tamaño: 42, subtitulo: "COASTAL COFFEE HOUSE",
      fondoActivo: { nombre: "Aqua", bg: "linear-gradient(135deg, #e0f7fa, #b2ebf2)", texto: "#00363a", acento: "#00acc1" },
      secciones: [
        { id: 1, nombre: "BEBIDAS FRÍAS", platillos: [{ nombre: "Cold Brew Coco", precio: "$65", descripcion: "Con leche de coco" }, { nombre: "Frappé de Caramelo", precio: "$70", descripcion: "Con crema batida" }] },
        { id: 2, nombre: "SNACKS", platillos: [{ nombre: "Bagel de Salmón", precio: "$85", descripcion: "Queso crema y eneldo" }] },
      ],
    },
  },
  {
    id: 26, nombre: "Bodega Enoteca", categoria: "Italiano", premium: true,
    color: "#2b0a0d", textColor: "#f3e5d8", emoji: "🍇", popular: false,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "ENOTECA & CUCINA",
      fondoActivo: { nombre: "Vino Tinto", bg: "linear-gradient(135deg, #2b0a0d, #4a1116)", texto: "#f5e6d3", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI", platillos: [{ nombre: "Burrata al Tartufo", precio: "$220", descripcion: "Trufa negra, miel de castañas" }, { nombre: "Carpaccio di Branzino", precio: "$195", descripcion: "Cítricos, aceite de oliva virgen" }] },
        { id: 2, nombre: "SECONDI", platillos: [{ nombre: "Osso Buco Riserva", precio: "$310", descripcion: "Gremolata, risotto al azafrán" }, { nombre: "Branzino in Crosta di Sale", precio: "$280", descripcion: "Entero, hierbas mediterráneas" }] },
        { id: 3, nombre: "CANTINA", platillos: [{ nombre: "Barolo DOCG (copa)", precio: "$260", descripcion: "Añada seleccionada" }] },
      ],
    },
  },
  {
    id: 27, nombre: "Sakura Kaiseki Garden", categoria: "Japonés", premium: true,
    color: "#0f0f0f", textColor: "#f2c2c2", emoji: "🌸", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 46, subtitulo: "KAISEKI EXPERIENCE",
      fondoActivo: { nombre: "Sakura Noche", bg: "linear-gradient(135deg, #0f0f0f, #1c1418)", texto: "#f5e6e6", acento: "#f472b6" },
      secciones: [
        { id: 1, nombre: "ZENSAI", platillos: [{ nombre: "Tofu de Sésamo Negro", precio: "$150", descripcion: "Salsa dashi, yuzu" }, { nombre: "Ostión al Ponzu", precio: "$210", descripcion: "Con caviar y shiso" }] },
        { id: 2, nombre: "TAKIAWASE", platillos: [{ nombre: "Bacalao Negro Miso", precio: "$390", descripcion: "Marinado 72 horas, saikyo miso" }, { nombre: "Wagyu A5 Teppan", precio: "$680", descripcion: "Sal Sakura, wasabi fresco" }] },
        { id: 3, nombre: "MIZUMONO", platillos: [{ nombre: "Mochi de Sakura", precio: "$95", descripcion: "Relleno de anko y cerezo" }] },
      ],
    },
  },
  {
    id: 28, nombre: "Alta Cocina Andina", categoria: "Restaurante", premium: true,
    color: "#3d2914", textColor: "#f5e6d0", emoji: "🌄", popular: true,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "COCINA DE AUTOR ANDINA",
      fondoActivo: { nombre: "Tierra", bg: "linear-gradient(135deg, #2b1d12, #4a3220)", texto: "#f5e6d0", acento: "#d4a017" },
      secciones: [
        { id: 1, nombre: "ENTRADAS", platillos: [{ nombre: "Causa de Camarón", precio: "$185", descripcion: "Papa amarilla, ají amarillo, camarón" }, { nombre: "Tiradito Nikkei", precio: "$210", descripcion: "Pescado del día, leche de tigre trufada" }] },
        { id: 2, nombre: "PRINCIPALES", platillos: [{ nombre: "Lomo Saltado Wagyu", precio: "$420", descripcion: "Papas nativas, salsa criolla" }, { nombre: "Cordero al Ají Panca", precio: "$350", descripcion: "48 horas de cocción lenta" }] },
        { id: 3, nombre: "POSTRES", platillos: [{ nombre: "Suspiro Limeño Deconstruido", precio: "$110", descripcion: "Merengue, oporto reducido" }] },
      ],
    },
  },
  {
    id: 29, nombre: "Green Michelin Table", categoria: "Vegano", premium: true,
    color: "#0d1f12", textColor: "#eafbe7", emoji: "🍃", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "PLANT-BASED FINE DINING",
      fondoActivo: { nombre: "Esmeralda", bg: "linear-gradient(135deg, #0d1f12, #163a1f)", texto: "#eafbe7", acento: "#22c55e" },
      secciones: [
        { id: 1, nombre: "PRÓLOGO", platillos: [{ nombre: "Consomé de Hongos Silvestres", precio: "$140", descripcion: "Clarificado, aceite de trufa" }, { nombre: "Tartar de Betabel Ahumado", precio: "$155", descripcion: "Yema de anacardo curada" }] },
        { id: 2, nombre: "PLATO PRINCIPAL", platillos: [{ nombre: "Coliflor Entera Rostizada", precio: "$260", descripcion: "12 horas, romero y ajo negro" }, { nombre: "Risotto de Trufa Blanca Vegano", precio: "$295", descripcion: "Caldo de kombu, queso de anacardo" }] },
        { id: 3, nombre: "EPÍLOGO", platillos: [{ nombre: "Esfera de Chocolate y Maracuyá", precio: "$120", descripcion: "Sin lácteos, sin gluten" }] },
      ],
    },
  },
  {
    id: 30, nombre: "Bistro de Barrio", categoria: "Restaurante",
    color: "#f3ede3", textColor: "#3b2a1a", emoji: "🍷", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 44, subtitulo: "COCINA DE BARRIO",
      fondoActivo: { nombre: "Crema", bg: "linear-gradient(135deg, #fdfbf7, #f0e9dd)", texto: "#3b2a1a", acento: "#8b4513" },
      secciones: [
        { id: 1, nombre: "ENTRADAS", platillos: [{ nombre: "Sopa de Cebolla", precio: "$85", descripcion: "Gratinada con queso gruyère" }, { nombre: "Ensalada de la Casa", precio: "$70", descripcion: "Vinagreta de mostaza" }] },
        { id: 2, nombre: "FUERTES", platillos: [{ nombre: "Pollo Rostizado", precio: "$165", descripcion: "Con puré de papa" }, { nombre: "Pasta al Pesto", precio: "$140", descripcion: "Albahaca fresca y piñones" }] },
      ],
    },
  },
  {
    id: 31, nombre: "Waffle House Dulce", categoria: "Postres",
    color: "#fff0f5", textColor: "#9d174d", emoji: "🧇", popular: true,
    config: {
      fuenteActiva: "Poppins", tamaño: 46, subtitulo: "WAFFLES & DULCES",
      fondoActivo: { nombre: "Rosa Pastel", bg: "linear-gradient(135deg, #fff1f5, #ffe0eb)", texto: "#831843", acento: "#f472b6" },
      secciones: [
        { id: 1, nombre: "WAFFLES", platillos: [{ nombre: "Waffle Clásico", precio: "$85", descripcion: "Con maple y mantequilla" }, { nombre: "Waffle de Nutella", precio: "$95", descripcion: "Con fresas frescas" }] },
        { id: 2, nombre: "HELADOS", platillos: [{ nombre: "Sundae Brownie", precio: "$90", descripcion: "Con helado de vainilla" }] },
      ],
    },
  },
  {
    id: 32, nombre: "Trattoria della Piazza", categoria: "Italiano",
    color: "#fef3e2", textColor: "#7c2d12", emoji: "🍋", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "CUCINA DI FAMIGLIA",
      fondoActivo: { nombre: "Limón", bg: "linear-gradient(135deg, #fefce8, #fef9c3)", texto: "#713f12", acento: "#ca8a04" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI", platillos: [{ nombre: "Caprese Classica", precio: "$130", descripcion: "Mozzarella di bufala, tomate, albahaca" }] },
        { id: 2, nombre: "PASTA", platillos: [{ nombre: "Spaghetti alle Vongole", precio: "$185", descripcion: "Almejas frescas, vino blanco" }, { nombre: "Lasagna della Nonna", precio: "$165", descripcion: "Receta familiar, 3 quesos" }] },
      ],
    },
  },
  {
    id: 33, nombre: "Loft Industrial", categoria: "Moderno",
    color: "#26292c", textColor: "#f5f5f5", emoji: "🏭", popular: false,
    config: {
      fuenteActiva: "Montserrat", tamaño: 44, subtitulo: "URBAN KITCHEN",
      fondoActivo: { nombre: "Grafito", bg: "linear-gradient(135deg, #26292c, #3a3f44)", texto: "#f5f5f5", acento: "#f97316" },
      secciones: [
        { id: 1, nombre: "SMALL PLATES", platillos: [{ nombre: "Hummus de Betabel", precio: "$95", descripcion: "Con pan pita tostado" }, { nombre: "Croquetas de Jamón", precio: "$110", descripcion: "Bechamel cremosa" }] },
        { id: 2, nombre: "BOWLS", platillos: [{ nombre: "Poke de Atún", precio: "$155", descripcion: "Arroz, edamame, aguacate" }] },
      ],
    },
  },
  {
    id: 34, nombre: "Fonda Casera", categoria: "Mexicano",
    color: "#fef3c7", textColor: "#78350f", emoji: "🫓", popular: true,
    config: {
      fuenteActiva: "Merriweather", tamaño: 46, subtitulo: "COMIDA CASERA",
      fondoActivo: { nombre: "Ámbar", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)", texto: "#78350f", acento: "#d97706" },
      secciones: [
        { id: 1, nombre: "GUISADOS", platillos: [{ nombre: "Chiles Rellenos", precio: "$120", descripcion: "Con salsa de jitomate" }, { nombre: "Milanesa a la Mexicana", precio: "$135", descripcion: "Con arroz y frijoles" }] },
        { id: 2, nombre: "COMIDA CORRIDA", platillos: [{ nombre: "Menú del Día", precio: "$95", descripcion: "Sopa, guisado y agua fresca" }] },
      ],
    },
  },
  {
    id: 35, nombre: "Onigiri Bar", categoria: "Japonés",
    color: "#fafaf9", textColor: "#1c1917", emoji: "🍙", popular: false,
    config: {
      fuenteActiva: "Josefin Sans", tamaño: 44, subtitulo: "ONIGIRI & TÉ",
      fondoActivo: { nombre: "Arroz", bg: "linear-gradient(135deg, #fafaf9, #f0efec)", texto: "#1c1917", acento: "#dc2626" },
      secciones: [
        { id: 1, nombre: "ONIGIRI", platillos: [{ nombre: "Onigiri de Salmón", precio: "$45", descripcion: "Envuelto en nori" }, { nombre: "Onigiri de Umeboshi", precio: "$40", descripcion: "Ciruela encurtida" }] },
        { id: 2, nombre: "TÉS", platillos: [{ nombre: "Té Matcha Ceremonial", precio: "$65", descripcion: "Batido a mano" }] },
      ],
    },
  },
  {
    id: 36, nombre: "Huerto Verde Bistro", categoria: "Vegano",
    color: "#ecfdf5", textColor: "#065f46", emoji: "🥬", popular: false,
    config: {
      fuenteActiva: "Raleway", tamaño: 42, subtitulo: "COCINA DE HUERTO",
      fondoActivo: { nombre: "Menta", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", texto: "#065f46", acento: "#10b981" },
      secciones: [
        { id: 1, nombre: "ENSALADAS", platillos: [{ nombre: "Ensalada de Kale", precio: "$110", descripcion: "Aderezo de tahini y limón" }] },
        { id: 2, nombre: "PLATOS", platillos: [{ nombre: "Hamburguesa de Garbanzo", precio: "$130", descripcion: "Con papas al horno" }, { nombre: "Pad Thai Vegano", precio: "$135", descripcion: "Tofu, cacahuate, tamarindo" }] },
      ],
    },
  },
  {
    id: 37, nombre: "Espresso Lab", categoria: "Cafetería",
    color: "#f5f5f4", textColor: "#292524", emoji: "🔬", popular: true,
    config: {
      fuenteActiva: "Montserrat", tamaño: 42, subtitulo: "SPECIALTY COFFEE LAB",
      fondoActivo: { nombre: "Concreto", bg: "linear-gradient(135deg, #f5f5f4, #e7e5e4)", texto: "#292524", acento: "#57534e" },
      secciones: [
        { id: 1, nombre: "MÉTODOS", platillos: [{ nombre: "V60 Origen Único", precio: "$65", descripcion: "Notas frutales" }, { nombre: "Chemex", precio: "$70", descripcion: "Perfil limpio y brillante" }] },
        { id: 2, nombre: "REPOSTERÍA", platillos: [{ nombre: "Banana Bread", precio: "$55", descripcion: "Con nuez y canela" }] },
      ],
    },
  },
  {
    id: 38, nombre: "Le Comptoir Doré", categoria: "Restaurante", premium: true,
    color: "#1c1410", textColor: "#f0e4d0", emoji: "🥂", popular: true,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "MAISON DE PRESTIGE",
      fondoActivo: { nombre: "Oro Nocturno", bg: "linear-gradient(135deg, #1c1410, #2e2016)", texto: "#f0e4d0", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "ENTRÉES", platillos: [{ nombre: "Terrine de Foie Gras", precio: "$295", descripcion: "Chutney de higo, brioche tostado" }, { nombre: "Velouté de Trufa", precio: "$180", descripcion: "Crema de castañas, aceite de trufa" }] },
        { id: 2, nombre: "SIGNATURE", platillos: [{ nombre: "Homard Thermidor", precio: "$520", descripcion: "Langosta entera, gratinada" }, { nombre: "Filet de Bœuf Rossini", precio: "$480", descripcion: "Foie gras, salsa perigueux" }] },
        { id: 3, nombre: "CAVE À VIN", platillos: [{ nombre: "Champagne Reserve (copa)", precio: "$220", descripcion: "Maison prestigiosa" }] },
      ],
    },
  },
  {
    id: 39, nombre: "Pâtisserie Étoile", categoria: "Postres", premium: true,
    color: "#fdf2f8", textColor: "#831843", emoji: "🌟", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 48, subtitulo: "HAUTE PÂTISSERIE",
      fondoActivo: { nombre: "Rosa Champán", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)", texto: "#831843", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "ENTREMETS", platillos: [{ nombre: "Ópera de Chocolate Valrhona", precio: "$135", descripcion: "7 capas, ganache de café" }, { nombre: "Saint-Honoré de Frambuesa", precio: "$145", descripcion: "Crema chiboust, hojaldre" }] },
        { id: 2, nombre: "MACARONS DE AUTOR", platillos: [{ nombre: "Selección de Macarons (6)", precio: "$120", descripcion: "Sabores de temporada" }] },
      ],
    },
  },
  {
    id: 40, nombre: "Riserva del Chianti", categoria: "Italiano", premium: true,
    color: "#3d0c11", textColor: "#f5e6d3", emoji: "🍾", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "CANTINA & CUCINA D'AUTORE",
      fondoActivo: { nombre: "Chianti", bg: "linear-gradient(135deg, #3d0c11, #5a1a1f)", texto: "#f5e6d3", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI RISERVA", platillos: [{ nombre: "Tagliere di Salumi Riserva", precio: "$260", descripcion: "Prosciutto 36 meses, culatello" }] },
        { id: 2, nombre: "PRIMI D'AUTORE", platillos: [{ nombre: "Tagliolini al Tartufo Nero", precio: "$310", descripcion: "Trufa negra rallada en mesa" }, { nombre: "Risotto Barolo", precio: "$275", descripcion: "Reducción de vino Barolo" }] },
      ],
    },
  },
  {
    id: 41, nombre: "Neon Noir Lounge", categoria: "Moderno", premium: true,
    color: "#0a0a12", textColor: "#e0d4ff", emoji: "🌃", popular: true,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "COCKTAIL & DINING LOUNGE",
      fondoActivo: { nombre: "Neón Violeta", bg: "linear-gradient(135deg, #0a0a12, #1a1030)", texto: "#e0d4ff", acento: "#c084fc" },
      secciones: [
        { id: 1, nombre: "RAW & COLD", platillos: [{ nombre: "Tartare de Atún Yuzu", precio: "$220", descripcion: "Aire de sésamo negro" }] },
        { id: 2, nombre: "SIGNATURE", platillos: [{ nombre: "Costillar Glaseado en Miso", precio: "$310", descripcion: "48 horas, salsa de sake" }, { nombre: "Cóctel de Autor Neón", precio: "$195", descripcion: "Humo de romero en vivo" }] },
      ],
    },
  },
  {
    id: 42, nombre: "Hacienda del Agave", categoria: "Mexicano", premium: true,
    color: "#2c1608", textColor: "#f5e0c0", emoji: "🥃", popular: true,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "COCINA DE HACIENDA",
      fondoActivo: { nombre: "Agave", bg: "linear-gradient(135deg, #2c1608, #45230d)", texto: "#f5e0c0", acento: "#c9a017" },
      secciones: [
        { id: 1, nombre: "ENTRADAS", platillos: [{ nombre: "Escamoles al Mantequilla", precio: "$210", descripcion: "Hoja santa, tortillas de maíz azul" }] },
        { id: 2, nombre: "PLATOS DE AUTOR", platillos: [{ nombre: "Mole Madre 8 Años", precio: "$260", descripcion: "Pato de rancho, 30 ingredientes" }, { nombre: "Cabrito al Pastor", precio: "$290", descripcion: "Cocción lenta en horno de tierra" }] },
        { id: 3, nombre: "DESTILADOS", platillos: [{ nombre: "Tequila Añejo (copa)", precio: "$185", descripcion: "Reserva especial de la casa" }] },
      ],
    },
  },
  {
    id: 43, nombre: "Edo Omakase Privé", categoria: "Japonés", premium: true,
    color: "#050505", textColor: "#e8d5b0", emoji: "🎋", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 48, subtitulo: "PRIVATE OMAKASE COUNTER",
      fondoActivo: { nombre: "Onix", bg: "linear-gradient(135deg, #050505, #141414)", texto: "#f5f0e0", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "OTSUKURI", platillos: [{ nombre: "Sashimi de Temporada", precio: "$350", descripcion: "Importación diaria de Toyosu" }] },
        { id: 2, nombre: "EDOMAE NIGIRI", platillos: [{ nombre: "Omakase 15 Piezas", precio: "$780", descripcion: "Selección exclusiva del chef" }] },
        { id: 3, nombre: "WAGYU COURSE", platillos: [{ nombre: "A5 Miyazaki Teppan", precio: "$450", descripcion: "Flameado en mesa" }] },
      ],
    },
  },
  {
    id: 44, nombre: "Cafetería Gran Reserva", categoria: "Cafetería", premium: true,
    color: "#2a1c14", textColor: "#f0dfc4", emoji: "☕", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 44, subtitulo: "CAFÉ DE ALTURA GRAN RESERVA",
      fondoActivo: { nombre: "Café Tostado", bg: "linear-gradient(135deg, #2a1c14, #3f2a1d)", texto: "#f0dfc4", acento: "#c9a017" },
      secciones: [
        { id: 1, nombre: "CAFÉS DE ORIGEN", platillos: [{ nombre: "Geisha Panamá", precio: "$140", descripcion: "Notas florales, tueste ligero" }] },
        { id: 2, nombre: "MARIDAJES", platillos: [{ nombre: "Tabla de Quesos y Café", precio: "$195", descripcion: "Selección artesanal" }] },
      ],
    },
  },
  {
    id: 45, nombre: "Botánica Verde Privé", categoria: "Vegano", premium: true,
    color: "#071a0e", textColor: "#d9f7e0", emoji: "🪴", popular: false,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "PRIVATE PLANT-BASED TASTING",
      fondoActivo: { nombre: "Selva Nocturna", bg: "linear-gradient(135deg, #071a0e, #0f2e18)", texto: "#d9f7e0", acento: "#4ade80" },
      secciones: [
        { id: 1, nombre: "DEGUSTACIÓN", platillos: [{ nombre: "Tártar de Trufa y Alcachofa", precio: "$175", descripcion: "Aceite de trufa blanca" }] },
        { id: 2, nombre: "PLATO CENTRAL", platillos: [{ nombre: "Terrina de Setas Silvestres", precio: "$240", descripcion: "Jus de vino tinto reducido" }] },
        { id: 3, nombre: "CIERRE", platillos: [{ nombre: "Ganache de Cacao 85% Crudo", precio: "$115", descripcion: "Sin refinar, sal de mar" }] },
      ],
    },
  },
  {
    id: 46, nombre: "Food Truck Callejero", categoria: "Restaurante",
    color: "#fef2e0", textColor: "#7c2d12", emoji: "🚚", popular: false,
    config: {
      fuenteActiva: "Oswald", tamaño: 46, subtitulo: "STREET FOOD",
      fondoActivo: { nombre: "Amarillo Taxi", bg: "linear-gradient(135deg, #fefce8, #fef08a)", texto: "#422006", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "BURGERS", platillos: [{ nombre: "Smash Burger Doble", precio: "$135", descripcion: "Queso cheddar, cebolla caramelizada" }, { nombre: "Burger BBQ", precio: "$145", descripcion: "Tocino, aro de cebolla, salsa BBQ" }] },
        { id: 2, nombre: "PARA ACOMPAÑAR", platillos: [{ nombre: "Papas Curly", precio: "$65", descripcion: "Con salsa de la casa" }] },
      ],
    },
  },
  {
    id: 47, nombre: "Panadería del Pueblo", categoria: "Cafetería",
    color: "#fbf3e6", textColor: "#5c3d11", emoji: "🍞", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 44, subtitulo: "PAN DE MASA MADRE",
      fondoActivo: { nombre: "Harina", bg: "linear-gradient(135deg, #fdf6ec, #f3e6d0)", texto: "#5c3d11", acento: "#a0522d" },
      secciones: [
        { id: 1, nombre: "PANES", platillos: [{ nombre: "Hogaza de Centeno", precio: "$85", descripcion: "Fermentación 24 horas" }, { nombre: "Baguette Tradicional", precio: "$45", descripcion: "Corteza crujiente" }] },
        { id: 2, nombre: "DESAYUNOS", platillos: [{ nombre: "Tostada de Aguacate", precio: "$75", descripcion: "Con huevo pochado" }] },
      ],
    },
  },
  {
    id: 48, nombre: "Gelatería Italiana", categoria: "Postres",
    color: "#fff5f7", textColor: "#9d174d", emoji: "🍨", popular: true,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 50, subtitulo: "GELATO ARTIGIANALE",
      fondoActivo: { nombre: "Pistacchio", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#65a30d" },
      secciones: [
        { id: 1, nombre: "GELATOS", platillos: [{ nombre: "Pistacchio di Bronte", precio: "$65", descripcion: "Pistache siciliano" }, { nombre: "Stracciatella", precio: "$60", descripcion: "Chocolate en escamas" }] },
        { id: 2, nombre: "COPPE", platillos: [{ nombre: "Affogato al Caffè", precio: "$75", descripcion: "Espresso caliente sobre gelato" }] },
      ],
    },
  },
  {
    id: 49, nombre: "Osteria Toscana", categoria: "Italiano",
    color: "#f5efe0", textColor: "#4a3319", emoji: "🫒", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "OSTERIA DI CAMPAGNA",
      fondoActivo: { nombre: "Oliva", bg: "linear-gradient(135deg, #f5f5dc, #e8e4c9)", texto: "#3f3b1c", acento: "#6b7c32" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI", platillos: [{ nombre: "Panzanella Toscana", precio: "$95", descripcion: "Pan rústico, tomate, albahaca" }] },
        { id: 2, nombre: "SECONDI", platillos: [{ nombre: "Bistecca alla Fiorentina", precio: "$450", descripcion: "Para dos, a la brasa" }, { nombre: "Pollo al Mattone", precio: "$185", descripcion: "Marinado en hierbas toscanas" }] },
      ],
    },
  },
  {
    id: 50, nombre: "Estudio Nórdico", categoria: "Moderno",
    color: "#f4f6f7", textColor: "#1f2937", emoji: "🧊", popular: false,
    config: {
      fuenteActiva: "Raleway", tamaño: 42, subtitulo: "NEW NORDIC KITCHEN",
      fondoActivo: { nombre: "Nieve", bg: "linear-gradient(135deg, #f8fafc, #e2e8f0)", texto: "#1e293b", acento: "#0ea5e9" },
      secciones: [
        { id: 1, nombre: "FRÍO", platillos: [{ nombre: "Salmón Curado en Eneldo", precio: "$155", descripcion: "Mostaza dulce, pan de centeno" }] },
        { id: 2, nombre: "PRINCIPAL", platillos: [{ nombre: "Bacalao a Baja Temperatura", precio: "$220", descripcion: "Puré de apionabo, mantequilla ahumada" }] },
      ],
    },
  },
  {
    id: 51, nombre: "Antojitos del Mercado", categoria: "Mexicano",
    color: "#fff0e6", textColor: "#7c2d12", emoji: "🫔", popular: true,
    config: {
      fuenteActiva: "Merriweather", tamaño: 44, subtitulo: "SABOR DE MERCADO",
      fondoActivo: { nombre: "Salsa Roja", bg: "linear-gradient(135deg, #fef2f2, #fecaca)", texto: "#7f1d1d", acento: "#dc2626" },
      secciones: [
        { id: 1, nombre: "TAMALES", platillos: [{ nombre: "Tamal Verde de Pollo", precio: "$35", descripcion: "Envuelto en hoja de maíz" }, { nombre: "Tamal de Rajas", precio: "$32", descripcion: "Con queso oaxaca" }] },
        { id: 2, nombre: "ATOLES", platillos: [{ nombre: "Atole de Chocolate", precio: "$30", descripcion: "Receta tradicional" }] },
      ],
    },
  },
  {
    id: 52, nombre: "Udon & Tempura Bar", categoria: "Japonés",
    color: "#f7f5f0", textColor: "#292524", emoji: "🍤", popular: false,
    config: {
      fuenteActiva: "Josefin Sans", tamaño: 44, subtitulo: "UDON HANDMADE",
      fondoActivo: { nombre: "Arena", bg: "linear-gradient(135deg, #fafaf9, #eee9df)", texto: "#292524", acento: "#0d9488" },
      secciones: [
        { id: 1, nombre: "UDON", platillos: [{ nombre: "Kake Udon", precio: "$120", descripcion: "Caldo dashi tradicional" }, { nombre: "Curry Udon", precio: "$135", descripcion: "Curry japonés, cerdo" }] },
        { id: 2, nombre: "TEMPURA", platillos: [{ nombre: "Tempura Mixta", precio: "$145", descripcion: "Camarón y vegetales de temporada" }] },
      ],
    },
  },
  {
    id: 53, nombre: "Vegan Street Food", categoria: "Vegano",
    color: "#eefdf3", textColor: "#166534", emoji: "🌽", popular: false,
    config: {
      fuenteActiva: "Poppins", tamaño: 44, subtitulo: "PLANT STREET FOOD",
      fondoActivo: { nombre: "Lima", bg: "linear-gradient(135deg, #f7fee7, #ecfccb)", texto: "#365314", acento: "#65a30d" },
      secciones: [
        { id: 1, nombre: "TACOS & WRAPS", platillos: [{ nombre: "Tacos de Jackfruit", precio: "$110", descripcion: "Estilo pastor vegano" }] },
        { id: 2, nombre: "SNACKS", platillos: [{ nombre: "Papas Gajo con Alioli Vegano", precio: "$75", descripcion: "Ajo asado" }] },
      ],
    },
  },
  {
    id: 54, nombre: "Barra de Té Matcha", categoria: "Cafetería",
    color: "#eefaf0", textColor: "#134e2a", emoji: "🍵", popular: false,
    config: {
      fuenteActiva: "Josefin Sans", tamaño: 42, subtitulo: "MATCHA & TÉ DE ESPECIALIDAD",
      fondoActivo: { nombre: "Verde Té", bg: "linear-gradient(135deg, #f0fdf4, #d1fae5)", texto: "#134e2a", acento: "#059669" },
      secciones: [
        { id: 1, nombre: "MATCHA", platillos: [{ nombre: "Matcha Latte Clásico", precio: "$65", descripcion: "Ceremonial grade" }, { nombre: "Matcha Frappé", precio: "$75", descripcion: "Con leche de avena" }] },
        { id: 2, nombre: "REPOSTERÍA", platillos: [{ nombre: "Roll de Matcha", precio: "$55", descripcion: "Bizcocho japonés" }] },
      ],
    },
  },
  {
    id: 55, nombre: "Pizza al Taglio", categoria: "Italiano",
    color: "#fff4e6", textColor: "#7c2d12", emoji: "🍕", popular: true,
    config: {
      fuenteActiva: "Montserrat", tamaño: 46, subtitulo: "PIZZA AL TAGLIO ROMANA",
      fondoActivo: { nombre: "Masa Madre", bg: "linear-gradient(135deg, #fef3c7, #fde68a)", texto: "#78350f", acento: "#c2410c" },
      secciones: [
        { id: 1, nombre: "AL TAGLIO", platillos: [{ nombre: "Patate e Rosmarino", precio: "$65", descripcion: "Por porción" }, { nombre: "Quattro Formaggi", precio: "$75", descripcion: "Por porción" }] },
        { id: 2, nombre: "BEBIDAS", platillos: [{ nombre: "Limonata Artigianale", precio: "$45", descripcion: "Limón siciliano" }] },
      ],
    },
  },
  {
    id: 56, nombre: "Cevichería del Puerto", categoria: "Restaurante",
    color: "#eaf6fb", textColor: "#0c4a6e", emoji: "🐚", popular: false,
    config: {
      fuenteActiva: "Merriweather", tamaño: 44, subtitulo: "MARISQUERÍA DEL PUERTO",
      fondoActivo: { nombre: "Espuma de Mar", bg: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", texto: "#0c4a6e", acento: "#0284c7" },
      secciones: [
        { id: 1, nombre: "CEVICHES", platillos: [{ nombre: "Ceviche Mixto", precio: "$155", descripcion: "Pescado y camarón" }, { nombre: "Aguachile Verde", precio: "$165", descripcion: "Picante, pepino, cebolla morada" }] },
        { id: 2, nombre: "PARA COMPARTIR", platillos: [{ nombre: "Tostadas de Atún", precio: "$120", descripcion: "3 piezas" }] },
      ],
    },
  },
  {
    id: 57, nombre: "Postres Nostálgicos", categoria: "Postres",
    color: "#fef4f7", textColor: "#831843", emoji: "🍮", popular: false,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 50, subtitulo: "DULCES DE LA ABUELA",
      fondoActivo: { nombre: "Caramelo", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#c2410c" },
      secciones: [
        { id: 1, nombre: "CLÁSICOS", platillos: [{ nombre: "Flan Napolitano", precio: "$65", descripcion: "Receta familiar" }, { nombre: "Arroz con Leche", precio: "$55", descripcion: "Canela y pasas" }] },
      ],
    },
  },
  {
    id: 58, nombre: "Cantina del Sol", categoria: "Mexicano",
    color: "#fff8e6", textColor: "#78350f", emoji: "☀️", popular: false,
    config: {
      fuenteActiva: "Oswald", tamaño: 46, subtitulo: "CANTINA & PARRILLA",
      fondoActivo: { nombre: "Sol", bg: "linear-gradient(135deg, #fffbeb, #fde68a)", texto: "#78350f", acento: "#d97706" },
      secciones: [
        { id: 1, nombre: "PARRILLA", platillos: [{ nombre: "Alambre de Res", precio: "$145", descripcion: "Tocino, pimiento, queso" }] },
        { id: 2, nombre: "BEBIDAS", platillos: [{ nombre: "Michelada Clásica", precio: "$65", descripcion: "Con especias y limón" }] },
      ],
    },
  },
  {
    id: 59, nombre: "Maison Truffe Noire", categoria: "Restaurante", premium: true,
    color: "#150e0a", textColor: "#efe1c8", emoji: "🖤", popular: true,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "MAISON DE LA TRUFFE",
      fondoActivo: { nombre: "Trufa Negra", bg: "linear-gradient(135deg, #150e0a, #241a12)", texto: "#efe1c8", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "ENTRÉES", platillos: [{ nombre: "Œuf Parfait Truffé", precio: "$260", descripcion: "Huevo a baja temperatura, trufa negra" }] },
        { id: 2, nombre: "SIGNATURE", platillos: [{ nombre: "Risotto Truffe Noire", precio: "$340", descripcion: "Trufa rallada en mesa" }, { nombre: "Filet de Bœuf Truffé", precio: "$520", descripcion: "Costra de trufa, jus reducido" }] },
      ],
    },
  },
  {
    id: 60, nombre: "Kuro Sushi Lounge", categoria: "Japonés", premium: true,
    color: "#0a0a0a", textColor: "#f5d0d0", emoji: "⚫", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 46, subtitulo: "MODERN SUSHI LOUNGE",
      fondoActivo: { nombre: "Kuro", bg: "linear-gradient(135deg, #0a0a0a, #1a1a1a)", texto: "#f5f0e0", acento: "#ef4444" },
      secciones: [
        { id: 1, nombre: "SASHIMI", platillos: [{ nombre: "Sashimi Selecto 8 pzs", precio: "$280", descripcion: "Corte del día" }] },
        { id: 2, nombre: "SIGNATURE ROLLS", platillos: [{ nombre: "Kuro Dragon Roll", precio: "$220", descripcion: "Anguila, tinta de calamar, oro comestible" }] },
      ],
    },
  },
  {
    id: 61, nombre: "Enoteca Reale", categoria: "Italiano", premium: true,
    color: "#2a0e0e", textColor: "#f3e5d8", emoji: "👑", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "ENOTECA REALE",
      fondoActivo: { nombre: "Púrpura Real", bg: "linear-gradient(135deg, #2a0e0e, #3d1616)", texto: "#f3e5d8", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "ANTIPASTI REALE", platillos: [{ nombre: "Culatello di Zibello", precio: "$280", descripcion: "24 meses de curación" }] },
        { id: 2, nombre: "PRIMI", platillos: [{ nombre: "Tortellini in Brodo Reale", precio: "$260", descripcion: "Caldo de 3 carnes, 12 horas" }] },
      ],
    },
  },
  {
    id: 62, nombre: "Azotea Dorada", categoria: "Moderno", premium: true,
    color: "#1a1509", textColor: "#f5e6c8", emoji: "🌇", popular: true,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "GOLDEN ROOFTOP DINING",
      fondoActivo: { nombre: "Atardecer Dorado", bg: "linear-gradient(135deg, #1a1509, #3a2c10)", texto: "#f5e6c8", acento: "#facc15" },
      secciones: [
        { id: 1, nombre: "PARA COMPARTIR", platillos: [{ nombre: "Torre de Atún Dorado", precio: "$280", descripcion: "Hoja de oro comestible" }] },
        { id: 2, nombre: "SIGNATURE", platillos: [{ nombre: "Costillar Glaseado en Miel Dorada", precio: "$340", descripcion: "48 horas de cocción" }] },
      ],
    },
  },
  {
    id: 63, nombre: "Casa del Mezcal Añejo", categoria: "Mexicano", premium: true,
    color: "#241505", textColor: "#f0dcae", emoji: "🌵", popular: true,
    config: {
      fuenteActiva: "Cormorant Garamond", tamaño: 48, subtitulo: "MEZCALERÍA DE AUTOR",
      fondoActivo: { nombre: "Maguey", bg: "linear-gradient(135deg, #241505, #3a220a)", texto: "#f0dcae", acento: "#8a9a5b" },
      secciones: [
        { id: 1, nombre: "ENTRADAS", platillos: [{ nombre: "Chapulines con Guacamole", precio: "$150", descripcion: "Servido en molcajete" }] },
        { id: 2, nombre: "PLATOS FUERTES", platillos: [{ nombre: "Barbacoa de Borrego 12h", precio: "$260", descripcion: "Cocción en penca de maguey" }] },
        { id: 3, nombre: "MEZCALES", platillos: [{ nombre: "Flight de Mezcal (3 copas)", precio: "$220", descripcion: "Espadín, tobalá, madrecuixe" }] },
      ],
    },
  },
  {
    id: 64, nombre: "Chocolate Atelier Privé", categoria: "Postres", premium: true,
    color: "#1c1210", textColor: "#f0dfc4", emoji: "🍫", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 48, subtitulo: "CHOCOLATE ATELIER",
      fondoActivo: { nombre: "Cacao Oscuro", bg: "linear-gradient(135deg, #1c1210, #2b1c17)", texto: "#f0dfc4", acento: "#c9a648" },
      secciones: [
        { id: 1, nombre: "GRAND CRU", platillos: [{ nombre: "Esfera 85% Madagascar", precio: "$135", descripcion: "Cacao de origen único" }] },
        { id: 2, nombre: "DEGUSTACIÓN", platillos: [{ nombre: "Menú de 5 Chocolates", precio: "$320", descripcion: "Recorrido por orígenes del mundo" }] },
      ],
    },
  },
  {
    id: 65, nombre: "Café Origen Volcánico", categoria: "Cafetería", premium: true,
    color: "#231a14", textColor: "#f0dfc4", emoji: "🌋", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 44, subtitulo: "CAFÉ DE ORIGEN VOLCÁNICO",
      fondoActivo: { nombre: "Ceniza Volcánica", bg: "linear-gradient(135deg, #231a14, #362820)", texto: "#f0dfc4", acento: "#c9a017" },
      secciones: [
        { id: 1, nombre: "MICROLOTES", platillos: [{ nombre: "Volcán Panamá Geisha", precio: "$160", descripcion: "Puntaje 91, notas a jazmín" }] },
        { id: 2, nombre: "MARIDAJE", platillos: [{ nombre: "Café y Chocolate de Origen", precio: "$180", descripcion: "Experiencia guiada" }] },
      ],
    },
  },
  {
    id: 66, nombre: "Jardín Zen Vegano", categoria: "Vegano", premium: true,
    color: "#0c1f14", textColor: "#e2f5e6", emoji: "🎍", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "ZEN PLANT KAISEKI",
      fondoActivo: { nombre: "Bambú Nocturno", bg: "linear-gradient(135deg, #0c1f14, #163524)", texto: "#e2f5e6", acento: "#4ade80" },
      secciones: [
        { id: 1, nombre: "ZENSAI VEGETAL", platillos: [{ nombre: "Tofu Yuba con Trufa", precio: "$160", descripcion: "Piel de tofu artesanal" }] },
        { id: 2, nombre: "PRINCIPAL", platillos: [{ nombre: "Berenjena Miso a la Leña", precio: "$210", descripcion: "Glaseado dulce de miso" }] },
      ],
    },
  },
  {
    id: 67, nombre: "Costa Brava Gourmet", categoria: "Restaurante", premium: true,
    color: "#062430", textColor: "#e0f4fa", emoji: "⛵", popular: true,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "COCINA DE LA COSTA BRAVA",
      fondoActivo: { nombre: "Azul Mediterráneo", bg: "linear-gradient(135deg, #062430, #0b3b4a)", texto: "#e0f4fa", acento: "#38bdf8" },
      secciones: [
        { id: 1, nombre: "DEL MAR", platillos: [{ nombre: "Gambas al Ajillo Reserva", precio: "$220", descripcion: "Gambas rojas de Palamós" }] },
        { id: 2, nombre: "ARROCES", platillos: [{ nombre: "Arroz Negro con Sepia", precio: "$260", descripcion: "Alioli de azafrán" }] },
      ],
    },
  },
  {
    id: 68, nombre: "Ryotei Privado", categoria: "Japonés", premium: true,
    color: "#08100c", textColor: "#e8e0c8", emoji: "🏮", popular: true,
    config: {
      fuenteActiva: "Cinzel", tamaño: 48, subtitulo: "RYOTEI TRADICIONAL PRIVADO",
      fondoActivo: { nombre: "Bosque Nocturno", bg: "linear-gradient(135deg, #08100c, #14241a)", texto: "#e8e0c8", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "KAISEKI", platillos: [{ nombre: "Menú Kaiseki 9 Tiempos", precio: "$890", descripcion: "Experiencia completa de temporada" }] },
        { id: 2, nombre: "SAKE", platillos: [{ nombre: "Sake Junmai Daiginjo", precio: "$240", descripcion: "Botella premium" }] },
      ],
    },
  },
  {
    id: 69, nombre: "Vino & Trufa Riserva", categoria: "Italiano", premium: true,
    color: "#2e0a05", textColor: "#f3e5d8", emoji: "🍄", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "VINO E TARTUFO RISERVA",
      fondoActivo: { nombre: "Ámbar Toscano", bg: "linear-gradient(135deg, #2e0a05, #451208)", texto: "#f3e5d8", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "TARTUFO", platillos: [{ nombre: "Uovo al Tartufo Bianco", precio: "$260", descripcion: "Trufa blanca en temporada" }] },
        { id: 2, nombre: "CANTINA RISERVA", platillos: [{ nombre: "Brunello di Montalcino (copa)", precio: "$280", descripcion: "Añada reserva" }] },
      ],
    },
  },
  {
    id: 70, nombre: "Loft Dorado Nocturno", categoria: "Moderno", premium: true,
    color: "#100a05", textColor: "#f0dfb8", emoji: "🥇", popular: false,
    config: {
      fuenteActiva: "Marcellus", tamaño: 46, subtitulo: "GOLDEN NIGHT DINING",
      fondoActivo: { nombre: "Oro Nocturno", bg: "linear-gradient(135deg, #100a05, #241a0c)", texto: "#f0dfb8", acento: "#d4af37" },
      secciones: [
        { id: 1, nombre: "SIGNATURE", platillos: [{ nombre: "Tomahawk Dorado 900g", precio: "$780", descripcion: "Costra de oro comestible" }] },
        { id: 2, nombre: "MIXOLOGY", platillos: [{ nombre: "Cóctel Oro Líquido", precio: "$210", descripcion: "Con hoja de oro" }] },
      ],
    },
  },
];

const navItems = [
  { icon: "⊞", label: "Inicio", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: <IconEdit />, label: "Mis Diseños", href: "#" },
  { icon: <IconImage />, label: "Medios", href: "#" },
  { icon: <IconTrash />, label: "Papelera", href: "/papelera" },
  { icon: <IconBuilding />, label: "Mi Negocio", href: "/mi-negocio" },
  { icon: <IconCard />, label: "Facturación", href: "/planes" },
  { icon: <IconSettings />, label: "Configuración", href: "/configuracion" },
];

type Plantilla = typeof plantillas[number] & { premium?: boolean };

export default function Plantillas() {
  const [activeNav] = useState("Plantillas");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [preview, setPreview] = useState<Plantilla | null>(null);

  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("favoritos_plantillas") || "[]"); } catch { return []; }
  });
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 12;

  // Plan real del usuario, consultado directo al backend (no localStorage viejo,
  // que podía quedar desactualizado si el admin activaba el plan sin que el
  // usuario volviera a iniciar sesión).
  const [planUsuario, setPlanUsuario] = useState<string>("Free");
  const [cargandoPlan, setCargandoPlan] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargandoPlan(false);
      return;
    }
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPlanUsuario(data.usuario.plan);
      })
      .finally(() => setCargandoPlan(false));
  }, []);

  useEffect(() => {
    try {
      const yaRespondio = localStorage.getItem("preferencia_plantillas");
      if (!yaRespondio) {
        const t = setTimeout(() => setMostrarEncuesta(true), 600);
        return () => clearTimeout(t);
      }
      const datos = JSON.parse(yaRespondio);
      if (datos.negocio) setNegocioElegido(datos.negocio);
      if (datos.preferencia) setPreferenciaElegida(datos.preferencia);
    } catch {}
  }, []);

  const tienePlanPremium = planUsuario === "Plus" || planUsuario === "Premium";

  const NEGOCIOS_ENCUESTA = ["Restaurante", "Cafetería", "Postres", "Italiano", "Mexicano", "Japonés", "Vegano", "Moderno"];
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [pasoEncuesta, setPasoEncuesta] = useState<1 | 2>(1);
  const [negocioElegido, setNegocioElegido] = useState<string | null>(null);
  const [preferenciaElegida, setPreferenciaElegida] = useState<"Premium" | "Gratuitas" | "Ambas" | null>(null);

  const guardarPreferencia = (negocio: string, preferencia: "Premium" | "Gratuitas" | "Ambas") => {
    const datos = { negocio, preferencia, fecha: new Date().toISOString() };
    try {
      localStorage.setItem("preferencia_plantillas", JSON.stringify(datos));
    } catch {}

    const token = localStorage.getItem("token");
    fetch(`${API}/api/preferencias-plantillas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(datos),
    }).catch(() => {});

    setNegocioElegido(negocio);
    setPreferenciaElegida(preferencia);
    if (NEGOCIOS_ENCUESTA.includes(negocio)) setCategoriaActiva(negocio);
    setMostrarEncuesta(false);
  };

  const toggleFavorito = (id: number) => {
    setFavoritos(prev => {
      const nuevo = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("favoritos_plantillas", JSON.stringify(nuevo));
      return nuevo;
    });
  };

  const plantillasFiltradas = plantillas
    .filter((p) => {
      if (categoriaActiva === "Favoritos") return favoritos.includes(p.id);
      const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
      const q = busqueda.toLowerCase();
      const coincideBusqueda = p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (preferenciaElegida === "Premium") return (b.premium ? 1 : 0) - (a.premium ? 1 : 0);
      if (preferenciaElegida === "Gratuitas") return (a.premium ? 1 : 0) - (b.premium ? 1 : 0);
      return 0;
    });

  const totalPaginas = Math.ceil(plantillasFiltradas.length / POR_PAGINA);
  const plantillasPagina = plantillasFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const usarPlantilla = (p: Plantilla) => {
    if (p.premium && !tienePlanPremium) {
      alert("Esta plantilla es exclusiva para planes Plus o Premium. Actualiza tu plan para usarla.");
      return;
    }
    localStorage.setItem("plantilla_cargada", JSON.stringify(p.config));
    window.location.href = "/editor";
};

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>
      <button className="hamburger-btn" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}

      {/* SIDEBAR */}
      <aside className={`app-sidebar ${menuAbierto ? "abierto" : ""}`} style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
        top: 0, left: 0,
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
            <span><IconLogout /></span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="app-main" style={{ marginLeft: "clamp(0px, 220px, 220px)", flex: 1, padding: "clamp(16px, 4vw, 32px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Plantillas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Elige una plantilla para empezar tu menú</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setPasoEncuesta(1); setMostrarEncuesta(true); }}
              title="Editar tus preferencias"
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 14px", color: "#a855f7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              🎯 {negocioElegido ? `Para ti: ${negocioElegido}` : "Personalizar"}
            </button>
            <input
              type="text" placeholder="🔍 Buscar plantillas..."
              value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: 220 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button key={cat} onClick={() => { setCategoriaActiva(cat); setPagina(1); }} style={{
              background: categoriaActiva === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: categoriaActiva === cat ? "none" : "1px solid #2a2a35",
              borderRadius: 20, padding: "8px 18px",
              color: categoriaActiva === cat ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: categoriaActiva === cat ? 600 : 400,
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {plantillasPagina.map((p) => (
            <div key={p.id} className={p.premium ? "plantilla-card-premium" : undefined} style={{ position: "relative" }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
            >
              {p.popular && (
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 20, padding: "3px 10px", color: "white", fontSize: 10, fontWeight: 700 }}>⭐ Popular</div>
              )}
              {p.premium && (
                <div style={{ position: "absolute", top: p.popular ? 34 : 10, right: 10, zIndex: 2, background: !tienePlanPremium ? "rgba(0,0,0,0.65)" : "linear-gradient(135deg, #facc15, #ca8a04)", borderRadius: 20, padding: "3px 10px", color: !tienePlanPremium ? "#facc15" : "#1a1a1a", fontSize: 10, fontWeight: 700, border: !tienePlanPremium ? "1px solid #facc15" : "none" }}>
                  {!tienePlanPremium ? "🔒 Premium" : "✨ Premium"}
                </div>
              )}
              <div style={{ background: p.color, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a35", cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
                <button
                  onClick={e => { e.stopPropagation(); toggleFavorito(p.id); }}
                  style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 15, lineHeight: "28px" }}
                  title={favoritos.includes(p.id) ? "Quitar favorito" : "Agregar favorito"}
                >
                  {favoritos.includes(p.id) ? "❤️" : "🤍"}
                </button>
                <div style={{ fontSize: 48 }}>{p.emoji}</div>
                <div style={{ fontFamily: p.config.fuenteActiva + ", serif", fontWeight: 700, fontSize: 14, color: p.textColor, textAlign: "center", padding: "0 8px" }}>MENÚ</div>
                <div style={{ color: p.textColor, opacity: 0.6, fontSize: 10, textAlign: "center", padding: "0 12px" }}>
                  {p.config.secciones.map(s => s.nombre).slice(0, 3).join(" · ")}
                </div>

                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 12px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)", textAlign: "left" }}>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{p.nombre}</div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 2 }}>{p.categoria}</div>
                </div>

                <div className="overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s", borderRadius: 12 }}>
                  <button
                    onClick={() => usarPlantilla(p)}
                    style={{ background: (p.premium && !tienePlanPremium) ? "#3a3a45" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: (p.premium && !tienePlanPremium) ? "1px solid #facc15" : "none", borderRadius: 8, padding: "10px 20px", color: (p.premium && !tienePlanPremium) ? "#facc15" : "white", fontWeight: 600, fontSize: 13, cursor: "pointer", width: 140 }}
                  >{(p.premium && !tienePlanPremium) ? "🔒 Actualizar plan" : "✓ Usar plantilla"}</button>
                  <button
                    onClick={() => setPreview(p)}
                    style={{ background: "transparent", border: "1px solid #ffffff44", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, cursor: "pointer", width: 140 }}
                  >👁 Vista previa</button>
                </div>
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
      {totalPaginas > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 16px", color: pagina === 1 ? "#444" : "white", cursor: pagina === 1 ? "default" : "pointer" }}>← Anterior</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPagina(n)}
                style={{ background: pagina === n ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 14px", color: "white", cursor: "pointer", fontWeight: pagina === n ? 700 : 400 }}>{n}</button>
            ))}
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
              style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "8px 16px", color: pagina === totalPaginas ? "#444" : "white", cursor: pagina === totalPaginas ? "default" : "pointer" }}>Siguiente →</button>
          </div>
        )}
      </main>

      {/* MODAL ENCUESTA DE PREFERENCIAS */}
      {mostrarEncuesta && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: 16, padding: "32px 28px", width: 380, maxWidth: "90vw", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
            <button
              onClick={() => setMostrarEncuesta(false)}
              style={{ float: "right", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 16 }}
            >✕</button>

            {pasoEncuesta === 1 && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>¿Qué tipo de negocio tienes?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Así te mostramos primero las plantillas que más te pueden gustar.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {NEGOCIOS_ENCUESTA.map((neg) => (
                    <button
                      key={neg}
                      onClick={() => { setNegocioElegido(neg); setPasoEncuesta(2); }}
                      style={{
                        background: negocioElegido === neg ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#1e1e28",
                        border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 8px",
                        color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {neg}
                    </button>
                  ))}
                </div>
              </>
            )}

            {pasoEncuesta === 2 && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>¿Qué te gustaría ver primero?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Puedes cambiarlo cuando quieras desde los filtros.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {([
                    ["Premium", "✨ Plantillas premium primero"],
                    ["Gratuitas", "🆓 Plantillas gratuitas primero"],
                    ["Ambas", "🔀 Mostrarme de todo, sin orden fijo"],
                  ] as const).map(([valor, texto]) => (
                    <button
                      key={valor}
                      onClick={() => guardarPreferencia(negocioElegido || "Todas", valor)}
                      style={{
                        background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
                        padding: "12px 14px", color: "white", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", textAlign: "left",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPasoEncuesta(1)}
                  style={{ marginTop: 14, background: "transparent", border: "none", color: "#666", fontSize: 12, cursor: "pointer" }}
                >← Volver</button>
              </>
            )}
          </div>
        </div>
      )}

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
              <button onClick={() => usarPlantilla(preview)} style={{ flex: 1, background: (preview.premium && !tienePlanPremium) ? "#3a3a45" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: (preview.premium && !tienePlanPremium) ? "1px solid #facc15" : "none", borderRadius: 8, padding: "10px", color: (preview.premium && !tienePlanPremium) ? "#facc15" : "white", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>{(preview.premium && !tienePlanPremium) ? "🔒 Actualizar plan" : "✓ Usar esta"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}