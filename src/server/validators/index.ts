import { z } from "zod";

export const GenerateSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(2000, "Prompt must be at most 2000 characters"),
  template: z.string().optional(),
});

export const ImproveSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio ID"),
  instruction: z
    .string()
    .min(5, "Instruction must be at least 5 characters")
    .max(1000, "Instruction must be at most 1000 characters"),
});

export const RegenerateSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio ID"),
  section: z.string().min(1, "Section is required"),
  instruction: z.string().max(1000).optional(),
});

export const ExportSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio ID"),
  format: z.enum(["html", "json", "zip"]).default("html"),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
export type ImproveInput = z.infer<typeof ImproveSchema>;
export type RegenerateInput = z.infer<typeof RegenerateSchema>;
export type ExportInput = z.infer<typeof ExportSchema>;
