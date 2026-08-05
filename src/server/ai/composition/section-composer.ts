import type { AIContextObject } from "../intelligence/types";
import type { PromptConstraints, ComposedSection } from "./types";
import { isSectionForbidden, isSectionRequired, SECTION_SYNONYM_MAP } from "./constraint-resolver";

interface SectionTemplate {
  id: string;
  name: string;
  componentName: string;
  defaultPriority: number;
  defaultVariant: string;
  defaultLayout: string;
  visualWeight: "primary" | "secondary" | "tertiary" | "accent";
  contentRequirements: string[];
  storytellingRole: string;
}

const SECTION_TEMPLATES: Record<string, SectionTemplate> = {
  hero: {
    id: "hero", name: "Hero", componentName: "HeroSection",
    defaultPriority: 1, defaultVariant: "centered", defaultLayout: "full-width",
    visualWeight: "primary", contentRequirements: ["headline", "tagline", "cta"],
    storytellingRole: "opening-hook",
  },
  about: {
    id: "about", name: "About", componentName: "AboutSection",
    defaultPriority: 2, defaultVariant: "split", defaultLayout: "2-col",
    visualWeight: "primary", contentRequirements: ["biography", "photo", "personality"],
    storytellingRole: "personal-introduction",
  },
  projects: {
    id: "projects", name: "Projects", componentName: "ProjectsSection",
    defaultPriority: 3, defaultVariant: "bento", defaultLayout: "bento-grid",
    visualWeight: "primary", contentRequirements: ["project-list", "descriptions", "links", "features", "tech-tags"],
    storytellingRole: "proof-of-work",
  },
  skills: {
    id: "skills", name: "Skills", componentName: "SkillsSection",
    defaultPriority: 4, defaultVariant: "cards", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["skill-categories", "proficiency-levels"],
    storytellingRole: "capability-demonstration",
  },
  experience: {
    id: "experience", name: "Experience", componentName: "ExperienceSection",
    defaultPriority: 5, defaultVariant: "timeline", defaultLayout: "timeline",
    visualWeight: "secondary", contentRequirements: ["work-history", "roles", "achievements"],
    storytellingRole: "career-narrative",
  },
  education: {
    id: "education", name: "Education", componentName: "EducationSection",
    defaultPriority: 6, defaultVariant: "card", defaultLayout: "list",
    visualWeight: "tertiary", contentRequirements: ["degrees", "institutions", "dates"],
    storytellingRole: "academic-background",
  },
  testimonials: {
    id: "testimonials", name: "Testimonials", componentName: "TestimonialsSection",
    defaultPriority: 7, defaultVariant: "carousel", defaultLayout: "carousel",
    visualWeight: "secondary", contentRequirements: ["quotes", "author-names", "roles"],
    storytellingRole: "social-proof",
  },
  timeline: {
    id: "timeline", name: "Timeline", componentName: "TimelineSection",
    defaultPriority: 3, defaultVariant: "alternating", defaultLayout: "timeline",
    visualWeight: "primary", contentRequirements: ["events", "dates", "descriptions"],
    storytellingRole: "chronological-narrative",
  },
  gallery: {
    id: "gallery", name: "Gallery", componentName: "GallerySection",
    defaultPriority: 3, defaultVariant: "masonry", defaultLayout: "masonry-grid",
    visualWeight: "primary", contentRequirements: ["images", "captions", "categories"],
    storytellingRole: "visual-showcase",
  },
  publications: {
    id: "publications", name: "Publications", componentName: "PublicationsSection",
    defaultPriority: 4, defaultVariant: "list", defaultLayout: "list",
    visualWeight: "secondary", contentRequirements: ["article-titles", "publications", "dates"],
    storytellingRole: "intellectual-contributions",
  },
  awards: {
    id: "awards", name: "Awards", componentName: "AwardsSection",
    defaultPriority: 6, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "tertiary", contentRequirements: ["award-names", "organizations", "dates"],
    storytellingRole: "recognition",
  },
  certifications: {
    id: "certifications", name: "Certifications", componentName: "CertificationsSection",
    defaultPriority: 6, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "tertiary", contentRequirements: ["cert-names", "issuers", "dates"],
    storytellingRole: "credentials",
  },
  openSource: {
    id: "openSource", name: "Open Source", componentName: "OpenSourceSection",
    defaultPriority: 4, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["repo-names", "descriptions", "stars"],
    storytellingRole: "community-contributions",
  },
  speaking: {
    id: "speaking", name: "Speaking", componentName: "SpeakingSection",
    defaultPriority: 5, defaultVariant: "timeline", defaultLayout: "timeline",
    visualWeight: "secondary", contentRequirements: ["talk-titles", "events", "dates"],
    storytellingRole: "thought-leadership",
  },
  community: {
    id: "community", name: "Community", componentName: "CommunitySection",
    defaultPriority: 6, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "tertiary", contentRequirements: ["activities", "organizations", "impact"],
    storytellingRole: "social-impact",
  },
  services: {
    id: "services", name: "Services", componentName: "ServicesSection",
    defaultPriority: 3, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "primary", contentRequirements: ["service-list", "descriptions", "pricing"],
    storytellingRole: "offerings",
  },
  clients: {
    id: "clients", name: "Clients", componentName: "ClientsSection",
    defaultPriority: 5, defaultVariant: "logo-grid", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["client-names", "logos", "relationships"],
    storytellingRole: "trust-signal",
  },
  products: {
    id: "products", name: "Products", componentName: "ProductsSection",
    defaultPriority: 3, defaultVariant: "showcase", defaultLayout: "grid",
    visualWeight: "primary", contentRequirements: ["product-names", "descriptions", "links"],
    storytellingRole: "product-portfolio",
  },
  metrics: {
    id: "metrics", name: "Metrics", componentName: "MetricsSection",
    defaultPriority: 4, defaultVariant: "counter", defaultLayout: "stats-row",
    visualWeight: "accent", contentRequirements: ["numbers", "labels", "icons"],
    storytellingRole: "impact-metrics",
  },
  faq: {
    id: "faq", name: "FAQ", componentName: "FaqSection",
    defaultPriority: 7, defaultVariant: "accordion", defaultLayout: "list",
    visualWeight: "tertiary", contentRequirements: ["questions", "answers"],
    storytellingRole: "information-addressal",
  },
  roadmap: {
    id: "roadmap", name: "Roadmap", componentName: "RoadmapSection",
    defaultPriority: 5, defaultVariant: "timeline", defaultLayout: "timeline",
    visualWeight: "secondary", contentRequirements: ["milestones", "dates", "status"],
    storytellingRole: "future-vision",
  },
  contact: {
    id: "contact", name: "Contact", componentName: "ContactSection",
    defaultPriority: 10, defaultVariant: "card", defaultLayout: "centered",
    visualWeight: "primary", contentRequirements: ["form", "social-links", "email"],
    storytellingRole: "closing-cta",
  },
  socialLinks: {
    id: "socialLinks", name: "Social Links", componentName: "SocialLinksSection",
    defaultPriority: 9, defaultVariant: "icon-row", defaultLayout: "centered",
    visualWeight: "accent", contentRequirements: ["platform-links", "icons"],
    storytellingRole: "connect-cta",
  },
  achievements: {
    id: "achievements", name: "Achievements", componentName: "AchievementsSection",
    defaultPriority: 5, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["achievement-list", "descriptions"],
    storytellingRole: "accomplishments",
  },
  articles: {
    id: "articles", name: "Articles", componentName: "ArticlesSection",
    defaultPriority: 4, defaultVariant: "card", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["article-list", "dates", "summaries"],
    storytellingRole: "writing-showcase",
  },
  experiments: {
    id: "experiments", name: "Experiments", componentName: "ExperimentsSection",
    defaultPriority: 4, defaultVariant: "gallery", defaultLayout: "grid",
    visualWeight: "secondary", contentRequirements: ["experiment-list", "demos", "descriptions"],
    storytellingRole: "creative-exploration",
  },
  resume: {
    id: "resume", name: "Resume", componentName: "ResumeSection",
    defaultPriority: 5, defaultVariant: "document", defaultLayout: "centered",
    visualWeight: "secondary", contentRequirements: ["sections", "download-link"],
    storytellingRole: "professional-summary",
  },
};

function inferSectionsFromContext(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): string[] {
  const hashNum = parseInt(promptHash, 36) % 100;

  const mentionedSections: string[] = [];
  for (const [sectionId, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
    const lowerPrompt = context.rawPrompt.toLowerCase();
    for (const syn of synonyms) {
      if (lowerPrompt.includes(syn)) {
        if (!mentionedSections.includes(sectionId)) {
          mentionedSections.push(sectionId);
        }
        break;
      }
    }
  }

  const professionSections: Record<string, string[]> = {
    photographer: ["gallery", "about", "services", "contact"],
    "graphic-designer": ["gallery", "about", "projects", "contact"],
    "ui-designer": ["projects", "about", "skills", "contact"],
    "ux-designer": ["projects", "case-studies", "about", "skills", "metrics", "contact"],
    "product-designer": ["projects", "about", "skills", "metrics", "contact"],
    writer: ["articles", "about", "publications", "contact"],
    researcher: ["publications", "about", "projects", "contact"],
    musician: ["gallery", "about", "timeline", "contact"],
    architect: ["gallery", "about", "projects", "contact"],
    agency: ["services", "projects", "clients", "metrics", "contact"],
    startup: ["products", "roadmap", "about", "metrics", "contact"],
    freelancer: ["services", "projects", "testimonials", "contact"],
    student: ["projects", "education", "skills", "about", "contact"],
    teacher: ["about", "publications", "speaking", "contact"],
    consultant: ["services", "about", "testimonials", "clients", "contact"],
    doctor: ["about", "services", "certifications", "contact"],
    lawyer: ["about", "services", "experience", "contact"],
  };

  let sections: string[];
  if (mentionedSections.length >= 3) {
    sections = [...mentionedSections];
  } else if (professionSections[context.profession]) {
    sections = [...professionSections[context.profession]];
  } else {
    const defaultSets = [
      ["hero", "about", "projects", "skills", "experience", "contact"],
      ["hero", "about", "projects", "skills", "contact"],
      ["hero", "projects", "about", "experience", "contact"],
    ];
    sections = [...defaultSets[hashNum % defaultSets.length]];
  }

  for (const section of context.sections) {
    if (section.type === "required") {
      const id = findSectionId(section.name);
      if (id && !sections.includes(id)) {
        sections.push(id);
      }
    }
  }

  const requiredByPrompt = constraints.required
    .map(c => c.replace("section:", ""))
    .filter(Boolean);
  for (const id of requiredByPrompt) {
    if (!sections.includes(id) && SECTION_TEMPLATES[id]) {
      sections.push(id);
    }
  }

  if (sections.includes("hero") && !sections.includes("about")) {
    sections.splice(sections.indexOf("hero") + 1, 0, "about");
  }

  if (!sections.includes("contact")) {
    sections.push("contact");
  }

  sections = sections.filter(id => !isSectionForbidden(id, constraints));
  sections = sections.filter(id => !!SECTION_TEMPLATES[id]);

  const seen = new Set<string>();
  sections = sections.filter(id => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return sections;
}

function findSectionId(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [id, synonyms] of Object.entries(SECTION_SYNONYM_MAP)) {
    if (lower.includes(id) || synonyms.some(s => lower.includes(s))) {
      return id;
    }
  }
  return null;
}

function composeSection(
  template: SectionTemplate,
  index: number,
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): ComposedSection {
  const hashNum = parseInt(promptHash, 36);
  const variantSeed = (hashNum + index * 17) % 100;

  const variantOptions: Record<string, string[]> = {
    hero: ["centered", "split", "minimal", "typewriter", "glass", "animated-gradient", "full-screen"],
    about: ["split", "card", "minimal", "editorial", "asymmetric"],
    projects: ["card", "masonry", "showcase", "case-study", "horizontal-scroll", "bento", "magazine"],
    skills: ["pills", "bars", "icon-grid", "radar", "minimal", "bubble"],
    experience: ["timeline", "card", "minimal", "detailed", "compact"],
    education: ["card", "minimal", "timeline", "detailed"],
    contact: ["card", "split", "centered", "minimal", "glass"],
    testimonials: ["carousel", "card", "masonry", "minimal"],
    gallery: ["masonry", "grid", "lightbox", "carousel", "justified", "polaroid"],
    timeline: ["alternating", "vertical", "horizontal", "minimal", "card"],
    services: ["card", "list", "magazine", "bento"],
    metrics: ["counter", "animated", "minimal", "dashboard"],
    faq: ["accordion", "card", "minimal", "tabbed"],
    default: ["card", "minimal", "default"],
  };

  const variants = variantOptions[template.id] || variantOptions.default;
  const variant = variants[variantSeed % variants.length];

  const interactionMap: Record<string, string> = {
    hero: "scroll-reveal",
    about: "fade-in",
    projects: "hover-expand",
    skills: "hover-highlight",
    experience: "scroll-timeline",
    contact: "form-interaction",
    gallery: "lightbox-open",
    testimonials: "carousel-swipe",
    timeline: "scroll-reveal",
    metrics: "count-up",
    faq: "accordion-toggle",
    default: "scroll-reveal",
  };

  return {
    id: template.id,
    name: template.name,
    componentName: template.componentName,
    type: isSectionRequired(template.id, constraints) ? "required" : "optional",
    storytellingRole: template.storytellingRole,
    priority: template.defaultPriority + index,
    variant,
    layout: template.defaultLayout,
    interaction: interactionMap[template.id] || interactionMap.default,
    animation: `section-${variant}`,
    accessibility: "semantic-section",
    responsive: {
      desktop: "full",
      tablet: "stacked",
      mobile: "stacked-compact",
    },
    contentRequirements: template.contentRequirements,
    visualWeight: template.visualWeight,
    metadata: {},
  };
}

export function composeSections(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): ComposedSection[] {
  const sectionOrder = inferSectionsFromContext(context, constraints, promptHash);

  return sectionOrder.map((id, index) => {
    const template = SECTION_TEMPLATES[id];
    if (!template) return null;
    return composeSection(template, index, context, constraints, promptHash);
  }).filter(Boolean) as ComposedSection[];
}
