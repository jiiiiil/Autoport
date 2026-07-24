"use client";

import { cn } from "@/lib/utils";

interface PromptTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PromptTextarea({
  value,
  onChange,
  placeholder = "Describe your career, style and stack...",
  className,
}: PromptTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={6}
      aria-label="Portfolio prompt"
      className={cn(
        "w-full resize-none rounded-xl bg-[#111111] border border-white/5",
        "px-5 py-4 text-sm text-white placeholder:text-text-muted",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
        "transition-all duration-200",
        className
      )}
    />
  );
}
