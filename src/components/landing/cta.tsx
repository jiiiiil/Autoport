"use client";

import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="w-full bg-bg py-24 md:py-32 relative overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-primary/8 via-accent/3 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-accent/6 via-primary/3 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-strong rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5" />
            
            {/* Static Border */}
            <div className="absolute inset-0 rounded-3xl opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent)",
                backgroundSize: "200% 200%",
              }}
            />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl shadow-primary/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
                Ready to build your
                <span className="gradient-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {" "}portfolio?
                </span>
              </h2>

              <p className="text-lg md:text-xl text-text-primary max-w-2xl font-semibold mb-8">
                Upload your LinkedIn Resume PDF and let the Resume Intelligence Engine
                craft a premium portfolio — no writing required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent text-on-primary font-semibold px-8 py-4 text-lg shadow-2xl shadow-primary/30"
                    >
                      Upload Your Resume
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-text-primary font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Instant generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-success" />
                  <span>Free to start</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
