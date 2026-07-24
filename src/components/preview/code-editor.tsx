"use client";

import { cn } from "@/lib/utils";
import { EditorHeader } from "./editor-header";
import { EditorContent } from "./editor-content";
import { EditorFooter } from "./editor-footer";

interface CodeEditorProps {
  className?: string;
}

export function CodeEditor({ className }: CodeEditorProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl bg-bg-card border border-white/[0.06] overflow-hidden h-full",
        "shadow-2xl",
        className
      )}
    >
      <EditorHeader />
      <EditorContent className="min-h-0 flex-1" />
      <EditorFooter />
    </div>
  );
}
