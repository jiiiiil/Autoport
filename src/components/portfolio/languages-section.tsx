"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function LanguagesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const languages = portfolio.sections?.languages;
  if (!languages || languages.length === 0) return null;

  return (
    <section id="languages" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Languages
      </h2>
      <div className="flex flex-wrap gap-3">
        {languages.map((lang, i) => (
          <div
            key={(lang.name ?? "lang") + i}
            className="flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] px-4 py-3"
          >
            <span className="text-sm font-semibold text-[var(--p-text)]">{lang.name ?? "Language"}</span>
            {lang.proficiency && (
              <span className="text-[10px] uppercase tracking-wider text-[var(--p-primary)]">
                {lang.proficiency}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
