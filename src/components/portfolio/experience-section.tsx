"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function ExperienceSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const experience = portfolio.sections?.experience;
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Experience
      </h2>
      <div className="relative space-y-8 pl-6 border-l-2 border-[var(--p-border)]">
        {experience.map((exp, i) => (
          <div key={exp.company + i} className="relative">
            <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-[var(--p-primary)] bg-[var(--p-bg)]" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h3 className="text-base font-semibold text-[var(--p-text)]">
                {exp.role ?? exp.company}
              </h3>
              <span className="text-xs text-[var(--p-text-muted)] font-mono">
                {exp.startDate} {exp.endDate ? `\u2013 ${exp.endDate}` : ""}
              </span>
            </div>
            <p className="text-sm text-[var(--p-primary)] mb-1">{exp.company}</p>
            {exp.description && (
              <p className="text-sm text-[var(--p-text-muted)] leading-relaxed">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
