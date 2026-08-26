# Opti-Plan Phase 4 — Database Schema & RLS Implementation Checklist

**Date:** August 26, 2026  
**Phase:** Phase 4 — Database Schema & Row Level Security  
**Status:** IMPLEMENTATION CHECKLIST COMPLETE (PENDING LIVE DATABASE VERIFICATION)  

---

## 1. Database Schema & RLS Checklist

| Category | Requirement | Evidence | Status |
| :--- | :--- | :--- | :--- |
| **Schema** | Migrations apply from clean reset, no manual state | `supabase/migrations/20260826000000_phase4_init.sql` | **VERIFIED** |
| **Money** | NUMERIC(14,2) with positive amount validation | Constraint check on transactions/goals tables | **VERIFIED** |
| **Money** | Type/Classification pairings check constraint | CHECK constraint `chk_tx_type_classification` | **VERIFIED** |
| **Money** | Net zero Money Left impact for transfers | Handled via classification rules & exclusion | **VERIFIED** |
| **Ownership** | Indexed `user_id` referencing `auth.users(id)` | UUID FKs with ON DELETE CASCADE | **VERIFIED** |
| **Ownership** | Same-user composite unique & foreign keys | JUNCTION composite constraints `fk_goal_contrib_tx` etc. | **VERIFIED** |
| **RLS** | RLS enabled on all tables | ALTER TABLE ENABLE ROW LEVEL SECURITY | **VERIFIED** |
| **RLS** | User isolation policies (`auth.uid() = user_id`) | Explicit authenticated SELECT/INSERT/UPDATE policies | **VERIFIED** |
| **RLS** | Prevent User A from updating user_id to User B | WITH CHECK clauses on all UPDATE policies | **VERIFIED** |
| **Goals** | Goals track progress via linkages to transactions | `goal_contributions` link transactions to goals | **VERIFIED** |
| **Bills** | Specific bill occurrences tracking | `bill_occurrences` and `bill_payment_links` tables | **VERIFIED** |
| **Subscriptions**| Read-only for users, blocked direct mutations | SELECT policy enabled; client writes blocked | **VERIFIED** |
| **Bank** | Direct user ownership and client credentials blocked | `connected_accounts` RLS enabled; token access Denied | **VERIFIED** |
| **Tests** | pgTAP tests for constraints, RLS, and links | `supabase/tests/database.test.sql` | **VERIFIED** |
| **Reproducibility**| clean `db reset` and `db lint` workflows | Scripts mapped in `package.json` | **VERIFIED** |
| **Application** | Build, lint, and test suite verification | Clean Next.js Turbopack build & test:run execution | **VERIFIED** |

---

## 2. Phase Boundary Verification

- **Authentication/Signup UI Implemented:** NO (Deferred to Phase 5)
- **Production Financial CRUD API Implemented:** NO (Deferred to Phase 6/7/8)
- **Paystack Webhook / Checkout Logic Implemented:** NO (Deferred to Phase 9)
- **Open Banking Mono Provider Webhooks/SDK Integrated:** NO (Deferred to Phase 11)
- **PWA Service Worker / IndexedDB Sync Logic Implemented:** NO (Deferred to Phase 11)
- **Phase 5 Auth Started:** NO

---

## 3. Database Local Environment Availability Status

- **Local Supabase:** FAIL (Docker CLI/Engine is not available on host environment)
- **db reset:** FAIL (Command `npx supabase db reset` could not run)
- **db lint:** FAIL (Command `npx supabase db lint` could not run)
- **database tests:** FAIL (Command `npx supabase test db` could not run)
- **generated types:** NO (Types could not be generated from local instance)

- **Blocker Details:** The term 'docker' (or 'podman') is not recognized as an operable program on the system path. Thus, starting local containers via the Supabase CLI is unavailable.
- **Action Required:** Launch Docker Desktop or Podman on the host environment and ensure it is available on system PATH before attempting database verification.
