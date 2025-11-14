import { z } from "zod";

export const generationStyles = ["Editorial", "Streetwear", "Runway", "Minimalist"] as const;

export const createGenerationSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .refine((val) => val.trim().length >= 5, {
      message: "Prompt must be at least 5 characters long",
    })
    .max(500, "Prompt must be at most 500 characters long"),
  style: z.enum(generationStyles, {
    message: "Please select a valid design style",
  }),
});

export const getGenerationsQuerySchema = z.object({
  limit: z
    .coerce
    .number({
      message: "Limit must be a number",
    })
    .min(1, "Limit must be at least 1")
    .max(20, "Limit must be at most 20")
    .default(5),
});

