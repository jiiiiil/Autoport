import type { AIContextObject, Restriction, SectionRequirement } from "../intelligence/types";
import type { PromptConstraints, ComposedLayout, ComposedNavigation, ComposedTheme, ComposedMotion } from "./types";

const SECTION_SYNONYM_MAP: Record<string, string[]> = {
  hero: ["hero", "landing", "intro", "opening", "header-section", "splash"],
  about: ["about", "bio", "biography", "who-i-am", "introduction", "me"],
  projects: ["projects", "work", "portfolio", "showcase", "case-studies", "creations"],
  skills: ["skills", "expertise", "technologies", "tech-stack", "proficiencies", "tools"],
  experience: ["experience", "work-history", "career", "employment", "background"],
  education: ["education", "academic", "studies", "degrees", "qualifications"],
  contact: ["contact", "reach-me", "get-in-touch", "hire-me", "connect", "email"],
  testimonials: ["testimonials", "reviews", "endorsements", "feedback", "references"],
  timeline: ["timeline", "journey", "history", "chronological", "roadmap"],
  gallery: ["gallery", "photos", "photography", "images", "visuals", "portfolio-grid"],
  publications: ["publications", "articles", "writing", "blog", "papers", "research"],
  awards: ["awards", "achievements", "honors", "recognitions"],
  certifications: ["certifications", "credentials", "licenses", "badges"],
  openSource: ["open-source", "oss", "github-projects", "contributions"],
  speaking: ["speaking", "talks", "presentations", "conference", "events"],
  community: ["community", "involvement", "volunteer", "mentorship"],
  services: ["services", "offerings", "what-i-do", "consulting"],
  clients: ["clients", "companies", "brands", "who-i-worked-with"],
  products: ["products", "saas", "apps", "applications", "tools-built"],
  metrics: ["metrics", "stats", "numbers", "impact", "results", "data"],
  faq: ["faq", "questions", "common-questions", "q-and-a"],
  roadmap: ["roadmap", "future-plans", "vision", "goals", "what-is-next"],
};

const LAYOUT_KEYWORDS: Record<string, string[]> = {
  magazine: ["magazine", "editorial", "newspaper", "publication", "journal"],
  timeline: ["timeline", "chronological", "journey", "history", "roadmap"],
  gallery: ["gallery", "photography", "photos", "visual", "grid-showcase"],
  storytelling: ["story", "narrative", "journey", "tale", "storytelling"],
  minimal: ["minimal", "clean", "simple", "stripped", "bare"],
  creative: ["creative", "artistic", "experimental", "bold", "avant-garde"],
  bento: ["bento", "card-grid", "mosaic", "tiled"],
  horizontal: ["horizontal", "scroll", "side-scroll", "horizontal-scroll"],
  cinematic: ["cinematic", "film", "movie", "dramatic", "theatrical"],
  asymmetric: ["asymmetric", "uneven", "off-grid", "broken-grid"],
  immersive: ["immersive", "full-screen", "fullscreen", "fullscreen-scroll"],
};

const NAVIGATION_KEYWORDS: Record<string, string[]> = {
  floating: ["floating", "floating-nav", "hovering"],
  sidebar: ["sidebar", "side-nav", "side-menu", "panel-nav"],
  dock: ["dock", "mac-dock", "app-dock", "bar-nav"],
  "magazine-toc": ["toc", "table-of-contents", "magazine-nav"],
  bottom: ["bottom", "bottom-nav", "mobile-nav", "tab-bar"],
  "horizontal-scroll": ["scroll-nav", "horizontal-nav", "scroll-menu"],
  progressive: ["progressive", "progressive-disclosure", "reveal-nav"],
  minimal: ["minimal-nav", "hamburger", "clean-nav"],
  transparent: ["transparent", "overlay-nav", "glass-nav"],
  none: ["no-nav", "navless", "without-navigation", "no-header"],
};

const MOTION_KEYWORDS: Record<string, string[]> = {
  "apple": ["apple", "ios", "smooth", "fluid", "elegant"],
  "editorial": ["editorial", "publication", "newspaper-animation"],
  "gsap-heavy": ["gsap", "greensock", "timeline-animation", "scroll-trigger"],
  "physics": ["physics", "spring", "bounce", "realistic"],
  "parallax": ["parallax", "depth", "layered-scroll", "scroll-depth"],
  "3d": ["3d", "three-dimensional", "webgl", "three-js", "3d-rotation"],
  "micro-interactions": ["micro-interaction", "hover-effect", "button-animation"],
  "experimental": ["experimental", "avant-garde", "unusual", "creative-motion"],
  "none": ["no-animation", "static", "no-motion", "without-animation"],
  "minimal": ["subtle", "minimal-animation", "understated", "gentle"],
};

const THEME_KEYWORDS: Record<string, string[]> = {
  dark: ["dark", "night", "midnight", "black", "dark-mode"],
  light: ["light", "bright", "white", "clean", "light-mode"],
  "dark-academic": ["dark-academic", "dark-scholar", "gothic-academic"],
  luxury: ["luxury", "premium", "gold", "elegant", "high-end"],
  cyberpunk: ["cyberpunk", "neon", "futuristic", "sci-fi", "cyber"],
  glassmorphism: ["glass", "glassmorphism", "frosted", "blur"],
  neumorphism: ["neumorphism", "soft-ui", "extruded", "inset"],
  retro: ["retro", "vintage", "nostalgic", "old-school"],
  brutalist: ["brutalist", "raw", "unpolished", "industrial"],
  playful: ["playful", "fun", "colorful", "whimsical", "cartoon"],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function detectKeywords(text: string, keywordMap: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const detected: string[] = [];
  for (const [key, keywords] of Object.entries(keywordMap)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        detected.push(key);
        break;
      }
    }
  }
  return detected;
}

function detectSectionMentions(text: string): string[] {
  const lower = text.toLowerCase();
  const sections: string[] = [];
  for (const [sectionId, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
    for (const syn of synonyms) {
      if (lower.includes(syn)) {
        sections.push(sectionId);
        break;
      }
    }
  }
  return sections;
}

function detectForbiddenSections(context: AIContextObject): string[] {
  const forbidden: string[] = [];
  for (const restriction of context.restrictions) {
    if (restriction.type === "forbidden") {
      const target = restriction.target.toLowerCase();
      for (const [sectionId, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
        if (target.includes(sectionId) || synonyms.some(s => target.includes(s))) {
          forbidden.push(sectionId);
        }
      }
    }
  }
  for (const section of context.sections) {
    if (section.type === "forbidden") {
      const name = section.name.toLowerCase();
      for (const [sectionId, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
        if (name.includes(sectionId) || synonyms.some(s => name.includes(s))) {
          if (!forbidden.includes(sectionId)) forbidden.push(sectionId);
        }
      }
    }
  }
  return forbidden;
}

function detectRequiredSections(context: AIContextObject): string[] {
  const required: string[] = [];
  for (const section of context.sections) {
    if (section.type === "required") {
      const name = section.name.toLowerCase();
      for (const [sectionId, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
        if (name.includes(sectionId) || synonyms.some(s => name.includes(s))) {
          if (!required.includes(sectionId)) required.push(sectionId);
        }
      }
    }
  }
  return required;
}

export function resolveConstraints(
  prompt: string,
  context: AIContextObject
): PromptConstraints {
  const forbidden: string[] = [];
  const required: string[] = [];
  const preferences: Record<string, string> = {};
  const overrides: Record<string, unknown> = {};

  const mentionedSections = detectSectionMentions(prompt);
  const forbiddenSections = detectForbiddenSections(context);
  const requiredSections = detectRequiredSections(context);

  for (const section of forbiddenSections) {
    forbidden.push(`section:${section}`);
  }
  for (const section of requiredSections) {
    required.push(`section:${section}`);
  }
  if (mentionedSections.length > 0 && requiredSections.length === 0) {
    for (const section of mentionedSections) {
      if (!forbiddenSections.includes(section)) {
        required.push(`section:${section}`);
      }
    }
  }

  const layoutMatches = detectKeywords(prompt, LAYOUT_KEYWORDS);
  for (const layout of layoutMatches) {
    preferences.layout = layout;
  }

  const navMatches = detectKeywords(prompt, NAVIGATION_KEYWORDS);
  for (const nav of navMatches) {
    preferences.navigation = nav;
  }

  const motionMatches = detectKeywords(prompt, MOTION_KEYWORDS);
  for (const motion of motionMatches) {
    preferences.motion = motion;
  }

  const themeMatches = detectKeywords(prompt, THEME_KEYWORDS);
  for (const theme of themeMatches) {
    preferences.theme = theme;
  }

  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes("no hero") || lowerPrompt.includes("without hero") || lowerPrompt.includes("skip hero")) {
    forbidden.push("section:hero");
  }
  if (lowerPrompt.includes("no footer") || lowerPrompt.includes("without footer")) {
    forbidden.push("section:footer");
  }
  if (lowerPrompt.includes("no about") || lowerPrompt.includes("without about")) {
    forbidden.push("section:about");
  }
  if (lowerPrompt.includes("no skills") || lowerPrompt.includes("without skills")) {
    forbidden.push("section:skills");
  }
  if (lowerPrompt.includes("no experience") || lowerPrompt.includes("without experience")) {
    forbidden.push("section:experience");
  }

  if (context.animations.enabled === false) {
    overrides.motionStyle = "none";
  }
  if (context.theme === "dark") {
    preferences.theme = preferences.theme || "dark";
  } else if (context.theme === "light") {
    preferences.theme = preferences.theme || "light";
  }

  if (context.designLanguage.length > 0) {
    const dlName = context.designLanguage[0].name;
    if (dlName === "magazine" || dlName === "editorial") {
      preferences.layout = preferences.layout || "magazine";
      preferences.navigation = preferences.navigation || "magazine-toc";
    } else if (dlName === "gallery") {
      preferences.layout = preferences.layout || "gallery";
    } else if (dlName === "brutalist") {
      preferences.motion = preferences.motion || "experimental";
    } else if (dlName === "minimal") {
      preferences.layout = preferences.layout || "minimal";
      preferences.motion = preferences.motion || "minimal";
    }
  }

  return { forbidden, required, preferences, overrides };
}

export function isSectionForbidden(sectionId: string, constraints: PromptConstraints): boolean {
  return constraints.forbidden.includes(`section:${sectionId}`);
}

export function isSectionRequired(sectionId: string, constraints: PromptConstraints): boolean {
  return constraints.required.includes(`section:${sectionId}`);
}

export function getPreferredLayout(constraints: PromptConstraints): string | undefined {
  return constraints.preferences.layout;
}

export function getPreferredNavigation(constraints: PromptConstraints): string | undefined {
  return constraints.preferences.navigation;
}

export function getPreferredMotion(constraints: PromptConstraints): string | undefined {
  return constraints.preferences.motion;
}

export function getPreferredTheme(constraints: PromptConstraints): string | undefined {
  return constraints.preferences.theme;
}

export function getPromptHash(prompt: string): string {
  const hash = hashString(prompt);
  return hash.toString(36);
}

export { SECTION_SYNONYM_MAP, LAYOUT_KEYWORDS, NAVIGATION_KEYWORDS, MOTION_KEYWORDS, THEME_KEYWORDS };
