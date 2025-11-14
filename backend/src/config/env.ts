import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine((value) => /^[a-z][a-z0-9+.-]*:/i.test(value.trim()), {
      message: "DATABASE_URL must include a protocol (e.g. postgresql://...)",
    }),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  TOKEN_EXPIRES_IN: z.string().default("1d"),
  UPLOAD_DIR: z.string().default("uploads"),
  CLIENT_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

const DATABASE_URL = parsed.data.DATABASE_URL.trim();

process.env.DATABASE_URL = DATABASE_URL;

export const env = {
  ...parsed.data,
  DATABASE_URL,
};

