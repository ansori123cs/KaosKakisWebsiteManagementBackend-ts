import type { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config/env.ts";

const isDev = NODE_ENV === "development";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  error?: Record<string, { message: string }>;
  keyValue?: Record<string, any>;
}

interface ErrorResponse {
  success: boolean;
  error: string;
  stack?: string;
  details?: any;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isDev) {
      console.error([]);
    }

    let error: CustomError = { ...err };
    error.message = err.message;

    if (err.name === "CastError" || err.name === "TypeError") {
      error.message = "Resource not found or invalid format";
      error.statusCode = 404;
    }

    //postgree error code on duplicate
    if (err.code === 11000 || err.code === 23505) {
      const field = Object.keys(err.keyValue || {})[0] || "field";
      error.message = `Duplicate value entered for ${field}`;
      error.statusCode = 400;
    }

    // validation Error
    if (err.name === "ValidationError" && err.error) {
      const messages = Object.values(err.error).map((val: any) => val.message);
      error.message = `Validation failed: ${messages.join(", ")}`;
      error.statusCode = 400;
    }

    // json parsing paayload error
    if (err instanceof SyntaxError && "body" in err) {
      error.message = "Invalid JSON payload";
      error.statusCode = 400;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      error.message = "Invalid Authentication";
      error.statusCode = 401;
    }
    //JWT expired
    if (err.name === "TokenExpiredError") {
      error.message = "Authentication Expired";
      error.statusCode = 401;
    }

    // transaction custom error
    if (
      err.message?.toLowerCase().includes("not found") ||
      err.message?.toLowerCase().includes("does not exist")
    ) {
      error.statusCode = 404;
    }

    //authorization error
    if (
      err.message?.toLowerCase().includes("unauthorized") ||
      err.message?.toLowerCase().includes("forbidden")
    ) {
      error.statusCode = err.statusCode || 403;
    }

    // on setup progres response error
    const statusCode = error.statusCode || 500;
    const response: ErrorResponse = {
      success: false,
      error: isDev ? error.message : "Internal Server Error",
    };

    // Tambahkan stack trace di development
    if (isDev) {
      response.stack = err.stack;

      // Tambahkan detail error jika ada
      if (err.code) {
        response.details = {
          errorCode: err.code,
          errorName: err.name,
        };
      }
    }

    // Send response
    res.status(statusCode).json(response);
  } catch (middlewareError) {
    // error on middleware it self
    if (isDev) {
      console.error("[Error Middleware Internal Error]:", middlewareError);
    }

    res.status(500).json({
      success: false,
      error: "Internal Server Error in error middleware",
    });
  }
};

export default errorMiddleware;
