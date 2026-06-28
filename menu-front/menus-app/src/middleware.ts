import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rutasProtegidas = ["/", "/mis-menus", "/plantillas", "/editor", "/mi-negocio", "/planes", "/configuracion", "/analiticas"];

export function middleware(request: NextRequest) {
  const usuario = request.cookies.get("usuario");
  const estaEnLogin = request.nextUrl.pathname === "/login";

  if (!usuario && !estaEnLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (usuario && estaEnLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/mis-menus", "/plantillas", "/editor", "/mi-negocio", "/planes", "/configuracion", "/analiticas", "/login"],
};