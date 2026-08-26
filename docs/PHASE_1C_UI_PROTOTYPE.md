# Opti-Plan Phase 1C — Interactive UI Prototype Documentation

**Phase Authorization:** Phase 1C — Interactive UI Prototype  
**Date:** August 25, 2026  
**Status:** IMPLEMENTED — READY FOR UI/UX AUDIT  
**Framework:** Next.js 16.3.2 (App Router, Turbopack, TypeScript strict mode, Tailwind CSS v4, Lucide Icons, Framer Motion)  
**Local Dev Server:** `http://localhost:3000` (Daemon task running)

---

## 1. Prototype Architecture & Mock Data

### Isolated Mock Data Layer
All prototype mock data is isolated under [`src/prototype/mockData.ts`](file:///c:/Users/USER/OneDrive/Documents/elijah/opti-plan/src/prototype/mockData.ts). No financial values or hardcoded user records are scattered across component files.

- **Persona Profiles (`PERSONA_PROFILES`)**: 8 core user personas (Salaried Employee, Freelancer, Self-Employed, Business Owner, Student, Couple/Family, Retiree, Multiple-Income Earner). Updating the persona personalizes category suggestions without duplicating financial engines.
- **Initial Transactions (`INITIAL_TRANSACTIONS`)**: Realistic fictional demo history records covering Salary Inflow (₦350,000), Food & Groceries (₦80,000), Transport & Fuel (₦40,000), Utilities & Internet (₦15,000), Savings Goal Contribution (₦30,000), and Debt Repayment (₦15,000).
- **Savings Goals (`INITIAL_GOALS`)**: Emergency Reserve (50% milestone reached) and New Laptop Fund.
- **Bills Tracker (`INITIAL_BILLS`)**: Fiber Internet Subscription (due in 2 days) and Apartment Electricity Bill.
- **Spending Plan (`INITIAL_SPENDING_PLAN`)**: Overall monthly target limit (₦200,000) with optional category allocations.

---

## 2. Priority Screen Coverage (14 Screens)

1. **Onboarding (`/onboarding` & Interactive Modal)**: Skippable 3-step setup (`Profile Type -> Currency -> Optional Plan Setup -> Skip -> Home`). Fast-track skip button takes user directly to Home in 1 tap.
2. **Home — Empty State**: Interactive toggle demonstrates empty state explaining the first useful action without looking broken.
3. **Home — Populated**: Dominant **Money Left** hero card (₦170,000), 4 Summary cards (Money In ₦350,000, Money Out ₦135,000, Saved ₦30,000, Debt Paid ₦15,000), budget progress, top categories, upcoming bill alert, and single Money Win card.
4. **Quick Add Sheet (`SCR-QA-01`)**: Persistent global FAB (+) opening modal sheet defaulting to Money Out (`[WORKING INTERACTION ASSUMPTION — TO BE TESTED IN PHASE 1C]`) with Money In tab, numeric keypad focus (`[INITIAL UX TARGET — SUBJECT TO USABILITY TESTING]`: Target $\le 5$s), category selector, classification buttons, and optional note input.
5. **Money In Entry**: Amount entry, source selection, date, optional note.
6. **Money Out Entry**: Amount entry, category selection, date, classification (Normal Expense, Savings Goal, Debt Repay), optional note.
7. **Activity Timeline (`/app/activity`)**: Date-grouped history list, search input, filter modal sheet (All / Inflow / Outflow / Savings / Debt), transaction detail sheet, edit/delete actions.
8. **Plan Workspace (`/app/plan`)**: One workspace with sub-tabs for Spending Plan, Savings Goals, and Bills Tracker. Emphasizes overall monthly spending limit baseline.
9. **Goals Section**: Goal list, creation modal, detail modal, contribution modal, and 50% milestone badge (`[WORKING ENGAGEMENT ASSUMPTION — SUBJECT TO PHASE 1C UX TESTING]`).
10. **Bills Section**: Upcoming bills list, due-soon alert badges (`[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]`: $\le 3$ days), create bill modal, and "Mark as Paid" action modal (`[OPEN DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]`).
11. **Monthly Money Check-In (`/app/check-in`)**: 4-step review stepper (Money In, Spending/Categories, Savings/Debt, Final Money Left recap & badge reveal).
12. **Profile & Settings (`/app/profile`)**: User identity, persona profile selection, display currency dropdown (`[OPEN PRODUCT / DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]`), theme mode toggle (Light/Dark), subscription area, privacy/delete account modal, sign out.
13. **Contextual Paywall Sheet**: Opti-Plan Plus benefits list with pricing disclaimers (`[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]`).
14. **System Feedback States**: Loading skeletons, empty states, offline status banner ("Offline - Saved locally").

---

## 3. Design System & Responsive Strategy

### Visual Identity
- **Typography & Color Palette**: Deep Emerald accent (`hsl(160 84% 39%)`), calm slate dark mode background (`hsl(222 47% 7%)`), neutral amber alerts (`hsl(38 92% 50%)`).
- **Glassmorphism Hero**: `MoneyLeftHero` utilizes gradient backdrop-blur card styling to elevate financial clarity.
- **Touch Targets**: All interactive buttons enforce minimum $44 \times 44$ pt touch targets.
- **Responsive Layout**: Mobile-first bottom navbar (`Home`, `Activity`, `Plan`, `Profile` + `Quick Add` FAB) adapts seamlessly to a desktop sidebar navigation on larger viewports ($\ge 768$ px).

---

## 4. Behavioral Engagement Placement

- **Money Win Card (Slot 10, Max 1)**: Displayed on Home Dashboard, 100% data-backed based on real transaction history.
- **Truthful Urgency (Priority 2)**: Upcoming bill card clearly highlights real calendar due dates ("Due in 2 days") without artificial countdown timers or shame.
- **Milestone Celebration**: Goal progress bar highlights 50% milestone badge.

---

## 5. Phase 2 Open Data Decisions Preserved

1. **Goal Contribution Ledger Linkage**: Marked as `[OPEN INTERACTION / DATA DECISION — REQUIRES PHASE 2 ARCHITECTURE CONFIRMATION]`.
2. **Bill Payment Expense Linkage**: Marked as `[OPEN DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]`.
3. **Historical Currency Conversion**: Marked as `[OPEN PRODUCT / DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]`.
4. **Paystack Webhooks & Entitlement**: Deferred to Phase 2 & Phase 9.
5. **IndexedDB Sync & Deduplication**: Deferred to Phase 2 & Phase 11.

---

## 6. Verification Results

- **Dev Server**: `npm run dev` running on `http://localhost:3000` (Ready in 820ms)
- **TypeScript Check**: PASS (`Finished TypeScript in 5.1s`)
- **ESLint Check**: PASS (`npm run lint` clean)
- **Production Build**: PASS (`npm run build` static page generation complete)
