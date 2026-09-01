/**
 * Opti-Plan Core Domain Type Definitions
 * Represents domain contracts established in Phase 0, Phase 1, and Phase 2 architecture.
 */

// Supported 2-decimal minor unit currencies in V1
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

// Integer minor units (e.g. kobo/cents: 100 minor units = 1.00 major unit)
export type MinorUnits = number;

// Phase 6.1 Transaction Types
export type TransactionType =
  | "income" | "expense" | "savings" | "goal_contribution" | "debt" | "transfer";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: MinorUnits;
  occurredAt: string;
  createdAt: string;
  goalId?: string;
  recurringExpenseId?: string;
  note?: string;
  category?: string;
}

export interface MoneyPeriod {
  start: string;   // ISO date, inclusive
  end: string;     // ISO date, exclusive
  label: string;   // display string, e.g. "Aug 25 – Sep 24"
}

export interface PayCycleConfig {
  userId: string;
  anchorDayOfMonth: number;
  effectiveFrom: string;
}

export interface MoneyLeftBreakdown {
  income: MinorUnits;
  expenses: MinorUnits;
  savings: MinorUnits;
  goalContributions: MinorUnits;
  debt: MinorUnits;
  moneyLeft: MinorUnits;
  period: MoneyPeriod;
  hasIncomeLogged: boolean;
}

export interface UpcomingBillsProjection {
  period: MoneyPeriod;
  totalUnpaid: MinorUnits;
  projectedMoneyLeft: MinorUnits;
  bills: Array<{
    billOccurrenceId: string;
    label: string;
    dueDate: string;
    amount: MinorUnits;
  }>;
}

// Transaction record provenance
export type TransactionSourceType = "manual" | "bank_sync";

// Auto-categorization / Duplicate review status
export type ClassificationStatus = "confirmed" | "suggested" | "needs_review";

// Offline sync queue status
export type SyncStatus = "pending" | "syncing" | "synced" | "failed";

// Product subscription lifecycle status
export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "grace"
  | "past_due"
  | "cancelled"
  | "expired";

// Connected bank account connection status
export type ConnectedAccountStatus =
  | "pending"
  | "connected"
  | "syncing"
  | "requires_reauth"
  | "disconnected"
  | "revoked"
  | "error";

// Phase 8 Stub Types (To be replaced with real models in Phase 8)
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: MinorUnits;
  savedAmount: MinorUnits;
  targetDate?: string;
  status: "active" | "completed";
}

export interface BillItem {
  id: string;
  name: string;
  amount: MinorUnits;
  dueDate: string;
  category?: string;
  frequency?: string;
  status: "unpaid" | "paid";
}
