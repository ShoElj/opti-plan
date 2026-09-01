import { TransactionType } from "@/domain/types";

export type FlowDirection = "inflow" | "outflow";

export function isValidTransactionInvariant(
  flowDirection: FlowDirection,
  type: TransactionType
): boolean {
  if (flowDirection === "inflow") {
    return type === "income" || type === "transfer";
  }

  if (flowDirection === "outflow") {
    return (
      type === "expense" ||
      type === "savings" ||
      type === "goal_contribution" ||
      type === "debt" ||
      type === "transfer"
    );
  }

  return false;
}

export function validateTransactionInvariant(
  flowDirection: FlowDirection,
  type: TransactionType
): void {
  if (!isValidTransactionInvariant(flowDirection, type)) {
    throw new Error(
      `Invalid transaction pairing: flow_direction '${flowDirection}' cannot be paired with type '${type}'`
    );
  }
}

export function validateGoalInvariant(type: TransactionType, goalId?: string | null): void {
  if (type === "goal_contribution" && !goalId) {
    throw new Error("Goal Contribution must be linked to a valid goal ID");
  }
  if (type === "savings" && goalId) {
    throw new Error("General Savings cannot be linked to a goal ID");
  }
}
