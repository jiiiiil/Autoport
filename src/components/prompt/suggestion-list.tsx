"use client";

import { SuggestionChip } from "./suggestion-chip";

const suggestions = [
  "I'm a Full Stack Developer, build with React and Node.js",
  "UI/UX Designer specializing in minimal dark interfaces",
  "AI Engineer working with LLMs and Python",
  "Photographer looking for a gallery-style portfolio",
  "DevOps Engineer with 5+ years of experience",
  "Product Designer, focused on SaaS products",
];

interface SuggestionListProps {
  onSelect?: (label: string) => void;
}

export function SuggestionList({ onSelect }: SuggestionListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((label) => (
        <SuggestionChip
          key={label}
          label={label}
          onClick={() => onSelect?.(label)}
        />
      ))}
    </div>
  );
}
