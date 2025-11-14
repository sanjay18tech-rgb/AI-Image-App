import { execSync } from "node:child_process";
import { rmSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const backendDir = __dirname;

const ensureTestEnvironment = () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "file:./test.db";
  process.env.JWT_SECRET = "test-secret";
  process.env.TOKEN_EXPIRES_IN = "1h";
  process.env.UPLOAD_DIR = "test-uploads";
};

export default async function globalSetup() {
  ensureTestEnvironment();

  const dbPath = path.resolve(backendDir, "test.db");
  if (existsSync(dbPath)) {
    rmSync(dbPath, { force: true });
  }

  const uploadsPath = path.resolve(backendDir, "test-uploads");
  if (existsSync(uploadsPath)) {
    rmSync(uploadsPath, { recursive: true, force: true });
  }
  mkdirSync(uploadsPath, { recursive: true });

  execSync("npx prisma db push --skip-generate", {
    cwd: backendDir,
    stdio: "inherit",
  });
}
