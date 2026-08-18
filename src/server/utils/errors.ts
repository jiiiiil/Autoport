export type ErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_RESET_TOKEN"
  | "RESET_TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "WEAK_PASSWORD"
  | "AI_CONFIGURATION_ERROR"
  | "AI_SERVICE_ERROR";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: ErrorCode;

  constructor(message: string, statusCode: number, isOperational = true, code: ErrorCode = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super("Validation failed", 400, true, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, true, "AUTHENTICATION_REQUIRED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to access this resource") {
    super(message, 403, true, "FORBIDDEN");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid email or password", 401, true, "INVALID_CREDENTIALS");
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("An account with this email already exists", 409, true, "EMAIL_ALREADY_EXISTS");
  }
}

export class InvalidResetTokenError extends AppError {
  constructor() {
    super("This password reset link is invalid or has already been used", 400, true, "INVALID_RESET_TOKEN");
  }
}

export class ExpiredResetTokenError extends AppError {
  constructor() {
    super("This password reset link has expired", 400, true, "RESET_TOKEN_EXPIRED");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, true, "RESOURCE_NOT_FOUND");
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, false);
  }
}

export class AIServiceError extends AppError {
  constructor(message = "AI service unavailable", isConfigurationError = false) {
    const code = isConfigurationError ? "AI_CONFIGURATION_ERROR" : "AI_SERVICE_ERROR";
    const statusCode = isConfigurationError ? 500 : 503;
    super(message, statusCode, true, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, true, "RATE_LIMIT_EXCEEDED");
  }
}
