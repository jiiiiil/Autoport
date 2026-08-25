"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { PortfolioObject } from "@/lib/portfolio/types";

const BG = "#0A0A0A";
const SURFACE = "#121014";
const TEXT = "#D7E2EA";

const NBSP = String.fromCharCode(160);
const CURLY_APOSTROPHE = String.fromCharCode(8217);

const PORTRAIT_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";
const DECOR_MOON_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png";
const DECOR_OBJECT_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png";
const DECOR_LEGO_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png";
const DECOR_GROUP_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png";

/* Static, locally hosted abstract covers — valid for any project, pure dark palette */
const PROJECT_COVERS = [
  "/covers/c3d-project-01.svg",
  "/covers/c3d-project-02.svg",
  "/covers/c3d-project-03.svg",
  "/covers/c3d-project-04.svg",
  "/covers/c3d-project-05.svg",
  "/covers/c3d-project-06.svg",
];

const DEFAULT_ABOUT_TEXT =
  "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

interface CreatorService {
  number: string;
  name: string;
  description: string;
}

interface CreatorProject {
  category: string;
  name: string;
  description?: string;
  images: string[];
  link: string;
}

interface CreatorExperience {
  role: string;
  company: string;
  span: string;
  description?: string;
  highlights: string[];
}

interface CreatorEducation {
  degree: string;
  institution: string;
  span: string;
  description?: string;
}

interface CreatorRecognition {
  title: string;
  meta: string;
  description?: string;
}

/* ------------------------------ Primitives ------------------------------ */

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className,
  style,
}: {
  children?: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}) {
  const MotionEl = useMemo(() => motion.create(as as never) as React.ElementType, [as]);
  return (
    <MotionEl
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionEl>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn y={40}>
      <h2
        className="hero-heading text-center font-black uppercase leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        {children}
      </h2>
    </FadeIn>
  );
}

function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
}: {
  children?: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const withinX = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding;
      const withinY = e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding;
      if (withinX && withinY) {
        setActive(true);
        setOffset({ x: (e.clientX - centerX) / strength, y: (e.clientY - centerY) / strength });
      } else if (active) {
        setActive(false);
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength, active]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: "translate3d(" + offset.x + "px, " + offset.y + "px, 0)",
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

function AnimatedChar({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0 }}>{char === " " ? NBSP : char}</span>
      <motion.span style={{ position: "absolute", left: 0, top: 0, opacity }} aria-hidden="true">
        {char === " " ? NBSP : char}
      </motion.span>
    </span>
  );
}

function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = Array.from(text);

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = Math.min(1, start + 1 / chars.length);
        return <AnimatedChar key={i} char={char} progress={scrollYProgress} range={[start, end]} />;
      })}
    </p>
  );
}

/**
 * Auto-fit heading — scales the font so the full name always fits the viewport
 * width, no matter how long the LinkedIn name is.
 */
function FitHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [fontPx, setFontPx] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let cancelled = false;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent || cancelled) return;
      const prevSize = el.style.fontSize;
      el.style.fontSize = "100px";
      const naturalWidth = el.scrollWidth || 1;
      const available = parent.clientWidth;
      el.style.fontSize = prevSize;
      const capPx = Math.min(window.innerWidth * 0.175, 300);
      setFontPx(Math.max(28, Math.min((available / naturalWidth) * 100, capPx)));
    };

    const scheduleFit = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        fit();
      });
    };

    fit();
    window.addEventListener("resize", scheduleFit);
    const timeout = window.setTimeout(fit, 350);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => fit()).catch(() => {});
    }
    return () => {
      cancelled = true;
      window.removeEventListener("resize", scheduleFit);
      window.clearTimeout(timeout);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [text]);

  const initialGuess = "min(17.5vw, " + Math.round((92 / Math.max(text.length, 6)) * 1.55 * 100) / 100 + "vw)";

  return (
    <h1
      ref={ref}
      className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap"
      style={{ fontSize: fontPx ? fontPx + "px" : initialGuess }}
    >
      {text}
    </h1>
  );
}

function ContactButton({ href = "#contact", label = "Contact Me" }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      className="inline-block rounded-full font-medium uppercase tracking-widest text-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
        outline: "2px solid #FFFFFF",
        outlineOffset: "-3px",
      }}
    >
      {label}
    </a>
  );
}

function LiveProjectButton({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 hover:bg-[#D7E2EA]/10 transition-colors duration-200 whitespace-nowrap"
    >
      Live Project
    </a>
  );
}

/* ------------------------------- Sections ------------------------------- */

function HeroSection({
  name,
  contactHref,
  showServices,
  showProjects,
}: {
  name: string;
  contactHref: string;
  showServices: boolean;
  showProjects: boolean;
}) {
  const links = [
    { label: "About", href: "#about" },
    ...(showServices ? [{ label: "Services", href: "#services" }] : []),
    ...(showProjects ? [{ label: "Projects", href: "#projects" }] : []),
    { label: "Contact", href: contactHref },
  ];

  return (
    <section className="relative h-screen flex flex-col w-full" style={{ overflowX: "clip", background: BG }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex flex-wrap justify-center sm:justify-between items-center gap-x-5 sm:gap-x-6 gap-y-2 px-6 md:px-10 pt-6 md:pt-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200 text-sm md:text-lg lg:text-[1.4rem]"
              style={{ color: TEXT }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden w-full">
        <FadeIn delay={0.15} y={40}>
          <div className="mt-8 sm:mt-6 md:mt-2 flex justify-center">
            <FitHeading text={"Hi, i" + CURLY_APOSTROPHE + "m " + name} />
          </div>
        </FadeIn>
      </div>

      <div className="flex justify-end items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 mt-auto relative z-20">
        <FadeIn delay={0.5} y={20}>
          <ContactButton href={contactHref} />
        </FadeIn>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT_URL} alt={name} className="w-full h-auto block" draggable={false} />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}

/* Infinite skills marquee — row 1 drifts left, row 2 drifts right */
function SkillPill({ label, accent }: { label: string; accent: boolean }) {
  return (
    <span
      className="shrink-0 rounded-full uppercase tracking-wider font-medium whitespace-nowrap px-6 sm:px-8 py-3 sm:py-4"
      style={{
        color: TEXT,
        fontSize: "clamp(0.85rem, 1.5vw, 1.35rem)",
        border: "1.5px solid rgba(215, 226, 234, 0.22)",
        background: accent ? "rgba(182, 0, 168, 0.12)" : "rgba(215, 226, 234, 0.05)",
        boxShadow: accent ? "inset 0 0 18px rgba(182, 0, 168, 0.18)" : "none",
      }}
    >
      {label}
    </span>
  );
}

function SkillsMarqueeSection({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;

  const midpoint = Math.ceil(skills.length / 2);
  const baseRows = [skills.slice(0, midpoint), skills.slice(midpoint)];
  if (baseRows[1].length === 0 && baseRows[0].length > 1) {
    baseRows[1] = baseRows[0].slice(0, Math.ceil(baseRows[0].length / 2));
  }

  return (
    <section className="pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 overflow-hidden" style={{ background: BG }}>
      <div className="flex flex-col gap-4 sm:gap-5">
        {baseRows.map((row, rowIndex) => {
          const repeats = Math.ceil(10 / Math.max(row.length, 1));
          const loop = Array.from({ length: Math.max(repeats, 2) }, () => row).flat();
          return (
            <div key={"marquee-row-" + rowIndex} className="c3d-marquee-track" style={{ animationName: rowIndex % 2 === 0 ? "c3d-marquee-left" : "c3d-marquee-right", animationDuration: rowIndex % 2 === 0 ? "46s" : "52s" }}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex gap-3 sm:gap-4 pr-3 sm:pr-4 shrink-0" aria-hidden={copy === 1}>
                  {loop.map((skill, i) => (
                    <SkillPill key={copy + "-" + skill + "-" + i} label={skill} accent={i % 3 === 1} />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AboutSection({ aboutText, contactHref }: { aboutText: string; contactHref: string }) {
  const decorations = [
    {
      src: DECOR_MOON_URL,
      alt: "Moon icon",
      className: "top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
      delay: 0.1,
      x: -80,
    },
    {
      src: DECOR_LEGO_URL,
      alt: "Lego icon",
      className: "top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
      delay: 0.15,
      x: 80,
    },
    {
      src: DECOR_OBJECT_URL,
      alt: "3D object",
      className: "bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]",
      delay: 0.25,
      x: -80,
    },
    {
      src: DECOR_GROUP_URL,
      alt: "3D group",
      className: "bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]",
      delay: 0.3,
      x: 80,
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ background: BG }}
    >
      {decorations.map((decor) => (
        <FadeIn key={decor.src} delay={decor.delay} x={decor.x} y={0} duration={0.9} className={"absolute pointer-events-none select-none " + decor.className}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={decor.src} alt={decor.alt} className="w-full h-auto" draggable={false} />
        </FadeIn>
      ))}

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 relative z-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <SectionHeading>About me</SectionHeading>

          <AnimatedText
            text={aboutText}
            className="font-medium text-center leading-relaxed max-w-[560px]"
            style={{ color: TEXT, fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
          />
        </div>

        <FadeIn delay={0.2} y={20}>
          <ContactButton href={contactHref} />
        </FadeIn>
      </div>
    </section>
  );
}

function ServicesSection({ services }: { services: CreatorService[] }) {
  if (services.length === 0) return null;

  return (
    <section
      id="services"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: SURFACE }}
    >
      <SectionHeading>Services</SectionHeading>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <div
              className={
                "flex items-start gap-6 sm:gap-10 md:gap-16 py-8 sm:py-10 md:py-12" +
                (i > 0 ? " border-t" : "")
              }
              style={{ borderColor: "rgba(215, 226, 234, 0.15)" }}
            >
              <span
                className="font-black shrink-0"
                style={{
                  fontSize: "clamp(3rem, 10vw, 140px)",
                  lineHeight: 0.95,
                  background: "linear-gradient(180deg,#646973 0%,#BBCCD7 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {service.number}
              </span>
              <div className="pt-1 sm:pt-3 md:pt-5 min-w-0">
                <h3
                  className="font-medium uppercase"
                  style={{ color: TEXT, fontSize: "clamp(1rem, 2.2vw, 2.1rem)", lineHeight: 1.15 }}
                >
                  {service.name}
                </h3>
                {service.description ? (
                  <p
                    className="font-light leading-relaxed max-w-2xl mt-2 sm:mt-3"
                    style={{ color: TEXT, opacity: 0.55, fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                  >
                    {service.description}
                  </p>
                ) : null}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ experiences }: { experiences: CreatorExperience[] }) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: BG }}>
      <SectionHeading>Experience</SectionHeading>

      <div className="max-w-5xl mx-auto">
        {experiences.map((exp, i) => (
          <FadeIn key={exp.role + exp.company + i} delay={i * 0.08} y={30}>
            <div
              className={
                "py-8 sm:py-10 md:py-12 flex flex-col gap-4 sm:gap-6" +
                (i > 0 ? " border-t" : "")
              }
              style={{ borderColor: "rgba(215, 226, 234, 0.15)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3
                  className="font-medium uppercase"
                  style={{ color: TEXT, fontSize: "clamp(1.05rem, 2.4vw, 2.2rem)", lineHeight: 1.15 }}
                >
                  {exp.role}
                  {exp.company ? (
                    <span style={{ opacity: 0.55 }}> · {exp.company}</span>
                  ) : null}
                </h3>
                {exp.span ? (
                  <span
                    className="uppercase tracking-widest font-light shrink-0"
                    style={{ color: TEXT, opacity: 0.55, fontSize: "clamp(0.75rem, 1.3vw, 1.05rem)" }}
                  >
                    {exp.span}
                  </span>
                ) : null}
              </div>

              {exp.description ? (
                <p
                  className="font-light leading-relaxed max-w-3xl"
                  style={{ color: TEXT, opacity: 0.55, fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {exp.description}
                </p>
              ) : null}

              {exp.highlights.length > 0 ? (
                <ul className="flex flex-col gap-2 mt-1">
                  {exp.highlights.slice(0, 3).map((highlight, hi) => (
                    <li
                      key={hi}
                      className="flex items-start gap-3 font-light leading-relaxed"
                      style={{ color: TEXT, opacity: 0.55, fontSize: "clamp(0.85rem, 1.5vw, 1.15rem)" }}
                    >
                      <span aria-hidden="true" style={{ color: "#B600A8" }}>◆</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ education }: { education: CreatorEducation[] }) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: BG }}>
      <SectionHeading>Education</SectionHeading>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {education.map((edu, i) => (
          <FadeIn key={edu.institution + i} delay={i * 0.08} y={30}>
            <div
              className="h-full rounded-[28px] sm:rounded-[36px] p-7 sm:p-10 flex flex-col gap-3"
              style={{
                border: "1.5px solid rgba(215, 226, 234, 0.18)",
                background: "rgba(215, 226, 234, 0.03)",
              }}
            >
              {edu.span ? (
                <span
                  className="uppercase tracking-widest self-start rounded-full px-4 py-1.5"
                  style={{
                    color: TEXT,
                    opacity: 0.75,
                    fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
                    border: "1px solid rgba(215, 226, 234, 0.2)",
                  }}
                >
                  {edu.span}
                </span>
              ) : null}
              <h3
                className="font-medium uppercase leading-snug"
                style={{ color: TEXT, fontSize: "clamp(1rem, 2vw, 1.7rem)" }}
              >
                {edu.degree}
              </h3>
              <p
                className="uppercase tracking-wide font-light"
                style={{ color: TEXT, opacity: 0.6, fontSize: "clamp(0.85rem, 1.4vw, 1.15rem)" }}
              >
                {edu.institution}
              </p>
              {edu.description ? (
                <p
                  className="font-light leading-relaxed"
                  style={{ color: TEXT, opacity: 0.45, fontSize: "clamp(0.8rem, 1.3vw, 1.05rem)" }}
                >
                  {edu.description}
                </p>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function RecognitionSection({ recognitions }: { recognitions: CreatorRecognition[] }) {
  if (recognitions.length === 0) return null;

  return (
    <section id="recognition" className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: BG }}>
      <SectionHeading>Recognition</SectionHeading>

      <div className="max-w-5xl mx-auto">
        {recognitions.map((item, i) => (
          <FadeIn key={item.title + i} delay={i * 0.06} y={26}>
            <div
              className={
                "py-7 sm:py-9 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2" +
                (i > 0 ? " border-t" : "")
              }
              style={{ borderColor: "rgba(215, 226, 234, 0.15)" }}
            >
              <div className="min-w-0">
                <h3
                  className="font-medium uppercase"
                  style={{ color: TEXT, fontSize: "clamp(0.95rem, 2vw, 1.8rem)", lineHeight: 1.2 }}
                >
                  {item.title}
                </h3>
                {item.description ? (
                  <p
                    className="font-light leading-relaxed max-w-3xl mt-1.5"
                    style={{ color: TEXT, opacity: 0.5, fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)" }}
                  >
                    {item.description}
                  </p>
                ) : null}
              </div>
              {item.meta ? (
                <span
                  className="uppercase tracking-widest font-light shrink-0"
                  style={{ color: TEXT, opacity: 0.5, fontSize: "clamp(0.7rem, 1.2vw, 1rem)" }}
                >
                  {item.meta}
                </span>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: CreatorProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="h-[85vh]">
      <div className="sticky top-24 md:top-32">
        <motion.div
          style={{ scale, y: index * 28, transformOrigin: "top center" }}
          className="relative rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/80 p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 md:gap-10 overflow-hidden"
        >
          <div
            className="flex flex-wrap items-center justify-between gap-4 sm:gap-6"
            style={{ color: TEXT }}
          >
            <div className="flex items-end gap-4 sm:gap-6 min-w-0">
              <span
                className="font-black shrink-0"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 0.95 }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pb-1 sm:pb-2">
                <p className="uppercase tracking-widest text-xs sm:text-sm" style={{ opacity: 0.6 }}>
                  {project.category}
                </p>
                <h3
                  className="font-medium uppercase truncate"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)", lineHeight: 1.15 }}
                >
                  {project.name}
                </h3>
              </div>
            </div>
            <LiveProjectButton href={project.link} />
          </div>

          {project.description ? (
            <p
              className="font-light leading-relaxed max-w-3xl -mt-2 sm:-mt-4 md:-mt-6 line-clamp-2 sm:line-clamp-none"
              style={{ color: TEXT, opacity: 0.55, fontSize: "clamp(0.85rem, 1.5vw, 1.2rem)" }}
            >
              {project.description}
            </p>
          ) : null}

          <div className="flex gap-3 sm:gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-3 sm:gap-4 w-[40%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.images[0]}
                alt={project.name + " visual 1"}
                loading="lazy"
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: "clamp(130px, 16vw, 230px)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.images[1]}
                alt={project.name + " visual 2"}
                loading="lazy"
                className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ height: "clamp(160px, 22vw, 340px)" }}
              />
            </div>
            <div className="w-[60%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.images[2]}
                alt={project.name + " showcase"}
                loading="lazy"
                className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                style={{ minHeight: 260 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: CreatorProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <section
      id="projects"
      className="relative z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: SURFACE }}
    >
      <SectionHeading>Project</SectionHeading>

      <div ref={containerRef} className="relative max-w-7xl mx-auto">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.name + "-" + i}
            project={project}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ContactFooter({
  fullName,
  email,
  phone,
  location,
  socialLinks,
  languages,
  availableFor,
}: {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks: { platform: string; url: string }[];
  languages: string[];
  availableFor?: string;
}) {
  const details = [
    email ? { label: "Email", value: email, href: "mailto:" + email } : null,
    phone ? { label: "Phone", value: phone, href: "tel:" + phone.replace(/[^+\d]/g, "") } : null,
    location ? { label: "Location", value: location, href: undefined } : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <footer
      id="contact"
      className="relative z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-6 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-10"
      style={{ background: BG, borderTop: "1.5px solid rgba(215, 226, 234, 0.08)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center">
        <SectionHeading>Contact me</SectionHeading>

        {availableFor ? (
          <FadeIn y={20}>
            <p
              className="uppercase tracking-widest font-light"
              style={{ color: TEXT, opacity: 0.6, fontSize: "clamp(0.8rem, 1.4vw, 1.15rem)" }}
            >
              Available for — {availableFor}
            </p>
          </FadeIn>
        ) : null}

        {details.length > 0 ? (
          <FadeIn delay={0.1} y={20}>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {details.map((detail) => (
                <div key={detail.label} className="flex flex-col items-center gap-1">
                  <span
                    className="uppercase tracking-widest"
                    style={{ color: "#B600A8", fontSize: "clamp(0.65rem, 1vw, 0.85rem)" }}
                  >
                    {detail.label}
                  </span>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="font-medium hover:opacity-70 transition-opacity"
                      style={{ color: TEXT, fontSize: "clamp(0.95rem, 1.8vw, 1.4rem)" }}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="font-medium" style={{ color: TEXT, fontSize: "clamp(0.95rem, 1.8vw, 1.4rem)" }}>
                      {detail.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        ) : null}

        {socialLinks.length > 0 ? (
          <FadeIn delay={0.15} y={20}>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.platform + social.url}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full uppercase tracking-wider font-medium px-6 py-2.5 hover:bg-[#D7E2EA]/10 transition-colors"
                  style={{
                    color: TEXT,
                    border: "1.5px solid rgba(215, 226, 234, 0.25)",
                    fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                  }}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </FadeIn>
        ) : null}

        {languages.length > 0 ? (
          <FadeIn delay={0.2} y={20}>
            <p
              className="uppercase tracking-widest font-light"
              style={{ color: TEXT, opacity: 0.5, fontSize: "clamp(0.7rem, 1.2vw, 1rem)" }}
            >
              Languages — {languages.join(" · ")}
            </p>
          </FadeIn>
        ) : null}

        <FadeIn delay={0.25} y={20} className="w-full">
          <ContactButton href={email ? "mailto:" + email : "#contact"} />
        </FadeIn>
      </div>

      <div
        className="border-t mt-16 sm:mt-20 pt-6 text-center"
        style={{ borderColor: "rgba(215, 226, 234, 0.12)" }}
      >
        <p className="text-xs" style={{ color: TEXT, opacity: 0.45 }}>
          &copy; {new Date().getFullYear()} {fullName}
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------- Renderer ------------------------------- */

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function formatSpan(start?: string, end?: string): string {
  const parts = [start ?? "", end ?? ""].map((part) => (part as string).trim()).filter(Boolean);
  return parts.join(" — ");
}

/**
 * LinkedIn headline ko Services list me convert karta hai.
 * "MERN Stack Developer | React.js, Node.js & MongoDB | ML Enthusiast"
 *   → ["MERN Stack Developer", "React.js", "Node.js", "MongoDB", "ML Enthusiast"]
 * Count fully dynamic — jitne segments, utne numbered rows (01, 02, ...).
 */
function buildServicesFromHeadline(headline: string): CreatorService[] {
  const segments = headline
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const items: string[] = [];
  for (const segment of segments) {
    const pieces = segment
      .split(/[,&]/)
      .map((piece) => piece.trim())
      .filter(Boolean);
    if (pieces.length > 1) {
      items.push(...pieces);
    } else {
      items.push(segment);
    }
  }

  const unique = Array.from(new Map(items.map((item) => [item.toLowerCase(), item])).values());

  return unique.slice(0, 10).map((name, i) => ({
    number: String(i + 1).padStart(2, "0"),
    name,
    description: "",
  }));
}

export function Creator3DPortfolioRenderer({
  portfolio,
  className = "",
}: {
  portfolio: PortfolioObject;
  className?: string;
}) {
  const personalInfo = portfolio.personalInfo ?? {};
  const sections = (portfolio.sections ?? {}) as Record<string, unknown>;

  const contactSection = sections.contact as { email?: string; phone?: string; location?: string; availableFor?: string } | undefined;
  const aboutSection = sections.about as { content?: string; intro?: string } | undefined;

  const fullName = personalInfo.name ?? "Jack";
  const firstName = (fullName.split(" ")[0] ?? "Jack").toLowerCase();
  const email = contactSection?.email ?? personalInfo.email ?? "";
  const contactHref = email ? "mailto:" + email : "#contact";

  /* LinkedIn Headline — sirf isi se Services banega; na ho to section hide */
  const headlineText = asString(personalInfo.tagline);

  const aboutText =
    aboutSection?.content || aboutSection?.intro || personalInfo.bio || DEFAULT_ABOUT_TEXT;

  /* Skills — straight from the LinkedIn PDF */
  const skillsRaw = Array.isArray(sections.skills) ? (sections.skills as Array<Record<string, unknown>>) : [];
  const skills: string[] = Array.from(
    new Set(
      skillsRaw
        .map((skill) => asString(skill.name))
        .filter(Boolean)
        .concat(Array.isArray(personalInfo.tech) ? personalInfo.tech.filter(Boolean) : [])
    )
  );

  /* Services — SIRF LinkedIn Headline se. PDF me headline ho to hi Services
     section banega (01 MERN Stack Developer, 02 React.js ...), count dynamic.
     Headline nahi hai to services empty → section + nav link dono hide. */
  const services: CreatorService[] = buildServicesFromHeadline(headlineText);

  /* Projects — rendered ONLY when the resume actually contains projects */
  const projectsRaw = Array.isArray(sections.projects) ? (sections.projects as Array<Record<string, unknown>>) : [];
  const projects: CreatorProject[] = projectsRaw.slice(0, 6).map((item, i) => {
    const tags = Array.isArray(item.tags) ? item.tags.map((tag) => asString(tag)).filter(Boolean) : [];
    const ownImage = asString(item.image);
    const link = asString(item.liveUrl) || asString(item.link) || asString(item.repoUrl);
    const showcase = ownImage || PROJECT_COVERS[(i * 3 + 2) % PROJECT_COVERS.length];
    return {
      category: tags[0]?.toUpperCase() || asString(item.category) || "Project",
      name: asString(item.title) || asString(item.name) || "Project " + (i + 1),
      description: asString(item.description) || undefined,
      images: [PROJECT_COVERS[(i * 3) % PROJECT_COVERS.length], PROJECT_COVERS[(i * 3 + 1) % PROJECT_COVERS.length], showcase],
      link: link || "",
    };
  });

  /* Experience */
  const experienceRaw = Array.isArray(sections.experience)
    ? (sections.experience as Array<Record<string, unknown>>)
    : [];
  const experiences: CreatorExperience[] = experienceRaw.slice(0, 8).map((item) => ({
    role: asString(item.role) || asString(item.company),
    company: item.role && asString(item.company) ? asString(item.company) : "",
    span: formatSpan(asString(item.startDate), asString(item.endDate)),
    description: asString(item.description) || undefined,
    highlights: Array.isArray(item.highlights)
      ? (item.highlights as unknown[]).map((h) => asString(h)).filter(Boolean)
      : [],
  }));

  /* Education */
  const educationRaw = Array.isArray(sections.education)
    ? (sections.education as Array<Record<string, unknown>>)
    : [];
  const education: CreatorEducation[] = educationRaw.slice(0, 6).map((item) => ({
    degree: [asString(item.degree), asString(item.field)].filter(Boolean).join(", "),
    institution: asString(item.institution),
    span: formatSpan(asString(item.startDate), asString(item.endDate)),
    description: asString(item.description) || asString(item.grade) || undefined,
  }));

  /* Recognition — certifications + achievements + awards */
  const certificationsRaw = Array.isArray(sections.certifications)
    ? (sections.certifications as Array<Record<string, unknown>>)
    : [];
  const achievementsRaw = Array.isArray(sections.achievements)
    ? (sections.achievements as Array<Record<string, unknown>>)
    : [];
  const awardsRaw = Array.isArray(sections.awards) ? (sections.awards as Array<Record<string, unknown>>) : [];

  const recognitions: CreatorRecognition[] = [
    ...certificationsRaw.map((item) => ({
      title: asString(item.name),
      meta: [asString(item.issuer), asString(item.date)].filter(Boolean).join(" · "),
      description: undefined,
    })),
    ...achievementsRaw.map((item) => ({
      title: asString(item.title),
      meta: [asString(item.metric), asString(item.date)].filter(Boolean).join(" · "),
      description: asString(item.description) || undefined,
    })),
    ...awardsRaw.map((item) => ({
      title: asString(item.title),
      meta: [asString(item.organization), asString(item.date)].filter(Boolean).join(" · "),
      description: asString(item.description) || undefined,
    })),
  ]
    .filter((item) => item.title)
    .slice(0, 10);

  /* Social links */
  const socialRaw = Array.isArray(sections.socialLinks)
    ? (sections.socialLinks as Array<Record<string, unknown>>)
    : [];
  const socialLinks = socialRaw
    .map((item) => ({ platform: asString(item.platform), url: asString(item.url) }))
    .filter((item) => item.platform && item.url)
    .slice(0, 6);

  /* Languages */
  const languagesRaw = Array.isArray(sections.languages)
    ? (sections.languages as Array<Record<string, unknown>>)
    : [];
  const languages = languagesRaw
    .map((item) => {
      const name = asString(item.name);
      const proficiency = asString(item.proficiency);
      return proficiency ? name + " (" + proficiency + ")" : name;
    })
    .filter(Boolean);

  const hasProjects = projects.length > 0;

  return (
    <div
      className={"ap-portfolio-root c3d-root w-full min-h-screen " + className}
      style={{
        background: BG,
        color: TEXT,
        fontFamily: "'Kanit', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <style>{`
.hero-heading{background:linear-gradient(180deg,#646973 0%,#BBCCD7 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.c3d-marquee-track{display:flex;width:max-content;will-change:transform;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes c3d-marquee-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes c3d-marquee-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@media (prefers-reduced-motion: reduce){.c3d-marquee-track{animation:none !important}}
`}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap"
      />

      <HeroSection
        name={firstName}
        contactHref={contactHref}
        showServices={services.length > 0}
        showProjects={hasProjects}
      />
      <SkillsMarqueeSection skills={skills} />
      <AboutSection aboutText={aboutText} contactHref={contactHref} />
      <ServicesSection services={services} />
      <ExperienceSection experiences={experiences} />
      <EducationSection education={education} />
      <RecognitionSection recognitions={recognitions} />
      {hasProjects ? <ProjectsSection projects={projects} /> : null}
      <ContactFooter
        fullName={fullName}
        email={email}
        phone={contactSection?.phone ?? personalInfo.phone}
        location={contactSection?.location ?? personalInfo.location}
        socialLinks={socialLinks}
        languages={languages}
        availableFor={contactSection?.availableFor ?? personalInfo.role}
      />
    </div>
  );
}
