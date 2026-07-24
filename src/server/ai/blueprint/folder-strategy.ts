import type { AIContextObject } from "../intelligence/types";
import type { FolderStrategy } from "./types";

export function planFolderStrategy(context: AIContextObject): FolderStrategy {
  const isAppRouter = context.primaryFramework === "nextjs";
  const isFeatureGrouped = context.metadata.complexity === "complex" || context.metadata.complexity === "expert";

  if (isAppRouter) {
    return {
      structure: [
        "app/",
        "app/layout.tsx",
        "app/page.tsx",
        "app/globals.css",
        "components/",
        "components/ui/",
        "components/sections/",
        "components/layout/",
        "lib/",
        "lib/utils.ts",
        "hooks/",
        "types/",
        "public/",
        "public/images/",
        "public/fonts/",
      ],
      naming: "kebab",
      grouping: "type",
      components: "components/",
      hooks: "hooks/",
      utils: "lib/",
      types: "types/",
      styles: "app/",
    };
  }

  if (isFeatureGrouped) {
    return {
      structure: [
        "src/",
        "src/features/",
        "src/features/hero/",
        "src/features/projects/",
        "src/features/skills/",
        "src/components/",
        "src/components/ui/",
        "src/hooks/",
        "src/lib/",
        "src/types/",
        "src/styles/",
        "public/",
        "public/images/",
      ],
      naming: "kebab",
      grouping: "feature",
      components: "src/components/",
      hooks: "src/hooks/",
      utils: "src/lib/",
      types: "src/types/",
      styles: "src/styles/",
    };
  }

  return {
    structure: [
      "src/",
      "src/components/",
      "src/components/ui/",
      "src/components/sections/",
      "src/hooks/",
      "src/lib/",
      "src/types/",
      "public/",
      "public/images/",
    ],
    naming: "kebab",
    grouping: "type",
    components: "src/components/",
    hooks: "src/hooks/",
    utils: "src/lib/",
    types: "src/types/",
    styles: "src/",
  };
}
