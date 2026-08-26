import { z } from "zod";

/**
 * Opti-Plan Environment Variable Validation Schemas
 * Enforces strict separation between client-safe public variables and trusted server secrets.
 */

// Public variables accessible in browser client
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .optional()
    .default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY must not be empty")
    .optional()
    .default("placeholder-anon-key"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional()
    .default("http://localhost:3000"),
});

// Trusted server-only variables (NEVER prefixed with NEXT_PUBLIC)
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  BANK_ENCRYPTION_KEY: z.string().optional(),
});

/**
 * Validated Environment Accessors
 */
export function getPublicEnv() {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error("❌ Invalid public environment variables:", parsed.error.format());
    throw new Error("Invalid public environment configuration");
  }

  return parsed.data;
}

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("❌ SECURITY VIOLATION: getServerEnv() cannot be called from browser client code!");
  }

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    BANK_ENCRYPTION_KEY: process.env.BANK_ENCRYPTION_KEY,
  });

  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:", parsed.error.format());
    throw new Error("Invalid server environment configuration");
  }

  return parsed.data;
}
