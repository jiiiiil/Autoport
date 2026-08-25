"use client";

import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-bg min-h-screen flex items-center">
      {/* Static Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/8 via-accent/3 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-accent/6 via-primary/3 to-transparent rounded-full blur-2xl" />
      </div>


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-8 max-w-xl">
            <FadeIn delay={0.1} y={20}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary"
              >
                <Sparkles className="w-4 h-4" />
                Resume Intelligence Engine
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.2} y={20}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-text-primary">
                <span className="gradient-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Upload your resume.
                </span>
                <br />
                <span className="text-text-primary font-semibold">Get a portfolio.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} y={20}>
              <p className="text-text-primary text-lg md:text-xl leading-relaxed max-w-lg font-semibold">
                No prompts. No forms. Drop your LinkedIn Resume PDF, pick a theme
                and animation level — our AI builds a premium portfolio automatically.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} y={20}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent text-on-primary font-semibold shadow-lg shadow-primary/25"
                    >
                      Upload Resume
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/#features">
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="text-text-primary hover:text-text-primary hover:bg-black/5 border border-black/10"
                    >
                      Learn more
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} y={20}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm text-text-primary font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Free to start</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn
            delay={0.3}
            y={30}
            className="hidden lg:flex justify-end items-center relative"
          >
            <div className="relative">
              {/* Glass Card Mockup */}
              <div className="glass-strong rounded-3xl p-8 w-[400px] h-[500px] flex flex-col gap-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Portfolio Preview</div>
                    <div className="text-white/70 text-xs font-medium">Generating...</div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="h-24 rounded-xl bg-black/20" />
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-white/10 w-3/4" />
                    <div className="h-3 rounded-full bg-white/10 w-1/2" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-white/10 w-full" />
                    <div className="h-3 rounded-full bg-white/10 w-5/6" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-xl bg-white/5" />
                    <div className="h-20 rounded-xl bg-white/5" />
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-medium">Progress</span>
                    <span className="text-primary text-xs font-bold">85%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>

              {/* Static Floating Elements */}
              <div className="absolute -top-8 -right-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>

              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl">
                <div className="w-8 h-8 rounded-full bg-primary/50" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
