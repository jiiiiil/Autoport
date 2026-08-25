"use client";

import { useState } from "react";
import { Check, Palette, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/resume-store";
import type { ThemeName } from "@/server/resume/types";

interface PrimaryThemeOption {
  id: ThemeName;
  label: string;
  description: string;
  icon: typeof Moon;
  swatch: string[];
}

const PRIMARY_THEMES: PrimaryThemeOption[] = [
  {
    id: "black",
    label: "Black (Pure Dark Neumorphic)",
    description: "Deep obsidian dark background with bold white h1 headings & pure white text.",
    icon: Moon,
    swatch: ["#050508", "#0e0e14", "#ffffff", "#00f0ff"],
  },
  {
    id: "spatial-3d",
    label: "AiPort Spatial 3D Engine",
    description: "Apple editorial typography + Awwwards 3D character storytelling + scroll-driven spatial motion.",
    icon: Sparkles,
    swatch: ["#090a0f", "#141722", "#38bdf8", "#a855f7"],
  },
];

const CUSTOM_FIELDS: { key: "primary" | "secondary" | "accent" | "background" | "surface" | "text"; label: string }[] = [
  { key: "primary", label: "Primary Accent" },
  { key: "secondary", label: "Secondary Accent" },
  { key: "accent", label: "Glow Accent" },
  { key: "background", label: "Background" },
  { key: "surface", label: "Card Surface" },
  { key: "text", label: "Text Color" },
];

export function ThemeSelector() {
  const { theme, setTheme, customColors, setCustomColors } = useResumeStore();
  const [showCustom, setShowCustom] = useState(theme === "custom");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-text-primary">Theme Palette</h3>
        </div>
        <span className="text-[11px] font-mono text-text-primary/70">Theme Options</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRIMARY_THEMES.map((preset) => {
          const Icon = preset.icon;
          const active = theme === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setTheme(preset.id);
                setShowCustom(false);
              }}
              className={cn(
                "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer overflow-hidden",
                active
                  ? "border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-950/50"
                  : "border-black/10 bg-white hover:border-black/25 hover:bg-black/5"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                      active ? "bg-purple-500/20 text-purple-300" : "bg-black/5 text-text-primary"
                    )}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{preset.label}</p>
                    <div className="flex gap-1.5 mt-1">
                      {preset.swatch.map((color) => (
                        <span
                          key={color}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {active && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500 text-white shadow-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-xs text-text-primary leading-relaxed font-semibold">{preset.description}</p>
            </button>
          );
        })}
      </div>

      {/* Custom Palette Toggle */}
      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={() => {
            setShowCustom(!showCustom);
            if (!showCustom) setTheme("custom");
          }}
          className="text-xs font-mono text-text-primary/80 hover:text-primary transition-colors underline cursor-pointer"
        >
          {showCustom ? "Hide Custom Palette" : "+ Customize Specific Colors"}
        </button>
      </div>

      {showCustom && (
        <div className="mt-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-text-primary/80 mb-3">
            Custom Accent Tuning
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CUSTOM_FIELDS.map((field) => (
              <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="color"
                  value={customColors[field.key] ?? "#9333ea"}
                  onChange={(e) => setCustomColors({ ...customColors, [field.key]: e.target.value })}
                  className="w-7 h-7 rounded-lg border border-black/20 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-text-primary font-semibold">{field.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
