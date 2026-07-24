import type { GeneratorContext, GeneratedFile } from "./types";
import type { OptimizedSection } from "../manifest/types";

function generateNavbar(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const nav = manifest.blueprint.navigation;
  const sections = nav.sections;

  const navLinks = sections.map((s) => {
    const label = s.charAt(0).toUpperCase() + s.slice(1);
    return `{ label: "${label}", href: "#${s}" }`;
  });

  const positionClasses: Record<string, string> = {
    fixed: "fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md",
    sticky: "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md",
    floating: "fixed top-4 left-1/2 z-50 w-[90%] max-w-4xl -translate-x-1/2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-md",
    minimal: "fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm",
    glass: "fixed top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl",
  };

  const navClasses = positionClasses[nav.variant] || positionClasses.fixed;

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
    <nav className="${navClasses}" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold text-primary">
          Portfolio
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-text-secondary transition-colors hover:text-primary"
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

  const socialLinks = Object.entries(social || {}).map(([platform, url]) => {
    const iconName = platform.charAt(0).toUpperCase() + platform.slice(1);
    return `{ icon: ${iconName}, href: "${url}", label: "${iconName}" }`;
  });

  const content = `"use client";

import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "${social?.github || 'https://github.com'}", label: "GitHub" },
  { icon: Linkedin, href: "${social?.linkedin || 'https://linkedin.com'}", label: "LinkedIn" },
  { icon: Twitter, href: "${social?.twitter || 'https://twitter.com'}", label: "Twitter" },
  { icon: Mail, href: "mailto:${manifest.blueprint.content.sections?.contact?.data?.email || 'hello@example.com'}", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-text-secondary transition-colors hover:text-primary"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} ${manifest.projectManifest.name}. All rights reserved.
          </p>
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
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("w-full py-20 md:py-28", className)}
      aria-labelledby={\`\${id}-heading\`}
    >
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}
`;
  return { path: `${ctx.componentsDir}/section-wrapper.tsx`, content, type: "component" };
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

function composeSection(ctx: GeneratorContext, section: OptimizedSection): string {
  const { manifest } = ctx;
  const animLib = manifest.blueprint.animations.library;
  const isFramer = animLib === "framer-motion";
  const isGsap = animLib === "gsap";

  const motionDiv = isFramer
    ? `import { motion } from "framer-motion";`
    : isGsap
    ? `import { useEffect, useRef } from "react";
import gsap from "gsap";`
    : "";

  const animWrapper = isFramer ? "motion.div" : "div";
  const animProps = isFramer
    ? `initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}`
    : "";

  const sectionContent = manifest.blueprint.content.sections?.[section.id];
  const heading = sectionContent?.heading || section.name;
  const subheading = sectionContent?.subheading || "";
  const body = sectionContent?.body || "";
  const cta = sectionContent?.cta || [];

  const ctaHtml = cta.map((c: { label: string; href: string }) => `
            <a
              href="${c.href}"
              className="rounded-lg bg-primary px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              ${c.label}
            </a>`).join("\n");

  const sectionData = section.content || {};

  return `"use client";

${motionDiv}
import { SectionWrapper } from "${ctx.componentsDir}/section-wrapper";

export function ${section.component}() {
${isGsap ? `  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    }
  }, []);` : ""}

  return (
    <SectionWrapper id="${section.id}"${section.id === "hero" ? ' className="flex min-h-[90vh] items-center pt-20"' : ""}>
      <${animWrapper} ${isFramer ? animProps : ""} ${isGsap ? `ref={ref}` : ""} className="w-full">
        <div className="flex flex-col gap-6${section.id === "hero" ? " items-center text-center" : ""}">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            ${subheading}
          </p>
          <h2 id="${section.id}-heading" className="text-3xl font-bold leading-tight md:text-4xl${section.id === "hero" ? " md:text-6xl lg:text-7xl" : ""}">
            ${heading}
          </h2>
          ${body ? `<p className="max-w-2xl text-lg text-text-secondary md:text-xl">${body}</p>` : ""}
          ${ctaHtml ? `<div className="flex gap-4">
            ${ctaHtml}
          </div>` : ""}
          ${section.id === "hero" ? `<a href="#about" aria-label="Scroll down" className="mt-8 animate-bounce">
            ↓
          </a>` : ""}
        </div>
      </${animWrapper}>
    </SectionWrapper>
  );
}
`;
}

export function generateAllComponents(ctx: GeneratorContext): GeneratedFile[] {
  return [
    generateNavbar(ctx),
    generateFooter(ctx),
    generateSectionWrapper(ctx),
    ...generateSectionComponents(ctx),
  ];
}
