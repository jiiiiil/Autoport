import type { PortfolioBlueprint } from "../blueprint/types";

export interface ValidationIssue {
  field: string;
  type: "error" | "warning" | "info";
  message: string;
  fix?: string;
}

export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  score: number;
  completeness: number;
}

export interface ComposedLayout {
  type: string;
  containerWidth: string;
  gridStrategy: string;
  sectionOrder: string[];
  verticalRhythm: string;
  responsiveBreakpoints: Record<string, string>;
  cssStrategy: string;
}

export interface ComposedComponent {
  name: string;
  base: string;
  variant: string;
  elements: string[];
  behavior: string;
  animation: string;
  responsive: string;
  accessibility: string;
}

export interface OptimizedSection {
  id: string;
  name: string;
  component: string;
  variant: string;
  priority: number;
  required: boolean;
  composition: ComposedComponent;
  storytellingRole: string;
  ctaPlacement: string;
  layout: string;
  animation: string;
  content: Record<string, unknown>;
}

export interface NoveltyReport {
  originalityScore: number;
  diversifications: string[];
  uniqueElements: string[];
}

export interface RuntimeDesignTokens {
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  animation: Record<string, string>;
  breakpoints: Record<string, string>;
}

export interface DependencyPlan {
  core: { name: string; version: string; reason: string }[];
  ui: { name: string; version: string; reason: string }[];
  animation: { name: string; version: string; reason: string }[];
  utilities: { name: string; version: string; reason: string }[];
  dev: { name: string; version: string; reason: string }[];
  installOrder: string[];
  configFiles: { name: string; content: string }[];
}

export interface GenerationInstruction {
  id: string;
  phase: string;
  target: string;
  action: string;
  specification: Record<string, unknown>;
  dependencies: string[];
  priority: number;
}

export interface QualityCheck {
  category: string;
  passed: boolean;
  issues: string[];
  severity: "critical" | "major" | "minor";
}

export interface FileStructure {
  root: string;
  srcDir: string;
  publicDir: string;
  componentsDir: string;
  pagesDir: string;
  stylesDir: string;
  libDir: string;
  utilsDir: string;
  typesDir: string;
  assetsDir: string;
  hooksDir: string;
}

export interface ConfigFile {
  name: string;
  content: string;
  purpose: string;
}

export interface AssetRequirement {
  type: string;
  name: string;
  purpose: string;
  required: boolean;
  format: string;
  maxSize: string;
}

export interface EnvironmentVariable {
  name: string;
  description: string;
  required: boolean;
  example: string;
}

export interface ProjectManifest {
  name: string;
  version: string;
  framework: string;
  language: string;
  fileStructure: FileStructure;
  configFiles: ConfigFile[];
  assetRequirements: AssetRequirement[];
  environmentVariables: EnvironmentVariable[];
  scripts: Record<string, string>;
}

export interface BlueprintValidationIssue {
  field: string;
  severity: "critical" | "major" | "minor";
  message: string;
  suggestion: string;
}

export interface ManifestRestriction {
  type: "forbidden" | "required" | "preferred";
  target: string;
  description: string;
}

export interface RestrictionViolation {
  restriction: ManifestRestriction;
  violated: boolean;
  override?: string;
}

export interface AdaptiveReasoning {
  confidence: number;
  adjustments: string[];
  optimizations: string[];
}

export interface QualityCheckResult {
  name: string;
  passed: boolean;
  score: number;
  message: string;
}

export interface AccessibilityResult {
  score: number;
  checks: { name: string; passed: boolean; message: string }[];
  wcagLevel: string;
}

export interface PerformanceResult {
  score: number;
  estimatedBundleSize: string;
  optimizationLevel: string;
  recommendations: string[];
}

export interface QualityGateResult {
  passed: boolean;
  score: number;
  checks: QualityCheckResult[];
  accessibility: AccessibilityResult;
  performance: PerformanceResult;
}

export interface ExecutionManifest {
  blueprint: PortfolioBlueprint;
  optimizedBlueprint: PortfolioBlueprint;
  validation: ValidationReport;
  composedLayout: ComposedLayout;
  composedComponents: Record<string, ComposedComponent>;
  optimizedSections: OptimizedSection[];
  novelty: NoveltyReport;
  designTokens: RuntimeDesignTokens;
  dependencies: DependencyPlan;
  projectManifest: ProjectManifest;
  generationInstructions: GenerationInstruction[];
  qualityGates: QualityCheck[];
  generationOrder: string[];
  metadata: {
    generatedAt: string;
    blueprintVersion: string;
    manifestVersion: string;
    totalInstructions: number;
    estimatedGenerationTime: string;
  };
}
