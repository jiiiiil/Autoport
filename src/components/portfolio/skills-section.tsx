"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { NeumorphicCard, NeumorphicProgress } from "@/components/ui/neumorphism";
import { BounceCards } from "./interactive/bounce-cards";

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
  const isLight = false;
  if (!skills || skills.length === 0) return null;

  // Convert EVERY individual skill into its OWN Bounce Card
  const individualSkillCards = skills.map((skill, i) => ({
    id: `skill-${i}`,
    title: skill.name,
    subtitle: skill.category || "Technical Skill",
    badge: skill.level ? skill.level.toUpperCase() : "SKILL",
    description: `Proficiency level: ${getLevelPercentage(skill.level)}%`,
    tags: [skill.category || "Skill", `${getLevelPercentage(skill.level)}%`],
  }));

  // Chunk skills into rows of 5 for optimal fanned BounceCards presentation
  const chunkSize = 5;
  const skillRows = [];
  for (let i = 0; i < individualSkillCards.length; i += chunkSize) {
    skillRows.push(individualSkillCards.slice(i, i + chunkSize));
  }

  const categories = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "Technical Stack";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-12 md:py-20 relative z-10" data-bird-target="true">
      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-sky-600 font-mono">
          Capabilities & Tech Stack
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#1e293b)] tracking-tight mt-1">
          Skills & Technical Expertise
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
          Click or hover any individual skill card to inspect & center
        </p>
      </div>

      {isLight ? (
        <div className="space-y-10">
          {skillRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="w-full relative rounded-3xl bg-white/30 border border-white/60 p-6 sm:p-10 overflow-visible backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
            >
              <BounceCards
                cards={row}
                containerWidth="100%"
                containerHeight={320}
                animationDelay={0.1 * rowIdx}
                animationStagger={0.08}
                easeType="elastic.out(1, 0.5)"
                enableHover
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categories).map(([category, catSkills]) => (
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
      )}
    </section>
  );
}
