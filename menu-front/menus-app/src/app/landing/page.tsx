import backgroundImage from "../../assets/img1.png"

export default function Landing() {
    const bgUrl = typeof backgroundImage === "string" ? backgroundImage : backgroundImage.src

    return (
        <div className="relative text-slate-900">
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${bgUrl})` }}
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                        <div className="text-lg font-semibold tracking-tight">Logo</div>
                        <nav>
                            <ul className="flex items-center gap-8 text-sm font-medium text-slate-700">
                                <li>
                                    <a href="#inicio" className="transition-colors duration-200 hover:text-slate-900">
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <a href="#nosotros" className="transition-colors duration-200 hover:text-slate-900">
                                        Nosotros
                                    </a>
                                </li>
                                <li>
                                    <a href="#contacto" className="transition-colors duration-200 hover:text-slate-900">
                                        Contacto
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>

                <main>
                    <section id="inicio" className="relative min-h-screen flex items-center justify-center px-6 py-24 text-center">
                        <div className="mx-auto max-w-3xl text-white">
                            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/75">Transforma tu menú</p>
                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Eres un restaurante?</h1>
                            <p className="mt-6 text-lg leading-8 text-white/90">
                                Tienes problemas con tus menús? Nosotros tenemos la solución para ayudarte a vender más y mejor.
                            </p>
                            <button className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-xl transition hover:bg-slate-100">
                                Ven y compruébalo
                            </button>
                        </div>
                    </section>

                    <section id="problema" className="bg-gradient-to-b from-white/60 via-white to-white px-6 py-24">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                El problema
                            </h2>
                            <p className="mt-10 text-2xl font-semibold leading-10 text-slate-900 sm:text-3xl">
                                De acuerdo a nuestras entrevistas, muchos restaurantes no tienen buena organización de sus menús y eso confunde a sus clientes al pedir.
                            </p>
                        </div>
                    </section>

                    <section id="nosotros" className="bg-slate-100 px-6 py-24">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                La solución
                            </h2>
                            <p className="mt-10 text-lg leading-8 text-slate-700">
                                Con nuestro sistema hemos pensado en este problema e implementado herramientas para que los restaurantes ofrezcan mejor servicio y una experiencia de pedido clara y rápida.
                            </p>
                        </div>
                    </section>

                    <section id="beneficios" className="px-6 py-24">
                        <div className="mx-auto max-w-7xl">
                            <h2 className="text-center text-4xl font-bold text-slate-900 text-white">Beneficios</h2>
                            <div className="mt-12 flex flex-col gap-6 md:flex-row md:justify-between">
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-40 w-full max-w-xs rounded-3xl bg-slate-200" />
                                    <h3 className="text-xl font-semibold text-slate-900">Fácil de editar</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Organiza tu carta con sencillez y actualiza productos en segundos.</p>
                                </article>
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-40 w-full max-w-xs rounded-3xl bg-slate-200" />
                                    <h3 className="text-xl font-semibold text-slate-900">Reducción de costos</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Evita errores y mejora la gestión de tu menú con menos tiempo invertido.</p>
                                </article>
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-40 w-full max-w-xs rounded-3xl bg-slate-200" />
                                    <h3 className="text-xl font-semibold text-slate-900">Rapidez al consultar</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Tus clientes navegan el menú rápido y encuentran lo que necesitan sin confusión.</p>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section id="contacto" className="bg-slate-950 px-6 py-24 text-center text-white">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Agenda con nosotros y descubre el potencial de tu restaurante
                            </h2>
                            <button className="mt-10 inline-flex rounded-full bg-white px-10 py-5 text-lg font-semibold text-slate-950 shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition hover:bg-slate-100">
                                Agenda ahora!!
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
