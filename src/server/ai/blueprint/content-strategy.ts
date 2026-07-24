import type { AIContextObject } from "../intelligence/types";
import type { ContentStrategy } from "./types";

export function planContent(context: AIContextObject): ContentStrategy {
  const profession = context.profession;
  const designLang = context.designLanguage[0]?.name ?? "minimal";

  const headlineStyle = designLang === "cyberpunk" ? "glitch-text" :
    designLang === "luxury" ? "serif-elegant" :
    designLang === "editorial" ? "editorial-large" :
    designLang === "brutalist" ? "brutalist-bold" :
    "clean-modern";

  const headlineLength = profession === "developer" || profession === "ai-engineer" ? "short" :
    profession === "writer" || profession === "researcher" ? "long" : "medium";

  const aboutStyle = designLang === "editorial" ? "editorial" :
    designLang === "minimal" ? "concise" :
    designLang === "creative" ? "narrative" : "standard";

  const aboutLength = ["writer", "researcher", "teacher", "consultant"].includes(profession) ? "long" :
    ["student", "developer"].includes(profession) ? "short" : "medium";

  const projectPresentation = profession.includes("designer") || profession === "photographer" ? "visual" :
    profession.includes("developer") || profession === "ai-engineer" ? "technical" : "balanced";

  const projectDetails = ["agency", "startup", "consultant"].includes(profession) ? "detailed" :
    ["student", "freelancer"].includes(profession) ? "moderate" : "minimal";

  const ctaStyle = designLang === "cyberpunk" ? "neon-button" :
    designLang === "glassmorphism" ? "glass-button" :
    designLang === "luxury" ? "gold-gradient" :
    "primary-gradient";

  return {
    headline: {
      style: headlineStyle,
      length: headlineLength,
      animation: context.animations.intensity !== "none" ? "text-reveal" : undefined,
    },
    tagline: {
      style: "subtitle",
      length: "medium",
    },
    about: {
      style: aboutStyle,
      length: aboutLength,
      storytelling: context.animations.intensity === "heavy" || designLang === "editorial",
    },
    projects: {
      presentation: projectPresentation,
      details: projectDetails as "minimal" | "moderate" | "detailed",
      links: profession.includes("designer") ? "card" : "inline",
    },
    cta: {
      primary: context.intent.portfolioGoal.includes("attract") ? "Let's Work Together" :
        context.intent.portfolioGoal.includes("showcase") ? "View My Work" :
        "Get In Touch",
      secondary: profession === "freelancer" ? "Download Resume" : undefined,
      style: ctaStyle,
    },
  };
}
