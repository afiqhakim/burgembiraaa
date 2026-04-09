"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, User } from "lucide-react";

import AppIcon from "@/components/shared/app-icon";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
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
        "fixed inset-x-0 top-0 z-50 text-paper transition-all duration-300",
        transparent ? "bg-transparent shadow-none" : "bg-ink/95 shadow-xs backdrop-blur"
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 items-center px-4 py-4 sm:px-6">
        <nav className="flex items-center gap-2 justify-self-start text-sm">
          {leftLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 text-paper hover:bg-brand hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="inline-flex items-center justify-self-center text-lg font-semibold tracking-tight text-brand">
          <Image src="/logo.png" alt="Burgembiraaa Logo" width={30} height={30} className="mr-2 inline-block" />
          Burgembiraaa
        </Link>

        <nav className="flex items-center gap-2 justify-self-end">
          <Link
            href="/profile"
            aria-label="Profile"
            className="rounded-md p-2 text-paper hover:bg-brand hover:text-ink"
          >
            <AppIcon icon={User} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="rounded-md p-2 text-paper hover:bg-brand hover:text-ink">
            <AppIcon icon={ShoppingBag} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
