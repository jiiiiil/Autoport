"use client";

import { PromptTextarea } from "./prompt-textarea";
import { SuggestionList } from "./suggestion-list";
import { GenerateButton } from "./generate-button";
import { FadeIn } from "@/components/common/fade-in";

interface PromptCardProps {
  prompt?: string;
  onPromptChange?: (value: string) => void;
  onGenerate?: () => void;
  onSuggestionSelect?: (label: string) => void;
  generating?: boolean;
}

export function PromptCard({
  prompt,
  onPromptChange,
  onGenerate,
  onSuggestionSelect,
  generating,
}: PromptCardProps) {
  return (
    <FadeIn delay={0.2} y={20}>
      <div className="mx-auto max-w-2xl w-full rounded-2xl bg-bg-card border border-white/[0.06] shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col gap-5">
          <PromptTextarea value={prompt} onChange={onPromptChange} />

          <SuggestionList onSelect={onSuggestionSelect} />

          <div className="flex items-center justify-between pt-1">
            <p className="text-text-muted text-xs">
              Press{" "}
              <kbd className="inline-flex items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                ⌘
              </kbd>{" "}
              +{" "}
              <kbd className="inline-flex items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
                Enter
              </kbd>{" "}
              to generate
            </p>

            <GenerateButton
              onClick={onGenerate}
              disabled={!prompt?.trim()}
              loading={generating}
            />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
