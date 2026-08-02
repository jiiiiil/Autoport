// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";

export function generateLayoutFiles(ctx: GeneratorContext): GeneratedFile[] {
  const mainLayout = generateMainLayout(ctx);
  const sectionLayout = generateSectionLayout(ctx);
  return [mainLayout, sectionLayout];
}

function generateMainLayout(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const layout = manifest.composedLayout;

  const content = `import type { ReactNode } from "react";
import { cn } from "${ctx.utilsDir}/cn";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground antialiased", className)}>
      {children}
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  full: "max-w-full",
};

export function Container({ children, className, size = "lg" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6", containerSizes[size], className)}>
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
}

const gapSizes = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

const colClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

export function Grid({ children, className, cols = 3, gap = "md" }: GridProps) {
  return (
    <div className={cn("grid", colClasses[cols], gapSizes[gap], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  background?: "default" | "muted" | "primary" | "gradient" | "mesh";
}

export function Section({ id, children, className, fullHeight, background = "default" }: SectionProps) {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-foreground/[0.02]",
    primary: "bg-primary/5",
    gradient: "bg-gradient-to-b from-background via-primary/[0.02] to-background",
    mesh: \`relative overflow-hidden before:absolute before:-top-1/4 before:-left-1/4 before:h-1/2 before:w-1/2 before:rounded-full before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:blur-[120px] after:absolute after:-bottom-1/4 after:-right-1/4 after:h-1/2 after:w-1/2 after:rounded-full after:bg-gradient-to-l after:from-accent/10 after:to-transparent after:blur-[120px]\`,
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full py-20 md:py-28",
        bgClasses[background],
        fullHeight && "min-h-screen flex items-center",
        className
      )}
    >
      <Container>
        {children}
      </Container>
    </section>
  );
}

export function SplitLayout({ left, right, className }: { left: ReactNode; right: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-12 lg:grid-cols-2 lg:items-center", className)}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ children, className, span = 1 }: { children: ReactNode; className?: string; span?: 1 | 2 | 3 | 4 }) {
  const spanMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 sm:col-span-2",
    3: "col-span-1 lg:col-span-3",
    4: "col-span-1 sm:col-span-2 lg:col-span-4",
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl hover:-translate-y-0.5",
      spanMap[span],
      className
    )}>
      {children}
    </div>
  );
}
`;
  return { path: `${ctx.libDir}/layout.tsx`, content, type: "layout" };
}

function generateSectionLayout(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const rhythm = manifest.composedLayout.verticalRhythm;

  const content = `import type { ReactNode } from "react";
import { cn } from "${ctx.utilsDir}/cn";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  background?: "default" | "muted" | "gradient" | "grid" | "dots" | "mesh";
}

const bgClasses = {
  default: "",
  muted: "bg-foreground/[0.02]",
  gradient: "bg-gradient-to-b from-background via-primary/[0.02] to-background",
  grid: \`relative before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:60px_60px]\`,
  dots: \`relative before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] before:bg-[size:24px_24px]\`,
  mesh: \`relative before:absolute before:-top-1/4 before:-left-1/4 before:h-1/2 before:w-1/2 before:rounded-full before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:blur-[120px] after:absolute after:-bottom-1/4 after:-right-1/4 after:h-1/2 after:w-1/2 after:rounded-full after:bg-gradient-to-l after:from-accent/10 after:to-transparent after:blur-[120px]\`,
};

export function Section({ id, children, className, fullHeight, background = "default" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full ${rhythm}",
        bgClasses[background],
        fullHeight && "min-h-screen flex items-center",
        className
      )}
      aria-labelledby={\`\${id}-heading\`}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        {children}
      </div>
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ children, className, size = "lg" }: ContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[90rem]",
    full: "max-w-full",
  };
  return (
    <div className={cn("mx-auto w-full px-6", sizes[size], className)}>
      {children}
    </div>
  );
}

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function SplitLayout({ left, right, className, reverse }: SplitLayoutProps) {
  return (
    <div className={cn(
      "grid gap-12 lg:grid-cols-2 lg:items-center",
      reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
      className
    )}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4;
}

export function BentoCard({ children, className, span = 1 }: BentoCardProps) {
  const spans: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 sm:col-span-2",
    3: "col-span-1 lg:col-span-3",
    4: "col-span-1 sm:col-span-2 lg:col-span-4",
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl",
      spans[span],
      className
    )}>
      {children}
    </div>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl hover:-translate-y-0.5",
      className
    )}>
      {children}
    </div>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}

export function GlowButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
`;
  return { path: `${ctx.libDir}/section-layout.tsx`, content, type: "layout" };
}
