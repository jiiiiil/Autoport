import type { ResumeJSON, AnimationLevel, PortfolioStrategy, ThemeName, ResumeExperience } from "./types";
import type {
  CompositionGraph, ComposedSection, ComposedLayout, ComposedNavigation,
  ComposedTheme, ComposedMotion, ComposedComponent, ComposedResponsive,
  ComposedAccessibility, CompositionMetadata, LayoutStyle as CompLayoutStyle,
} from "@/server/ai/composition/types";
import type { AIContextObject, Profession } from "@/server/ai/intelligence/types";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { getThemePreset, applyCustomThemeColors } from "./themes";
import { generatePortfolioStrategy } from "./strategy";
import { slugify } from "@/server/utils/string";

export interface PortfolioBlueprintResult {
  composition: CompositionGraph;
  portfolioData: PortfolioObject;
  strategy: PortfolioStrategy;
  sectionOrder: string[];
}

interface SectionMeta {
  id: string;
  variant: string;
  priority: number;
  role: string;
  weight: "primary" | "secondary" | "tertiary" | "accent";
}

function pickLayout(strategy: PortfolioStrategy): CompLayoutStyle {
  switch (strategy.portfolioType) {
    case "developer":
    case "ai-engineer":
      return "bento";
    case "designer":
      return "creative";
    case "founder":
      return "landing-sections";
    case "researcher":
      return "editorial";
    case "student":
      return "minimal";
    default:
      return "split";
  }
}

function pickNavigation(layoutStyle: string): string {
  if (layoutStyle === "editorial" || layoutStyle === "magazine" || layoutStyle === "newspaper") return "pills";
  if (layoutStyle === "bento") return "glass";
  if (layoutStyle === "creative") return "floating";
  return "floating";
}

function pickHeroVariant(strategy: PortfolioStrategy, hasSummary: boolean): string {
  if (strategy.portfolioType === "developer" || strategy.portfolioType === "ai-engineer") return "terminal";
  if (strategy.portfolioType === "designer") return "split";
  if (strategy.portfolioType === "founder") return "split";
  if (hasSummary) return "editorial";
  return "centered";
}

function pickBackgroundStyle(strategy: PortfolioStrategy): string {
  if (strategy.portfolioType === "developer" || strategy.portfolioType === "ai-engineer") return "grid";
  if (strategy.portfolioType === "researcher") return "flat";
  return "mesh-gradient";
}

function buildMotion(level: AnimationLevel): ComposedMotion {
  const base = {
    hero: { type: "fade-up", duration: "0.8s", easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", stagger: "0.12s" },
    sections: { enter: "fade-up", exit: "fade-down", stagger: "0.1s" },
    cards: { hover: "translateY(-4px)", focus: "scale(1.02)", tap: "scale(0.98)" },
    pageTransitions: { enabled: false, type: "fade", duration: "0.3s" },
    reducedMotionFallback: "opacity 0.5s ease",
  };

  if (level === "minimal") {
    return {
      style: "minimal",
      library: "gsap",
      intensity: "subtle",
      ...base,
      microInteractions: ["hover-lift"],
      scroll: { enabled: false, type: "none", trigger: "window", offset: "0 0.1" },
      gsap: {
        textReveal: false, fadeReveal: true, imageReveal: false, sectionPinning: false,
        parallax: false, floatingElements: false, magneticButtons: false,
        cursorInteraction: false, cardHoverMotion: true, smoothScroll: false,
      },
    };
  }

  if (level === "heavy") {
    return {
      style: "gsap-heavy",
      library: "gsap",
      intensity: "heavy",
      ...base,
      microInteractions: ["magnetic-buttons", "cursor-glow", "tilt-cards", "hover-lift", "text-marquee"],
      scroll: { enabled: true, type: "ScrollTrigger", trigger: "section", offset: "top 80%" },
      gsap: {
        textReveal: true, fadeReveal: true, imageReveal: true, sectionPinning: true,
        parallax: true, floatingElements: true, magneticButtons: true,
        cursorInteraction: true, cardHoverMotion: true, smoothScroll: true,
      },
    };
  }

  return {
    style: "micro-interactions",
    library: "gsap",
    intensity: "moderate",
    ...base,
    microInteractions: ["magnetic-buttons", "hover-lift", "fade-reveal"],
    scroll: { enabled: true, type: "ScrollTrigger", trigger: "section", offset: "top 85%" },
    gsap: {
      textReveal: false, fadeReveal: true, imageReveal: true, sectionPinning: false,
      parallax: false, floatingElements: true, magneticButtons: true,
      cursorInteraction: false, cardHoverMotion: true, smoothScroll: true,
    },
  };
}

function buildAccessibility(motion: ComposedMotion): ComposedAccessibility {
  return {
    semanticHTML: true,
    ariaLabels: true,
    keyboardNavigation: true,
    focusManagement: true,
    reducedMotion: motion.intensity === "none" || motion.intensity === "subtle",
    colorContrast: "AA",
    screenReader: true,
    skipLinks: true,
    headingHierarchy: true,
    altTextRequired: true,
    landmarkRegions: true,
  };
}

function buildResponsive(): ComposedResponsive {
  return {
    strategy: "mobile-first",
    breakpoints: [
      { name: "mobile", minWidth: "0px", maxWidth: "639px", columns: 4, gutter: "1rem", sectionPadding: "3rem 1rem", fontSize: { heading: "1.875rem", subheading: "1.25rem", body: "1rem", small: "0.875rem" }, layout: "stacked", navigation: "bottom", gridColumns: 4 },
      { name: "tablet", minWidth: "640px", maxWidth: "1023px", columns: 8, gutter: "1.5rem", sectionPadding: "4rem 1.5rem", fontSize: { heading: "2.5rem", subheading: "1.5rem", body: "1rem", small: "0.875rem" }, layout: "two-column", navigation: "top", gridColumns: 8 },
      { name: "desktop", minWidth: "1024px", columns: 12, gutter: "2rem", sectionPadding: "6rem 2rem", fontSize: { heading: "3.5rem", subheading: "1.75rem", body: "1.125rem", small: "0.9rem" }, layout: "adaptive", navigation: "top", gridColumns: 12 },
    ],
    containerMaxWidth: "1280px",
    mobileFirst: true,
    fluidTypography: true,
    adaptiveLayouts: {},
  };
}

function buildSectionMeta(resume: ResumeJSON, strategy: PortfolioStrategy): SectionMeta[] {
  const meta: SectionMeta[] = [];

  meta.push({ id: "hero", variant: pickHeroVariant(strategy, !!resume.personal.summary), priority: 1, role: "First impression — name, headline and CTA", weight: "primary" });

  if (resume.personal.summary) {
    meta.push({ id: "about", variant: strategy.portfolioType === "researcher" ? "editorial" : "split", priority: 2, role: "Professional summary and narrative", weight: "secondary" });
  }

  const hasProjects = resume.projects.length > 0;
  if (hasProjects) {
    const projectVariant = strategy.portfolioType === "founder" ? "case-study"
      : strategy.portfolioType === "researcher" ? "case-study"
      : resume.projects.length >= 3 ? "bento"
      : "card";
    meta.push({ id: "projects", variant: projectVariant, priority: strategy.portfolioType === "developer" || strategy.portfolioType === "designer" ? 2 : 4, role: "Proof of work", weight: "primary" });
  }

  if (resume.experience.length > 0) {
    meta.push({ id: "experience", variant: resume.experience.length <= 2 ? "card" : "timeline", priority: 3, role: "Career trajectory", weight: "secondary" });
  }

  if (resume.skills.length > 0 || resume.technologies.length > 0) {
    const skillVariant = strategy.portfolioType === "designer" ? "cards"
      : strategy.careerLevel === "senior" || strategy.careerLevel === "lead" ? "bars"
      : "cards";
    meta.push({ id: "skills", variant: skillVariant, priority: 4, role: "Competencies", weight: "secondary" });
  }

  meta.push({ id: "metrics", variant: "card", priority: 4, role: "Quantified highlights", weight: "secondary" });

  if (resume.education.length > 0) {
    meta.push({ id: "education", variant: "card", priority: 5, role: "Academic background", weight: "tertiary" });
  }

  if (resume.certifications.length > 0) {
    meta.push({ id: "certifications", variant: "card", priority: 6, role: "Verified credentials", weight: "tertiary" });
  }

  if (resume.achievements.length > 0) {
    meta.push({ id: "achievements", variant: "card", priority: 7, role: "Notable results", weight: "tertiary" });
  }

  if (resume.awards.length > 0) {
    meta.push({ id: "awards", variant: "card", priority: 8, role: "Recognition", weight: "tertiary" });
  }

  if (resume.publications.length > 0) {
    meta.push({ id: "publications", variant: "magazine", priority: 8, role: "Published work", weight: "tertiary" });
  }

  if (resume.organizations.length > 0 || resume.volunteerExperience.length > 0) {
    meta.push({ id: "organizations", variant: "card", priority: 9, role: "Leadership and community involvement", weight: "tertiary" });
  }

  if (resume.languages.length > 0) {
    meta.push({ id: "languages", variant: "minimal", priority: 10, role: "Spoken languages", weight: "tertiary" });
  }

  if (resume.personal.github || resume.personal.linkedin || resume.personal.website) {
    meta.push({ id: "socialLinks", variant: "minimal", priority: 11, role: "Connect elsewhere", weight: "accent" });
  }

  meta.push({ id: "contact", variant: "split", priority: 12, role: "Ways to reach out", weight: "accent" });

  return meta.sort((a, b) => a.priority - b.priority);
}

function sectionDesignDirectives(m: SectionMeta): NonNullable<ComposedSection["design"]> {
  const base = {
    hierarchy: "standard" as const,
    cardStyle: "default" as const,
    density: "balanced" as const,
    whitespace: "medium" as const,
    decor: [] as string[],
    content: {
      eyebrow: undefined as string | undefined,
      subtitle: undefined as string | undefined,
      showMetrics: false,
      showHighlights: false,
      showTechnologies: false,
      showActions: false,
      align: "center" as const,
    },
  };

  switch (m.id) {
    case "hero":
      return { ...base, hierarchy: "hero-focused", whitespace: "large", decor: ["gradient-orbs", "scroll-hint"] };
    case "about":
      return {
        ...base,
        cardStyle: "default",
        density: "spacious",
        content: { ...base.content, eyebrow: "About", subtitle: sectionSubtitle(m.id), showMetrics: true, showHighlights: true, showActions: false, align: "left" },
      };
    case "projects":
      return {
        ...base,
        cardStyle: "elevated",
        whitespace: "large",
        content: { ...base.content, eyebrow: "Portfolio", subtitle: sectionSubtitle(m.id), showActions: true, align: "center" },
      };
    case "skills":
      return {
        ...base,
        cardStyle: "default",
        content: { ...base.content, eyebrow: "Expertise", subtitle: sectionSubtitle(m.id), showMetrics: true, align: "center" },
      };
    case "experience":
      return {
        ...base,
        cardStyle: "glass",
        content: { ...base.content, eyebrow: "Career", subtitle: sectionSubtitle(m.id), showHighlights: true, showTechnologies: true, align: "center" },
      };
    case "metrics":
      return { ...base, density: "dense", whitespace: "compact", content: { ...base.content, showMetrics: true, align: "center" } };
    case "education":
      return { ...base, cardStyle: "glass", content: { ...base.content, eyebrow: "Academics", subtitle: sectionSubtitle("education"), align: "center" } };
    case "contact":
      return { ...base, whitespace: "large", content: { ...base.content, eyebrow: "Contact", subtitle: sectionSubtitle("contact"), showActions: true, align: "center" } };
    default:
      return base;
  }
}

function sectionSubtitle(id: string): string {
  switch (id) {
    case "about": return "The story behind the work and the person making it.";
    case "skills": return "The tools and technologies I use to bring ideas to life.";
    case "projects": return "Selected work — products and experiences built end to end.";
    case "experience": return "Where I have worked and what I delivered along the way.";
    case "education": return "The foundations that shaped how I think and build.";
    case "contact": return "Have an idea in mind? Let's make it real.";
    default: return "";
  }
}

function buildSections(meta: SectionMeta[]): ComposedSection[] {
  return meta.map((m) => ({
    id: m.id,
    name: m.id.charAt(0).toUpperCase() + m.id.slice(1),
    componentName: `${m.id.charAt(0).toUpperCase() + m.id.slice(1)}Section`,
    type: "required" as const,
    storytellingRole: m.role,
    priority: m.priority,
    variant: m.variant,
    layout: "section",
    interaction: "scroll",
    animation: "fade-up",
    accessibility: "aria-labelledby",
    responsive: { desktop: "full", tablet: "stacked", mobile: "stacked-compact" },
    contentRequirements: ["rich-text", "media-optional"],
    visualWeight: m.weight,
    metadata: {},
    design: sectionDesignDirectives(m),
  }));
}

function buildLayout(strategy: PortfolioStrategy, sectionOrder: string[], motion: ComposedMotion): ComposedLayout {
  const style = pickLayout(strategy);
  return {
    style,
    sectionOrder,
    gridStrategy: style === "bento" ? "bento-grid" : style === "creative" ? "asymmetric-12-col" : style === "editorial" ? "editorial-12-col" : "single-column",
    containerWidth: "1280px",
    verticalRhythm: "1.6",
    sectionSpacing: motion.intensity === "heavy" ? "7rem 2rem" : "5rem 2rem",
    padding: { desktop: "6rem 2rem", tablet: "4rem 1.5rem", mobile: "3rem 1rem" },
    maxWidth: "1280px",
    backgroundStrategy: pickBackgroundStyle(strategy),
    visualHierarchy: ["hero", "projects", "experience", "contact"],
  };
}

function buildNavigation(strategy: PortfolioStrategy, sectionOrder: string[]): ComposedNavigation {
  const style = pickNavigation(pickLayout(strategy));
  return {
    style: style as ComposedNavigation["style"],
    position: style === "sidebar" ? "fixed-left" : "top",
    sections: sectionOrder,
    mobileBehavior: "hamburger",
    scrollBehavior: "hide-on-scroll-down",
    visualStyle: { rounded: "full", backdrop: "blur", border: "subtle" },
    overlay: false,
    transparent: true,
    backdropFilter: "blur(16px)",
  };
}

function buildAIContext(name: string, strategy: PortfolioStrategy, technologies: string[]): AIContextObject {
  const profession: Profession =
    strategy.portfolioType === "developer" ? "developer" :
    strategy.portfolioType === "designer" ? "ui-designer" :
    strategy.portfolioType === "ai-engineer" ? "ai-engineer" :
    strategy.portfolioType === "researcher" ? "researcher" :
    strategy.portfolioType === "founder" ? "startup" :
    strategy.portfolioType === "student" ? "student" : "developer";

  const sectionNames = ["hero", "about", "skills", "projects", "experience", "education", "certifications", "achievements", "awards", "publications", "organizations", "languages", "socialLinks", "contact"];

  return {
    rawPrompt: `Resume portfolio for ${name}`,
    normalizedPrompt: `Resume portfolio for ${name}`,
    intent: {
      objective: strategy.rationale,
      portfolioGoal: strategy.rationale,
      targetAudience: strategy.audience,
      tone: "professional",
    },
    profession,
    frameworks: [],
    primaryFramework: "react",
    languages: [],
    primaryLanguage: "typescript",
    styling: [],
    primaryStyling: "tailwind",
    uiLibraries: [],
    animationLibraries: [{ name: "gsap", category: "animation", confidence: 1, explicit: true }],
    iconLibraries: [{ name: "react-icons", category: "icons", confidence: 1, explicit: true }],
    chartLibraries: [],
    otherLibraries: [],
    designLanguage: [{ name: "minimal", confidence: 0.8, explicit: false }],
    theme: "dark",
    sections: sectionNames.map((name) => ({ name, type: "optional" as const })),
    responsive: true,
    accessibility: true,
    seo: true,
    performance: true,
    pwa: false,
    animations: { enabled: true, intensity: "moderate", types: ["fade", "reveal"] },
    restrictions: [],
    dependencies: { all: ["react", "gsap", "tailwindcss", "react-icons"], conflicts: [] },
    missing: [],
    rawExtraction: { technologies, libraries: [], designReferences: [], keywords: [], numbers: [], urls: [] },
    metadata: { analyzedAt: new Date().toISOString(), promptLength: name.length, wordCount: 1, complexity: "moderate", confidence: 0.9 },
  };
}

function buildComponents(sections: ComposedSection[], navigationStyle: string, motion: ComposedMotion): ComposedComponent[] {
  const components: ComposedComponent[] = [
    {
      name: "Navigation",
      purpose: `Navigation bar (${navigationStyle})`,
      priority: 1,
      variant: navigationStyle,
      elements: ["logo", "links", "cta", "mobile-menu"],
      behavior: "sticky",
      animation: motion.gsap.magneticButtons ? "magnetic" : "none",
      accessibility: "nav landmark",
      responsive: { desktop: "inline", mobile: "hamburger" },
      visualWeight: "secondary",
      interactionType: "click",
      contentRules: {},
    },
  ];

  sections.forEach((s, i) => {
    components.push({
      name: s.componentName,
      purpose: s.storytellingRole,
      priority: i + 2,
      variant: s.variant,
      elements: ["heading", "content"],
      behavior: "scroll-reveal",
      animation: s.animation,
      accessibility: "section landmark",
      responsive: { desktop: "full", mobile: "stacked" },
      visualWeight: s.visualWeight,
      interactionType: "scroll",
      contentRules: {},
    });
  });

  return components;
}

function buildMetadata(): CompositionMetadata {
  return {
    composedAt: new Date().toISOString(),
    version: "1.0.0",
    promptHash: slugify("resume-intelligence"),
    confidence: 0.95,
    uniquenessScore: 0.9,
    constraintOverrides: ["resume-fidelity"],
    compositionTime: "deterministic",
    refinementApplied: false,
    validationPassed: true,
  };
}

function buildAboutMetrics(
  resume: ResumeJSON,
  role: string
): { label: string; value: string }[] {
  const metrics: { label: string; value: string }[] = [];

  const years = computeYears(resume.experience);
  if (years > 0) {
    metrics.push({ label: "Years Experience", value: `${years}+` });
  }

  if (resume.projects.length > 0) {
    metrics.push({ label: "Projects Shipped", value: `${resume.projects.length}` });
  }

  const techCount = new Set([
    ...resume.technologies,
    ...resume.skills.flatMap((g) => g.skills),
  ]).size;
  if (techCount > 0) {
    metrics.push({ label: "Technologies", value: `${techCount}` });
  }

  if (resume.certifications.length > 0) {
    metrics.push({ label: "Certifications", value: `${resume.certifications.length}` });
  }

  if (resume.languages.length > 0) {
    metrics.push({ label: "Languages", value: `${resume.languages.length}` });
  }

  if (metrics.length === 0) {
    metrics.push(
      { label: "Focus", value: role },
      { label: "Approach", value: "Detail-oriented" }
    );
  }

  return metrics.slice(0, 4);
}

function buildAboutStrengths(
  resume: ResumeJSON,
  role: string
): { label: string; detail?: string }[] {
  const strengths: { label: string; detail?: string }[] = [];

  const topSkills = resume.skills[0]?.skills ?? [];
  const firstTech = resume.technologies[0];
  if (topSkills.length >= 3) {
    strengths.push({ label: topSkills[0], detail: `Core focus across ${topSkills.length} strengths` });
    strengths.push({ label: topSkills[1], detail: "Applied in real-world work" });
  } else if (firstTech) {
    strengths.push({ label: firstTech, detail: "Primary toolkit" });
  }

  if (resume.projects.length > 0) {
    strengths.push({ label: "Project-driven", detail: `${resume.projects.length} shipped projects` });
  }

  if (resume.experience.some((e) => e.current)) {
    strengths.push({ label: "Currently active", detail: "Building in production today" });
  }

  if (resume.awards.length > 0 || resume.certifications.length > 0) {
    strengths.push({ label: "Recognized", detail: "Awards & certifications" });
  }

  if (strengths.length === 0) {
    strengths.push({ label: role, detail: "Professional focus" });
  }

  return strengths.slice(0, 4);
}

function computeYears(experience: ResumeExperience[]): number {
  let years = 0;
  for (const e of experience) {
    const start = e.startDate ? parseInt(e.startDate, 10) : NaN;
    const end = e.current
      ? new Date().getFullYear()
      : e.endDate
        ? parseInt(e.endDate, 10)
        : NaN;
    if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
      years += end - start;
    }
  }
  return years;
}

function buildPortfolioData(resume: ResumeJSON): PortfolioObject {
  const name = resume.personal.name ?? "Your Name";
  const role = resume.personal.role ?? resume.personal.headline ?? "Professional";
  const summary = resume.personal.summary ?? "";

  const sections: NonNullable<PortfolioObject["sections"]> = {};

  sections.hero = {
    headline: `Hi, I\u2019m ${name}`,
    subheadline: resume.personal.headline ?? role,
    ctaText: "View My Work",
    ctaLink: "#projects",
  };

  if (summary) {
    const sentences = summary.split(/(?<=[.!?])\s+/).filter(Boolean);
    const intro = sentences[0] ?? summary;
    const body = sentences.slice(1).join(" ") || summary;
    const technologies = resume.technologies.length > 0 ? resume.technologies : resume.skills.flatMap((g) => g.skills);

    sections.about = {
      title: "About Me",
      content: body,
      intro,
      highlights: (resume.achievements ?? []).slice(0, 4).map((a) => a.title).filter(Boolean),
      strengths: buildAboutStrengths(resume, role),
      metrics: buildAboutMetrics(resume, role),
    };

    void technologies;
  }

  if (resume.skills.length > 0 || resume.technologies.length > 0) {
    const groups = resume.skills.length > 0
      ? resume.skills
      : [{ name: "Skills", skills: resume.technologies }];

    sections.skills = groups.flatMap((g) =>
      g.skills.map((skill) => ({
        name: skill,
        category: g.name === "Skills" ? "Skills" : g.name,
      }))
    );

    const techOnly = resume.technologies.filter(
      (t) => !groups.some((g) => g.skills.some((s) => s.toLowerCase() === t.toLowerCase()))
    );
    for (const tech of techOnly) {
      sections.skills.push({ name: tech, category: "Technologies" });
    }
  }

  if (resume.projects.length > 0) {
    sections.projects = resume.projects.map((p) => ({
      title: p.name,
      description: p.description ?? (p.highlights && p.highlights.length > 0 ? p.highlights.join(". ") : undefined),
      tags: p.technologies ?? [],
      link: p.link,
      features: p.highlights && p.highlights.length > 0 ? p.highlights : undefined,
      liveUrl: p.link,
      repoUrl: p.githubUrl ?? p.link,
    }));
  }

  if (resume.experience.length > 0) {
    sections.experience = resume.experience.map((e) => ({
      company: e.company,
      role: e.title,
      startDate: e.startDate,
      endDate: e.current ? "Present" : e.endDate,
      description: e.description ?? undefined,
      current: e.current,
      highlights: e.highlights && e.highlights.length > 0 ? e.highlights : undefined,
      technologies: e.technologies && e.technologies.length > 0 ? e.technologies : undefined,
    }));
  }

  if (resume.education.length > 0) {
    sections.education = resume.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      startDate: e.startDate,
      endDate: e.endDate,
      description: [e.score, e.description].filter(Boolean).join(" "),
    }));
  }

  if (resume.certifications.length > 0) {
    sections.certifications = resume.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      link: c.link,
    }));
  }

  if (resume.achievements.length > 0) {
    sections.achievements = resume.achievements.map((a) => ({
      title: a.title,
      description: a.description,
      date: a.date,
    }));
  }

  if (resume.awards.length > 0) {
    sections.awards = resume.awards.map((a) => ({
      title: a.title,
      organization: a.organization,
      date: a.date,
      description: a.description,
    }));
  }

  if (resume.publications.length > 0) {
    sections.publications = resume.publications.map((p) => ({
      title: p.title,
      publisher: p.publisher,
      date: p.date,
      link: p.link,
    }));
  }

  if (resume.organizations.length > 0 || resume.volunteerExperience.length > 0) {
    const orgItems = resume.organizations.map((o) => ({
      title: o.name,
      description: [o.role, o.description].filter(Boolean).join(" · "),
      date: [o.startDate, o.endDate].filter(Boolean).join(" – "),
    }));
    const volunteerItems = resume.volunteerExperience.map((v) => ({
      title: v.organization,
      description: [v.role, v.description].filter(Boolean).join(" · "),
      date: [v.startDate, v.endDate].filter(Boolean).join(" – "),
    }));
    sections.organizations = [...orgItems, ...volunteerItems];
  }

  if (resume.languages.length > 0) {
    sections.languages = resume.languages.map((l) => ({
      name: l.language,
      proficiency: l.proficiency,
    }));
  }

  const socialLinks: { platform: string; url: string }[] = [];
  if (resume.personal.github) socialLinks.push({ platform: "GitHub", url: resume.personal.github });
  if (resume.personal.linkedin) socialLinks.push({ platform: "LinkedIn", url: resume.personal.linkedin });
  if (resume.personal.website) socialLinks.push({ platform: "Website", url: resume.personal.website });
  if (socialLinks.length > 0) sections.socialLinks = socialLinks;

  sections.contact = {
    email: resume.personal.email,
    phone: resume.personal.phone,
    location: resume.personal.location,
    availableFor: role,
  };

  sections.metrics = buildAboutMetrics(resume, role);

  return {
    personalInfo: {
      name,
      role,
      tagline: resume.personal.headline,
      bio: summary,
      email: resume.personal.email,
      location: resume.personal.location,
      tech: [...new Set(resume.technologies.concat(resume.skills.flatMap((g) => g.skills)))].slice(0, 8),
    },
    sections,
    theme: { mode: "dark" },
    layout: { style: "minimal" },
    navigation: {
      links: [],
      style: "pills",
    },
    seo: {
      title: `${name} — ${role}`,
      description: summary ? summary.slice(0, 160) : `${name}'s professional portfolio`,
      keywords: resume.technologies.slice(0, 12),
    },
  };
}

export function buildResumeBlueprint(
  resume: ResumeJSON,
  themeName: ThemeName,
  animationLevel: AnimationLevel,
  customColors?: { primary?: string; secondary?: string; accent?: string; background?: string; surface?: string; text?: string }
): PortfolioBlueprintResult {
  const strategy = generatePortfolioStrategy(resume);
  const meta = buildSectionMeta(resume, strategy);
  const sectionOrder = meta.map((m) => m.id);

  const sections = buildSections(meta);
  const motion = buildMotion(animationLevel);
  const layout = buildLayout(strategy, sectionOrder, motion);
  const navigation = buildNavigation(strategy, sectionOrder);
  const theme = getThemePreset(themeName);
  const finalTheme: ComposedTheme = customColors && themeName === "custom"
    ? applyCustomThemeColors(theme, customColors)
    : theme;

  const accessibility = buildAccessibility(motion);
  const responsive = buildResponsive();
  const components = buildComponents(sections, navigation.style, motion);
  const metadata = buildMetadata();

  const aiContext = buildAIContext(resume.personal.name ?? "User", strategy, resume.technologies);

  const tokens: Record<string, string> = {};
  for (const [key, value] of Object.entries(finalTheme.colors)) {
    tokens[`--color-${key}`] = value;
  }
  tokens["--font-heading"] = finalTheme.typography.headingFont;
  tokens["--font-body"] = finalTheme.typography.bodyFont;
  tokens["--font-mono"] = finalTheme.typography.monoFont;

  const composition: CompositionGraph = {
    prompt: `Resume-based portfolio for ${resume.personal.name ?? "user"}`,
    aiContext,
    blueprint: {
      portfolioType: `${strategy.portfolioType} portfolio`,
      targetAudience: strategy.audience,
      framework: "react",
      language: "typescript",
      styling: "tailwind",
      designLanguage: ["minimal"],
      profession: aiContext.profession,
      theme: "dark",
      libraries: { ui: "tailwind", animation: "gsap", icons: "react-icons", charts: "none" },
      folderStrategy: ["src/components", "src/sections", "src/lib", "src/hooks"],
      layout: { type: layout.style, sectionHierarchy: sectionOrder, gridStrategy: layout.gridStrategy, containerWidth: layout.containerWidth, verticalRhythm: layout.verticalRhythm },
      navigation: { variant: navigation.style, sections: navigation.sections, position: navigation.position, mobileBehavior: navigation.mobileBehavior, scrollBehavior: navigation.scrollBehavior },
      sections: sections.map((s) => ({ name: s.id, type: "required", description: s.storytellingRole, storytellingRole: s.storytellingRole, composition: { variant: s.variant, layout: s.layout, interaction: s.interaction, animation: s.animation } })),
      animations: { library: motion.library, intensity: motion.intensity, enabled: motion.intensity !== "none", pageTransitions: motion.pageTransitions.enabled, scrollAnimations: motion.scroll.enabled, microInteractions: motion.microInteractions.length > 0 },
      content: { intent: strategy.rationale, tone: "professional", voice: "first-person", storytelling: "narrative", sections: {} },
      seo: {
        title: `${resume.personal.name ?? "Portfolio"} — ${resume.personal.role ?? "Professional"}`,
        description: resume.personal.summary?.slice(0, 160) ?? "Professional portfolio",
        keywords: resume.technologies.slice(0, 10),
        canonical: "",
        openGraph: { title: `${resume.personal.name ?? "Portfolio"} — ${resume.personal.role ?? "Professional"}`, description: resume.personal.summary?.slice(0, 160) ?? "Professional portfolio", image: "" },
        twitter: { card: "summary_large_image", title: `${resume.personal.name ?? "Portfolio"}`, description: resume.personal.summary?.slice(0, 160) ?? "Professional portfolio" },
      },
      accessibility: { level: "AA", semanticHTML: true, ariaLabels: true, keyboardNavigation: true, focusManagement: true, reducedMotion: accessibility.reducedMotion, colorContrast: true, screenReader: true },
      performance: { lazyLoading: true, dynamicImports: true, imageOptimization: true, codeSplitting: true, treeShaking: true, prefetching: true, bundleAnalysis: false },
      designSystem: {
        tokens: {
          colors: Object.fromEntries(Object.entries(finalTheme.colors).filter(([, v]) => typeof v === "string" && v.startsWith("#"))),
          typography: { heading: finalTheme.typography.headingFont, body: finalTheme.typography.bodyFont },
          spacing: finalTheme.spacing,
          radius: finalTheme.radius,
          shadows: finalTheme.shadows,
          animation: {},
          breakpoints: Object.fromEntries(responsive.breakpoints.map((bp) => [bp.name, bp.minWidth])),
        },
        components: {},
      },
      metadata: { createdAt: new Date().toISOString(), version: "1.0.0", confidence: 0.95, uniqueness: 0.9 },
    },
    layout,
    sections,
    navigation,
    theme: finalTheme,
    motion,
    components,
    responsive,
    accessibility,
    story: {
      flow: "narrative",
      narrativeArc: ["introduce", "prove", "position", "connect"],
      sectionTransitions: {},
      storytellingDevices: motion.gsap.textReveal ? ["split-text", "scroll-reveal"] : ["scroll-reveal"],
    },
    tokens,
    metadata,
  };

  const portfolioData = buildPortfolioData(resume);

  return { composition, portfolioData, strategy, sectionOrder };
}
