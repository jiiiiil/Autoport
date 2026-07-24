import type { DependencyConflict, DetectedLibrary } from "./types";

interface DependencyRule {
  a: string;
  b: string;
  type: "conflict" | "warning" | "incompatible";
  reason: string;
  resolution?: string;
}

const DEPENDENCY_RULES: DependencyRule[] = [
  {
    a: "react",
    b: "angular",
    type: "conflict",
    reason: "React and Angular are competing frameworks and cannot be used together",
  },
  {
    a: "react",
    b: "vue",
    type: "conflict",
    reason: "React and Vue are competing frameworks and cannot be used together",
  },
  {
    a: "vue",
    b: "angular",
    type: "conflict",
    reason: "Vue and Angular are competing frameworks and cannot be used together",
  },
  {
    a: "tailwind",
    b: "bootstrap",
    type: "warning",
    reason: "Tailwind and Bootstrap can conflict on utility classes",
    resolution: "Use one as primary, import Bootstrap only for components not covered by Tailwind",
  },
  {
    a: "styled-components",
    b: "emotion",
    type: "warning",
    reason: "Two CSS-in-JS solutions can cause style specificity issues",
    resolution: "Choose one CSS-in-JS solution for consistency",
  },
  {
    a: "shadcn",
    b: "antd",
    type: "warning",
    reason: "shadcn (Radix-based) and Ant Design have different design systems",
    resolution: "Use shadcn for custom UI, Ant Design only for specific components",
  },
  {
    a: "framer-motion",
    b: "gsap",
    type: "warning",
    reason: "Two animation libraries can cause conflicts and bundle bloat",
    resolution: "Use framer-motion for React component animations, GSAP for complex timeline animations",
  },
  {
    a: "react-spring",
    b: "framer-motion",
    type: "warning",
    reason: "Two React animation libraries can conflict",
    resolution: "Choose one based on use case",
  },
  {
    a: "material-ui",
    b: "chakra",
    type: "conflict",
    reason: "Two complete UI component libraries will cause style conflicts",
    resolution: "Choose one component library",
  },
  {
    a: "tailwind",
    b: "styled-components",
    type: "warning",
    reason: "Can be used together but may cause style duplication",
    resolution: "Use Tailwind for utility classes, styled-components for complex dynamic styles",
  },
  {
    a: "nextjs",
    b: "react-bits",
    type: "warning",
    reason: "React Bits components may need Next.js specific adjustments",
    resolution: "Ensure React Bits components are client-side compatible",
  },
];

export function validateDependencies(
  frameworks: string[],
  styling: string[],
  libraries: DetectedLibrary[]
): DependencyConflict[] {
  const conflicts: DependencyConflict[] = [];
  const allTech = [
    ...frameworks,
    ...styling,
    ...libraries.map((l) => l.name),
  ].map((t) => t.toLowerCase());

  for (const rule of DEPENDENCY_RULES) {
    const aLower = rule.a.toLowerCase();
    const bLower = rule.b.toLowerCase();

    if (allTech.includes(aLower) && allTech.includes(bLower)) {
      conflicts.push({
        library_a: rule.a,
        library_b: rule.b,
        reason: rule.reason,
        severity: rule.type === "conflict" ? "error" : "warning",
        resolution: rule.resolution,
      });
    }
  }

  return conflicts;
}

export function getCompatibilityScore(
  frameworks: string[],
  styling: string[],
  libraries: DetectedLibrary[]
): number {
  const conflicts = validateDependencies(frameworks, styling, libraries);
  const errors = conflicts.filter((c) => c.severity === "error").length;
  const warnings = conflicts.filter((c) => c.severity === "warning").length;

  return Math.max(0, 100 - errors * 30 - warnings * 10);
}
