import type { PortfolioBlueprint } from "../blueprint/types";
import type { ComposedComponent, GenerationInstruction } from "./types";

function buildSectionInstruction(
  sectionId: string,
  sectionName: string,
  variant: string,
  priority: number,
  blueprint: PortfolioBlueprint
): GenerationInstruction {
  const componentName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

  return {
    id: `section-${sectionId}`,
    phase: "component-generation",
    target: `${componentName}Section`,
    action: "create",
    specification: {
      sectionId,
      sectionName,
      variant,
      componentName: `${componentName}Section`,
      animation: {
        type: blueprint.animations.library,
        intensity: blueprint.animations.intensity,
        trigger: "scroll",
      },
      accessibility: {
        role: "region",
        ariaLabels: [`${sectionName} section`],
        focusOrder: priority,
      },
    },
    dependencies: [],
    priority,
  };
}

export function buildInstructions(
  blueprint: PortfolioBlueprint,
  components: Record<string, ComposedComponent>
): GenerationInstruction[] {
  const instructions: GenerationInstruction[] = [];

  instructions.push({
    id: "layout",
    phase: "setup",
    target: "Layout",
    action: "create",
    specification: {
      layout: blueprint.layout.type,
      theme: blueprint.designSystem.theme,
      navigation: blueprint.navigation.variant,
    },
    dependencies: [],
    priority: 0,
  });

  instructions.push({
    id: "design-tokens",
    phase: "setup",
    target: "DesignTokens",
    action: "create",
    specification: {
      typography: blueprint.designSystem.typography.fontFamily,
      spacing: blueprint.designSystem.spacing.unit,
      radius: blueprint.designSystem.radius.md,
      colors: blueprint.designSystem.colors.primary.map((c) => c.value),
    },
    dependencies: [],
    priority: 1,
  });

  for (const section of blueprint.sections) {
    const sectionName = section.name || section.id.charAt(0).toUpperCase() + section.id.slice(1);
    instructions.push(
      buildSectionInstruction(section.id, sectionName, section.variant, section.priority, blueprint)
    );
  }

  instructions.push({
    id: "page-metadata",
    phase: "finalize",
    target: "Metadata",
    action: "create",
    specification: {
      title: blueprint.seo.title,
      description: blueprint.seo.description,
      keywords: blueprint.seo.keywords,
    },
    dependencies: blueprint.sections.map((s) => `section-${s.id}`),
    priority: 100,
  });

  return instructions;
}
