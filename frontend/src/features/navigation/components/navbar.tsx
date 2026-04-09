"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

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

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isLanding = pathname === "/";
  const transparent = isLanding && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b text-[#FCFFF7] transition-all duration-300",
        transparent ? "border-transparent bg-transparent shadow-none" : "border-[#f3a436]/30 bg-[#0F0F0F]/95 shadow-md backdrop-blur"
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#f3a436]">
          Burgembiraaa
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {publicLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 text-[#FCFFF7] hover:bg-[#f3a436] hover:text-[#0F0F0F]">
              {item.label}
            </Link>
          ))}

          <span className="mx-1 h-4 w-px bg-[#FCFFF7]/30" />

          {privateLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 text-[#FCFFF7] hover:bg-[#f3a436] hover:text-[#0F0F0F]">
              {item.label}
            </Link>
          ))}

          <span className="mx-1 h-4 w-px bg-[#FCFFF7]/30" />

          <a
            href="/api/auth/mock-login?role=customer"
            className="rounded-md bg-[#f3a436] px-3 py-1.5 font-medium text-[#0F0F0F] hover:opacity-90"
          >
            Login (Demo)
          </a>
          <a href="/api/auth/logout" className="rounded-md px-3 py-1.5 text-[#FCFFF7] hover:bg-[#f3a436] hover:text-[#0F0F0F]">
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}
