"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Tablet, Smartphone, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/portfolio/store";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_CONFIG: Record<ViewportSize, { width: string; icon: typeof Monitor; label: string }> = {
  desktop: { width: "100%", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", icon: Tablet, label: "Tablet" },
  mobile: { width: "390px", icon: Smartphone, label: "Mobile" },
};

export function PreviewWorkspace() {
  const router = useRouter();
  const isReady = usePortfolioStore((s) => s.isReady);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const composition = usePortfolioStore((s) => s.composition);

  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const viewportConfig = VIEWPORT_CONFIG[viewport];

  const handleBack = useCallback(() => {
    router.push("/generation");
  }, [router]);

  return (
    <div className="w-screen min-h-screen bg-white">
      {/* The portfolio fills the viewport exactly like a deployed website. */}
      <div className="mx-auto w-full" style={{ width: viewportConfig.width, minHeight: "100vh" }}>
        {mounted && isReady ? (
          <PortfolioRenderer
            portfolio={portfolio}
            composition={composition}
            className="w-full min-h-screen"
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-zinc-800 mb-2">
                Your Portfolio
              </h2>
              <p className="text-zinc-500 text-sm">
                Generate a portfolio to see it here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Minimal floating app controls — no browser frame, no title bar, no fake OS UI. */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 p-1.5 bg-zinc-950/80 backdrop-blur border border-zinc-800/60 rounded-full shadow-lg">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to Generation Lab"
          title="Back to Generation Lab"
          className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-800" />

        <div className="flex items-center gap-0.5">
          {(Object.entries(VIEWPORT_CONFIG) as [ViewportSize, typeof VIEWPORT_CONFIG[ViewportSize]][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewport(key)}
                  aria-label={`${config.label} view`}
                  title={`${config.label} view`}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer",
                    viewport === key
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            }
          )}
        </div>

        <div className="w-px h-5 bg-zinc-800" />

        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          aria-label="Toggle code"
          title="Toggle code"
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer",
            showCode
              ? "bg-white/15 text-white"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          )}
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>

      {/* Code Panel (floating sidebar — does not frame the site) */}
      {showCode && (
        <aside className="fixed top-14 right-3 z-40 w-[min(24rem,calc(100vw-1.5rem))] max-h-[calc(100vh-4.5rem)] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" />
              Generated Code
            </span>
            <span className="text-[10px] text-zinc-600 bg-zinc-900 rounded px-1.5 py-0.5">TSX</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
            <PreviewCodeViewer />
          </div>
        </aside>
      )}
    </div>
  );
}

function PreviewCodeViewer() {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const personalInfo = portfolio?.personalInfo as Record<string, unknown> | undefined;
  const sections = (portfolio?.sections as Record<string, unknown>) || {};

  const name = (personalInfo?.name as string) || "Developer";
  const role = (personalInfo?.role as string) || "Developer";
  const hero = (sections.hero as Record<string, unknown>) || {};
  const headline = (hero.headline as string) || `Hi, I'm ${name}`;
  const skills = (sections.skills as { name: string }[]) || [];
  const projects = (sections.projects as { title: string }[]) || [];

  const code = [
    `import { Hero } from "@/components/sections/Hero";`,
    `import { About } from "@/components/sections/About";`,
    `import { Projects } from "@/components/sections/Projects";`,
    `import { Skills } from "@/components/sections/Skills";`,
    `import { Contact } from "@/components/sections/Contact";`,
    ``,
    `// ${role} Portfolio`,
    `// Generated for ${name}`,
    ``,
    `export default function Portfolio() {`,
    `  return (`,
    `    <main className="min-h-screen">`,
    `      <Hero headline="${headline.replace(/"/g, '\\"')}" />`,
    `      <About />`,
    projects.length > 0 ? `      <Projects count={${projects.length}} />` : `      <Projects />`,
    skills.length > 0 ? `      <Skills count={${skills.length}} />` : `      <Skills />`,
    `      <Contact />`,
    `    </main>`,
    `  );`,
    `}`,
  ];

  return (
    <pre className="whitespace-pre-wrap">
      {code.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-6 text-zinc-700 shrink-0 select-none">{i + 1}</span>
          <span>{line || "\u00A0"}</span>
        </div>
      ))}
    </pre>
  );
}
