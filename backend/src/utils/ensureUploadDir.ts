import { access, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { env } from "../config/env";

export const ensureUploadDir = async () => {
  try {
    await access(env.UPLOAD_DIR, constants.F_OK);
  } catch {
    await mkdir(env.UPLOAD_DIR, { recursive: true });
  }
};

