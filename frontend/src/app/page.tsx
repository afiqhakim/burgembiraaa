// src/app/page.tsx
import ParallaxHero from "@/components/Parallax";

export default function Home() {
  return (
    <main>
      <ParallaxHero imageSrc="/images/film_burgembiraaa.jpg" />
      <section className="min-h-[120vh] bg-neutral text-black px-6 py-20">
        <h2 className="text-3xl font-bold">Scroll to feel the parallax</h2>
      </section>
      <section className="min-h-[100vh] flex h-full items-center text-ce">
        <h1>Best Malaysian Burger from Bristol</h1>
      </section>
    </main>
  );
}
