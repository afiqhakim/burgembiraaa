"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type CounterState = {
  popups: number;
  burgers: number;
  rotijohn: number;
};

const initialCounters: CounterState = { popups: 0, burgers: 0, rotijohn: 0 };
const counterTargets: CounterState = { popups: 14, burgers: 2075, rotijohn: 486 };

const highlights = [
  {
    title: "Masfest",
    copy: "Our pilot event and highest-selling one to date, with 107 burgers sold.",
  },
  {
    title: "Ramadhan Project",
    copy: "A collaboration to support community iftar/sahur while donating 10% of profits.",
  },
  {
    title: "98 Tiny Desk Concert",
    copy: "A sold-out acoustic night built around good food, good music, and good company.",
  },
];

function useCountUp(start: boolean) {
  const [counters, setCounters] = useState<CounterState>(initialCounters);

  useEffect(() => {
    if (!start) return;

    const durationMs = 1400;
    const startTime = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters({
        popups: Math.floor(counterTargets.popups * eased),
        burgers: Math.floor(counterTargets.burgers * eased),
        rotijohn: Math.floor(counterTargets.rotijohn * eased),
      });

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start]);

  return counters;
}

export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef<HTMLElement | null>(null);
  const counters = useCountUp(statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const heroBgStyle = useMemo(
    () => ({
      transform: `translateY(${Math.min(scrollY * 0.2, 140)}px) `,
      backgroundImage:
        "linear-gradient(rgba(15,15,15,0.35), rgba(15,15,15,0.35)), url('/film_burgembiraaa.jpg')",
    }),
    [scrollY]
  );

  const storyBgStyle = useMemo(
    () => ({
      transform: `translateY(${Math.min(scrollY * 0.12, 90)}px) scale(1.06)`,
      backgroundImage:
        "linear-gradient(rgba(15,15,15,0.45), rgba(15,15,15,0.45)), url('/collage.jpg')",
      opacity: 0.9,
    }),
    [scrollY]
  );

  return (
    <div className="-mt-16">
      <section className="relative h-svh overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center will-change-transform" style={heroBgStyle} />
        <div
          className={`relative flex h-full items-center justify-center px-6 text-center text-3xl font-bold text-paper transition-opacity duration-700 md:text-5xl ${
            heroVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          This is Burgembiraaa
        </div>
      </section>

      <section ref={statsRef} className="stats-section flex min-h-[70svh] items-center justify-center bg-paper px-6 text-ink">
        <div className="space-y-6 text-center text-xl md:text-2xl">
          <div>
            This year we&apos;ve made <span className="text-4xl font-bold text-accent-red">{counters.popups}</span> pop ups
          </div>
          <div>
            <span className="text-4xl font-bold text-accent-red">{counters.burgers}</span> burgers sold
          </div>
          <div>
            <span className="text-4xl font-bold text-accent-red">{counters.rotijohn}</span> roti johns sold
          </div>
        </div>
      </section>

      <section className="relative min-h-[85svh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center will-change-transform" style={storyBgStyle} />
        <div className="our-story-section relative flex min-h-[85svh] flex-col items-center justify-center px-6 text-center text-paper">
          <h2 className="mb-6 text-4xl font-bold">Our Story</h2>
          <p className="mb-8 max-w-2xl text-lg">
            It all started with a mengopi session in February 2025. As the Malaysian Festival in Bristol approached, we
            introduced a homemade smash burger inspired by Malaysian street food.
          </p>
          <Link className="read-more-btn" href="/about-us">
            Read More
          </Link>
        </div>
      </section>

      <section className="bg-paper px-4 py-20 text-ink">
        <div className="highlights-heading mb-12 text-center text-3xl font-semibold">Our Highlights</div>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="fade-card rounded-xl bg-ink p-6 text-paper shadow-lg">
              <div className="mb-4 aspect-[5/6] w-full rounded-md bg-[linear-gradient(160deg,var(--brand)_0%,var(--accent-red)_100%)]" />
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-paper/90">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-ink px-6 py-10 text-center text-paper">
        <h2 className="text-3xl font-bold">Burgembiraaa</h2>
        <div className="mt-6 flex justify-center gap-8 text-lg">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <Link href="/about-us" className="hover:text-brand">
            About
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/60">© 2025 Burgembiraaa. All rights reserved.</p>
      </footer>
    </div>
  );
}
