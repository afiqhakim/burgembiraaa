export const ROLES = ["admin", "customer", "seller"] as const;

export type Role = (typeof ROLES)[number];

export type SessionUser = {
  id: string;
  email?: string;
  role: Role;
};
