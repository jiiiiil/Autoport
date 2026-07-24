import type { GeneratorContext, GeneratedFile } from "./types";
import type { ExecutionManifest } from "../manifest/types";

export function createGeneratorContext(manifest: ExecutionManifest): GeneratorContext {
  const fs = manifest.projectManifest.fileStructure;

  return {
    manifest,
    projectRoot: ".",
    tsx: manifest.projectManifest.language === "TypeScript" || manifest.projectManifest.language === "typescript",
    srcDir: fs.srcDir,
    pagesDir: fs.pagesDir,
    componentsDir: fs.componentsDir,
    hooksDir: fs.hooksDir,
    utilsDir: fs.utilsDir,
    typesDir: fs.typesDir,
    stylesDir: fs.stylesDir,
    libDir: fs.libDir,
    assetsDir: fs.assetsDir,
    publicDir: fs.publicDir,
  };
}

export function assembleProject(files: GeneratedFile[], ctx: GeneratorContext): GeneratedFile[] {
  const pathMap = new Map<string, GeneratedFile>();

  for (const file of files) {
    const normalizedPath = file.path.replace(/^\.\//, "");
    pathMap.set(normalizedPath, { ...file, path: normalizedPath });
  }

  addIndexFile(pathMap, ctx);
  addTypesIndex(pathMap, ctx);

  return Array.from(pathMap.values());
}

function addIndexFile(pathMap: Map<string, GeneratedFile>, ctx: GeneratorContext): void {
  const exports = [
    `export { ThemeProvider, useTheme } from "${ctx.libDir}/providers/theme-provider";`,
    `export { Providers } from "${ctx.libDir}/providers";`,
    `export { cn } from "${ctx.utilsDir}/cn";`,
    `export { MainLayout, SectionContainer, GridContainer } from "${ctx.libDir}/layout";`,
    `export { Section, Container, SplitLayout } from "${ctx.libDir}/section-layout";`,
    `export { content } from "${ctx.libDir}/content";`,
  ];

  pathMap.set("src/index.ts", {
    path: "src/index.ts",
    content: exports.join("\n") + "\n",
    type: "util",
  });
}

function addTypesIndex(pathMap: Map<string, GeneratedFile>, ctx: GeneratorContext): void {
  const content = `export type { ContentData } from "${ctx.libDir}/content";
`;
  pathMap.set("src/types/index.ts", {
    path: "src/types/index.ts",
    content,
    type: "type",
  });
}
