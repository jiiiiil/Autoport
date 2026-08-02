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
            Ready to build your portfolio?
          </h2>
          <p className="text-text-secondary text-base max-w-md mx-auto mb-8">
            Upload your LinkedIn Resume PDF and let the Resume Intelligence Engine
            craft a premium portfolio — no writing required.
          </p>
          <Link href="/upload">
            <Button size="lg">
              Upload Your Resume
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
