import Link from "next/link";
 
export default function LandingPage() {
  return (
    <main className="font-sans bg-[#F4F4F8] text-[#0F0D1A] min-h-screen">
      {/* ─── NAV ─── */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#0F0D1A] sticky top-0 z-50">
        <span className="font-extrabold text-xl tracking-tight text-white font-display">
          Menu<span className="text-[#7C3AED]">Master</span>
        </span>
        <a
          href="#cta"
          className="bg-[#7C3AED] text-white text-sm font-medium px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Comenzar gratis
        </a>
      </nav>
 
      {/* ─── HERO ─── */}
      <section className="bg-[#0F0D1A] px-6 py-24 text-center relative overflow-hidden">
        {/* Glow decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/10 blur-3xl pointer-events-none" />
 
        <span className="inline-block bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-medium px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          🍽 Para restaurantes y emprendedores
        </span>
 
        <h1 className="font-extrabold text-4xl md:text-6xl text-white leading-none tracking-tight max-w-2xl mx-auto mb-5">
          Tu menú digital,{" "}
          <em className="text-[#7C3AED] not-italic">siempre actualizado.</em>{" "}
          Sin complicaciones.
        </h1>
 
        <p className="text-[#9CA3AF] text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          Deja de perder tiempo y dinero actualizando tu menú manualmente.
          MenuMaster lo hace por ti, en segundos.
        </p>
 
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="#cta"
            className="bg-[#7C3AED] text-white font-medium px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Quiero mi menú digital →
          </a>
          <a
            href="#solucion"
            className="border border-white/20 text-white font-medium px-7 py-3 rounded-full hover:border-white/50 transition-colors"
          >
            ¿Cómo funciona?
          </a>
        </div>
      </section>
 
      {/* ─── PROBLEMA ─── */}
      <section id="problema" className="bg-white px-6 py-20 text-center">
        <p className="text-[#7C3AED] text-xs font-medium uppercase tracking-widest mb-2">
          El problema
        </p>
        <h2 className="font-bold text-2xl md:text-4xl text-[#0F0D1A] tracking-tight mb-12">
          ¿Te suena familiar?
        </h2>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {[
            {
              icon: "⏱",
              title: "Actualizaciones lentas",
              desc: "Cambiar precios o platillos toma horas. Mientras tanto, tu cliente ve info desactualizada.",
            },
            {
              icon: "💸",
              title: "Reimpresiones costosas",
              desc: "Cada cambio en el menú físico significa más dinero en impresión. Una y otra vez.",
            },
            {
              icon: "😤",
              title: "Gestión caótica",
              desc: "Sin un panel centralizado, los cambios se pierden, se duplican o simplemente no llegan.",
            },
            {
              icon: "📵",
              title: "Sin presencia digital",
              desc: "Tus clientes buscan opciones en su cel y tú no apareces. Pierdes ventas sin saberlo.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#F4F4F8] border border-[#E2E0F0] rounded-2xl p-5 text-left"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm text-[#0F0D1A] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ─── SOLUCIÓN ─── */}
      <section id="solucion" className="bg-[#0F0D1A] px-6 py-20 text-center">
        <p className="text-[#7C3AED] text-xs font-medium uppercase tracking-widest mb-2">
          La solución
        </p>
        <h2 className="font-bold text-2xl md:text-4xl text-white tracking-tight mb-12">
          Así funciona MenuMaster
        </h2>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            {
              num: "01",
              title: "Crea tu menú",
              desc: "Agrega platillos, precios, fotos y categorías desde un panel simple e intuitivo.",
            },
            {
              num: "02",
              title: "Personaliza al instante",
              desc: "Cambia disponibilidad, precios o descripciones en segundos. Sin rediseño, sin impresión.",
            },
            {
              num: "03",
              title: "Comparte con un link",
              desc: "Tus clientes escanean un QR o entran a tu link y ven el menú actualizado en tiempo real.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white/5 border border-white/8 rounded-2xl p-6 text-left"
            >
              <div className="font-extrabold text-4xl text-[#7C3AED] leading-none mb-3">
                {item.num}
              </div>
              <h3 className="font-bold text-sm text-white mb-1">{item.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ─── BENEFICIOS ─── */}
      <section id="beneficios" className="bg-[#F4F4F8] px-6 py-20 text-center">
        <p className="text-[#7C3AED] text-xs font-medium uppercase tracking-widest mb-2">
          Lo que ganas
        </p>
        <h2 className="font-bold text-2xl md:text-4xl text-[#0F0D1A] tracking-tight mb-12">
          Resultados reales para tu negocio
        </h2>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            {
              badge: "Velocidad",
              title: "Cambios en segundos",
              desc: "Actualiza tu menú desde el cel o computadora. Sin esperar, sin intermediarios.",
            },
            {
              badge: "Ahorro",
              title: "Cero costos de impresión",
              desc: "Tu menú vive en la nube. Olvídate de la imprenta cada que cambia un precio.",
            },
            {
              badge: "Presencia",
              title: "Visible desde el celular",
              desc: "Menú responsive que tus clientes pueden ver desde cualquier dispositivo, en cualquier momento.",
            },
            {
              badge: "Control",
              title: "Todo en un solo lugar",
              desc: "Panel centralizado para gestionar platillos, disponibilidad, precios y categorías.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E2E0F0] rounded-2xl p-5 text-left"
            >
              <span className="inline-block bg-[#EDE9FD] text-[#7C3AED] text-xs font-medium px-3 py-1 rounded-full mb-3">
                {item.badge}
              </span>
              <h3 className="font-bold text-sm text-[#0F0D1A] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ─── CTA ─── */}
      <section id="cta" className="bg-[#7C3AED] px-6 py-24 text-center">
        <h2 className="font-extrabold text-3xl md:text-5xl text-white tracking-tight max-w-lg mx-auto mb-4 leading-tight">
          ¿Listo para digitalizar tu restaurante?
        </h2>
        <p className="text-white/80 text-base max-w-sm mx-auto mb-8">
          Únete a los primeros en probar MenuMaster. Gratis durante el lanzamiento.
        </p>
 
        {/*
          Opciones de CTA — elige UNA y elimina las demás:
          1. Google Form → href="https://forms.gle/TU_FORM_ID"
          2. WhatsApp   → href="https://wa.me/521XXXXXXXXXX?text=Hola!%20Quiero%20probar%20MenuMaster"
          3. Login      → usar <Link href="/login"> en lugar de <a>
        */}
        <a
          href="https://wa.me/5212381641413?text=Hola!%20Quiero%20probar%20MenuMaster"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-[#7C3AED] font-medium text-base px-8 py-3.5 rounded-full hover:scale-105 transition-transform"
        >
          Quiero acceso anticipado →
        </a>
      </section>
 
      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0F0D1A] px-6 py-5 text-center">
        <p className="text-[#3B3654] text-xs">
          © 2025 MenuMaster · Hecho para restaurantes mexicanos
        </p>
      </footer>
    </main>
  );
}