import type { AIContextObject } from "../intelligence/types";
import type { SectionPlan, LayoutType } from "./types";

interface SectionTemplate {
  id: string;
  name: string;
  component: string;
  variants: Record<string, string>;
  professions: string[];
  layouts: LayoutType[];
  priority: number;
  required: boolean;
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "hero",
    name: "Hero",
    component: "HeroSection",
    variants: {
      "developer": "terminal",
      "designer": "split",
      "photographer": "full-screen",
      "default": "centered",
    },
    professions: [],
    layouts: [],
    priority: 0,
    required: true,
  },
  {
    id: "about",
    name: "About",
    component: "AboutSection",
    variants: {
      "default": "default",
      "writer": "editorial",
      "photographer": "minimal",
    },
    professions: [],
    layouts: [],
    priority: 10,
    required: true,
  },
  {
    id: "skills",
    name: "Skills",
    component: "SkillsSection",
    variants: {
      "developer": "icon-grid",
      "designer": "pills",
      "default": "pills",
    },
    professions: ["developer", "fullstack-developer", "frontend-developer", "backend-developer",
      "ai-engineer", "ml-engineer", "data-scientist", "mobile-developer", "devops-engineer", "student"],
    layouts: [],
    priority: 20,
    required: false,
  },
  {
    id: "projects",
    name: "Projects",
    component: "ProjectsSection",
    variants: {
      "developer": "card",
      "designer": "showcase",
      "photographer": "gallery",
      "default": "card",
    },
    professions: [],
    layouts: [],
    priority: 15,
    required: true,
  },
  {
    id: "experience",
    name: "Experience",
    component: "ExperienceSection",
    variants: {
      "default": "timeline",
      "corporate": "detailed",
    },
    professions: ["developer", "fullstack-developer", "frontend-developer", "backend-developer",
      "ai-engineer", "ml-engineer", "data-scientist", "devops-engineer", "consultant"],
    layouts: [],
    priority: 25,
    required: false,
  },
  {
    id: "education",
    name: "Education",
    component: "EducationSection",
    variants: {
      "default": "compact",
    },
    professions: ["student", "researcher", "teacher"],
    layouts: [],
    priority: 30,
    required: false,
  },
  {
    id: "gallery",
    name: "Gallery",
    component: "GallerySection",
    variants: {
      "photographer": "masonry",
      "designer": "grid",
      "default": "grid",
    },
    professions: ["photographer", "ui-designer", "ux-designer", "graphic-designer", "architect", "creator"],
    layouts: [],
    priority: 18,
    required: false,
  },
  {
    id: "services",
    name: "Services",
    component: "ServicesSection",
    variants: {
      "default": "cards",
      "agency": "detailed",
    },
    professions: ["freelancer", "agency", "consultant"],
    layouts: [],
    priority: 15,
    required: false,
  },
  {
    id: "testimonials",
    name: "Testimonials",
    component: "TestimonialsSection",
    variants: {
      "default": "carousel",
      "minimal": "quotes",
    },
    professions: ["freelancer", "agency", "consultant", "ui-designer"],
    layouts: [],
    priority: 35,
    required: false,
  },
  {
    id: "team",
    name: "Team",
    component: "TeamSection",
    variants: {
      "default": "grid",
    },
    professions: ["agency", "startup"],
    layouts: [],
    priority: 20,
    required: false,
  },
  {
    id: "contact",
    name: "Contact",
    component: "ContactSection",
    variants: {
      "default": "split",
      "minimal": "minimal",
    },
    professions: [],
    layouts: [],
    priority: 40,
    required: true,
  },
  {
    id: "achievements",
    name: "Achievements",
    component: "AchievementsSection",
    variants: {
      "default": "grid",
    },
    professions: ["student", "researcher", "teacher"],
    layouts: [],
    priority: 28,
    required: false,
  },
  {
    id: "certifications",
    name: "Certifications",
    component: "CertificationsSection",
    variants: {
      "default": "list",
    },
    professions: ["developer", "devops-engineer", "data-scientist", "ml-engineer"],
    layouts: [],
    priority: 32,
    required: false,
  },
  {
    id: "blog",
    name: "Blog",
    component: "BlogSection",
    variants: {
      "default": "cards",
      "writer": "editorial",
    },
    professions: ["writer", "teacher", "researcher", "creator"],
    layouts: [],
    priority: 22,
    required: false,
  },
  {
    id: "social-links",
    name: "Social Links",
    component: "SocialLinksSection",
    variants: {
      "default": "icons",
    },
    professions: [],
    layouts: [],
    priority: 38,
    required: false,
  },
];

function getVariant(template: SectionTemplate, context: AIContextObject): string {
  const professionVariant = template.variants[context.profession];
  if (professionVariant) return professionVariant;

  const designVariant = context.designLanguage.find((d) => template.variants[d.name]);
  if (designVariant) return template.variants[designVariant.name];

  return template.variants["default"] ?? "default";
}

export function planSections(
  context: AIContextObject,
  layout: LayoutType
): SectionPlan[] {
  const requiredSections = context.sections.filter((s) => s.type === "required").map((s) => s.name);
  const forbiddenSections = context.sections.filter((s) => s.type === "forbidden").map((s) => s.name);

  const plans: SectionPlan[] = [];
  let priority = 0;

  for (const template of SECTION_TEMPLATES) {
    if (forbiddenSections.includes(template.id)) continue;

    const isRequired = requiredSections.includes(template.id) || template.required;

    const professionRelevant = template.professions.length === 0 ||
      template.professions.includes(context.profession);

    const layoutRelevant = template.layouts.length === 0 ||
      template.layouts.includes(layout);

    if (!professionRelevant && !isRequired) continue;
    if (!layoutRelevant && !isRequired) continue;

    const variant = getVariant(template, context);

    plans.push({
      id: template.id,
      name: template.name,
      component: template.component,
      variant,
      priority: template.priority + priority,
      required: isRequired,
      props: {},
    });

    priority += 5;
  }

  plans.sort((a, b) => a.priority - b.priority);

  return plans;
}
