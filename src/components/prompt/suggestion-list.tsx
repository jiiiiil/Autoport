"use client";

import { SuggestionChip } from "./suggestion-chip";

const suggestions = [
  "Modern Designer",
  "Full Stack Dev",
  "Dark Aesthetic",
  "Portfolio XE",
  "React Specialist",
  "Entrepreneur",
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
