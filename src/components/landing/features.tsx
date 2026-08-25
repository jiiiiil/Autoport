"use client";

import { FadeIn } from "@/components/common/fade-in";
import { Layers, Sparkles, Palette, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description:
      "Our AI analyzes your work and creates the perfect layout tailored to your style and industry.",
    accent: "from-primary to-accent",
    iconColor: "text-white",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    description:
      "Choose from dozens of professionally designed themes or let AI create one just for you.",
    accent: "from-accent to-primary",
    iconColor: "text-white",
  },
  {
    icon: Layers,
    title: "Smart Sections",
    description:
      "Automatically organize your projects, skills, and experience into beautiful sections.",
    accent: "from-primary to-secondary",
    iconColor: "text-white",
  },
  {
    icon: Zap,
    title: "One-Click Deploy",
    description:
      "Publish your portfolio instantly with a single click. Free hosting included.",
    accent: "from-accent to-warning",
    iconColor: "text-white",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full bg-bg py-24 md:py-32 relative overflow-hidden">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-text-primary max-w-2xl font-semibold">
              Powerful features to help you create the perfect portfolio
            </p>
          </motion.div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={0.1 * i} y={30}>
              <div className="group relative">
                <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center shadow-lg shadow-primary/25`}>
                        <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-text-primary text-sm leading-relaxed mb-4 font-medium">
                      {feature.description}
                    </p>

               
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <FadeIn delay={0.5} y={30}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                  Ready to get started?
                </h3>
                <p className="text-text-primary mb-6 font-semibold">
                  Join thousands of professionals who have already created stunning portfolios with our AI-powered platform.
                </p>
                <Link href="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent text-on-primary font-semibold px-8 py-4 rounded-xl shadow-lg shadow-primary/25 transition-all"
                  >
                    Start Free Today
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </motion.button>
                </Link>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
