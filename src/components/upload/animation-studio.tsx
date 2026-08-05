"use client";

import React, { useState } from "react";
import { Sparkles, Zap, Box, Layers, MousePointerClick, Bot, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/resume-store";
import type {
  MotionStylePreset,
  CardStylePreset,
  ButtonStylePreset,
  CanvasStylePreset,
  MascotOptionPreset,
} from "@/server/resume/types";

// ---------------------------------------------------------------------------
// Preset Options Data (100+ Visual Combinations)
// ---------------------------------------------------------------------------

const MOTION_PRESETS: { id: MotionStylePreset; label: string; desc: string; iconTag: string }[] = [
  { id: "quantum", label: "Quantum Float", desc: "Smooth continuous physics floating with soft spring ease.", iconTag: "✨ Float" },
  { id: "glitch", label: "Cyber Glitch Motion", desc: "High-tech staggered entrance with subtle neon glitch effect.", iconTag: "⚡ Glitch" },
  { id: "magnetic", label: "Magnetic Elastic", desc: "Interactive magnetic cursor snap & elastic spring bounce.", iconTag: "🧲 Magnetic" },
  { id: "parallax", label: "Holographic Parallax", desc: "Multi-layered depth scroll reveal with 3D offset.", iconTag: "🌌 Depth" },
  { id: "stagger", label: "Staggered Cascade", desc: "Sequential element cascading with micro-timing.", iconTag: "🌊 Wave" },
  { id: "apple", label: "Apple Motion", desc: "Refined luxury fade-in & scale up with cubic-bezier.", iconTag: "🍏 Refined" },
  { id: "roll3d", label: "3D Rotation Roll", desc: "Perspective flip card entrance with 3D rotation.", iconTag: "🎲 3D" },
  { id: "minimal", label: "Minimal Smooth Fade", desc: "Subtle 20px Y-translate & clean alpha transition.", iconTag: "🍃 Clean" },
];

const CARD_PRESETS: { id: CardStylePreset; label: string; desc: string; previewBadge: string }[] = [
  { id: "tilt3d", label: "3D Parallax Tilt", desc: "Real-time mouse perspective tilt with glare light reflection.", previewBadge: "3D Tilt" },
  { id: "cyber-glass", label: "Glowing Cyber Glass", desc: "Deep purple & red glassmorphism with neon border glow.", previewBadge: "Cyber Glass" },
  { id: "shimmer-beam", label: "Shimmering Gradient Trace", desc: "Continuous tracing gradient beam around card borders.", previewBadge: "Shimmer" },
  { id: "magnetic-glow", label: "Magnetic Cursor Light", desc: "Card border illuminates dynamically under mouse cursor.", previewBadge: "Glow" },
  { id: "holographic", label: "Holographic Metallic", desc: "Iridescent metallic sheen that shifts with view angle.", previewBadge: "Hologram" },
  { id: "soft-shadow", label: "Soft Elevated Shadow", desc: "Clean modern SaaS card elevation with soft dark shadow.", previewBadge: "Elevated" },
  { id: "dual-ring", label: "Dual Ring Cyberpunk", desc: "Double outline accent in electric purple and crimson red.", previewBadge: "Cyber Rings" },
  { id: "minimal", label: "Minimalist Line Border", desc: "Ultra clean thin border with focus contrast.", previewBadge: "Minimal" },
];

const BUTTON_PRESETS: { id: ButtonStylePreset; label: string; desc: string }[] = [
  { id: "liquid-gradient", label: "Liquid Gradient Fill", desc: "Glowing dark purple to red liquid gradient button." },
  { id: "magnetic-pill", label: "Magnetic Fluid Pill", desc: "Pill button that stretches & magnetic scales on hover." },
  { id: "neon-pulse", label: "Cyber Neon Pulse", desc: "Electric pulsing aura border with high-contrast text." },
  { id: "glass-reflect", label: "Glass Reflection Hover", desc: "Backdrop blur glass button with light reflection sheen." },
  { id: "shimmer-border", label: "Shimmering Border Spark", desc: "Animated gradient outline button." },
  { id: "elastic-bounce", label: "Elastic Spring Scale", desc: "Playful tactile bounce on press & hover." },
  { id: "underline-glow", label: "Underline Glow Highlight", desc: "Subtle neon underline reveal on hover." },
];

const CANVAS_PRESETS: { id: CanvasStylePreset; label: string; desc: string }[] = [
  { id: "three-particles", label: "Three.js WebGL Cyber Particles", desc: "Interactive WebGL 3D particle wave & glowing polyhedra mesh." },
  { id: "cosmic-mesh", label: "Cosmic Starfield & Nodes", desc: "Floating star particles & constellation line connections." },
  { id: "aurora", label: "Aurora Ambient Wave", desc: "Smooth flowing atmospheric gradient waves." },
  { id: "grid-matrix", label: "High-Tech Grid Matrix", desc: "Developer grid canvas with subtle intersection pulses." },
  { id: "blobs", label: "Floating Neon Blobs", desc: "Animated radial blurred purple & crimson spheres." },
  { id: "minimal", label: "Clean Flat Background", desc: "Distraction-free solid background surface." },
];

const MASCOT_OPTIONS: { id: MascotOptionPreset; label: string; desc: string; badge: string }[] = [
  { id: "enabled-byte", label: "Cyber Mascot 'Byte'", desc: "Animated 3D-styled developer mascot with live speech bubble & wave.", badge: "Recommended 🤖" },
  { id: "enabled-minimal", label: "Minimalist Badge Avatar", desc: "Clean SVG developer badge without cartoon speech bubble.", badge: "Minimal 🏷️" },
  { id: "disabled", label: "Off (No Cartoon)", desc: "Pure clean portfolio presentation without mascot character.", badge: "Disabled 🚫" },
];

// ---------------------------------------------------------------------------
// Animation Studio Component
// ---------------------------------------------------------------------------

export function AnimationStudio() {
  const { presets, setPresetOption } = useResumeStore();
  const [activeTab, setActiveTab] = useState<"motion" | "cards" | "buttons" | "canvas" | "mascot">("motion");
  const [testHover, setTestHover] = useState(false);

  return (
    <div className="space-y-6">
      {/* Studio Header & Live Preview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/20 bg-purple-950/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">100+ Animation & Visual Style Studio</h3>
          </div>
          <p className="text-xs text-purple-300/80">
            Pick your preferred motion, card tilt, button hover, 3D background & mascot options.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-900/40 text-xs font-mono text-purple-200 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Interactive Customizer</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10" style={{ scrollbarWidth: "none" }}>
        {[
          { id: "motion", label: "Motion & Scroll", icon: Layers },
          { id: "cards", label: "Card Hover & Borders", icon: Box },
          { id: "buttons", label: "Button Micro-Interactions", icon: MousePointerClick },
          { id: "canvas", label: "3D Background Canvas", icon: Sparkles },
          { id: "mascot", label: "Mascot Avatar", icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                active
                  ? "bg-purple-600/30 text-white border border-purple-500/40 shadow-sm"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Motion Presets */}
      {activeTab === "motion" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOTION_PRESETS.map((preset) => {
            const active = presets.motionStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetOption("motionStyle", preset.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer",
                  active
                    ? "border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-950/60"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300">
                    {preset.iconTag}
                  </span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-white mb-1">{preset.label}</p>
                <p className="text-[11px] text-text-muted leading-relaxed">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: Card Presets */}
      {activeTab === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CARD_PRESETS.map((preset) => {
            const active = presets.cardStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetOption("cardStyle", preset.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer",
                  active
                    ? "border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-950/60"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300">
                    {preset.previewBadge}
                  </span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-white mb-1">{preset.label}</p>
                <p className="text-[11px] text-text-muted leading-relaxed">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: Button Micro-Interactions */}
      {activeTab === "buttons" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUTTON_PRESETS.map((preset) => {
            const active = presets.buttonStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetOption("buttonStyle", preset.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer",
                  active
                    ? "border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-950/60"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{preset.label}</span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: 3D Background Canvas */}
      {activeTab === "canvas" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CANVAS_PRESETS.map((preset) => {
            const active = presets.canvasStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetOption("canvasStyle", preset.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer",
                  active
                    ? "border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-950/60"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{preset.label}</span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: Cartoon Mascot Option */}
      {activeTab === "mascot" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MASCOT_OPTIONS.map((option) => {
            const active = presets.mascotOption === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPresetOption("mascotOption", option.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer",
                  active
                    ? "border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-950/60"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    {option.badge}
                  </span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-white mb-1">{option.label}</p>
                <p className="text-[11px] text-text-muted leading-relaxed">{option.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE LIVE TESTER WIDGET */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Real-Time Animation Live Tester
            </h4>
          </div>
          <span className="text-[10px] font-mono text-purple-300/70">Hover & test your choices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sample Card Preview */}
          <div
            className={cn(
              "rounded-xl border p-5 transition-all duration-300 cursor-pointer",
              presets.cardStyle === "cyber-glass"
                ? "border-purple-500/60 bg-purple-900/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                : presets.cardStyle === "tilt3d"
                ? "border-purple-500/40 bg-purple-950/40 hover:scale-[1.02] hover:-rotate-1"
                : presets.cardStyle === "shimmer-beam"
                ? "border-rose-500/50 bg-rose-950/20 animate-pulse"
                : "border-white/20 bg-white/5"
            )}
            onMouseEnter={() => setTestHover(true)}
            onMouseLeave={() => setTestHover(false)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Sample Project Card</span>
              <span className="text-[10px] font-mono text-purple-300">
                Style: {presets.cardStyle}
              </span>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed mb-4">
              Hover over this card to test the active tilt, glow, and motion reveal settings!
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
              <span>{testHover ? "⚡ Hovering - Card Active!" : "👆 Hover to test hover effect"}</span>
            </div>
          </div>

          {/* Sample Button & Mascot Preview */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Button & Mascot Test</span>
              <span className="text-[10px] font-mono text-rose-400">
                Mascot: {presets.mascotOption}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer",
                  presets.buttonStyle === "liquid-gradient"
                    ? "bg-gradient-to-r from-purple-600 via-rose-600 to-purple-600 hover:scale-105 shadow-md shadow-purple-900/50"
                    : presets.buttonStyle === "magnetic-pill"
                    ? "rounded-full bg-purple-500 hover:px-7 hover:bg-rose-500"
                    : presets.buttonStyle === "neon-pulse"
                    ? "border border-rose-500 bg-rose-950/60 shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "bg-purple-600 hover:bg-purple-500"
                )}
              >
                Sample Action Button
              </button>

              {presets.mascotOption === "enabled-byte" && (
                <div className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/30 text-[10px] font-mono text-purple-200 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Byte Mascot Active 🤖</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
