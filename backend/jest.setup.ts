import { mkdirSync, rmSync } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import { prisma } from "./src/lib/prisma";

const rootDir = __dirname;
const uploadDir = path.resolve(rootDir, "test-uploads");

jest.setTimeout(15000);

beforeAll(async () => {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret";
  }
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
});

beforeEach(async () => {
  await prisma.generation.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  if (existsSync(uploadDir)) {
    rmSync(uploadDir, { recursive: true, force: true });
  }
});
