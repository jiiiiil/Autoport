import { GoogleGenAI } from "@google/genai";
import type { AIProvider } from "./provider";
import type { PortfolioData } from "@/server/types";
import { getEnv } from "@/server/config";
import { AIServiceError, logger } from "@/server/utils";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const TIMEOUT_MS = 60_000;
const MODEL = "gemini-2.5-flash";

let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (_client) return _client;
  const env = getEnv();
  if (!env.GEMINI_API_KEY) throw new AIServiceError("GEMINI_API_KEY not configured");
  _client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return _client;
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
        ),
      ]);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logger.warn(`${label} attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`, "GeminiProvider");
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, BASE_DELAY_MS * attempt));
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

function buildPortfolioPrompt(prompt: string): string {
  return `You are an expert React developer. Generate a complete portfolio website as a JSON object.

USER PROMPT: "${prompt}"

Return ONLY a valid JSON object (no markdown, no code fences, no explanations) with this exact structure:
{
  "personalInfo": {
    "name": "string",
    "role": "string",
    "tagline": "string",
    "bio": "string",
    "email": "string",
    "location": "string"
  },
  "sections": {
    "hero": { "headline": "string", "subheadline": "string", "ctaText": "string", "ctaLink": "#projects" },
    "about": { "title": "About Me", "content": "string" },
    "skills": [{ "name": "string", "level": "advanced", "category": "string" }],
    "projects": [{ "title": "string", "description": "string", "tags": ["string"], "link": "string" }],
    "experience": [{ "company": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string" }],
    "education": [{ "institution": "string", "degree": "string", "field": "string", "startDate": "string", "endDate": "string" }],
    "achievements": [{ "title": "string", "description": "string" }],
    "certifications": [{ "name": "string", "issuer": "string", "date": "string" }],
    "socialLinks": [{ "platform": "string", "url": "string" }],
    "contact": { "email": "string", "location": "string", "availableFor": "string" }
  },
  "theme": { "mode": "dark" },
  "layout": { "style": "minimal" },
  "navigation": { "links": [{ "label": "string", "href": "#section" }], "style": "pills" },
  "seo": { "title": "string", "description": "string", "keywords": ["string"] }
}

Rules:
- Generate realistic, complete data based on the user prompt
- Include at least 3 projects, 3 skills, 2 experience entries
- All strings must be meaningful and contextually relevant
- Return ONLY the JSON object, nothing else`;
}

function buildImprovePrompt(portfolioData: PortfolioData, instruction: string): string {
  return `You are an expert React developer. Modify the following portfolio JSON based on the instruction.

CURRENT PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

INSTRUCTION: "${instruction}"

Return the COMPLETE updated portfolio JSON object (same structure). Apply the instruction to modify the relevant parts. Return ONLY the JSON object, nothing else.`;
}

function buildRegeneratePrompt(portfolioData: PortfolioData, section: string, instruction?: string): string {
  return `You are an expert React developer. Regenerate the "${section}" section of this portfolio.

CURRENT PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

${instruction ? `ADDITIONAL INSTRUCTION: "${instruction}"` : "Generate fresh content for this section."}

Return the COMPLETE updated portfolio JSON object with the regenerated "${section}" section. Keep all other sections unchanged. Return ONLY the JSON object, nothing else.`;
}

export class GeminiProvider implements AIProvider {
  async generatePortfolio(prompt: string): Promise<PortfolioData> {
    logger.info(`Gemini generatePortfolio: "${prompt.slice(0, 80)}..."`, "GeminiProvider");
    const client = getClient();
    const response = await withRetry(
      () =>
        client.models.generateContent({
          model: MODEL,
          contents: buildPortfolioPrompt(prompt),
          config: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      "generatePortfolio"
    );
    const text = response.text ?? "";
    if (!text) throw new AIServiceError("Empty response from Gemini");
    return extractJson(text) as PortfolioData;
  }

  async improvePortfolio(portfolioData: PortfolioData, instruction: string): Promise<PortfolioData> {
    logger.info(`Gemini improvePortfolio: "${instruction.slice(0, 80)}..."`, "GeminiProvider");
    const client = getClient();
    const response = await withRetry(
      () =>
        client.models.generateContent({
          model: MODEL,
          contents: buildImprovePrompt(portfolioData, instruction),
          config: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      "improvePortfolio"
    );
    const text = response.text ?? "";
    if (!text) throw new AIServiceError("Empty response from Gemini");
    return extractJson(text) as PortfolioData;
  }

  async regenerateSection(portfolioData: PortfolioData, section: string, instruction?: string): Promise<PortfolioData> {
    logger.info(`Gemini regenerateSection: "${section}"`, "GeminiProvider");
    const client = getClient();
    const response = await withRetry(
      () =>
        client.models.generateContent({
          model: MODEL,
          contents: buildRegeneratePrompt(portfolioData, section, instruction),
          config: { temperature: 0.8, maxOutputTokens: 8192 },
        }),
      "regenerateSection"
    );
    const text = response.text ?? "";
    if (!text) throw new AIServiceError("Empty response from Gemini");
    return extractJson(text) as PortfolioData;
  }

  async generateProject(description: string): Promise<Record<string, unknown>> {
    logger.info(`Gemini generateProject: "${description.slice(0, 50)}..."`, "GeminiProvider");
    const client = getClient();
    const response = await withRetry(
      () =>
        client.models.generateContent({
          model: MODEL,
          contents: `Generate a project entry JSON for: "${description}". Return ONLY: { "title": "string", "description": "string", "tags": ["string"], "link": "string" }`,
          config: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      "generateProject"
    );
    const text = response.text ?? "";
    if (!text) throw new AIServiceError("Empty response from Gemini");
    return extractJson(text);
  }

  async *generatePortfolioStream(prompt: string): AsyncGenerator<string> {
    logger.info(`Gemini generatePortfolioStream: "${prompt.slice(0, 80)}..."`, "GeminiProvider");
    const client = getClient();
    const response = await client.models.generateContentStream({
      model: MODEL,
      contents: buildPortfolioPrompt(prompt),
      config: { temperature: 0.7, maxOutputTokens: 8192 },
    });
    for await (const chunk of response) {
      const text = chunk.text ?? "";
      if (text) yield text;
    }
  }
}
