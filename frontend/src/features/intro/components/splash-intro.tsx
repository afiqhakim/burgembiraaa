"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "visible" | "fading" | "hidden";

export default function SplashIntro() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setPhase("fading"), 1200);
    const hideTimer = window.setTimeout(() => {
      setPhase("hidden");
      document.documentElement.style.overflow = originalOverflow;
    }, 1750);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[120] flex items-center justify-center bg-ink transition-opacity duration-500",
        phase === "fading" ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center gap-4 text-paper">
        <Image src="/logo.png" alt="Burgembiraaa logo" width={70} height={70} priority className="splash-pulse" />
        <p className="text-sm tracking-[0.2em] text-paper/70">BURGEMBIRAAA</p>
      </div>
    </div>
  );
}
