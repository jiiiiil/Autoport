"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl bg-bg-card border border-white/[0.06] p-6",
        "transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/[0.06]">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-text-muted text-xs leading-relaxed">{description}</p>
    </div>
  );
}
