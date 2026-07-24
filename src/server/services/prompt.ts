import { normalizePrompt, sanitizePrompt, extractKeywords } from "@/server/utils";
import { GenerateSchema } from "@/server/validators";

export interface PromptResult {
  normalized: string;
  sanitized: string;
  keywords: string[];
  isValid: boolean;
  errors?: Record<string, string[]>;
}

export const promptService = {
  process(prompt: string): PromptResult {
    const validation = GenerateSchema.safeParse({ prompt });
    if (!validation.success) {
      return {
        normalized: "",
        sanitized: "",
        keywords: [],
        isValid: false,
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const normalized = normalizePrompt(validation.data.prompt);
    const sanitized = sanitizePrompt(normalized);
    const keywords = extractKeywords(sanitized);

    return {
      normalized,
      sanitized,
      keywords,
      isValid: true,
    };
  },

  validate(prompt: string): { valid: boolean; errors?: Record<string, string[]> } {
    const result = this.process(prompt);
    if (result.isValid) return { valid: true };
    return { valid: false, errors: result.errors };
  },

  estimateComplexity(prompt: string): "simple" | "moderate" | "complex" {
    const keywords = extractKeywords(prompt);
    const wordCount = prompt.split(/\s+/).length;

    if (wordCount < 15 && keywords.length < 5) return "simple";
    if (wordCount > 50 || keywords.length > 15) return "complex";
    return "moderate";
  },
};
