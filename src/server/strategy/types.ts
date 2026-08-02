export interface PortfolioStrategy {
  designLanguage: string;
  style: string;
  theme: string;
  themeMode: "dark" | "light";
  colorPalette: string[];
  typography: {
    heading: string;
    body: string;
    accent?: string;
  };
  spacing: string;
  layout: string;
  layoutArchitecture: string;
  visualHierarchy: string;
  cardStyle: string;
  interactionModel: string;
  backgroundSystem: string;
  animation: string;
  motionLanguage: string[];
  storytellingFlow: string[];
  componentTree: string[];
  sections: number;
  audience: string;
  careerGoal: string;
  estimatedBuildTime: string;
}

export interface SelfReviewResult {
  passed: boolean;
  memorable: number;
  handcrafted: number;
  awardWorthy: number;
  premiumAgency: number;
  issues: string[];
  improvements: string[];
}
