export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GenerateRequest {
  prompt: string;
  template?: string;
}

export interface ImproveRequest {
  portfolioId: string;
  instruction: string;
}

export interface RegenerateRequest {
  portfolioId: string;
  section: string;
  instruction?: string;
}

export interface ExportRequest {
  portfolioId: string;
  format: "html" | "json" | "zip";
}

export interface PortfolioData {
  personalInfo?: Record<string, unknown>;
  sections?: Record<string, unknown>;
  theme?: { mode: string };
  layout?: { style: string };
  navigation?: Record<string, unknown>;
  seo?: Record<string, unknown>;
}
