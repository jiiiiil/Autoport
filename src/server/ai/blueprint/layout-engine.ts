import type { AIContextObject } from "../intelligence/types";
import type { LayoutType } from "./types";

interface LayoutOption {
  type: LayoutType;
  professions: string[];
  designLanguages: string[];
  score: number;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    type: "portfolio-landing",
    professions: ["photographer", "architect", "graphic-designer", "creative"],
    designLanguages: ["apple", "stripe", "vercel", "minimal"],
    score: 10,
  },
  {
    type: "split",
    professions: ["developer", "fullstack-developer", "frontend-developer", "backend-developer"],
    designLanguages: ["linear", "raycast", "minimal", "dashboard"],
    score: 8,
  },
  {
    type: "magazine",
    professions: ["writer", "researcher", "teacher", "consultant"],
    designLanguages: ["editorial", "magazine", "luxury", "corporate"],
    score: 9,
  },
  {
    type: "editorial",
    professions: ["writer", "researcher", "teacher"],
    designLanguages: ["editorial", "magazine", "dark-academic"],
    score: 9,
  },
  {
    type: "creative",
    professions: ["ui-designer", "ux-designer", "product-designer", "creator", "musician"],
    designLanguages: ["creative", "gallery", "playful", "cyberpunk"],
    score: 10,
  },
  {
    type: "gallery",
    professions: ["photographer", "graphic-designer", "architect"],
    designLanguages: ["gallery", "creative", "minimal"],
    score: 10,
  },
  {
    type: "timeline",
    professions: ["researcher", "architect", "developer"],
    designLanguages: ["editorial", "minimal", "corporate"],
    score: 7,
  },
  {
    type: "storytelling",
    professions: ["creator", "writer", "musician", "photographer"],
    designLanguages: ["editorial", "creative", "luxury"],
    score: 8,
  },
  {
    type: "grid",
    professions: ["developer", "data-scientist", "ml-engineer", "ai-engineer"],
    designLanguages: ["dashboard", "linear", "minimal"],
    score: 8,
  },
  {
    type: "bento",
    professions: ["developer", "frontend-developer", "ai-engineer", "startup"],
    designLanguages: ["apple", "linear", "vercel", "raycast", "minimal"],
    score: 9,
  },
  {
    type: "dashboard",
    professions: ["data-scientist", "data-engineer", "devops-engineer", "startup"],
    designLanguages: ["dashboard", "linear"],
    score: 8,
  },
  {
    type: "landing-sections",
    professions: ["freelancer", "agency", "startup", "consultant"],
    designLanguages: ["stripe", "vercel", "corporate", "luxury"],
    score: 9,
  },
  {
    type: "minimal",
    professions: ["developer", "backend-developer", "researcher", "student"],
    designLanguages: ["minimal", "apple", "linear"],
    score: 7,
  },
];

export function selectLayout(context: AIContextObject): { type: LayoutType; description: string } {
  const scored = LAYOUT_OPTIONS.map((opt) => {
    let score = opt.score;

    const professionMatch = opt.professions.includes(context.profession);
    if (professionMatch) score += 15;

    const designMatch = context.designLanguage.some((d) => opt.designLanguages.includes(d.name));
    if (designMatch) score += 10;

    if (context.metadata.complexity === "simple") {
      if (opt.type === "minimal" || opt.type === "portfolio-landing") score += 5;
    }
    if (context.metadata.complexity === "complex" || context.metadata.complexity === "expert") {
      if (opt.type === "bento" || opt.type === "creative" || opt.type === "magazine") score += 5;
    }

    if (context.animations.intensity === "heavy") {
      if (opt.type === "creative" || opt.type === "storytelling") score += 3;
    }

    return { ...opt, finalScore: score };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  const selected = scored[0];

  const descriptions: Record<string, string> = {
    "split": "Two-column layout with content and visual side by side",
    "magazine": "Magazine-style editorial layout with varied content blocks",
    "editorial": "Typography-focused editorial layout with strong hierarchy",
    "creative": "Asymmetric creative layout with dynamic positioning",
    "minimal": "Clean minimal layout with focused content",
    "gallery": "Image-forward gallery layout for visual portfolios",
    "timeline": "Chronological timeline layout for career/journey",
    "storytelling": "Narrative-driven layout that guides through a story",
    "grid": "Structured grid layout for data-driven content",
    "bento": "Bento box layout with varied card sizes (Apple-style)",
    "dashboard": "Dashboard-style layout with sidebar and cards",
    "portfolio-landing": "Full-screen hero landing page with sections below",
    "landing-sections": "Landing page with stacked full-width sections",
    "custom": "Custom layout combining multiple patterns",
  };

  return {
    type: selected.type,
    description: descriptions[selected.type] ?? "Adaptive layout based on content",
  };
}
