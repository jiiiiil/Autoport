import type { CompositionGraph, ValidationResult, ValidationError, ValidationWarning } from "./types";

export function validateComposition(composition: CompositionGraph): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  validatePrompt(composition, errors, warnings);
  validateSections(composition, errors, warnings);
  validateLayout(composition, errors, warnings);
  validateNavigation(composition, errors, warnings);
  validateTheme(composition, errors, warnings);
  validateMotion(composition, errors, warnings);
  validateComponents(composition, errors, warnings);
  validateResponsive(composition, errors, warnings);
  validateAccessibility(composition, errors, warnings);
  validateGraphIntegrity(composition, errors, warnings);

  const criticalErrors = errors.filter(e => e.severity === "critical");
  const score = Math.max(0, 1 - (criticalErrors.length * 0.3) - (errors.length * 0.1) - (warnings.length * 0.02));

  return {
    valid: errors.filter(e => e.severity === "critical").length === 0,
    errors,
    warnings,
    score,
  };
}

function validatePrompt(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.prompt || composition.prompt.trim().length === 0) {
    errors.push({
      code: "EMPTY_PROMPT",
      message: "Prompt cannot be empty",
      field: "prompt",
      severity: "critical",
    });
  }

  if (!composition.aiContext) {
    errors.push({
      code: "MISSING_AI_CONTEXT",
      message: "AI Context is required for composition",
      field: "aiContext",
      severity: "critical",
    });
  }
}

function validateSections(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (composition.sections.length === 0) {
    errors.push({
      code: "NO_SECTIONS",
      message: "At least one section is required",
      field: "sections",
      severity: "critical",
    });
  }

  if (composition.sections.length > 15) {
    warnings.push({
      code: "TOO_MANY_SECTIONS",
      message: `${composition.sections.length} sections may impact performance`,
      field: "sections",
      severity: "minor",
    });
  }

  const ids = composition.sections.map(s => s.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    errors.push({
      code: "DUPLICATE_SECTIONS",
      message: `Duplicate section IDs found: ${duplicates.join(", ")}`,
      field: "sections",
      severity: "critical",
    });
  }

  for (const section of composition.sections) {
    if (!section.id || !section.name || !section.componentName) {
      errors.push({
        code: "INCOMPLETE_SECTION",
        message: `Section is missing required fields (id, name, componentName)`,
        field: `sections.${section.id || "unknown"}`,
        severity: "critical",
      });
    }

    if (section.priority < 0 || section.priority > 100) {
      warnings.push({
        code: "INVALID_PRIORITY",
        message: `Section "${section.id}" has unusual priority: ${section.priority}`,
        field: `sections.${section.id}.priority`,
        severity: "minor",
      });
    }
  }
}

function validateLayout(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.layout) {
    errors.push({
      code: "MISSING_LAYOUT",
      message: "Layout composition is required",
      field: "layout",
      severity: "critical",
    });
    return;
  }

  if (!composition.layout.style) {
    errors.push({
      code: "MISSING_LAYOUT_STYLE",
      message: "Layout style must be specified",
      field: "layout.style",
      severity: "critical",
    });
  }

  if (composition.layout.sectionOrder.length === 0) {
    warnings.push({
      code: "EMPTY_SECTION_ORDER",
      message: "Layout section order is empty",
      field: "layout.sectionOrder",
      severity: "minor",
    });
  }

  if (!composition.layout.containerWidth) {
    warnings.push({
      code: "MISSING_CONTAINER_WIDTH",
      message: "Container width not specified",
      field: "layout.containerWidth",
      severity: "minor",
    });
  }
}

function validateNavigation(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.navigation) {
    errors.push({
      code: "MISSING_NAVIGATION",
      message: "Navigation composition is required",
      field: "navigation",
      severity: "critical",
    });
    return;
  }

  if (!composition.navigation.style) {
    errors.push({
      code: "MISSING_NAV_STYLE",
      message: "Navigation style must be specified",
      field: "navigation.style",
      severity: "critical",
    });
  }

  if (composition.navigation.style !== "none" && composition.navigation.sections.length === 0) {
    warnings.push({
      code: "EMPTY_NAV_SECTIONS",
      message: "Navigation has no sections",
      field: "navigation.sections",
      severity: "minor",
    });
  }
}

function validateTheme(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.theme) {
    errors.push({
      code: "MISSING_THEME",
      message: "Theme composition is required",
      field: "theme",
      severity: "critical",
    });
    return;
  }

  if (!composition.theme.colors.primary) {
    errors.push({
      code: "MISSING_PRIMARY_COLOR",
      message: "Primary color must be defined",
      field: "theme.colors.primary",
      severity: "critical",
    });
  }

  if (!composition.theme.typography.headingFont) {
    warnings.push({
      code: "MISSING_HEADING_FONT",
      message: "Heading font not specified",
      field: "theme.typography.headingFont",
      severity: "minor",
    });
  }
}

function validateMotion(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.motion) {
    errors.push({
      code: "MISSING_MOTION",
      message: "Motion composition is required",
      field: "motion",
      severity: "critical",
    });
    return;
  }

  if (!composition.motion.style) {
    errors.push({
      code: "MISSING_MOTION_STYLE",
      message: "Motion style must be specified",
      field: "motion.style",
      severity: "critical",
    });
  }
}

function validateComponents(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (composition.components.length === 0) {
    warnings.push({
      code: "NO_COMPONENTS",
      message: "No components defined",
      field: "components",
      severity: "minor",
    });
  }

  const hasNav = composition.components.some(c => c.name === "Navigation");
  if (!hasNav && composition.navigation.style !== "none") {
    warnings.push({
      code: "MISSING_NAV_COMPONENT",
      message: "No navigation component defined",
      field: "components",
      severity: "minor",
    });
  }
}

function validateResponsive(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.responsive) {
    errors.push({
      code: "MISSING_RESPONSIVE",
      message: "Responsive composition is required",
      field: "responsive",
      severity: "critical",
    });
    return;
  }

  if (composition.responsive.breakpoints.length === 0) {
    warnings.push({
      code: "NO_BREAKPOINTS",
      message: "No responsive breakpoints defined",
      field: "responsive.breakpoints",
      severity: "minor",
    });
  }
}

function validateAccessibility(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!composition.accessibility) {
    errors.push({
      code: "MISSING_A11Y",
      message: "Accessibility configuration is required",
      field: "accessibility",
      severity: "critical",
    });
    return;
  }

  if (!composition.accessibility.semanticHTML) {
    warnings.push({
      code: "NO_SEMANTIC_HTML",
      message: "Semantic HTML should be enabled",
      field: "accessibility.semanticHTML",
      severity: "minor",
    });
  }

  if (!composition.accessibility.keyboardNavigation) {
    warnings.push({
      code: "NO_KEYBOARD_NAV",
      message: "Keyboard navigation should be enabled",
      field: "accessibility.keyboardNavigation",
      severity: "minor",
    });
  }
}

function validateGraphIntegrity(
  composition: CompositionGraph,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  const sectionIds = new Set(composition.sections.map(s => s.id));
  const navSections = new Set(composition.navigation.sections);

  for (const navSection of navSections) {
    if (navSection !== "more" && !sectionIds.has(navSection)) {
      warnings.push({
        code: "NAV_SECTION_MISMATCH",
        message: `Navigation references section "${navSection}" that doesn't exist`,
        field: "navigation.sections",
        severity: "minor",
      });
    }
  }

  const layoutOrder = new Set(composition.layout.sectionOrder);
  for (const section of composition.sections) {
    if (!layoutOrder.has(section.id)) {
      warnings.push({
        code: "SECTION_NOT_IN_LAYOUT",
        message: `Section "${section.id}" not in layout section order`,
        field: "layout.sectionOrder",
        severity: "minor",
      });
    }
  }

  if (composition.tokens && Object.keys(composition.tokens).length === 0) {
    warnings.push({
      code: "EMPTY_TOKENS",
      message: "Design tokens are empty",
      field: "tokens",
      severity: "minor",
    });
  }
}
