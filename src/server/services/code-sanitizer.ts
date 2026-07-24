import { logger } from "@/server/utils";

export function sanitizeCode(raw: string): string {
  let code = raw;

  code = code.replace(/```(?:tsx?|jsx?|javascript|typescript)?\s*\n?/g, "");
  code = code.replace(/\n?\s*```/g, "");

  code = code.replace(/^Here (?:is|are) (?:the )?(?:complete |full )?(?:code|component|portfolio)[\s\S]*?:\n*/im, "");
  code = code.replace(/^The (?:above|following) (?:code|component)[\s\S]*?:\n*/im, "");
  code = code.replace(/^This (?:is|code|component)[\s\S]*?:\n*/im, "");

  code = code.replace(/^\s*Note:.*$/gm, "");
  code = code.replace(/^\s*Explanation:.*$/gm, "");
  code = code.replace(/^\s*Summary:.*$/gm, "");
  code = code.replace(/^\s*\/\/.*$/gm, "");
  code = code.replace(/<!--[\s\S]*?-->/g, "");

  code = code.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");

  code = code.replace(/\n{3,}/g, "\n\n");

  code = code.trim();

  logger.debug(`Sanitized code: ${raw.length} -> ${code.length} chars`, "CodeSanitizer");

  return code;
}
