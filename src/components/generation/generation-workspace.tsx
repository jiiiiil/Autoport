"use client";

import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/common/fade-in";
import { GenerationPanel } from "./generation-panel";
import { WorkspaceCanvas } from "./workspace-canvas";
import { FeatureGrid } from "./feature-grid";
import { useGenerationEngine } from "@/lib/use-generation-engine";

export function GenerationWorkspace() {
  const router = useRouter();
  useGenerationEngine();

  return (
    <section className="relative w-full min-h-screen bg-bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.04)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-14 md:pb-20 flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-stretch min-h-[calc(100vh-16rem)]">
          <FadeIn delay={0.1} y={15} className="flex flex-col">
            <GenerationPanel
              className="flex-1"
              onPreview={() => router.push("/preview")}
              onBack={() => router.push("/upload")}
            />
          </FadeIn>

          <FadeIn delay={0.2} y={15} className="flex flex-col">
            <WorkspaceCanvas className="flex-1" />
          </FadeIn>
        </div>

        <FadeIn delay={0.4} y={20}>
          <FeatureGrid />
        </FadeIn>
      </div>
    </section>
  );
}
