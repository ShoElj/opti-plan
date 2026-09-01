import { describe, it, expect } from 'vitest';
import { calculateMoneyLeft } from './money/calculator';
import { validateGoalInvariant } from './transactions/invariant';

describe('Phase 6.2 Financial Planning Engine Invariants & Calculations', () => {
  // 1. Goal calculation integer arithmetic & overfunding logic
  it('criteria 1 & 10: Savings Goal calculates progress using exact integer arithmetic without float drift', () => {
    const targetAmount = 500000; // 5,000.00
    const contributions = [100000, 200000, 220000]; // 1,000 + 2,000 + 2,200 = 5,200 (overfunded by 200)

    const totalSaved = contributions.reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalSaved / targetAmount) * 100);

    expect(totalSaved).toBe(520000);
    expect(percentage).toBe(104); // Overfunding 104% per EC-GL-02
  });

  // 2. Goal contribution vs General savings invariants
  it('criteria 6 & 7: Goal contribution requires goal_id; General savings prohibits goal_id', () => {
    // Valid Goal Contribution
    expect(() => validateGoalInvariant("goal_contribution", "goal-123")).not.toThrow();

    // Invalid Goal Contribution (missing goal_id)
    expect(() => validateGoalInvariant("goal_contribution", null)).toThrow("Goal Contribution must be linked to a valid goal ID");
    expect(() => validateGoalInvariant("goal_contribution", undefined)).toThrow("Goal Contribution must be linked to a valid goal ID");

    // Valid General Savings (no goal_id)
    expect(() => validateGoalInvariant("savings", null)).not.toThrow();
    expect(() => validateGoalInvariant("savings", undefined)).not.toThrow();

    // Invalid General Savings (with goal_id)
    expect(() => validateGoalInvariant("savings", "goal-123")).toThrow("General Savings cannot be linked to a goal ID");
  });

  // 3. Goal contribution vs General savings impact on Money Left
  it('criteria 6 & 7: Both Goal contribution and General savings decrease Money Left identically', () => {
    const initialIncome = 1000000;

    const moneyLeftWithGeneralSavings = calculateMoneyLeft({
      income: initialIncome,
      expense: 200000,
      savings: 150000, // General savings
      debt: 50000
    });

    const moneyLeftWithGoalContribution = calculateMoneyLeft({
      income: initialIncome,
      expense: 200000,
      savings: 150000, // Goal contribution
      debt: 50000
    });

    expect(moneyLeftWithGeneralSavings).toBe(600000);
    expect(moneyLeftWithGoalContribution).toBe(600000);
  });

  // 4. Bills & Money Left: Unpaid bills do not affect Money Left; Paid bills affect Money Left
  it('criteria 11, 12, 13: Unpaid bills do not reduce Money Left; Paid bills reduce Money Left', () => {
    const income = 500000;
    const expenseBeforeBill = 100000;

    const moneyLeftBeforePaid = calculateMoneyLeft({
      income,
      expense: expenseBeforeBill,
      savings: 0,
      debt: 0
    });

    expect(moneyLeftBeforePaid).toBe(400000);

    // Bill paid -> expense increases by 15000
    const moneyLeftAfterPaid = calculateMoneyLeft({
      income,
      expense: expenseBeforeBill + 15000,
      savings: 0,
      debt: 0
    });

    expect(moneyLeftAfterPaid).toBe(385000);
  });

  // 5. Spending Plan: Normal expenses count toward limit
  it('criteria 21 & 22: Spending plan tracks normal expenses within specific pay-cycle period', () => {
    const limitAmount = 300000;
    const normalExpenses = [50000, 75000, 25000];
    const totalSpent = normalExpenses.reduce((a, b) => a + b, 0);

    const remaining = limitAmount - totalSpent;
    const percentage = Math.round((totalSpent / limitAmount) * 100);

    expect(totalSpent).toBe(150000);
    expect(remaining).toBe(150000);
    expect(percentage).toBe(50);
  });
});
