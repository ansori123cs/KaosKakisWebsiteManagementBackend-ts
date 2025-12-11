// src/types/express.d.ts
import { UserSafe } from "./database/schema.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserSafe;
      refreshTokenPayload?: {
        id: number;
        email: string;
        type: string;
      };
      requestId?: string;
      startTime?: number;
    }

    interface Response {
      success?: boolean;
    }

    interface Locals {
      userId?: number;
      userRole?: string;
    }
  }
}

// Untuk module system
export {};
