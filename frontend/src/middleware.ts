import { NextResponse, type NextRequest } from "next/server";

import { canAccessPage, protectedRouteRules } from "@/lib/auth/rbac";
import { AUTH_COOKIE, parseSessionCookie } from "@/lib/auth/session";

const publicPaths = new Set([
  "/",
  "/about-us",
  "/contact",
  "/product",
  "/login",
  "/forbidden",
  "/navbar-component-01",
]);

function isProtectedPath(pathname: string) {
  return protectedRouteRules.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  const match = isProtectedPath(pathname);
  if (!match) {
    return NextResponse.next();
  }

  const session = parseSessionCookie(request.cookies.get(AUTH_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessPage(session.role, match.page)) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
