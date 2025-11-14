import { rmSync, existsSync } from "node:fs";
import path from "node:path";

const backendDir = __dirname;

export default async function globalTeardown() {
  const dbPath = path.resolve(backendDir, "test.db");
  if (existsSync(dbPath)) {
    rmSync(dbPath, { force: true });
  }

  const uploadsPath = path.resolve(backendDir, "test-uploads");
  if (existsSync(uploadsPath)) {
    rmSync(uploadsPath, { recursive: true, force: true });
  }
}
