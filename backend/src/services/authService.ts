import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

const SALT_ROUNDS = 10;

const toSafeUser = (user: { id: string; email: string; createdAt: Date }) => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
});

export const createUser = async (input: { email: string; password: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    const error = new Error("Email already registered");
    (error as { status?: number }).status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
  });

  return toSafeUser(user);
};

export const authenticateUser = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    const error = new Error("Invalid credentials");
    (error as { status?: number }).status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    const error = new Error("Invalid credentials");
    (error as { status?: number }).status = 401;
    throw error;
  }

  return toSafeUser(user);
};

