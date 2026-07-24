import type { GeneratorContext, GeneratedFile } from "./types";

function generateLayoutFile(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const nav = manifest.blueprint.navigation;
  const hasNav = nav.variant !== "none";

  const content = `import type { Metadata } from "next";
import { Providers } from "${ctx.libDir}/providers";
import "${ctx.stylesDir}/globals.css";
${hasNav ? `import { Navbar } from "${ctx.componentsDir}/navbar";` : ""}
import { Footer } from "${ctx.componentsDir}/footer";

export const metadata: Metadata = {
  title: "${manifest.blueprint.seo.title}",
  description: "${manifest.blueprint.seo.description}",
  keywords: ${JSON.stringify(manifest.blueprint.seo.keywords)},
  openGraph: {
    title: "${manifest.blueprint.seo.openGraph.title}",
    description: "${manifest.blueprint.seo.openGraph.description}",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text antialiased">
        <Providers>
          ${hasNav ? "<Navbar />" : ""}
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
`;
  return { path: `${ctx.pagesDir}/layout.tsx`, content, type: "layout" };
}

function generatePageFile(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const sections = [...manifest.optimizedSections].sort((a, b) => a.priority - b.priority);

  const sectionImports = sections.map((s) => {
    return `import { ${s.component} } from "${ctx.componentsDir}/sections/${s.id}";`;
  });

  const sectionComponents = sections.map((s) => {
    return `      <${s.component} />`;
  });

  const content = `${sectionImports.join("\n")}

export default function Home() {
  return (
    <div className="flex flex-col">
${sectionComponents.join("\n")}
    </div>
  );
}
`;

  return { path: `${ctx.pagesDir}/page.tsx`, content, type: "route" };
}

function generateNotFoundPage(_ctx: GeneratorContext): GeneratedFile {
  const content = `import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-text-secondary">Page not found</p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-primary px-6 py-3 text-white transition-opacity hover:opacity-90"
      >
        Go Home
      </Link>
    </div>
  );
}
`;
  return { path: `${_ctx.pagesDir}/not-found.tsx`, content, type: "route" };
}

function generateLoadingPage(_ctx: GeneratorContext): GeneratedFile {
  const content = `export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
`;
  return { path: `${_ctx.pagesDir}/loading.tsx`, content, type: "route" };
}

function generateErrorPage(_ctx: GeneratorContext): GeneratedFile {
  const content = `"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-6 py-3 text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
`;
  return { path: `${_ctx.pagesDir}/error.tsx`, content, type: "route" };
}

export function generateAllRoutes(ctx: GeneratorContext): GeneratedFile[] {
  return [
    generateLayoutFile(ctx),
    generatePageFile(ctx),
    generateNotFoundPage(ctx),
    generateLoadingPage(ctx),
    generateErrorPage(ctx),
  ];
}
