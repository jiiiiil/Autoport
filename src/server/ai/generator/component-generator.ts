// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";
import type { OptimizedSection } from "../manifest/types";

function premiumButton(style = "primary"): string {
  const variants = {
    primary:
      `inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`,
    secondary:
      `inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-background/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-background/80 hover:border-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`,
    ghost:
      `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:bg-foreground/5 hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`,
    glow:
      `inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`,
    gradient:
      `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-purple-500 to-accent px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`,
  };
  return variants[style] || variants.primary;
}

function premiumCard(variant = "glass"): string {
  const variants = {
    glass:
      `group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl hover:-translate-y-1`,
    gradient:
      `group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 border border-primary/10 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1`,
    outlined:
      `group relative overflow-hidden rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1`,
    elevated:
      `group relative overflow-hidden rounded-2xl bg-background p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-1 ring-black/5`,
    neo:
      `group relative overflow-hidden rounded-2xl border-2 border-foreground/10 bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5`,
  };
  return variants[variant] || variants.glass;
}

function meshGradientBg(): string {
  return `relative overflow-hidden before:absolute before:-top-1/4 before:-left-1/4 before:h-1/2 before:w-1/2 before:rounded-full before:bg-gradient-to-r before:from-primary/20 before:to-transparent before:blur-[120px] after:absolute after:-bottom-1/4 after:-right-1/4 after:h-1/2 after:w-1/2 after:rounded-full after:bg-gradient-to-l after:from-accent/15 after:to-transparent after:blur-[120px]`;
}

function gridPatternBg(): string {
  return `relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:60px_60px]`;
}

function dotPatternBg(): string {
  return `relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] before:bg-[size:24px_24px]`;
}

function generateNavbar(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const nav = manifest.blueprint.navigation;
  const sections = nav.sections;

  const navLinks = sections.map((s) => {
    const label = s.charAt(0).toUpperCase() + s.slice(1);
    return `{ label: "${label}", href: "#${s}" }`;
  });

  const premiumVariants = {
    floating: `fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/5`,
    glass: `fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 px-4 py-3 backdrop-blur-2xl`,
    dock: `fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-background/80 px-4 py-2 backdrop-blur-xl shadow-lg`,
    minimal: `fixed top-0 z-50 w-full bg-background/40 px-4 py-3 backdrop-blur-md`,
    sidebar: `fixed left-0 top-0 z-50 h-full w-64 border-r border-white/10 bg-background/90 p-6 backdrop-blur-2xl`,
  };

  const navClasses = premiumVariants[nav.variant] || premiumVariants.floating;

  const content = `"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "${ctx.utilsDir}/cn";

const navLinks = [
  ${navLinks.join(",\n  ")},
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "${navClasses}",
        scrolled && "shadow-xl shadow-black/10 bg-background/90"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a
          href="/"
          className="relative text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Portfolio
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-foreground/5 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="relative z-50 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 md:hidden backdrop-blur-sm transition-colors hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
`;
  return { path: `${ctx.componentsDir}/navbar.tsx`, content, type: "component" };
}

function generateFooter(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const social = manifest.blueprint.content.sections?.contact?.data?.social as Record<string, string> | undefined;
  const name = manifest.projectManifest.name;

  const content = `"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "${social?.github || 'https://github.com'}", label: "GitHub" },
  { icon: Linkedin, href: "${social?.linkedin || 'https://linkedin.com'}", label: "LinkedIn" },
  { icon: Twitter, href: "${social?.twitter || 'https://twitter.com'}", label: "Twitter" },
  { icon: Mail, href: "mailto:${manifest.blueprint.content.sections?.contact?.data?.email || 'hello@example.com'}", label: "Email" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-border/10 bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 before:absolute before:-top-1/4 before:-left-1/4 before:h-1/3 before:w-1/3 before:rounded-full before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">${name}</h3>
            <p className="text-sm leading-relaxed text-foreground/60">
              Building digital experiences that make a difference.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground/40">Navigation</h4>
            <ul className="space-y-2">
              ${(manifest.blueprint.navigation?.sections || []).map((s) =>
                `<li>
                <a href="#${s}" className="text-sm text-foreground/60 transition-colors hover:text-foreground">
                  ${s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              </li>`
              ).join("\n              ")}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground/40">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground/60 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-foreground/40">
            &copy; {new Date().getFullYear()} ${name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground/40 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:shadow-lg"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
`;
  return { path: `${ctx.componentsDir}/footer.tsx`, content, type: "component" };
}

function generateSectionWrapper(ctx: GeneratorContext): GeneratedFile {
  const content = `import { cn } from "${ctx.utilsDir}/cn";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  background?: "default" | "muted" | "gradient" | "grid" | "dots" | "mesh";
}

export function SectionWrapper({ id, children, className, fullWidth, background }: SectionWrapperProps) {
  const bgClasses = {
    default: "",
    muted: "bg-foreground/[0.02]",
    gradient: "bg-gradient-to-b from-background via-primary/[0.02] to-background",
    grid: \`relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:60px_60px]\`,
    dots: \`relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] before:bg-[size:24px_24px]\`,
    mesh: \`relative overflow-hidden before:absolute before:-top-1/4 before:-left-1/4 before:h-1/2 before:w-1/2 before:rounded-full before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:blur-[120px] after:absolute after:-bottom-1/4 after:-right-1/4 after:h-1/2 after:w-1/2 after:rounded-full after:bg-gradient-to-l after:from-accent/10 after:to-transparent after:blur-[120px]\`,
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full py-20 md:py-28",
        bgClasses[background || "default"],
        className
      )}
      aria-labelledby={\`\${id}-heading\`}
    >
      <div className={cn(fullWidth ? "w-full" : "mx-auto max-w-7xl px-6")}>
        {children}
      </div>
    </section>
  );
}
`;
  return { path: `${ctx.componentsDir}/section-wrapper.tsx`, content, type: "component" };
}

function getHeroSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || section.name;
  const subheading = sectionContent?.subheading || "";
  const body = sectionContent?.body || "";
  const cta = sectionContent?.cta || [];

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}`
    : "";

  const variant = section.variant;
  const ctaButtons = cta.map((c, i) => {
    const style = i === 0 ? "glow" : "ghost";
    return `<a href="${c.href}" className="${premiumButton(style)}">${c.label}</a>`;
  }).join("\n            ");

  if (variant === "split") {
    return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { ArrowDown } from "lucide-react";
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" className="flex min-h-screen items-center pt-20" background="mesh">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <${motionDiv} ${framerAttrs} className="space-y-6">
          ${subheading ? `<p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">${subheading}</p>` : ""}
          <h1 id="${section.id}-heading" className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              ${heading}
            </span>
          </h1>
          ${body ? `<p className="max-w-lg text-lg leading-relaxed text-foreground/60">${body}</p>` : ""}
          <div className="flex flex-wrap gap-4">
            ${ctaButtons}
          </div>
        </${motionDiv}>
        <${motionDiv} ${framerAttrs} className="relative flex items-center justify-center">
          <div className="relative h-[400px] w-[400px] rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-1">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  ✦
                </div>
              </div>
            </div>
          </div>
        </${motionDiv}>
      </div>
    </SectionWrapper>
  );
}`;
  }

  if (variant === "glass") {
    return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" className="flex min-h-screen items-center justify-center pt-20" background="gradient">
      <${motionDiv} ${framerAttrs} className="mx-auto max-w-2xl text-center">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl shadow-black/10 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative space-y-6">
            ${subheading ? `<p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">${subheading}</p>` : ""}
            <h1 id="${section.id}-heading" className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              ${heading}
            </h1>
            ${body ? `<p className="mx-auto max-w-xl text-lg leading-relaxed text-foreground/60">${body}</p>` : ""}
            <div className="flex flex-wrap justify-center gap-4">
              ${ctaButtons}
            </div>
          </div>
        </div>
      </${motionDiv}>
    </SectionWrapper>
  );
}`;
  }

  if (variant === "animated-gradient") {
    return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" className="flex min-h-screen items-center justify-center pt-20" background="mesh">
      <${motionDiv} ${framerAttrs} className="mx-auto max-w-3xl text-center space-y-8">
        ${subheading ? `<p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">${subheading}</p>` : ""}
        <h1 id="${section.id}-heading" className="relative text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent animate-pulse">
            ${heading}
          </span>
        </h1>
        ${body ? `<p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/60">${body}</p>` : ""}
        <div className="flex flex-wrap justify-center gap-4">
          ${ctaButtons}
        </div>
      </${motionDiv}>
    </SectionWrapper>
  );
}`;
  }

  // Default: centered hero
  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { ArrowDown } from "lucide-react";
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" className="flex min-h-screen items-center justify-center pt-20">
      <${motionDiv} ${framerAttrs} className="mx-auto max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          ${subheading || "AI Generated Portfolio"}
        </div>
        <h1 id="${section.id}-heading" className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            ${heading}
          </span>
        </h1>
        ${body ? `<p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/60 md:text-xl">${body}</p>` : ""}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          ${ctaButtons}
        </div>
        <div className="pt-8">
          <a href="#about" aria-label="Scroll down" className="inline-flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground/40 backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-primary">
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </${motionDiv}>
    </SectionWrapper>
  );
}`;
}

function getAboutSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "About";
  const body = sectionContent?.body || "";

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  if (section.variant === "minimal") {
    return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="dots">
      <${motionDiv} ${framerAttrs} className="mx-auto max-w-3xl text-center space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">About</p>
        <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">${heading}</h2>
        ${body ? `<p className="text-lg leading-relaxed text-foreground/60">${body}</p>` : ""}
      </${motionDiv}>
    </SectionWrapper>
  );
}`;
  }

  // Default: split layout
  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="muted">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <${motionDiv} ${framerAttrs} className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">About</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">${heading}</h2>
          ${body ? `<p className="text-lg leading-relaxed text-foreground/60">${body}</p>` : ""}
          <div className="flex gap-4">
            <a href="#contact" className="${premiumButton("primary")}">Get in Touch</a>
            <a href="#projects" className="${premiumButton("ghost")}">View Work</a>
          </div>
        </${motionDiv}>
        <${motionDiv} ${framerAttrs} className="relative">
          <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-1 md:h-96 md:w-96">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background">
              <div className="text-center">
                <div className="text-8xl font-bold text-foreground/10">✦</div>
              </div>
            </div>
          </div>
        </${motionDiv}>
      </div>
    </SectionWrapper>
  );
}`;
}

function getSkillsSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "Skills";
  const skills = sectionContent?.data?.skills || [];

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  const skillItems = skills.length > 0
    ? skills.map(s => `{ name: "${s.name}", level: ${s.level || 80} }`).join(",\n    ")
    : `{ name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Tailwind CSS", level: 88 },
    { name: "Next.js", level: 85 },
    { name: "UI/UX Design", level: 75 }`;

  if (section.variant === "bars") {
    return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

const skills = [
  ${skillItems}
];

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="dots">
      <${motionDiv} ${framerAttrs} className="mx-auto max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Expertise</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
        </div>
        <div className="space-y-6">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-foreground/40">{skill.level}%</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-foreground/5">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: \`\${skill.level}%\` }}
                />
              </div>
            </div>
          ))}
        </div>
      </${motionDiv}>
    </SectionWrapper>
  );
}`;
  }

  // Default: premium glass grid cards
  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

const skills = [
  ${skillItems}
];

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="grid">
      <div className="space-y-12">
        <${motionDiv} ${framerAttrs} className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Expertise</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
        </${motionDiv}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, i) => (
            <${motionDiv}
              key={skill.name}
              ${isFramer ? `initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}` : ""}
              className="${premiumCard("glass")}"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-sm font-bold">{skill.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: \`\${skill.level}%\` }}
                    />
                  </div>
                </div>
              </div>
            </${motionDiv}>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}`;
}

function getProjectsSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "Projects";
  const projects = sectionContent?.data?.projects || [];

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  const projectItems = projects.length > 0
    ? projects.map(p => `{ title: "${p.title || 'Project'}", description: "${p.description || 'A project description.'}", tags: ${JSON.stringify(p.tags || [])} }`).join(",\n    ")
    : `{ title: "Project One", description: "A modern web application built with React and TypeScript.", tags: ["React", "TypeScript", "Tailwind"] },
    { title: "Project Two", description: "Full-stack application with Next.js and PostgreSQL.", tags: ["Next.js", "PostgreSQL", "Prisma"] },
    { title: "Project Three", description: "Mobile-first responsive dashboard with real-time data.", tags: ["React", "D3", "WebSocket"] }`;

  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { ExternalLink, Github } from "lucide-react";
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

const projects = [
  ${projectItems}
];

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="muted">
      <div className="space-y-12">
        <${motionDiv} ${framerAttrs} className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Work</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
        </${motionDiv}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <${motionDiv}
              key={project.title}
              ${isFramer ? `initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}` : ""}
              className="${premiumCard("glass")} flex flex-col"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-white/5">
                <span className="text-4xl font-bold text-foreground/10">{project.title.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60">{project.description}</p>
              {project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary/80 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-3 pt-4 border-t border-white/5">
                <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 transition-colors hover:text-foreground">
                  <Github className="h-3.5 w-3.5" />
                  Code
                </a>
                <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 transition-colors hover:text-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Demo
                </a>
              </div>
            </${motionDiv}>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}`;
}

function getTestimonialsSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "Testimonials";
  const testimonials = sectionContent?.data?.testimonials || [];

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  const testimonialItems = testimonials.length > 0
    ? testimonials.map(t => `{ quote: "${t.quote || 'Great work!'}", author: "${t.author || 'Client'}", role: "${t.role || 'Client'}" }`).join(",\n    ")
    : `{ quote: "An exceptional developer who delivered beyond expectations.", author: "Sarah Johnson", role: "CEO, TechStart" },
    { quote: "Incredible attention to detail and a true passion for great design.", author: "Michael Chen", role: "Design Director" },
    { quote: "One of the best collaborations we've had. Highly recommended.", author: "Emily Rodriguez", role: "Product Manager" }`;

  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { Quote } from "lucide-react";
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

const testimonials = [
  ${testimonialItems}
];

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="gradient">
      <div className="space-y-12">
        <${motionDiv} ${framerAttrs} className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Testimonials</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
        </${motionDiv}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          ${testimonialItems.length > 0 ? `{testimonials.map((t, i) => (
            <${motionDiv}
              key={t.author}
              ${isFramer ? `initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}` : ""}
              className="${premiumCard("glass")}"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/30" />
              <p className="text-sm leading-relaxed text-foreground/70">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-foreground/40">{t.role}</p>
                </div>
              </div>
            </${motionDiv}>
          ))}` : `<p className="text-center text-foreground/40 col-span-full">No testimonials yet.</p>`}
        </div>
      </div>
    </SectionWrapper>
  );
}`;
}

function getExperienceSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "Experience";
  const experiences = sectionContent?.data?.experiences || [];

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  const expItems = experiences.length > 0
    ? experiences.map(e => `{ role: "${e.role || 'Developer'}", company: "${e.company || 'Company'}", period: "${e.period || '2023 - Present'}", description: "${e.description || 'Working on exciting projects.'}" }`).join(",\n    ")
    : `{ role: "Senior Developer", company: "Tech Corp", period: "2023 - Present", description: "Leading frontend development team building modern web applications." },
    { role: "Full Stack Developer", company: "StartupXYZ", period: "2021 - 2023", description: "Built and scaled the core product from MVP to production." },
    { role: "Junior Developer", company: "AgencyCo", period: "2019 - 2021", description: "Developed client websites and internal tools." }`;

  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

const experiences = [
  ${expItems}
];

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="grid">
      <div className="space-y-12">
        <${motionDiv} ${framerAttrs} className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Career</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
        </${motionDiv}>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <${motionDiv}
                key={i}
                ${isFramer ? `initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}` : ""}
                className="relative pl-16"
              >
                <div className="absolute left-4 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <div className="${premiumCard("glass")}">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary/80">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">{exp.description}</p>
                </div>
              </${motionDiv}>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}`;
}

function getContactSection(section: OptimizedSection, ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || "Get in Touch";
  const body = sectionContent?.body || "Have a project in mind? Let's build something great together.";
  const email = sectionContent?.data?.email || "hello@example.com";

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="mesh">
      <div className="space-y-12">
        <${motionDiv} ${framerAttrs} className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Contact</p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
          <p className="mx-auto max-w-lg text-foreground/60">${body}</p>
        </${motionDiv}>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <${motionDiv} ${framerAttrs}>
            <div className="${premiumCard("glass")} space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/40">Email</p>
                  <a href="mailto:${email}" className="text-sm font-medium hover:text-primary transition-colors">${email}</a>
                </div>
              </div>
            </div>
          </${motionDiv}>
          <${motionDiv} ${framerAttrs}>
            <div className="${premiumCard("glass")} p-8">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder-foreground/30 backdrop-blur-sm transition-colors focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder-foreground/30 backdrop-blur-sm transition-colors focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder-foreground/30 backdrop-blur-sm transition-colors focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
                />
                <button type="submit" className="${premiumButton("glow")} w-full">
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </${motionDiv}>
        </div>
      </div>
    </SectionWrapper>
  );
}`;
}

function composeSection(ctx: GeneratorContext, section: OptimizedSection): string {
  const sectionGenerators = {
    hero: getHeroSection,
    about: getAboutSection,
    skills: getSkillsSection,
    projects: getProjectsSection,
    testimonials: getTestimonialsSection,
    experience: getExperienceSection,
    contact: getContactSection,
  };

  if (sectionGenerators[section.id]) {
    return sectionGenerators[section.id](section, ctx);
  }

  // Fallback: generic section
  const animLib = ctx.manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const sectionContent = ctx.manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || section.name;
  const body = sectionContent?.body || "";

  const motionDiv = isFramer ? "motion.div" : "div";
  const framerAttrs = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  return `"use client";

${isFramer ? `import { motion } from "framer-motion";` : ""}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
  return (
    <SectionWrapper id="${section.id}" background="muted">
      <div className="space-y-6 text-center">
        <${motionDiv} ${framerAttrs}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">${section.name}</p>
          <h2 id="${section.id}-heading" className="mt-4 text-3xl font-bold leading-tight md:text-4xl">${heading}</h2>
          ${body ? `<p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">${body}</p>` : ""}
        </${motionDiv}>
      </div>
    </SectionWrapper>
  );
}`;
}

function generateSectionComponents(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;
  const files: GeneratedFile[] = [];

  for (const section of manifest.optimizedSections) {
    const content = composeSection(ctx, section);
    files.push({ path: `${ctx.componentsDir}/sections/${section.id}.tsx`, content, type: "section" });
  }

  return files;
}

export function generateAllComponents(ctx: GeneratorContext): GeneratedFile[] {
  return [
    generateNavbar(ctx),
    generateFooter(ctx),
    generateSectionWrapper(ctx),
    ...generateSectionComponents(ctx),
  ];
}
