// src/types/express.d.ts
import { User } from "./user/user.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
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
