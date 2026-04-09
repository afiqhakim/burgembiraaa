import Link from "next/link";

const publicLinks = [
  { href: "/", label: "Main" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/product", label: "Product" },
];

const privateLinks = [
  { href: "/profile", label: "Profile" },
  { href: "/cart", label: "Cart" },
];

export default function AppNavbar() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold">
          Burgembiraaa
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {publicLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 hover:bg-muted">
              {item.label}
            </Link>
          ))}

          <span className="mx-1 h-4 w-px bg-border" />

          {privateLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 hover:bg-muted">
              {item.label}
            </Link>
          ))}

          <span className="mx-1 h-4 w-px bg-border" />

          <a href="/api/auth/mock-login?role=customer" className="rounded-md px-3 py-1.5 hover:bg-muted">
            Login (Demo)
          </a>
          <a href="/api/auth/logout" className="rounded-md px-3 py-1.5 hover:bg-muted">
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}
