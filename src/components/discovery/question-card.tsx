"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Check } from "lucide-react";
import type { DiscoveryQuestion } from "@/server/discovery/types";

interface QuestionCardProps {
  question: DiscoveryQuestion;
  onAnswer: (answer: string | string[]) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [textValue, setTextValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (question.type === "choice" && question.options) {
    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => !disabled && onAnswer(opt.value)}
            disabled={disabled}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200",
              "border border-white/10 hover:border-primary/40 hover:bg-primary/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "multiselect" && question.options) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt) => {
            const selected = selectedOptions.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => {
                  if (disabled) return;
                  setSelectedOptions((prev) =>
                    selected
                      ? prev.filter((v) => v !== opt.value)
                      : [...prev, opt.value]
                  );
                }}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                  "border border-white/10",
                  selected
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "hover:border-white/20 hover:bg-white/5",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="flex items-center gap-1.5">
                  {selected && <Check className="w-3 h-3" />}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        {selectedOptions.length > 0 && (
          <button
            onClick={() => !disabled && onAnswer(selectedOptions)}
            disabled={disabled}
            className={cn(
              "self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium",
              "bg-primary text-white transition-all duration-200",
              "hover:bg-primary-hover",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Check className="w-3.5 h-3.5" />
            Confirm ({selectedOptions.length})
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && textValue.trim() && !disabled) {
            onAnswer(textValue.trim());
            setTextValue("");
          }
        }}
        placeholder="Type your answer..."
        disabled={disabled}
        className={cn(
          "flex-1 px-4 py-2.5 rounded-xl text-sm bg-[#111] border border-white/10",
          "text-white placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
          "transition-all duration-200",
          disabled && "opacity-50"
        )}
      />
      <button
        onClick={() => {
          if (textValue.trim() && !disabled) {
            onAnswer(textValue.trim());
            setTextValue("");
          }
        }}
        disabled={disabled || !textValue.trim()}
        className={cn(
          "p-2.5 rounded-xl bg-primary text-white transition-all duration-200",
          "hover:bg-primary-hover",
          "(disabled || !textValue.trim()) && 'opacity-50 cursor-not-allowed'"
        )}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
