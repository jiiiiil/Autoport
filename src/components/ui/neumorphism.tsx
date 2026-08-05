"use client";

import React from "react";
import { cn } from "@/lib/utils";

// --- Neumorphic Card Component ---
export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "outset" | "inset" | "flat" | "glowing";
  hoverable?: boolean;
}

export const NeumorphicCard = React.forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ className, variant = "outset", hoverable = true, children, style, ...props }, ref) => {
    const shadowStyle =
      variant === "outset"
        ? "var(--neu-outset, 6px 6px 16px rgba(0,0,0,0.5), -6px -6px 16px rgba(255,255,255,0.03))"
        : variant === "inset"
        ? "var(--neu-inset, inset 4px 4px 10px rgba(0,0,0,0.6), inset -4px -4px 10px rgba(255,255,255,0.03))"
        : undefined;

    return (
      <div
        ref={ref}
        style={{ boxShadow: shadowStyle, ...style }}
        className={cn(
          "rounded-2xl transition-all duration-300 p-6 relative overflow-hidden bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border border-[var(--p-border-subtle,rgba(255,255,255,0.06))]",
          hoverable && "hover:-translate-y-1",
          variant === "glowing" && [
            "border-white/30",
            "shadow-[0_15px_40px_rgba(0,0,0,0.85),6px_6px_16px_rgba(0,0,0,0.6)]",
            hoverable && "hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),8px_8px_24px_rgba(0,0,0,0.8)]",
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NeumorphicCard.displayName = "NeumorphicCard";

// --- Neumorphic Button Component ---
export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "inset" | "glow";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, style, ...props }, ref) => {
    const shadowStyle =
      variant === "inset"
        ? "var(--neu-inset, inset 3px 3px 6px rgba(0,0,0,0.7), inset -3px -3px 6px rgba(255,255,255,0.04))"
        : "var(--neu-outset, 5px 5px 12px rgba(0,0,0,0.4), -5px -5px 12px rgba(255,255,255,0.03))";

    return (
      <button
        ref={ref}
        style={{ boxShadow: variant === "glow" ? undefined : shadowStyle, ...style }}
        className={cn(
          "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none",
          size === "sm" && "px-3.5 py-1.5 text-xs gap-1.5",
          size === "md" && "px-5 py-2.5 text-sm gap-2",
          size === "lg" && "px-7 py-3.5 text-base gap-2.5",
          variant === "primary" && [
            "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border border-[var(--p-border,#222230)]",
            "hover:bg-[var(--p-bg-card-hover,#161620)] hover:border-white/40",
          ],
          variant === "secondary" && [
            "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text-secondary,#e2e8f0)] border border-[var(--p-border,#222230)]",
            "hover:bg-[var(--p-bg-card-hover,#161620)]",
          ],
          variant === "glow" && [
            "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] font-black border-none",
            "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            "hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-[1.02]",
            "active:scale-95",
          ],
          variant === "inset" && [
            "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text-secondary,#e2e8f0)] border border-[var(--p-border-subtle,rgba(255,255,255,0.03))]",
            "hover:text-[var(--p-text,#ffffff)]",
          ],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);
NeumorphicButton.displayName = "NeumorphicButton";

// --- Neumorphic Input & Textarea ---
export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const NeumorphicInput = React.forwardRef<HTMLInputElement, NeumorphicInputProps>(
  ({ className, icon, style, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-3.5 text-[var(--p-text-muted,#94a3b8)] pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          style={{ boxShadow: "var(--neu-inset, inset 3px 3px 7px rgba(0,0,0,0.6), inset -3px -3px 7px rgba(255,255,255,0.03))", ...style }}
          className={cn(
            "w-full rounded-xl bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] placeholder-[var(--p-text-muted,#94a3b8)] text-sm py-3 transition-all outline-none border border-[var(--p-border-subtle,rgba(255,255,255,0.05))]",
            icon ? "pl-10 pr-4" : "px-4",
            "focus:border-white/40",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
NeumorphicInput.displayName = "NeumorphicInput";

export interface NeumorphicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const NeumorphicTextarea = React.forwardRef<HTMLTextAreaElement, NeumorphicTextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        style={{ boxShadow: "var(--neu-inset, inset 3px 3px 7px rgba(0,0,0,0.6), inset -3px -3px 7px rgba(255,255,255,0.03))", ...style }}
        className={cn(
          "w-full rounded-xl bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] placeholder-[var(--p-text-muted,#94a3b8)] text-sm p-4 transition-all outline-none border border-[var(--p-border-subtle,rgba(255,255,255,0.05))]",
          "focus:border-white/40",
          className
        )}
        {...props}
      />
    );
  }
);
NeumorphicTextarea.displayName = "NeumorphicTextarea";

// --- Neumorphic Toggle / Switch ---
export interface NeumorphicToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function NeumorphicToggle({ checked, onChange, label, className }: NeumorphicToggleProps) {
  return (
    <label className={cn("inline-flex items-center gap-3 cursor-pointer select-none", className)}>
      <div
        onClick={() => onChange(!checked)}
        style={{ boxShadow: checked ? undefined : "var(--neu-inset)" }}
        className={cn(
          "w-12 h-6 rounded-full transition-colors relative duration-300 p-1 flex items-center border border-[var(--p-border-subtle,rgba(255,255,255,0.06))]",
          checked
            ? "bg-[var(--p-text,#ffffff)] border-[var(--p-text,#ffffff)]"
            : "bg-[var(--p-bg-card,#0e0e14)]"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full transition-transform duration-300 shadow-[1px_1px_3px_rgba(0,0,0,0.4)]",
            checked
              ? "translate-x-6 bg-[var(--p-bg,#050508)]"
              : "translate-x-0 bg-[var(--p-text-muted,#94a3b8)]"
          )}
        />
      </div>
      {label && <span className="text-xs font-semibold text-[var(--p-text-secondary,#e2e8f0)]">{label}</span>}
    </label>
  );
}

// --- Neumorphic Checkbox ---
export interface NeumorphicCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function NeumorphicCheckbox({ checked, onChange, label, className }: NeumorphicCheckboxProps) {
  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <div
        onClick={() => onChange(!checked)}
        style={{ boxShadow: checked ? undefined : "var(--neu-inset)" }}
        className={cn(
          "w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 border border-[var(--p-border-subtle,rgba(255,255,255,0.06))]",
          checked
            ? "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] border-[var(--p-text,#ffffff)]"
            : "bg-[var(--p-bg-card,#0e0e14)] text-transparent"
        )}
      >
        <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[3]" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {label && <span className="text-xs font-semibold text-[var(--p-text-secondary,#e2e8f0)]">{label}</span>}
    </label>
  );
}

// --- Neumorphic Badge ---
export function NeumorphicBadge({ children, className, variant = "default" }: { children: React.ReactNode; className?: string; variant?: "default" | "active" | "glow" }) {
  return (
    <span
      style={{ boxShadow: "var(--neu-outset)" }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 select-none",
        variant === "default" && [
          "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border-[var(--p-border,#222230)]",
        ],
        variant === "active" && [
          "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border-[var(--p-primary,#00f0ff)]",
        ],
        variant === "glow" && [
          "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] border-none font-bold",
        ],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {children}
    </span>
  );
}

// --- Neumorphic Progress Bar ---
export function NeumorphicProgress({ value, max = 100, label, className }: { value: number; max?: number; label?: string; className?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <div className="flex justify-between text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">
          <span>{label}</span>
          <span className="font-mono text-[var(--p-text,#ffffff)]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        style={{ boxShadow: "var(--neu-inset)" }}
        className="w-full h-3 rounded-full bg-[var(--p-bg-card,#0e0e14)] p-0.5 overflow-hidden border border-[var(--p-border-subtle,rgba(255,255,255,0.04))]"
      >
        <div
          className="h-full rounded-full bg-[var(--p-text,#ffffff)] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
