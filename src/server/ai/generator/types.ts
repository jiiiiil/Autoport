import type { ExecutionManifest } from "../manifest/types";

export interface GeneratedFile {
  path: string;
  content: string;
  type: "config" | "component" | "layout" | "section" | "provider" | "hook" | "util" | "type" | "style" | "route" | "seo" | "asset" | "animation" | "theme" | "content" | "public";
}

export interface GeneratedProject {
  name: string;
  files: GeneratedFile[];
  metadata: {
    totalFiles: number;
    generatedAt: string;
    framework: string;
    language: string;
    styling: string;
  };
}

export interface GeneratorContext {
  manifest: ExecutionManifest;
  projectRoot: string;
  tsx: boolean;
  srcDir: string;
  pagesDir: string;
  componentsDir: string;
  hooksDir: string;
  utilsDir: string;
  typesDir: string;
  stylesDir: string;
  libDir: string;
  assetsDir: string;
  publicDir: string;
}
