// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";
import type { PortfolioBlueprint as BP } from "../blueprint/types";

type Restriction = { type: string; target: string; description: string };

export function solveConstraints(
  blueprint: PortfolioBlueprint,
  restrictions: Restriction[]
): PortfolioBlueprint {
  const solved = JSON.parse(JSON.stringify(blueprint)) as PortfolioBlueprint;

  for (const r of restrictions) {
    if (r.type === "forbidden") {
      const target = r.target.toLowerCase();

      if (target === "animation" || target === "animations") {
        solved.animations.intensity = "none";
        solved.animations.hero = { type: "none", duration: "0ms", easing: "ease" };
        solved.animations.cards = { type: "none", duration: "0ms", easing: "ease" };
        solved.animations.scroll = { enabled: false, type: "none" };
        solved.animations.transitions = { page: "none", hover: "none", focus: "none" };
        solved.animations.microInteractions = [];
        solved.accessibility.reducedMotion = true;
      }

      if (target === "footer") {
        solved.components.footer = "none";
        solved.sections = solved.sections.filter((s) => s.id !== "footer");
      }

      if (target === "sidebar") {
        solved.navigation.variant = "sticky";
        solved.navigation.position = "sticky";
      }

      if (target === "cards" || target === "card") {
        solved.components.card = "minimal";
      }

      if (target === "styling" && r.description.includes("tailwind")) {
        solved.styling = "css";
      }

      if (target === "layout" && r.description.includes("sidebar")) {
        solved.navigation.variant = "sticky";
      }
    }

    if (r.type === "required") {
      const target = r.target.toLowerCase();

      if (target === "framework" && r.description.includes("react")) {
        solved.framework = "react";
      }
      if (target === "language" && r.description.includes("typescript")) {
        solved.language = "typescript";
      }
      if (target === "styling" && r.description.includes("tailwind")) {
        solved.styling = "tailwind";
      }
    }
  }

  return solved;
}
