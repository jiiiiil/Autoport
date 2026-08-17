"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Cpu, Terminal, Zap, Globe, Cloud, Database, Rocket, BookOpen, Award, CheckCircle } from "lucide-react";
import { DeveloperMascot } from "@/components/portfolio/interactive/developer-mascot";

interface SpatialObjectProps {
  assetId: string;
  className?: string;
  style?: React.CSSProperties;
  parallaxSpeed?: number;
  rotateOnScroll?: boolean;
  scale?: number;
  label?: string;
}

export function SpatialObject({
  assetId,
  className = "",
  style,
  parallaxSpeed = 1,
  rotateOnScroll = true,
  scale = 1,
  label,
}: SpatialObjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const ox = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 12 * parallaxSpeed;
      const oy = ((e.clientY - innerHeight / 2) / (innerHeight / 2)) * 12 * parallaxSpeed;
      setMouseOffset({ x: ox, y: oy });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [parallaxSpeed]);

  const renderGraphic = () => {
    if (assetId.startsWith("developer")) {
      const pose = assetId.replace("developer-", "");
      return (
        <div className="relative">
          <DeveloperMascot name={label || "Developer"} role="Full Stack Developer" showSpeechBubble={false} />
        </div>
      );
    }

    switch (assetId) {
      case "react":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 p-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Code2 className="w-8 h-8 text-cyan-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-bold text-cyan-200">React.js</span>
          </div>
        );
      case "node":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 p-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Cpu className="w-8 h-8 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-200">Node.js</span>
          </div>
        );
      case "mongodb":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-950/80 border border-green-400/40 p-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Database className="w-8 h-8 text-green-400" />
            <span className="text-[10px] font-mono font-bold text-green-200">MongoDB</span>
          </div>
        );
      case "express":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-950/80 border border-amber-400/40 p-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Zap className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-200">Express</span>
          </div>
        );
      case "typescript":
      case "javascript":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-950/80 border border-blue-400/40 p-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Terminal className="w-8 h-8 text-blue-400" />
            <span className="text-[10px] font-mono font-bold text-blue-200">{assetId === "typescript" ? "TypeScript" : "JavaScript"}</span>
          </div>
        );
      case "codepanel":
        return (
          <div className="w-64 sm:w-72 rounded-2xl bg-slate-950/90 border border-purple-500/30 p-4 shadow-2xl backdrop-blur-xl font-mono text-[11px]">
            <div className="flex items-center gap-1.5 mb-3 border-b border-white/10 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400 ml-2">developer.config.ts</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p className="text-purple-400"><span className="text-sky-400">const</span> developer = &#123;</p>
              <p className="pl-4">role: <span className="text-amber-300">"Full Stack Architect"</span>,</p>
              <p className="pl-4">stack: [<span className="text-emerald-300">"React"</span>, <span className="text-emerald-300">"Node"</span>, <span className="text-emerald-300">"3D WebGL"</span>],</p>
              <p className="pl-4">status: <span className="text-cyan-300">"Building Scalable Systems 🚀"</span></p>
              <p className="text-purple-400">&#125;;</p>
            </div>
          </div>
        );
      case "rocket":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-md">
            <Rocket className="w-10 h-10 text-purple-300 animate-bounce" />
          </div>
        );
      case "graduation":
      case "books":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-950/80 border border-indigo-400/40 p-3 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <span className="text-[10px] font-mono font-bold text-indigo-200">Education</span>
          </div>
        );
      case "certificate":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-950/80 border border-amber-400/40 p-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Award className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-200">Certified</span>
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-3 flex items-center justify-center backdrop-blur-md shadow-lg">
            <CheckCircle className="w-6 h-6 text-sky-400" />
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      animate={{
        x: mouseOffset.x,
        y: mouseOffset.y,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.1 }}
      style={{ transform: `scale(${scale})`, ...style }}
      className={`spatial-object inline-flex items-center justify-center select-none pointer-events-auto ${className}`}
    >
      {renderGraphic()}
    </motion.div>
  );
}
