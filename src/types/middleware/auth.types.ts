// src/types/middleware/auth.types.ts
import { Request, Response, NextFunction } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface AuthMiddlewareOptions {
  requireAdmin?: boolean;
  allowedRoles?: string[];
  requireEmailVerified?: boolean;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

declare global {
  namespace jwt {
    interface payload {
      email: string;
    }
  }
}
