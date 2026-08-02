"use client";

import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";
import type { Message } from "@/lib/discovery-store";
import { QuestionCard } from "./question-card";

interface MessageBubbleProps {
  message: Message;
  onAnswer?: (questionId: string, answer: string | string[]) => void;
  answering?: boolean;
}

export function MessageBubble({ message, onAnswer, answering }: MessageBubbleProps) {
  const isAI = message.role === "ai";

  return (
    <div className={cn("flex gap-3 w-full", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      )}

      <div className={cn("max-w-[80%] flex flex-col", isAI ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isAI
              ? "bg-bg-card border border-white/[0.06] text-text-light"
              : "bg-primary text-white"
          )}
        >
          {message.content}
        </div>

        {isAI && message.questions && message.questions.length > 0 && onAnswer && (
          <div className="mt-3 space-y-2 w-full">
            {message.questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onAnswer={(answer) => onAnswer(q.id, answer)}
                disabled={answering}
              />
            ))}
          </div>
        )}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
