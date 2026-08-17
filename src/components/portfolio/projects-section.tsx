"use client";

import React, { useState } from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink, Code2, Layers, Grid } from "lucide-react";
import { NeumorphicBadge, NeumorphicButton } from "@/components/ui/neumorphism";
import { LiquidDistortionImage } from "./interactive/liquid-image";
import { TiltCard } from "./interactive/tilt-card";
import { Emoji3D } from "./interactive/ui8-3d-illustrations";
import { DepthCarousel } from "./interactive/depth-carousel";

import { BounceCards } from "./interactive/bounce-cards";

export function ProjectsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const projects = portfolio.sections?.projects;
  const isLight = false;
  const [viewMode, setViewMode] = useState<"bounce" | "depth" | "grid">("bounce");

  if (!projects || projects.length === 0) return null;

  const bounceCardItems = projects.map((p, i) => ({
    id: `proj-${i}`,
    title: p.title,
    subtitle: p.tags?.slice(0, 2).join(" • ") || "Featured Project",
    description: p.description,
    badge: "Project",
    tags: p.tags,
    image: p.image || `https://picsum.photos/seed/${encodeURIComponent(p.title || "proj")}/400/400`,
  }));

  const carouselItems = projects.map((p) => ({
    image: p.image || `https://picsum.photos/seed/${encodeURIComponent(p.title || "proj")}/800/1000`,
    alt: p.title,
    title: p.title,
    description: p.description,
    tags: p.tags,
    link: p.link,
  }));

  return (
    <section id="projects" className="py-12 md:py-20 relative z-10" data-bird-target="true">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Emoji3D type="diamond" size="sm" animate={false} />
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 font-mono">
              React Bits Bounce Showcase
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#1e293b)] tracking-tight leading-[1.08]">
            Featured Projects Showcase
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-2xl bg-white/40 border border-slate-200 backdrop-blur-md shadow-sm">
            <button
              onClick={() => setViewMode("bounce")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "bounce" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bounce Cards</span>
            </button>
            <button
              onClick={() => setViewMode("depth")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "depth" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Stack</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "grid" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>

          <NeumorphicBadge variant="glow" className="hidden sm:inline-flex font-mono">
            {projects.length} {projects.length === 1 ? "Project" : "Projects"}
          </NeumorphicBadge>
        </div>
      </div>

      {viewMode === "bounce" ? (
        <div className="w-full relative rounded-3xl bg-white/40 border border-white/60 p-6 overflow-visible backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <BounceCards
            cards={bounceCardItems}
            containerWidth="100%"
            containerHeight={340}
            animationDelay={0.1}
            animationStagger={0.15}
            easeType="elastic.out(1, 0.5)"
            enableHover
          />
        </div>
      ) : viewMode === "depth" ? (
        <div className="w-full h-[480px] sm:h-[540px] relative rounded-3xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
          <DepthCarousel
            items={carouselItems}
            depth={220}
            spread={100}
            tilt={24}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay
            autoplayDelay={3500}
            loop
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => {
            const isFeatured = projects.length >= 3 && i === 0;
            return (
              <div key={(project.title || "") + i} className={isFeatured ? "md:col-span-2 lg:col-span-2" : ""}>
                <TiltCard glowColor={isFeatured ? "gold" : i % 2 === 0 ? "cyan" : "emerald"}>
                  <div className="flex flex-col justify-between h-full group">
                    <div>
                      <LiquidDistortionImage
                        src={project.image}
                        alt={project.title}
                        aspectRatio="video"
                        fallbackIcon={<Code2 className="w-6 h-6" />}
                        className="mb-6 w-full h-48 sm:h-56 rounded-2xl overflow-hidden"
                      />

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className={`font-black text-white min-w-0 leading-snug group-hover:text-[var(--p-primary,#00f0ff)] transition-colors ${
                          isFeatured ? "text-xl sm:text-2xl" : "text-lg"
                        }`}>
                          {project.title}
                        </h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title}`}
                          >
                            <NeumorphicButton variant="inset" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                              Live
                            </NeumorphicButton>
                          </a>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                          {project.description}
                        </p>
                      )}
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {project.tags.map((tag) => (
                          <NeumorphicBadge key={tag} variant="default">
                            {tag}
                          </NeumorphicBadge>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
