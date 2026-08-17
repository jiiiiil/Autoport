"use client";

import { FadeIn } from "@/components/common/fade-in";
import { Layers, Sparkles, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description:
      "Our AI analyzes your work and creates the perfect layout tailored to your style and industry.",
    accent: "bg-accent",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    description:
      "Choose from dozens of professionally designed themes or let AI create one just for you.",
    accent: "bg-primary",
  },
  {
    icon: Layers,
    title: "Smart Sections",
    description:
      "Automatically organize your projects, skills, and experience into beautiful sections.",
    accent: "bg-emerald-400",
  },
  {
    icon: Zap,
    title: "One-Click Deploy",
    description:
      "Publish your portfolio instantly with a single click. Free hosting included.",
    accent: "bg-amber-400",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
            Everything you need
          </h2>
          <p className="mt-3 text-text-secondary text-base max-w-lg mx-auto">
            Powerful features to help you create the perfect portfolio
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={0.1 * i} y={20}>
              <div className="group rounded-xl border border-border bg-bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-border-light">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${feature.accent}/10`}
                  >
                    <feature.icon
                      className={`w-4.5 h-4.5 ${feature.accent === "bg-accent" ? "text-accent" : feature.accent === "bg-primary" ? "text-primary" : feature.accent === "bg-emerald-400" ? "text-emerald-400" : "text-amber-400"}`}
                    />
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${feature.accent}`} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-text-primary mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
