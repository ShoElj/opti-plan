import { describe, it, expect } from "vitest";
import { calculateMoneyLeft } from "./calculator";

describe("Money Left Calculator", () => {
  it("calculates Money Left = Income - Expenses - Savings - Debt", () => {
    const result = calculateMoneyLeft({
      income: 50000000, // ₦500,000.00
      expense: 20000000, // ₦200,000.00
      savings: 5000000, // ₦50,000.00
      debt: 10000000, // ₦100,000.00
    });
    expect(result).toBe(15000000); // ₦150,000.00
  });

  it("handles zero income and non-negative zero balances", () => {
    const result = calculateMoneyLeft({
      income: 0,
      expense: 0,
      savings: 0,
      debt: 0,
    });
    expect(result).toBe(0);
  });

  it("supports negative Money Left outcome when expenses exceed income", () => {
    const result = calculateMoneyLeft({
      income: 1000000, // ₦10,000.00
      expense: 1500000, // ₦15,000.00
      savings: 0,
      debt: 0,
    });
    expect(result).toBe(-500000); // -₦5,000.00
  });

  it("rejects negative input parameters", () => {
    expect(() =>
      calculateMoneyLeft({
        income: -100,
        expense: 100,
        savings: 0,
        debt: 0,
      })
    ).toThrow();
  });
});
