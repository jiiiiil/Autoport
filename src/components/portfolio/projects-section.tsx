"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink } from "lucide-react";

export function ProjectsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const projects = portfolio.sections?.projects;
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <div
            key={project.title + i}
            className="group rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)]"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--p-text)]">
                {project.title}
              </h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--p-text-muted)] hover:text-[var(--p-primary)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {project.description && (
              <p className="text-sm text-[var(--p-text-muted)] mb-4 leading-relaxed">
                {project.description}
              </p>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--p-primary)]/10 text-[var(--p-primary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
