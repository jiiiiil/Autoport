"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemePreset } from "@/server/resume/themes";
import { useResumeStore } from "@/lib/resume-store";

const CUSTOM_FIELDS: { key: "primary" | "secondary" | "accent" | "background" | "surface" | "text"; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "text", label: "Text" },
];

export function ThemeSelector() {
  const { theme, setTheme, customColors, setCustomColors } = useResumeStore();
  const [showCustom, setShowCustom] = useState(theme === "custom");

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-white">Theme</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEME_PRESETS.map((preset: ThemePreset) => {
          const active = theme === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setTheme(preset.id);
                if (preset.id === "custom") setShowCustom(true);
              }}
              className={cn(
                "group rounded-2xl border p-3 text-left transition-all duration-200 cursor-pointer",
                active
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex">
                  {preset.swatch.map((color, i) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-white/20 -ml-1.5 first:ml-0"
                      style={{ background: color, zIndex: 5 - i }}
                    />
                  ))}
                </div>
                {active && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-white">{preset.label}</p>
              <p className="text-[10px] text-text-muted leading-snug mt-1">{preset.description}</p>
            </button>
          );
        })}
      </div>

      {showCustom && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium text-text-muted mb-3">
            Custom colors — applied when using the Custom theme
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CUSTOM_FIELDS.map((field) => (
              <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="color"
                  value={customColors[field.key] ?? "#3b82f6"}
                  onChange={(e) => setCustomColors({ ...customColors, [field.key]: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-text-muted">{field.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
