import { requirePageAccess } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const user = await requirePageAccess("profile");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground">This page is private.</p>
      <div className="rounded-lg border border-border p-4 text-sm">
        <p>
          <span className="font-medium">User ID:</span> {user.id}
        </p>
        <p>
          <span className="font-medium">Role:</span> {user.role}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email ?? "-"}
        </p>
      </div>
    </div>
  );
}
