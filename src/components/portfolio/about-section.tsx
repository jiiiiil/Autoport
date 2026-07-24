"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function AboutSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const about = portfolio.sections?.about;
  if (!about?.content) return null;

  return (
    <section id="about" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-6">
        {about.title ?? "About Me"}
      </h2>
      <p className="text-[var(--p-text-muted)] leading-relaxed max-w-3xl text-base">
        {about.content}
      </p>
    </section>
  );
}
