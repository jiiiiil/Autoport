// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";
import type { ValidationReport, ValidationIssue } from "./types";

export function validateBlueprint(blueprint: PortfolioBlueprint): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!blueprint.framework || blueprint.framework === "other") {
    issues.push({ field: "framework", type: "error", message: "Framework must be specified", fix: "Default to react" });
  }
  if (!blueprint.language || blueprint.language === "other") {
    issues.push({ field: "language", type: "error", message: "Language must be specified", fix: "Default to typescript" });
  }
  if (!blueprint.styling) {
    issues.push({ field: "styling", type: "error", message: "Styling system must be specified", fix: "Default to tailwind" });
  }
  if (!blueprint.layout?.type) {
    issues.push({ field: "layout", type: "error", message: "Layout type must be specified", fix: "Default to minimal" });
  }
  if (!blueprint.designSystem?.theme) {
    issues.push({ field: "designSystem.theme", type: "warning", message: "Theme not specified", fix: "Default to dark" });
  }
  if (!blueprint.designSystem?.colors) {
    issues.push({ field: "designSystem.colors", type: "error", message: "Color palette missing" });
  }
  if (!blueprint.designSystem?.typography) {
    issues.push({ field: "designSystem.typography", type: "error", message: "Typography scale missing" });
  }

  if (!blueprint.sections || blueprint.sections.length === 0) {
    issues.push({ field: "sections", type: "error", message: "At least one section is required" });
  }

  const sectionIds = blueprint.sections?.map((s) => s.id) ?? [];
  const duplicates = sectionIds.filter((id, i) => sectionIds.indexOf(id) !== i);
  if (duplicates.length > 0) {
    issues.push({ field: "sections", type: "warning", message: `Duplicate sections: ${[...new Set(duplicates)].join(", ")}` });
  }

  if (!blueprint.libraries?.animation || blueprint.libraries.animation.length === 0) {
    issues.push({ field: "libraries.animation", type: "warning", message: "No animation library specified", fix: "Default to framer-motion" });
  }
  if (!blueprint.libraries?.icons || blueprint.libraries.icons.length === 0) {
    issues.push({ field: "libraries.icons", type: "warning", message: "No icon library specified", fix: "Default to lucide" });
  }

  if (!blueprint.animations) {
    issues.push({ field: "animations", type: "warning", message: "Animation plan missing" });
  }
  if (!blueprint.responsive?.breakpoints || blueprint.responsive.breakpoints.length === 0) {
    issues.push({ field: "responsive", type: "error", message: "Responsive breakpoints missing" });
  }
  if (!blueprint.seo) {
    issues.push({ field: "seo", type: "warning", message: "SEO plan missing" });
  }
  if (!blueprint.accessibility) {
    issues.push({ field: "accessibility", type: "warning", message: "Accessibility plan missing" });
  }
  if (!blueprint.performance) {
    issues.push({ field: "performance", type: "warning", message: "Performance plan missing" });
  }
  if (!blueprint.folderStrategy) {
    issues.push({ field: "folderStrategy", type: "warning", message: "Folder strategy missing" });
  }

  const hasHero = blueprint.sections?.some((s) => s.id === "hero");
  if (!hasHero) {
    issues.push({ field: "sections.hero", type: "info", message: "No hero section defined" });
  }
  const hasContact = blueprint.sections?.some((s) => s.id === "contact");
  if (!hasContact) {
    issues.push({ field: "sections.contact", type: "info", message: "No contact section defined" });
  }

  const errors = issues.filter((i) => i.type === "error").length;
  const warnings = issues.filter((i) => i.type === "warning").length;
  const infos = issues.filter((i) => i.type === "info").length;

  const score = Math.max(0, 100 - errors * 15 - warnings * 5 - infos * 1);

  const totalFields = 20;
  const filledFields = [
    blueprint.framework, blueprint.language, blueprint.styling,
    blueprint.layout?.type, blueprint.designSystem?.theme,
    blueprint.designSystem?.colors, blueprint.designSystem?.typography,
    blueprint.sections?.length, blueprint.animations, blueprint.responsive,
    blueprint.seo, blueprint.accessibility, blueprint.performance,
    blueprint.folderStrategy, blueprint.libraries?.ui?.length,
    blueprint.libraries?.animation?.length, blueprint.libraries?.icons?.length,
    blueprint.navigation, blueprint.content, blueprint.assets,
  ].filter(Boolean).length;

  const completeness = Math.round((filledFields / totalFields) * 100);

  return {
    valid: errors === 0,
    issues,
    score,
    completeness,
  };
}
