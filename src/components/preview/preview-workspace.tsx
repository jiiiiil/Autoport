"use client";

import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/common/fade-in";
import { PreviewPanel } from "./preview-panel";
import { CodeEditor } from "./code-editor";

export function PreviewWorkspace() {
  const router = useRouter();

  return (
    <section className="relative w-full min-h-screen bg-bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.04)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 items-stretch min-h-[calc(100vh-12rem)]">
          <FadeIn delay={0.1} y={15} className="flex flex-col">
            <PreviewPanel
              className="flex-1"
              onBack={() => router.push("/generation")}
            />
          </FadeIn>

          <FadeIn delay={0.2} y={15} className="flex flex-col">
            <CodeEditor className="flex-1" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
