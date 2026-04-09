import { requirePageAccess } from "@/lib/auth/guards";

export default async function CartPage() {
  const user = await requirePageAccess("cart");

  return (
    <section className="space-y-6 bg-paper px-4 py-8 text-ink sm:px-6">
      <h1 className="text-3xl font-bold">Cart</h1>
      <p className="text-ink/70">
        This page is private. Current role <span className="font-medium">{user.role}</span> is allowed to access cart.
      </p>
      <div className="rounded-lg border border-brand/30 bg-white p-4 text-sm text-ink/70">Your cart is currently empty.</div>
    </section>
  );
}
