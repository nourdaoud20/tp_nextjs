import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const encodedKey = new TextEncoder().encode(secret);
        await jwtVerify(sessionCookie, encodedKey, {
          algorithms: ["HS256"],
        });
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Protection de la page privée : si non connecté -> vers /login
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Redirection des pages publiques : si déjà connecté -> vers /dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configuration du filtre de routes pour éviter d'exécuter le middleware sur les fichiers statiques
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};