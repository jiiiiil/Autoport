"use client";

import { useEffect } from "react";
import { PromptCard } from "./prompt-card";
import { FeatureGrid } from "./feature-grid";
import { DiscoveryChat } from "@/components/discovery/discovery-chat";
import { FadeIn } from "@/components/common/fade-in";
import { useAppStore } from "@/lib/store";
import { useDiscoveryStore } from "@/lib/discovery-store";

export function PromptStudio() {
  const { prompt, setPrompt, isGenerating, setGenerationError } = useAppStore();
  const { stage, startDiscovery, reset: resetDiscovery } = useDiscoveryStore();

  const isDiscoveryMode = stage !== "idle";

  const canGenerate = prompt.trim().length >= 10 && !isGenerating;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerationError(null);
    startDiscovery(prompt);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    if (!isDiscoveryMode) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleGenerate, isDiscoveryMode]);

  useEffect(() => {
    resetDiscovery();
  }, [resetDiscovery]);

  if (isDiscoveryMode) {
    return <DiscoveryChat />;
  }

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
