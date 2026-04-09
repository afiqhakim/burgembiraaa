import type { Role } from "@/lib/auth/types";

export const APP_PAGES = ["profile", "cart"] as const;
export type AppPage = (typeof APP_PAGES)[number];

const pageAccess: Record<AppPage, Role[]> = {
  profile: ["admin", "customer", "seller"],
  cart: ["customer", "admin"],
};

export function canAccessPage(role: Role, page: AppPage): boolean {
  return pageAccess[page].includes(role);
}

export const protectedRouteRules: Array<{ prefix: string; page: AppPage }> = [
  { prefix: "/profile", page: "profile" },
  { prefix: "/cart", page: "cart" },
];
