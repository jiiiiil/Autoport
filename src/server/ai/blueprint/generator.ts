import type { AIContextObject } from "../intelligence/types";
import type { PortfolioBlueprint } from "./types";
import { planStrategy } from "./strategy-engine";
import { selectLayout } from "./layout-engine";
import { planSections } from "./section-planner";
import { planComponentVariants } from "./component-engine";
import { planDesignSystem } from "./design-system";
import { planAnimations } from "./animation-strategy";
import { planContent } from "./content-strategy";
import { planResponsive } from "./responsive-strategy";
import { planSEO } from "./seo-strategy";
import { planAccessibility, planPerformance } from "./quality-strategy";
import { planFolderStrategy } from "./folder-strategy";

export function generateBlueprint(context: AIContextObject): PortfolioBlueprint {
  const strategy = planStrategy(context);
  const layout = selectLayout(context);
  const sections = planSections(context, layout.type);
  const components = planComponentVariants(context);
  const designSystem = planDesignSystem(context);
  const animations = planAnimations(context);
  const content = planContent(context);
  const responsive = planResponsive(context);
  const seo = planSEO(context);
  const accessibility = planAccessibility(context);
  const performance = planPerformance(context);
  const folderStrategy = planFolderStrategy(context);

  const portfolioTypes: Record<string, string> = {
    "developer": "Developer Portfolio",
    "fullstack-developer": "Full-Stack Developer Portfolio",
    "frontend-developer": "Frontend Developer Portfolio",
    "backend-developer": "Backend Developer Portfolio",
    "ai-engineer": "AI Engineer Portfolio",
    "ml-engineer": "ML Engineer Portfolio",
    "data-scientist": "Data Scientist Portfolio",
    "data-engineer": "Data Engineer Portfolio",
    "devops-engineer": "DevOps Engineer Portfolio",
    "mobile-developer": "Mobile Developer Portfolio",
    "ui-designer": "UI Designer Portfolio",
    "ux-designer": "UX Designer Portfolio",
    "product-designer": "Product Designer Portfolio",
    "graphic-designer": "Graphic Designer Portfolio",
    "photographer": "Photography Portfolio",
    "architect": "Architecture Portfolio",
    "agency": "Agency Portfolio",
    "startup": "Startup Portfolio",
    "freelancer": "Freelancer Portfolio",
    "student": "Student Portfolio",
    "creator": "Creator Portfolio",
    "teacher": "Educator Portfolio",
    "consultant": "Consultant Portfolio",
    "writer": "Writer Portfolio",
    "musician": "Musician Portfolio",
  };

  const animLib = context.animationLibraries[0]?.name || "framer-motion";
  const iconLib = context.iconLibraries[0]?.name || "lucide";
  const chartLib = context.chartLibraries[0]?.name || "recharts";

  return {
    portfolioType: portfolioTypes[context.profession] ?? "Professional Portfolio",
    targetAudience: strategy.targetAudience,
    profession: context.profession,
    designLanguage: context.designLanguage.map((dl) => dl.name),

    framework: context.primaryFramework,
    language: context.primaryLanguage,
    styling: context.primaryStyling,
    theme: context.theme,

    libraries: {
      ui: context.primaryStyling,
      animation: animLib,
      icons: iconLib,
      charts: chartLib,
    },

    folderStrategy: folderStrategy.structure,

    layout: {
      type: layout.type,
      sectionHierarchy: sections.map((s) => s.id),
      gridStrategy: responsive.gridColumns > 0 ? `${responsive.gridColumns}-col` : "12-col",
      containerWidth: responsive.containerMaxWidth,
      verticalRhythm: "1.5",
    },

    navigation: {
      variant: components.navbar,
      sections: sections.map((s) => s.id),
      position: components.navbar === "floating" ? "absolute" : "sticky",
      mobileBehavior: "hamburger",
      scrollBehavior: "hide-on-scroll",
    },

    sections: sections.map((s) => ({
      name: s.name,
      type: s.required ? "required" as const : "optional" as const,
      description: `${s.name} section`,
      storytellingRole: s.name,
      composition: {
        variant: s.variant,
        layout: layout.type,
        interaction: "default",
        animation: animations.microInteractions[0] || "none",
      },
    })),

    animations: {
      library: animLib,
      intensity: context.animations.intensity,
      enabled: context.animations.enabled,
      pageTransitions: context.animations.intensity === "heavy",
      scrollAnimations: context.animations.intensity !== "none",
      microInteractions: context.animations.intensity === "moderate" || context.animations.intensity === "heavy",
    },

    content: {
      intent: context.intent.portfolioGoal,
      tone: "professional",
      voice: "first-person",
      storytelling: context.animations.intensity === "heavy" ? "narrative" : "linear",
      sections: {},
    },

    seo: {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical: seo.canonical,
      openGraph: seo.openGraph,
      twitter: seo.twitter,
    },

    accessibility: {
      level: accessibility.colorContrast,
      semanticHTML: accessibility.semanticHtml,
      ariaLabels: accessibility.ariaLabels,
      keyboardNavigation: accessibility.keyboardNavigation,
      focusManagement: accessibility.focusManagement,
      reducedMotion: accessibility.reducedMotion,
      colorContrast: accessibility.colorContrast === "AA",
      screenReader: accessibility.skipLinks,
    },

    performance: {
      lazyLoading: performance.lazyLoading,
      dynamicImports: performance.dynamicImports,
      imageOptimization: performance.imageOptimization,
      codeSplitting: performance.codeSplitting,
      treeShaking: performance.bundleOptimization,
      prefetching: performance.prefetching,
      bundleAnalysis: false,
    },

    designSystem: {
      tokens: {
        colors: Object.fromEntries(
          Object.entries(designSystem.colors.primary).map(([k, v]) => [k, v.value])
        ),
        typography: { heading: designSystem.typography.fontFamily, body: designSystem.typography.fontFamily },
        spacing: designSystem.spacing.scale,
        radius: { sm: designSystem.radius.sm, md: designSystem.radius.md, lg: designSystem.radius.lg, xl: designSystem.radius.xl },
        shadows: { sm: designSystem.shadows.sm, md: designSystem.shadows.md, lg: designSystem.shadows.lg, xl: designSystem.shadows.xl },
        animation: {},
        breakpoints: responsive.breakpoints.reduce((acc, b) => ({ ...acc, [b.name]: b.minWidth }), {}),
      },
      components: {},
    },

    metadata: {
      createdAt: new Date().toISOString(),
      version: "1.0.0",
      confidence: context.metadata.confidence,
      uniqueness: 0.7,
    },
  };
}
