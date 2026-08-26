import { TransactionType, TransactionClassification } from "@/domain/types";

/**
 * Opti-Plan Transaction Type / Classification Invariant Guard
 * Enforces allowed pairings derived from Phase 2 architecture decision ADR-02 and FIND-2-01:
 *
 * Allowed Pairings:
 * - inflow + income
 * - inflow + transfer
 * - outflow + expense
 * - outflow + savings
 * - outflow + debt
 * - outflow + transfer
 *
 * Prohibited Pairings:
 * - inflow + expense
 * - inflow + savings
 * - inflow + debt
 * - outflow + income
 */
export function isValidTransactionInvariant(
  type: TransactionType,
  classification: TransactionClassification
): boolean {
  if (type === "inflow") {
    return classification === "income" || classification === "transfer";
  }

  if (type === "outflow") {
    return (
      classification === "expense" ||
      classification === "savings" ||
      classification === "debt" ||
      classification === "transfer"
    );
  }

  return false;
}

export function validateTransactionInvariant(
  type: TransactionType,
  classification: TransactionClassification
): void {
  if (!isValidTransactionInvariant(type, classification)) {
    throw new Error(
      `Invalid transaction pairing: type '${type}' cannot be paired with classification '${classification}'`
    );
  }
}
