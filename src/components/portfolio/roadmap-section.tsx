"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { CheckCircle, Clock, Circle } from "lucide-react";

export function RoadmapSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const roadmap = portfolio.sections?.roadmap;
  if (!roadmap || roadmap.length === 0) return null;

  const statusIcons: Record<string, typeof CheckCircle> = {
    completed: CheckCircle,
    "in-progress": Clock,
    upcoming: Circle,
  };

  const statusColors: Record<string, string> = {
    completed: "text-[var(--p-success)]",
    "in-progress": "text-[var(--p-warning)]",
    upcoming: "text-[var(--p-text-muted)]",
  };

  return (
    <section id="roadmap" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Roadmap</h2>
      <div className="space-y-4 max-w-2xl mx-auto">
        {roadmap.map((r, i) => {
          const Icon = statusIcons[r.status || "upcoming"] || Circle;
          return (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5"
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${statusColors[r.status || "upcoming"] || ""}`} />
              <div>
                <h3 className="text-base font-semibold text-[var(--p-text)]">{r.milestone}</h3>
                {r.date && (
                  <p className="text-xs text-[var(--p-text-muted)] mt-1">{r.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
