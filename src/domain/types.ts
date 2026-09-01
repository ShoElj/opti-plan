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

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: MinorUnits;
  savedAmount: MinorUnits;
  targetDate?: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface TrackedBill {
  id: string;
  userId: string;
  name: string;
  expectedAmount: MinorUnits;
  frequency: "weekly" | "biweekly" | "monthly" | "yearly" | "custom";
  dueDayOfMonth?: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillOccurrence {
  id: string;
  billId: string;
  userId: string;
  dueDate: string;
  expectedAmount: MinorUnits;
  status: "unpaid" | "paid" | "skipped" | "overdue";
  periodKey?: string;
  name?: string;
  category?: string;
  createdAt: string;
}

export interface BillItem {
  id: string;
  billId: string;
  name: string;
  amount: MinorUnits;
  dueDate: string;
  category?: string;
  frequency?: string;
  status: "unpaid" | "paid";
}

export interface SpendingPlan {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  limitAmount: MinorUnits;
  currencyCode: CurrencyCode;
  createdAt: string;
  updatedAt: string;
}

// Phase 6.3: Financial Awareness Domain Models
export interface FinancialHealth {
  status: "healthy" | "warning" | "attention";
  moneyLeft: MinorUnits;
  summary: string;
  reasons: string[];
  spending: {
    spent: MinorUnits;
    limit?: MinorUnits;
    remaining?: MinorUnits;
    status: "on_track" | "warning" | "over";
  };
  upcomingBills: {
    total: MinorUnits;
    count: number;
  };
  savings: {
    goalsOnTrack: number;
    goalsNeedingAttention: number;
  };
  debt: {
    total: MinorUnits;
  };
}

export interface FinancialCalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD in user local timezone
  type:
    | "income"
    | "expense"
    | "savings"
    | "goal_contribution"
    | "debt"
    | "bill"
    | "bill_payment"
    | "payday";
  isProjected: boolean;
  label: string;
  amount?: MinorUnits;
  category?: string;
  transactionId?: string;
  billOccurrenceId?: string;
  goalId?: string;
}

export interface SpendingDay {
  date: string; // YYYY-MM-DD in user local timezone
  total: MinorUnits;
  transactions: {
    id: string;
    amount: MinorUnits;
    category: string;
    note?: string;
    occurredAt: string;
  }[];
}

export interface SmartAlert {
  id: string;
  userId: string;
  type:
    | "bill_due"
    | "spending_pace"
    | "money_left"
    | "goal_progress"
    | "spending_plan";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
  transactionId?: string;
  billOccurrenceId?: string;
  goalId?: string;
}


