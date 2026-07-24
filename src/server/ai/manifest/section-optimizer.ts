import type { PortfolioBlueprint } from "../blueprint/types";
import type { OptimizedSection, ComposedComponent } from "./types";
import { composeComponent } from "./component-composer";

const STORYTELLING_ROLES: Record<string, string> = {
  "hero": "Opening statement - establish identity and hook the visitor",
  "about": "Personal narrative - build connection and trust",
  "skills": "Capability demonstration - prove technical competence",
  "projects": "Proof of work - showcase tangible results",
  "experience": "Career journey - demonstrate growth and impact",
  "education": "Foundation - show academic background",
  "gallery": "Visual portfolio - display creative work",
  "services": "Value proposition - clearly state what is offered",
  "testimonials": "Social proof - build credibility through others",
  "team": "Human element - introduce the people behind the work",
  "contact": "Call to action - make it easy to connect",
  "achievements": "Accolades - highlight recognition",
  "certifications": "Credentials - validate expertise",
  "blog": "Thought leadership - demonstrate knowledge",
  "social-links": "Network presence - expand connection points",
};

const CTA_PLACEMENTS: Record<string, string> = {
  "hero": "primary-cta in hero section",
  "about": "soft-cta after bio",
  "projects": "view-all-cta after project grid",
  "services": "book-cta after services list",
  "contact": "primary-contact-form",
};

export function optimizeSections(
  blueprint: PortfolioBlueprint,
  _components: Record<string, ComposedComponent>
): OptimizedSection[] {
  const optimized: OptimizedSection[] = [];

  const sections = [...blueprint.sections];

  sections.sort((a, b) => a.priority - b.priority);

  for (const section of sections) {
    const composition = composeComponent(
      section.component.replace("Section", "").toLowerCase(),
      section.variant,
      blueprint
    );

    const storytellingRole = STORYTELLING_ROLES[section.id] ?? `Supporting section - ${section.name}`;
    const ctaPlacement = CTA_PLACEMENTS[section.id];

    optimized.push({
      id: section.id,
      name: section.name,
      component: section.component,
      variant: section.variant,
      priority: section.priority,
      required: section.required,
      composition,
      storytellingRole,
      ctaPlacement,
    });
  }

  return optimized;
}
