/**
 * Opti-Plan Safe Logger Boundary
 * Redacts sensitive credentials, tokens, secrets, PINs, OTPs, and card data before logging.
 */

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "access_token",
  "refresh_token",
  "secret",
  "service_role_key",
  "api_key",
  "pin",
  "otp",
  "cvv",
  "card_number",
  "bank_connection_token",
  "paystack_secret",
]);

function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  if (typeof data === "object") {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = redactSensitiveData(value);
      }
    }
    return redacted;
  }

  return data;
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.log(`[INFO] ${message}`, redactSensitiveData(meta));
    } else {
      console.log(`[INFO] ${message}`);
    }
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.warn(`[WARN] ${message}`, redactSensitiveData(meta));
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },

  error(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.error(`[ERROR] ${message}`, redactSensitiveData(meta));
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },
};
