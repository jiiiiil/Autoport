"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SkyBirds({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bird1Ref = useRef<HTMLDivElement>(null);
  const bird2Ref = useRef<HTMLDivElement>(null);
  const landingBirdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Continuous random flight trajectories across sky
    const flyBird = (birdEl: HTMLDivElement | null, delay: number = 0) => {
      if (!birdEl) return;

      const startY = Math.random() * 40 + 10; // 10% to 50% top
      const endY = Math.random() * 50 + 10;
      const duration = 16 + Math.random() * 8;

      gsap.fromTo(
        birdEl,
        {
          x: "-10vw",
          y: `${startY}vh`,
          scale: 0.6 + Math.random() * 0.4,
          opacity: 0,
        },
        {
          x: "110vw",
          y: `${endY}vh`,
          opacity: 0.85,
          duration: duration,
          delay: delay,
          ease: "sine.inOut",
          onComplete: () => {
            flyBird(birdEl, Math.random() * 10 + 5);
          },
        }
      );
    };

    flyBird(bird1Ref.current, 1);
    flyBird(bird2Ref.current, 8);

    // 2. Observer for Card Landing Trigger (cards with data-bird-target="true")
    const landingBird = landingBirdRef.current;
    if (!landingBird) return;

    let isLandingActive = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLandingActive) {
            const targetEl = entry.target as HTMLElement;
            if (targetEl.getAttribute("data-bird-landed") === "true") return;

            targetEl.setAttribute("data-bird-landed", "true");
            isLandingActive = true;

            const rect = targetEl.getBoundingClientRect();
            const landX = rect.left + rect.width / 2;
            const landY = rect.top + window.scrollY - 15;

            // GSAP Sequence: Swoop down -> Land & Sit 0.8s -> Fly away
            const tl = gsap.timeline({
              onComplete: () => {
                isLandingActive = false;
                gsap.set(landingBird, { opacity: 0 });
              },
            });

            tl.fromTo(
              landingBird,
              {
                x: landX - 250,
                y: landY - 180,
                scale: 1.2,
                opacity: 0,
                rotate: 15,
              },
              {
                x: landX,
                y: landY,
                scale: 0.85,
                opacity: 1,
                rotate: 0,
                duration: 1.2,
                ease: "power2.out",
              }
            )
              // Land & pause brief rest (0.8 sec)
              .to(landingBird, {
                y: landY + 2,
                duration: 0.8,
                ease: "sine.inOut",
              })
              // Fly back up into sky
              .to(landingBird, {
                x: landX + 300,
                y: landY - 250,
                scale: 1.1,
                opacity: 0,
                rotate: -20,
                duration: 1.4,
                ease: "power1.in",
              });
          }
        });
      },
      { threshold: 0.3 }
    );

    // Find all card landing targets in document
    const targets = document.querySelectorAll("[data-bird-target='true']");
    targets.forEach((t) => observer.observe(t));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`sky-birds-layer fixed inset-0 pointer-events-none z-20 overflow-hidden ${className}`}
    >
      {/* Flight Bird 1 */}
      <div ref={bird1Ref} className="absolute opacity-0">
        <SvgBird className="w-10 h-7 text-sky-800" animateSpeed={0.5} />
      </div>

      {/* Flight Bird 2 */}
      <div ref={bird2Ref} className="absolute opacity-0">
        <SvgBird className="w-8 h-6 text-slate-700" animateSpeed={0.4} />
      </div>

      {/* Landing Bird (Swoops down & rests on cards) */}
      <div ref={landingBirdRef} className="absolute opacity-0 z-30">
        <SvgBird className="w-11 h-8 text-sky-900 drop-shadow-md" animateSpeed={0.3} />
      </div>
    </div>
  );
}

function SvgBird({ className = "", animateSpeed = 0.5 }: { className?: string; animateSpeed?: number }) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: `bird-wing-flap ${animateSpeed}s ease-in-out infinite alternate`,
      }}
    >
      {/* Simplified Anime Wing SVG Path */}
      <path d="M0 20 Q15 0 30 18 Q45 0 60 20 Q40 25 30 22 Q20 25 0 20 Z" />
      <style jsx global>{`
        @keyframes bird-wing-flap {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.4) translateY(3px); }
        }
      `}</style>
    </svg>
  );
}

export default SkyBirds;
