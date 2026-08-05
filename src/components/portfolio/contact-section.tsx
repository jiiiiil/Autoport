"use client";

import React, { useState } from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { Mail, MapPin, Send, User, MessageSquare } from "lucide-react";
import {
  NeumorphicCard,
  NeumorphicInput,
  NeumorphicTextarea,
  NeumorphicButton,
  NeumorphicCheckbox,
  NeumorphicToggle,
} from "@/components/ui/neumorphism";

export function ContactSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const contact = portfolio.sections?.contact;
  const email = contact?.email || portfolio.personalInfo?.email || "contact@example.com";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [subscribe, setSubscribe] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 md:py-24">
      <NeumorphicCard variant="glowing" className="p-8 md:p-14 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#f8fafc)] tracking-tight mt-1 mb-3">
            Let's Build Something Exceptional
          </h2>
          <p className="text-sm text-[var(--p-text-secondary,#e2e8f0)] leading-relaxed">
            {contact?.availableFor
              ? `Available for: ${contact.availableFor}`
              : "Have a project in mind, a question, or a business inquiry? Send a message directly below."}
          </p>
        </div>

        {submitted ? (
          <NeumorphicCard variant="inset" className="p-8 text-center text-[var(--p-primary,#00f0ff)] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--p-primary,#00f0ff)]/20 mx-auto flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-[var(--p-text,#f8fafc)]">Message Delivered!</h3>
            <p className="text-xs text-[var(--p-text-muted,#818cf8)]">Thank you for reaching out. I'll get back to you shortly.</p>
          </NeumorphicCard>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--p-text-secondary,#cbd5e1)]">Your Name</label>
                <NeumorphicInput
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--p-text-secondary,#cbd5e1)]">Your Email</label>
                <NeumorphicInput
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--p-text-secondary,#cbd5e1)] font-mono">Message</label>
              <NeumorphicTextarea
                rows={4}
                placeholder="Tell me about your project or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <NeumorphicCheckbox
                checked={subscribe}
                onChange={setSubscribe}
                label="Send a copy to my email address"
              />
              <NeumorphicToggle
                checked={urgent}
                onChange={setUrgent}
                label="High Priority Request"
              />
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--p-border-subtle,rgba(255,255,255,0.06))]">
              <div className="flex items-center gap-3 text-xs text-[var(--p-text-muted,#818cf8)]">
                <Mail className="w-4 h-4 text-[var(--p-primary,#00f0ff)]" />
                <span>{email}</span>
                {contact?.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-4 h-4 text-[var(--p-accent,#ff007f)]" />
                    <span>{contact.location}</span>
                  </>
                )}
              </div>

              <NeumorphicButton type="submit" variant="glow" size="lg" icon={<Send className="w-4 h-4" />}>
                Send Message
              </NeumorphicButton>
            </div>
          </form>
        )}
      </NeumorphicCard>
    </section>
  );
}
