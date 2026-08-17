import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name must be at most 80 characters").optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and dashes")
    .optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const UpdatePortfolioSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(80).optional(),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(80)
      .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and dashes")
      .optional(),
    status: z.enum(["draft", "published"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
    path: ["name"],
  });

export type CreatePortfolioInput = z.infer<typeof CreatePortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof UpdatePortfolioSchema>;
