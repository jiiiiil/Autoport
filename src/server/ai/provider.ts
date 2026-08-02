import type { PortfolioData } from "@/server/types";
import type { CompositionGraph } from "./composition/types";
import type { AIContextObject } from "./intelligence/types";
import type { DiscoveryAnalysis, DiscoveryQuestion, UserProfile } from "@/server/discovery/types";
import type { PortfolioStrategy, SelfReviewResult } from "@/server/strategy/types";

export interface AIProvider {
  generatePortfolio(prompt: string): Promise<PortfolioData>;
  generateCompositionGraph(prompt: string, aiContext: AIContextObject): Promise<CompositionGraph>;
  generatePortfolioData(prompt: string, composition: CompositionGraph): Promise<PortfolioData>;
  improvePortfolio(portfolioData: PortfolioData, instruction: string): Promise<PortfolioData>;
  regenerateSection(portfolioData: PortfolioData, section: string, instruction?: string): Promise<PortfolioData>;
  generateProject(description: string): Promise<Record<string, unknown>>;

  // Discovery Phase
  analyzePrompt(prompt: string): Promise<DiscoveryAnalysis>;
  generateQuestions(profile: Partial<UserProfile>, missingFields: string[]): Promise<DiscoveryQuestion[]>;
  processAnswer(profile: Partial<UserProfile>, question: DiscoveryQuestion, answer: string | string[]): Promise<Partial<UserProfile>>;

  // Strategy Phase
  generateStrategy(profile: Partial<UserProfile>): Promise<PortfolioStrategy>;
  selfReview(strategy: PortfolioStrategy, profile: Partial<UserProfile>): Promise<SelfReviewResult>;
}
