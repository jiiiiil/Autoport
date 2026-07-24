import type { PortfolioData } from "@/server/types";

export interface AIProvider {
  generatePortfolio(prompt: string): Promise<PortfolioData>;
  improvePortfolio(portfolioData: PortfolioData, instruction: string): Promise<PortfolioData>;
  regenerateSection(portfolioData: PortfolioData, section: string, instruction?: string): Promise<PortfolioData>;
  generateProject(description: string): Promise<Record<string, unknown>>;
}
