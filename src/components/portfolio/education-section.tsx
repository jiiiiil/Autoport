"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

import { BounceCards } from "./interactive/bounce-cards";

export function EducationSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const education = portfolio.sections?.education;
  const isLight = false;
  if (!education || education.length === 0) return null;

  const eduBounceItems = education.map((edu, i) => ({
    id: `edu-${i}`,
    title: edu.degree || edu.institution,
    subtitle: edu.institution,
    description: edu.description || (edu.field ? `Field: ${edu.field}` : undefined),
    badge: edu.startDate || edu.endDate ? `${edu.startDate || ""} - ${edu.endDate || ""}` : "Education",
    tags: edu.field ? [edu.field] : undefined,
  }));

  return (
    <section id="education" className="py-12 md:py-16 relative z-10" data-bird-target="true">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 font-mono">
          Academic Background
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text,#1e293b)] tracking-tight">
          Education
        </h2>
      </div>

      {isLight ? (
        <div className="w-full relative rounded-3xl bg-white/30 border border-white/60 p-8 overflow-visible backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <BounceCards
            cards={eduBounceItems}
            containerWidth="100%"
            containerHeight={300}
            animationDelay={0.1}
            animationStagger={0.15}
            easeType="elastic.out(1, 0.5)"
            enableHover
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <div
            key={(edu.institution || "") + i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[var(--p-text)] leading-snug">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--p-primary)] mt-1">
                    {edu.institution}
                  </p>
                </div>

                {(edu.startDate || edu.endDate) && (
                  <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--p-primary-soft)] text-[var(--p-primary)] border border-[var(--p-primary)]/20 whitespace-nowrap shrink-0">
                    {edu.startDate || ""} {edu.endDate ? `\u2013 ${edu.endDate}` : ""}
                  </span>
                )}
              </div>

              {edu.description && (
                <p className="text-sm text-[var(--p-text-muted)] leading-relaxed mt-3">
                  {edu.description}
                </p>
              )}
            </div>

            {edu.grade && (
              <div className="mt-4 pt-3 border-t border-[var(--p-border)]/50 text-xs font-mono text-[var(--p-text-secondary)]">
                Grade / Score: <span className="font-semibold text-[var(--p-text)]">{edu.grade}</span>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </section>
  );
}
