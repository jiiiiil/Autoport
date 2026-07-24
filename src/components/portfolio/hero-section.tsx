"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function HeroSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const hero = portfolio.sections?.hero;
  const name = portfolio.personalInfo?.name ?? "Developer";
  const role = portfolio.personalInfo?.role ?? "Software Developer";

  return (
    <section id="hero" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--p-text-muted)] mb-4">
        {portfolio.personalInfo?.role ?? role}
      </p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--p-text)] leading-tight mb-6">
        {hero?.headline ?? `Hi, I\u2019m ${name}`}
      </h1>
      <p className="text-lg md:text-xl text-[var(--p-text-muted)] max-w-2xl mb-8">
        {hero?.subheadline ?? portfolio.personalInfo?.tagline ?? "Building exceptional digital experiences"}
      </p>
      {hero?.ctaText && (
        <a
          href={hero.ctaLink ?? "#projects"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105"
          style={{ background: "linear-gradient(135deg, var(--p-gradient-from), var(--p-gradient-via))" }}
        >
          {hero.ctaText}
        </a>
      )}
    </section>
  );
}
