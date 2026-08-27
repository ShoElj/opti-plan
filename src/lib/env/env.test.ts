import { describe, it, expect } from "vitest";
import { getPublicEnv, getServerEnv } from "./index";

describe("Environment Variable Validation", () => {
  it("getPublicEnv returns valid default public configuration", () => {
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it("getServerEnv throws security error when invoked in browser client context (typeof window !== 'undefined')", () => {
    expect(() => getServerEnv()).toThrow("SECURITY VIOLATION");
  });

  it("getServerEnv succeeds when window is undefined (server environment context)", () => {
    const originalWindow = global.window;
    // @ts-expect-error simulating server environment
    delete global.window;

    try {
      const env = getServerEnv();
      expect(env).toBeDefined();
    } finally {
      global.window = originalWindow;
    }
  });
});
