import { MinorUnits } from "@/domain/types";

export interface MoneyLeftCalculationInput {
  income: MinorUnits;
  expense: MinorUnits;
  savings: MinorUnits;
  debt: MinorUnits;
}

/**
 * Opti-Plan Core Money Left Formula:
 * Money Left = Income - Expenses - Savings Contributions - Debt Repayments
 *
 * All inputs and outputs MUST be integer minor units (kobo/cents).
 * Internal transfers (classification = 'transfer') are explicitly excluded.
 */
export function calculateMoneyLeft(input: MoneyLeftCalculationInput): MinorUnits {
  const { income, expense, savings, debt } = input;

  if (income < 0 || expense < 0 || savings < 0 || debt < 0) {
    throw new Error("Financial inputs for Money Left calculation must be non-negative integer minor units.");
  }

  return income - expense - savings - debt;
}
