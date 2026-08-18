import { getEnv } from "@/server/config";
import { AIServiceError, logger } from "@/server/utils";
import type { ResumeJSON, ResumeSourceInfo } from "./types";
import { buildResumeExtractionPrompt } from "./prompts";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;
const TIMEOUT_MS = 90_000;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getModel(): string {
  const env = getEnv();
  const model = env.GROQ_MODEL;
  logger.info(`Runtime Groq model: ${model}`, "ResumeParser");
  
  // Fail-fast validation for deprecated models
  if (model === "llama-3.3-70b-versatile" || model === "llama-3.1-70b-versatile") {
    throw new AIServiceError(`Deprecated Groq model detected: ${model}. Please update GROQ_MODEL to openai/gpt-oss-120b`, true);
  }
  
  return model;
}

async function getApiKey(): Promise<string> {
  const env = getEnv();
  if (!env.GROQ_API_KEY) throw new AIServiceError("GROQ_API_KEY not configured");
  const keyPrefix = env.GROQ_API_KEY.substring(0, 6);
  logger.info(`Groq API key configured: true, prefix: ${keyPrefix}...`, "ResumeParser");
  return env.GROQ_API_KEY;
}

async function chatCompletion(prompt: string, options: { temperature?: number; maxTokens?: number; jsonMode?: boolean } = {}): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new AIServiceError("GROQ_API_KEY not configured");

  const { temperature = 0.1, maxTokens = 4096, jsonMode = true } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const model = getModel();
    logger.info(`Final Groq request model: ${model}`, "ResumeParser");
    const payload: Record<string, unknown> = {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    };
    if (jsonMode) payload.response_format = { type: "json_object" };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new AIServiceError(`Groq API error ${response.status}: ${body}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new AIServiceError("Empty response from Groq");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("rate_limit") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
}

function isPermanentError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("model_decommissioned") || msg.includes("invalid_request_error") || msg.includes("invalid model") || msg.includes("400");
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Fail immediately for permanent configuration errors
      if (isPermanentError(err)) {
        logger.error(`${label} permanent error (no retry): ${lastError.message}`, "ResumeParser");
        if (lastError.message.includes("model_not_found") || lastError.message.includes("does not exist")) {
          throw new AIServiceError("Groq model is unavailable for the configured API key/project. Please verify GROQ_MODEL and Groq model permissions in GroqCloud.", true);
        }
        throw new AIServiceError(`${label} configuration error: ${lastError.message}`, true);
      }
      
      logger.warn(`${label} attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`, "ResumeParser");
      if (attempt < MAX_RETRIES) {
        const waitMs = isRetryable(err) ? Math.min(15000 * Math.pow(2, attempt - 1), 60000) : BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  throw new AIServiceError(`${label} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

function extractJson(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned) as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => asString(v)).filter((v) => v.trim());
  if (typeof value === "string") return [value];
  return [];
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeResume(raw: Record<string, unknown>): Partial<ResumeJSON> {
  const personal = (raw.personal ?? {}) as Record<string, unknown>;
  const experience = Array.isArray(raw.experience) ? (raw.experience as Record<string, unknown>[]) : [];
  const education = Array.isArray(raw.education) ? (raw.education as Record<string, unknown>[]) : [];
  const projects = Array.isArray(raw.projects) ? (raw.projects as Record<string, unknown>[]) : [];
  const skills = Array.isArray(raw.skills) ? (raw.skills as Record<string, unknown>[]) : [];
  const certifications = Array.isArray(raw.certifications) ? (raw.certifications as Record<string, unknown>[]) : [];
  const achievements = Array.isArray(raw.achievements) ? (raw.achievements as Record<string, unknown>[]) : [];
  const awards = Array.isArray(raw.awards) ? (raw.awards as Record<string, unknown>[]) : [];
  const languages = Array.isArray(raw.languages) ? (raw.languages as Record<string, unknown>[]) : [];
  const organizations = Array.isArray(raw.organizations) ? (raw.organizations as Record<string, unknown>[]) : [];
  const volunteer = Array.isArray(raw.volunteerExperience) ? (raw.volunteerExperience as Record<string, unknown>[]) : [];
  const publications = Array.isArray(raw.publications) ? (raw.publications as Record<string, unknown>[]) : [];

  return {
    personal: {
      name: asString(personal.name),
      headline: asString(personal.headline),
      role: asString(personal.role),
      location: asString(personal.location),
      email: asString(personal.email),
      phone: asString(personal.phone),
      linkedin: asString(personal.linkedin),
      github: asString(personal.github),
      website: asString(personal.website),
      summary: asString(personal.summary),
    },
    experience: experience.map((e) => ({
      company: asString(e.company),
      title: asString(e.title) || asString(e.role),
      location: asString(e.location),
      startDate: asString(e.startDate),
      endDate: asString(e.endDate),
      current: asBool(e.current),
      description: asString(e.description),
      highlights: asStringArray(e.highlights),
      technologies: asStringArray(e.technologies),
    })),
    education: education.map((e) => ({
      institution: asString(e.institution),
      degree: asString(e.degree),
      field: asString(e.field),
      startDate: asString(e.startDate),
      endDate: asString(e.endDate),
      score: asString(e.score) || asString(e.gpa),
      description: asString(e.description),
      achievements: asStringArray(e.achievements),
    })),
    projects: projects.map((p) => ({
      name: asString(p.name) || asString(p.title),
      description: asString(p.description),
      link: asString(p.link),
      githubUrl: asString(p.githubUrl),
      technologies: asStringArray(p.technologies),
      highlights: asStringArray(p.highlights),
    })),
    skills: skills.map((g) => ({
      name: asString(g.name) || "Skills",
      skills: asStringArray(g.skills),
    })),
    technologies: asStringArray(raw.technologies),
    languages: languages.map((l) => ({
      language: asString(l.language),
      proficiency: asString(l.proficiency),
    })),
    certifications: certifications.map((c) => ({
      name: asString(c.name),
      issuer: asString(c.issuer),
      date: asString(c.date),
      link: asString(c.link),
    })),
    achievements: achievements.map((a) => ({
      title: asString(a.title),
      description: asString(a.description),
      date: asString(a.date),
    })),
    awards: awards.map((a) => ({
      title: asString(a.title),
      organization: asString(a.organization),
      date: asString(a.date),
      description: asString(a.description),
    })),
    organizations: organizations.map((o) => ({
      name: asString(o.name),
      role: asString(o.role),
      startDate: asString(o.startDate),
      endDate: asString(o.endDate),
      description: asString(o.description),
    })),
    volunteerExperience: volunteer.map((v) => ({
      organization: asString(v.organization),
      role: asString(v.role),
      startDate: asString(v.startDate),
      endDate: asString(v.endDate),
      description: asString(v.description),
    })),
    publications: publications.map((p) => ({
      title: asString(p.title),
      publisher: asString(p.publisher),
      date: asString(p.date),
      link: asString(p.link),
    })),
    courses: asStringArray(raw.courses),
    interests: asStringArray(raw.interests),
  };
}

function detectLinkedInHeuristic(filename: string, text: string): { detectedAsLinkedIn: boolean; confidence: number } {
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes("linkedin")) {
    return { detectedAsLinkedIn: true, confidence: 95 };
  }

  const lowerText = text.toLowerCase();
  let confidence = 0;
  if (/linkedin/.test(lowerText)) confidence += 70;
  if (/\d+ followers|recruiter|connection/i.test(text)) confidence += 25;
  if (/experience\s*[\n\r]/.test(text) && /education/i.test(text)) confidence += 10;
  if (/activity\s*[\n\r]/.test(text)) confidence += 5;

  return { detectedAsLinkedIn: confidence >= 60, confidence: Math.min(confidence, 99) };
}

interface PDFParseClass {
  new (opts: { data: Buffer }): PDFParseInstance;
  setWorker?(workerSrc: string): void;
}

interface PDFParseInstance {
  getText(): Promise<{ text?: string; pages?: Array<unknown> }>;
  destroy(): Promise<void>;
}

async function resolvePdfWorkerUrl(): Promise<string | null> {
  try {
    const path = await import("node:path");
    const fs = await import("node:fs");
    const workerPath = path.join(process.cwd(), "node_modules", "pdf-parse", "dist", "pdf-parse", "web", "pdf.worker.mjs");
    if (!fs.existsSync(workerPath)) return null;
    return "file:///" + workerPath.replace(/\\/g, "/");
  } catch {
    return null;
  }
}

async function loadPdfText(buffer: Buffer): Promise<{ text: string; pages: number }> {
  let PDFParse: PDFParseClass | undefined;
  try {
    const mod = await import("pdf-parse");
    PDFParse = (mod as unknown as { PDFParse?: PDFParseClass }).PDFParse;
  } catch {
    PDFParse = undefined;
  }
  if (!PDFParse) throw new AIServiceError("PDF parsing library unavailable");

  const workerUrl = await resolvePdfWorkerUrl();
  if (workerUrl && typeof PDFParse.setWorker === "function") {
    PDFParse.setWorker(workerUrl);
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return { text: result.text ?? "", pages: result.pages?.length ?? 1 };
  } finally {
    await parser.destroy();
  }
}

export async function extractResumeFromPdf(
  buffer: Buffer,
  filename: string,
  size: number
): Promise<{ resume: ResumeJSON; detectedAsLinkedIn: boolean; pages: number }> {
  try {
    logger.info(`Starting PDF extraction for ${filename} (${size} bytes)`, "ResumeParser");
    const { text, pages } = await loadPdfText(buffer);
    logger.info(`PDF text extracted: ${text.length} chars, ${pages} pages`, "ResumeParser");
    
    if (!text || text.trim().length < 50) {
      throw new AIServiceError("Could not extract readable text from this PDF. Make sure the file is a text-based resume (not scanned images).");
    }

    const heuristic = detectLinkedInHeuristic(filename, text);
    const detectedAsLinkedIn = heuristic.detectedAsLinkedIn;

    logger.info(`Starting AI extraction with Groq`, "ResumeParser");
    const extraction = await withRetry(
      () => chatCompletion(buildResumeExtractionPrompt(text, filename), { temperature: 0.1, maxTokens: 4096 }),
      "resume extraction"
    );
    logger.info(`AI extraction completed`, "ResumeParser");

    const raw = extractJson(extraction);
    const structured = sanitizeResume(raw);

    const source: ResumeSourceInfo = {
      filename,
      format: "application/pdf",
      size,
      detectedAsLinkedIn,
      pages,
      rawTextLength: text.length,
    };

    const resume: ResumeJSON = {
      source,
      personal: structured.personal ?? {},
      experience: structured.experience ?? [],
      education: structured.education ?? [],
      projects: structured.projects ?? [],
      skills: structured.skills ?? [],
      technologies: structured.technologies ?? [],
      languages: structured.languages ?? [],
      certifications: structured.certifications ?? [],
      achievements: structured.achievements ?? [],
      awards: structured.awards ?? [],
      organizations: structured.organizations ?? [],
      volunteerExperience: structured.volunteerExperience ?? [],
      publications: structured.publications ?? [],
      courses: structured.courses ?? [],
      interests: structured.interests ?? [],
      rawText: text,
    };

    return { resume, detectedAsLinkedIn, pages };
  } catch (error) {
    logger.error(`PDF extraction failed: ${error instanceof Error ? error.message : String(error)}`, "ResumeParser", error);
    throw error;
  }
}
