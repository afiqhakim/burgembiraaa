const products = [
  { id: "p1", name: "Classic Burger", price: "RM 18" },
  { id: "p2", name: "Double Smash", price: "RM 24" },
  { id: "p3", name: "Spicy Chicken", price: "RM 20" },
];

export default function ProductPage() {
  return (
    <section className="space-y-6 bg-paper px-4 py-8 text-ink sm:px-6">
      <h1 className="text-3xl font-bold">Product</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border border-brand/30 bg-white p-4">
            <p className="font-semibold text-ink">{product.name}</p>
            <p className="text-sm text-ink/70">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
