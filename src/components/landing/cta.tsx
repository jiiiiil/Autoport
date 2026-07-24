"use client";

import Link from "next/link";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="w-full bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Ready to get started?
          </h2>
          <p className="text-text-secondary text-base max-w-md mx-auto mb-8">
            Join thousands of professionals who have transformed their portfolios
            with AI.
          </p>
          <Link href="/prompt">
            <Button size="lg">
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
