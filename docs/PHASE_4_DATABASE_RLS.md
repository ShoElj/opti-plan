# Opti-Plan Phase 4   Database Schema & Row Level Security

**Date:** August 26, 2026  
**Status:** PHASE 4 IMPLEMENTATION SUMMARY  
**Phase:** Phase 4   Database Schema & Row Level Security  

---

## 1. Table Inventory & Schema Matrix

Opti-Plan Phase 4 translates the approved Phase 2 data and security models into project-local PostgreSQL migrations. The implementation mapping is outlined below:

| Table Name | Phase 4 Status | Direct Ownership Model | RLS Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | **Created** | `id = auth.uid()` | Enabled (User read/write, no delete) | Account persona & display currency |
| `product_subscriptions` | **Created** | `user_id = auth.uid()` | Enabled (User SELECT only; Server-only writes) | Autoritative paid entitlements |
| `connected_accounts` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Bank account connections metadata |
| `bank_connection_tokens` | **Created** | `user_id = auth.uid()` | Enabled (Server Only; Client Denied) | Encrypted open banking API credentials |
| `transactions` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Single canonical financial ledger |
| `monthly_spending_plans` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Monthly spending limits & savings targets |
| `savings_goals` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Savings goals tracking |
| `goal_contributions` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Linkages between goals and transactions |
| `tracked_recurring_expenses` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Bill template definitions |
| `bill_occurrences` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Specific occurrences of recurring bills |
| `bill_payment_links` | **Created** | `user_id = auth.uid()` | Enabled (Full User CRUD) | Linkages between occurrences & transactions |
| `monthly_check_ins` | **Created** | `user_id = auth.uid()` | Enabled (User read/insert; no update/delete) | Live snapshots at check-in cycles |
| `payment_webhook_events` | **Created** | None (Audit Log) | Enabled (Server Only; Client Denied) | Idempotent Paystack webhook log |

### Deferred / Out-of-Scope Tables for V1 MVP:
- **Banking passwords/PINs/OTPs:** NEVER stored (ADR-16).
- **Auto-Save automated money movement logs:** Deferred (ADR-24).
- **Staging/Production remote sync logs:** Out-of-scope for Phase 4 local database foundation.

---

## 2. Invariants & Financial Constraints

1. **Positive Monetary Values:** check constraints enforce `amount > 0.00` on transactions, spending plans, recurring bills, and savings goals to prevent negative/zero value exploits.
2. **AUDIT-2-01 Type/Classification Invariant:** A strict check constraint enforces allowed transaction pairings:
   - `inflow` must pair with `income` or `transfer`.
   - `outflow` must pair with `expense`, `savings`, `debt`, or `transfer`.
   - Prohibited pairings (`inflow` + `expense`, etc.) are hard-rejected at database level.
3. **Internal Transfer Logic:** Inflow or outflow transfers are categorized as `transfer` and excluded from normal calculations, preserving Money Left formula correctness:
   $$\text{Money Left} = \text{Income} - \text{Expenses} - \text{Savings} - \text{Debt}$$
4. **Monthly Plan & Check-In Uniqueness:** Unique constraints enforce one plan and one check-in per user per month.

---

## 3. Relational Same-User Composite Key Protection (FIND-2-04)

Row Level Security is reinforced with composite foreign keys to prevent cross-user relational linking attacks (e.g. User A linking User B's transaction to User A's goal):

- Parent tables expose composite uniqueness: `uq_transactions_id_user` (`id, user_id`), `uq_savings_goals_id_user`, `uq_bill_occurrences_id_user`.
- Child tables enforce matching composite foreign keys:
  - `goal_contributions` references parent tables using `(goal_id, user_id)` and `(transaction_id, user_id)`.
  - `bill_payment_links` references parent tables using `(bill_occurrence_id, user_id)` and `(transaction_id, user_id)`.
- If User A attempts to link User B's transaction to User A's goal, the transaction's foreign key `(User B tx_id, User A user_id)` will fail referential integrity, causing database-level rollback.

---

## 4. Row Level Security Policy Summary

RLS is enabled on every table. Client access is restricted via JWT credentials (`auth.uid() = user_id` or `auth.uid() = id`). 

- **Authenticated Client Operations Allowed:** Full CRUD on transactions, goals, plans, custom profiles, connected bank account lists, occurrences, and payment link junctions.
- **Client Mutation Protection:**
  - `product_subscriptions`: Users SELECT their own subscription data. User INSERT, UPDATE, and DELETE queries are denied at database level (blocked by default).
  - `bank_connection_tokens`: SELECT, INSERT, UPDATE, DELETE are blocked for clients. Accessed only by trusted server service-role.
  - `payment_webhook_events`: Clients are completely blocked from reading or writing logs.

---

## 5. Performance Indexes

- `idx_transactions_user_date` (`user_id, transaction_date DESC`) - Accelerates Activity feeds.
- `idx_transactions_classification` (`user_id, type, classification`) - Speeds up cash flow aggregations.
- `uq_external_bank_tx` (`connected_account_id, external_transaction_reference`) - Guarantees bank sync idempotency.
- `idx_bill_occurrences_lookup` (`user_id, due_date, status`) - Optimizes upcoming bills calendar.
- `idx_bill_payment_links_date` (`user_id, payment_date`) - Speeds up recurring payment reports.

---

## 6. Database Testing Strategy & Quality Verification

Local database and RLS testing are modeled using `pgTAP` unit tests located in [`supabase/tests/database.test.sql`](file:///c:/Users/USER/OneDrive/Documents/elijah/opti-plan/supabase/tests/database.test.sql):

- **Verifications Cover:**
  - Table existence checks.
  - RLS enablement flags verification.
  - Transaction amount bounds checks (rejecting zero & negative values).
  - Valid type/classification invariant pairing validations.
  - Cross-user relational attack rejections.
  - RLS user isolation test cases (User A reading own data, User B isolation).

### Local Running Commands:
- `npm run db:start` - Launch local Supabase container stack.
- `npm run db:reset` - Reapply all migrations from a clean state.
- `npm run db:lint` - Check migrations structure.
- `npm run db:test` - Run pgTAP SQL assertions.

---

## 7. Residual Risks & Local Environment Verification Status

- **Verification Status:** **UNVERIFIED (Docker engine is not running/installed on host path)**
  - Local Supabase Stack: **FAIL**
  - Database Migrations reset: **FAIL**
  - Database pgTAP Tests: **FAIL**
  - Generated database types: **NO**

- **Blocker Details:** Executing local database status check or startup via `supabase status` / `supabase start` failed because neither the `docker` nor `podman` CLI commands were recognized. Thus, the database stack could not start.
- **Residual Risks:**
  1. **Future RLS Weakness Risk:** Future modifications to SQL schemas could accidentally bypass policies if not verified by pgTAP tests.
  2. **Local stack docker requirements:** Supabase CLI requires Docker for testing. On machines without Docker, migrations cannot be locally verified before pushing to remote databases.
  3. **No client database type sync:** Since local docker was unavailable during Phase 4 implementation, generated types (`database.types.ts`) are deferred until the stack is launched.
