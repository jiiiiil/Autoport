import type { GeneratorContext, GeneratedFile } from "./types";

export function generatePackageJson(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const deps = manifest.dependencies;
  const pkgName = manifest.projectManifest.name.replace(/\s+/g, "-").toLowerCase();

  const allCore = deps.core.map((d) => [d.name, d.version] as const);
  const allUi = deps.ui.map((d) => [d.name, d.version] as const);
  const allAnim = deps.animation.map((d) => [d.name, d.version] as const);
  const allUtil = deps.utilities.map((d) => [d.name, d.version] as const);
  const allDev = deps.dev.map((d) => [d.name, d.version] as const);

  const dependencies: Record<string, string> = {};
  for (const [n, v] of [...allCore, ...allUi, ...allAnim, ...allUtil]) {
    dependencies[n] = v;
  }
  for (const [n, v] of allDev) {
    (dependencies as Record<string, string>)[n] = v;
  }

  const scripts = manifest.projectManifest.scripts;

  const pkg = {
    name: pkgName,
    version: manifest.projectManifest.version,
    private: true,
    scripts,
    dependencies,
  };

  return {
    path: "package.json",
    content: JSON.stringify(pkg, null, 2),
    type: "config",
  };
}

export function generateTsConfig(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const isNext = manifest.blueprint.framework === "nextjs";

  const config: Record<string, unknown> = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: ctx.tsx ? "preserve" : "react-jsx",
      incrementality: true,
      plugins: isNext ? [{ name: "next" }] : [],
      paths: {
        "@/*": ["./src/*"],
      },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  };

  if (!isNext) {
    delete (config.compilerOptions as Record<string, unknown>).plugins;
    (config.compilerOptions as Record<string, unknown>).jsx = "react-jsx";
  }

  return {
    path: "tsconfig.json",
    content: JSON.stringify(config, null, 2),
    type: "config",
  };
}

export function generateTailwindConfig(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const tokens = manifest.designTokens;
  const content = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "${ctx.srcDir}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${tokens.colors.primary || "#7c3aed"}",
        accent: "${tokens.colors.accent || "#06b6d4"}",
        background: "${tokens.colors.background || "#ffffff"}",
        surface: "${tokens.colors.surface || "#f5f5f5"}",
        border: "${tokens.colors.border || "#e5e5e5"}",
      },
      fontFamily: {
        heading: [${(tokens.typography.heading || "Inter, system-ui, sans-serif").split(",").map((f: string) => `"${f.trim()}"`).join(", ")}],
        body: [${(tokens.typography.body || "Inter, system-ui, sans-serif").split(",").map((f: string) => `"${f.trim()}"`).join(", ")}],
        mono: [${(tokens.typography.mono || "JetBrains Mono, monospace").split(",").map((f: string) => `"${f.trim()}"`).join(", ")}],
      },
      borderRadius: {
        sm: "${tokens.radius.sm || "0.25rem"}",
        md: "${tokens.radius.md || "0.5rem"}",
        lg: "${tokens.radius.lg || "0.75rem"}",
        xl: "${tokens.radius.xl || "1rem"}",
      },
      boxShadow: {
        sm: "${tokens.shadows.sm || "0 1px 2px 0 rgba(0,0,0,0.05)"}",
        md: "${tokens.shadows.md || "0 4px 6px -1px rgba(0,0,0,0.1)"}",
        lg: "${tokens.shadows.lg || "0 10px 15px -3px rgba(0,0,0,0.1)"}",
        xl: "${tokens.shadows.xl || "0 20px 25px -5px rgba(0,0,0,0.1)"}",
      },
    },
  },
  plugins: [],
};

export default config;
`;
  return { path: "tailwind.config.ts", content, type: "config" };
}

export function generatePostCSSConfig(_ctx: GeneratorContext): GeneratedFile {
  const content = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  return { path: "postcss.config.js", content, type: "config" };
}

export function generateNextConfig(_ctx: GeneratorContext): GeneratedFile {
  const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
`;
  return { path: "next.config.js", content, type: "config" };
}

export function generateEnvironmentFiles(ctx: GeneratorContext): GeneratedFile[] {
  const envVars = ctx.manifest.projectManifest.environmentVariables;
  const lines = envVars.map((v) => `${v.name}=${v.example}`);
  const content = lines.join("\n") + "\n";
  return [
    { path: ".env.example", content, type: "config" },
    { path: ".env.local", content, type: "config" },
  ];
}

export function generateEslintConfig(_ctx: GeneratorContext): GeneratedFile {
  const content = `module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
};
`;
  return { path: ".eslintrc.json", content, type: "config" };
}

export function generatePrettierConfig(_ctx: GeneratorContext): GeneratedFile {
  const content = JSON.stringify({ semi: true, singleQuote: true, tabWidth: 2, trailingComma: "es5" }, null, 2);
  return { path: ".prettierrc", content, type: "config" };
}

export function generateGitignore(): GeneratedFile {
  const content = `node_modules/
.next/
out/
.env.local
.env*.local
*.tsbuildinfo
next-env.d.ts
`;
  return { path: ".gitignore", content, type: "config" };
}

export function generateAllConfigs(ctx: GeneratorContext): GeneratedFile[] {
  return [
    generatePackageJson(ctx),
    generateTsConfig(ctx),
    generateTailwindConfig(ctx),
    generatePostCSSConfig(ctx),
    generateNextConfig(ctx),
    generateEslintConfig(ctx),
    generatePrettierConfig(ctx),
    generateGitignore(),
    ...generateEnvironmentFiles(ctx),
  ];
}
