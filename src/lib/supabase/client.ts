import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";
import { Database } from "@/types/database.types";

/**
 * Creates a browser-side Supabase client instance.
 * Uses strictly public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
 * Zero service-role access or trusted secrets.
 */
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
console.log(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)