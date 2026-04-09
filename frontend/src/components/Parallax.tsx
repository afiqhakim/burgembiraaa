"use client";
import { useEffect, useRef, useState } from "react";

type ParallaxHeroProps = {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  strengthMobile?: number;   // smaller = slower
  strengthDesktop?: number;
  /** Set to `Infinity` to remove the cap entirely */
  maxTravelPx?: number;      
  /** Slight scale so you don’t see edges when translating */
  bleedScale?: number;       
  overlayClass?: string;
  heightClass?: string;
};

export default function ParallaxHero({
  imageSrc = "/images/film_burgembiraaa.jpg",
  title = "This is Burgembiraaa",
  subtitle = "Good vibes, better burgers.",
  ctaText = "See Our Menu",
  onCtaClick,
  strengthMobile = 0.2,
  strengthDesktop = 0.4,
  maxTravelPx,                 // undefined = auto via section height
  bleedScale = 1.08,           // prevents edges when moving
  overlayClass = "bg-black/25",
  heightClass = "h-[80svh] md:h-screen",
}: ParallaxHeroProps) {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(min-width: 768px)").matches;

  const factor = isDesktop ? strengthDesktop : strengthMobile;

  // auto cap ≈ 30% of section height (good starting point)
  const autoMax =
    sectionRef.current ? sectionRef.current.offsetHeight * 0.3 : 200;

  const cap = maxTravelPx ?? autoMax; // set maxTravelPx=Infinity to remove the cap
  const translateY = Math.min(offset * factor, cap);

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden ${heightClass}`}>
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          transform: `translateY(${translateY}px) scale(${bleedScale})`,
          willChange: "transform",
        }}
      />
      {/* Overlay */}
      <div className={`absolute inset-0 -z-0 ${overlayClass}`} />
      {/* Foreground */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 flex h-full items-center">
        <div className="text-neutral">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>
          )}
          {ctaText && (
            <button
              onClick={onCtaClick}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-black transition-transform duration-300 hover:scale-105"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
