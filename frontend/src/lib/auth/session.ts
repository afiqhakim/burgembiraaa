import { cookies } from "next/headers";

import { ROLES, type SessionUser } from "@/lib/auth/types";

export const AUTH_COOKIE = "app_session";

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") return false;
  const user = value as { id?: unknown; role?: unknown; email?: unknown };
  const hasValidId = typeof user.id === "string" && user.id.length > 0;
  const hasValidRole = typeof user.role === "string" && ROLES.includes(user.role as (typeof ROLES)[number]);
  const emailIsValid = user.email === undefined || typeof user.email === "string";
  return hasValidId && hasValidRole && emailIsValid;
}

function tryDecode(value: string): string {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return value;
  }
}

export function parseSessionCookie(rawValue?: string): SessionUser | null {
  if (!rawValue) return null;

  const decoded = tryDecode(rawValue);
  try {
    const parsed: unknown = JSON.parse(decoded);
    return isSessionUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE)?.value;
  return parseSessionCookie(raw);
}
