"use client";

import React from "react";
import { motion } from "framer-motion";

export type EmojiType =
  | "rocket"
  | "code"
  | "design"
  | "lightning"
  | "diamond"
  | "idea"
  | "fire"
  | "trophy"
  | "package"
  | "target"
  | "brain"
  | "magic";

const EMOJI_MAP: Record<EmojiType, string> = {
  rocket: "🚀",
  code: "💻",
  design: "🎨",
  lightning: "⚡",
  diamond: "💎",
  idea: "💡",
  fire: "🔥",
  trophy: "🏆",
  package: "📦",
  target: "🎯",
  brain: "🧠",
  magic: "🔮",
};

interface Emoji3DProps {
  type: EmojiType;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export function Emoji3D({ type, size = "md", className = "", animate = true }: Emoji3DProps) {
  const emoji = EMOJI_MAP[type] || "🚀";

  const sizeClasses = {
    sm: "text-xl w-8 h-8",
    md: "text-3xl w-12 h-12",
    lg: "text-5xl w-16 h-16",
    xl: "text-7xl w-24 h-24",
  }[size];

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotateZ: 8 }}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.2 },
      }}
      className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/05 backdrop-blur-md border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none cursor-pointer ${sizeClasses} ${className}`}
      style={{
        textShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
        transformStyle: "preserve-3d",
      }}
    >
      <span className="drop-shadow-md filter">{emoji}</span>
    </motion.div>
  );
}

interface UI8IllustrationCardProps {
  emoji: EmojiType;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function UI8IllustrationCard({
  emoji,
  title,
  subtitle,
  badge = "3D Asset",
  className = "",
}: UI8IllustrationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative group rounded-3xl p-6 bg-gradient-to-b from-[var(--p-bg-card,#0e0e14)] to-[var(--p-bg-card-hover,#161620)] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden ${className}`}
    >
      {/* Glossy Reflection overlay */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--p-primary,#00f0ff)]/10 rounded-full blur-3xl group-hover:bg-[var(--p-primary,#00f0ff)]/25 transition-all duration-500" />

      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="flex items-center justify-between w-full">
          <Emoji3D type={emoji} size="lg" />
          <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-white/10 text-white border border-white/20">
            {badge}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-black text-white tracking-tight group-hover:text-slate-200 transition-colors">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface BuyMeACoffeeBadgeProps {
  avatar?: string;
  name: string;
  role?: string;
  className?: string;
}

export function BuyMeACoffeeBadge({ avatar, name, role, className = "" }: BuyMeACoffeeBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--p-bg-card,#0e0e14)] border border-[var(--p-border,#222230)] shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-md ${className}`}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover border border-white/30" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-100 to-slate-400 text-black font-black text-xs flex items-center justify-center shadow-md">
          {name.charAt(0)}
        </div>
      )}

      <div className="flex flex-col text-left">
        <span className="text-xs font-black text-white leading-none tracking-tight">
          {name}
        </span>
        {role && (
          <span className="text-[10px] font-semibold text-slate-300 leading-tight">
            {role}
          </span>
        )}
      </div>

      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
    </div>
  );
}
