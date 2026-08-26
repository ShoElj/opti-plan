# Opti-Plan Product Requirements Document (PRD)

**Version:** 1.0  
**Phase:** Phase 0 — Product Definition  
**Status:** Approved Product Blueprint  
**Governance:** Governed by `AGENTS.md` and `docs/Opti-Plan_UI_UX_Design_Specification.md`

---

## 1. Executive Summary & Product Vision

**Opti-Plan** is a subscription-based personal money planning web application and installable Progressive Web App (PWA). It is designed around a single universal money-management principle: everyday users should instantly understand what came in, what went out, what they saved, what they paid toward debt, and what they have left.

Opti-Plan replaces heavy, complex accounting software and intimidating spreadsheets with a calm, fast, mobile-first money companion that provides clarity without friction or financial jargon.

---

## 2. Core User Questions & Mental Model

Opti-Plan helps users answer five fundamental questions at any moment:

1. **How much money came in?** (`Money In`)
2. **How much money went out?** (`Money Out`)
3. **Where did it go?** (`Categories & Activity`)
4. **How much do I have left?** (`Money Left`)
5. **Am I making progress toward my plan and goals?** (`Spending Plan & Savings Targets`)

### Core Financial Formula
```
Money Left = Total Income - Normal Expenses - Savings Contributions - Debt Repayments
```
*Note: Savings contributions and debt repayments are treated distinctly to avoid double-counting.*

---

## 3. Product Principles

1. **Simplicity First**: The app must feel easier than a spreadsheet. A user must be able to sign up, log income/spending, understand Money Left, and set a goal without reading instructions.
2. **Progressive Disclosure**: Expose only the controls required for the immediate task. Advanced fields (notes, recurring schedules, custom tags) remain hidden until requested.
3. **Mobile & PWA First-Class**: Designed mobile-first for web and PWA, scaling cleanly to tablet and desktop.
4. **Fast Entry (Quick Add)**: Recording daily income or spending requires minimal touches/clicks.
5. **Calm Premium Aesthetics**: Modern, trustworthy, dark-mode supported fintech interface built on `shadcn/ui` and Lucide icons with subtle, non-distracting motion.
6. **Real Data Only**: Zero fabricated metrics, fake streaks, or false urgency. Empty states are displayed honestly when data is insufficient.

---

## 4. User Profiles & Personalization

Opti-Plan uses **one unified financial calculation engine** while offering personalized onboarding, suggested categories, and content hints for 8 distinct user profiles:

- **Salaried Employee**: Predictable monthly income; focus on spending plan, recurring bills, and savings.
- **Freelancer / Gig Worker**: Irregular income; focus on income runway and cash flow tracking.
- **Self-Employed Professional**: Variable draws; focus on personal spending plan vs business draw.
- **Business Owner (Personal Finance)**: Focus on strict separation of personal money from business accounts.
- **Student**: Limited budget; focus on spending awareness and simple savings goals.
- **Couple / Household**: Shared income streams; focus on household bills and joint targets.
- **Retiree / Pensioner**: Predictable pension/payouts; focus on bills and cash flow preservation.
- **Multiple-Income Earner**: Diverse revenue sources; focus on aggregated Money In clarity.

---

## 5. Core Feature Modules (Version 1 Scope)

1. **Authentication & Session Management**: Secure sign up, login, verification, password recovery via Supabase Auth.
2. **Profile Setup & Onboarding**: Fast universal persona selection and currency configuration.
3. **Dashboard**: Dominant Money Left display, Income, Spending, Savings, Debt Paid summaries, spending plan progress, top categories, and upcoming bills.
4. **Quick Add**: Speed-optimized modal/sheet to capture Money In or Money Out.
5. **Activity & History**: Searchable, filterable transaction timeline with categorization and month filtering.
6. **Monthly Spending Plan**: Category spending targets vs actual spending tracking.
7. **Savings Targets & Goals**: Savings progress visualization with milestone celebrations.
8. **Bills & Subscriptions Tracker**: Upcoming bill reminders and payment status tracking.
9. **Monthly Money Check-In**: End-of-month review reveal and rollover initialization.
10. **Paid Subscription & Paywall**: Premium subscription features gated by server-verified Paystack payments.
11. **PWA & Offline Queue**: Installable PWA with local transaction caching (IndexedDB) and background sync.
12. **Ethical Behavioral Engagement**: Intermittent Variable Rewards (data-backed insights) and Truthful FOMO (real dates/deadlines).

---

## 6. Technical Foundations

- **Frontend**: Next.js, React, strict TypeScript, Tailwind CSS, `shadcn/ui`, Lucide icons, Motion.
- **Forms**: React Hook Form + Zod for client/server schema validation.
- **Backend / DB**: Supabase PostgreSQL with strict Row Level Security (RLS) policies per user.
- **Payments**: Paystack API with idempotent webhook verification and server-enforced entitlement.
- **Offline / PWA**: Web App Manifest, Service Worker, IndexedDB queue with deduplication sync.

---

## 7. Non-Negotiable Product Guardrails

- No open banking / bank scraping in V1.
- No investment advice, crypto, tax filing, or complex business accounting.
- No floating-point financial arithmetic (stored strictly in PostgreSQL `numeric` or minor integer units).
- No client-side paid feature unlocking (`localStorage` or URL parameter tampering).
