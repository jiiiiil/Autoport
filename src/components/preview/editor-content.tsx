"use client";

import { cn } from "@/lib/utils";

interface EditorContentProps {
  className?: string;
}

const codeLines = [
  { indent: 0, tokens: [
    { text: "import", color: "text-[#c678dd]" },
    { text: " { useState } ", color: "text-white" },
    { text: "from", color: "text-[#c678dd]" },
    { text: " 'react'", color: "text-[#98c379]" },
    { text: ";", color: "text-white" },
  ]},
  { indent: 0, tokens: [
    { text: "import", color: "text-[#c678dd]" },
    { text: " { motion } ", color: "text-white" },
    { text: "from", color: "text-[#c678dd]" },
    { text: " 'framer-motion'", color: "text-[#98c379]" },
    { text: ";", color: "text-white" },
  ]},
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [
    { text: "export", color: "text-[#c678dd]" },
    { text: " default ", color: "text-[#c678dd]" },
    { text: "function ", color: "text-[#61afef]" },
    { text: "Hero", color: "text-[#61afef]" },
    { text: "() {", color: "text-white" },
  ]},
  { indent: 1, tokens: [
    { text: "const", color: "text-[#c678dd]" },
    { text: " [isLoaded, setIsLoaded] ", color: "text-white" },
    { text: "= ", color: "text-white" },
    { text: "useState", color: "text-[#61afef]" },
    { text: "(false);", color: "text-white" },
  ]},
  { indent: 0, tokens: [] },
  { indent: 1, tokens: [
    { text: "return", color: "text-[#c678dd]" },
    { text: " (", color: "text-white" },
  ]},
  { indent: 2, tokens: [
    { text: "<", color: "text-white" },
    { text: "section", color: "text-[#e06c75]" },
    { text: " className", color: "text-[#d19a66]" },
    { text: "=\"hero\"", color: "text-[#98c379]" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: "text-white" },
    { text: "motion.div", color: "text-[#e06c75]" },
    { text: " initial", color: "text-[#d19a66]" },
    { text: "={{ ", color: "text-white" },
    { text: "opacity", color: "text-[#e06c75]" },
    { text: ": 0 }}", color: "text-white" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 4, tokens: [
    { text: "<", color: "text-white" },
    { text: "h1", color: "text-[#e06c75]" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 5, tokens: [
    { text: "Hello, I'm ", color: "text-[#98c379]" },
    { text: "{", color: "text-white" },
    { text: " name ", color: "text-[#e06c75]" },
    { text: "}", color: "text-white" },
  ]},
  { indent: 4, tokens: [
    { text: "</", color: "text-white" },
    { text: "h1", color: "text-[#e06c75]" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 3, tokens: [
    { text: "</", color: "text-white" },
    { text: "motion.div", color: "text-[#e06c75]" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 2, tokens: [
    { text: "</", color: "text-white" },
    { text: "section", color: "text-[#e06c75]" },
    { text: ">", color: "text-white" },
  ]},
  { indent: 1, tokens: [
    { text: "  );", color: "text-white" },
  ]},
  { indent: 0, tokens: [
    { text: "}", color: "text-white" },
  ]},
];

export function EditorContent({ className }: EditorContentProps) {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div className="p-4 font-mono text-[11px] leading-[1.7]">
        {codeLines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            <span className="w-8 shrink-0 text-right text-text-muted/40 select-none pr-4">
              {lineIdx + 1}
            </span>
            <span className="flex-1">
              {line.tokens.map((token, tokenIdx) => (
                <span key={tokenIdx} className={token.color}>
                  {"  ".repeat(line.indent)}
                  {token.text}
                </span>
              ))}
              {line.tokens.length === 0 && "\u00A0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
