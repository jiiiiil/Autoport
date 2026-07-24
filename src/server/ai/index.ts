import type { AIProvider } from "./provider";
import { GeminiProvider } from "./gemini-provider";
import { MockAIProvider } from "./mock-provider";
import { getEnv } from "@/server/config";

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;
  const env = getEnv();
  _provider = env.GEMINI_API_KEY ? new GeminiProvider() : new MockAIProvider();
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}

export type { AIProvider } from "./provider";
