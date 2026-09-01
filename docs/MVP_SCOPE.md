# Opti-Plan MVP Scope Specification

**Version:** 1.0  
**Phase:** Phase 0   Product Definition  
**Status:** Approved Scope Boundary  
**Governance:** Governed by `AGENTS.md` and `docs/Opti-Plan_UI_UX_Design_Specification.md`

---

## 1. Objective & Scope Strategy

The goal of the Version 1 MVP is to deliver a complete, highly polished, fully functional subscription money management web app and PWA that satisfies the core promise: **Know what came in. Know where it went. Know what you have left.**

Version 1 adheres strictly to a phase-gated release workflow. No features outside this approved MVP scope specification may be introduced into V1 without explicit written architectural approval.

---

## 2. In-Scope Version 1 Features

### 2.1 Authentication & Session Management
- User signup with email/password and email verification.
- User login, logout, and persistent session recovery via Supabase Auth.
- Password reset request and confirmation flow.
- Protected client-side and server-side routes.
- Account profile controls and sign-out across devices.

### 2.2 Profile & Onboarding
- Universal profile selection (Salaried, Freelancer, Self-Employed, Business Owner, Student, Household, Retiree, Multi-Income).
- Profile-tailored onboarding copy, suggested income labels, and initial expense category suggestions.
- Primary currency selection (e.g. NGN, USD, GBP, EUR, etc.).

### 2.3 Core Dashboard
- **Money Left** dominant hero display.
- **Money In** summary card.
- **Money Out** summary card.
- **Saved** summary card.
- **Debt Paid** summary card.
- Spending Plan progress indicator.
- Top category breakdown preview.
- Upcoming bills summary.
- One contextual data-backed Money Win or financial insight card.

### 2.4 Quick Add (Fast Entry)
- Fast bottom-sheet / modal accessible from persistent navigation.
- Clear tabbed selection: **Money In** vs **Money Out**.
- Amount input (numeric keypads on mobile).
- Category picker with icon indicators.
- Transaction classification selection (Normal Expense, Savings Contribution, Debt Repayment).
- Transaction date picker (defaulting to today).
- Optional description / note field (progressively disclosed).

### 2.5 Activity & Transaction History
- Timeline view of transactions grouped by date and month boundaries.
- Search by description or category.
- Filter by transaction classification (Income, Expense, Savings, Debt).
- View, edit, and delete existing transactions.
- Re-calculation of month totals upon edit/delete operations.

### 2.6 Monthly Spending Plan
- Category budget allocation (Spending Plan setup).
- Category progress bars (Actual vs Planned).
- Total plan vs total income indicator.
- Over-plan warning indicators (neutral, non-shaming visual hints).

### 2.7 Savings Targets & Goals
- Creation of specific savings targets (e.g., Emergency Fund, Rent, New Laptop).
- Recording contributions toward savings goals.
- Progress tracking against target amounts and target completion dates.
- Milestone celebration feedback (subtle animations upon reaching milestones).

### 2.8 Bills & Subscriptions Tracking
- Creation and tracking of recurring bills (Rent, Utilities, Internet, Subscriptions).
- Due date tracking with upcoming bill alerts (e.g., "Internet due in 2 days").
- Marking bills as paid (which logs a corresponding Money Out transaction).

### 2.9 Monthly Money Check-In
- End-of-month financial recap reveal.
- Summary of total income, total spending, total saved, and plan adherence.
- Controlled monthly rollover state for the next planning cycle.

### 2.10 Paid Subscriptions & Paywall (Paystack)
- Free tier functional capabilities with defined feature limits.
- Premium paid tier subscription checkout powered by Paystack.
- Server-validated webhook signature handling and idempotent subscription updates.
- Server-enforced entitlement (free, trialing, active, grace, past_due, cancelled, expired).
- Clear, un-obstructed subscription cancellation flow.

### 2.11 PWA & Offline Support
- Web App Manifest (installable on iOS, Android, and Desktop).
- Service Worker caching essential shell assets.
- Local offline transaction capture using IndexedDB queue.
- Background/reconnect synchronization with idempotency keys and duplicate prevention.
- Clear offline UI state banners ("Offline - Saved Locally", "Syncing", "Synced").

### 2.12 Behavioral Engagement Layer
- **Intermittent Variable Rewards**: Personalized data-backed money wins and category insights. Capped frequency, non-gambling mechanics.
- **Truthful FOMO / Urgency**: Notifications backed by real dates (e.g., month ending soon, bill due date approaching, planning cycle incomplete).

---

## 3. Explicit Out-of-Scope Features (Prohibited in V1)

To protect product simplicity, security, and timeline, the following features are strictly **PROHIBITED** from Version 1 development:

- ❌ **Bank API Sync / Open Banking / Plaid Integration**: Manual or quick-add transaction recording only.
- ❌ **Investment Advice & Portfolio Management**: No stock picks, yield calculations, or market feeds.
- ❌ **Cryptocurrency & Web3 Features**: No crypto wallets, tokens, or exchange tracking.
- ❌ **Loans, Lenders & Credit Scoring**: No loan application flows or credit rating integrations.
- ❌ **Tax Filing & Tax Calculation Engines**: No tax return submission or tax optimization engines.
- ❌ **Full Business Bookkeeping & Invoicing**: No client invoicing, balance sheets, profit & loss statements, or corporate accounting.
- ❌ **AI Financial Advisor / LLM Chat Bot**: No generative AI text financial advisory in V1.
- ❌ **Gambling Mechanics / Mystery Cash / Loot Boxes**: No randomized financial rewards or points conversion to cash.
- ❌ **Fake Scarcity / Deceptive Countdown Timers**: No manufactured urgency or fake social proof metrics.
