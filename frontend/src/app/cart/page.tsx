import { requirePageAccess } from "@/lib/auth/guards";

export default async function CartPage() {
  const user = await requirePageAccess("cart");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Cart</h1>
      <p className="text-muted-foreground">
        This page is private. Current role <span className="font-medium">{user.role}</span> is allowed to access cart.
      </p>
      <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">Your cart is currently empty.</div>
    </div>
  );
}
