"use client"

import { useEffect, useState } from "react"
import backgroundImage from "../../assets/background.png"
import img1 from "../../assets/ima1.jpg"
import img2 from "../../assets/ima2.webp"
import img3 from "../../assets/img3.png"
import img5 from "../../assets/img5.png"

export default function Landing() {
    const [hidden, setHidden] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)

    const bgUrl = typeof backgroundImage === "string" ? backgroundImage : backgroundImage.src
    const img1Url = typeof img1 === "string" ? img1 : img1.src
    const img2Url = typeof img2 === "string" ? img2 : img2.src
    const img3Url = typeof img3 === "string" ? img3 : img3.src
    const img5Url = typeof img5 === "string" ? img5 : img5.src

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY
            if (currentY > lastScrollY && currentY > 80) {
                setHidden(true)
            } else {
                setHidden(false)
            }
            setLastScrollY(currentY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    return (
        <div className="relative text-slate-900">
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${bgUrl})` }}
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10">
                <header className={`sticky top-0 z-20 transform border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-sm transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                        <div className="text-lg font-semibold tracking-tight">Mexxican MX</div>
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
                    <section id="inicio" className="relative min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-24 text-center">
                        <div className="mx-auto max-w-3xl text-white">
                            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/75">Transforma tu menú</p>
                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Eres un restaurante?</h1>
                            <p className="mt-6 text-lg leading-8 text-white/100">
                                Tienes problemas con tus menús? Nosotros tenemos la solución para ayudarte a vender más y mejor.
                            </p>
                            <a
                                href="https://forms.gle/C3Q6AQFBWRTFv3nw7"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-slate-100 btn-motion"
                            >
                                AGENDA YA!!
                            </a>
                        </div>
                    </section>

                    <section id="problema" className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-b from-white/60 via-white to-white px-6 py-24 text-center">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                Problemática
                            </h2>
                            <p className="mt-10 text-2xl font-500 leading-10 text-slate-900 sm:text-3xl text-justify">
                               Muchos restaurantes presentan una organización deficiente en sus menús, lo que genera confusión entre los clientes al realizar pedidos. A esto se suma que la actualización de los menús suele hacerse de manera manual y poco frecuente, provocando que los precios publicados no coincidan con los vigentes, especialmente cuando hay cambios mensuales o durante eventos especiales. Esta falta de orden y actualización ocasiona errores en los pedidos y afecta directamente la experiencia del cliente.</p>
                        </div>
                    </section>

                    <section id="nosotros" className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-white px-6 py-20">
                        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                            <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
                                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                    La solución
                                </h2>
                                <p className="mt-10 text-lg leading-8 text-slate-700">
                                    Con nuestro sistema hemos pensado en este problema e implementado herramientas para que los restaurantes ofrezcan mejor servicio y una experiencia de pedido clara y rápida.
                                </p>
                            </div>
                            <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] bg-slate-200 shadow-lg lg:mx-0 lg:max-w-[520px]">
                                <img src={img5Url} alt="Solución restaurante" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </section>

                    <section id="beneficios" className="min-h-[calc(100vh-72px)] px-6 py-24">
                        <div className="mx-auto max-w-7xl">
                            <h2 className="text-center text-4xl font-bold text-slate-900 text-white">Beneficios</h2>
                            <div className="mt-12 flex flex-col gap-6 md:flex-row md:justify-between">
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-40 w-full max-w-xs overflow-hidden rounded-3xl bg-slate-200">
                                        <img src={img1Url} alt="Fácil de editar" className="h-full w-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900">Fácil de editar</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Organiza tu carta con sencillez y actualiza productos en segundos.</p>
                                </article>
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-40 w-full max-w-xs overflow-hidden rounded-3xl bg-slate-200">
                                        <img src={img2Url} alt="Reducción de costos" className="h-full w-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900">Reducción de costos</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Evita errores y mejora la gestión de tu menú con menos tiempo invertido.</p>
                                </article>
                                <article className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-6 h-36 w-full max-w-[260px] overflow-hidden rounded-3xl bg-slate-200">
                                        <img src={img3Url} alt="Rapidez al consultar" className="h-full w-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900">Rapidez al consultar</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Tus clientes navegan el menú rápido y encuentran lo que necesitan sin confusión.</p>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section id="contacto" className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-950 px-6 py-24 text-center text-white">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Agenda con nosotros y descubre el potencial de tu restaurante
                            </h2>
                            <a
                                href="https://forms.gle/C3Q6AQFBWRTFv3nw7"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-10 inline-flex rounded-full bg-white px-10 py-5 text-lg font-semibold text-slate-950 shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition-colors transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-slate-950 hover:text-white btn-contact"
                            >
                                Agenda ahora!!
                            </a>
                        </div>
                    </section>
                </main>

                <footer className="bg-black px-6 py-12 text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between md:items-start">
                        <div className="max-w-xl">
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                Construimos soluciones para restaurantes que buscan mejorar la experiencia de pedido y mostrar su carta de forma clara y moderna.
                            </p>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Enlaces</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                    <li><a href="#inicio" className="transition-colors duration-200 hover:text-white">Inicio</a></li>
                                    <li><a href="#problema" className="transition-colors duration-200 hover:text-white">Problema</a></li>
                                    <li><a href="#nosotros" className="transition-colors duration-200 hover:text-white">Solución</a></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contacto</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                    <li>info@turestaurante.com</li>
                                    
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
