// src/types/express.d.ts
import { UserSafe } from "./database/schema.types.ts";

declare global {
  namespace Express {
    interface Request {
      // Authentication
      user?: UserSafe;
      refreshTokenPayload?: {
        id: number;
        email: string;
        type: string;
        iat?: number;
        exp?: number;
      };

      // Request metadata
      requestId?: string;
      startTime?: number;
      correlationId?: string;

      // Validated data
      validatedData?: any;

      // Master data (sesuaikan dengan types Anda)
      productPayload?: any;
      categoryPayload?: any;
      orderPayload?: any;
      customerPayload?: any;

      // Pagination & filtering
      pagination?: {
        page: number;
        limit: number;
        offset: number;
      };
      filters?: Record<string, any>;
      sort?: {
        field: string;
        order: "asc" | "desc";
      };
    }

    interface Response {
      // Custom response properties
      success?: boolean;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }

    interface Locals {
      // Middleware communication
      userId?: number;
      userRole?: string;
      permissions?: string[];
      validated?: boolean;
    }
  }
}

// Export kosong untuk module declaration file
export {};
