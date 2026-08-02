import type { AIContextObject } from "../intelligence/types";
import type { PromptConstraints, StorytellingFlow, ComposedSection } from "./types";
import { getPreferredLayout } from "./constraint-resolver";

const STORY_ARCS: Record<StorytellingFlow, string[]> = {
  linear: ["introduction", "content", "conclusion"],
  narrative: ["hook", "context", "journey", "climax", "resolution", "call-to-action"],
  "problem-journey-impact": ["problem", "journey", "process", "impact", "future"],
  magazine: ["magazine-intro", "featured-story", "editorial-grid", "sidebar-content", "archive"],
  "editorial-grid": ["masthead", "lead-story", "editorial-content", "sidebar", "back-page"],
  "timeline-scroll": ["era-1", "era-2", "era-3", "present", "future"],
  "interactive-landing": ["splash", "discovery", "deep-dive", "engagement", "conversion"],
  "horizontal-journey": ["start", "progression", "milestones", "destination"],
  "cinematic-reveal": ["opening-shot", "rising-action", "climax", "denouement", "closing"],
  "modular-cards": ["hero-card", "feature-cards", "detail-cards", "proof-cards", "action-card"],
  "asymmetric-canvas": ["anchor", "scattered-content", "focused-detail", "counter-balance", "close"],
  "newspaper-spread": ["headline", "lead-paragraph", "body-content", "sidebar", "classifieds"],
  "dark-to-light": ["dark-intro", "emergence", "illumination", "full-light", "radiance"],
  chronological: ["early-days", "formative", "growth", "current", "vision"],
  "portfolio-showcase": ["portfolio-hero", "featured-work", "process", "results", "contact"],
  "case-study": ["challenge", "approach", "execution", "results", "learnings"],
};

function inferStoryFlow(
  context: AIContextObject,
  constraints: PromptConstraints,
  sections: ComposedSection[],
  promptHash: string
): StorytellingFlow {
  const lowerPrompt = context.rawPrompt.toLowerCase();
  const hashNum = parseInt(promptHash, 36) % 100;

  if (lowerPrompt.includes("story") || lowerPrompt.includes("narrative")) return "narrative";
  if (lowerPrompt.includes("magazine") || lowerPrompt.includes("editorial")) return "magazine";
  if (lowerPrompt.includes("timeline") || lowerPrompt.includes("chronological")) return "timeline-scroll";
  if (lowerPrompt.includes("case-study") || lowerPrompt.includes("case study")) return "case-study";
  if (lowerPrompt.includes("cinematic") || lowerPrompt.includes("film")) return "cinematic-reveal";
  if (lowerPrompt.includes("problem") && lowerPrompt.includes("impact")) return "problem-journey-impact";
  if (lowerPrompt.includes("horizontal") || lowerPrompt.includes("scroll")) return "horizontal-journey";
  if (lowerPrompt.includes("dark") && lowerPrompt.includes("light")) return "dark-to-light";
  if (lowerPrompt.includes("newspaper") || lowerPrompt.includes("spread")) return "newspaper-spread";

  const sectionIds = sections.map(s => s.id);

  if (sectionIds.includes("timeline") && !sectionIds.includes("hero")) {
    return "timeline-scroll";
  }
  if (sectionIds.includes("gallery") && sectionIds.includes("publications")) {
    return "portfolio-showcase";
  }
  if (sectionIds.includes("services") && sectionIds.includes("testimonials")) {
    return "case-study";
  }
  if (sectionIds.includes("metrics") && sectionIds.includes("clients")) {
    return "problem-journey-impact";
  }

  if (context.designLanguage[0]?.name === "magazine") return "magazine";
  if (context.designLanguage[0]?.name === "editorial") return "editorial-grid";
  if (context.designLanguage[0]?.name === "creative") return "cinematic-reveal";

  if (context.animations.intensity === "heavy") {
    return hashNum % 2 === 0 ? "narrative" : "cinematic-reveal";
  }
  if (context.animations.intensity === "none") {
    return hashNum % 2 === 0 ? "linear" : "modular-cards";
  }

  const flows: StorytellingFlow[] = [
    "linear", "narrative", "problem-journey-impact",
    "modular-cards", "portfolio-showcase", "chronological",
  ];
  return flows[hashNum % flows.length];
}

function computeNarrativeArc(
  flow: StorytellingFlow,
  sections: ComposedSection[]
): string[] {
  const arc = STORY_ARCS[flow] || STORY_ARCS.linear;

  if (sections.length <= 3) return arc.slice(0, 3);
  if (sections.length <= 5) return arc.slice(0, 5);
  return arc;
}

function computeSectionTransitions(
  flow: StorytellingFlow,
  sections: ComposedSection[]
): Record<string, string> {
  const transitions: Record<string, string> = {};

  const flowTransitions: Record<StorytellingFlow, string> = {
    linear: "fade-through",
    narrative: "chapter-turn",
    "problem-journey-impact": "scene-transition",
    magazine: "page-flip",
    "editorial-grid": "column-shift",
    "timeline-scroll": "timeline-slide",
    "interactive-landing": "depth-zoom",
    "horizontal-journey": "horizontal-slide",
    "cinematic-reveal": "iris-wipe",
    "modular-cards": "card-flip",
    "asymmetric-canvas": "asymmetric-shift",
    "newspaper-spread": "page-turn",
    "dark-to-light": "brightness-shift",
    chronological: "era-transition",
    "portfolio-showcase": "gallery-slide",
    "case-study": "chapter-reveal",
  };

  const defaultTransition = flowTransitions[flow] || "fade-through";

  for (let i = 0; i < sections.length; i++) {
    if (i === 0) {
      transitions[sections[i].id] = "initial-reveal";
    } else if (i === sections.length - 1) {
      transitions[sections[i].id] = "final-transition";
    } else {
      transitions[sections[i].id] = defaultTransition;
    }
  }

  return transitions;
}

function computeStorytellingDevices(
  flow: StorytellingFlow,
  context: AIContextObject
): string[] {
  const devices: string[] = [];

  const flowDevices: Record<StorytellingFlow, string[]> = {
    linear: ["progressive-reveal", "section-fade"],
    narrative: ["voiceover-text", "chapter-markers", "emotional-arc", "character-development"],
    "problem-journey-impact": ["problem-statements", "journey-marks", "impact-numbers", "future-vision"],
    magazine: ["pull-quotes", "editorial-asides", "photo-essays", "sidebars"],
    "editorial-grid": ["column-layout", "drop-caps", "pull-quotes", "infographics"],
    "timeline-scroll": ["scroll-markers", "era-labels", "progress-indicator", "date-anchors"],
    "interactive-landing": ["scroll-triggered", "parallax-layers", "discover-moments"],
    "horizontal-journey": ["parallax-scroll", "waypoint-markers", "progress-trail"],
    "cinematic-reveal": ["dramatic-entrance", "slow-reveal", "tension-build", "payoff-moment"],
    "modular-cards": ["card-animations", "hover-details", "stack-interactions"],
    "asymmetric-canvas": ["offset-elements", "rotation-details", "layered-depth"],
    "newspaper-spread": ["headline-hierarchy", "column-breaks", "pull-quotes", "classified-style"],
    "dark-to-light": ["gradient-transition", "reveal-light", "contrast-shift"],
    chronological: ["era-transitions", "progress-marker", "milestone-highlights"],
    "portfolio-showcase": ["project-reveal", "process-visuals", "before-after"],
    "case-study": ["problem-frame", "solution-build", "result-reveal", "data-story"],
  };

  devices.push(...(flowDevices[flow] || flowDevices.linear));

  if (context.animations.intensity === "heavy") {
    devices.push("scroll-parallax", "micro-animations");
  }
  if (context.profession === "photographer" || context.profession === "graphic-designer") {
    devices.push("visual-storytelling", "image-forward");
  }

  return devices;
}

export function composeStory(
  context: AIContextObject,
  constraints: PromptConstraints,
  sections: ComposedSection[],
  promptHash: string
): {
  flow: StorytellingFlow;
  narrativeArc: string[];
  sectionTransitions: Record<string, string>;
  storytellingDevices: string[];
} {
  const flow = inferStoryFlow(context, constraints, sections, promptHash);
  const narrativeArc = computeNarrativeArc(flow, sections);
  const sectionTransitions = computeSectionTransitions(flow, sections);
  const storytellingDevices = computeStorytellingDevices(flow, context);

  return { flow, narrativeArc, sectionTransitions, storytellingDevices };
}
