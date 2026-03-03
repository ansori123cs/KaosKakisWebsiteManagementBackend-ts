"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.ValidationError = exports.AppError = void 0;
// src/types/error.types.ts
class AppError extends Error {
    constructor(message, statusCode, errors) {
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
    static badRequest(message = "Bad Request", errors) {
        return new AppError(message, 400, errors);
    }
    static unauthorized(message = "Unauthorized") {
        return new AppError(message, 401);
    }
    static forbidden(message = "Forbidden") {
        return new AppError(message, 403);
    }
    static notFound(message = "Not Found") {
        return new AppError(message, 404);
    }
    static conflict(message = "Conflict") {
        return new AppError(message, 409);
    }
    static internal(message = "Internal Server Error") {
        return new AppError(message, 500);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message = "Validation Error", errors) {
        super(message, 400, errors);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends AppError {
    constructor(message = "Database Error") {
        super(message, 500);
        this.name = "DatabaseError";
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=error.types.js.map