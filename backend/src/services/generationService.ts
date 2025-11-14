import { randomInt } from "node:crypto";
import { prisma } from "../lib/prisma";

const SIMULATED_DELAY_MIN_MS = 1000;
const SIMULATED_DELAY_MAX_MS = 2000;
const parsedChance =
  process.env.MODEL_OVERLOAD_CHANCE !== undefined
    ? Number.parseFloat(process.env.MODEL_OVERLOAD_CHANCE)
    : undefined;
const OVERLOAD_CHANCE = Number.isFinite(parsedChance)
  ? Math.min(Math.max(parsedChance as number, 0), 1)
  : 0.2;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toResponse = (generation: {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
  status: string;
}) => ({
  id: generation.id,
  prompt: generation.prompt,
  style: generation.style,
  imageUrl: generation.imageUrl,
  createdAt: generation.createdAt,
  status: generation.status,
});

export const createGeneration = async (
  userId: string,
  input: { prompt: string; style: string },
  filename: string,
) => {
  const delay = randomInt(SIMULATED_DELAY_MIN_MS, SIMULATED_DELAY_MAX_MS + 1);
  await wait(delay);

  const overload = Math.random() < OVERLOAD_CHANCE;
  if (overload) {
    const error = new Error("Model overloaded");
    (error as { status?: number }).status = 503;
    throw error;
  }

  const generation = await prisma.generation.create({
    data: {
      userId,
      prompt: input.prompt,
      style: input.style,
      imageUrl: `/uploads/${filename}`,
      status: "completed",
    },
  });

  return toResponse(generation);
};

export const listGenerations = async (userId: string, limit: number) => {
  const generations = await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return generations.map(toResponse);
};

