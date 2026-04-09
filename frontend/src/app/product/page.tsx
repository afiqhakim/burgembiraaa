const products = [
  { id: "p1", name: "Classic Burger", price: "RM 18" },
  { id: "p2", name: "Double Smash", price: "RM 24" },
  { id: "p3", name: "Spicy Chicken", price: "RM 20" },
];

export default function ProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Product</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border border-border p-4">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
