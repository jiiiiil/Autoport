"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code2, Cpu, Terminal, Zap, MessageSquare } from "lucide-react";

interface DeveloperMascotProps {
  name?: string;
  role?: string;
  skills?: string[];
  className?: string;
  showSpeechBubble?: boolean;
}

const MESSAGES = [
  "Hi! Welcome to my digital workspace! 🚀",
  "Building high-performance scalable web systems!",
  "Full-stack MERN & AI engineering enthusiast!",
  "Explore my projects & reach out for collaborations! ✨",
];

export function DeveloperMascot({
  name = "Developer",
  role = "Full Stack Engineer",
  skills = ["React.js", "Node.js", "Express.js", "MongoDB"],
  className = "",
  showSpeechBubble = true,
}: DeveloperMascotProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsWaving(true);
    setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    setTimeout(() => setIsWaving(false), 2000);
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative mb-3 z-20 max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-2.5 rounded-2xl border border-purple-500/30 bg-purple-950/80 backdrop-blur-md shadow-xl text-xs font-medium text-purple-100 flex items-center gap-2 cursor-pointer"
              onClick={handleClick}
            >
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span>{MESSAGES[messageIndex]}</span>
            </motion.div>
          </AnimatePresence>
          {/* Pointer Arrow */}
          <div className="w-3 h-3 bg-purple-950/80 border-r border-b border-purple-500/30 rotate-45 mx-auto -mt-1.5 shadow-sm" />
        </div>
      )}

      {/* Mascot Graphic & Floating Elements Container */}
      <div
        className="relative w-48 h-48 sm:w-56 sm:h-56 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Glow Aura behind Mascot */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-rose-600/20 to-cyan-500/20 blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />

        {/* Orbiting Tech Skill Badges */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 p-2 rounded-xl border border-purple-500/40 bg-purple-950/90 text-purple-300 shadow-lg text-[10px] font-mono flex items-center gap-1">
            <Code2 className="w-3 h-3 text-cyan-400" />
            <span>React</span>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 p-2 rounded-xl border border-rose-500/40 bg-rose-950/90 text-rose-300 shadow-lg text-[10px] font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3 text-rose-400" />
            <span>Node</span>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-xl border border-purple-500/40 bg-purple-950/90 text-purple-300 shadow-lg text-[10px] font-mono flex items-center gap-1">
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>Mongo</span>
          </div>
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 p-2 rounded-xl border border-amber-500/40 bg-purple-950/90 text-amber-300 shadow-lg text-[10px] font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Express</span>
          </div>
        </motion.div>

        {/* 3D Stylized Developer Mascot Illustration (SVG) */}
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-2xl relative z-10"
          animate={{
            y: isHovered ? [0, -6, 0] : [0, -3, 0],
          }}
          transition={{
            duration: isHovered ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <defs>
            {/* Dark Cyber Gradients */}
            <linearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7e22ce" />
              <stop offset="50%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Headset Ring Glow */}
          <circle
            cx="100"
            cy="90"
            r="68"
            fill="none"
            stroke="url(#visorGrad)"
            strokeWidth="3"
            opacity="0.6"
            filter="url(#neonGlow)"
          />

          {/* Hoodie Body */}
          <path
            d="M40 185 Q100 135 160 185 L165 200 L35 200 Z"
            fill="url(#hoodieGrad)"
            stroke="#9333ea"
            strokeWidth="2"
          />

          {/* Hoodie Zipper & Strings */}
          <line x1="100" y1="150" x2="100" y2="200" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="92" cy="165" r="2.5" fill="#f43f5e" />
          <circle cx="108" cy="165" r="2.5" fill="#38bdf8" />

          {/* Character Head */}
          <rect
            x="60"
            y="50"
            width="80"
            height="80"
            rx="24"
            fill="#1e1b4b"
            stroke="#a855f7"
            strokeWidth="3"
          />

          {/* Inner Face Screen */}
          <rect
            x="66"
            y="56"
            width="68"
            height="68"
            rx="18"
            fill="#090514"
          />

          {/* AR Cyber Visor / Glasses */}
          <rect
            x="72"
            y="72"
            width="56"
            height="22"
            rx="8"
            fill="url(#visorGrad)"
            filter="url(#neonGlow)"
          />

          {/* Visor Glint Reflection Lines */}
          <line x1="78" y1="76" x2="94" y2="76" stroke="#ffffff" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
          <line x1="82" y1="82" x2="90" y2="82" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

          {/* Glowing Eyes inside Visor */}
          <circle cx="86" cy="83" r="3.5" fill="#ffffff" />
          <circle cx="114" cy="83" r="3.5" fill="#ffffff" />

          {/* Friendly Smile Mouth */}
          <path
            d="M88 106 Q100 116 112 106"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Cute Blush Dots */}
          <circle cx="78" cy="102" r="4" fill="#e11d48" opacity="0.4" />
          <circle cx="122" cy="102" r="4" fill="#e11d48" opacity="0.4" />

          {/* Pro Gaming Headset */}
          <path
            d="M52 80 C52 45 148 45 148 80"
            fill="none"
            stroke="#e11d48"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Headset Ear Cups */}
          <rect x="46" y="70" width="12" height="24" rx="5" fill="#be123c" stroke="#f43f5e" strokeWidth="1.5" />
          <rect x="142" y="70" width="12" height="24" rx="5" fill="#be123c" stroke="#f43f5e" strokeWidth="1.5" />

          {/* Headset Mic */}
          <path d="M52 88 Q45 110 70 112" fill="none" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="70" cy="112" r="3" fill="#38bdf8" />

          {/* Waving Arm (Triggered on click/hover) */}
          <motion.g
            animate={{
              rotate: isWaving ? [0, 25, -15, 20, 0] : isHovered ? [0, 15, 0] : 0,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "150px 160px" }}
          >
            <path
              d="M148 160 Q175 140 165 115"
              fill="none"
              stroke="#7e22ce"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Waving Hand */}
            <circle cx="165" cy="115" r="9" fill="#fde047" />
          </motion.g>
        </motion.svg>
      </div>

      {/* Action Hint */}
      <span className="text-[11px] font-mono text-purple-300/70 mt-1 flex items-center gap-1 group-hover:text-purple-300 transition-colors">
        <MessageSquare className="w-3 h-3 text-rose-400" />
        Click mascot to say hi! 👋
      </span>
    </div>
  );
}
