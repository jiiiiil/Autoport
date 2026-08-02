import type { AIContextObject, DesignLanguage } from "../intelligence/types";
import type {
  CompositionGraph, PromptConstraints, ComposedSection,
  ComposedLayout, ComposedNavigation, ComposedTheme,
  ComposedMotion, ComposedComponent, ComposedResponsive,
  ComposedAccessibility, CompositionMetadata,
} from "./types";
import { resolveConstraints, getPromptHash } from "./constraint-resolver";
import { composeLayout } from "./layout-composer";
import { composeSections } from "./section-composer";
import { composeStory } from "./story-composer";
import { composeNavigation } from "./navigation-composer";
import { composeTheme } from "./theme-composer";
import { composeMotion } from "./motion-composer";
import { composeComponents } from "./component-composer";
import { composeResponsive } from "./responsive-composer";
import { runDesignIntelligence } from "../blueprint/design-intelligence";

function composeAccessibility(
  context: AIContextObject,
  promptHash: string
): ComposedAccessibility {
  const hashNum = parseInt(promptHash, 36) % 100;

  return {
    semanticHTML: context.accessibility,
    ariaLabels: context.accessibility,
    keyboardNavigation: context.accessibility,
    focusManagement: context.accessibility,
    reducedMotion: !context.animations.enabled || context.animations.intensity === "none",
    colorContrast: hashNum % 3 === 0 ? "AAA" : "AA",
    screenReader: context.accessibility,
    skipLinks: context.accessibility,
    headingHierarchy: context.accessibility,
    altTextRequired: context.accessibility,
    landmarkRegions: context.accessibility,
  };
}

function computeTokens(theme: ComposedTheme): Record<string, string> {
  const tokens: Record<string, string> = {};

  tokens["--color-primary"] = theme.colors.primary;
  tokens["--color-secondary"] = theme.colors.secondary;
  tokens["--color-accent"] = theme.colors.accent;
  tokens["--color-background"] = theme.colors.background;
  tokens["--color-surface"] = theme.colors.surface;
  tokens["--color-surface-elevated"] = theme.colors.surfaceElevated;
  tokens["--color-text"] = theme.colors.text;
  tokens["--color-text-secondary"] = theme.colors.textSecondary;
  tokens["--color-text-muted"] = theme.colors.textMuted;
  tokens["--color-border"] = theme.colors.border;
  tokens["--color-border-subtle"] = theme.colors.borderSubtle;
  tokens["--color-success"] = theme.colors.success;
  tokens["--color-warning"] = theme.colors.warning;
  tokens["--color-error"] = theme.colors.error;
  tokens["--color-info"] = theme.colors.info;
  tokens["--color-overlay"] = theme.colors.overlay;

  tokens["--font-heading"] = theme.typography.headingFont;
  tokens["--font-body"] = theme.typography.bodyFont;
  tokens["--font-mono"] = theme.typography.monoFont;

  for (const [key, value] of Object.entries(theme.spacing)) {
    tokens[`--space-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    tokens[`--radius-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.shadows)) {
    tokens[`--shadow-${key}`] = value;
  }

  return tokens;
}

function computeMetadata(
  prompt: string,
  promptHash: string,
  constraints: PromptConstraints,
  startTime: number
): CompositionMetadata {
  return {
    composedAt: new Date().toISOString(),
    version: "1.0.0",
    promptHash,
    confidence: 0.85,
    uniquenessScore: 0.9,
    constraintOverrides: [
      ...constraints.forbidden,
      ...constraints.required,
      ...Object.entries(constraints.preferences).map(([k, v]) => `${k}:${v}`),
    ],
    compositionTime: `${Date.now() - startTime}ms`,
    refinementApplied: false,
    validationPassed: false,
  };
}

export function buildCompositionGraph(
  prompt: string,
  context: AIContextObject,
  startTime: number
): CompositionGraph {
  const promptHash = getPromptHash(prompt);

  // Phase 1: Run Design Intelligence before any code generation
  const designReport = runDesignIntelligence(prompt, context);
  const designDecisions = designReport.decisions;

  // Apply design intelligence decisions to context
  const enrichedContext: AIContextObject = {
    ...context,
    rawPrompt: context.rawPrompt,
    normalizedPrompt: context.normalizedPrompt,
    designLanguage: context.designLanguage.length > 0 ? context.designLanguage : [{
      name: inferDesignLangFromDecisions(designDecisions) as DesignLanguage,
      confidence: 0.8,
      explicit: false,
    }],
    metadata: {
      ...context.metadata,
      confidence: Math.min(context.metadata.confidence, designReport.overallScore / 100),
    },
  };

  const constraints = resolveConstraints(prompt, enrichedContext);

  const sections = composeSections(enrichedContext, constraints, promptHash);

  const sectionOrder = sections.map(s => s.id);

  const layout = composeLayout(enrichedContext, constraints, promptHash, sectionOrder);

  layout.sectionOrder = sections.map(s => s.id);

  const navigation = composeNavigation(enrichedContext, constraints, layout, sections.map(s => s.id), promptHash);

  const theme = composeTheme(enrichedContext, constraints, promptHash);

  const motion = composeMotion(enrichedContext, constraints, promptHash);

  const story = composeStory(enrichedContext, constraints, sections, promptHash);

  const components = composeComponents(sections, enrichedContext, navigation.style, promptHash);

  const responsive = composeResponsive(enrichedContext, constraints, layout, promptHash);

  const accessibility = composeAccessibility(enrichedContext, promptHash);

  const tokens = computeTokens(theme);

  const metadata = computeMetadata(prompt, promptHash, constraints, startTime);
  metadata.confidence = designReport.overallScore / 100;
  metadata.uniquenessScore = Math.min(1, (designReport.overallScore + 20) / 100);

  return {
    prompt,
    aiContext: context,
    blueprint: {
      portfolioType: `${context.profession} Portfolio`,
      targetAudience: context.intent.targetAudience || "General audience",
      framework: context.primaryFramework,
      language: context.primaryLanguage,
      styling: context.primaryStyling,
      designLanguage: context.designLanguage.map(dl => dl.name),
      profession: context.profession,
      theme: context.theme,
      libraries: {
        ui: context.primaryStyling,
        animation: context.animationLibraries[0]?.name || "framer-motion",
        icons: context.iconLibraries[0]?.name || "lucide",
        charts: context.chartLibraries[0]?.name || "recharts",
      },
      folderStrategy: ["src/components", "src/sections", "src/lib", "src/hooks"],
      layout: {
        type: layout.style,
        sectionHierarchy: layout.sectionOrder,
        gridStrategy: layout.gridStrategy,
        containerWidth: layout.containerWidth,
        verticalRhythm: layout.verticalRhythm,
      },
      navigation: {
        variant: navigation.style,
        sections: navigation.sections,
        position: navigation.position,
        mobileBehavior: navigation.mobileBehavior,
        scrollBehavior: navigation.scrollBehavior,
      },
      sections: sections.map(s => ({
        name: s.id,
        type: s.type as "required" | "optional" | "forbidden",
        description: `${s.name} section`,
        storytellingRole: s.storytellingRole,
        composition: {
          variant: s.variant,
          layout: s.layout,
          interaction: s.interaction,
          animation: s.animation,
        },
      })),
      animations: {
        library: motion.library,
        intensity: motion.intensity,
        enabled: motion.intensity !== "none",
        pageTransitions: motion.pageTransitions.enabled,
        scrollAnimations: motion.scroll.enabled,
        microInteractions: motion.microInteractions.length > 0,
      },
      content: {
        intent: context.intent.portfolioGoal,
        tone: context.intent.tone || "professional",
        voice: "first-person",
        storytelling: story.flow,
        sections: {},
      },
      seo: {
        title: `${context.profession} Portfolio`,
        description: context.intent.portfolioGoal,
        keywords: context.rawExtraction.keywords.slice(0, 10),
        canonical: "",
        openGraph: {
          title: `${context.profession} Portfolio`,
          description: context.intent.portfolioGoal,
          image: "",
        },
        twitter: {
          card: "summary_large_image",
          title: `${context.profession} Portfolio`,
          description: context.intent.portfolioGoal,
        },
      },
      accessibility: {
        level: accessibility.colorContrast,
        semanticHTML: accessibility.semanticHTML,
        ariaLabels: accessibility.ariaLabels,
        keyboardNavigation: accessibility.keyboardNavigation,
        focusManagement: accessibility.focusManagement,
        reducedMotion: accessibility.reducedMotion,
        colorContrast: accessibility.colorContrast === "AA",
        screenReader: accessibility.screenReader,
      },
      performance: {
        lazyLoading: true,
        dynamicImports: true,
        imageOptimization: true,
        codeSplitting: true,
        treeShaking: true,
        prefetching: true,
        bundleAnalysis: false,
      },
      designSystem: {
        tokens: {
          colors: Object.fromEntries(
            Object.entries(theme.colors).filter(([_, v]) => typeof v === "string" && v.startsWith("#"))
          ),
          typography: {
            heading: theme.typography.headingFont,
            body: theme.typography.bodyFont,
          },
          spacing: theme.spacing,
          radius: theme.radius,
          shadows: theme.shadows,
          animation: {},
          breakpoints: Object.fromEntries(
            responsive.breakpoints.map(bp => [bp.name, bp.minWidth])
          ),
        },
        components: {},
      },
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0.0",
        confidence: metadata.confidence,
        uniqueness: metadata.uniquenessScore,
      },
    },
    layout,
    sections,
    navigation,
    theme,
    motion,
    components,
    responsive,
    accessibility,
    story,
    tokens,
    metadata,
  };
}

function inferDesignLangFromDecisions(decisions: ReturnType<typeof runDesignIntelligence>["decisions"]): string {
  const styleDecision = decisions.find(d => d.category === "Design Style");
  if (!styleDecision) return "minimal";

  const decision = styleDecision.decision.toLowerCase();
  if (decision.includes("luxury") || decision.includes("premium")) return "luxury";
  if (decision.includes("cyberpunk")) return "cyberpunk";
  if (decision.includes("apple")) return "apple";
  if (decision.includes("minimal")) return "minimal";
  if (decision.includes("creative")) return "creative";
  if (decision.includes("editorial")) return "editorial";
  if (decision.includes("dark")) return "dark-academic";

  return "minimal";
}
