"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "visible" | "fading" | "hidden";

export default function SplashIntro() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    // Keep intro visible long enough to feel intentional, then fade out.
    const fadeTimer = window.setTimeout(() => setPhase("fading"), 2000);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), 2100);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 will-change-[opacity]",
        phase === "fading" ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-[#141211]" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-paper">
        <Image src="/logo.png" alt="Burgembiraaa logo" width={100} height={100} priority className="splash-pulse" />
      </div>
    </div>
  );
}
