"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import type { ComposedMotion } from "@/server/ai/composition/types";

interface CompositionAnimatorProps {
  motion: ComposedMotion;
  children: React.ReactNode;
  className?: string;
}

function getMotionVariants(motionConfig: ComposedMotion): Variants {
  const intensity = motionConfig.intensity;
  const style = motionConfig.style;

  if (intensity === "none" || style === "none") {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }

  if (style === "apple" || style === "minimal" || intensity === "subtle") {
    return {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    };
  }

  if (style === "editorial" || style === "scroll-storytelling") {
    return {
      hidden: { opacity: 0, y: 40, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      },
    };
  }

  if (style === "gsap-heavy" || style === "parallax" || intensity === "heavy") {
    return {
      hidden: { opacity: 0, y: 60, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 },
      },
    };
  }

  if (style === "physics") {
    return {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      },
    };
  }

  if (style === "3d") {
    return {
      hidden: { opacity: 0, rotateX: 15, y: 30 },
      visible: {
        opacity: 1,
        rotateX: 0,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
      },
    };
  }

  if (style === "experimental") {
    return {
      hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
      },
    };
  }

  if (style === "micro-interactions") {
    return {
      hidden: { opacity: 0, x: -10 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    };
  }

  // Default: moderate
  return {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };
}

export function CompositionAnimator({ motion: motionConfig, children, className }: CompositionAnimatorProps) {
  const variants = getMotionVariants(motionConfig);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HeroAnimatorProps {
  motion: ComposedMotion;
  children: React.ReactNode;
  className?: string;
}

export function HeroAnimator({ motion: motionConfig, children, className }: HeroAnimatorProps) {
  const heroConfig = motionConfig.hero;

  const getHeroVariants = (): Variants => {
    if (motionConfig.intensity === "none") {
      return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
    }

    if (heroConfig.type === "typewriter") {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.5, staggerChildren: 0.05 },
        },
      };
    }

    if (heroConfig.type === "parallax") {
      return {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        },
      };
    }

    if (heroConfig.type === "3d-rotation") {
      return {
        hidden: { opacity: 0, rotateY: -10, x: -30 },
        visible: {
          opacity: 1,
          rotateY: 0,
          x: 0,
          transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1] },
        },
      };
    }

    if (heroConfig.type === "stagger") {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
      };
    }

    // Default hero animation
    return {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getHeroVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CardAnimatorProps {
  motion: ComposedMotion;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function CardAnimator({ motion: motionConfig, children, className, delay = 0 }: CardAnimatorProps) {
  if (motionConfig.intensity === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  motion: ComposedMotion;
  children: React.ReactNode;
  className?: string;
}

export function StaggerChildren({ motion: motionConfig, children, className }: StaggerChildrenProps) {
  if (motionConfig.intensity === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: motionConfig.intensity === "heavy" ? 0.12 : 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
