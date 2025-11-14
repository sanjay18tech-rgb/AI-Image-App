import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { TokenPayload } from "../types/express";

const signOptions: SignOptions = {
  expiresIn: env.TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
};

export const signToken = (payload: { sub: string; email: string }) =>
  jwt.sign(payload, env.JWT_SECRET, signOptions);

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string" || !decoded) {
    throw new Error("Invalid token");
  }
  if (typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
    throw new Error("Invalid token payload");
  }
  return decoded as TokenPayload;
};

