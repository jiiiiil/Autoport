import type { PortfolioObject } from "./types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import JSZip from "jszip";

export interface CodeFile {
  filename: string;
  language: string;
  content: string;
  path: string;
}

export function generatePortfolioCodeFiles(portfolio: PortfolioObject | null, composition?: CompositionGraph | null): CodeFile[] {
  const p = portfolio || {};
  const personal = p.personalInfo || {};
  const name = personal.name || "Developer";
  const role = personal.role || "Software Engineer & Creative Technologist";
  const tagline = personal.tagline || "Building high-performance digital experiences with futuristic UI and modern Web tech.";
  const email = personal.email || p.sections?.contact?.email || "contact@example.com";
  const location = personal.location || "San Francisco, CA";
  const avatar = personal.avatar || "";

  const hero = p.sections?.hero || {};
  const headline = hero.headline || `Hi, I'm ${name}`;
  const subheadline = hero.subheadline || tagline;
  const ctaText = hero.ctaText || "View My Work";

  const rawProjects = p.sections?.projects || [
    { title: "AI Generation Studio", description: "Automated design engine for modern web apps.", tags: ["React", "TypeScript", "TailwindCSS"], link: "#" },
    { title: "Cyber Canvas Visualizer", description: "Real-time WebGL particle starfield renderer.", tags: ["Three.js", "Canvas", "GLSL"], link: "#" },
    { title: "Quantum Design System", description: "High-performance component library with 3D depth physics.", tags: ["React", "Framer Motion", "Anime.js"], link: "#" }
  ];

  const rawSkills = p.sections?.skills || [
    { name: "React / Next.js", level: "expert" as const, category: "Frontend" },
    { name: "TypeScript", level: "expert" as const, category: "Frontend" },
    { name: "Three.js & WebGL", level: "advanced" as const, category: "Graphics" },
    { name: "TailwindCSS", level: "expert" as const, category: "Styling" },
    { name: "Node.js & PostgreSQL", level: "advanced" as const, category: "Backend" },
  ];

  const rawExperience = p.sections?.experience || [
    { company: "Tech Dynamic Inc", role: "Senior Frontend Architect", period: "2023 - Present", description: "Led development of interactive 3D WebGL applications and dynamic portfolio engines." },
    { company: "Creative Cyber Labs", role: "UI/UX Engineer", period: "2021 - 2023", description: "Designed micro-interactions, responsive design systems, and WebGL particle shaders." },
  ];

  const rawEducation = p.sections?.education || [
    { institution: "University of Technology", degree: "B.S. Computer Science & Design", period: "2017 - 2021" },
  ];

  const rawServices = p.sections?.services || [
    { title: "3D Web Application Development", description: "Custom WebGL, Three.js, and Anime.js interactive websites with high-performance animations.", icon: "code" },
    { title: "Design Systems & UI Engineering", description: "Scalable React/TypeScript component architecture, custom dark mode themes, and micro-interactions.", icon: "design" },
  ];

  const aboutText = (p.sections?.about?.content || p.sections?.about?.intro || personal.bio || tagline).replace(/"/g, '\\"');

  const themeMode = p.theme?.mode === "light" || p.theme?.mode === "white" ? "white" : "black";

  const files: CodeFile[] = [];

  // File 1: TiltCard.tsx
  const tiltCardTsx = `"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "gold" | "emerald" | "default";
}

export function TiltCard({ children, className = "", glowColor = "cyan" }: TiltCardProps) {
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
    setGlarePos({ x: (mouseX / width) * 100, y: (mouseY / height) * 100, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowBorderClass =
    glowColor === "gold"
      ? "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]"
      : glowColor === "emerald"
      ? "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]"
      : "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]";

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className={\`relative rounded-3xl border border-[var(--p-border,#222230)] bg-[var(--p-bg-card,#0e0e14)] backdrop-blur-xl p-6 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] \${glowBorderClass} \${className}\`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
          style={{
            background: \`radial-gradient(circle at \${glarePos.x}% \${glarePos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)\`,
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
`;
  files.push({ filename: "TiltCard.tsx", language: "typescript", path: "src/components/TiltCard.tsx", content: tiltCardTsx });

  // File 2: DepthCarousel.css
  const depthCarouselCss = `.depth-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: var(--dc-perspective, 1400px);
  perspective-origin: 50% 50%;
  touch-action: pan-y;
  outline: none;
  user-select: none;
  cursor: grab;
}
.depth-carousel:active { cursor: grabbing; }
.depth-carousel__stage { position: absolute; inset: 0; transform-style: preserve-3d; }
.depth-carousel__card {
  position: absolute; top: 50%; left: 50%; transform-origin: center center;
  overflow: hidden; background: #0e0e14; border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.75), 0 8px 20px -10px rgba(0, 0, 0, 0.6);
  will-change: transform, opacity, filter; cursor: pointer; transform: translate(-50%, -50%);
  transition: border-color 0.3s ease;
}
.depth-carousel__card:hover { border-color: rgba(0, 240, 255, 0.5); }
.depth-carousel__img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.depth-carousel__content {
  position: absolute; inset: 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end;
  background: linear-gradient(to top, rgba(5, 5, 8, 0.95) 0%, rgba(5, 5, 8, 0.4) 50%, transparent 100%); z-index: 10;
}
.depth-carousel__tint { position: absolute; inset: 0; opacity: 0; pointer-events: none; mix-blend-mode: multiply; z-index: 5; }
.depth-carousel__arrow {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 3000; width: 44px; height: 44px;
  display: grid; place-items: center; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999px;
  background: rgba(14, 14, 20, 0.7); backdrop-filter: blur(12px); color: #fff; cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.depth-carousel__arrow:hover { background: rgba(22, 22, 32, 0.9); border-color: rgba(0, 240, 255, 0.6); color: #00f0ff; }
.depth-carousel__arrow--prev { left: 16px; }
.depth-carousel__arrow--next { right: 16px; }
.depth-carousel__dots {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 3000; display: flex; gap: 8px;
  padding: 8px 14px; border-radius: 999px; background: rgba(14, 14, 20, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);
}
.depth-carousel__dot { width: 8px; height: 8px; border: none; border-radius: 999px; background: rgba(255, 255, 255, 0.35); cursor: pointer; transition: width 0.25s ease, background 0.25s ease; }
.depth-carousel__dot.is-active { width: 24px; background: #00f0ff; box-shadow: 0 0 10px rgba(0, 240, 255, 0.6); }
`;
  files.push({ filename: "DepthCarousel.css", language: "css", path: "src/components/DepthCarousel.css", content: depthCarouselCss });

  // File 3: DepthCarousel.tsx
  const depthCarouselTsx = `"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

export interface DepthCarouselItem {
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  link?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function DepthCarousel({
  items = [],
  cardWidth = 320,
  cardHeight = 420,
  radius = 24,
  tint = "#05060a",
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 700,
  ease = "power3.out",
  autoplay = true,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  className = "",
}: {
  items?: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}) {
  const data = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const count = data.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef<Record<string, unknown>>({});

  const dragRef = useRef<{ x: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean; id: number } | null>(null);
  const [active, setActive] = useState(0);

  cfgRef.current = { count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, autoplayDelay };

  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current as { count: number; tiltDirection: string; spread: number; tilt: number; loop: boolean; visibleCards: number; depth: number; falloff: number; blur: number };
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * cfg.falloff);
      const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = \`translate(-50%, -50%) scale(\${sc}) translateX(\${tx.toFixed(2)}px) translateZ(\${tz.toFixed(2)}px) rotateY(\${ry.toFixed(3)}deg)\`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = \`brightness(\${brightness.toFixed(3)}) blur(\${blurPx.toFixed(2)}px)\`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  const tweenTo = useCallback((target: number, animate: boolean) => {
    tweenRef.current?.kill();
    const cfg = cfgRef.current as { duration: number; ease: string; count: number };
    const proxy = { p: posRef.current };
    const dur = animate ? cfg.duration / 1000 : 0;
    tweenRef.current = gsap.to(proxy, {
      p: target,
      duration: dur,
      ease: cfg.ease,
      onUpdate: () => {
        posRef.current = proxy.p;
        layout(proxy.p);
      },
      onComplete: () => {
        const n = cfg.count;
        if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
        layout(posRef.current);
      },
    });
  }, [layout]);

  const setFocus = useCallback((rawIndex: number, animate = true) => {
    const cfg = cfgRef.current as { count: number; loop: boolean };
    const n = cfg.count;
    if (!n) return;
    const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
    let delta = idx - posRef.current;
    if (cfg.loop && n > 1) {
      delta = ((delta % n) + n) % n;
      if (delta > n / 2) delta -= n;
    }
    tweenTo(posRef.current + delta, animate);
    if (idx !== focusRef.current) {
      focusRef.current = idx;
      setActive(idx);
    }
  }, [tweenTo]);

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, count]);

  return (
    <div
      ref={rootRef}
      className={\`depth-carousel \${className}\`.trim()}
      style={{ "--dc-perspective": \`\${perspective}px\` } as React.CSSProperties}
    >
      <div className="depth-carousel__stage">
        {data.map((item, i) => (
          <div
            key={i}
            className="depth-carousel__card group"
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            onClick={() => setFocus(i, true)}
          >
            {item.image && <img className="depth-carousel__img" src={item.image} alt={item.title || ""} draggable={false} />}
            {item.title && (
              <div className="depth-carousel__content">
                <h3 className="text-lg font-black text-white group-hover:text-[var(--p-primary,#00f0ff)] transition-colors mb-1">{item.title}</h3>
                {item.description && <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>}
              </div>
            )}
            <span className="depth-carousel__tint" ref={(el) => { overlayRefs.current[i] = el; }} style={{ background: tint }} />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" onClick={() => navigateBy(-1)}>‹</button>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" onClick={() => navigateBy(1)}>›</button>
        </>
      )}
    </div>
  );
}
`;
  files.push({ filename: "DepthCarousel.tsx", language: "typescript", path: "src/components/DepthCarousel.tsx", content: depthCarouselTsx });

  // File 4: UI8Illustrations.tsx
  const ui8Tsx = `"use client";

import React from "react";
import { motion } from "framer-motion";

export type EmojiType = "rocket" | "code" | "design" | "lightning" | "diamond" | "idea" | "fire" | "trophy" | "package" | "target" | "brain" | "magic";

const EMOJI_MAP: Record<EmojiType, string> = {
  rocket: "🚀", code: "💻", design: "🎨", lightning: "⚡", diamond: "💎", idea: "💡", fire: "🔥", trophy: "🏆", package: "📦", target: "🎯", brain: "🧠", magic: "🔮",
};

export function Emoji3D({ type, size = "md", className = "", animate = true }: { type: EmojiType; size?: "sm" | "md" | "lg" | "xl"; className?: string; animate?: boolean }) {
  const emoji = EMOJI_MAP[type] || "🚀";
  const sizeClasses = { sm: "text-xl w-8 h-8", md: "text-3xl w-12 h-12", lg: "text-5xl w-16 h-16", xl: "text-7xl w-24 h-24" }[size];

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotateZ: 8 }}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.2 } }}
      className={\`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/05 backdrop-blur-md border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none cursor-pointer \${sizeClasses} \${className}\`}
    >
      <span className="drop-shadow-md filter">{emoji}</span>
    </motion.div>
  );
}

export function BuyMeACoffeeBadge({ name, role, avatar }: { name: string; role?: string; avatar?: string }) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--p-bg-card,#0e0e14)] border border-[var(--p-border,#222230)] shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-md">
      {avatar ? (
        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover border border-cyan-400/50" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black font-black text-xs flex items-center justify-center shadow-md">
          {name.charAt(0)}
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-xs font-black text-white leading-none tracking-tight">{name}</span>
        {role && <span className="text-[10px] font-semibold text-[var(--p-primary,#00f0ff)] leading-tight">{role}</span>}
      </div>
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
    </div>
  );
}
`;
  files.push({ filename: "UI8Illustrations.tsx", language: "typescript", path: "src/components/UI8Illustrations.tsx", content: ui8Tsx });

  // File 5: AnimeThreeCanvas.tsx
  const animeThreeTsx = `"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import anime from "animejs";

export function AnimeThreeCanvas({ className = "", gridSize = 4 }: { className?: string; gridSize?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.012);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    scene.add(camera);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0x00f0ff, 14, 35, 0.3);
    pointLight.position.set(0, 0, 4.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(3, 5, 6);
    scene.add(dirLight);

    const count = gridSize * gridSize * gridSize;
    const cellSize = 2.2 / gridSize;
    const spread = ((gridSize - 1) / 2) * cellSize * 1.35;
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
    const material = new THREE.MeshLambertMaterial({ color: new THREE.Color("#00f0ff") });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const instanceTargets: Array<{ baseX: number; baseY: number; baseZ: number; currX: number; currY: number; currZ: number; rx: number; ry: number; rz: number }> = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const bx = -spread + (x / (gridSize - 1 || 1)) * (spread * 2);
          const by = -spread + (y / (gridSize - 1 || 1)) * (spread * 2);
          const bz = -spread + (z / (gridSize - 1 || 1)) * (spread * 2);
          instanceTargets.push({ baseX: bx, baseY: by, baseZ: bz, currX: bx, currY: by, currZ: bz, rx: 0, ry: 0, rz: 0 });
        }
      }
    }

    const meshRotationTarget = { rx: 0, ry: 0 };
    const meshAnim = anime({
      targets: meshRotationTarget,
      ry: Math.PI * 2,
      rx: Math.PI * 2,
      duration: 24000,
      loop: true,
      easing: "linear",
      update: () => {
        mesh.rotation.y = meshRotationTarget.ry;
        mesh.rotation.x = meshRotationTarget.rx;
      },
    });

    const lightTarget = { intensity: 14 };
    const lightAnim = anime({
      targets: lightTarget,
      intensity: [28, 3],
      duration: 6000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      update: () => { pointLight.intensity = lightTarget.intensity; },
    });

    const instanceAnimTimeline = anime.timeline({ loop: true, direction: "alternate" });
    instanceTargets.forEach((target) => {
      const distFromCenter = Math.sqrt(target.baseX * target.baseX + target.baseY * target.baseY + target.baseZ * target.baseZ);
      instanceAnimTimeline.add(
        {
          targets: target,
          currX: target.baseX * 3.2,
          currY: target.baseY * 3.2,
          currZ: target.baseZ * 3.2,
          rx: Math.PI,
          ry: Math.PI,
          duration: 5500,
          delay: distFromCenter * 650,
          easing: "easeInOutQuint",
        },
        0
      );
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0025;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0025;
    };
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      targetScrollY = window.scrollY / maxScroll;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let animationFrameId: number;
    const render = () => {
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;
      camera.position.z = 7.5 + currentScrollY * 4.0;
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - currentScrollY * 1.8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      for (let i = 0; i < instanceTargets.length; i++) {
        const t = instanceTargets[i];
        dummy.position.set(t.currX, t.currY, t.currZ);
        dummy.rotation.set(t.rx, t.ry, t.rz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      meshAnim.pause();
      lightAnim.pause();
      instanceAnimTimeline.pause();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [gridSize]);

  return <div ref={containerRef} className={\`fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden \${className}\`} />;
}
`;
  files.push({ filename: "AnimeThreeCanvas.tsx", language: "typescript", path: "src/components/AnimeThreeCanvas.tsx", content: animeThreeTsx });

  // File 6: HeroSection.tsx
  const heroTsx = `import React from "react";
import { NeumorphicButton, NeumorphicBadge } from "./Neumorphism";
import { BuyMeACoffeeBadge, Emoji3D } from "./UI8Illustrations";
import { ArrowRight, Mail } from "lucide-react";

export function HeroSection() {
  return (
    <section id="hero" className="min-h-[85vh] flex items-center justify-center pt-12 md:pt-24 relative z-10">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <BuyMeACoffeeBadge name="${name}" role="${role}" />
            <NeumorphicBadge variant="active" className="text-xs uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Emoji3D type="lightning" size="sm" animate={false} />
                <span>Available for Hire</span>
              </span>
            </NeumorphicBadge>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            ${headline.replace(/"/g, '\\"')}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-medium">
            ${subheadline.replace(/"/g, '\\"')}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="#projects">
              <NeumorphicButton variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                ${ctaText}
              </NeumorphicButton>
            </a>
            <a href="mailto:${email}">
              <NeumorphicButton variant="primary" size="lg" icon={<Mail className="w-4 h-4" />}>
                Get In Touch
              </NeumorphicButton>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="p-8 w-full max-w-sm rounded-3xl bg-[var(--p-bg-card,#0e0e14)] border border-[var(--p-border,#222230)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-[var(--p-primary,#00f0ff)]/20 text-[var(--p-primary,#00f0ff)] flex items-center justify-center text-4xl font-extrabold shadow-[0_0_30px_rgba(0,240,255,0.4)] mb-4">
              ${name.charAt(0)}
            </div>
            <h3 className="text-2xl font-black text-white">${name}</h3>
            <p className="text-xs text-[var(--p-primary,#00f0ff)] mt-1 font-mono">${role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
  files.push({ filename: "HeroSection.tsx", language: "typescript", path: "src/components/HeroSection.tsx", content: heroTsx });

  // File 7: ProjectsSection.tsx
  const projectsTsx = `import React from "react";
import { NeumorphicBadge } from "./Neumorphism";
import { DepthCarousel } from "./DepthCarousel";
import { Emoji3D } from "./UI8Illustrations";

export const PROJECTS_DATA = ${JSON.stringify(rawProjects, null, 2)};

export function ProjectsSection() {
  return (
    <section id="projects" className="py-12 md:py-20 relative z-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Emoji3D type="diamond" size="sm" animate={false} />
            <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
              React Bits 3D Depth Engine
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08]">
            Featured Projects & Work
          </h2>
        </div>
        <NeumorphicBadge variant="glow" className="font-mono">
          {PROJECTS_DATA.length} Projects
        </NeumorphicBadge>
      </div>

      <div className="w-full h-[480px] relative rounded-3xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
        <DepthCarousel items={PROJECTS_DATA} depth={220} spread={100} tilt={24} perspective={1400} visibleCards={4} autoplay loop />
      </div>
    </section>
  );
}
`;
  files.push({ filename: "ProjectsSection.tsx", language: "typescript", path: "src/components/ProjectsSection.tsx", content: projectsTsx });

  // File 8: SkillsSection.tsx
  const skillsTsx = `import React from "react";
import { NeumorphicProgress } from "./Neumorphism";
import { TiltCard } from "./TiltCard";
import { Emoji3D } from "./UI8Illustrations";

export const SKILLS_DATA = ${JSON.stringify(rawSkills, null, 2)};

export function SkillsSection() {
  return (
    <section id="skills" className="py-12 md:py-20 relative z-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Emoji3D type="brain" size="sm" animate={false} />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
            Tech Stack Capabilities
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Technical Skills & Mastery
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TiltCard glowColor="cyan">
          <h3 className="text-base font-black uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--p-primary,#00f0ff)] animate-pulse" />
            Core Technologies
          </h3>

          <div className="space-y-5">
            {SKILLS_DATA.map((skill, i) => (
              <NeumorphicProgress key={i} label={skill.name} value={skill.level === "expert" ? 95 : skill.level === "advanced" ? 85 : 75} />
            ))}
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
`;
  files.push({ filename: "SkillsSection.tsx", language: "typescript", path: "src/components/SkillsSection.tsx", content: skillsTsx });

  // File 9: AboutSection.tsx
  const aboutTsx = `import React from "react";
import { TiltCard } from "./TiltCard";
import { Emoji3D } from "./UI8Illustrations";

export function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-20 relative z-10">
      <TiltCard glowColor="gold">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Emoji3D type="idea" size="xl" />
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
              About Architect
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Passionate About Crafting Web Apps That WOW
            </h2>
            <p className="text-slate-300 leading-relaxed font-medium">
              ${aboutText}
            </p>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
`;
  files.push({ filename: "AboutSection.tsx", language: "typescript", path: "src/components/AboutSection.tsx", content: aboutTsx });

  // File 10: ExperienceSection.tsx
  const experienceTsx = `import React from "react";
import { TiltCard } from "./TiltCard";
import { Emoji3D } from "./UI8Illustrations";

export const EXPERIENCE_DATA = ${JSON.stringify(rawExperience, null, 2)};

export function ExperienceSection() {
  return (
    <section id="experience" className="py-12 md:py-20 relative z-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Emoji3D type="rocket" size="sm" animate={false} />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
            Career Journey
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Work Experience
        </h2>
      </div>

      <div className="space-y-6">
        {EXPERIENCE_DATA.map((exp, i) => (
          <TiltCard key={i} glowColor={i % 2 === 0 ? "cyan" : "emerald"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div>
                <h3 className="text-xl font-black text-white">{exp.role}</h3>
                <span className="text-sm font-bold text-[var(--p-primary,#00f0ff)]">{exp.company}</span>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {exp.period}
              </span>
            </div>
            {exp.description && <p className="text-sm text-slate-300 font-medium leading-relaxed">{exp.description}</p>}
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
`;
  files.push({ filename: "ExperienceSection.tsx", language: "typescript", path: "src/components/ExperienceSection.tsx", content: experienceTsx });

  // File 11: EducationSection.tsx
  const educationTsx = `import React from "react";
import { TiltCard } from "./TiltCard";

export const EDUCATION_DATA = ${JSON.stringify(rawEducation, null, 2)};

export function EducationSection() {
  return (
    <section id="education" className="py-12 relative z-10">
      <h2 className="text-3xl font-black text-white tracking-tight mb-8">Education & Credentials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EDUCATION_DATA.map((edu, i) => (
          <TiltCard key={i} glowColor="gold">
            <h3 className="text-lg font-black text-white">{edu.degree}</h3>
            <p className="text-sm font-semibold text-[var(--p-primary,#00f0ff)] mt-1">{edu.institution}</p>
            <span className="text-xs font-mono text-slate-400 mt-2 block">{edu.period}</span>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
`;
  files.push({ filename: "EducationSection.tsx", language: "typescript", path: "src/components/EducationSection.tsx", content: educationTsx });

  // File 12: ServicesSection.tsx
  const servicesTsx = `import React from "react";
import { TiltCard } from "./TiltCard";
import { Emoji3D } from "./UI8Illustrations";

export const SERVICES_DATA = ${JSON.stringify(rawServices, null, 2)};

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 relative z-10">
      <div className="mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Services & Solutions
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES_DATA.map((srv, i) => (
          <TiltCard key={i} glowColor={i % 2 === 0 ? "cyan" : "emerald"}>
            <div className="flex items-start gap-4">
              <Emoji3D type={i % 2 === 0 ? "magic" : "package"} size="lg" />
              <div>
                <h3 className="text-xl font-black text-white mb-2">{srv.title}</h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{srv.description}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
`;
  files.push({ filename: "ServicesSection.tsx", language: "typescript", path: "src/components/ServicesSection.tsx", content: servicesTsx });

  // File 13: ContactSection.tsx
  const contactTsx = `import React, { useState } from "react";
import { NeumorphicInput, NeumorphicTextarea, NeumorphicButton } from "./Neumorphism";
import { TiltCard } from "./TiltCard";
import { Emoji3D } from "./UI8Illustrations";
import { Mail, Send, User } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 md:py-20 relative z-10">
      <TiltCard glowColor="gold" className="max-w-4xl mx-auto p-8 md:p-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex justify-center mb-2">
            <Emoji3D type="target" size="lg" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-1 mb-3">
            Let's Build Something Exceptional
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Available for new opportunities, freelance projects, and architectural inquiries.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center text-cyan-400 space-y-3 rounded-2xl bg-white/05 border border-cyan-400/30">
            <h3 className="text-2xl font-black text-white">✓ Message Sent!</h3>
            <p className="text-xs text-slate-300">Thank you for reaching out. I'll respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Your Name</label>
                <NeumorphicInput
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Your Email</label>
                <NeumorphicInput
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Message</label>
              <NeumorphicTextarea
                rows={4}
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Mail className="w-4 h-4 text-[var(--p-primary,#00f0ff)]" />
                <span>${email}</span>
              </div>
              <NeumorphicButton type="submit" variant="glow" size="lg" icon={<Send className="w-4 h-4" />}>
                Send Message
              </NeumorphicButton>
            </div>
          </form>
        )}
      </TiltCard>
    </section>
  );
}
`;
  files.push({ filename: "ContactSection.tsx", language: "typescript", path: "src/components/ContactSection.tsx", content: contactTsx });

  // File 14: Neumorphism.tsx
  const neumorphismTsx = `"use client";

import React from "react";

export function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function NeumorphicButton({ className, variant = "primary", size = "md", icon, children, style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "inset" | "glow"; size?: "sm" | "md" | "lg"; icon?: React.ReactNode }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-black rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 select-none",
        size === "sm" && "px-4 py-2 text-xs gap-1.5",
        size === "md" && "px-6 py-3 text-sm gap-2",
        size === "lg" && "px-8 py-4 text-base gap-2.5",
        variant === "primary" && "bg-[var(--p-bg-card,#0e0e14)] text-white border border-[var(--p-border,#222230)] hover:border-[var(--p-primary,#00f0ff)] shadow-lg",
        variant === "glow" && "bg-white text-black font-black border-none shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105",
        variant === "inset" && "bg-white/05 text-slate-200 border border-white/10 hover:border-white/20",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function NeumorphicInput({ className, icon, style, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative flex items-center w-full">
      {icon && <div className="absolute left-3.5 text-slate-400">{icon}</div>}
      <input
        className={clsx(
          "w-full rounded-2xl bg-[var(--p-bg-card,#0e0e14)] text-white text-sm py-3.5 outline-none border border-[var(--p-border,#222230)] focus:border-white/40 transition-colors",
          icon ? "pl-10 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function NeumorphicTextarea({ className, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-2xl bg-[var(--p-bg-card,#0e0e14)] text-white text-sm p-4 outline-none border border-[var(--p-border,#222230)] focus:border-white/40 transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function NeumorphicBadge({ children, className }: { children: React.ReactNode; className?: string; variant?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full border border-[var(--p-border,#222230)] bg-[var(--p-bg-card,#0e0e14)] text-white shadow-md", className)}>
      {children}
    </span>
  );
}

export function NeumorphicProgress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-xs font-bold text-slate-300">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-white/05 p-0.5 border border-white/10">
        <div className="h-full rounded-full bg-white transition-all duration-700 shadow-[0_0_12px_rgba(255,255,255,0.4)]" style={{ width: \`\${value}%\` }} />
      </div>
    </div>
  );
}
`;
  files.push({ filename: "Neumorphism.tsx", language: "typescript", path: "src/components/Neumorphism.tsx", content: neumorphismTsx });

  // File 15: App.tsx
  const appTsx = `"use client";

import React, { useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { ServicesSection } from "./components/ServicesSection";
import { ContactSection } from "./components/ContactSection";
import { AnimeThreeCanvas } from "./components/AnimeThreeCanvas";
import { NeumorphicButton } from "./components/Neumorphism";
import { Moon, Sun } from "lucide-react";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState<"black" | "white">("${themeMode}");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "black" ? "white" : "black"));
  };

  return (
    <div className={\`portfolio-root theme-\${theme} min-h-screen relative font-sans transition-colors duration-500 bg-[#050508] text-white\`}>
      <AnimeThreeCanvas />

      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#050508]/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-lg text-white">
            <span className="w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span>${name}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl border border-white/10 bg-white/05 text-white hover:scale-105 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "black" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <a href="#contact">
              <NeumorphicButton variant="glow" size="sm">Hire Me</NeumorphicButton>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24 pb-24 relative z-10">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs font-bold text-slate-400 relative z-10">
        <p>&copy; {new Date().getFullYear()} ${name}. Built with React, Three.js, Anime.js, GSAP & ActiveTheory 3D Physics.</p>
      </footer>
    </div>
  );
}
`;
  files.push({ filename: "App.tsx", language: "typescript", path: "src/App.tsx", content: appTsx });

  // File 16: main.tsx
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  files.push({ filename: "main.tsx", language: "typescript", path: "src/main.tsx", content: mainTsx });

  // File 17: index.css
  const indexCss = `@import "tailwindcss";

.theme-black {
  --p-bg: #050508;
  --p-bg-card: #0e0e14;
  --p-bg-card-hover: #161620;
  --p-border: #222230;
  --p-border-subtle: #141420;
  --p-text: #ffffff;
  --p-text-secondary: #e2e8f0;
  --p-text-muted: #94a3b8;
  --p-primary: #ffffff;
}

.theme-white {
  --p-bg: #ffffff;
  --p-bg-card: #ffffff;
  --p-bg-card-hover: #f4f6f9;
  --p-border: #e2e8f0;
  --p-border-subtle: #f1f5f9;
  --p-text: #000000;
  --p-text-secondary: #1e293b;
  --p-text-muted: #475569;
  --p-primary: #000000;
}

* { box-sizing: border-box; }
body {
  background-color: var(--p-bg, #050508);
  color: var(--p-text, #ffffff);
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}
`;
  files.push({ filename: "index.css", language: "css", path: "src/index.css", content: indexCss });

  // File 18: package.json
  const packageJson = JSON.stringify(
    {
      name: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-portfolio`,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        three: "^0.185.1",
        animejs: "^3.2.2",
        gsap: "^3.12.5",
        "framer-motion": "^12.4.2",
        "lucide-react": "^0.344.0",
      },
      devDependencies: {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@types/three": "^0.185.3",
        "@types/animejs": "^3.1.8",
        "@vitejs/plugin-react": "^4.3.1",
        "@tailwindcss/vite": "^4.0.0",
        tailwindcss: "^4.0.0",
        typescript: "^5.5.3",
        vite: "^5.4.2",
      },
    },
    null,
    2
  );
  files.push({ filename: "package.json", language: "json", path: "package.json", content: packageJson });

  // File 19: index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name} - 3D Portfolio</title>
  </head>
  <body class="bg-[#050508] text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  files.push({ filename: "index.html", language: "html", path: "index.html", content: indexHtml });

  // File 20: vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`;
  files.push({ filename: "vite.config.ts", language: "typescript", path: "vite.config.ts", content: viteConfig });

  // File 21: README.md
  const readmeMd = `# ${name} - 3D Modern Portfolio

Generated standalone React + TypeScript + Three.js + Anime.js + GSAP + ActiveTheory 3D Physics portfolio application.

## Quick Start

1. Extract the downloaded ZIP folder.
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Launch development server:
\`\`\`bash
npm run dev
\`\`\`

Open your browser at \`http://localhost:5173\` to view your live 3D portfolio!
`;
  files.push({ filename: "README.md", language: "markdown", path: "README.md", content: readmeMd });

  return files;
}

export async function downloadPortfolioZip(portfolio: PortfolioObject | null, composition?: CompositionGraph | null) {
  const files = generatePortfolioCodeFiles(portfolio, composition);
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  const authorName = (portfolio?.personalInfo?.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, "-");
  link.href = url;
  link.download = `${authorName}-react-portfolio.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
