import type { AIContextObject } from "../intelligence/types";
import type { PortfolioBlueprint } from "./types";

export async function generatePortfolioBlueprint(context: AIContextObject): Promise<PortfolioBlueprint> {
  console.log("  --> Running Phase 9B: Blueprint Planning...");

  const blueprint: PortfolioBlueprint = {
    portfolioType: `${context.profession || "General"} Portfolio`,
    targetAudience: context.intent.targetAudience || "Potential clients and employers",
    framework: context.primaryFramework,
    language: context.primaryLanguage,
    styling: context.primaryStyling,
    designLanguage: context.designLanguage.map((dl) => dl.name),
    profession: context.profession,
    theme: context.theme,
    libraries: {
      ui: context.primaryStyling,
      animation: context.animations?.types?.[0] || "framer-motion",
      icons: "lucide-react",
      charts: "recharts",
    },
    folderStrategy: ["src/components", "src/layouts", "src/sections", "public", "assets"],
    layout: determineLayout(context),
    navigation: determineNavigation(context),
    sections: context.sections.map((s) => ({
      name: s.name,
      type: s.type === "preferred" ? "optional" as const : s.type as "required" | "optional" | "forbidden",
      description: `${s.name} section`,
      storytellingRole: s.name,
      composition: { variant: "default", layout: "default", interaction: "default", animation: "default" },
    })),
    animations: {
      library: context.animations?.types?.[0] || "framer-motion",
      intensity: context.animations?.intensity || "subtle",
      enabled: context.animations?.enabled ?? true,
      pageTransitions: false,
      scrollAnimations: context.animations?.intensity !== "none",
      microInteractions: context.animations?.intensity === "moderate" || context.animations?.intensity === "heavy",
    },
    content: determineContentStrategy(context),
    seo: determineSeoStrategy(context),
    accessibility: determineAccessibilityStrategy(context),
    performance: determinePerformanceStrategy(context),
    designSystem: {
      tokens: { colors: {}, typography: {}, spacing: {}, radius: {}, shadows: {}, animation: {}, breakpoints: {} },
      components: {},
    },
    metadata: {
      createdAt: new Date().toISOString(),
      version: "1.0.0",
      confidence: 0.85,
      uniqueness: 0.7,
    },
  };

  console.log("<-- Phase 9B: Blueprint Planning completed.");
  return blueprint;
}

function determineLayout(context: AIContextObject): PortfolioBlueprint["layout"] {
  let layoutType = "split";
  const sectionHierarchy = ["hero", "about", "projects", "contact"];

  if (context.profession?.includes("designer") || context.designLanguage?.length > 0) {
    layoutType = "creative";
  } else if (context.profession?.includes("developer")) {
    layoutType = "split";
  } else if (context.designLanguage?.some((dl) => ["editorial", "magazine"].includes(dl.name))) {
    layoutType = "magazine";
  }

  if (context.metadata.complexity === "expert") {
    layoutType = "editorial";
  }

  return { type: layoutType, sectionHierarchy, gridStrategy: "12-col", containerWidth: "1280px", verticalRhythm: "1.5" };
}

function determineNavigation(context: AIContextObject): PortfolioBlueprint["navigation"] {
  return {
    variant: "sticky",
    sections: context.sections?.map((s) => s.name) || [],
    position: "top",
    mobileBehavior: "hamburger",
    scrollBehavior: "hide-on-scroll",
  };
}

function determineContentStrategy(context: AIContextObject): PortfolioBlueprint["content"] {
  return {
    intent: context.intent.portfolioGoal || "Showcase professional work",
    tone: "professional",
    voice: "first-person",
    storytelling: "linear",
    sections: {},
  };
}

function determineSeoStrategy(context: AIContextObject): PortfolioBlueprint["seo"] {
  return {
    title: `${context.profession || "Portfolio"} | AI Generated`,
    description: context.intent.portfolioGoal || "A custom-generated portfolio showcasing professional skills.",
    keywords: [context.profession || "portfolio", context.primaryFramework],
    canonical: "",
    openGraph: { title: `${context.profession || "Portfolio"}`, description: "AI Generated Portfolio", image: "/og-image.png" },
    twitter: { card: "summary_large_image", title: `${context.profession || "Portfolio"}`, description: "AI Generated Portfolio" },
  };
}

function determineAccessibilityStrategy(context: AIContextObject): PortfolioBlueprint["accessibility"] {
  return {
    level: "AA",
    semanticHTML: true,
    ariaLabels: true,
    keyboardNavigation: true,
    focusManagement: true,
    reducedMotion: context.animations?.intensity === "none",
    colorContrast: true,
    screenReader: true,
  };
}

function determinePerformanceStrategy(context: AIContextObject): PortfolioBlueprint["performance"] {
  return {
    lazyLoading: true,
    dynamicImports: true,
    imageOptimization: true,
    codeSplitting: true,
    treeShaking: true,
    prefetching: true,
    bundleAnalysis: false,
  };
}
