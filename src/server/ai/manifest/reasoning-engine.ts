// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";

export function reasonAndOptimize(blueprint: PortfolioBlueprint): PortfolioBlueprint {
  const optimized = JSON.parse(JSON.stringify(blueprint)) as PortfolioBlueprint;

  if (optimized.navigation.variant === "sidebar" && optimized.layout.type === "minimal") {
    optimized.navigation.variant = "sticky";
    optimized.navigation.position = "sticky";
  }

  if (optimized.animations.intensity === "heavy" && optimized.performance?.bundleOptimization === false) {
    optimized.performance.animationOptimization = true;
    optimized.performance.bundleOptimization = true;
  }

  if (optimized.layout.type === "dashboard" && !optimized.sections.some((s) => s.id === "skills")) {
    optimized.sections.push({
      id: "skills",
      name: "Skills",
      component: "SkillsSection",
      variant: "icon-grid",
      priority: 20,
      required: false,
      props: {},
    });
  }

  if (optimized.designSystem.theme === "dark") {
    const bg = optimized.designSystem.colors.background;
    if (bg.default === "#FFFFFF" || bg.default === "#FAFAFA") {
      bg.default = "#09090B";
      bg.card = "#18181B";
      bg.elevated = "#27272A";
    }
  }

  if (optimized.animations.intensity === "none") {
    optimized.animations.hero = { type: "none", duration: "0ms", easing: "ease" };
    optimized.animations.cards = { type: "none", duration: "0ms", easing: "ease" };
    optimized.animations.scroll = { enabled: false, type: "none" };
    optimized.animations.transitions = { page: "none", hover: "none", focus: "none" };
    optimized.animations.microInteractions = [];
  }

  if (optimized.framework === "nextjs" && optimized.performance.prerendering === false) {
    optimized.performance.prerendering = true;
  }

  const sectionIds = optimized.sections.map((s) => s.id);
  const heroIdx = sectionIds.indexOf("hero");
  if (heroIdx > 0) {
    const [heroSection] = optimized.sections.splice(heroIdx, 1);
    optimized.sections.unshift(heroSection);
  }

  return optimized;
}
