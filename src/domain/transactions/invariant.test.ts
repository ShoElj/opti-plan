import { describe, it, expect } from "vitest";
import {
  isValidTransactionInvariant,
  validateTransactionInvariant,
} from "./invariant";

describe("Transaction Type / Classification Invariants", () => {
  it("approves allowed transaction pairings", () => {
    expect(isValidTransactionInvariant("inflow", "income")).toBe(true);
    expect(isValidTransactionInvariant("inflow", "transfer")).toBe(true);

    expect(isValidTransactionInvariant("outflow", "expense")).toBe(true);
    expect(isValidTransactionInvariant("outflow", "savings")).toBe(true);
    expect(isValidTransactionInvariant("outflow", "debt")).toBe(true);
    expect(isValidTransactionInvariant("outflow", "transfer")).toBe(true);
  });

  it("rejects prohibited contradictory transaction pairings", () => {
    expect(isValidTransactionInvariant("inflow", "expense")).toBe(false);
    expect(isValidTransactionInvariant("inflow", "savings")).toBe(false);
    expect(isValidTransactionInvariant("inflow", "debt")).toBe(false);
    expect(isValidTransactionInvariant("outflow", "income")).toBe(false);
  });

  it("validateTransactionInvariant throws explicit error on invalid pairing", () => {
    expect(() => validateTransactionInvariant("inflow", "expense")).toThrow(
      "Invalid transaction pairing"
    );
  });
});
