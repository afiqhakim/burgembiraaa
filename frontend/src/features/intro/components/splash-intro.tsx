"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "visible" | "fading" | "hidden";

export default function SplashIntro() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setPhase("fading"), 1200);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), 1750);

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
        "fixed inset-0 z-120 flex items-center justify-center bg-[#141211] transition-opacity duration-[2s]",
        phase === "fading" ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center gap-4 text-paper">
        <Image src="/logo.png" alt="Burgembiraaa logo" width={70} height={70} priority className="splash-pulse" />
        <p className="font-brand font-semibold tracking-[0.2em] text-paper">BURGEMBIRAAA</p>
      </div>
    </div>
  );
}
