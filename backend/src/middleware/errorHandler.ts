import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    err.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (issue.message) {
        fieldErrors[path] = issue.message;
      }
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: fieldErrors,
    });
  }

  const status = (err as { status?: number }).status ?? 500;
  const message = status === 500 ? "Internal server error" : (err as Error).message;

  if (status === 500) {
    console.error(err);
  }

  return res.status(status).json({ message });
};

