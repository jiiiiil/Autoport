import type { PortfolioBlueprint } from "../blueprint/types";
import type { DependencyPlan } from "./types";

const FRAMEWORK_PACKAGES: Record<string, { name: string; version: string; reason: string }> = {
  "nextjs": { name: "next", version: "^14.0.0", reason: "React framework with SSR/SSG" },
  "react": { name: "react", version: "^18.0.0", reason: "UI library" },
  "vite": { name: "vite", version: "^5.0.0", reason: "Build tool" },
  "remix": { name: "@remix-run/react", version: "^2.0.0", reason: "Full-stack React framework" },
  "astro": { name: "astro", version: "^4.0.0", reason: "Static site generator" },
  "gatsby": { name: "gatsby", version: "^5.0.0", reason: "Static site generator" },
};

const UI_LIBRARIES: Record<string, { name: string; version: string; reason: string }> = {
  "shadcn": { name: "class-variance-authority", version: "^0.7.0", reason: "Component variant management" },
  "radix-ui": { name: "@radix-ui/react-slot", version: "^1.0.0", reason: "Headless UI primitives" },
  "chakra-ui": { name: "@chakra-ui/react", version: "^3.0.0", reason: "Component library" },
  "ant-design": { name: "antd", version: "^5.0.0", reason: "Enterprise UI library" },
  "mantine": { name: "@mantine/core", version: "^7.0.0", reason: "Full-featured component library" },
  "material-ui": { name: "@mui/material", version: "^5.0.0", reason: "Material Design components" },
  "bootstrap": { name: "bootstrap", version: "^5.3.0", reason: "CSS framework" },
};

const ANIMATION_LIBRARIES: Record<string, { name: string; version: string; reason: string }> = {
  "framer-motion": { name: "framer-motion", version: "^11.0.0", reason: "React animation library" },
  "gsap": { name: "gsap", version: "^3.12.0", reason: "Professional animation toolkit" },
  "animejs": { name: "animejs", version: "^3.2.0", reason: "Lightweight animation library" },
  "lottie": { name: "lottie-react", version: "^2.4.0", reason: "Lottie animation player" },
  "autoanimate": { name: "@formkit/auto-animate", version: "^0.8.0", reason: "Zero-config animations" },
};

const CHART_LIBRARIES: Record<string, { name: string; version: string; reason: string }> = {
  "recharts": { name: "recharts", version: "^2.12.0", reason: "Composable charting library" },
  "chart.js": { name: "chart.js", version: "^4.4.0", reason: "Canvas-based charts" },
  "d3": { name: "d3", version: "^7.9.0", reason: "Data visualization toolkit" },
  "visx": { name: "@visx/visx", version: "^3.0.0", reason: "Low-level visualization primitives" },
  "nivo": { name: "@nivo/core", version: "^0.80.0", reason: "Declarative charts" },
};

const ICON_LIBRARIES: Record<string, { name: string; version: string; reason: string }> = {
  "lucide-react": { name: "lucide-react", version: "^0.400.0", reason: "Beautiful icons" },
  "react-icons": { name: "react-icons", version: "^5.0.0", reason: "Multi-library icon pack" },
  "heroicons": { name: "@heroicons/react", version: "^2.1.0", reason: "Heroicons for React" },
};

export function planDependencies(blueprint: PortfolioBlueprint): DependencyPlan {
  const core: DependencyPlan["core"] = [];
  const ui: DependencyPlan["ui"] = [];
  const animation: DependencyPlan["animation"] = [];
  const utilities: DependencyPlan["utilities"] = [];
  const dev: DependencyPlan["dev"] = [];

  const frameworkPkg = FRAMEWORK_PACKAGES[blueprint.framework];
  if (frameworkPkg) core.push(frameworkPkg);

  core.push({ name: "react", version: "^18.0.0", reason: "UI library" });
  core.push({ name: "react-dom", version: "^18.0.0", reason: "React DOM renderer" });

  const firstUi = blueprint.libraries.ui[0];
  const uiPkg = firstUi ? UI_LIBRARIES[firstUi] : null;
  if (uiPkg) ui.push(uiPkg);

  const firstAnim = blueprint.libraries.animation[0];
  const animPkg = firstAnim ? ANIMATION_LIBRARIES[firstAnim] : null;
  if (animPkg) animation.push(animPkg);

  const firstChart = blueprint.libraries.charts[0];
  const chartPkg = firstChart ? CHART_LIBRARIES[firstChart] : null;
  if (chartPkg) utilities.push(chartPkg);

  const firstIcon = blueprint.libraries.icons[0];
  const iconPkg = firstIcon ? ICON_LIBRARIES[firstIcon] : null;
  if (iconPkg) ui.push(iconPkg);

  utilities.push({ name: "zustand", version: "^4.5.0", reason: "State management" });

  dev.push({ name: "typescript", version: "^5.0.0", reason: "Type safety" });
  dev.push({ name: "eslint", version: "^8.57.0", reason: "Code linting" });
  dev.push({ name: "prettier", version: "^3.2.0", reason: "Code formatting" });

  const allDeps = [...core, ...ui, ...animation, ...utilities];
  const installOrder = allDeps.map((d) => d.name);

  const configFiles = [
    { name: "package.json", content: "{}" },
    { name: "tsconfig.json", content: "{}" },
  ];

  return { core, ui, animation, utilities, dev, installOrder, configFiles };
}
