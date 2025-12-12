// src/types/error.types.ts
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;
    this.name = this.constructor.name;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string = "Bad Request", errors?: any[]) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(message, 401);
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message: string = "Not Found") {
    return new AppError(message, 404);
  }

  static conflict(message: string = "Conflict") {
    return new AppError(message, 409);
  }

  static internal(message: string = "Internal Server Error") {
    return new AppError(message, 500);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation Error", errors?: any[]) {
    super(message, 400, errors);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database Error") {
    super(message, 500);
    this.name = "DatabaseError";
  }
}

export interface ErrorResponse {
  status: string;
  message: string;
  error?: any;
  stack?: string;
  errors?: any[];
  timestamp?: string;
  path?: string;
}
