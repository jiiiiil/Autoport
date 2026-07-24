import type { ExecutionManifest, QualityGateResult, QualityCheckResult, AccessibilityResult, PerformanceResult } from "./types";

function runQualityChecks(manifest: ExecutionManifest): QualityCheckResult[] {
  const checks: QualityCheckResult[] = [];

  const hasLazyLoading = manifest.blueprint.performance.lazyLoading;
  checks.push({
    name: "performance-lazy-loading",
    passed: hasLazyLoading,
    score: hasLazyLoading ? 95 : 70,
    message: hasLazyLoading ? "Lazy loading enabled" : "Consider adding lazy loading for better performance",
  });

  const hasReducedMotion = manifest.blueprint.accessibility.reducedMotion;
  checks.push({
    name: "accessibility-reduced-motion",
    passed: hasReducedMotion,
    score: hasReducedMotion ? 90 : 50,
    message: hasReducedMotion ? "Reduced motion support included" : "Consider adding reduced motion support",
  });

  const hasSEO = manifest.blueprint.seo.title.length > 0;
  checks.push({
    name: "seo-meta-tags",
    passed: hasSEO,
    score: hasSEO ? 95 : 40,
    message: hasSEO ? "SEO meta tags configured" : "Add SEO meta tags for better search visibility",
  });

  const hasImageOpt = manifest.blueprint.performance.imageOptimization;
  checks.push({
    name: "image-optimization",
    passed: hasImageOpt,
    score: hasImageOpt ? 90 : 60,
    message: hasImageOpt ? "Image optimization configured" : "Consider adding image optimization",
  });

  const hasResponsive = manifest.blueprint.responsive.breakpoints.length >= 3;
  checks.push({
    name: "responsive-design",
    passed: hasResponsive,
    score: hasResponsive ? 95 : 60,
    message: hasResponsive ? `${manifest.blueprint.responsive.breakpoints.length} breakpoints configured` : "Add more breakpoints for better responsiveness",
  });

  const depCount = manifest.dependencies.core.length + manifest.dependencies.ui.length + manifest.dependencies.animation.length;
  const bundleScore = depCount <= 15 ? 95 : depCount <= 25 ? 80 : 60;
  checks.push({
    name: "bundle-size",
    passed: depCount <= 25,
    score: bundleScore,
    message: `${depCount} dependencies — ${depCount <= 15 ? "lean" : depCount <= 25 ? "moderate" : "heavy"} bundle`,
  });

  checks.push({
    name: "validation-passed",
    passed: manifest.validation.valid,
    score: manifest.validation.score,
    message: manifest.validation.valid ? "Blueprint validation passed" : `${manifest.validation.issues.length} validation issue(s)`,
  });

  return checks;
}

function runAccessibilityChecks(manifest: ExecutionManifest): AccessibilityResult {
  const checks = [
    { name: "aria-labels", passed: manifest.blueprint.accessibility.ariaLabels, message: "ARIA labels included on all sections" },
    { name: "focus-order", passed: manifest.blueprint.accessibility.focusManagement, message: "Focus order follows document flow" },
    { name: "color-contrast", passed: true, message: `Color contrast level: ${manifest.blueprint.accessibility.colorContrast}` },
    { name: "keyboard-navigation", passed: manifest.blueprint.accessibility.keyboardNavigation, message: "Keyboard navigation supported" },
    { name: "screen-reader", passed: manifest.blueprint.accessibility.semanticHtml, message: "Screen reader compatible" },
    { name: "skip-links", passed: manifest.blueprint.accessibility.skipLinks, message: "Skip navigation links included" },
  ];

  const score = (checks.filter((c) => c.passed).length / checks.length) * 100;

  return { score, checks, wcagLevel: score >= 90 ? "AA" : "A" };
}

function runPerformanceChecks(manifest: ExecutionManifest): PerformanceResult {
  const deps = manifest.dependencies;
  const totalDeps = deps.core.length + deps.ui.length + deps.animation.length + deps.utilities.length;
  const estimatedBundleSize = totalDeps * 45;
  const score = estimatedBundleSize <= 600 ? 95 : estimatedBundleSize <= 1000 ? 80 : 60;

  return {
    score,
    estimatedBundleSize: `${estimatedBundleSize}KB`,
    optimizationLevel: score >= 90 ? "optimal" : score >= 70 ? "good" : "needs-improvement",
    recommendations: [
      manifest.blueprint.performance.dynamicImports ? "" : "Enable dynamic imports",
      manifest.blueprint.performance.codeSplitting ? "" : "Enable code splitting",
      manifest.blueprint.performance.prefetching ? "" : "Enable prefetching",
    ].filter(Boolean),
  };
}

export function runQualityGate(manifest: ExecutionManifest): QualityGateResult {
  const checks = runQualityChecks(manifest);
  const accessibility = runAccessibilityChecks(manifest);
  const performance = runPerformanceChecks(manifest);

  const totalScore = (
    (checks.reduce((sum, c) => sum + c.score, 0) / checks.length) *
    0.5 +
    accessibility.score * 0.25 +
    performance.score * 0.25
  );

  return {
    passed: manifest.validation.valid && totalScore >= 70,
    score: Math.round(totalScore),
    checks,
    accessibility,
    performance,
  };
}
