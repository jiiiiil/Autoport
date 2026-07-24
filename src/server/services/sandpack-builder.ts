import type { PortfolioData } from "@/server/types";

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

function buildAppTsx(data: PortfolioData): string {
  const name = (data.personalInfo?.name as string) ?? "Developer";
  const role = (data.personalInfo?.role as string) ?? "Developer";
  const tagline = (data.personalInfo?.tagline as string) ?? "";
  const bio = (data.personalInfo?.bio as string) ?? "";
  const contactEmail = (data.personalInfo?.email as string) ?? "";
  const theme = data.theme?.mode ?? "dark";

  const skills = (data.sections?.skills as Array<Record<string, unknown>> ?? []);
  const projects = (data.sections?.projects as Array<Record<string, unknown>> ?? []);
  const experience = (data.sections?.experience as Array<Record<string, unknown>> ?? []);

  return `import React from "react";

const skills = ${JSON.stringify(skills, null, 2)};

const projects = ${JSON.stringify(projects, null, 2)};

const experience = ${JSON.stringify(experience, null, 2)};

const theme = {
  bg: "${theme === "light" ? "#fafafa" : "#0f0f0f"}",
  card: "${theme === "light" ? "#ffffff" : "#1a1a1a"}",
  border: "${theme === "light" ? "#e5e5e5" : "#2a2a2a"}",
  text: "${theme === "light" ? "#171717" : "#ffffff"}",
  muted: "${theme === "light" ? "#737373" : "#a0a0a0"}",
  primary: "#7c3aed",
  accent: "#06b6d4",
};

export default function App() {
  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)", borderBottom: "1px solid " + theme.border, background: theme.bg + "cc", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>${name}</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="#about" style={{ color: theme.muted, fontSize: 12, textDecoration: "none" }}>About</a>
          <a href="#skills" style={{ color: theme.muted, fontSize: 12, textDecoration: "none" }}>Skills</a>
          <a href="#projects" style={{ color: theme.muted, fontSize: 12, textDecoration: "none" }}>Projects</a>
          <a href="#contact" style={{ color: theme.muted, fontSize: 12, textDecoration: "none" }}>Contact</a>
        </div>
      </nav>

      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em", color: theme.muted, marginBottom: 16 }}>${role}</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Hi, I'm ${name}</h1>
        <p style={{ fontSize: 18, color: theme.muted, maxWidth: 600, marginBottom: 32 }}>${tagline || bio}</p>
        <a href="#projects" style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, " + theme.primary + ", " + theme.accent + ")", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>View My Work</a>
      </section>

      <section id="skills" style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Skills</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {skills.map((s, i) => (
            <span key={i} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid " + theme.border, fontSize: 13, color: theme.muted }}>{s.name}</span>
          ))}
        </div>
      </section>

      <section id="projects" style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Projects</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 12, border: "1px solid " + theme.border, background: theme.card }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: theme.muted, marginBottom: 12 }}>{p.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(p.tags as string[] ?? []).map((t, j) => (
                  <span key={j} style={{ padding: "2px 8px", borderRadius: 4, background: theme.primary + "1a", color: theme.primary, fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Experience</h2>
        <div style={{ borderLeft: "2px solid " + theme.border, paddingLeft: 24 }}>
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 24, position: "relative" }}>
              <div style={{ position: "absolute", left: -29, top: 4, width: 10, height: 10, borderRadius: "50%", border: "2px solid " + theme.primary, background: theme.bg }} />
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>{e.role || e.company}</h3>
              <p style={{ fontSize: 13, color: theme.primary, marginBottom: 4 }}>{e.company}</p>
              <p style={{ fontSize: 12, color: theme.muted }}>{e.startDate} – {e.endDate}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Get in Touch</h2>
        <a href={"mailto:" + contactEmail} style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, " + theme.primary + ", " + theme.accent + ")", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>{contactEmail}</a>
      </section>

      <footer style={{ borderTop: "1px solid " + theme.border, padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: theme.muted }}>&copy; ${new Date().getFullYear()} ${name}</p>
      </footer>
    </div>
  );
}
`;
}

function buildPackageJson(): string {
  return JSON.stringify({
    name: "portfolio",
    version: "1.0.0",
    private: true,
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
  }, null, 2);
}

function buildIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  </style>
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

export function buildSandpackResponse(data: PortfolioData): SandpackResponse {
  return {
    files: {
      "/App.tsx": { code: buildAppTsx(data), language: "typescript" },
      "/index.tsx": { code: buildIndexTsx(), language: "typescript" },
      "/index.html": { code: buildIndexHtml(), language: "html" },
      "/package.json": { code: buildPackageJson(), language: "json" },
    },
    entry: "/index.tsx",
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
  };
}
