import type { GeneratorContext, GeneratedFile } from "./types";

export function generateLayoutFiles(ctx: GeneratorContext): GeneratedFile[] {
  const mainLayout = generateMainLayout(ctx);
  const sectionLayout = generateSectionLayout(ctx);
  return [mainLayout, sectionLayout];
}

function generateMainLayout(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const layout = manifest.composedLayout;

  const containerClasses = `mx-auto px-6 ${layout.containerWidth}`;
  const layoutClasses = `min-h-screen ${layout.cssStrategy}`;

  const content = `import type { ReactNode } from "react";
import { cn } from "${ctx.utilsDir}/cn";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("${layoutClasses}", className)}>
      <div className="${containerClasses}">
        {children}
      </div>
    </div>
  );
}

export function SectionContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("${containerClasses}", className)}>
      {children}
    </div>
  );
}

export function GridContainer({ children, className, cols = 12 }: { children: ReactNode; className?: string; cols?: number }) {
  return (
    <div className={cn("${layout.gridStrategy}", className)} style={{ gridTemplateColumns: \`repeat(\${cols}, minmax(0, 1fr))\` }}>
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

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function Section({ id, children, className, fullHeight }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full ${rhythm}",
        fullHeight && "min-h-screen flex items-center",
        className
      )}
      aria-labelledby={\`\${id}-heading\`}
    >
      {children}
    </section>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-7xl px-6", className)}>
      {children}
    </div>
  );
}

export function SplitLayout({ left, right, className }: { left: ReactNode; right: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-12 md:grid-cols-2 md:items-center", className)}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
`;
  return { path: `${ctx.libDir}/section-layout.tsx`, content, type: "layout" };
}
