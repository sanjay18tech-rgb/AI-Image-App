import { Request, Response } from "express";
import { createGenerationSchema, getGenerationsQuerySchema } from "../schemas/generation";
import { createGeneration, listGenerations } from "../services/generationService";

export const createGenerationHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Please upload a reference image" });
  }

  const parsed = createGenerationSchema.parse(req.body);
  const generation = await createGeneration(req.user.id, parsed, file.filename);
  return res.status(201).json(generation);
};

export const listGenerationsHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = getGenerationsQuerySchema.parse(req.query);
  const generations = await listGenerations(req.user.id, query.limit);
  return res.status(200).json({ data: generations });
};

