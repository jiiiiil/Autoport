"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { GBKineticTitle } from "./interactive/gb-afterlife-canvas";
import { LiquidDistortionImage } from "./interactive/liquid-image";
import { NeumorphicButton, NeumorphicBadge, NeumorphicCard } from "@/components/ui/neumorphism";
import { DeveloperMascot } from "./interactive/developer-mascot";
import { BuyMeACoffeeBadge, Emoji3D } from "./interactive/ui8-3d-illustrations";
import { ArrowRight, Mail } from "lucide-react";

export function HeroSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const hero = portfolio.sections?.hero;
  const name = portfolio.personalInfo?.name ?? "Developer";
  const role = portfolio.personalInfo?.role ?? "Software Engineer & Creative Technologist";
  const contact = portfolio.sections?.contact;
  const avatar = portfolio.personalInfo?.avatar;
  const skills = portfolio.sections?.skills?.map((s) => s.name) ?? ["React", "TypeScript", "Next.js", "TailwindCSS"];

  const mascotOption = (portfolio as { mascotOption?: string })?.mascotOption ?? "enabled-byte";
  const showMascot = mascotOption !== "disabled";

  return (
    <section id="hero" className="min-h-[85vh] flex items-center justify-center py-12 md:py-24 relative">
      {/* Floating 3D Emojis & UI8 Assets */}
      <div className="absolute top-10 right-10 hidden xl:block z-0 pointer-events-none opacity-80">
        <Emoji3D type="rocket" size="lg" />
      </div>
      <div className="absolute bottom-12 left-6 hidden xl:block z-0 pointer-events-none opacity-80">
        <Emoji3D type="code" size="lg" />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <BuyMeACoffeeBadge name={name} role={role} avatar={avatar} />
            <NeumorphicBadge variant="active" className="text-xs uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Emoji3D type="lightning" size="sm" animate={false} />
                <span>Available for Hire</span>
              </span>
            </NeumorphicBadge>
          </div>

          <GBKineticTitle
            text={hero?.headline ?? `Hi, I'm ${name}`}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[var(--p-text,#0f172a)]"
          />

          <p className="text-base sm:text-lg md:text-xl text-[var(--p-text-secondary,#334155)] max-w-2xl leading-relaxed font-semibold">
            {hero?.subheadline ?? portfolio.personalInfo?.tagline ?? "Crafting high-performance digital experiences with futuristic Neumorphic UI and dynamic motion design."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href={hero?.ctaLink ?? "#projects"}>
              <NeumorphicButton variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                {hero?.ctaText ?? "Explore Showcase"}
              </NeumorphicButton>
            </a>

            {contact?.email && (
              <a href={`mailto:${contact.email}`}>
                <NeumorphicButton variant="primary" size="lg" icon={<Mail className="w-4 h-4" />}>
                  Get In Touch
                </NeumorphicButton>
              </a>
            )}
          </div>
        </div>

        {/* Media / Mascot Card with Liquid SVG Distortion */}
        <div className="lg:col-span-5 flex justify-center items-center">
          {avatar ? (
            <NeumorphicCard variant="glowing" className="p-3 w-full max-w-sm">
              <LiquidDistortionImage
                src={avatar}
                alt={name}
                aspectRatio="square"
                className="w-full h-80 rounded-xl"
              />
            </NeumorphicCard>
          ) : showMascot ? (
            <NeumorphicCard variant="outset" className="p-4 w-full flex items-center justify-center">
              <DeveloperMascot name={name} role={role} skills={skills} showSpeechBubble={mascotOption === "enabled-byte"} />
            </NeumorphicCard>
          ) : (
            <NeumorphicCard variant="glowing" className="p-8 w-full max-w-sm text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 text-white flex items-center justify-center text-4xl font-extrabold shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/20 mb-4">
                {name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-300 mt-1 font-mono">{role}</p>
            </NeumorphicCard>
          )}
        </div>
      </div>
    </section>
  );
}
