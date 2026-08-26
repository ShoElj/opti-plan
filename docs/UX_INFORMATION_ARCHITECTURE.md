# Opti-Plan UX Information Architecture Specification

**Version:** 1.0  
**Phase:** Phase 1A — UX Information Architecture  
**Status:** Approved UX Architecture Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 Documents

---

## 1. Executive UX Philosophy

Opti-Plan's UX information architecture translates the universal money planning principle (**Know what came in. Know where it went. Know what you have left.**) into a simple, calm, mobile-first information structure.

The architecture strictly avoids accounting software complexity, heavy spreadsheet grids, crowded dashboards, and multi-layered navigation trees. The primary user experience is structured around **four core anchors** on mobile/PWA:

1. **Home**: Financial truth hero (Money Left) and immediate financial status.
2. **Activity**: Transaction history, search, filtering, and transaction details.
3. **Plan**: Forward-looking money management (spending plan, savings goals, bills tracker).
4. **Profile**: User preferences, account management, subscription controls, and privacy settings.

A persistent, prominent **Quick Add** action provides instantaneous speed-optimized transaction entry from any location without acting as a complex navigation destination.

---

## 2. Product-Level Architecture

Opti-Plan is partitioned into nine logical product areas, each serving an explicit operational purpose:

| Product Area | Operational Purpose | Primary Access Boundary |
|---|---|---|
| **Public / Marketing** | Introduce product value proposition, pricing transparency, and PWA installation entry | Unauthenticated Web / PWA Landing |
| **Authentication** | Secure user registration, sign-in, password reset, and identity verification | Unauthenticated App Shell |
| **Onboarding** | Rapid persona setup, currency selection, and baseline financial initialization | Post-Registration First-Run |
| **Home** | Display dominant Money Left hero, summary cards, plan progress, and primary insight | Authenticated Primary Anchor 1 |
| **Activity** | Comprehensive timeline of all logged inflows/outflows with search and filtering | Authenticated Primary Anchor 2 |
| **Plan** | Unified workspace for future-oriented planning: monthly spending plan, savings targets, and bills | Authenticated Primary Anchor 3 |
| **Profile & Settings** | Manage user context profile, preferences, security, data export, and account deletion | Authenticated Primary Anchor 4 |
| **Subscription / Paywall** | Transparent feature gating, Paystack checkout trigger, and subscription management | Contextual Overlay / Settings |
| **System States** | Universal feedback handling (loading, empty, error, offline, syncing, unauthorized) | Cross-Application Layer |

---

## 3. Home Architecture

Home is the calm financial control center of Opti-Plan. It prioritizes financial truth over secondary analytics or engagement cards.

### Information Priority Hierarchy (Strict Order)
1. **Money Left Hero Card** (Dominant visual presentation: Total Income - Expenses - Savings - Debt).
2. **Money In Summary Card** (Total income logged for current month).
3. **Money Out Summary Card** (Total normal expenses logged for current month).
4. **Saved Summary Card** (Total allocations to savings targets/goals).
5. **Debt Paid Summary Card** (Total debt repayments logged).
6. **Quick Add Action Surface** (Persistent visual entry point for fast entry).
7. **Monthly Spending Plan Progress Bar** (Overall budget consumption vs planned income).
8. **Next Upcoming Bill Indicator** (Single most urgent upcoming bill due date).
9. **Top Spending Categories Breakdown** (Preview of top 3 spending categories).
10. **Contextual Money Win / Insight Surface** (Maximum ONE data-backed insight card).

### Information Classification
- **Primary Information**: Money Left, Money In, Money Out, Saved, Debt Paid.
- **Secondary Information**: Spending plan progress bar, Top categories preview, Upcoming bill indicator.
- **Contextual Information**: Next bill due alert, monthly rollover notice.
- **Optional Engagement Information**: Single real-data Money Win or educational tip card.

---

## 4. Activity Architecture

Activity is the organized repository of all financial events. It employs **progressive disclosure** so advanced search and filter controls do not clutter the default timeline view.

### Hierarchy & Content Structure
1. **Header & Context Controls**: Current month picker, search trigger, filter trigger.
2. **Transaction Summary Bar**: Total transactions count and net total for selected view.
3. **Transaction Timeline List**: Chronological grouping by date (Today, Yesterday, earlier dates).
   - *Income items*: Green accent, clear source name, category tag, positive amount.
   - *Expense items*: Neutral/subtle accent, merchant/description, category tag, negative visual formatting.
   - *Savings allocations*: Dedicated badge, target goal label.
   - *Debt repayments*: Dedicated badge, debt label.
4. **Filter & Search Sheet** (Progressively Disclosed):
   - Filter by classification (Money In, Money Out, Savings, Debt).
   - Filter by specific Category.
   - Date range selector.
5. **Transaction Detail Surface** (Bottom Sheet / Modal):
   - Full transaction details (Amount, Date, Category, Classification, Note, Sync status).
   - Edit action trigger.
   - Delete action trigger with confirmation prompt.

---

## 5. Plan Architecture

Plan consolidates all forward-looking financial tools into a single organized workspace, preventing navigation fragmentation.

### Plan Information Sub-Sections
Plan is organized into three focused tabs/sections:

1. **Monthly Spending Plan**:
   - Total planned spending vs Total projected income bar.
   - Category budget list (Planned vs Actual spending with visual progress indicators).
   - Over-plan neutral warning indicators.
   - "Set Plan / Edit Plan" action.
2. **Savings Targets & Goals**:
   - Aggregate savings summary (Total Saved across all active goals).
   - Savings Goals List (Goal name, target amount, current progress %, deadline).
   - Goal Detail Sheet (Contribution history, milestone celebration badge, add contribution trigger).
   - "Create New Goal" action.
3. **Bills & Subscriptions Tracker**:
   - Total upcoming bills amount for current month.
   - Upcoming Bills List (Bill name, amount, due date, status: Paid / Unpaid).
   - Tracked recurring subscriptions list.
   - "Mark as Paid" quick action (automatically logs Money Out expense).
   - "Add Bill / Subscription" action.

---

## 6. Profile & Settings Architecture

To maintain clarity, user options are divided between **Profile** (identity & tier context) and **Settings** (system preferences & security).

### Profile Section (Direct Access)
- User Display Name & Email.
- Universal Profile Type Badge (e.g., *Salaried Employee*, *Freelancer*).
- Subscription Status Banner (Free / Opti-Plan Plus Active).
- Quick Upgrade / Manage Subscription Trigger.

### Settings Sub-Sections (Grouped Modal / Sub-page)
- **Financial Preferences**: Primary currency selection (e.g. NGN, USD, GBP, EUR).
- **Appearance**: Theme selection (System, Dark Mode, Light Mode).
- **Profile Context**: Change Persona Profile type (updates category/onboarding hints).
- **Privacy & Security**: Password update, active sessions list, anonymized telemetry toggle.
- **Data & Account Controls**: Export transaction history (CSV/JSON), clear local offline cache, Delete Account trigger (with double confirmation).
- **Session Controls**: Sign Out across devices.

---

## 7. Authentication Architecture

Authentication is fast, secure, and minimal.

### Authentication Screens & Flows
1. **Sign Up Screen**: Email, password, accept terms checkbox, submit trigger.
2. **Email Verification / Check Email Screen**: Instructions to verify email with resend link trigger.
3. **Login Screen**: Email, password, submit trigger, "Forgot Password?" link.
4. **Forgot Password Screen**: Email input, send reset link trigger.
5. **Reset Password Screen**: New password input, confirm password, submit trigger.
6. **Session Recovery Handling**: Automatic return-to-app flow upon magic link / password reset token validation.

---

## 8. Onboarding Architecture

Onboarding takes less than 60 seconds and requires only essential setup decisions. Optional financial setup steps MUST NEVER block immediate access to the product.

### Step Breakdown & Fast-Track Path
1. **Step 1: Welcome & Profile Selection** (Mandatory: Select 1 of 8 universal personas to personalize category & onboarding hints).
2. **Step 2: Primary Currency Selection** (Mandatory: Choose default currency code).
3. **Step 3: Optional Initial Plan Setup** (Optional: Prompt to set optional initial spending limit or savings target).
   - *1-Tap Skip Action*: User can tap "Skip" at any point on Step 3 to navigate immediately to the Home dashboard (`/app`).
   - *Explicit Path*: `Profile Type -> Currency -> Optional Plan Setup -> Skip -> Home`

### Fast-Track Onboarding Rules
- **No Mandatory Spending Limit**: Setting a monthly spending limit is strictly optional.
- **No Mandatory Savings Target**: Creating a savings target during onboarding is strictly optional.
- **Fastest Time-to-Value Mandate**: Users must reach the active Home dashboard as quickly as possible. Optional planning setup must not block entry to Home.
- **Post-Onboarding Configuration**: Any skipped planning setup (spending plan limits, savings goals) can be configured later at any time from the **Plan** workspace or Settings.
- **No Extra Questionnaires**: Onboarding is strictly limited to 2 required choices (Profile + Currency). No extra survey or questionnaire steps may be introduced.

---

## 9. Subscription Architecture

Upgrade entry points are contextually placed without disrupting core financial utility.

### Upgrade Touchpoints
- **Free Tier Boundary Banners**: Displayed when creating a 2nd active savings goal or custom category.
- **Profile Banner**: Subtle "Upgrade to Opti-Plan Plus" badge on Profile screen.
- **Paywall Sheet / Screen**: Transparent feature comparison, price breakdown (Monthly/Annual disclaimers), Paystack Checkout button.
- **Manage Subscription Surface**: Active plan details, next billing date, renewal toggle, and 2-click cancellation trigger.

---

## 10. System Architecture & Structural States

Every functional area explicitly defines 9 universal system states:

1. **Initial Loading**: Skeleton cards matching exact layout bounds (no layout shifts).
2. **Slow Loading**: Calm progress indicator with fallback textual explanation after 3 seconds.
3. **Empty State**: Friendly illustration/icon, clear explanation, and primary action button (e.g. "Tap Quick Add to record your first expense").
4. **Success State**: Subtle non-blocking toast notification or checkmark feedback.
5. **Validation Error**: Clear inline error messages attached directly to invalid form fields.
6. **Server Error**: Human-readable error banner with retry trigger (raw database/PostgREST codes hidden).
7. **Offline State**: Non-intrusive top status bar ("Offline - Saved Locally").
8. **Syncing State**: Animated sync indicator ("Syncing 2 offline transactions...").
9. **Sync Failed State**: Warning banner with explicit "Retry Sync" action and local data preservation reassurance.
