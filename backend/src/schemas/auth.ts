import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = signupSchema;

