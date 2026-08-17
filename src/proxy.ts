import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings", "/portfolios", "/editor"];
const GUEST_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

/**
 * Optimistic route protection. The JWT itself is verified server-side by the
 * API middleware and the client AuthGuard; this only performs a cheap cookie
 * presence check to avoid render flicker and redirect loops.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  const isProtected = PROTECTED_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isGuest = GUEST_PATHS.some((path) => pathname === path);

  if (isProtected && !hasAuthCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isGuest && hasAuthCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/portfolios/:path*",
    "/editor/:path*",
  ],
};
