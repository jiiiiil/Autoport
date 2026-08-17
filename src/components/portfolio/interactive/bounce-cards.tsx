"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export interface BounceCardItem {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  badge?: string;
  tags?: string[];
  link?: string;
  content?: React.ReactNode;
}

export interface BounceCardsProps {
  className?: string;
  images?: string[];
  cards?: BounceCardItem[];
  containerWidth?: number | string;
  containerHeight?: number | string;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  onCardClick?: (index: number) => void;
}

export function BounceCards({
  className = "",
  images = [],
  cards = [],
  containerWidth = "100%",
  containerHeight = 300,
  animationDelay = 0.1,
  animationStagger = 0.05,
  easeType = "elastic.out(1, 0.6)",
  transformStyles = [
    "rotate(8deg) translate(-140px, 5px)",
    "rotate(4deg) translate(-70px, 0px)",
    "rotate(0deg) translate(0px, -4px)",
    "rotate(-4deg) translate(70px, 0px)",
    "rotate(-8deg) translate(140px, 5px)",
  ],
  enableHover = true,
  autoplay = true,
  autoplayDelay = 1000,
  onCardClick,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const autoIdxRef = useRef<number>(0);

  const items: BounceCardItem[] = cards.length > 0 ? cards : images.map((src, i) => ({ id: `img-${i}`, image: src }));
  const itemCount = items.length;

  useEffect(() => {
    if (!containerRef.current || itemCount === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
          duration: 0.6,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [itemCount, animationStagger, easeType, animationDelay]);

  const pushSiblings = (hoveredIdx: number) => {
    if (!containerRef.current) return;
    setActiveIdx(hoveredIdx);

    const q = gsap.utils.selector(containerRef);
    items.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      if (i === hoveredIdx) {
        // Center highlighted card smoothly
        gsap.to(selector, {
          transform: "rotate(0deg) translate(0px, 0px) scale(1.05)",
          zIndex: 60,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        // Subtle side push
        const offset = i < hoveredIdx ? -100 - (hoveredIdx - i - 1) * 35 : 100 + (i - hoveredIdx - 1) * 35;
        const rotateDeg = i < hoveredIdx ? -6 : 6;

        gsap.to(selector, {
          transform: `rotate(${rotateDeg}deg) translate(${offset}px, 0px) scale(0.96)`,
          zIndex: 10 + i,
          duration: 0.35,
          ease: "power2.out",
          delay: Math.abs(hoveredIdx - i) * 0.02,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!containerRef.current) return;
    setActiveIdx(null);

    const q = gsap.utils.selector(containerRef);
    items.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i % transformStyles.length] || "none";
      gsap.to(selector, {
        transform: baseTransform,
        zIndex: 10 + i,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  // 1-second automatic move / cycle animation effect
  useEffect(() => {
    if (!autoplay || itemCount <= 1 || isUserHovering) return;

    const timer = setInterval(() => {
      autoIdxRef.current = (autoIdxRef.current + 1) % itemCount;
      pushSiblings(autoIdxRef.current);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, itemCount, isUserHovering]);

  const handleContainerMouseEnter = () => {
    setIsUserHovering(true);
  };

  const handleContainerMouseLeave = () => {
    setIsUserHovering(false);
    resetSiblings();
  };

  const handleCardClick = (idx: number) => {
    autoIdxRef.current = idx;
    pushSiblings(idx);
    if (onCardClick) onCardClick(idx);
  };

  return (
    <div
      className={`bounceCardsContainer relative flex items-center justify-center mx-auto overflow-visible py-6 ${className}`}
      style={{
        width: typeof containerWidth === "number" ? `${containerWidth}px` : containerWidth,
        height: typeof containerHeight === "number" ? `${containerHeight}px` : containerHeight,
      }}
      ref={containerRef}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {items.map((item, idx) => {
        const baseTransform = transformStyles[idx % transformStyles.length] || "none";
        const isActive = activeIdx === idx;

        return (
          <div
            key={item.id || idx}
            className={`card card-${idx} absolute w-[200px] sm:w-[220px] h-[200px] sm:h-[220px] aspect-square border-8 border-white rounded-[30px] overflow-hidden bg-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] flex flex-col justify-between p-4 cursor-pointer select-none transition-shadow duration-300 ${
              isActive ? "shadow-[0_20px_50px_rgba(14,165,233,0.35)] ring-4 ring-sky-400" : "hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
            } z-${10 + idx}`}
            style={{
              transform: baseTransform,
              willChange: "transform",
            }}
            onMouseEnter={() => {
              autoIdxRef.current = idx;
              pushSiblings(idx);
            }}
            onClick={() => handleCardClick(idx)}
          >
            {item.content ? (
              item.content
            ) : item.image ? (
              <img className="w-full h-full object-cover rounded-2xl" src={item.image} alt={item.title || `card-${idx}`} />
            ) : (
              <div className="flex flex-col justify-between h-full space-y-2">
                <div className="flex items-center justify-between">
                  {item.badge && (
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-900 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                </div>
                <div>
                  <h4 className="font-black text-slate-950 text-base sm:text-lg leading-tight truncate tracking-tight">{item.title}</h4>
                  {item.subtitle && <p className="text-xs text-sky-700 font-extrabold mt-0.5 truncate">{item.subtitle}</p>}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed font-bold">
                    {item.description}
                  </p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] bg-slate-200 text-slate-950 px-2 py-0.5 rounded-md font-mono font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BounceCards;
