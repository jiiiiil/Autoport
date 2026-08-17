"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function AboutSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const about = portfolio.sections?.about;
  if (!about?.content) return null;

  const paragraphs = about.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const role = portfolio.personalInfo?.role ?? "Developer";
  const location = portfolio.sections?.contact?.location;

  return (
    <section id="about" className="py-12 md:py-16">
      <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-card)]/40 p-6 md:p-10 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--p-primary-soft)] text-[var(--p-primary)] mb-2">
              Background & Story
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
              {about.title ?? "About Me"}
            </h2>
            <div className="space-y-4 pt-2">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg leading-relaxed text-[var(--p-text,#0f172a)] font-semibold"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--p-primary)]">
              Quick Highlights
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[var(--p-text-muted)] font-medium">Role / Focus</span>
                <span className="font-semibold text-[var(--p-text)]">{role}</span>
              </div>
              {location && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-[var(--p-text-muted)] font-medium">Location</span>
                  <span className="font-semibold text-[var(--p-text)]">{location}</span>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[var(--p-text-muted)] font-medium">Specialization</span>
                <span className="font-semibold text-[var(--p-text)]">Scalable Systems & Web Craft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
