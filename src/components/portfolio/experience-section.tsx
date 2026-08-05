"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function ExperienceSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const experience = portfolio.sections?.experience;
  if (!experience || experience.length === 0) return null;

  const { clampClass } = useSectionGrid(portfolio, "experience", "grid grid-cols-1 gap-6");

  return (
    <section id="experience" className="py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--p-primary)]">
            Career Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
            Work Experience
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {experience.map((exp, i) => (
          <div key={(exp.company || "") + i} className="group">
            {/* Experience Card */}
            <div className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 sm:p-6 transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--p-text)] min-w-0 leading-snug">
                    {exp.role ?? exp.company}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--p-primary)] mt-0.5">
                    {exp.company}
                    {exp.location ? ` \u2022 ${exp.location}` : ""}
                  </p>
                </div>

                {(exp.startDate || exp.endDate) && (
                  <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--p-primary-soft)] text-[var(--p-primary)] border border-[var(--p-primary)]/20 whitespace-nowrap shrink-0">
                    {exp.startDate || ""} {exp.endDate ? `\u2013 ${exp.endDate}` : ""}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className={`text-sm text-[var(--p-text-muted)] leading-relaxed ${clampClass ?? ""}`}>
                  {exp.description}
                </p>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--p-border)]/50">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-[var(--p-primary-softer)] text-[var(--p-primary)] border border-[var(--p-primary-soft)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
