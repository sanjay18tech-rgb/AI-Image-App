import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export type TokenPayload = JwtPayload & {
  sub: string;
  email: string;
};

