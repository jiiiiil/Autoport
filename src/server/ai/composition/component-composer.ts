import type { AIContextObject } from "../intelligence/types";
import type { ComposedComponent, ComposedSection, PromptConstraints } from "./types";

function composeSectionComponent(
  section: ComposedSection,
  context: AIContextObject,
  promptHash: string,
  index: number
): ComposedComponent {
  const hashNum = parseInt(promptHash, 36);
  const seed = (hashNum + index * 31) % 100;

  const interactionMap: Record<string, ComposedComponent["interactionType"]> = {
    hero: "scroll",
    about: "static",
    projects: "hover",
    skills: "hover",
    experience: "scroll",
    contact: "click",
    gallery: "click",
    testimonials: "scroll",
    timeline: "scroll",
    metrics: "scroll",
    services: "hover",
    faq: "click",
    publications: "hover",
    awards: "static",
    speaking: "static",
    community: "hover",
    clients: "static",
    products: "hover",
    roadmap: "scroll",
    default: "scroll",
  };

  const visualWeightMap: Record<string, ComposedComponent["visualWeight"]> = {
    hero: "primary",
    about: "primary",
    projects: "primary",
    skills: "secondary",
    experience: "secondary",
    contact: "primary",
    gallery: "primary",
    testimonials: "secondary",
    timeline: "primary",
    metrics: "accent",
    services: "primary",
    faq: "tertiary",
    default: "secondary",
  };

  const contentRulesMap: Record<string, ComposedComponent["contentRules"]> = {
    hero: { maxLines: 2, truncation: "none" },
    about: { maxLines: 4, truncation: "fade" },
    projects: { maxLines: 3, truncation: "ellipsis" },
    skills: { maxLines: 1, truncation: "none" },
    contact: { maxLines: 1, truncation: "none" },
    gallery: { mediaAspect: "16/9" },
    testimonials: { maxLines: 3, truncation: "fade" },
    default: { maxLines: 3, truncation: "ellipsis" },
  };

  const elements: string[] = [];
  if (section.contentRequirements.includes("headline") || section.contentRequirements.includes("tagline")) {
    elements.push("heading", "subheading");
  }
  if (section.contentRequirements.includes("cta") || section.contentRequirements.includes("form")) {
    elements.push("cta");
  }
  if (section.contentRequirements.includes("photo") || section.contentRequirements.includes("images")) {
    elements.push("media");
  }
  elements.push("content");

  const responsive: Record<string, string> = {
    desktop: "full-width",
    tablet: seed % 2 === 0 ? "stacked" : "adjusted",
    mobile: "stacked-compact",
  };

  const purposeMap: Record<string, string> = {
    hero: "First impression and identity statement",
    about: "Personal introduction and story",
    projects: "Work showcase and proof of capability",
    skills: "Technical proficiency demonstration",
    experience: "Career narrative and growth",
    contact: "Connection and engagement point",
    gallery: "Visual portfolio showcase",
    testimonials: "Social proof and credibility",
    timeline: "Chronological journey display",
    metrics: "Impact quantification",
    services: "Service offerings display",
    faq: "Common question resolution",
    default: "Content section",
  };

  return {
    name: section.componentName,
    purpose: purposeMap[section.id] || purposeMap.default,
    priority: section.priority,
    variant: section.variant,
    elements,
    behavior: section.interaction,
    animation: section.animation,
    accessibility: section.accessibility,
    responsive,
    visualWeight: visualWeightMap[section.id] || visualWeightMap.default,
    interactionType: interactionMap[section.id] || interactionMap.default,
    contentRules: contentRulesMap[section.id] || contentRulesMap.default,
  };
}

function composeNavigationComponent(
  navStyle: string,
  promptHash: string
): ComposedComponent {
  const elements = ["logo", "nav-links", "mobile-toggle"];
  if (navStyle === "dock") elements.push("dock-icons");
  if (navStyle === "magazine-toc") elements.push("toc-numbers");
  if (navStyle === "pills") elements.push("active-indicator");

  return {
    name: "Navigation",
    purpose: "Site navigation and wayfinding",
    priority: 0,
    variant: navStyle,
    elements,
    behavior: "scroll-spy",
    animation: "nav-transition",
    accessibility: "landria-navigation",
    responsive: {
      desktop: "full",
      tablet: "collapsed",
      mobile: "hamburger",
    },
    visualWeight: "primary",
    interactionType: "click",
    contentRules: {},
  };
}

function composeFooterComponent(
  sections: ComposedSection[],
  promptHash: string
): ComposedComponent {
  const hasContact = sections.some(s => s.id === "contact");
  const hasSocial = sections.some(s => s.id === "socialLinks");

  const elements = ["copyright"];
  if (!hasContact) elements.push("contact-email");
  if (!hasSocial) elements.push("social-links");
  elements.push("back-to-top");

  return {
    name: "Footer",
    purpose: "Site footer and closing information",
    priority: 100,
    variant: sections.length > 6 ? "multi-column" : "minimal",
    elements,
    behavior: "static",
    animation: "fade-in",
    accessibility: "landmark-footer",
    responsive: {
      desktop: "multi-column",
      tablet: "stacked",
      mobile: "stacked-compact",
    },
    visualWeight: "tertiary",
    interactionType: "static",
    contentRules: {},
  };
}

export function composeComponents(
  sections: ComposedSection[],
  context: AIContextObject,
  navStyle: string,
  promptHash: string
): ComposedComponent[] {
  const components: ComposedComponent[] = [];

  components.push(composeNavigationComponent(navStyle, promptHash));

  sections.forEach((section, index) => {
    components.push(composeSectionComponent(section, context, promptHash, index));
  });

  components.push(composeFooterComponent(sections, promptHash));

  return components;
}
