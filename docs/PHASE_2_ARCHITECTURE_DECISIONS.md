# Opti-Plan Phase 2 Architecture Decision Records (ADRs)

**Date:** August 25, 2026  
**Status:** PHASE 2 ARCHITECTURE DECISION RECORDS (REMEDIATED)  
**Phase:** Phase 2 — Technical Architecture  

---

## 1. Executive Summary

This document consolidates all formal Architecture Decision Records (ADRs) for Opti-Plan Phase 2, incorporating remediations for FIND-2-01, FIND-2-02, FIND-2-03, and FIND-2-04.

---

## 2. Architecture Decision Records (ADR-01 through ADR-24)

### ADR-01: Exact Money Storage Strategy
- **Decision ID:** ADR-01
- **Title:** PostgreSQL `NUMERIC(14, 2)` + Client Integer Minor Units (2-Decimal V1 Exponent)
- **Status:** APPROVED
- **Context:** Opti-Plan V1 officially supports currencies with 2 decimal minor units (NGN, USD, GBP, EUR). Financial calculations require zero rounding errors.
- **Decision:** PostgreSQL `NUMERIC(14, 2)` for database columns; integer minor units (kobo/cents) for client in-memory arithmetic.
- **Rationale:** `NUMERIC(14, 2)` provides exact fixed-point decimal precision up to $\pm 999,999,999,999.99$. Client integer arithmetic prevents floating-point bugs before formatting.
- **Implementation Phase:** Phase 4 (Database & Schema).

---

### ADR-02: Canonical Single Financial Ledger & Type Invariants (FIND-2-01 Remediated)
- **Decision ID:** ADR-02
- **Title:** Unified `transactions` Table with Type/Classification Check Constraints
- **Status:** APPROVED
- **Context:** Single trusted calculation model for Money Left. Valid type/classification pairings must be enforced at the database level.
- **Decision:** Single canonical `transactions` table. Allowed combinations:
  - `inflow` + `income`
  - `inflow` + `transfer`
  - `outflow` + `expense`
  - `outflow` + `savings`
  - `outflow` + `debt`
  - `outflow` + `transfer`
- **Phase 4 SQL Constraint:**
  ```sql
  CHECK (
      (type = 'inflow'  AND classification IN ('income', 'transfer')) OR
      (type = 'outflow' AND classification IN ('expense', 'savings', 'debt', 'transfer'))
  )
  ```
- **Transfer Rule:** Internal transfers (`classification = 'transfer'`) have **NET ZERO impact on Money Left**. Formula preserved:
  $$\text{Money Left} = \text{Income} - \text{Expenses} - \text{Savings} - \text{Debt}$$
- **Implementation Phase:** Phase 4 (Database & RLS) & Phase 6 (Core Engine).

---

### ADR-03: Savings Goal Contribution Linkage & Relational Ownership (FIND-2-04 Remediated)
- **Decision ID:** ADR-03
- **Title:** Dynamic Derivation via `goal_contributions` + Same-User Composite Foreign Keys
- **Status:** APPROVED (Resolves Inherited Open Decision 1 & FIND-2-04)
- **Context:** Goal progress must reflect real transaction history while preventing cross-user relational attack vectors (User A linking User B's transaction).
- **Decision:** Goal contribution logs a transaction (`type: outflow`, `classification: savings`) linked to `savings_goals` via `goal_contributions`. Saved amount = `SUM(transaction.amount)`.
- **Relational Security Constraint (FIND-2-04):** Parent tables define `UNIQUE(id, user_id)`. Junction table enforces:
  ```sql
  FOREIGN KEY (goal_id, user_id) REFERENCES savings_goals(id, user_id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id, user_id) REFERENCES transactions(id, user_id) ON DELETE CASCADE
  ```
- **Implementation Phase:** Phase 4 (Database) & Phase 6 (Core Engine).

---

### ADR-04: Bill Payment Occurrence & Recurrence Identity (FIND-2-02 & FIND-2-04 Remediated)
- **Decision ID:** ADR-04
- **Title:** Explicit `bill_occurrences` Instance + `bill_payment_links` Composite Keys
- **Status:** APPROVED (Resolves Inherited Open Decision 2, FIND-2-02 & FIND-2-04)
- **Context:** Recurring bills require payment identity across monthly, weekly, yearly, and custom frequencies without relying solely on a monthly string (`YYYY-MM`).
- **Decision:** `tracked_recurring_expenses` defines the bill template. `bill_occurrences` tracks specific occurrence instances (`due_date`, `status`). Marking paid creates a canonical expense transaction linked via `bill_payment_links(bill_occurrence_id, transaction_id, user_id, payment_date)`.
- **Relational Security Constraint (FIND-2-04):**
  ```sql
  FOREIGN KEY (bill_occurrence_id, user_id) REFERENCES bill_occurrences(id, user_id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id, user_id) REFERENCES transactions(id, user_id) ON DELETE CASCADE
  ```
- **Indexing Requirement:** Indexes support lookups on `(user_id, due_date, status)` and `(user_id, payment_date)`.
- **Implementation Phase:** Phase 4 (Database) & Phase 8 (Bills).

---

### ADR-05: Historical Currency Behavior & Non-Matching History Banner (FIND-2-03 Remediated)
- **Decision ID:** ADR-05
- **Title:** Immutable Transaction Currency + Mandatory Phase 6/7 Non-Matching Notice Banner
- **Status:** APPROVED (Resolves Inherited Open Decision 3 & FIND-2-03)
- **Context:** Changing display currency in Profile must never alter historical financial values or cause past entries to appear silently lost.
- **Decision:** Historical transaction `currency_code` is permanently locked. Profile display currency updates default for *new* entries only. Home dashboard aggregates entries matching profile active display currency.
- **Mandatory UX Banner (FIND-2-03):** If historical entries exist in a non-matching currency, Home dashboard MUST render an informational banner:
  > *"Displaying USD totals — 12 historical entries in NGN are available in Activity."*
- **Implementation Phase:** Phase 4 (Database), Phase 6 (Engine), Phase 7 (Dashboard).

---

### ADR-06: Financial Record Deletion Strategy
- **Decision ID:** ADR-06
- **Title:** Hard Delete for User Transactions; Soft Delete for User Accounts
- **Status:** APPROVED
- **Decision:** Hard delete for user transactions (cascading to goal/bill links); soft delete (`deleted_at`) for user accounts.
- **Implementation Phase:** Phase 4 (Database).

---

### ADR-07: RLS Ownership Pattern & Relational Defense-in-Depth (FIND-2-04 Remediated)
- **Decision ID:** ADR-07
- **Title:** Direct Indexed `user_id` + Database-Level Composite Foreign Keys
- **Status:** APPROVED
- **Decision:** Every user table includes `user_id UUID NOT NULL REFERENCES auth.users(id)` indexed. Row Level Security policies evaluate `auth.uid() = user_id`. Relational integrity is enforced via composite foreign keys `(entity_id, user_id)`.
- **Implementation Phase:** Phase 4 (Database & RLS).

---

### ADR-08: Product Subscription Entitlement Authority
- **Decision ID:** ADR-08
- **Title:** Server-Authoritative Entitlement via Webhook Service-Role Writes
- **Status:** APPROVED (Resolves Inherited Open Decision 4)
- **Decision:** Users SELECT their own `product_subscriptions` row under RLS. INSERT/UPDATE is restricted to Supabase service-role via server webhooks. Client state cannot grant paid access.
- **Implementation Phase:** Phase 5 (Auth) & Phase 9 (Payments).

---

### ADR-09: Paystack Webhook Idempotency
- **Decision ID:** ADR-09
- **Title:** `payment_webhook_events` Logging + HMAC SHA-512 Signature Check
- **Status:** APPROVED
- **Decision:** Verify `x-paystack-signature` header against secret key; log `event_id` in `payment_webhook_events` to ignore duplicate webhooks.
- **Implementation Phase:** Phase 9 (Paid Subscription).

---

### ADR-10: Offline Record Identity
- **Decision ID:** ADR-10
- **Title:** Client-Generated RFC 4122 v4 UUID Primary Keys
- **Status:** APPROVED (Resolves Inherited Open Decision 5)
- **Decision:** Clients generate UUID v4 IDs for offline records; database uses `client_mutation_id UUID UNIQUE` for idempotent upserts.
- **Implementation Phase:** Phase 11 (PWA & Offline).

---

### ADR-11: Offline Conflict Management
- **Decision ID:** ADR-11
- **Title:** Version-Based Optimistic Concurrency Control
- **Status:** APPROVED
- **Decision:** Server rejects updates where `version != client_version` with `HTTP 409 Conflict`.
- **Implementation Phase:** Phase 11 (PWA & Offline).

---

### ADR-12: Monthly Check-In Persistence
- **Decision ID:** ADR-12
- **Title:** Check-In Metadata + Read-Only Historical Snapshot
- **Status:** APPROVED
- **Decision:** Store completion timestamp, persona ID, and a snapshot of totals for historical review without altering live calculations.
- **Implementation Phase:** Phase 7 (Dashboard & Check-In).

---

### ADR-13: External Tracked Subscription Terminology
- **Decision ID:** ADR-13
- **Title:** Explicit Schema Naming: `tracked_recurring_expenses` vs `product_subscriptions`
- **Status:** APPROVED
- **Decision:** User bills are named `tracked_recurring_expenses`; Opti-Plan SaaS subscription is `product_subscriptions`.
- **Implementation Phase:** Phase 4 (Database).

---

### ADR-14: Client vs Trusted-Server Boundary
- **Decision ID:** ADR-14
- **Title:** Decoupled 4-Layer Architecture with Restricted Server Operations
- **Status:** APPROVED
- **Decision:** Client handles presentation and user CRUD; trusted server handles webhooks, secrets, and admin tasks.
- **Implementation Phase:** Phase 3 (Engineering Foundation).

---

### ADR-15: Bank Data Provider Boundary
- **Decision ID:** ADR-15
- **Title:** Provider-Agnostic `BankDataProvider` Adapter Pattern
- **Status:** APPROVED
- **Decision:** Architect `BankDataProvider` interface. Provider credentials/tokens stored encrypted server-side. Mark provider specifics: `[REQUIRES OFFICIAL PROVIDER DOCUMENTATION VERIFICATION BEFORE BANK SYNC IMPLEMENTATION]`.
- **Implementation Phase:** Phase 4 & Phase 11.

---

### ADR-16: Connected Account Ownership & Credentials Protection
- **Decision ID:** ADR-16
- **Title:** `connected_accounts` RLS Ownership + Zero Credential Storage Policy
- **Status:** APPROVED
- **Decision:** User-owned `connected_accounts` table. Opti-Plan MUST NEVER store internet banking passwords, PINs, OTPs, or credit/debit card numbers. OAuth access tokens stored encrypted in server-only `bank_connection_tokens` (RLS denies client queries 100%).
- **Implementation Phase:** Phase 4 (Database & Security).

---

### ADR-17: Imported Transaction Provenance
- **Decision ID:** ADR-17
- **Title:** Provenance Fields on Canonical `transactions` Ledger
- **Status:** APPROVED
- **Decision:** Extend `transactions` schema with `source_type` (`manual`/`bank_sync`), `connected_account_id`, `external_transaction_reference`, `provider_reference`, `imported_at`, and `classification_status`. Financial classification remains orthogonal to provenance.
- **Implementation Phase:** Phase 4 (Database).

---

### ADR-18: Bank Transaction Idempotency
- **Decision ID:** ADR-18
- **Title:** `UNIQUE(connected_account_id, external_transaction_reference)` Constraint
- **Status:** APPROVED
- **Decision:** Enforce database unique constraint on `(connected_account_id, external_transaction_reference)` with deterministic SHA-256 fingerprint fallback.
- **Implementation Phase:** Phase 4 (Database).

---

### ADR-19: Manual/Imported Reconciliation & Merging
- **Decision ID:** ADR-19
- **Title:** Candidate Match Flagging (`classification_status = 'needs_review'`) + User Merging
- **Status:** APPROVED
- **Decision:** System flags candidate matches (matching amount, date within $\pm 3$ days, same account). User prompt allows merging: updates existing manual entry to gain bank provenance without creating a second transaction row. Money Left is 100% protected against double counting.
- **Implementation Phase:** Phase 6 (Core Engine).

---

### ADR-20: Internal Transfer Classification & Net Zero Impact
- **Decision ID:** ADR-20
- **Title:** New `transfer` Classification Excluded from Money Left Calculation
- **Status:** APPROVED
- **Decision:** Add classification `transfer`. Internal transfers (`type: outflow`, `classification: transfer`) have **NET ZERO impact on Money Left**. Bank transfer fees logged separately as normal `expense`.
- **Implementation Phase:** Phase 4 (Database) & Phase 6 (Core Engine).

---

### ADR-21: Bank Sync Consent & Disconnect Behavior
- **Decision ID:** ADR-21
- **Title:** Explicit Consent + Disconnect Future Syncing Without Historical Deletion
- **Status:** APPROVED
- **Decision:** Require explicit Open Banking widget consent. Disconnecting account updates `connection_status = 'disconnected'` and revokes provider tokens. Historical canonical transactions created during active consent are retained unless user executes explicit account data purge.
- **Implementation Phase:** Phase 5 (Auth) & Phase 11.

---

### ADR-22: Auto-Categorization Authority
- **Decision ID:** ADR-22
- **Title:** Advisory Merchant String Matching (`classification_status = 'suggested'`)
- **Status:** APPROVED
- **Decision:** Rule-based merchant string matching suggests categories (`classification_status = 'suggested'`). Auto-categorization is advisory; user can override categories at any time.
- **Implementation Phase:** Phase 6 (Core Engine).

---

### ADR-23: Bank Sync / Offline Collision Resolution
- **Decision ID:** ADR-23
- **Title:** Server Reconnection Ingestion Matching Pending Client UUIDs
- **Status:** APPROVED
- **Decision:** Upon device reconnection, server ingestion checks pending manual UUID-A against imported bank records. Candidate match merges bank provenance onto UUID-A and clears client offline queue without double counting.
- **Implementation Phase:** Phase 11 (PWA & Offline).

---

### ADR-24: Auto-Save Money-Movement Boundary
- **Decision ID:** ADR-24
- **Title:** Auto-Save Money Movement DEFERRED / EXPLICITLY NOT APPROVED FOR V1 MVP
- **Status:** APPROVED
- **Decision:** Auto-Save money movement is **DEFERRED AND NOT APPROVED FOR V1 MVP**. Opti-Plan is NOT a financial custodian, does NOT hold user deposits, and does NOT execute automated transfers of customer funds.
- **Implementation Phase:** Deferred Future Capability.

---

## 3. Truthful Technical Residual Risks

Architecture mitigates technical risks but cannot eliminate external realities. Opti-Plan acknowledges 7 technical residual risks:

1. **Upstream Open Banking Provider Outages:** Provider API downtime or bank maintenance can delay synchronization.
2. **Merchant String Formatting Variations:** Bank transaction raw descriptions vary across financial institutions, requiring advisory auto-categorization override by users.
3. **Reconciliation Candidate Matches:** Duplicate detection heuristics require user confirmation for edge-case candidate matches to avoid false positives.
4. **Paystack Webhook Network Delays:** Network congestion can delay subscription activation by a few seconds.
5. **Multi-Device Offline Sync Race Conditions:** Concurrent offline edits on two devices are resolved via version-based optimistic concurrency control (`409 Conflict`).
6. **Multi-Currency Display Preferences:** Switching display currency filters dashboard totals to matching active currency (mitigated by FIND-2-03 notice banner).
7. **Future Provider API Deprecations:** Open banking API standards evolve, requiring periodic adapter maintenance.

---

## 4. Cross-Document Consistency Verification Matrix

| Architectural Element | TECHNICAL | DATA_ARCH | SECURITY_RLS | PAYMENTS_ENT | OFFLINE_SYNC | BANK_SYNC | ADR_DOC | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Money Storage** | `NUMERIC(14,2)` | `NUMERIC(14,2)` | `NUMERIC(14,2)` | N/A | Minor Units | `NUMERIC(14,2)` | ADR-01 | **CONSISTENT** |
| **Type Invariants** | Check Constraint | Check Constraint | Check Constraint | N/A | Check Constraint | Check Constraint | ADR-02 | **CONSISTENT** |
| **Goal Linkage** | Composite FK | Composite FK | Composite FK | N/A | N/A | Composite FK | ADR-03 | **CONSISTENT** |
| **Bill Linkage** | `occurrences` | `occurrences` | `occurrences` | N/A | N/A | `occurrences` | ADR-04 | **CONSISTENT** |
| **Currency Banner** | Notice Banner | Notice Banner | Notice Banner | N/A | N/A | Notice Banner | ADR-05 | **CONSISTENT** |
| **RLS Ownership** | `auth.uid()` | `auth.uid()` | `auth.uid()` | `auth.uid()` | `auth.uid()` | `auth.uid()` | ADR-07 | **CONSISTENT** |
| **Relational Security** | Composite FK | Composite FK | Composite FK | N/A | N/A | Composite FK | FIND-2-04 | **CONSISTENT** |
| **Bank Provider** | `BankAdapter` | `BankAdapter` | Server Only | N/A | N/A | `BankDataProvider` | ADR-15 | **CONSISTENT** |
| **Internal Transfer** | Net Zero | Net Zero | Net Zero | N/A | N/A | Net Zero | ADR-20 | **CONSISTENT** |
| **Auto-Save Boundary** | DEFERRED | DEFERRED | DEFERRED | N/A | N/A | DEFERRED | ADR-24 | **CONSISTENT** |

---

## 5. Phase Boundary Verification

- **Application Source Code Modified:** **NO** (Zero changes to `src/`)
- **Dependencies Installed:** **NO** (Zero npm packages added)
- **Supabase Backend Implemented:** **NO** (Architecture specified; zero SQL migrations created)
- **Paystack Webhook Implemented:** **NO** (Architecture specified; zero API endpoints created)
- **Service Worker / IndexedDB Implemented:** **NO** (Architecture specified; zero PWA code written)
- **Phase 3 Started:** **NO**
