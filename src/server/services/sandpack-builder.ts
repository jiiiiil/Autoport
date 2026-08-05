import type { PortfolioData } from "@/server/types";
import type { CompositionGraph, ComposedSection } from "@/server/ai/composition/types";
import { composedThemeToTokens } from "@/design-system/composition";
import { buildGlobalsCss } from "@/design-system/css";

export interface SandpackFile {
  code: string;
  language: string;
}

export type SandpackFiles = Record<string, SandpackFile>;

export interface SandpackResponse {
  files: SandpackFiles;
  entry: string;
  dependencies: Record<string, string>;
}

interface Ctx {
  bg: string;
  card: string;
  cardHover: string;
  border: string;
  text: string;
  textSecondary: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  gradientPrimary: string;
  gradientText: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radius2xl: string;
  spacing16: string;
  spacing20: string;
  mode: string;
  bgDecoration: string;
}

const DEFAULT_ORDER = ["hero", "about", "projects", "skills", "experience", "contact"];

function readStr(v: unknown, fallback: string): string {
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function readArr(v: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(v)) return v as Array<Record<string, unknown>>;
  return [];
}

function readObj(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

/**
 * Phase 17 — intelligent text clamping for the generated code.
 * Returns a ` clamp-N` class only when the content is actually long,
 * so short content is never unnecessarily truncated.
 */
function descClamp(desc: string, maxLines: number): string {
  const words = (desc ?? "").trim().split(/\s+/).filter(Boolean).length;
  if (words > 34 || (desc ?? "").length > 240) return ` clamp-${maxLines}`;
  return "";
}

function buildCtx(composition?: CompositionGraph | null): Ctx {
  const theme = composition?.theme;
  const bg = theme?.colors.background ?? "#0f0f0f";
  const card = theme?.colors.surface ?? "#1a1a1a";
  const cardHover = theme?.colors.surfaceElevated ?? "#222222";
  const border = theme?.colors.border ?? "#2a2a2a";
  const text = theme?.colors.text ?? "#ffffff";
  const textSecondary = theme?.colors.textSecondary ?? "#a3a3a3";
  const muted = theme?.colors.textMuted ?? "#a0a0a0";
  const primary = theme?.colors.primary ?? "#7c3aed";
  const secondary = theme?.colors.secondary ?? "#4f46e5";
  const accent = theme?.colors.accent ?? "#06b6d4";

  const headingFont = theme?.typography.headingFont ?? "'Inter', sans-serif";
  const bodyFont = theme?.typography.bodyFont ?? "'Inter', sans-serif";
  const monoFont = theme?.typography.monoFont ?? "'JetBrains Mono', monospace";

  const backgroundStyle = theme?.backgroundStyle ?? "flat";
  const hasMeshBg = backgroundStyle === "mesh-gradient";
  const hasAuroraBg = backgroundStyle === "aurora";
  const hasGridBg = backgroundStyle === "grid";
  const hasBlobsBg = backgroundStyle === "floating-blobs";
  const hasNoiseBg = backgroundStyle === "noise";

  const gradientPrimary = theme?.gradients?.primary ?? `linear-gradient(135deg, ${primary}, ${accent})`;
  const gradientText = theme?.gradients?.text ?? `linear-gradient(135deg, ${primary}, ${accent})`;

  const bgDecoration = hasMeshBg ? `
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: '-25%', left: '-25%', width: '50%', height: '50%', borderRadius: '50%', opacity: 0.15, background: '${primary}', filter: 'blur(120px)', animation: 'meshDrift 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-25%', right: '-25%', width: '50%', height: '50%', borderRadius: '50%', opacity: 0.12, background: '${accent}', filter: 'blur(120px)', animation: 'meshDrift 25s ease-in-out infinite 5s' }} />
        <div style={{ position: 'absolute', top: '33%', right: '25%', width: '33%', height: '33%', borderRadius: '50%', opacity: 0.08, background: '${secondary}', filter: 'blur(100px)', animation: 'meshDrift 30s ease-in-out infinite 10s' }} />
      </div>` : hasAuroraBg ? `
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', opacity: 0.04, background: 'linear-gradient(180deg, ${primary} 0%, ${accent} 50%, transparent 100%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '33%', opacity: 0.03, background: 'linear-gradient(0deg, ${secondary} 0%, transparent 100%)', filter: 'blur(60px)' }} />
      </div>` : hasGridBg ? `
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, opacity: 0.04, backgroundImage: 'linear-gradient(90deg, ${primary} 1px, transparent 1px), linear-gradient(0deg, ${accent} 1px, transparent 1px)', backgroundSize: '60px 60px' }} />` : hasBlobsBg ? `
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '18rem', height: '18rem', borderRadius: '50%', opacity: 0.1, background: 'radial-gradient(circle, ${primary}, transparent)', filter: 'blur(100px)', animation: 'blob 30s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '33%', right: '20%', width: '24rem', height: '24rem', borderRadius: '50%', opacity: 0.08, background: 'radial-gradient(circle, ${accent}, transparent)', filter: 'blur(120px)', animation: 'blob 35s ease-in-out infinite 10s' }} />
      </div>` : hasNoiseBg ? `
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.03, zIndex: -1, backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjQiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybigjZikiLz48L3N2Zz4=)' }} />` : ``;

  return {
    bg, card, cardHover, border, text, textSecondary, muted,
    primary, secondary, accent,
    headingFont, bodyFont, monoFont,
    gradientPrimary, gradientText,
    radiusSm: theme?.radius?.sm ?? "0.25rem",
    radiusMd: theme?.radius?.md ?? "0.5rem",
    radiusLg: theme?.radius?.lg ?? "0.75rem",
    radiusXl: theme?.radius?.xl ?? "1rem",
    radius2xl: theme?.radius?.["2xl"] ?? "1.5rem",
    spacing16: theme?.spacing?.["16"] ?? "4rem",
    spacing20: theme?.spacing?.["20"] ?? "5rem",
    mode: theme?.mode ?? "dark",
    bgDecoration,
  };
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function dataJs(data: PortfolioData): string {
  return escapeStr(JSON.stringify(data, null, 2));
}

function gsapScript(ctx: Ctx, composition?: CompositionGraph | null): string {
  const motion = composition?.motion;
  const useGsap = motion?.library === "gsap" || motion?.gsap?.smoothScroll;
  if (!useGsap) return "";

  const g = motion?.gsap ?? {};
  return `
  useEffect(() => {
    let killed = false;
    const loadGsap = async () => {
      try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        const gsapMod = await import('https://esm.sh/gsap');
        const ScrollTriggerMod = await import('https://esm.sh/gsap/ScrollTrigger');
        const gsap = gsapMod.default;
        const ScrollTrigger = ScrollTriggerMod.default;
        gsap.registerPlugin(ScrollTrigger);

        ${g.textReveal ? `
        document.querySelectorAll('[data-reveal-text]').forEach(el => {
          const text = el.textContent || '';
          el.setAttribute('aria-label', text);
          el.innerHTML = text.split('').map(ch => '<span class="t-char">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>').join('');
          gsap.from(el.querySelectorAll('.t-char'), {
            opacity: 0, y: 34, rotateX: 45, stagger: 0.025, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
          });
        });` : ''}

        ${g.parallax ? `
        document.querySelectorAll('[data-parallax]').forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax') || '0.15');
          gsap.to(el, {
            y: () => -(el.offsetHeight * speed),
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
          });
        });` : ''}

        ${g.imageReveal ? `
        document.querySelectorAll('[data-image-reveal]').forEach(el => {
          gsap.from(el, {
            clipPath: 'inset(0 0 100% 0)', opacity: 0.4, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          });
        });` : ''}

        ${g.magneticButtons ? `
        document.querySelectorAll('.magnetic').forEach(btn => {
          btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.3;
            const y = (e.clientY - r.top - r.height / 2) * 0.3;
            gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
          });
          btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }));
        });` : ''}

        ${g.cursorInteraction ? `
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        document.addEventListener('mousemove', (e) => gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' }));
        document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
        });` : ''}

        ${g.cardHoverMotion ? `
        document.querySelectorAll('.tilt-card').forEach(card => {
          card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, { rotationX: -y * 8, rotationY: x * 8, duration: 0.4, ease: 'power2.out' });
          });
          card.addEventListener('mouseleave', () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
        });` : ''}

        document.querySelectorAll('[data-fade]').forEach(el => {
          gsap.from(el, {
            opacity: 0, y: 42, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
          });
        });

        ${g.floatingElements ? `
        document.querySelectorAll('.float-el').forEach((el, i) => {
          gsap.to(el, { y: -14, duration: 2.4 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.3 });
        });` : ''}
      } catch (e) { console.log('GSAP unavailable'); }
    };
    loadGsap();
    return () => { killed = true; };
  }, []);`;
}

function buildNav(composition: CompositionGraph | null | undefined, sectionOrder: string[], ctx: Ctx): string {
  const style = composition?.navigation?.style ?? "sticky";
  const items = sectionOrder.filter((id) => id !== "contact" && id !== "socialLinks");

  const label = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);
  const links = items.map((id) =>
    `            <button key="${id}" onClick={() => scrollTo('${id}')} className="nav-link">${label(id)}</button>`
  ).join("\n");

  const horizontal = style === "horizontal-scroll" || composition?.layout?.style === "horizontal-scroll";

  if (style === "none") return "";

  if (horizontal) {
    return `
      <nav className="h-nav">
        ${links}
        <button className="nav-link" onClick={() => scrollTo('contact')}>Contact</button>
      </nav>`;
  }

  const base = `
      <nav className="top-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: '${ctx.bg}dd', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid ${ctx.border}30', padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '3.5rem' }}>
          <button onClick={() => scrollTo('${sectionOrder[0] || "hero"}')} className="brand" style={{
            fontFamily: "${ctx.headingFont}", fontWeight: 700, fontSize: '1rem',
            backgroundImage: '${ctx.gradientText}', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', border: 'none', cursor: 'pointer', padding: 0,
          }}>{DATA.personalInfo.name || 'Portfolio'}</button>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            ${links}
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', marginLeft: '0.75rem' }} onClick={() => scrollTo('contact')}>
              Get in Touch
            </button>
          </div>
        </div>
      </nav>`;
  return base;
}

function sectionHeading(
  id: string,
  ctx: Ctx,
  eyebrow?: string,
  subtitle?: string,
  align: "center" | "left" = "center"
): string {
  const label = id.charAt(0).toUpperCase() + id.slice(1);
  const sub = subtitle ?? "";
  const isCenter = align === "center";
  return `
        <div className="sec-head ${isCenter ? "center" : "left"}">
          <div className="sec-eyebrow-row">${eyebrow ? `<span className="eyebrow">${escapeHtml(eyebrow)}</span>` : `<span className="eyebrow">${escapeHtml(label)}</span>`}</div>
          <h2 className="section-title">${escapeHtml(label)}</h2>
          ${sub ? `<p className="sec-sub">${escapeHtml(sub)}</p>` : ""}
          <div className="sec-divider" style={{ background: '${ctx.gradientPrimary}' }} />
        </div>`;
}

function sectionSubtitleFor(id: string): string {
  switch (id) {
    case "about": return "The story behind the work and the person making it.";
    case "skills": return "The tools and technologies I use to bring ideas to life.";
    case "projects": return "Selected work — products and experiences built end to end.";
    case "experience": return "Where I have worked and what I delivered along the way.";
    case "education": return "The foundations that shaped how I think and build.";
    case "contact": return "Have an idea in mind? Let's make it real.";
    default: return "";
  }
}

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

function heroSection(ctx: Ctx, variant: string, parallax?: boolean): string {
  const v = variant || "centered";
  const techRow = (justify: string) => `
          <div className="hero-tech" style={{ justifyContent: '${justify}' }}>
            <span className="hero-tech-line" />
            {Array.isArray(DATA.personalInfo.tech) ? DATA.personalInfo.tech.slice(0, 6).map((t, i) => <span key={i} className="hero-tech-chip">{t}</span>) : null}
            {!Array.isArray(DATA.personalInfo.tech) && DATA.personalInfo.role ? <span className="hero-tech-chip">{DATA.personalInfo.role}</span> : null}
          </div>`;
  const inner = (() => {
    if (v === "split") {
      return `
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'left' }}>
          <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
          <h1 className="hero-title" data-reveal-text>{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
          <p className="hero-tagline">{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
            <MagneticButton className="btn-outline" onClick={() => scrollTo('contact')}>Contact Me</MagneticButton>
          </div>
        </div>
        <div data-image-reveal style={{ width: '100%', aspectRatio: '1 / 1.1', borderRadius: '${ctx.radius2xl}', overflow: 'hidden', background: '${ctx.gradientPrimary}', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1.5rem', color: '#fff' }}>
          <span style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 1, opacity: 0.9 }}>{String(DATA.personalInfo.name || 'P').charAt(0)}</span>
        </div>
      </div>`;
    }
    if (v === "typewriter") {
      return `
      <div style={{ textAlign: 'center' }}>
        <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
        <h1 className="hero-title" data-reveal-text>{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
        <TypedRole role={DATA.personalInfo.role || 'Developer'} primary='${ctx.primary}' />
        <p className="hero-tagline">{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
          <MagneticButton className="btn-outline" onClick={() => scrollTo('contact')}>Contact Me</MagneticButton>
        </div>
        ${techRow("center")}
      </div>`;
    }
    if (v === "glass") {
      return `
      <div className="glass-panel" style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem', borderRadius: '${ctx.radius2xl}', textAlign: 'center' }}>
        <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
        <h1 className="hero-title" data-reveal-text>{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
        <p className="hero-tagline">{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
          <MagneticButton className="btn-outline" onClick={() => scrollTo('contact')}>Contact Me</MagneticButton>
        </div>
      </div>`;
    }
    if (v === "animated-gradient") {
      return `
      <div style={{ textAlign: 'center' }}>
        <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
        <h1 className="hero-title gradient-animate">{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
        <p className="hero-tagline">{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
          <MagneticButton className="btn-outline" onClick={() => scrollTo('contact')}>Contact Me</MagneticButton>
        </div>
      </div>`;
    }
    if (v === "minimal") {
      return `
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', textAlign: 'left' }} data-reveal-text>{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
        <p className="hero-tagline" style={{ textAlign: 'left' }}>{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
        </div>
      </div>`;
    }
    // centered + full-screen default
    return `
      <div style={{ textAlign: 'center' }}>
        <span className="eyebrow">{DATA.personalInfo.role || 'Developer'}</span>
        <h1 className="hero-title" data-reveal-text>{DATA.personalInfo.name ? 'Hi, I\\'m ' + DATA.personalInfo.name : 'Hello World'}</h1>
        <p className="hero-tagline">{DATA.personalInfo.tagline || DATA.personalInfo.bio || 'Building exceptional digital experiences.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton className="btn-primary" onClick={() => scrollTo('projects')}>View My Work</MagneticButton>
          <MagneticButton className="btn-outline" onClick={() => scrollTo('contact')}>Contact Me</MagneticButton>
        </div>
        ${techRow("center")}
      </div>`;
  })();

  return `
      <section id="hero" className="hero-sec ${v === "full-screen" ? "full-screen" : ""}" ${parallax ? `data-parallax="0.15"` : ""} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
        ${inner}
        <div className="scroll-hint"><span>Scroll</span></div>
      </section>`;
}

function aboutSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const content = readObj(data.sections?.about);
  const body = readStr(content.content, readStr(data.personalInfo?.bio, ""));
  const intro = readStr(content.intro, "");
  const highlights = readArr(content.highlights);
  const strengths = readArr(content.strengths);
  const metrics = readArr(content.metrics);

  const metricsRow = metrics.length ? `
          <div className="about-metrics">
            ${metrics.map((m, i) => {
              const label = readStr(m.label, "");
              const value = readStr(m.value, "");
              return `
            <div key={${i}} className="metric-chip" style={{ '--mc-border': '${ctx.primary}30' } as React.CSSProperties}>
              <span className="metric-chip-value" style={{ backgroundImage: '${ctx.gradientText}' }}>${escapeHtml(value)}</span>
              <span className="metric-chip-label">${escapeHtml(label)}</span>
            </div>`;
            }).join("")}
          </div>` : "";

  const strengthsRow = strengths.length ? `
          <div className="strength-list">
            ${strengths.map((s, i) => {
              const label = readStr(s.label, "");
              const detail = readStr(s.detail, "");
              return `
            <div key={${i}} className="strength-item">
              <span className="strength-check" style={{ color: '${ctx.primary}' }}>✓</span>
              <div>
                <div className="strength-label">${escapeHtml(label)}</div>
                ${detail ? `<div className="strength-detail">${escapeHtml(detail)}</div>` : ""}
              </div>
            </div>`;
            }).join("")}
          </div>` : "";

  const highlightsRow = highlights.length ? `
          <ul className="highlight-list">
            ${highlights.map((h, i) => `
            <li key={${i}} className="highlight-item"><span className="highlight-bullet" style={{ background: '${ctx.primary}' }} />${escapeHtml(readStr(h, ""))}</li>`).join("")}
          </ul>` : "";

  const split = variant === "split" || variant === "editorial";
  return `
      <section id="about" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        ${sectionHeading("about", ctx, "About", sectionSubtitleFor("about"), split ? "left" : "center")}
        ${split ? `
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3rem', alignItems: 'start' }}>
          <div className="about-visual" style={{ borderColor: '${ctx.primary}30' }}>
            <span className="about-initial" style={{ backgroundImage: '${ctx.gradientPrimary}' }}>{String('${escapeHtml(readStr(data.personalInfo?.name, "A"))}').charAt(0).toUpperCase()}</span>
            ${strengthsRow || highlightsRow ? `<div style={{ marginTop: '1.5rem' }}>${highlightsRow}${strengthsRow}</div>` : ""}
          </div>
          <div>
            ${intro ? `<p className="about-intro">${escapeHtml(intro)}</p>` : ""}
            <p className="about-text">${escapeHtml(body) || "I craft digital experiences that solve real problems."}</p>
            ${metricsRow}
          </div>
        </div>` : `
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          ${intro ? `<p className="about-intro" style={{ textAlign: 'center' }}>${escapeHtml(intro)}</p>` : ""}
          <p className="about-text" style={{ fontSize: '1.05rem', textAlign: 'center' }}>${escapeHtml(body) || "I craft digital experiences that solve real problems."}</p>
          ${metricsRow ? `<div style={{ display: 'flex', justifyContent: 'center' }}>${metricsRow}</div>` : ""}
          ${strengthsRow}
          ${highlightsRow}
        </div>`}
      </section>`;
}

function skillsSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const v = variant || "pills";
  const skills = readArr(data.sections?.skills);
  const rows = skills.map((s, i) => {
    const name = readStr(s.name, "");
    const level = readStr(s.level, "");
    const category = readStr(s.category, "");
    return { name, level, category: category || "Core", i };
  });

  const groups = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});
  const categories = Object.keys(groups);

  const barFor = (r: { name: string; level: string; category: string; i: number }) => {
    const pct = skillPercent(r.level, r.i);
    return `
          <div key={${r.i}} className="skill-bar-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ color: '${ctx.text}', fontSize: '0.875rem', fontWeight: 600 }}>${escapeHtml(r.name)}</span>
              ${r.level ? `<span style={{ color: '${ctx.primary}', fontSize: '0.72rem', letterSpacing: '0.03em' }}>${escapeHtml(r.level)}</span>` : `<span style={{ color: '${ctx.muted}', fontSize: '0.72rem' }}>${pct}%</span>`}
            </div>
            <div className="bar-track"><div className="bar-fill" style={{ '--bar-w': '${pct}%', background: '${ctx.gradientPrimary}' } as React.CSSProperties} /></div>
          </div>`;
  };

  if (v === "bars") {
    return `
      <section id="skills" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        ${sectionHeading("skills", ctx, "Expertise", sectionSubtitleFor("skills"))}
        ${categories.length > 1 ? categories.map((cat) => `
        <div className="skill-cat" key={cat}>
          <div className="skill-cat-label" style={{ color: '${ctx.primary}' }}>${escapeHtml(cat)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            ${groups[cat].map(barFor).join("")}
          </div>
        </div>`).join("") : `
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          ${rows.map(barFor).join("")}
        </div>`}
      </section>`;
  }

  if (v === "cards") {
    return `
      <section id="skills" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        ${sectionHeading("skills", ctx, "Expertise", sectionSubtitleFor("skills"))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          ${categories.map((cat, ci) => `
          <div key={${ci}} className="tilt-card skill-card">
            <div className="skill-card-head">
              <span className="skill-card-dot" style={{ background: '${ctx.primary}' }} />
              <span style={{ fontFamily: "${ctx.headingFont}", fontWeight: 600, fontSize: '0.95rem', color: '${ctx.text}' }}>${escapeHtml(cat)}</span>
              <span className="skill-count">${groups[cat].length}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              ${groups[cat].map((r) => `<span key={${r.i}} className="skill-pill">${escapeHtml(r.name)}</span>`).join("")}
            </div>
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (v === "icon-grid") {
    return `
      <section id="skills" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        ${sectionHeading("skills", ctx, "Expertise", sectionSubtitleFor("skills"))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          ${rows.map((r) => `
          <div key={${r.i}} className="tilt-card skill-tile">
            <span className="skill-dot" style={{ background: '${ctx.primary}' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '${ctx.text}' }}>${escapeHtml(r.name)}</span>
          </div>`).join("")}
        </div>
      </section>`;
  }

  // pills default
  return `
      <section id="skills" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        ${sectionHeading("skills", ctx, "Expertise", sectionSubtitleFor("skills"))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          ${rows.map((r) => `<span key={${r.i}} className="skill-pill">${escapeHtml(r.name)}</span>`).join("")}
        </div>
      </section>`;
}

function skillPercent(level: string, index: number): number {
  switch (level) {
    case "expert": return 96;
    case "advanced": return 85;
    case "intermediate": return 70;
    case "beginner": return 50;
    default: return Math.min(95, 42 + (index * 17) % 50);
  }
}

function cardGrid(id: string, ctx: Ctx, data: PortfolioData, eyebrow?: string): string {
  const items = readArr(data.sections?.[id]);
  if (items.length === 0) return "";
  return `
      <section id="${id}" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        ${sectionHeading(id, ctx, eyebrow)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          ${items.map((item, i) => {
            const title = readStr(item.title ?? item.name, "");
            const desc = readStr(item.description ?? item.summary ?? item.excerpt ?? "", "");
            const tags = readArr(item.tags ?? item.technologies).map((t) => readStr(t, "")).filter(Boolean);
            return `
          <div key={${i}} className="tilt-card content-card">
            <div className="card-accent" style={{ background: '${ctx.gradientPrimary}' }} />
            <h3 className="card-title">${escapeHtml(title)}</h3>
            ${desc ? `<p className="card-desc${descClamp(desc, 5)}">${escapeHtml(desc)}</p>` : ""}
            ${tags.length ? `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>${tags.map((t, j) => `<span key={${j}} className="tag-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function projectsSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const v = variant || "card";
  const projects = readArr(data.sections?.projects);
  if (projects.length === 0) return "";

  const renderProject = (p: Record<string, unknown>, i: number, styleObj: string, featured: boolean) => {
    const title = readStr(p.title, "");
    const desc = readStr(p.description, "");
    const tags = readArr(p.tags ?? p.technologies).map((t) => readStr(t, "")).filter(Boolean);
    const link = readStr(p.liveUrl ?? p.link, "");
    const repo = readStr(p.repoUrl, "");
    const features = readArr(p.features).map((f) => readStr(f, "")).filter(Boolean);
    const initial = String(title || "P").charAt(0).toUpperCase();
    return `
          <div key={${i}} className="tilt-card project-card ${featured ? "featured" : ""}" style={{ ${styleObj} }}>
            <div className="project-thumb ${featured ? "tall" : ""}" style={{ background: '${ctx.gradientPrimary}' }}>
              <div className="thumb-chrome"><span /><span /><span /></div>
              <span className="thumb-initial">${escapeHtml(initial)}</span>
            </div>
            <div className="project-body">
              <h3 className="card-title">${escapeHtml(title)}</h3>
              <p className="card-desc${descClamp(desc, 5)}">${escapeHtml(desc)}</p>
              ${features.length ? `
              <ul className="project-features">
                ${features.slice(0, featured ? 4 : 2).map((f, k) => `<li key={${k}}><span className="feature-arrow" style={{ color: '${ctx.primary}' }}>→</span>${escapeHtml(f)}</li>`).join("")}
              </ul>` : ""}
              ${tags.length ? `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: 'auto' }}>${tags.map((t, j) => `<span key={${j}} className="tag-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
              <div className="project-actions">
                ${link ? `<a className="btn-primary btn-sm" href="${escapeAttr(link)}" target="_blank" rel="noreferrer">Live Demo →</a>` : ""}
                ${repo && repo !== link ? `<a className="btn-outline btn-sm" href="${escapeAttr(repo)}" target="_blank" rel="noreferrer">Source</a>` : ""}
              </div>
            </div>
          </div>`;
  };

  if (v === "horizontal-scroll") {
    return `
      <section id="projects" style={{ padding: '${ctx.spacing16} 0', overflow: 'hidden' }}>
        ${sectionHeading("projects", ctx, "Portfolio", sectionSubtitleFor("projects"))}
        <div className="hs-track" style={{ display: 'flex', gap: '1.5rem', padding: '0 1.5rem', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          ${projects.map((p, i) => renderProject(p, i, "minWidth: '380px', maxWidth: '420px', scrollSnapAlign: 'start', flexShrink: 0", i === 0)).join("")}
        </div>
      </section>`;
  }

  if (v === "bento") {
    return `
      <section id="projects" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        ${sectionHeading("projects", ctx, "Portfolio", sectionSubtitleFor("projects"))}
        <div className="bento">
          ${projects.map((p, i) => {
            const featured = i === 0;
            const span = featured ? "gridRow: 'span 2', gridColumn: 'span 2'" : "";
            return renderProject(p, i, span, featured);
          }).join("")}
        </div>
      </section>`;
  }

  if (v === "case-study") {
    return `
      <section id="projects" style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        ${sectionHeading("projects", ctx, "Case Studies", sectionSubtitleFor("projects"))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          ${projects.map((p, i) => {
            const title = readStr(p.title, "");
            const desc = readStr(p.description, "");
            const tags = readArr(p.tags ?? p.technologies).map((t) => readStr(t, "")).filter(Boolean);
            const features = readArr(p.features).map((f) => readStr(f, "")).filter(Boolean);
            const link = readStr(p.liveUrl ?? p.link, "");
            return `
          <div key={${i}} className="case-row ${i % 2 ? "reversed" : ""}">
            <div className="case-visual" style={{ background: '${ctx.gradientPrimary}' }}><span>{String('${escapeHtml(title)}').charAt(0).toUpperCase()}</span></div>
            <div className="case-body">
              <span className="eyebrow">Project ${i + 1}</span>
              <h3 className="card-title">${escapeHtml(title)}</h3>
              <p className="card-desc${descClamp(desc, 5)}">${escapeHtml(desc)}</p>
              ${features.length ? `<ul className="project-features">${features.slice(0, 3).map((f, k) => `<li key={${k}}><span className="feature-arrow" style={{ color: '${ctx.primary}' }}>→</span>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
              ${tags.length ? `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>${tags.map((t, j) => `<span key={${j}} className="tag-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
              ${link ? `<a className="text-link" style={{ display: 'inline-block', marginTop: '1rem' }} href="${escapeAttr(link)}" target="_blank" rel="noreferrer">Open Project →</a>` : ""}
            </div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
  }

  return `
      <section id="projects" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        ${sectionHeading("projects", ctx, "Portfolio", sectionSubtitleFor("projects"))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          ${projects.map((p, i) => renderProject(p, i, "", i === 0)).join("")}
        </div>
      </section>`;
}

function experienceSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const v = variant || "timeline";
  const exp = readArr(data.sections?.experience);
  if (exp.length === 0) return "";

  if (v === "card") {
    return `
      <section id="experience" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        ${sectionHeading("experience", ctx, "Career", sectionSubtitleFor("experience"))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          ${exp.map((e, i) => {
            const role = readStr(e.role ?? e.title, "");
            const company = readStr(e.company, "");
            const desc = readStr(e.description ?? e.summary, "");
            const start = readStr(e.startDate, "");
            const end = readStr(e.endDate, "");
            const tech = readArr(e.technologies).map((t) => readStr(t, "")).filter(Boolean);
            return `
          <div key={${i}} className="tilt-card content-card">
            <span className="eyebrow" style={{ fontSize: '0.7rem' }}>${escapeHtml(company)}</span>
            <h3 className="card-title">${escapeHtml(role)}</h3>
            <p className="card-desc${descClamp(desc, 4)}">${escapeHtml(desc)}</p>
            ${tech.length ? `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>${tech.map((t, j) => `<span key={${j}} className="tag-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
            <div className="date-tag">${escapeHtml(start)}${start && end ? " — " : ""}${escapeHtml(end)}</div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
  }

  return `
      <section id="experience" style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        ${sectionHeading("experience", ctx, "Career", sectionSubtitleFor("experience"))}
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div style={{ position: 'absolute', left: '0.5rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, ${ctx.primary}, ${ctx.accent}, transparent)' }} />
          ${exp.map((e, i) => {
            const role = readStr(e.role ?? e.title, "");
            const company = readStr(e.company, "");
            const desc = readStr(e.description ?? e.summary, "");
            const start = readStr(e.startDate, "");
            const end = readStr(e.endDate, "");
            const current = Boolean(e.current);
            const highlights = readArr(e.highlights).map((h) => readStr(h, "")).filter(Boolean);
            const tech = readArr(e.technologies).map((t) => readStr(t, "")).filter(Boolean);
            const companyInitial = String(company || "C").charAt(0).toUpperCase();
            return `
          <div key={${i}} data-fade style={{ position: 'relative', marginBottom: '2.5rem', paddingLeft: '1.5rem' }}>
            <div className="dot" style={{ background: '${ctx.primary}' }} />
            <div className="glass-card exp-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="exp-logo" style={{ background: '${ctx.gradientPrimary}' }}>${escapeHtml(companyInitial)}</span>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontFamily: "${ctx.headingFont}", fontSize: '1.05rem', fontWeight: 600, color: '${ctx.text}' }}>${escapeHtml(role)}</h3>
                    <span className="date-tag">${escapeHtml(start)}${start && end ? " — " : ""}${escapeHtml(end)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '${ctx.primary}', marginTop: '0.25rem', fontWeight: 500 }}>${escapeHtml(company)}${current ? ` <span className="now-pill">Current</span>` : ""}</p>
                </div>
              </div>
              ${desc ? `<p className="card-desc${descClamp(desc, 4)}" style={{ marginTop: '0.75rem' }}>${escapeHtml(desc)}</p>` : ""}
              ${highlights.length ? `
              <ul className="highlight-list">
                ${highlights.slice(0, 4).map((h, k) => `<li key={${k}} className="highlight-item"><span className="highlight-bullet" style={{ background: '${ctx.primary}' }} />${escapeHtml(h)}</li>`).join("")}
              </ul>` : ""}
              ${tech.length ? `<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1rem' }}>${tech.map((t, k) => `<span key={${k}} className="tag-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
            </div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function educationSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const edu = readArr(data.sections?.education);
  if (edu.length === 0) return "";
  return `
      <section id="education" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        ${sectionHeading("education", ctx, "Academics")}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          ${edu.map((e, i) => {
            const degree = readStr(e.degree, "");
            const field = readStr(e.field, "");
            const inst = readStr(e.institution, "");
            const start = readStr(e.startDate, "");
            const end = readStr(e.endDate, "");
            return `
          <div key={${i}} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 className="card-title">${escapeHtml(degree)}${field ? " — " + escapeHtml(field) : ""}</h3>
              <p style={{ color: '${ctx.primary}', fontSize: '0.875rem', fontWeight: 500 }}>${escapeHtml(inst)}</p>
            </div>
            <span className="date-tag">${escapeHtml(start)}${start && end ? " — " : ""}${escapeHtml(end)}</span>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function metricsSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.metrics);
  if (items.length === 0) return "";
  return `
      <section id="metrics" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          ${items.map((m, i) => {
            const label = readStr(m.label, "");
            const value = readStr(m.value, "");
            return `
          <div key={${i}} className="metric-card" style={{ borderColor: '${ctx.primary}30' }}>
            <span className="metric-value" style={{ backgroundImage: '${ctx.gradientText}' }}>{String('${escapeHtml(value)}')}</span>
            <span className="metric-label">${escapeHtml(label)}</span>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function testimonialsSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.testimonials);
  if (items.length === 0) return "";
  return `
      <section id="testimonials" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        ${sectionHeading("testimonials", ctx, "Social Proof")}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          ${items.map((t, i) => {
            const author = readStr(t.author, "");
            const role = readStr(t.role, "");
            const content = readStr(t.content, "");
            return `
          <div key={${i}} className="tilt-card quote-card">
            <div className="quote-mark" style={{ color: '${ctx.primary}' }}>&ldquo;</div>
            <p className="card-desc${descClamp(content, 6)}" style={{ fontStyle: 'italic' }}>${escapeHtml(content)}</p>
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: '${ctx.text}', fontSize: '0.875rem' }}>${escapeHtml(author)}</div>
              ${role ? `<div style={{ color: '${ctx.muted}', fontSize: '0.75rem' }}>${escapeHtml(role)}</div>` : ""}
            </div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function servicesSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.services);
  if (items.length === 0) return "";
  return `
      <section id="services" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        ${sectionHeading("services", ctx, "What I Do")}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          ${items.map((s, i) => {
            const name = readStr(s.name, "");
            const desc = readStr(s.description, "");
            return `
          <div key={${i}} className="tilt-card service-card">
            <div className="service-icon" style={{ background: '${ctx.primary}18', color: '${ctx.primary}' }}>{${i} + 1}</div>
            <h3 className="card-title">${escapeHtml(name)}</h3>
            ${desc ? `<p className="card-desc${descClamp(desc, 4)}">${escapeHtml(desc)}</p>` : ""}
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function faqSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.faq);
  if (items.length === 0) return "";
  return `
      <section id="faq" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '760px', margin: '0 auto' }}>
        ${sectionHeading("faq", ctx, "FAQ")}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          ${items.map((f, i) => {
            const q = readStr(f.question, "");
            const a = readStr(f.answer, "");
            return `
          <div key={${i}} className="faq-item">
            <button className="faq-q" onClick={() => { const el = document.getElementById('faq-${i}'); el && el.classList.toggle('open'); }}>
              <span>${escapeHtml(q)}</span><span className="faq-toggle">+</span>
            </button>
            <div id="faq-${i}" className="faq-a">${escapeHtml(a)}</div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function gallerySection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.gallery);
  if (items.length === 0) return "";
  const label = variant === "polaroid" ? "polaroid" : "masonry";
  return `
      <section id="gallery" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        ${sectionHeading("gallery", ctx, "Gallery")}
        <div className="${label}">
          ${items.map((g, i) => {
            const title = readStr(g.title ?? g.caption, "");
            const cat = readStr(g.category, "");
            return `
          <div key={${i}} className="gallery-item ${label === "polaroid" ? "polaroid" : ""}" data-image-reveal style={{ background: '${ctx.gradientPrimary}' }}>
            <span className="gallery-letter">{String('${escapeHtml(title || "Art")}').charAt(0).toUpperCase()}</span>
            <div className="gallery-cap"><span>${escapeHtml(title)}</span>${cat ? `<small>${escapeHtml(cat)}</small>` : ""}</div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function timelineSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const items = readArr(data.sections?.timeline);
  if (items.length === 0) return "";
  return `
      <section id="timeline" style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        ${sectionHeading("timeline", ctx, "Journey")}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          ${items.map((t, i) => {
            const title = readStr(t.title ?? t.milestone ?? t.event, "");
            const desc = readStr(t.description ?? t.date ?? "", "");
            const date = readStr(t.date ?? "", "");
            return `
          <div key={${i}} className="timeline-row">
            <span className="tl-dot" style={{ background: '${ctx.primary}' }} />
            <div className="glass-card" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <h3 className="card-title">${escapeHtml(title)}</h3>
                ${date ? `<span className="date-tag">${escapeHtml(date)}</span>` : ""}
              </div>
              ${desc ? `<p className="card-desc${descClamp(desc, 4)}">${escapeHtml(desc)}</p>` : ""}
            </div>
          </div>`;
          }).join("")}
        </div>
      </section>`;
}

function socialLinksSection(ctx: Ctx, data: PortfolioData): string {
  const items = readArr(data.sections?.socialLinks);
  if (items.length === 0) return "";
  return `
      <section id="socialLinks" data-fade style={{ padding: '${ctx.spacing16} 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          ${items.map((s, i) => {
            const platform = readStr(s.platform, "link");
            const url = readStr(s.url, "#");
            return `
          <a key={${i}} href="${escapeAttr(url)}" target="_blank" rel="noreferrer" className="social-chip">${escapeHtml(platform)}</a>`;
          }).join("")}
        </div>
      </section>`;
}

function contactSection(ctx: Ctx, variant: string, data: PortfolioData): string {
  const email = readStr(data.personalInfo?.email, "");
  const phone = readStr(data.personalInfo?.phone, "");
  const contact = readObj(data.sections?.contact);
  const location = readStr(contact.location ?? data.personalInfo?.location, "");
  const availableFor = readStr(contact.availableFor, "");
  const socials = readArr(data.sections?.socialLinks);

  const details = [
    email ? { label: "Email", value: email, href: `mailto:${email}` } : null,
    phone ? { label: "Phone", value: phone, href: `tel:${phone}` } : null,
    location ? { label: "Location", value: location, href: "" } : null,
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return `
      <section id="contact" data-fade style={{ padding: '${ctx.spacing20} 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-card contact-card">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>Let's Work Together</h2>
          <p className="card-desc" style={{ maxWidth: '520px', margin: '0 auto 2rem' }}>
            ${escapeHtml(availableFor || (location ? "Based in " + location + ". Open to new opportunities and interesting collaborations." : "Have a project in mind? Let's build something amazing together."))}
          </p>

          <div className="contact-details">
            ${details.map((d, i) => `
            <div key={${i}} className="contact-detail">
              <span className="contact-detail-label">${escapeHtml(d.label)}</span>
              ${d.href ? `<a className="contact-detail-value" href="${escapeAttr(d.href)}">${escapeHtml(d.value)}</a>` : `<span className="contact-detail-value">${escapeHtml(d.value)}</span>`}
            </div>`).join("")}
            ${socials.length ? `
            <div key="socials" className="contact-detail">
              <span className="contact-detail-label">Socials</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                ${socials.map((s, j) => {
                  const platform = readStr(s.platform, "link");
                  const url = readStr(s.url, "#");
                  return `<a key={${j}} href="${escapeAttr(url)}" target="_blank" rel="noreferrer" className="social-chip">${escapeHtml(platform)}</a>`;
                }).join("")}
              </div>
            </div>` : ""}
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <input className="field" type="text" placeholder="Your name" aria-label="Your name" />
              <input className="field" type="email" placeholder="Your email" aria-label="Your email" />
            </div>
            <textarea className="field" rows={4} placeholder="Tell me about your project..." aria-label="Message" />
            <button type="submit" className="btn-primary magnetic" onClick={() => {}}>Send Message <span style={{ fontSize: '0.875rem' }}>→</span></button>
          </form>
        </div>
      </section>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

function buildAppTsx(data: PortfolioData, composition?: CompositionGraph | null): string {
  const ctx = buildCtx(composition);
  const motion = composition?.motion;
  const useGsap = motion?.library === "gsap" || motion?.gsap?.smoothScroll;

  const sections = composition?.sections?.length
    ? composition.sections
    : DEFAULT_ORDER.map((id) => ({ id } as unknown as ComposedSection));

  const sectionOrder = sections.map((s) => s.id);
  const horizontal = composition?.layout?.style === "horizontal-scroll";

  const sectionMarkup = sections.map((section) => {
    const id = section.id;
    const variant = section.variant ?? "";
    switch (id) {
      case "hero": return heroSection(ctx, variant, Boolean(motion?.gsap?.parallax));
      case "about": return aboutSection(ctx, variant, data);
      case "skills": return skillsSection(ctx, variant, data);
      case "projects": return projectsSection(ctx, variant, data);
      case "experience": return experienceSection(ctx, variant, data);
      case "education": return educationSection(ctx, variant, data);
      case "metrics": return metricsSection(ctx, variant, data);
      case "testimonials": return testimonialsSection(ctx, variant, data);
      case "services": return servicesSection(ctx, variant, data);
      case "faq": return faqSection(ctx, variant, data);
      case "gallery": return gallerySection(ctx, variant, data);
      case "timeline": return timelineSection(ctx, variant, data);
      case "contact": return contactSection(ctx, variant, data);
      case "socialLinks": return socialLinksSection(ctx, data);
      default: return cardGrid(id, ctx, data);
    }
  }).join("\n");

  const nav = buildNav(composition, sectionOrder, ctx);

  const mainStyle = horizontal
    ? `display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth'`
    : "";

  const containerClass = horizontal ? "hs-main" : "";
  const sectionClass = horizontal ? "hs-section" : "";

  const typedRole = useGsap || motion?.style !== "none" ? `
function TypedRole({ role, primary }) {
  const [text, setText] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setText(role.slice(0, i));
      if (i >= role.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [role]);
  return <h2 style={{ color: primary, fontFamily: "${ctx.headingFont}", fontSize: 'clamp(1.25rem, 3vw, 2rem)', marginTop: '0.75rem', minHeight: '2.2em' }}>{text}</h2>;
}` : `function TypedRole() { return null; }`;

  return `import React, { useEffect, useRef, useState } from "react";

const DATA = ${dataJs(data)};

${typedRole}

function MagneticButton({ children, style, className, href }) {
  const ref = useRef(null);
  ${motion?.gsap?.magneticButtons ? `
  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    import('https://esm.sh/gsap').then(mod => {
      const gsap = mod.default;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }));
    });
  }, []);` : ''}
  const Tag = href ? 'a' : 'button';
  return <Tag ref={ref} href={href} className={'magnetic ' + (className || '')} style={{ ...style, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)' }}>{children}</Tag>;
}

export default function App() {
  ${gsapScript(ctx, composition)}

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ fontFamily: "${ctx.bodyFont}", color: '${ctx.text}', background: '${ctx.bg}', minHeight: '100vh', lineHeight: 1.5, WebkitFontSmoothing: 'antialiased', isolation: 'isolate' }}>
      ${ctx.bgDecoration}

      ${motion?.gsap?.floatingElements ? `
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="float-el" style={{ position: 'absolute', top: '16%', left: '8%', width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '${ctx.primary}2e', filter: 'blur(10px)' }} />
        <div className="float-el" style={{ position: 'absolute', top: '64%', left: '82%', width: '5rem', height: '5rem', borderRadius: '50%', background: '${ctx.accent}2e', filter: 'blur(14px)' }} />
        <div className="float-el" style={{ position: 'absolute', top: '78%', left: '16%', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '${ctx.secondary}2e', filter: 'blur(8px)' }} />
      </div>` : ''}

      <style>{\`
        @keyframes meshDrift { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(5%,3%) scale(1.05); } 66% { transform: translate(-3%,5%) scale(0.95); } }
        @keyframes blob { 0%, 100% { transform: translate(0,0) scale(1); } 25% { transform: translate(5%,-3%) scale(1.05); } 50% { transform: translate(-2%,4%) scale(0.95); } 75% { transform: translate(3%,-2%) scale(1.02); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes hue { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; overflow-x: clip; }
        body { font-family: ${ctx.bodyFont}; background: ${ctx.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-wrap: break-word; word-break: break-word; }
        img, svg, video, iframe { max-width: 100%; }
        .card-title, .card-desc, .about-text, .about-intro, .hero-title, .hero-tagline, .sec-sub, .strength-label, .strength-detail, .contact-detail-value { overflow-wrap: break-word; word-break: break-word; min-width: 0; }
        .clamp-2, .clamp-3, .clamp-4, .clamp-5, .clamp-6 { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        .clamp-2 { -webkit-line-clamp: 2; } .clamp-3 { -webkit-line-clamp: 3; } .clamp-4 { -webkit-line-clamp: 4; } .clamp-5 { -webkit-line-clamp: 5; } .clamp-6 { -webkit-line-clamp: 6; }
        ::selection { background: ${ctx.primary}40; color: ${ctx.text}; }
        a { color: inherit; }

        .custom-cursor { position: fixed; top: 0; left: 0; width: 12px; height: 12px; border-radius: 50%; background: ${ctx.primary}; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: width 0.2s, height 0.2s; }
        .custom-cursor.is-hover { width: 26px; height: 26px; }

        .h-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; gap: 0.25rem; padding: 0.75rem 1.5rem; background: ${ctx.bg}dd; backdropFilter: blur(20px); border-bottom: 1px solid ${ctx.border}30; overflow-x: auto; }
        .h-nav .nav-link { white-space: nowrap; }

        .eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.375rem 1rem; border-radius: 9999px; background: ${ctx.primary}15; border: 1px solid ${ctx.primary}20; color: ${ctx.primary}; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1.25rem; }
        .eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${ctx.primary}; }

        .hero-title { font-family: ${ctx.headingFont}; font-size: clamp(2.5rem, 6.5vw, 5rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.25rem; }
        .hero-tagline { font-size: clamp(1rem, 2vw, 1.2rem); color: ${ctx.textSecondary}; max-width: 620px; margin: 0 auto; line-height: 1.7; }
        .hero-sec { overflow: hidden; }
        .hero-sec.full-screen { min-height: 100vh; }
        .t-char { display: inline-block; }
        .gradient-animate { background: ${ctx.gradientPrimary}; background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: hue 6s ease infinite; }

        .section-title { font-family: ${ctx.headingFont}; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: ${ctx.text}; }

        .sec-head { margin-bottom: 3rem; }
        .sec-head.center { text-align: center; }
        .sec-head.center .sec-divider { margin-left: auto; margin-right: auto; }
        .sec-head.left { text-align: left; }
        .sec-head .eyebrow { margin-bottom: 1rem; }
        .sec-sub { color: ${ctx.textSecondary}; font-size: 0.95rem; line-height: 1.7; max-width: 560px; }
        .sec-head.center .sec-sub { margin-left: auto; margin-right: auto; }
        .sec-divider { width: 56px; height: 3px; border-radius: 9999px; margin-top: 1.25rem; }

        .about-text { color: ${ctx.textSecondary}; font-size: 0.95rem; line-height: 1.8; }
        .about-intro { font-family: ${ctx.headingFont}; color: ${ctx.text}; font-size: 1.25rem; font-weight: 600; line-height: 1.6; letter-spacing: -0.01em; margin-bottom: 1rem; }
        .about-visual { border: 1px solid ${ctx.border}40; border-radius: ${ctx.radius2xl}; padding: 2rem; background: linear-gradient(160deg, ${ctx.card}, transparent); position: relative; overflow: hidden; }
        .about-initial { width: 4.5rem; height: 4.5rem; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; font-family: ${ctx.headingFont}; font-size: 2.25rem; font-weight: 800; color: #fff; box-shadow: 0 8px 32px ${ctx.primary}40; }
        .about-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1.75rem; }
        .metric-chip { text-align: center; padding: 1rem 0.75rem; border-radius: ${ctx.radiusLg}; background: ${ctx.card}; border: 1px solid var(--mc-border, ${ctx.border}40); transition: transform 0.3s ease, border-color 0.3s ease; }
        .metric-chip:hover { transform: translateY(-3px); border-color: ${ctx.primary}50; }
        .metric-chip-value { display: block; font-family: ${ctx.headingFont}; font-size: 1.5rem; font-weight: 800; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .metric-chip-label { display: block; color: ${ctx.muted}; font-size: 0.7rem; letter-spacing: 0.03em; margin-top: 0.25rem; text-transform: uppercase; }

        .strength-list { display: flex; flex-direction: column; gap: 0.875rem; margin-top: 1.5rem; }
        .strength-item { display: flex; gap: 0.75rem; align-items: flex-start; }
        .strength-check { font-size: 0.875rem; font-weight: 800; margin-top: 0.15rem; }
        .strength-label { color: ${ctx.text}; font-size: 0.875rem; font-weight: 600; }
        .strength-detail { color: ${ctx.muted}; font-size: 0.75rem; margin-top: 0.1rem; }

        .highlight-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin: 1.25rem 0 0; }
        .highlight-item { display: flex; gap: 0.625rem; align-items: flex-start; color: ${ctx.textSecondary}; font-size: 0.85rem; line-height: 1.6; }
        .highlight-bullet { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 0.45rem; box-shadow: 0 0 10px ${ctx.primary}60; }

        .glass-panel { background: rgba(255,255,255,0.04); backdrop-filter: blur(16px); border: 1px solid ${ctx.border}50; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
        .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid ${ctx.border}40; border-radius: ${ctx.radiusXl}; }

        .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.75rem; border-radius: ${ctx.radiusMd}; font-size: 0.875rem; font-weight: 500; border: none; background: ${ctx.gradientPrimary}; color: #fff; cursor: pointer; text-decoration: none; transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: 0 0 20px ${ctx.primary}30; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px ${ctx.primary}50; }
        .btn-outline { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.75rem; border-radius: ${ctx.radiusMd}; font-size: 0.875rem; font-weight: 500; background: transparent; color: ${ctx.text}; border: 1px solid ${ctx.border}; cursor: pointer; text-decoration: none; transition: all 0.25s ease; }
        .btn-outline:hover { border-color: ${ctx.primary}; background: ${ctx.primary}10; }

        .nav-link { color: ${ctx.muted}; text-decoration: none; font-size: 0.8125rem; font-weight: 500; padding: 0.375rem 0.75rem; border-radius: ${ctx.radiusMd}; transition: all 0.25s ease; cursor: pointer; background: transparent; border: none; }
        .nav-link:hover { color: ${ctx.text}; background: ${ctx.card}; }

        .card-title { font-family: ${ctx.headingFont}; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: ${ctx.text}; }
        .card-desc { color: ${ctx.muted}; font-size: 0.82rem; line-height: 1.65; margin-bottom: 1rem; }
        .tag-chip { padding: 0.2rem 0.625rem; border-radius: 9999px; background: ${ctx.primary}12; color: ${ctx.primary}; font-size: 0.6875rem; font-weight: 500; }
        .date-tag { color: ${ctx.primary}; font-size: 0.75rem; font-weight: 500; white-space: nowrap; }
        .text-link { color: ${ctx.primary}; font-size: 0.8125rem; font-weight: 600; text-decoration: none; }

        .tilt-card { transform-style: preserve-3d; }
        .content-card, .project-card, .service-card, .quote-card { background: ${ctx.card}; border: 1px solid ${ctx.border}40; border-radius: ${ctx.radiusXl}; padding: 1.5rem; transition: transform 0.4s cubic-bezier(0.25,0.1,0.25,1), border-color 0.3s ease, box-shadow 0.4s ease, background 0.4s ease; position: relative; overflow: hidden; cursor: pointer; }
        .content-card:hover, .project-card:hover, .service-card:hover, .quote-card:hover { transform: translateY(-4px); border-color: ${ctx.primary}30; box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
        .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .project-card { display: flex; flex-direction: column; }
        .project-card:hover { border-color: ${ctx.primary}40; box-shadow: 0 20px 50px rgba(0,0,0,0.28); }
        .project-card:hover .project-thumb { transform: scale(1.02); }
        .project-thumb { width: 100%; height: 150px; border-radius: ${ctx.radiusMd}; background: ${ctx.gradientPrimary}; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; transition: transform 0.4s cubic-bezier(0.25,0.1,0.25,1); }
        .project-thumb.tall { height: 100%; min-height: 220px; }
        .thumb-chrome { position: absolute; top: 0.625rem; left: 0.625rem; display: flex; gap: 0.3rem; }
        .thumb-chrome span { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: rgba(255,255,255,0.35); }
        .thumb-initial { font-size: 2.5rem; font-weight: 800; color: rgba(255,255,255,0.92); }
        .project-body { display: flex; flex-direction: column; flex: 1; gap: 0.5rem; }
        .project-features { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin: 0.25rem 0 0.75rem; }
        .project-features li { display: flex; gap: 0.5rem; align-items: flex-start; color: ${ctx.textSecondary}; font-size: 0.78rem; line-height: 1.55; }
        .feature-arrow { font-weight: 700; flex-shrink: 0; }
        .project-actions { display: flex; gap: 0.625rem; margin-top: 1.1rem; }
        .btn-sm { padding: 0.55rem 1.1rem; font-size: 0.75rem; }

        .bento { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); grid-auto-rows: minmax(280px, auto); gap: 1.25rem; }
        .bento .project-card:first-child { grid-row: span 2; grid-column: span 2; }

        .case-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
        .case-row.reversed .case-visual { order: 2; }
        .case-visual { border-radius: ${ctx.radius2xl}; min-height: 280px; display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 800; color: rgba(255,255,255,0.85); }
        .case-body .eyebrow { margin-bottom: 0.5rem; }

        .skill-pill { display: inline-flex; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; background: ${ctx.card}; border: 1px solid ${ctx.border}40; color: ${ctx.text}; transition: all 0.25s ease; }
        .skill-pill:hover { background: ${ctx.primary}15; border-color: ${ctx.primary}30; transform: translateY(-1px); }
        .bar-track { height: 8px; border-radius: 9999px; background: ${ctx.card}; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 9999px; width: 0%; transition: width 1.2s cubic-bezier(0.25,0.1,0.25,1); animation: barFill 1.4s cubic-bezier(0.25,0.1,0.25,1) forwards; }
        @keyframes barFill { to { width: var(--bar-w, 80%); } }
        .skill-tile { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; background: ${ctx.card}; border: 1px solid ${ctx.border}40; border-radius: ${ctx.radiusLg}; }
        .skill-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 12px ${ctx.primary}80; }
        .skill-bar-row { margin-bottom: 0.25rem; }
        .skill-cat { margin-bottom: 2.25rem; }
        .skill-cat-label { font-family: ${ctx.headingFont}; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1rem; }
        .skill-card { padding: 1.5rem; }
        .skill-card-head { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.1rem; }
        .skill-card-dot { width: 9px; height: 9px; border-radius: 50%; box-shadow: 0 0 12px ${ctx.primary}80; flex-shrink: 0; }
        .skill-count { margin-left: auto; background: ${ctx.primary}15; color: ${ctx.primary}; font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; }

        .hero-tech { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; margin-top: 2rem; }
        .hero-tech-line { width: 2.5rem; height: 1px; background: linear-gradient(90deg, transparent, ${ctx.primary}); }
        .hero-tech-chip { font-family: ${ctx.monoFont}; font-size: 0.72rem; color: ${ctx.textSecondary}; background: ${ctx.card}; border: 1px solid ${ctx.border}40; border-radius: 9999px; padding: 0.3rem 0.75rem; }

        .dot { position: absolute; left: -1.65rem; top: 0.25rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; border: 2px solid ${ctx.bg}; box-shadow: 0 0 0 2px ${ctx.primary}40; }
        .exp-logo { width: 2.75rem; height: 2.75rem; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; color: #fff; font-family: ${ctx.headingFont}; font-weight: 800; font-size: 1.05rem; flex-shrink: 0; box-shadow: 0 6px 20px ${ctx.primary}35; }
        .now-pill { display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #fff; background: ${ctx.primary}; border-radius: 9999px; padding: 0.1rem 0.5rem; margin-left: 0.5rem; vertical-align: middle; }

        .metric-card { text-align: center; padding: 2rem 1rem; border: 1px solid ${ctx.border}40; border-radius: ${ctx.radius2xl}; background: ${ctx.card}; }
        .metric-value { display: block; font-family: ${ctx.headingFont}; font-size: 2rem; font-weight: 800; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .metric-label { color: ${ctx.muted}; font-size: 0.8125rem; margin-top: 0.5rem; display: block; }

        .quote-card { position: relative; }
        .quote-mark { font-size: 3rem; line-height: 1; height: 1.5rem; margin-bottom: 1rem; }

        .service-icon { width: 2.5rem; height: 2.5rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 1rem; }

        .faq-item { background: ${ctx.card}; border: 1px solid ${ctx.border}40; border-radius: ${ctx.radiusLg}; overflow: hidden; }
        .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.1rem 1.25rem; background: transparent; border: none; color: ${ctx.text}; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; text-align: left; }
        .faq-toggle { color: ${ctx.primary}; font-size: 1.25rem; transition: transform 0.3s ease; }
        .faq-a { max-height: 0; overflow: hidden; color: ${ctx.muted}; font-size: 0.82rem; line-height: 1.7; padding: 0 1.25rem; transition: max-height 0.35s ease, padding 0.35s ease; }
        .faq-item.open .faq-a { max-height: 400px; padding: 0 1.25rem 1.1rem; }
        .faq-item.open .faq-toggle { transform: rotate(45deg); }

        .masonry, .polaroid { columns: 3 280px; column-gap: 1.25rem; }
        .gallery-item { position: relative; break-inside: avoid; margin-bottom: 1.25rem; min-height: 220px; border-radius: ${ctx.radiusXl}; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .gallery-letter { font-size: 3.5rem; font-weight: 800; color: rgba(255,255,255,0.85); }
        .gallery-cap { position: absolute; inset: auto 0 0 0; padding: 0.75rem 1rem; background: linear-gradient(0deg, rgba(0,0,0,0.6), transparent); color: #fff; font-size: 0.8125rem; font-weight: 600; }
        .gallery-cap small { display: block; color: rgba(255,255,255,0.7); font-weight: 400; }
        .polaroid { background: ${ctx.card}; padding: 0.75rem 0.75rem 1.25rem; border-radius: ${ctx.radiusMd}; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .polaroid .gallery-letter { color: ${ctx.primary}; }

        .timeline-row { display: flex; gap: 1.25rem; align-items: flex-start; }
        .tl-dot { margin-top: 0.6rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 0 3px ${ctx.primary}25; }

        .social-chip { display: inline-flex; padding: 0.5rem 1rem; border-radius: 9999px; background: ${ctx.card}; border: 1px solid ${ctx.border}40; color: ${ctx.text}; font-size: 0.8125rem; font-weight: 500; text-decoration: none; transition: all 0.25s ease; }
        .social-chip:hover { background: ${ctx.primary}; color: #fff; border-color: ${ctx.primary}; }

        .contact-card { text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, ${ctx.card}, ${ctx.cardHover}); }
        .contact-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; max-width: 560px; margin: 0 auto 2rem; }
        .contact-detail { background: ${ctx.bg}66; border: 1px solid ${ctx.border}30; border-radius: ${ctx.radiusLg}; padding: 1rem; }
        .contact-detail-label { display: block; color: ${ctx.muted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; }
        .contact-detail-value { color: ${ctx.text}; font-size: 0.875rem; font-weight: 500; text-decoration: none; word-break: break-word; }
        .contact-form { display: flex; flex-direction: column; gap: 0.875rem; max-width: 560px; margin: 0 auto; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
        .field { width: 100%; padding: 0.875rem 1.1rem; border-radius: ${ctx.radiusMd}; border: 1px solid ${ctx.border}50; background: ${ctx.bg}88; color: ${ctx.text}; font-family: inherit; font-size: 0.875rem; outline: none; transition: border-color 0.25s ease, box-shadow 0.25s ease; }
        .field:focus { border-color: ${ctx.primary}70; box-shadow: 0 0 0 3px ${ctx.primary}20; }
        .field::placeholder { color: ${ctx.muted}; }
        .contact-form .btn-primary { margin: 0.5rem auto 0; }

        .scroll-hint { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.5; animation: float 3s ease-in-out infinite; }
        .scroll-hint span { font-size: 0.625rem; color: ${ctx.muted}; text-transform: uppercase; letter-spacing: 0.15em; }

        .hs-main { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
        .hs-section { min-width: 100vw; scroll-snap-align: start; flex-shrink: 0; }
        .hs-track::-webkit-scrollbar { height: 6px; }

        @media (max-width: 900px) {
          .case-row { grid-template-columns: 1fr; }
          .case-row.reversed .case-visual { order: 0; }
          .masonry, .polaroid { columns: 2 220px; }
        }
        @media (max-width: 640px) {
          .masonry, .polaroid { columns: 1; }
          .bento { grid-template-columns: 1fr; }
          .bento .project-card:first-child { grid-column: span 1; }
          .form-row { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
          html { scroll-behavior: auto; }
        }
      \`}</style>

      ${nav}

      <main className="${containerClass}" ${mainStyle ? `style={{ ${mainStyle} }}` : ""}>
        ${sectionMarkup.replace(/<section /g, `<section className="${sectionClass}" `).split(horizontal ? "</section>" : "____").join(horizontal ? "</section>" : "____")}
      </main>

      <footer style={{ borderTop: '1px solid ${ctx.border}30', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '${ctx.muted}', letterSpacing: '0.05em' }}>
          &copy; ${new Date().getFullYear()} {DATA.personalInfo.name || 'Portfolio'}. Built with passion.
        </p>
      </footer>
    </div>
  );
}
`;
}

function buildPackageJson(composition?: CompositionGraph | null): string {
  const motion = composition?.motion;
  const useGsap = motion?.library === "gsap" || motion?.gsap?.smoothScroll;

  return JSON.stringify({
    name: "portfolio",
    version: "1.0.0",
    private: true,
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      ...(useGsap ? { gsap: "^3.12.0" } : {}),
    },
  }, null, 2);
}

function buildIndexHtml(composition?: CompositionGraph | null): string {
  const theme = composition?.theme;
  const bodyFont = theme?.typography?.bodyFont ?? "'Inter', sans-serif";
  const headingFont = theme?.typography?.headingFont ?? "'Inter', sans-serif";

  const headingFamily = headingFont.split(",")[0].replace(/'/g, "").trim();
  const bodyFamily = bodyFont.split(",")[0].replace(/'/g, "").trim();

  const googleFont = (headingFamily !== bodyFamily)
    ? `https://fonts.googleapis.com/css2?family=${headingFamily.replace(/\s+/g, "+")}:wght@400;500;600;700;800&family=${bodyFamily.replace(/\s+/g, "+")}:wght@400;500;600;700;800&display=swap`
    : `https://fonts.googleapis.com/css2?family=${headingFamily.replace(/\s+/g, "+")}:wght@400;500;600;700;800&display=swap`;

  const isGoogleFont = !headingFamily.includes("system-ui") && !headingFamily.includes("sans-serif") && !headingFamily.includes("serif") && !headingFamily.includes("monospace");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio</title>
  ${isGoogleFont ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${googleFont}" rel="stylesheet" />` : ''}
  <link rel="stylesheet" href="./globals.css" />
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
}

function buildIndexTsx(): string {
  return `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
`;
}

export function buildSandpackResponse(data: PortfolioData, composition?: CompositionGraph | null): SandpackResponse {
  const globalsCss = composition?.theme ? buildGlobalsCss(composedThemeToTokens(composition.theme)) : "";

  return {
    files: {
      "/App.tsx": { code: buildAppTsx(data, composition), language: "typescript" },
      "/index.tsx": { code: buildIndexTsx(), language: "typescript" },
      "/index.html": { code: buildIndexHtml(composition), language: "html" },
      "/globals.css": { code: globalsCss, language: "css" },
      "/package.json": { code: buildPackageJson(composition), language: "json" },
    },
    entry: "/index.tsx",
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      ...(composition?.motion?.library === "gsap" ? { gsap: "^3.12.0" } : {}),
    },
  };
}
