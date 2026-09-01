# Opti-Plan Phase 3   Engineering Foundation

**Date:** August 25, 2026  
**Status:** PHASE 3 ENGINEERING FOUNDATION SPECIFICATION & IMPLEMENTATION  
**Phase:** Phase 3   Engineering Foundation  

---

## 1. Executive Summary

Opti-Plan Phase 3 establishes the production engineering foundation around the approved interactive prototype. It defines source code layering, environment variable validation, Supabase client/server security boundaries, domain type contracts, exact-money arithmetic utilities, transaction invariant guards, domain validation schemas, error/result handling patterns, logging security redactions, and automated testing foundation without violating phase boundaries.

---

## 2. Foundation Dependencies Installed

### Production Dependencies:
- `@supabase/supabase-js` (`^2.112.4`): Official Supabase JavaScript client library.
- `@supabase/ssr` (`^0.12.5`): Official Server-Side Rendering (SSR) cookie and session utility for Next.js App Router.
- `zod` (`^4.4.3`): TypeScript-first schema validation library.

### Testing & Tooling Dependencies:
- `vitest` (`^2.1.8`): Fast unit testing framework.
- `@testing-library/react` (`^16.3.2`): React component testing utilities.
- `@testing-library/jest-dom` (`^7.0.1`): DOM element matchers.
- `jsdom` (`^30.0.1`): Browser environment simulation for unit testing.

---

## 3. Production Source Architecture

```
src/
  app/                      # Next.js App Router pages and shell layouts
  components/               # Reusable presentation UI components
  domain/                   # Pure domain models, invariants, and calculators
    money/                  # Money Left calculator (calculateMoneyLeft)
    transactions/           # Type/Classification invariant guard (validateTransactionInvariant)
    types.ts                # TypeScript domain contracts
  lib/                      # Foundation libraries and utilities
    env/                    # Environment variable validation schemas
    errors/                 # Result<T, E> and DomainError conventions
    logging/                # Safe logger with automatic sensitive data redaction
    money/                  # Exact integer minor unit arithmetic (parse, format, add, sub)
    supabase/               # Browser (client.ts) and Server (server.ts) factories
    validation/             # Zod input validation schemas (transaction, goal, bill)
  services/                 # Repository interfaces (ITransactionRepository, IGoalRepository)
    interfaces/
  prototype/                # Non-production visual mock data (ISOLATED)
  test/                     # Vitest test setup and testing utilities
```

---

## 4. Environment Variable Security & Validation (`src/lib/env/`)

1. **Template:** Created `.env.example` defining expected public vs server-only variable placeholders.
2. **Public Schema (`getPublicEnv()`):** Validates `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL`.
3. **Server Schema (`getServerEnv()`):** Validates `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, and `BANK_ENCRYPTION_KEY`.
4. **Security Guard:** `getServerEnv()` throws an explicit error if invoked from browser client code, preventing secret leaks.

---

## 5. Supabase Client / Server Security Boundaries (`src/lib/supabase/`)

1. **Browser Client (`createClient`):** Uses `@supabase/ssr` `createBrowserClient` with public anon credentials only. Service-role access is 100% prohibited.
2. **Server Client (`createServerSupabaseClient`):** Uses `@supabase/ssr` `createServerClient` bound to Next.js `cookies()` request lifecycle.
3. **Zero Secret Leakage:** `SUPABASE_SERVICE_ROLE_KEY` is NEVER imported into client bundles or exposed via `NEXT_PUBLIC_*`.

---

## 6. Exact Money Foundation (`src/lib/money/`)

Opti-Plan strictly prohibits IEEE-754 binary floating-point arithmetic for stored financial data.

1. **Integer Minor Units:** All domain arithmetic operates on integer minor units (`amount_in_cents`).
   - ₦1.00 $\rightarrow$ `100` minor units
   - ₦1,500.25 $\rightarrow$ `150025` minor units
2. **Strict Input Parsing (`parseMoneyInputToMinorUnits`):** Rejects invalid characters, negative values, and inputs with >2 decimal places. Zero silent rounding.
3. **Display Formatting (`formatMinorUnits`):** Formats integer minor units for major currency display (e.g. `150025`, `'NGN'` $\rightarrow$ `"₦1,500.25"`).

---

## 7. Transaction Invariant Guard (`src/domain/transactions/`)

TypeScript guard `validateTransactionInvariant(type, classification)` enforces allowed pairings derived from Phase 2 ADR-02 and FIND-2-01:
- Allowed: `inflow` + `income`/`transfer`, `outflow` + `expense`/`savings`/`debt`/`transfer`
- Prohibited: `inflow` + `expense`/`savings`/`debt`, `outflow` + `income`

---

## 8. Money Left Pure Calculator (`src/domain/money/`)

Pure function `calculateMoneyLeft({ income, expense, savings, debt })` calculates Money Left from integer minor units:
$$\text{Money Left} = \text{Income} - \text{Expenses} - \text{Savings} - \text{Debt}$$
Internal transfers (`classification = 'transfer'`) have zero Money Left impact.

---

## 9. Testing Foundation (`vitest.config.ts`, `src/test/`)

Vitest is configured with `jsdom` environment and `@testing-library/jest-dom` matchers.
Unit test suites added:
- `src/lib/money/money.test.ts` (Exact money parsing, formatting, minor unit arithmetic)
- `src/domain/money/calculator.test.ts` (Money Left formula, positive/zero/negative outcomes)
- `src/domain/transactions/invariant.test.ts` (Valid vs prohibited transaction type/classification pairings)
- `src/lib/env/env.test.ts` (Public vs server environment validation)

---

## 10. Security Headers & Prototype Isolation

1. **Next.js Security Headers:** `next.config.ts` enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
2. **Prototype Isolation:** `src/prototype/README.md` documents strict boundaries forbidding production code from importing prototype mock data.
