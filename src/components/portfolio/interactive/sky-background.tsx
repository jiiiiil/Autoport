"use client";

import React, { useEffect, useRef, useState } from "react";

export function SkyBackground({ className = "" }: { className?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`sky-background-root fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(180deg, #9EDCFF 0%, #BFE9FF 35%, #E9F7FF 70%, #FFFDF6 100%)",
      }}
    >
      {/* 1. Breathing Sun & Rotating Rays */}
      <div
        className="absolute top-8 right-[15%] w-72 h-72 rounded-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
        }}
      >
        {/* Sun Glow Core */}
        <div className="w-full h-full rounded-full bg-radial from-amber-100 via-sky-100/80 to-transparent blur-2xl animate-sun-pulse opacity-90" />
        
        {/* Sun Disk */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-tr from-amber-50 via-white to-amber-100 shadow-[0_0_80px_rgba(255,255,255,0.9)] opacity-95" />

        {/* Rotating Sun Rays */}
        <svg
          className="absolute inset-0 w-full h-full opacity-05 animate-sun-rays-rotate"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((i * Math.PI) / 6)}
              y2={100 + 90 * Math.sin((i * Math.PI) / 6)}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
          ))}
        </svg>
      </div>

      {/* 2. Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => {
          const left = (i * 17) % 100;
          const top = (i * 23) % 100;
          const duration = 12 + (i % 8);
          const delay = (i % 5) * 1.5;
          const size = 3 + (i % 4);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-particle-float opacity-10"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                filter: "blur(1px)",
              }}
            />
          );
        })}
      </div>

      {/* 3. Anime Cloud Layers (Real DOM SVG Blobs) */}
      {/* Cloud Layer 1 (Far): Opacity 0.25, Blur 8px, Scale 1.4, Speed 3px/sec */}
      <div
        className="absolute inset-0 pointer-events-none animate-cloud-drift-slow animate-breeze"
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          opacity: 0.25,
          filter: "blur(8px)",
        }}
      >
        <CloudSvgSet scale={1.4} topOffset="10%" />
      </div>

      {/* Cloud Layer 2 (Mid): Opacity 0.45, Blur 3px, Scale 1.0, Speed 6px/sec */}
      <div
        className="absolute inset-0 pointer-events-none animate-cloud-drift-mid animate-breeze-reverse"
        style={{
          transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 0)`,
          opacity: 0.45,
          filter: "blur(3px)",
        }}
      >
        <CloudSvgSet scale={1.0} topOffset="30%" />
      </div>

      {/* Cloud Layer 3 (Near): Opacity 0.18, Blur 12px, Scale 2.0, Speed 10px/sec */}
      <div
        className="absolute inset-0 pointer-events-none animate-cloud-drift-fast animate-breeze"
        style={{
          transform: `translate3d(${mousePos.x * 1.0}px, ${mousePos.y * 1.0}px, 0)`,
          opacity: 0.18,
          filter: "blur(12px)",
        }}
      >
        <CloudSvgSet scale={2.0} topOffset="55%" />
      </div>

      {/* Embedded CSS keyframes for cloud drift, sun pulse, breeze, and particles */}
      <style jsx global>{`
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.75; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes sun-rays-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cloud-drift {
          0% { transform: translateX(-40%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes breeze-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes breeze-float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.05; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.2; }
          100% { transform: translateY(-60px) translateX(-10px); opacity: 0.05; }
        }

        .animate-sun-pulse {
          animation: sun-pulse 6s ease-in-out infinite;
        }
        .animate-sun-rays-rotate {
          animation: sun-rays-rotate 45s linear infinite;
        }
        .animate-cloud-drift-slow {
          animation: cloud-drift 70s linear infinite;
          will-change: transform;
        }
        .animate-cloud-drift-mid {
          animation: cloud-drift 40s linear infinite;
          will-change: transform;
        }
        .animate-cloud-drift-fast {
          animation: cloud-drift 22s linear infinite;
          will-change: transform;
        }
        .animate-breeze {
          animation: breeze-float 8s ease-in-out infinite;
        }
        .animate-breeze-reverse {
          animation: breeze-float-reverse 8s ease-in-out infinite;
        }
        .animate-particle-float {
          animation: particle-float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CloudSvgSet({ scale = 1, topOffset = "20%" }: { scale?: number; topOffset?: string }) {
  return (
    <div
      className="absolute left-0 w-[200vw] flex items-center justify-between"
      style={{ top: topOffset, transform: `scale(${scale})` }}
    >
      <CloudShape className="w-80 h-40 text-white" />
      <CloudShape className="w-96 h-48 text-sky-50/90" />
      <CloudShape className="w-72 h-36 text-white/95" />
      <CloudShape className="w-88 h-44 text-sky-100/80" />
    </div>
  );
}

function CloudShape({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 130 C20 130 0 110 0 85 C0 65 15 48 35 45 C45 20 70 5 98 5 C125 5 148 20 158 43 C168 30 185 20 205 20 C235 20 260 42 265 70 C285 70 305 85 305 105 C305 125 285 130 265 130 Z" />
    </svg>
  );
}

export function CloudWaveDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none z-10 relative ${className}`}>
      <svg
        className="relative block w-full h-12 text-white/60"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default SkyBackground;
