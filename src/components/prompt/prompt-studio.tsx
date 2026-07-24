"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PromptCard } from "./prompt-card";
import { FeatureGrid } from "./feature-grid";
import { FadeIn } from "@/components/common/fade-in";
import { useAppStore } from "@/lib/store";

export function PromptStudio() {
  const router = useRouter();
  const { prompt, setPrompt, isGenerating, setIsGenerating } = useAppStore();

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      router.push("/generation");
    }, 600);
  }, [prompt, isGenerating, setIsGenerating, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGenerate]);

  return (
    <section className="relative w-full min-h-screen bg-bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.06)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 flex flex-col items-center gap-14">
        <FadeIn className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-white">
            Architect your
            <br />
            legacy.
          </h1>
          <p className="mt-4 text-text-muted text-base max-w-md mx-auto">
            Describe who you are and what you build. Our AI will craft a portfolio
            that captures your essence.
          </p>
        </FadeIn>

        <PromptCard
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          onSuggestionSelect={(label) => setPrompt(label)}
          generating={isGenerating}
        />

        <FeatureGrid />
      </div>
    </section>
  );
}
