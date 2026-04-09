import { redirect } from "next/navigation";

import { canAccessPage, type AppPage } from "@/lib/auth/rbac";
import { getSessionUser } from "@/lib/auth/session";

export async function requirePageAccess(page: AppPage) {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=/${page}`);
  }

  if (!canAccessPage(user.role, page)) {
    redirect("/forbidden");
  }

  return user;
}
