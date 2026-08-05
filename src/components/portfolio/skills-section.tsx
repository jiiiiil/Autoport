"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { NeumorphicCard, NeumorphicBadge, NeumorphicProgress } from "@/components/ui/neumorphism";

function getLevelPercentage(level?: string): number {
  switch (level?.toLowerCase()) {
    case "expert": return 95;
    case "advanced": return 85;
    case "intermediate": return 70;
    case "beginner": return 50;
    default: return 80;
  }
}

export function SkillsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const skills = portfolio.sections?.skills;
  if (!skills || skills.length === 0) return null;

  const categories = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "Technical Stack";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-12 md:py-20">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
          Capabilities & Tech Stack
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#f8fafc)] tracking-tight mt-1">
          Skills & Technical Expertise
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([category, catSkills], i) => (
          <NeumorphicCard key={category} variant="outset" className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--p-border-subtle,rgba(255,255,255,0.06))]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--p-primary,#00f0ff)] shadow-[0_0_8px_#00f0ff]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--p-text,#f8fafc)]">
                {category}
              </h3>
            </div>

            <div className="space-y-4">
              {catSkills.map((skill) => (
                <NeumorphicProgress
                  key={skill.name}
                  label={skill.name}
                  value={getLevelPercentage(skill.level)}
                />
              ))}
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </section>
  );
}
