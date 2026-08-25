import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { existsSync, readFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError, requireAuth, requirePortfolioOwnership } from "@/server/middleware";
import { exportService } from "@/server/services/export";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // Increase timeout to 120 seconds for Vercel

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { portfolioId, format } = body as { portfolioId?: string; format?: string };

    if (!portfolioId || typeof portfolioId !== "string") {
      return Response.json(
        errorResponse("Portfolio ID is required"),
        { status: 400 }
      );
    }

    const validFormats = ["html", "json", "zip"];
    if (format && !validFormats.includes(format)) {
      return Response.json(
        errorResponse(`Invalid format. Must be one of: ${validFormats.join(", ")}`),
        { status: 400 }
      );
    }

    await requirePortfolioOwnership(user.id, portfolioId);

    logger.info(`Export request for portfolio ${portfolioId}`, "API");

    const job = await exportService.createExport(portfolioId, format ?? "html");

    return Response.json(
      successResponse(
        { exportId: job.id, status: job.status },
        "Export job created"
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        errorResponse("Export ID is required"),
        { status: 400 }
      );
    }

    const job = await exportService.getExport(id);
    await requirePortfolioOwnership(user.id, job.portfolioId);

    return Response.json(
      successResponse(job, "Export status retrieved")
    );
  } catch (error) {
    return handleError(error);
  }
}

// New server-side ZIP generation endpoint
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { portfolio, composition } = body as { portfolio?: any; composition?: any };

    if (!portfolio) {
      return Response.json(
        errorResponse("Portfolio data is required"),
        { status: 400 }
      );
    }

    logger.info(`Generating ZIP portfolio for ${portfolio.personalInfo?.name || 'user'}`, "API");

    const zip = new JSZip();
    const files: Record<string, string> = {};
    const assetManifest: string[] = [];
    const componentManifest: string[] = [];
    const dependencyManifest: Set<string> = new Set();

    // Copy actual portfolio components (Single Source of Truth)
    function copyDirectoryRecursively(sourceDir: string, targetPath: string): void {
      if (!existsSync(sourceDir)) return;
      
      const items = readdirSync(sourceDir);
      for (const item of items) {
        const sourcePath = join(sourceDir, item);
        const targetItemPath = join(targetPath, item);
        const stat = statSync(sourcePath);
        
        if (stat.isDirectory()) {
          copyDirectoryRecursively(sourcePath, targetItemPath);
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.css') || item.endsWith('.json'))) {
          const content = readFileSync(sourcePath, 'utf-8');
          files[targetItemPath] = content;
          componentManifest.push(targetItemPath);
          
          // Extract dependencies from file content
          const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
          if (importMatches) {
            importMatches.forEach(match => {
              const dep = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
              if (dep && !dep.startsWith('.') && !dep.startsWith('@/')) {
                dependencyManifest.add(dep);
              }
            });
          }
        }
      }
    }

    // Copy portfolio components
    const componentsDir = join(process.cwd(), 'src/components/portfolio');
    if (existsSync(componentsDir)) {
      copyDirectoryRecursively(componentsDir, 'src/components/portfolio');
    }
    
    // Copy utility files
    const utilsDir = join(process.cwd(), 'src/lib/portfolio');
    if (existsSync(utilsDir)) {
      const utilFiles = ['themes.ts', 'layouts.ts', 'registry.tsx', 'types.ts', 'layout-engine.ts'];
      for (const file of utilFiles) {
        const sourcePath = join(utilsDir, file);
        if (existsSync(sourcePath)) {
          const content = readFileSync(sourcePath, 'utf-8');
          files[`src/lib/portfolio/${file}`] = content;
          componentManifest.push(`src/lib/portfolio/${file}`);
          
          // Extract dependencies from file content
          const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
          if (importMatches) {
            importMatches.forEach(match => {
              const dep = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
              if (dep && !dep.startsWith('.') && !dep.startsWith('@/')) {
                dependencyManifest.add(dep);
              }
            });
          }
        }
      }
    }
    
    // Copy UI components
    const uiDir = join(process.cwd(), 'src/components/ui');
    if (existsSync(uiDir)) {
      copyDirectoryRecursively(uiDir, 'src/components/ui');
    }
    
    // Copy hooks
    const hooksDir = join(process.cwd(), 'src/hooks');
    if (existsSync(hooksDir)) {
      copyDirectoryRecursively(hooksDir, 'src/hooks');
    }
    
    // Copy spatial components
    const spatialDir = join(process.cwd(), 'src/components/spatial');
    if (existsSync(spatialDir)) {
      copyDirectoryRecursively(spatialDir, 'src/components/spatial');
    }
    
    // Copy design-system
    const designSystemDir = join(process.cwd(), 'src/design-system');
    if (existsSync(designSystemDir)) {
      copyDirectoryRecursively(designSystemDir, 'src/design-system');
    }
    
    // Copy spatial lib
    const spatialLibDir = join(process.cwd(), 'src/lib/spatial');
    if (existsSync(spatialLibDir)) {
      copyDirectoryRecursively(spatialLibDir, 'src/lib/spatial');
    }

    // Copy static cover assets used by the 3d-creator theme (pixel-perfect parity with preview)
    const coversDir = join(process.cwd(), 'public/covers');
    if (existsSync(coversDir)) {
      for (const item of readdirSync(coversDir)) {
        if (item.endsWith('.svg')) {
          const content = readFileSync(join(coversDir, item), 'utf-8');
          files[`public/covers/${item}`] = content;
          assetManifest.push(`public/covers/${item}`);
        }
      }
    }

    // Add portfolio data
    files['src/portfolio.json'] = JSON.stringify(portfolio, null, 2);
    files['src/composition.json'] = JSON.stringify(composition || {}, null, 2);

    // Add App.tsx
    files['src/App.tsx'] = `"use client";

import React from "react";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import portfolioData from "./portfolio.json";
import compositionData from "./composition.json";
import "./index.css";

export default function App() {
  return (
    <PortfolioRenderer
      portfolio={portfolioData as any}
      composition={compositionData as any}
    />
  );
}
`;

    // Add main.tsx
    files['src/main.tsx'] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

    // Add index.css
    files['src/index.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root, .theme-black {
  --p-bg: #050508;
  --p-bg-card: #0e0e14;
  --p-bg-card-hover: #161620;
  --p-border: #222230;
  --p-border-subtle: #141420;
  --p-text: #ffffff;
  --p-text-secondary: #e2e8f0;
  --p-text-muted: #94a3b8;
  --p-primary: #ffffff;
  --p-accent: #ffffff;
}

.ap-portfolio-root {
  min-height: 100vh;
}

.theme-white {
  --p-bg: #f8fafc;
  --p-bg-card: #ffffff;
  --p-bg-card-hover: #f1f5f9;
  --p-border: #cbd5e1;
  --p-border-subtle: #e2e8f0;
  --p-text: #020617;
  --p-text-muted: #334155;
  --p-text-secondary: #0f172a;
  --p-primary: #0284c7;
  --p-accent: #0284c7;
}

* { box-sizing: border-box; }
body {
  background-color: var(--p-bg, #050508);
  color: var(--p-text, #ffffff);
  margin: 0;
  padding: 0;
  font-family: var(--p-font-body, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  min-height: 100vh;
  overflow-x: hidden;
}
`;

    // Add utils.ts
    files['src/lib/utils.ts'] = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

    // Add package.json
    files['package.json'] = JSON.stringify({
      name: (portfolio.personalInfo?.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview"
      },
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "three": "^0.160.0",
        "@react-three/fiber": "^8.15.0",
        "@react-three/drei": "^9.90.0",
        "animejs": "^3.2.1",
        "gsap": "^3.12.2",
        "framer-motion": "^11.0.0",
        "lucide-react": "^0.344.0",
        "clsx": "^2.1.0",
        "tailwind-merge": "^2.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@types/three": "^0.160.0",
        "@vitejs/plugin-react": "^4.2.0",
        "typescript": "^5.3.0",
        "vite": "^5.0.0",
        "tailwindcss": "^3.4.0",
        "autoprefixer": "^10.4.0",
        "postcss": "^8.4.0"
      }
    }, null, 2);

    // Add index.html
    files['index.html'] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${portfolio.personalInfo?.name || "Developer"} - 3D Portfolio</title>
  </head>
  <body class="bg-[var(--p-bg,#050508)] text-[var(--p-text,#ffffff)]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    // Add vite.config.ts
    files['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;

    // Add tsconfig.json
    files['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        },
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"]
    }, null, 2);

    // Add tailwind.config.js
    files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

    // Add postcss.config.js
    files['postcss.config.js'] = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

    // Add README.md
    files['README.md'] = `# ${portfolio.personalInfo?.name || "Developer"} - 3D Modern Portfolio

Generated standalone React + TypeScript + Three.js + Anime.js + GSAP 3D Portfolio Application.

## Quick Start

1. Extract the downloaded ZIP folder.
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Launch development server:
\`\`\`bash
npm run dev
\`\`\`

Open your browser at \`http://localhost:5173\` to view your live 3D portfolio!
`;

    // Add export manifest for validation
    files['export-manifest.json'] = JSON.stringify({
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      portfolioName: portfolio.personalInfo?.name || "Developer",
      components: componentManifest.sort(),
      dependencies: Array.from(dependencyManifest).sort(),
      assets: assetManifest.sort(),
      dataFiles: ['src/portfolio.json', 'src/composition.json'],
      configFiles: ['package.json', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js']
    }, null, 2);

    // Validation: Ensure all required components are present
    const requiredComponents = [
      'src/components/portfolio/portfolio-renderer.tsx',
      'src/components/portfolio/hero-section.tsx',
      'src/components/portfolio/projects-section.tsx',
      'src/lib/portfolio/themes.ts',
      'src/lib/portfolio/layouts.ts',
      'src/lib/portfolio/registry.tsx',
      'src/hooks/use-layout-fit.ts',
      'src/components/spatial/SpatialObject.tsx',
      'src/design-system/composition.ts',
      'src/lib/spatial/visual-asset-mapper.ts'
    ];

    const missingComponents = requiredComponents.filter(comp => !componentManifest.includes(comp));
    if (missingComponents.length > 0) {
      logger.error(`Missing required components: ${missingComponents.join(', ')}`, "API");
      return Response.json(
        errorResponse(`Export validation failed: Missing components - ${missingComponents.join(', ')}`),
        { status: 500 }
      );
    }

    // Validation: Ensure portfolio data is present
    if (!files['src/portfolio.json']) {
      logger.error("Portfolio data missing from export", "API");
      return Response.json(
        errorResponse("Export validation failed: Portfolio data missing"),
        { status: 500 }
      );
    }

    logger.info(`Export validation passed: ${componentManifest.length} components, ${dependencyManifest.size} dependencies`, "API");

    // Add all files to ZIP
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content);
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    const authorName = (portfolio.personalInfo?.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, "-");
    
    return new Response(buffer as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${authorName}-react-portfolio.zip"`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
