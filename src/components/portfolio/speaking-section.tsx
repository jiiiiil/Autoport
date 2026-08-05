"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { Mic, ExternalLink } from "lucide-react";

export function SpeakingSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const speaking = portfolio.sections?.speaking;
  if (!speaking || speaking.length === 0) return null;

  return (
    <section id="speaking" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Speaking</h2>
      <div className="space-y-4">
        {speaking.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--p-primary)]/10 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-[var(--p-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[var(--p-text)] break-words">{s.topic}</h3>
              {s.event && (
                <p className="text-xs text-[var(--p-primary)] break-words">{s.event}</p>
              )}
              <div className="flex items-center gap-3 mt-1">
                {s.date && <span className="text-xs text-[var(--p-text-muted)]">{s.date}</span>}
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--p-primary)] hover:underline inline-flex items-center gap-1">
                    Watch <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
