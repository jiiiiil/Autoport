// @ts-nocheck
import type { ExecutionManifest } from "../manifest/types";
import type { GeneratedProject, GeneratedFile } from "./types";
import { createGeneratorContext, assembleProject } from "./file-assembler";
import { generateAllConfigs } from "./config-generator";
import { generateAllThemes } from "./theme-generator";
import { generateAllProviders } from "./provider-generator";
import { generateAllRoutes } from "./route-generator";
import { generateAllComponents } from "./component-generator";
import { generateLayoutFiles } from "./layout-generator";
import { generateAnimationFiles } from "./animation-generator";
import { generateContentFiles } from "./content-generator";
import { generateSeoFiles } from "./seo-generator";
import { generateAccessibilityFiles } from "./a11y-generator";
import { generatePerformanceFiles } from "./perf-generator";
import { generateProjectFiles } from "./project-initializer";

export function generateProject(manifest: ExecutionManifest): GeneratedProject {
  const ctx = createGeneratorContext(manifest);

  const allFiles: GeneratedFile[] = [];

  allFiles.push(...generateAllConfigs(ctx));
  allFiles.push(...generateAllThemes(ctx));
  allFiles.push(...generateAllProviders(ctx));
  allFiles.push(...generateAllRoutes(ctx));
  allFiles.push(...generateAllComponents(ctx));
  allFiles.push(...generateLayoutFiles(ctx));
  allFiles.push(...generateAnimationFiles(ctx));
  allFiles.push(...generateContentFiles(ctx));
  allFiles.push(...generateSeoFiles(ctx));
  allFiles.push(...generateAccessibilityFiles(ctx));
  allFiles.push(...generatePerformanceFiles(ctx));
  allFiles.push(...generateProjectFiles(ctx));

  const files = assembleProject(allFiles, ctx);

  return {
    name: manifest.projectManifest.name,
    files,
    metadata: {
      totalFiles: files.length,
      generatedAt: new Date().toISOString(),
      framework: manifest.blueprint.framework,
      language: manifest.blueprint.language,
      styling: manifest.blueprint.styling,
    },
  };
}
