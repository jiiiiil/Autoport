"use client";

import { FeatureCard } from "./feature-card";
import { FadeIn } from "@/components/common/fade-in";
import { Layers, Code2, Palette } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Atmospheric Depth",
    description:
      "Multi-layered design with subtle depth that draws attention without overwhelming your content.",
  },
  {
    icon: Code2,
    title: "Code-First DNA",
    description:
      "Every portfolio is built with clean, semantic code that developers and search engines love.",
  },
  {
    icon: Palette,
    title: "Adaptive Themes",
    description:
      "Intelligent theme system that adapts to your content and personal brand automatically.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {features.map((feature, i) => (
        <FadeIn key={feature.title} delay={0.3 + i * 0.1} y={20}>
          <FeatureCard
            icon={<feature.icon className="w-5 h-5 text-text-muted" />}
            title={feature.title}
            description={feature.description}
          />
        </FadeIn>
      ))}
    </div>
  );
}
