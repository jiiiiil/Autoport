"use client";

import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FloatingCard } from "./floating-card";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="dot-pattern absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <FadeIn delay={0.1} y={15}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                AI-Powered Portfolio
              </span>
            </FadeIn>

            <FadeIn delay={0.2} y={15}>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-text-primary">
                Build Your Dream
                <br />
                Portfolio with AI
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} y={15}>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-md">
                Create stunning, personalized portfolio websites in minutes. Our
                AI understands your work and crafts the perfect presentation.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} y={15}>
              <div className="flex items-center gap-4 pt-2">
                <Link href="/prompt">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button variant="ghost" size="lg">
                    Learn more
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn
            delay={0.5}
            y={20}
            className="hidden lg:flex justify-end items-center"
          >
            <FloatingCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
