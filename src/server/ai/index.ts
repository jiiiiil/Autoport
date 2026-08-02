import type { AIProvider } from "./provider";
import { GroqProvider } from "./groq-provider";
import { getEnv } from "@/server/config";
import { AIServiceError } from "@/server/utils";

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;
  const env = getEnv();
  if (!env.GROQ_API_KEY) throw new AIServiceError("GROQ_API_KEY not configured. Set it in .env to enable AI generation.");
  _provider = new GroqProvider();
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}

export type { AIProvider } from "./provider";
