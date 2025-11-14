import { Request, Response } from "express";
import { signupSchema, loginSchema } from "../schemas/auth";
import { createUser, authenticateUser } from "../services/authService";
import { signToken } from "../utils/token";

export const signup = async (req: Request, res: Response) => {
  const payload = signupSchema.parse(req.body);
  const user = await createUser(payload);
  const token = signToken({ sub: user.id, email: user.email });
  return res.status(201).json({ user, token });
};

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const user = await authenticateUser(payload);
  const token = signToken({ sub: user.id, email: user.email });
  return res.status(200).json({ user, token });
};

