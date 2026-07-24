import { logger } from "@/server/utils";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const MARKDOWN_FENCE_REGEX = /^```[\s\S]*?^```/gm;
const EXPLANATION_PATTERNS = [
  /^Here (?:is|are)/im,
  /^The (?:above|following)/im,
  /^This (?:is|code|component)/im,
  /^```/,
  /^<!--/,
  /^\s*\/\//,
  /^Note:/im,
  /^Explanation:/im,
  /^Summary:/im,
];

export function validateCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!code || code.trim().length === 0) {
    return { valid: false, errors: ["Empty code"], warnings: [] };
  }

  if (MARKDOWN_FENCE_REGEX.test(code)) {
    errors.push("Code contains markdown fences");
  }

  for (const pattern of EXPLANATION_PATTERNS) {
    if (pattern.test(code)) {
      warnings.push(`Code may contain explanations (pattern: ${pattern.source.slice(0, 30)})`);
    }
  }

  if (!code.includes("export") && !code.includes("function") && !code.includes("const")) {
    warnings.push("Code does not appear to contain exports or component definitions");
  }

  const hasJsx = /<[A-Z][\s\S]*?>/.test(code) || /className=/.test(code);
  if (!hasJsx) {
    warnings.push("Code does not appear to contain JSX");
  }

  const openBraces = (code.match(/{/g) ?? []).length;
  const closeBraces = (code.match(/}/g) ?? []).length;
  if (Math.abs(openBraces - closeBraces) > 2) {
    warnings.push("Unbalanced braces detected");
  }

  const openParens = (code.match(/\(/g) ?? []).length;
  const closeParens = (code.match(/\)/g) ?? []).length;
  if (Math.abs(openParens - closeParens) > 2) {
    warnings.push("Unbalanced parentheses detected");
  }

  if (errors.length > 0) {
    logger.warn(`Code validation failed: ${errors.join(", ")}`, "CodeValidator");
  }
  if (warnings.length > 0) {
    logger.debug(`Code validation warnings: ${warnings.join(", ")}`, "CodeValidator");
  }

  return { valid: errors.length === 0, errors, warnings };
}
