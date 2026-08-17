"use client";

import { FeatureCard } from "@/components/common/feature-card";
import { FadeIn } from "@/components/common/fade-in";
import { Layers, Brain, Gem } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Zero Templates",
    description:
      "No pre-built templates. Every portfolio is generated from scratch based on your unique prompt and style.",
  },
  {
    icon: Brain,
    title: "Semantic Intelligence",
    description:
      "AI understands your content contextually, placing projects and skills where they make the most impact.",
  },
  {
    icon: Gem,
    title: "High-End Craft",
    description:
      "Pixel-perfect spacing, premium typography, and refined details that rival top agency work.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {features.map((feature, i) => (
        <FadeIn key={feature.title} delay={0.5 + i * 0.1} y={20}>
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
