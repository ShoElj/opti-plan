/**
 * Opti-Plan Core Domain Type Definitions
 * Represents domain contracts established in Phase 0, Phase 1, and Phase 2 architecture.
 */

// Supported 2-decimal minor unit currencies in V1
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

// Integer minor units (e.g. kobo/cents: 100 minor units = 1.00 major unit)
export type MinorUnits = number;

// Canonical transaction direction
export type TransactionType = "inflow" | "outflow";

// Canonical transaction classification
export type TransactionClassification =
  | "income"
  | "expense"
  | "savings"
  | "debt"
  | "transfer";

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
