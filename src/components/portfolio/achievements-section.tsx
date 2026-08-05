"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function AchievementsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const achievements = portfolio.sections?.achievements;
  if (!achievements || achievements.length === 0) return null;

  const { gridClass, clampClass } = useSectionGrid(portfolio, "achievements", "grid grid-cols-1 md:grid-cols-2 gap-4");

  return (
    <section id="achievements" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Achievements
      </h2>
      <div className={gridClass}>
        {achievements.map((ach, i) => (
          <div
            key={ach.title + i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--p-text)] mb-1">{ach.title}</h3>
            {ach.description && (
              <p className={`text-xs text-[var(--p-text-muted)] leading-relaxed break-words ${clampClass ?? ""}`}>
                {ach.description}
              </p>
            )}
            {ach.date && (
              <p className="text-[10px] text-[var(--p-text-muted)] mt-2 font-mono">{ach.date}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
