"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "gold" | "emerald" | "default";
}

export function TiltCard({
  children,
  className = "",
  glowColor = "cyan",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY - height / 2) / (height / 2)) * -12;
    const rY = ((mouseX - width / 2) / (width / 2)) * 12;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowBorderClass = "hover:border-white/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)]";

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative rounded-3xl border border-[var(--p-border,#222230)] bg-[var(--p-bg-card,#0e0e14)] backdrop-blur-xl p-6 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] ${glowBorderClass} ${className}`}
      >
        {/* ActiveTheory Glare Reflection Light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
          }}
        />

        <div className="relative z-20" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
