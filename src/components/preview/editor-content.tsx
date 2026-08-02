"use client";

import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/portfolio/store";

interface EditorContentProps {
  className?: string;
}

function tokenizeCode(code: string): { indent: number; tokens: { text: string; color: string }[] }[] {
  const lines = code.split("\n");
  return lines.map((line) => {
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();
    if (!trimmed) return { indent: 0, tokens: [] };

    const tokens: { text: string; color: string }[] = [];
    const keywords = ["import", "export", "from", "default", "return", "const", "let", "function", "class", "if", "else"];
    const components = /<\/?[A-Z][a-zA-Z0-9.]*|<(?:section|div|span|h[1-6]|p|a|ul|li|nav|header|footer|main|article|aside|img|input|button|form)\b/g;
    let remaining = trimmed;

    while (remaining.length > 0) {
      const kwMatch = remaining.match(/^(import|export|from|default|return|const|let|function)\b/);
      if (kwMatch) {
        tokens.push({ text: kwMatch[0], color: "text-[#c678dd]" });
        remaining = remaining.slice(kwMatch[0].length);
        continue;
      }
      if (remaining[0] === "'" || remaining[0] === '"') {
        const quote = remaining[0];
        const end = remaining.indexOf(quote, 1);
        const str = end === -1 ? remaining : remaining.slice(0, end + 1);
        tokens.push({ text: str, color: "text-[#98c379]" });
        remaining = remaining.slice(str.length);
        continue;
      }
      if (/^[A-Z]/.test(remaining)) {
        const match = remaining.match(/^[A-Z][a-zA-Z0-9]*/);
        if (match) {
          tokens.push({ text: match[0], color: "text-[#e5c07b]" });
          remaining = remaining.slice(match[0].length);
          continue;
        }
      }
      if (remaining.startsWith("=>")) {
        tokens.push({ text: "=>", color: "text-[#c678dd]" });
        remaining = remaining.slice(2);
        continue;
      }
      if (remaining[0] === "{") {
        tokens.push({ text: "{", color: "text-[#e06c75]" });
        remaining = remaining.slice(1);
        continue;
      }
      tokens.push({ text: remaining[0], color: "text-white" });
      remaining = remaining.slice(1);
    }

    return { indent: Math.floor(indent / 2), tokens };
  });
}

export function EditorContent({ className }: EditorContentProps) {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const personalInfo = portfolio?.personalInfo as Record<string, unknown> | undefined;
  const sections = (portfolio?.sections as Record<string, unknown>) || {};

  const name = (personalInfo?.name as string) || "Developer";
  const role = (personalInfo?.role as string) || "Developer";
  const hero = (sections.hero as Record<string, unknown>) || {};
  const headline = (hero.headline as string) || `Hi, I'm ${name}`;
  const skills = (sections.skills as { name: string }[]) || [];
  const projects = (sections.projects as { title: string }[]) || [];

  const code = [
    `import { Hero } from "@/components/sections/Hero";`,
    `import { About } from "@/components/sections/About";`,
    `import { Projects } from "@/components/sections/Projects";`,
    `import { Skills } from "@/components/sections/Skills";`,
    `import { Contact } from "@/components/sections/Contact";`,
    ``,
    `// ${role} Portfolio`,
    `// ${name}`,
    ``,
    `export default function Portfolio() {`,
    `  return (`,
    `    <main className="min-h-screen bg-bg">`,
    `      <Hero headline="${headline}" />`,
    `      <About />`,
    projects.length > 0 ? `      <Projects count={${projects.length}} />` : `      <Projects />`,
    skills.length > 0 ? `      <Skills count={${skills.length}} />` : `      <Skills />`,
    `      <Contact />`,
    `    </main>`,
    `  );`,
    `}`,
  ];

  const codeLines = tokenizeCode(code.join("\n"));

  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div className="p-4 font-mono text-[11px] leading-[1.7]">
        {codeLines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            <span className="w-8 shrink-0 text-right text-text-muted/40 select-none pr-4">
              {lineIdx + 1}
            </span>
            <span className="flex-1">
              {line.tokens.map((token, tokenIdx) => (
                <span key={tokenIdx} className={token.color}>
                  {"  ".repeat(line.indent)}
                  {token.text}
                </span>
              ))}
              {line.tokens.length === 0 && "\u00A0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
