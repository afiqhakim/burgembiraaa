"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

type CounterState = {
  popups: number;
  burgers: number;
  rotijohn: number;
};

const initialCounters: CounterState = { popups: 0, burgers: 0, rotijohn: 0 };
const counterTargets: CounterState = { popups: 9, burgers: 405, rotijohn: 91 };

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

const HeroScene = dynamic(() => import("@/features/landing/components/hero-scene"), {
  ssr: false,
});

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

function useAnimatedNumber(target: number | null, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || target === null) return;

    const durationMs = 2000;
    const startTime = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [burgerProgress, setBurgerProgress] = useState(0);
  const [burgerSpinStep, setBurgerSpinStep] = useState(0);
  const [burgerSpinDirection, setBurgerSpinDirection] = useState<1 | -1>(1);
  const [burgerSpinLocked, setBurgerSpinLocked] = useState(false);
  const [daysSinceLaunch, setDaysSinceLaunch] = useState<number | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const burgerSectionRef = useRef<HTMLElement | null>(null);
  const burgerSpinLockedRef = useRef(false);
  const pendingScrollDeltaRef = useRef(0);
  const counters = useCountUp(statsVisible);
  const animatedDaysSinceLaunch = useAnimatedNumber(daysSinceLaunch, statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || 0);

      if (!burgerSectionRef.current) return;
      const rect = burgerSectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));
      setBurgerProgress(clampedProgress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    burgerSpinLockedRef.current = burgerSpinLocked;
  }, [burgerSpinLocked]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!burgerSectionRef.current) return;
      const rect = burgerSectionRef.current.getBoundingClientRect();
      const viewportMiddle = window.innerHeight * 0.5;
      const sectionInFocus = rect.top < viewportMiddle && rect.bottom > viewportMiddle;
      if (!sectionInFocus) return;

      if (burgerSpinLockedRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 4) return;

      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      pendingScrollDeltaRef.current = direction * 160;
      setBurgerSpinLocked(true);
      setBurgerSpinDirection(direction);
      setBurgerSpinStep((prev) => prev + 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const handleBurgerSpinComplete = () => {
    setBurgerSpinLocked(false);
    const pendingDelta = pendingScrollDeltaRef.current;
    pendingScrollDeltaRef.current = 0;
    if (pendingDelta !== 0) {
      requestAnimationFrame(() => {
        window.scrollBy({ top: pendingDelta, left: 0, behavior: "auto" });
      });
    }
  };

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.75 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

    async function loadDays() {
      try {
        const response = await fetch(`${baseUrl}/stats/days-since-launch`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { days_since_launch?: number };
        if (typeof data.days_since_launch === "number") {
          setDaysSinceLaunch(data.days_since_launch);
        }
      } catch {
        // keep page usable even when API is unavailable
      }
    }

    loadDays();
    return () => controller.abort();
  }, []);

  const heroBgStyle = useMemo(
    () => ({
      transform: `translateY(${Math.min(scrollY * 0.2, 140)}px) `,
      backgroundImage:
        "linear-gradient(rgba(15,15,15,0.55), rgba(15,15,15,0.65)), url('/film_burgembiraaa.jpg')",
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
          className={`relative flex h-full items-center justify-center px-6 text-center text-3xl font-bold text-paper transition-all delay-[1800ms] duration-[1000ms] md:text-5xl ${
            heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.7]"
          }`}
        >
          This is Burgembiraaa
        </div>
      </section>

      <section ref={burgerSectionRef} className="relative min-h-[120vh] overflow-hidden bg-splash">
        <div className="absolute inset-0">
          <HeroScene
            scrollProgress={burgerProgress}
            spinStep={burgerSpinStep}
            spinDirection={burgerSpinDirection}
            spinLocked={burgerSpinLocked}
            onSpinComplete={handleBurgerSpinComplete}
            backgroundColor="#141211"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,18,17,0.02)_0%,rgba(20,18,17,0.36)_72%,rgba(20,18,17,0.65)_100%)]" />
        <div className="relative z-10 flex min-h-[95svh] items-end justify-center px-6 pb-14 text-center">
          <p className="text-lg text-paper/85 md:text-xl">Our 3D Burger</p>
        </div>
      </section>

      <section ref={statsRef} className="stats-section flex min-h-[90svh] items-center justify-center bg-paper px-6 text-ink">
        <div className="space-y-6 text-center text-xl md:text-2xl">
          <div>
            It has been{" "}
            <span className="text-4xl font-bold">{daysSinceLaunch === null ? "..." : animatedDaysSinceLaunch}</span> days since we started.
          </div>
          <div>
            We&apos;ve made <span className="text-4xl font-bold ">{counters.popups}</span> pop ups
          </div>
          <div>
            <span className="text-4xl font-bold">{counters.burgers}</span> burgers sold
          </div>
          <div>
            <span className="text-4xl font-bold">{counters.rotijohn}</span> roti johns sold
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
