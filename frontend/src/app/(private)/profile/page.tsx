import { requirePageAccess } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const user = await requirePageAccess("profile");

  return (
    <section className="space-y-6 bg-paper px-4 py-8 text-ink sm:px-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-ink/70">This page is private.</p>
      <div className="rounded-lg border border-brand/30 bg-white p-4 text-sm">
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
    </section>
  );
}
