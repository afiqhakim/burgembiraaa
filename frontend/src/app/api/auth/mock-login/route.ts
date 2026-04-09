import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth/session";
import { ROLES, type Role } from "@/lib/auth/types";

function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}

export async function GET(request: NextRequest) {
  const roleParam = request.nextUrl.searchParams.get("role") ?? "customer";
  const nextParam = request.nextUrl.searchParams.get("next") ?? "/profile";
  const role: Role = isRole(roleParam) ? roleParam : "customer";

  const payload = {
    id: "demo-user-1",
    email: "demo@burgembiraaa.com",
    role,
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const response = NextResponse.redirect(new URL(nextParam, request.url));
  response.cookies.set(AUTH_COOKIE, encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
