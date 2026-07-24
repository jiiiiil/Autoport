"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function SkillsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const skills = portfolio.sections?.skills;
  if (!skills || skills.length === 0) return null;

  const categories = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categories).map(([category, catSkills]) => (
          <div key={category} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--p-primary)] mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-[var(--p-border)] text-[var(--p-text-muted)] bg-[var(--p-bg)]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
