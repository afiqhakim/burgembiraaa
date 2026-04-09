export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Main Page</h1>
      <p className="text-muted-foreground">
        Welcome to the public storefront. This app includes public routes, protected routes, and an RBAC-ready
        authorization flow.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Public pages: Main, About Us, Contact, Product</li>
        <li>Private pages: Profile, Cart</li>
        <li>Auth middleware enforces route authorization before page render.</li>
      </ul>
    </div>
  );
}
