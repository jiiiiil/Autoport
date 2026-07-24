import type { SectionRequirement, Restriction } from "./types";

const SECTION_KEYWORDS: Record<string, string[]> = {
  hero: ["hero", "header", "landing", "intro", "banner", "main"],
  about: ["about", "bio", "biography", "introduction", "who am i", "about me"],
  skills: ["skills", "expertise", "technologies", "tech stack", "proficiencies"],
  projects: ["projects", "work", "portfolio", "showcase", "case studies"],
  experience: ["experience", "work history", "employment", "career"],
  education: ["education", "academic", "university", "degree", "studies"],
  certifications: ["certifications", "certificates", "credentials", "licenses"],
  achievements: ["achievements", "awards", "accomplishments", "milestones"],
  contact: ["contact", "get in touch", "reach out", "email me"],
  testimonials: ["testimonials", "reviews", "feedback", "what people say"],
  blog: ["blog", "articles", "posts", "writing", "publications"],
  gallery: ["gallery", "photos", "images", "visuals"],
  services: ["services", "offerings", "what i do", "solutions"],
  pricing: ["pricing", "plans", "rates", "packages"],
  faq: ["faq", "frequently asked", "questions"],
  timeline: ["timeline", "journey", "roadmap", "milestones"],
  stats: ["stats", "statistics", "numbers", "metrics"],
  team: ["team", "people", "members", "founders"],
};

const SECTION_OVERRIDES: Record<string, string[]> = {
  hero: ["no hero", "skip hero", "remove hero", "without hero"],
  footer: ["no footer", "skip footer", "remove footer", "without footer"],
  about: ["no about", "skip about", "remove about", "without about"],
  contact: ["no contact", "skip contact", "remove contact", "without contact"],
};

export function detectSections(prompt: string): SectionRequirement[] {
  const lower = prompt.toLowerCase();
  const sections: SectionRequirement[] = [];

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    const isForbidden = (SECTION_OVERRIDES[section] ?? []).some((kw) => lower.includes(kw));

    if (isForbidden) {
      sections.push({
        name: section,
        type: "forbidden",
        description: `User explicitly requested no ${section} section`,
      });
      continue;
    }

    const mentioned = keywords.some((kw) => lower.includes(kw));
    if (mentioned) {
      sections.push({
        name: section,
        type: "required",
        description: `User mentioned ${section} in prompt`,
      });
    }
  }

  return sections;
}

export function detectRestrictions(prompt: string): Restriction[] {
  const restrictions: Restriction[] = [];
  const lower = prompt.toLowerCase();

  const forbiddenPatterns = [
    { pattern: /\b(?:do not|don't|no|without|avoid|never)\s+(use\s+)?(tailwind|css|scss|sass|less)/i, target: "styling" },
    { pattern: /\b(?:do not|don't|no|without|avoid|never)\s+(use\s+)?(react|vue|angular|next|svelte)/i, target: "framework" },
    { pattern: /\b(?:do not|don't|no|without|avoid|never)\s+(use\s+)?(gsap|framer|motion|animation)/i, target: "animation" },
    { pattern: /\b(?:do not|don't|no|without|avoid|never)\s+(use\s+)?(bootstrap|material|antd|chakra)/i, target: "ui-library" },
    { pattern: /\b(?:do not|don't|no|without|avoid|never)\s+(use\s+)?(cards?|card layout)/i, target: "layout" },
    { pattern: /\bno\s+animations?\b/i, target: "animation" },
    { pattern: /\bno\s+animations?\b/i, target: "animation" },
    { pattern: /\bstatic\b.*\bonly\b/i, target: "animation" },
    { pattern: /\b(?:only|must use|require)\s+(react|vue|angular|next)/i, target: "framework" },
    { pattern: /\b(?:only|must use|require)\s+(typescript|javascript)/i, target: "language" },
    { pattern: /\b(?:only|must use|require)\s+(tailwind|css|scss)/i, target: "styling" },
    { pattern: /\bdark\s+theme\s+only\b/i, target: "theme" },
    { pattern: /\blight\s+theme\s+only\b/i, target: "theme" },
    { pattern: /\bno\s+sidebar\b/i, target: "layout" },
    { pattern: /\bno\s+footer\b/i, target: "layout" },
    { pattern: /\bno\s+header\b/i, target: "layout" },
    { pattern: /\bno\s+navigation\b/i, target: "layout" },
    { pattern: /\bsingle\s+page\b/i, target: "layout" },
    { pattern: /\bno\s+images?\b/i, target: "media" },
  ];

  for (const fp of forbiddenPatterns) {
    if (fp.pattern.test(lower)) {
      const isRequired = /\b(?:only|must use|require)\b/.test(lower);
      restrictions.push({
        type: isRequired ? "required" : "forbidden",
        target: fp.target,
        description: fp.pattern.exec(lower)?.[0] ?? "",
      });
    }
  }

  return restrictions;
}
