# Opti-Plan Security & RLS Architecture

**Date:** August 25, 2026  
**Status:** PHASE 2 SECURITY ARCHITECTURE SPECIFICATION (REMEDIATED)  
**Phase:** Phase 2 — Technical Architecture  

---

## 1. Executive Security Principles

Personal financial data is among the most sensitive information a user entrusts to an application. Opti-Plan enforces zero-trust, defense-in-depth data access:

1. **Strict Cross-User Isolation:** User A MUST NEVER be able to read, insert, update, or delete User B's financial records, goals, bills, or connected bank accounts under any circumstances.
2. **Server-Enforced Authorization:** Client-side UI visibility is NOT authorization. All data access rules MUST be enforced inside PostgreSQL via Supabase Row Level Security (RLS).
3. **Identity Derivation (`auth.uid()`):** Ownership is strictly bound to the authenticated Supabase JWT payload (`auth.uid()`). Client-provided `user_id` values in request bodies are ignored.
4. **FIND-2-04: Same-User Relational Integrity:** Row Level Security on individual tables is reinforced with database-level **Composite Foreign Keys** (`FOREIGN KEY (entity_id, user_id) REFERENCES parent_table(id, user_id)`). Related entities MUST share the identical `user_id`.

---

## 2. Row Level Security (RLS) Policy Matrix

| Entity | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy | Ownership Rule | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `profiles` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` | Denied | `id = auth.uid()` | Account profile |
| `connected_accounts` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Connected bank metadata |
| `bank_connection_tokens` | **Denied** | Denied (Server Only) | Denied (Server Only) | Denied (Server Only) | Service Role Only | **Encrypted OAuth tokens**. Client queries 100% blocked! |
| `transactions` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Canonical ledger |
| `monthly_spending_plans` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Monthly limit |
| `savings_goals` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Goals |
| `goal_contributions` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Enforces composite FK `(goal_id, user_id)` & `(tx_id, user_id)` |
| `tracked_recurring_expenses` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Bills template |
| `bill_occurrences` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Bill occurrences |
| `bill_payment_links` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `user_id = auth.uid()` | Enforces composite FK `(occ_id, user_id)` & `(tx_id, user_id)` |
| `monthly_check_ins` | `auth.uid() = user_id` | `auth.uid() = user_id` | Denied | Denied | `user_id = auth.uid()` | Check-in snapshots |
| `product_subscriptions` | `auth.uid() = user_id` | Denied (Server Only) | Denied (Server Only) | Denied | `user_id = auth.uid()` | **Read-only for user**. Updated strictly by service role |
| `payment_webhook_events` | Denied | Denied (Server Only) | Denied (Server Only) | Denied | Service Role Only | Audit log |

---

## 3. FIND-2-04: Cross-User Relational Ownership Architecture

### Threat Vector:
An attacker (User A) submits a direct SQL or REST payload to insert a row into `goal_contributions` containing:
- `user_id` = User A
- `goal_id` = User A's goal
- `transaction_id` = User B's transaction

If RLS only checked `user_id = auth.uid()` on `goal_contributions` and standard single-column foreign keys (`FOREIGN KEY (transaction_id) REFERENCES transactions(id)`), the insert would succeed because User A owns the `goal_contributions` row, illegally linking User B's transaction to User A's goal.

### Architectural Mitigation (Defense in Depth):
Opti-Plan mandates **Database-Level Composite Foreign Keys** across all relational junction tables:

```sql
-- Parent Unique Constraints:
ALTER TABLE public.transactions ADD CONSTRAINT uq_transactions_id_user UNIQUE (id, user_id);
ALTER TABLE public.savings_goals ADD CONSTRAINT uq_savings_goals_id_user UNIQUE (id, user_id);
ALTER TABLE public.tracked_recurring_expenses ADD CONSTRAINT uq_bills_id_user UNIQUE (id, user_id);
ALTER TABLE public.bill_occurrences ADD CONSTRAINT uq_bill_occurrences_id_user UNIQUE (id, user_id);

-- Child Composite Foreign Key Enforcement:
ALTER TABLE public.goal_contributions
    ADD CONSTRAINT fk_goal_contrib_goal FOREIGN KEY (goal_id, user_id) 
        REFERENCES public.savings_goals(id, user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_goal_contrib_tx   FOREIGN KEY (transaction_id, user_id) 
        REFERENCES public.transactions(id, user_id) ON DELETE CASCADE;

ALTER TABLE public.bill_payment_links
    ADD CONSTRAINT fk_bill_payment_occ FOREIGN KEY (bill_occurrence_id, user_id) 
        REFERENCES public.bill_occurrences(id, user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bill_payment_tx  FOREIGN KEY (transaction_id, user_id) 
        REFERENCES public.transactions(id, user_id) ON DELETE CASCADE;
```

### Security Proof:
If User A attempts to pass User B's `transaction_id` in `goal_contributions`, PostgreSQL evaluates `FOREIGN KEY (transaction_id, user_id) REFERENCES transactions(id, user_id)`. Because `(User B tx_id, User A user_id)` does NOT exist in `transactions`, PostgreSQL rejects the write with a foreign key violation before RLS evaluation even finishes.

---

## 4. Threat Model & Architectural Mitigations

| Threat Vector | Description | Architectural Mitigation |
| :--- | :--- | :--- |
| **1. Client State Tampering** | User modifies React state to set `subscriptionTier = 'plus'`. | Server queries `product_subscriptions` under RLS for all privileged API routes. |
| **2. Cross-User `user_id` Injection** | User A submits payload containing User B's `user_id`. | RLS policy enforces `WITH CHECK (auth.uid() = user_id)`. PostgreSQL returns 42501 error. |
| **3. Cross-User Relational Attack** | User A links User B's transaction to User A's goal/bill. | **FIND-2-04 Composite Foreign Keys** reject non-matching `(entity_id, user_id)` pairs. |
| **4. Forged Checkout Callback** | User manipulates URL query string (`?status=success`). | Trusted server Paystack HMAC SHA-512 webhook verification required before granting Plus access. |
| **5. Paystack Webhook Replay** | Attacker replays Paystack webhook payload. | HMAC SHA-512 validation + `payment_webhook_events` idempotency log returns 200 OK without re-processing. |
| **6. Compromised Connection Token** | Provider OAuth access token leaked to browser client. | Tokens stored encrypted at rest (`AES-256-GCM`) in `bank_connection_tokens`. RLS explicitly denies all client queries. |
| **7. Negative/Zero Amount Injection** | Attacker attempts to insert `amount = -500.00`. | PostgreSQL check constraint `CHECK (amount > 0.00)` rejects invalid amounts at database engine level. |

---

## 5. Truthful Technical Residual Risks

Architecture mitigates risks but cannot eliminate external realities. Opti-Plan acknowledges 7 technical residual risks:

1. **Upstream Open Banking Provider Outages:** Provider API downtime or bank maintenance can delay synchronization.
2. **Merchant String Formatting Variations:** Bank transaction raw descriptions vary across financial institutions, requiring advisory auto-categorization override by users.
3. **Reconciliation Candidate Matches:** Duplicate detection heuristics require user confirmation for edge-case candidate matches to avoid false positives.
4. **Paystack Webhook Network Delays:** Network congestion can delay subscription activation by a few seconds.
5. **Multi-Device Offline Sync Race Conditions:** Concurrent offline edits on two devices are resolved via version-based optimistic concurrency control (`409 Conflict`).
6. **Multi-Currency Display Preferences:** Switching display currency filters dashboard totals to matching active currency (mitigated by FIND-2-03 notice banner).
7. **Future Provider API Deprecations:** Open banking API standards evolve, requiring periodic adapter maintenance.
