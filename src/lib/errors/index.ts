export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK_ERROR"
  | "EXTERNAL_PROVIDER_ERROR"
  | "UNKNOWN_ERROR";

export class DomainError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: ErrorCode = "UNKNOWN_ERROR", details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export type Result<T, E = DomainError> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E = DomainError>(error: E): Result<never, E> {
  return { success: false, error };
}
