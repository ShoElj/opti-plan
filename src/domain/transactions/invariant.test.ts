import { describe, it, expect } from "vitest";
import {
  isValidTransactionInvariant,
  validateTransactionInvariant,
  validateGoalInvariant,
} from "./invariant";

describe("Transaction Type / Classification Invariants", () => {
  it("approves allowed transaction pairings", () => {
    expect(isValidTransactionInvariant("inflow", "income")).toBe(true);
    expect(isValidTransactionInvariant("inflow", "transfer")).toBe(true);

    expect(isValidTransactionInvariant("outflow", "expense")).toBe(true);
    expect(isValidTransactionInvariant("outflow", "savings")).toBe(true);
    expect(isValidTransactionInvariant("outflow", "goal_contribution")).toBe(true);
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

describe("Goal Contribution Invariants", () => {
  it("allows general savings without a goal", () => {
    expect(() => validateGoalInvariant("savings", undefined)).not.toThrow();
    expect(() => validateGoalInvariant("savings", null)).not.toThrow();
  });

  it("allows goal_contribution with a goal", () => {
    expect(() => validateGoalInvariant("goal_contribution", "goal-123")).not.toThrow();
  });

  it("rejects goal_contribution without a goal", () => {
    expect(() => validateGoalInvariant("goal_contribution", undefined)).toThrow(
      "Goal Contribution must be linked to a valid goal ID"
    );
    expect(() => validateGoalInvariant("goal_contribution", null)).toThrow(
      "Goal Contribution must be linked to a valid goal ID"
    );
  });

  it("rejects general savings with a goal", () => {
    expect(() => validateGoalInvariant("savings", "goal-123")).toThrow(
      "General Savings cannot be linked to a goal ID"
    );
  });
});
