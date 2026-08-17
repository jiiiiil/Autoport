"use client";

import React, { useEffect, useRef } from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { SpatialObject } from "@/components/spatial/SpatialObject";
import { mapPortfolioToSpatialAssets } from "@/lib/spatial/visual-asset-mapper";
import { ArrowRight, Mail, MapPin, ExternalLink, Globe, GraduationCap, Award, Briefcase, Code } from "lucide-react";
import { AnimeThreeCanvas } from "./interactive/anime-three-canvas";
import { GBAfterlifeBackground } from "./interactive/gb-afterlife-canvas";

interface SpatialPortfolioRendererProps {
  portfolio: PortfolioObject;
  className?: string;
}

export function SpatialPortfolioRenderer({ portfolio, className = "" }: SpatialPortfolioRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Profile Info extracted strictly from PDF (Single Source of Truth)
  const name = portfolio.personalInfo?.name ?? "Developer";
  const nameWords = name.toUpperCase().split(" ");
  const firstName = nameWords[0] ?? "PORTFOLIO";
  const lastName = nameWords.slice(1).join(" ");
  const role = portfolio.personalInfo?.role ?? "Software Engineer & Architect";
  const tagline = portfolio.personalInfo?.tagline ?? "Building high-performance digital experiences.";
  const location = portfolio.sections?.contact?.location ?? portfolio.personalInfo?.location ?? "Surat, Gujarat, India";
  const email = portfolio.sections?.contact?.email ?? portfolio.personalInfo?.email ?? "contact@example.com";

  const skills = portfolio.sections?.skills ?? [
    { name: "React.js", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "TypeScript", category: "Language" },
  ];

  const experience = portfolio.sections?.experience ?? [];
  const education = portfolio.sections?.education ?? [];
  const certifications = portfolio.sections?.certifications ?? [];
  const socialLinks = portfolio.sections?.socialLinks ?? [];

  const spatialScene = mapPortfolioToSpatialAssets(portfolio);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen bg-[#050508] text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black ${className}`}
    >
      {/* Shared 3D Spatial Canvas Background */}
      <AnimeThreeCanvas />
      <GBAfterlifeBackground />

      {/* Top Editorial Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase">
            {firstName} <span className="text-cyan-400">{lastName}</span>
          </span>
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/05 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
          >
            <span>Let's Connect</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 space-y-32 sm:space-y-48 pt-12 pb-32">
        {/* FRAME 01: HERO SCENE */}
        <section id="hero" className="min-h-[88vh] flex flex-col justify-between relative py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Available for Hire</span>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{location}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-[clamp(3.5rem,11vw,10.5rem)] font-black tracking-tighter leading-[0.92] text-white uppercase font-sans">
                <div>{firstName}</div>
                {lastName && <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400">{lastName}</div>}
              </h1>

              <p className="text-lg sm:text-2xl font-bold text-slate-300 max-w-2xl leading-relaxed tracking-tight">
                {role}
              </p>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                {tagline}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#experience"
                  className="px-8 py-4 rounded-full bg-white text-black hover:bg-cyan-400 hover:text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  Explore Spatial Journey
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center items-center relative">
              <SpatialObject assetId="developer-idle" label={name} scale={1.1} />
              <div className="absolute -top-6 -right-6 hidden xl:block">
                <SpatialObject assetId="react" scale={0.9} parallaxSpeed={1.5} />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden xl:block">
                <SpatialObject assetId="codepanel" scale={0.85} parallaxSpeed={0.8} />
              </div>
            </div>
          </div>
        </section>

        {/* FRAME 02: LOCATION & STATEMENT */}
        <section id="location" className="py-16 border-t border-white/10 relative">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Based In & Operating Worldwide
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter leading-[0.95] text-white uppercase">
              {location}
            </h2>
          </div>
        </section>

        {/* FRAME 03: ABOUT VISUAL STATEMENTS */}
        {portfolio.sections?.about?.content && (
          <section id="about" className="py-16 border-t border-white/10 space-y-12">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
              <Code className="w-4 h-4" />
              <span>Philosophy & Story</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                  {portfolio.sections.about.title || "Background"}
                </h3>
                <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-medium">
                  {portfolio.sections.about.content}
                </p>
              </div>

              <div className="lg:col-span-4 p-8 rounded-3xl bg-white/05 border border-white/10 backdrop-blur-xl space-y-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  Engineering Standards
                </h4>
                <div className="space-y-4 text-sm font-bold text-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>RESPONSIVE & ADAPTIVE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>HIGH PERFORMANCE STACK</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>CLEAN ARCHITECTURE</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FRAME 04 & 05: EXPERIENCE TIMELINE */}
        {experience.length > 0 && (
          <section id="experience" className="py-16 border-t border-white/10 space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  Career Journey
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mt-1">
                  Work Experience
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {experience.map((exp, i) => (
                <div
                  key={i}
                  className="group relative p-8 sm:p-12 rounded-3xl bg-white/05 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{exp.role || exp.company}</h3>
                      <p className="text-sm font-bold text-cyan-400 mt-1">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-400/30">
                        {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : exp.current ? "– Present" : ""}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-base text-slate-300 leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-white/10 text-cyan-200 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FRAME 06: SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="py-16 border-t border-white/10 space-y-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Capabilities & Stack
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mt-1">
                I Work With
              </h2>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="px-6 py-4 rounded-2xl bg-white/05 border border-white/15 hover:border-cyan-400/60 backdrop-blur-xl transition-all duration-300 flex items-center gap-4 hover:scale-105"
                >
                  <SpatialObject assetId={skill.name.toLowerCase().includes("react") ? "react" : skill.name.toLowerCase().includes("node") ? "node" : skill.name.toLowerCase().includes("mongo") ? "mongodb" : "typescript"} scale={0.7} />
                  <div>
                    <h3 className="text-base font-bold text-white">{skill.name}</h3>
                    {skill.category && <p className="text-xs font-mono text-slate-400">{skill.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FRAME 07: EDUCATION */}
        {education.length > 0 && (
          <section id="education" className="py-16 border-t border-white/10 space-y-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Academic Background
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mt-1">
                Learning
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white/05 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl space-y-4"
                >
                  <SpatialObject assetId="graduation" scale={0.8} />
                  <h3 className="text-xl font-bold text-white">{edu.degree || edu.institution}</h3>
                  <p className="text-sm font-bold text-cyan-400">{edu.institution}</p>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs font-mono text-slate-400 block">
                      {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FRAME 08: CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section id="certifications" className="py-16 border-t border-white/10 space-y-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                Credentials & Verification
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mt-1">
                Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/05 border border-white/10 hover:border-amber-400/50 backdrop-blur-xl space-y-3"
                >
                  <SpatialObject assetId="certificate" scale={0.7} />
                  <h3 className="text-base font-bold text-white">{cert.name}</h3>
                  {cert.issuer && <p className="text-xs font-bold text-amber-400">{cert.issuer}</p>}
                  {cert.date && <span className="text-[11px] font-mono text-slate-400 block">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FRAME 09 & 10: CONTACT & FINAL */}
        <section id="contact" className="py-20 border-t border-white/10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Let's Connect
            </span>
            <h2 className="text-[clamp(3rem,8vw,7.5rem)] font-black tracking-tighter leading-[0.95] text-white uppercase">
              LET'S BUILD SOMETHING.
            </h2>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-400 text-black hover:bg-white font-black text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-white/10 py-10 text-center text-xs font-mono text-slate-500">
        &copy; {new Date().getFullYear()} {name} — AiPort Spatial 3D Portfolio Engine
      </footer>
    </div>
  );
}
