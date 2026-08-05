"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SvgLiquidFilterProvider() {
  return (
    <svg className="hidden absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Dynamic Liquid Distortion Wave Displacement Map */}
        <filter id="liquid-displacement" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025 0.04"
            numOctaves="2"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="8s"
              values="0.02 0.03;0.04 0.06;0.02 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="liquid-hover-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04 0.07"
            numOctaves="3"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              dur="4s"
              values="0.03 0.05; 0.07 0.12; 0.03 0.05"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export interface LiquidDistortionImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  intensity?: "gentle" | "intense";
}

export function LiquidDistortionImage({
  src,
  alt = "Portfolio Showcase",
  fallbackIcon,
  aspectRatio = "auto",
  intensity = "intense",
  className,
  ...props
}: LiquidDistortionImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const filterId = isHovered
    ? "url(#liquid-hover-distortion)"
    : intensity === "intense"
    ? "url(#liquid-displacement)"
    : "none";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--p-border-subtle,rgba(255,255,255,0.08))] group cursor-pointer transition-all duration-500 select-none",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "portrait" && "aspect-[3/4]",
        className
      )}
      {...props}
    >
      {/* Neumorphic / Glass Overlay Frame */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 z-10 pointer-events-none rounded-2xl" />

      {src ? (
        <motion.img
          src={src}
          alt={alt}
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            filter: filterId,
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--p-bg-card,#12121a)] to-[var(--p-bg-card-hover,#1a1a26)] p-6 text-center">
          {fallbackIcon ? (
            <div className="w-12 h-12 rounded-2xl bg-[var(--p-primary,#00f0ff)]/10 text-[var(--p-primary,#00f0ff)] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {fallbackIcon}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[var(--p-primary,#00f0ff)]/10 text-[var(--p-primary,#00f0ff)] flex items-center justify-center mb-3 font-mono text-xl font-bold">
              ✦
            </div>
          )}
          <span className="text-xs font-semibold text-[var(--p-text-secondary,#cbd5e1)]">{alt}</span>
        </div>
      )}

      {/* Hover Liquid Glow Edge Ripple */}
      <div className="absolute inset-0 border-2 border-[var(--p-primary,#00f0ff)]/0 group-hover:border-[var(--p-primary,#00f0ff)]/50 transition-colors duration-500 rounded-2xl z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]" />
    </div>
  );
}
