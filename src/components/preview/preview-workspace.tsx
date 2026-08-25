"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Tablet, Smartphone, Code2, LayoutDashboard, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/portfolio/store";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { LayoutQualityPanel } from "@/components/preview/layout-quality";
import { LovableCodeViewer } from "./lovable-code-viewer";

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
  const [showQuality, setShowQuality] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect if on actual mobile device
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileDevice(isMobile);
      // Auto-set viewport to mobile on actual mobile devices
      if (isMobile) {
        setViewport("mobile");
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const viewportConfig = VIEWPORT_CONFIG[viewport];
  
  // On actual mobile devices, use full width instead of simulated mobile width
  const effectiveWidth = isMobileDevice ? "100%" : viewportConfig.width;

  const handleBack = useCallback(() => {
    router.push("/upload");
  }, [router]);

  const downloadPortfolioZipServer = useCallback(async (portfolio: any, composition: any) => {
    try {
      const response = await fetch('/api/export', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio, composition }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Failed to generate ZIP: ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const authorName = (portfolio?.personalInfo?.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.href = url;
      link.download = `${authorName}-react-portfolio.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="w-full max-w-[100vw] overflow-x-clip min-h-screen bg-white">
      {/* The portfolio fills the viewport exactly like a deployed website. */}
      <div className="mx-auto w-full" style={{ width: effectiveWidth, minHeight: "100vh" }}>
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
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-zinc-950/80 backdrop-blur border border-zinc-800/60 rounded-full shadow-lg max-w-[calc(100vw-1.5rem)]">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to Generation Lab"
          title="Back to Generation Lab"
          className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {!isMobileDevice && (
          <>
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
              onClick={() => setShowQuality(!showQuality)}
              aria-label="Toggle layout quality"
              title="Layout Quality Engine"
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer",
                showQuality
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              aria-label="Toggle code studio"
              title="Lovable Code Studio"
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer",
                showCode
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <Code2 className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => downloadPortfolioZipServer(portfolio, composition)}
          aria-label="Download ZIP Project"
          title="Download Full React + TS Project (.zip)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download ZIP</span>
        </button>
      </div>

      {/* Lovable Code Studio Drawer */}
      {showCode && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl p-2 sm:p-4 flex items-stretch sm:items-center justify-end pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            <LovableCodeViewer onClose={() => setShowCode(false)} />
          </div>
        </div>
      )}

      <LayoutQualityPanel
        portfolio={portfolio}
        active={showQuality}
        onClose={() => setShowQuality(false)}
      />
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
