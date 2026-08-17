import { z } from "zod";

const urlSchema = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => value === "" || /^https?:\/\/.+$/i.test(value), "Must be a valid http(s) URL")
  .optional()
  .or(z.literal("").optional());

export const CreateProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be at most 120 characters"),
  description: z.string().trim().max(4000).optional(),
  image: urlSchema,
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  githubUrl: urlSchema,
  liveUrl: urlSchema,
});

export const UpdateProjectSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120).optional(),
    description: z.string().trim().max(4000).optional(),
    image: urlSchema,
    technologies: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
    githubUrl: urlSchema,
    liveUrl: urlSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
    path: ["title"],
  });

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
