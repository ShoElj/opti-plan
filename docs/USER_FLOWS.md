# Opti-Plan Master User Flows Specification

**Version:** 1.0  
**Phase:** Phase 1B — User Flows  
**Status:** Approved User Flows Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 & Phase 1A Documents

---

## 1. Executive Flow Philosophy

Opti-Plan's user flows are designed around **speed, simplicity, predictability, and financial truth**. A user navigating through any journey should instantly understand their location, their primary next action, and how to safely return or recover without friction.

Key principles enforced across all flows:
- **Mobile/PWA First**: Flows optimize for one-handed mobile touch interactions before scaling to desktop.
- **Fast Entry**: Primary money capture flows (Money In / Money Out via Quick Add) are completion-optimized ($\le 5$ seconds).
- **Single Source of Financial Truth**: All monetary actions update trusted domain metrics (`Money Left = Income - Expenses - Savings - Debt`). No secondary disconnected ledgers.
- **Transparent & Ethical**: Subscription paywalls and cancellations are straightforward; FOMO is backed strictly by real calendar dates; engagement cards are dismissible.
- **Offline Resilient**: Actions completed offline are queued locally with immediate optimistic UI updates and background sync on reconnect.

---

## 2. Definitive User Flows (Flow 01 to Flow 46)

### AUTHENTICATION & ONBOARDING FLOWS

#### FLOW 01 — New User Registration
- **Flow ID**: FLOW-01
- **Flow Name**: New User Registration
- **User Goal**: Create a new Opti-Plan account and initiate onboarding.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Unauthenticated Visitor on Landing Page (`SCR-PUB-01`)
- **Entry Point**: Tap "Get Started" button on Landing Page or navigate to `/signup`
- **Preconditions**: Active internet connection
- **Primary Path**:
  1. User arrives on Sign Up form (`SCR-AUTH-01`).
  2. User enters Email address and desired Password.
  3. User checks "Agree to Terms & Privacy Policy".
  4. User taps "Create Account".
  5. System validates inputs, submits auth payload to Supabase Auth API, and creates account record.
  6. System navigates user to Check Email / Verification screen (`SCR-AUTH-05`).
  7. Upon clicking email verification link, user session is initialized and redirected to Onboarding (`SCR-ONB-01`).
- **Decision Points**:
  - *Email already registered?* -> Display inline error banner with "Log In instead" link.
  - *Weak password?* -> Display inline validation message requiring min 8 characters.
- **Success State**: Account created, verification email sent, session ready for onboarding.
- **Error / Recovery Path**: Display inline field error messages. Allow resending verification email from `SCR-AUTH-05`.
- **Offline Consideration**: Form submission requires active network connection. If offline, display offline status banner.
- **Subscription Consideration**: User automatically assigned default `free` subscription state.
- **Behavioral Engagement Consideration**: Encouraging, calm registration copy; no aggressive upsell prompts.
- **Accessibility Consideration**: Accessible form field labels, keyboard focus sequence (`Email` -> `Password` -> `Checkbox` -> `Submit`), screen reader error announcements.
- **Exit / Return Location**: Navigates to `SCR-ONB-01` (Onboarding Step 1) or `SCR-AUTH-02` (Login).
- **Maximum Navigation Depth**: 1
- **Notes**: Zero unnecessary fields (e.g. no phone number, credit card, or address required at signup).

#### FLOW 02 — Returning User Login
- **Flow ID**: FLOW-02
- **Flow Name**: Returning User Login
- **User Goal**: Authenticate an existing account and access the Home dashboard.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Unauthenticated User on Login Page (`SCR-AUTH-02`)
- **Entry Point**: Tap "Sign In" link from Landing Page (`/`) or direct access (`/login`)
- **Preconditions**: User has registered account
- **Primary Path**:
  1. User enters Email and Password on `SCR-AUTH-02`.
  2. User taps "Sign In".
  3. System authenticates credentials via Supabase Auth API.
  4. System fetches verified account metadata and subscription state.
  5. System navigates user directly to Home Dashboard (`SCR-HOM-01`).
- **Decision Points**:
  - *Invalid credentials?* -> Display calm error banner: "Invalid email or password. Please try again."
  - *Account unverified?* -> Redirect to `SCR-AUTH-05` (Check Email) with "Resend link" button.
  - *Forgotten password?* -> User taps "Forgot Password?" -> Navigates to `SCR-AUTH-03`.
- **Success State**: Authenticated session established; Home Dashboard loaded.
- **Error / Recovery Path**: Allow password reset flow or resend verification link.
- **Offline Consideration**: Active connection required for initial authentication token issuance.
- **Subscription Consideration**: Restores exact server-verified subscription state (`free`, `active`, `past_due`, etc.).
- **Behavioral Engagement Consideration**: Reassuring, welcoming login copy.
- **Accessibility Consideration**: Auto-focus on Email field; password visibility toggle button with `aria-label`.
- **Exit / Return Location**: Navigates to `SCR-HOM-01` (Home Dashboard).
- **Maximum Navigation Depth**: 1
- **Notes**: Session recovery automatically restores session if valid token exists in storage.

#### FLOW 03 — Fast-Track Onboarding
- **Flow ID**: FLOW-03
- **Flow Name**: Fast-Track Onboarding
- **User Goal**: Set up persona profile and primary currency in under 60 seconds.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Newly authenticated user session at Onboarding Step 1 (`SCR-ONB-01`)
- **Entry Point**: Automatic redirect after email verification
- **Preconditions**: Verified account session
- **Primary Path**:
  1. User views Onboarding Step 1 (`SCR-ONB-01`) displaying 8 Persona profile cards.
  2. User selects 1 Persona profile card (e.g., *Salaried Employee*, *Freelancer*, etc.) and taps "Continue".
  3. System navigates to Onboarding Step 2 (`SCR-ONB-02`).
  4. User selects Primary Currency code (e.g. NGN, USD, GBP, EUR) from dropdown.
  5. User views optional initial spending plan / income prompt.
  6. User taps "Skip" (or enters optional amount and taps "Complete").
  7. System saves user profile payload and navigates immediately to Home Dashboard (`SCR-HOM-01`).
- **Explicit Fast-Track Path**: `Profile Type -> Currency -> Optional Plan Setup -> Skip -> Home`
- **Decision Points**:
  - *User taps "Skip" on Step 3?* -> Skips optional plan setup and completes onboarding instantly.
  - *User enters optional income estimate?* -> Saves initial income baseline and completes onboarding.
- **Success State**: User profile configured; Home Dashboard displayed with profile-tailored category hints.
- **Error / Recovery Path**: If network fails during save, save locally to IndexedDB and proceed to Home.
- **Offline Consideration**: Profile selection saved locally if network drops during onboarding.
- **Subscription Consideration**: Default free tier initialized.
- **Behavioral Engagement Consideration**: Empowering milestone completion visual checkmark.
- **Accessibility Consideration**: High-contrast persona selection cards with screen-reader selected states (`aria-selected="true"`).
- **Exit / Return Location**: Navigates to `SCR-HOM-01` (Home Dashboard).
- **Maximum Navigation Depth**: 2
- **Notes**: Optional spending limits and savings goals are strictly non-blocking and can be configured later from Plan.

---

### CORE MONEY FLOWS (QUICK ADD)

*Interaction Assumptions Disclaimer:*
- Quick Add defaulting to Money Out is annotated as: `[WORKING INTERACTION ASSUMPTION — TO BE TESTED IN PHASE 1C]`.
- Completing a common transaction in $\le 5$ seconds is annotated as: `[INITIAL UX TARGET — SUBJECT TO USABILITY TESTING]`. This is a desired usability target, not a guaranteed product performance claim. Phase 1C wireframe testing should evaluate whether the flow actually feels fast; required financial clarity must not be sacrificed merely to hit a time target.

#### FLOW 04 — Add Money In from Home (Quick Add)
- **Flow ID**: FLOW-04
- **Flow Name**: Add Money In from Home (Quick Add)
- **User Goal**: Record an income/inflow transaction from Home (`[INITIAL UX TARGET — SUBJECT TO USABILITY TESTING]`: Target $\le 5$ seconds completion).
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`)
- **Entry Point**: Tap persistent Quick Add (+) FAB on bottom navigation bar
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps (+) FAB on Home Dashboard.
  2. Quick Add Modal Sheet (`SCR-QA-01`) slides up over Home.
  3. User selects "Money In" tab.
  4. Numeric keypad auto-focuses on Amount field; User enters amount (e.g. 500,000).
  5. User selects Income Category source (e.g., *Salary*, *Client Payment*, *Bonus*).
  6. Date defaults to Today (changeable via date picker).
  7. User taps "Save Transaction".
  8. Quick Add sheet closes; Home Dashboard updates Money In, Money Left, and timeline immediately with checkmark toast.
- **Decision Points**:
  - *Amount empty or zero?* -> Disable Save button; display inline hint "Enter an amount".
  - *Optional note needed?* -> User taps "Add note" to disclose note text input field.
- **Success State**: Inflow transaction recorded; Money In and Money Left metrics updated in real-time.
- **Error / Recovery Path**: If offline, queue transaction in IndexedDB and render optimistic Home update with "Offline - Saved locally" status.
- **Offline Consideration**: Instantaneous optimistic local save; background sync triggers on reconnect.
- **Subscription Consideration**: Available on Free and Plus tiers without limits.
- **Behavioral Engagement Consideration**: Instantaneous checkmark animation; may trigger a Money Win card if qualifying real data exists.
- **Accessibility Consideration**: Numeric keypad accessible; Amount field receives immediate auto-focus; `aria-live` announcement: "Income saved successfully".
- **Exit / Return Location**: Sheet closes back to `SCR-HOM-01` (Home Dashboard).
- **Maximum Navigation Depth**: 1
- **Notes**: Amount field receives immediate first focus upon opening sheet.

#### FLOW 05 — Add Money Out from Home (Quick Add)
- **Flow ID**: FLOW-05
- **Flow Name**: Add Money Out from Home (Quick Add)
- **User Goal**: Record an expense/outflow transaction from Home (`[INITIAL UX TARGET — SUBJECT TO USABILITY TESTING]`: Target $\le 5$ seconds completion).
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`)
- **Entry Point**: Tap persistent Quick Add (+) FAB on bottom navigation bar
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps (+) FAB on Home Dashboard.
  2. Quick Add Modal Sheet (`SCR-QA-01`) slides up, defaulting to "Money Out" tab (`[WORKING INTERACTION ASSUMPTION — TO BE TESTED IN PHASE 1C]`).
  3. User enters expense amount (e.g. 4,500) via numeric keypad.
  4. User selects Category (e.g., *Food & Groceries*, *Transport*, *Utilities*).
  5. User selects Classification toggle (Default: *Normal Expense*; options: *Savings Contribution*, *Debt Repayment*).
  6. Date defaults to Today.
  7. User taps "Save Transaction".
  8. Sheet closes; Home Dashboard updates Money Out, Money Left, Spending Plan progress bar, and category totals with success toast.
- **Decision Points**:
  - *Classification is Savings Contribution?* -> Item recorded as savings allocation (updates Saved summary card instead of normal expenses).
  - *Classification is Debt Repayment?* -> Item recorded as debt allocation (updates Debt Paid summary card).
- **Success State**: Outflow transaction recorded; Money Out, Money Left, and Spending Plan updated.
- **Error / Recovery Path**: Inline validation if amount invalid. Optimistic local queue if offline.
- **Offline Consideration**: Saved to IndexedDB offline queue immediately.
- **Subscription Consideration**: Custom categories prompt Paywall on free tier if custom category limit reached.
- **Behavioral Engagement Consideration**: Neutral over-budget progress bar update if spending plan limit approached.
- **Accessibility Consideration**: Touch targets $\ge 44 \times 44$ pt; category icons accompanied by visible textual labels.
- **Exit / Return Location**: Sheet closes back to `SCR-HOM-01` (Home Dashboard).
- **Maximum Navigation Depth**: 1
- **Notes**: Most-frequently used flow in the app; optimized for minimal touches. Defaulting to Money Out is a candidate interaction assumption to be tested in Phase 1C usability evaluation.

#### FLOW 06 — Add Money In from another primary section
- **Flow ID**: FLOW-06
- **Flow Name**: Add Money In from another primary section
- **User Goal**: Log income while browsing Activity, Plan, or Profile without losing context.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Activity Tab (`SCR-ACT-01`), Plan Tab (`SCR-PLN-01`), or Profile Tab (`SCR-PRF-01`)
- **Entry Point**: Tap persistent Quick Add (+) FAB on bottom navigation bar
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps persistent (+) FAB while viewing Activity, Plan, or Profile.
  2. Quick Add Modal Sheet (`SCR-QA-01`) slides up over current view.
  3. User selects "Money In" tab, enters amount, chooses source category, and taps "Save".
  4. Sheet closes; user returns to exact prior view (Activity timeline updates inline if currently viewing Activity).
- **Decision Points**: Same validation as Flow 04.
- **Success State**: Transaction saved; background metrics updated; user remains on active screen.
- **Error / Recovery Path**: Same error handling as Flow 04.
- **Offline Consideration**: Queued locally in IndexedDB.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Non-intrusive toast feedback.
- **Accessibility Consideration**: Focus restores to (+ ) FAB upon modal dismissal.
- **Exit / Return Location**: Returns to exact originating screen (`Activity`, `Plan`, or `Profile`).
- **Maximum Navigation Depth**: 1
- **Notes**: Preserves complete navigation state of the underlying tab.

#### FLOW 07 — Add Money Out from another primary section
- **Flow ID**: FLOW-07
- **Flow Name**: Add Money Out from another primary section
- **User Goal**: Log an expense while browsing Activity, Plan, or Profile without losing context.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Activity Tab (`SCR-ACT-01`), Plan Tab (`SCR-PLN-01`), or Profile Tab (`SCR-PRF-01`)
- **Entry Point**: Tap persistent Quick Add (+) FAB on bottom navigation bar
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps (+) FAB while viewing Activity, Plan, or Profile.
  2. Quick Add Modal Sheet (`SCR-QA-01`) slides up over current view (defaulting to Money Out).
  3. User enters amount, selects Category, and taps "Save".
  4. Sheet closes; user returns to originating view (Plan budget bars update inline if currently viewing Plan).
- **Decision Points**: Same as Flow 05.
- **Success State**: Expense saved; underlying view metrics update dynamically.
- **Error / Recovery Path**: Same as Flow 05.
- **Offline Consideration**: Saved to local offline queue.
- **Subscription Consideration**: Standard free/plus tier rules apply.
- **Behavioral Engagement Consideration**: Calm toast feedback.
- **Accessibility Consideration**: Restores focus to (+) FAB upon modal dismissal.
- **Exit / Return Location**: Returns to originating screen (`Activity`, `Plan`, or `Profile`).
- **Maximum Navigation Depth**: 1
- **Notes**: Ensures zero context-switching friction.

---

### ACTIVITY FLOWS

#### FLOW 08 — View transaction history
- **Flow ID**: FLOW-08
- **Flow Name**: View transaction history
- **User Goal**: Review full timeline of logged inflows, outflows, savings, and debt repayments.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`)
- **Entry Point**: Tap "Activity" tab on bottom navigation bar (`/app/activity`)
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Activity" tab on bottom nav bar.
  2. System displays Activity Timeline View (`SCR-ACT-01`).
  3. Top controls render Month Selector (defaulting to current month) and Search/Filter bar.
  4. Timeline renders chronological date groups (Today, Yesterday, Earlier dates).
  5. Each item displays Category icon, Name/Description, Classification badge, Date, and Amount formatting (+Green for Inflow, -Neutral for Outflow).
- **Decision Points**:
  - *No transactions in selected month?* -> Render empty state: "No transactions logged for this month. Tap Quick Add to record one."
- **Success State**: Transaction timeline rendered cleanly.
- **Error / Recovery Path**: Display error banner with "Retry" button if database query fails.
- **Offline Consideration**: Render locally cached IndexedDB transactions with sync status icons for pending items.
- **Subscription Consideration**: Available on Free and Plus tiers without timeline restrictions.
- **Behavioral Engagement Consideration**: Clear visual categorization; non-shaming neutral presentation.
- **Accessibility Consideration**: Accessible list markup (`<ul>` / `<li>`); screen-reader announces date headers and item descriptions.
- **Exit / Return Location**: Navigates to `SCR-ACT-02` (Detail Sheet) or other bottom nav tabs.
- **Maximum Navigation Depth**: 1
- **Notes**: Month selector allows toggling to previous months.

#### FLOW 09 — Search old transaction
- **Flow ID**: FLOW-09
- **Flow Name**: Search old transaction
- **User Goal**: Find a specific transaction by keyword or description.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Activity Timeline View (`SCR-ACT-01`)
- **Entry Point**: Tap Search input bar at top of Activity View
- **Preconditions**: Viewing Activity timeline
- **Primary Path**:
  1. User taps Search input field on `SCR-ACT-01`.
  2. User types query string (e.g., "Uber", "Salary", "Groceries").
  3. System filters active transaction list in real-time matching description or category name.
  4. Matching transactions render in filtered timeline list.
  5. User taps matching transaction item to inspect detail.
- **Decision Points**:
  - *No search matches?* -> Render empty search result message: "No transactions matching '[query]'."
  - *User clears search input?* -> Restore full month transaction timeline.
- **Success State**: Target transaction located and displayed.
- **Error / Recovery Path**: Clear search text to restore full list.
- **Offline Consideration**: Performs real-time search against local IndexedDB store.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Fast, responsive utility search.
- **Accessibility Consideration**: Search input includes `aria-label="Search transactions"` and clear button (`x`).
- **Exit / Return Location**: Navigates to `SCR-ACT-02` (Detail Sheet) or clears search.
- **Maximum Navigation Depth**: 1
- **Notes**: Debounced client-side filtering for instantaneous response.

#### FLOW 10 — Filter transactions
- **Flow ID**: FLOW-10
- **Flow Name**: Filter transactions
- **User Goal**: Filter Activity timeline by classification (Money In, Money Out, Savings, Debt) or Category.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Activity Timeline View (`SCR-ACT-01`)
- **Entry Point**: Tap Filter icon/button next to Search bar
- **Preconditions**: Viewing Activity timeline
- **Primary Path**:
  1. User taps Filter icon on `SCR-ACT-01`.
  2. Filter Bottom Sheet slides up displaying filter options:
     - Classification: All / Money In / Money Out / Savings / Debt Repayments.
     - Category Picker dropdown.
  3. User selects classification filter (e.g. "Money Out") and/or specific category (e.g. "Transport").
  4. User taps "Apply Filter".
  5. Filter sheet closes; Activity timeline updates to display only matching filtered items.
- **Decision Points**:
  - *User taps "Reset Filters"?* -> Clears selection and restores full list.
- **Success State**: Timeline filtered according to user criteria.
- **Error / Recovery Path**: Reset filters if no items match.
- **Offline Consideration**: Filter executes locally against IndexedDB.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Clean summary bar showing total filtered amount.
- **Accessibility Consideration**: Filter options use accessible radio button / checkbox groups (`role="radiogroup"`).
- **Exit / Return Location**: Sheet closes back to `SCR-ACT-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Active filter pill displayed on top bar when filter is applied.

#### FLOW 11 — View transaction detail
- **Flow ID**: FLOW-11
- **Flow Name**: View transaction detail
- **User Goal**: Inspect full details, note, date, classification, and sync status of a logged transaction.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Activity Timeline View (`SCR-ACT-01`)
- **Entry Point**: Tap any transaction item card in timeline
- **Preconditions**: Transaction exists in list
- **Primary Path**:
  1. User taps a transaction card in Activity timeline.
  2. Transaction Detail Sheet (`SCR-ACT-02`) slides up over Activity view.
  3. Sheet displays: Category icon, Amount, Classification badge, Category name, Date, Note text, and Sync Status badge ("Synced" / "Pending Sync").
  4. Action buttons rendered at bottom: "Edit Transaction" and "Delete".
- **Decision Points**:
  - *User taps "Edit"?* -> Switches sheet to edit mode (Flow 12).
  - *User taps "Delete"?* -> Displays delete confirmation dialog (Flow 13).
  - *User taps close (X) or backdrop?* -> Dismisses sheet back to Activity timeline.
- **Success State**: Transaction details clearly inspected.
- **Error / Recovery Path**: Close sheet if item no longer exists.
- **Offline Consideration**: Displays local sync status banner if item is pending sync.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Clear factual details; non-judgmental tone.
- **Accessibility Consideration**: Dialog role `aria-modal="true"`; structured headings for details.
- **Exit / Return Location**: Sheet closes back to `SCR-ACT-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Non-destructive view mode by default.

#### FLOW 12 — Edit transaction
- **Flow ID**: FLOW-12
- **Flow Name**: Edit transaction
- **User Goal**: Modify amount, category, date, or note of an existing transaction and update financial totals.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Transaction Detail Sheet (`SCR-ACT-02`)
- **Entry Point**: Tap "Edit Transaction" button on Detail Sheet
- **Preconditions**: Viewing transaction detail
- **Primary Path**:
  1. User taps "Edit Transaction" on `SCR-ACT-02`.
  2. Sheet fields switch to editable inputs (Amount, Category, Classification, Date, Note).
  3. User modifies desired fields (e.g. changes Amount from 4,500 to 5,000).
  4. User taps "Save Changes".
  5. System validates inputs, updates transaction record in database/IndexedDB, and recalculates monthly financial metrics (Money Left, Money Out, Category totals).
  6. Sheet updates to read-only detail view with success toast.
- **Decision Points**:
  - *Amount changed to invalid value?* -> Display inline error; block save.
  - *User taps "Cancel"?* -> Revert changes and return to read-only detail view.
- **Success State**: Transaction updated; all dependent financial metrics recalculated across Home, Activity, and Plan views.
- **Error / Recovery Path**: Server error banner with "Retry" button. Local data preserved.
- **Offline Consideration**: Save edits to IndexedDB local queue and mark item as pending sync. Recalculate local metrics immediately.
- **Subscription Consideration**: Standard category rules apply.
- **Behavioral Engagement Consideration**: Automatic recalculation reassurance toast.
- **Accessibility Consideration**: Accessible form inputs with inline error messaging.
- **Exit / Return Location**: Returns to `SCR-ACT-02` (Detail view) or `SCR-ACT-01` (Timeline).
- **Maximum Navigation Depth**: 2
- **Notes**: Single source of financial truth ensures edit updates all dashboard metrics instantly.

#### FLOW 13 — Delete transaction
- **Flow ID**: FLOW-13
- **Flow Name**: Delete transaction
- **User Goal**: Permanently remove a logged transaction and update financial metrics.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Transaction Detail Sheet (`SCR-ACT-02`)
- **Entry Point**: Tap "Delete" button on Detail Sheet
- **Preconditions**: Viewing transaction detail
- **Primary Path**:
  1. User taps "Delete" button on `SCR-ACT-02`.
  2. System displays confirmation dialog: "Delete this transaction? This will adjust your Money Left and category totals."
  3. User taps "Confirm Delete".
  4. System removes transaction record from database/IndexedDB and recalculates month financial totals.
  5. Detail sheet and confirmation dialog close; Activity timeline updates with toast: "Transaction deleted".
- **Decision Points**:
  - *User taps "Cancel"?* -> Confirmation dialog closes; transaction preserved.
- **Success State**: Transaction deleted; all monthly financial totals updated.
- **Error / Recovery Path**: Display error message if deletion fails.
- **Offline Consideration**: Queue deletion in IndexedDB offline queue; remove item from local UI immediately.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Non-shaming confirmation prompt; clear impact statement.
- **Accessibility Consideration**: Confirmation dialog uses `role="alertdialog"`; focus locked to confirmation buttons.
- **Exit / Return Location**: Returns to `SCR-ACT-01` (Activity Timeline).
- **Maximum Navigation Depth**: 2
- **Notes**: Deletion triggers dynamic recalculation of Money Left hero numbers.

---

### PLAN FLOWS (BUDGETS, GOALS, BILLS)

#### FLOW 14 — Open Plan overview
- **Flow ID**: FLOW-14
- **Flow Name**: Open Plan overview
- **User Goal**: Access the unified Plan workspace for spending plans, savings goals, and bills.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`)
- **Entry Point**: Tap "Plan" tab on bottom navigation bar (`/app/plan`)
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Plan" tab on bottom nav bar.
  2. System renders Plan Overview View (`SCR-PLN-01`).
  3. Header displays Total Planned Spending vs Projected Income progress bar.
  4. Sub-navigation tabs rendered: **Spending Plan** (default), **Savings Goals**, **Bills & Subscriptions**.
  5. Active tab (Spending Plan) renders category budget cards with planned vs actual spending progress bars.
- **Decision Points**:
  - *User taps "Savings Goals" tab?* -> Renders Savings Goals list (`SCR-PLN-02`).
  - *User taps "Bills & Subscriptions" tab?* -> Renders Bills tracker list (`SCR-PLN-03`).
- **Success State**: Plan overview displayed cleanly with sub-tab controls.
- **Error / Recovery Path**: Display retry banner if plan data fails to load.
- **Offline Consideration**: Render cached local plan metrics from IndexedDB.
- **Subscription Consideration**: Displays custom category disclaimers if free tier limits apply.
- **Behavioral Engagement Consideration**: Neutral visual budget progress bars (amber/warm gray).
- **Accessibility Consideration**: Accessible tab strip markup (`role="tablist"` / `role="tab"`).
- **Exit / Return Location**: Navigates to sub-tabs or other main anchors.
- **Maximum Navigation Depth**: 1
- **Notes**: Consolidates 3 planning tools under 1 anchor without top-level navigation fragmentation.

#### FLOW 15 — Set monthly spending limit
- **Flow ID**: FLOW-15
- **Flow Name**: Set monthly spending limit
- **User Goal**: Configure spending plan targets for the current planning month.
- **Scope Disclaimer**: `[OPTIONAL CAPABILITY — BASELINE MVP FOCUS IS OVERALL MONTHLY PLAN]` *(The approved baseline MVP requires a simple overall monthly spending plan. Category-level limits must not complicate Version 1 and remain an optional/future capability. Phase 1C wireframes will focus primarily on the simple overall monthly spending limit).*
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Plan View -> Spending Plan Tab (`SCR-PLN-01`)
- **Entry Point**: Tap "Edit Spending Plan" button on Plan View
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Edit Spending Plan" on `SCR-PLN-01`.
  2. Spending Plan Editor Sheet slides up displaying overall monthly spending plan input field and optional category breakdown inputs (`[OPTIONAL CAPABILITY — BASELINE MVP FOCUS IS OVERALL MONTHLY PLAN]`).
  3. User enters target overall monthly spending limit (and optional category allocations).
  4. Total planned spending bar updates dynamically as limits are entered.
  5. User taps "Save Spending Plan".
  6. System saves plan targets to database/IndexedDB and updates Plan progress bars with checkmark toast.
- **Decision Points**:
  - *Planned spending exceeds monthly income?* -> Display neutral info note: "Planned spending exceeds logged income. You can adjust targets anytime." (Does not block save).
  - *User clears category limit?* -> Category spending limit removed (unplanned spending allowed).
- **Success State**: Spending plan set; Plan overview and Home progress bar updated.
- **Error / Recovery Path**: Inline error if amount format invalid.
- **Offline Consideration**: Save plan targets locally to IndexedDB and queue sync.
- **Subscription Consideration**: Free tier supports baseline standard categories; custom categories prompt Paywall on free tier.
- **Behavioral Engagement Consideration**: Non-shaming copy when planned spending exceeds income.
- **Accessibility Consideration**: Input fields labeled with category names; keyboard focus tab sequence.
- **Exit / Return Location**: Sheet closes back to `SCR-PLN-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Setting a plan is strictly optional. Focus remains on the simple overall monthly spending limit.

#### FLOW 16 — Set monthly savings target
- **Flow ID**: FLOW-16
- **Flow Name**: Set monthly savings target
- **User Goal**: Define an overall monthly savings contribution target.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Plan View -> Savings Goals Tab (`SCR-PLN-02`)
- **Entry Point**: Tap "Set Monthly Target" button on Savings Tab
- **Preconditions**: Viewing Savings Goals Tab
- **Primary Path**:
  1. User taps "Set Monthly Target" on `SCR-PLN-02`.
  2. Target Editor Modal Sheet opens.
  3. User enters total monthly savings target amount (e.g. 100,000).
  4. User taps "Save Target".
  5. System saves target and updates Monthly Savings progress bar on Savings tab.
- **Decision Points**:
  - *User taps "Remove Target"?* -> Monthly savings target cleared.
- **Success State**: Monthly savings target set; progress tracked against monthly savings allocations.
- **Error / Recovery Path**: Inline error if input invalid.
- **Offline Consideration**: Saved locally to IndexedDB.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Encouraging milestone progress feedback.
- **Accessibility Consideration**: Accessible modal dialog markup.
- **Exit / Return Location**: Returns to `SCR-PLN-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Setting an overall monthly target is optional.

#### FLOW 17 — Create savings goal
- **Flow ID**: FLOW-17
- **Flow Name**: Create savings goal
- **User Goal**: Establish a specific target savings goal (e.g., *Emergency Fund*, *New Laptop*, *Rent*).
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Plan View -> Savings Goals Tab (`SCR-PLN-02`)
- **Entry Point**: Tap "Create Goal" button on Savings Tab
- **Preconditions**: Viewing Savings Goals Tab
- **Primary Path**:
  1. User taps "Create Goal" on `SCR-PLN-02`.
  2. Create Goal Modal Sheet opens.
  3. User inputs Goal Name (e.g. "Laptop Fund") and Target Amount (e.g. 350,000).
  4. User selects optional Target Completion Date via date picker.
  5. User taps "Save Goal".
  6. System validates inputs and creates goal record.
  7. Sheet closes; Savings Goals list updates displaying new goal card with 0% initial progress bar.
- **Decision Points**:
  - *Free tier user attempts 2nd active goal?* -> Interrupt with Paywall Sheet (`SCR-SUB-01`): `[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]` *(Demonstrates contextual monetization behavior; exact Free vs Plus goal limits remain an open product decision subject to final sign-off).*
- **Success State**: New savings goal created and displayed in goals list.
- **Error / Recovery Path**: Inline validation error if Goal Name or Target Amount empty.
- **Offline Consideration**: Save goal record to IndexedDB offline queue.
- **Subscription Consideration**: `[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]` Free tier goal limits demonstrate contextual paywall trigger; exact limits to be finalized.
- **Behavioral Engagement Consideration**: Positive goal creation checkmark animation.
- **Accessibility Consideration**: Clear form field labels; target date picker accessible via keyboard.
- **Exit / Return Location**: Returns to `SCR-PLN-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Creation form requires only Name and Target Amount (date is optional).

#### FLOW 18 — Add contribution to goal
- **Flow ID**: FLOW-18
- **Flow Name**: Add contribution to goal
- **User Goal**: Record a savings allocation toward a specific active goal.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Savings Goal Card on `SCR-PLN-02`
- **Entry Point**: Tap "Add Contribution" button on Goal Card
- **Preconditions**: Active goal exists
- **Primary Path**:
  1. User taps "Add Contribution" on target Goal Card.
  2. Contribution Modal Sheet opens displaying Goal Name and Current Saved balance.
  3. User enters contribution amount (e.g. 25,000).
  4. User selects source (defaults to logging a Money Out transaction classified as *Savings Contribution*).
  5. User taps "Save Contribution".
  6. System logs outflow transaction classified as *Savings Contribution*, updates Goal saved balance, and recalculates Money Left (`Money Left = Income - Expenses - Savings - Debt`).
  7. Sheet closes; Goal card progress bar updates with celebration feedback.
- **Data Model Disclaimer**: `[OPEN INTERACTION / DATA DECISION — REQUIRES PHASE 2 ARCHITECTURE CONFIRMATION]` *(Goal progress references single verified transaction ledger to avoid double counting).*
- **Decision Points**:
  - *Contribution completes goal target?* -> Triggers Goal Completion flow (Flow 19).
- **Success State**: Savings contribution recorded; goal progress updated; single financial source of truth preserved.
- **Error / Recovery Path**: Inline validation if amount empty or invalid.
- **Offline Consideration**: Saved to local offline queue and IndexedDB.
- **Subscription Consideration**: Contribution logging supported on all tiers.
- **Behavioral Engagement Consideration**: Subtle progress bar fill animation and milestone celebration badge.
- **Accessibility Consideration**: Accessible modal dialog; dynamic `aria-valuenow` updated on progress bar.
- **Exit / Return Location**: Returns to `SCR-PLN-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Single financial formula ensures savings contributions update Saved card without double-counting as normal expenses.

#### FLOW 19 — Goal completed
- **Flow ID**: FLOW-19
- **Flow Name**: Goal completed
- **User Goal**: Receive real milestone recognition upon completing 100% of a savings goal target.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: User saves contribution that brings Goal balance $\ge$ Target Amount
- **Entry Point**: Automatic trigger upon saving qualifying contribution (Flow 18)
- **Preconditions**: Verified database goal balance reaches target
- **Primary Path**:
  1. User saves contribution meeting or exceeding goal target.
  2. Contribution sheet closes; Goal card displays "Goal Completed!" milestone badge.
  3. Subtle celebration animation plays (confetti / milestone badge reveal).
  4. Optional prompt displayed: "Mark Goal as Completed & Archive" or "Keep Active".
  5. User taps "Mark Completed". Goal moves to Completed Goals archive list.
- **Decision Points**:
  - *User taps "Keep Active"?* -> Goal remains active in goals list for extra savings.
- **Success State**: Real milestone celebrated; goal archived; verified data integrity.
- **Error / Recovery Path**: N/A
- **Offline Consideration**: Celebration renders offline based on local math.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Real-data milestone celebration (strictly non-gambling; no fake mystery cash).
- **Accessibility Consideration**: Celebration announcement `aria-live="polite"`; respects `prefers-reduced-motion`.
- **Exit / Return Location**: Returns to `SCR-PLN-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Real-data verification invariant ensures rewards trigger only on actual database completion.

#### FLOW 20 — Edit/Delete goal
- **Flow ID**: FLOW-20
- **Flow Name**: Edit/Delete goal
- **User Goal**: Modify goal parameters (name, target, target date) or delete an unwanted goal.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Savings Goal Card on `SCR-PLN-02`
- **Entry Point**: Tap Goal Card -> Tap "Edit Goal" or "Delete Goal"
- **Preconditions**: Goal exists in list
- **Primary Path (Edit)**:
  1. User taps Goal Card -> "Edit Goal".
  2. Goal Editor Sheet opens with existing fields populated.
  3. User modifies Name, Target Amount, or Target Date and taps "Save Changes".
  4. Sheet closes; Goal card updates progress percentage.
- **Primary Path (Delete)**:
  1. User taps Goal Card -> "Delete Goal".
  2. Confirmation dialog displays: "Delete this savings goal? Historical savings contributions will remain in your transaction activity history."
  3. User taps "Confirm Delete".
  4. Goal removed from list; Activity transaction records preserved.
- **Decision Points**:
  - *User cancels deletion?* -> Dialog closes; goal preserved.
- **Success State**: Goal updated or deleted cleanly.
- **Error / Recovery Path**: Inline error if update fails.
- **Offline Consideration**: Queued locally in IndexedDB.
- **Subscription Consideration**: Deleting a goal frees up goal slot on free tier.
- **Behavioral Engagement Consideration**: Clear data preservation reassurance on deletion dialog.
- **Accessibility Consideration**: Deletion confirmation uses `role="alertdialog"`.
- **Exit / Return Location**: Returns to `SCR-PLN-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Historical savings transactions remain intact when a goal is deleted.

---

### BILLS FLOWS

#### FLOW 21 — Create bill
- **Flow ID**: FLOW-21
- **Flow Name**: Create bill
- **User Goal**: Track a recurring bill or payment due date (e.g., *Rent*, *Electricity*, *Internet*).
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Plan View -> Bills & Subscriptions Tab (`SCR-PLN-03`)
- **Entry Point**: Tap "Add Bill" button on Bills Tab
- **Preconditions**: Viewing Bills Tab
- **Primary Path**:
  1. User taps "Add Bill" on `SCR-PLN-03`.
  2. Create Bill Modal Sheet opens.
  3. User inputs Bill Name (e.g. "Internet"), Amount (e.g. 15,000), and Due Date (e.g. 28th of month).
  4. User selects Recurrence Frequency (Default: *Monthly*; options: *Weekly*, *Quarterly*, *Annual*).
  5. User taps "Save Bill".
  6. System validates inputs and saves bill record.
  7. Sheet closes; Bills list updates displaying new bill with status "Unpaid".
- **Decision Points**:
  - *Amount or Name empty?* -> Display inline validation error.
- **Success State**: Bill created and tracked for upcoming due-date alerts.
- **Error / Recovery Path**: Inline error formatting.
- **Offline Consideration**: Save bill locally to IndexedDB.
- **Subscription Consideration**: Available on Free and Plus tiers.
- **Behavioral Engagement Consideration**: Transparent due-date tracking.
- **Accessibility Consideration**: Accessible form inputs and frequency select dropdown.
- **Exit / Return Location**: Returns to `SCR-PLN-03`.
- **Maximum Navigation Depth**: 2
- **Notes**: Requires minimal fields (Name, Amount, Due Date).

#### FLOW 22 — View upcoming bill
- **Flow ID**: FLOW-22
- **Flow Name**: View upcoming bill
- **User Goal**: Inspect upcoming bill details and due-date alerts from Home or Plan.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`) or Plan Bills Tab (`SCR-PLN-03`)
- **Entry Point**: Tap "Next Upcoming Bill" card on Home OR tap Bill item on Plan Bills Tab
- **Preconditions**: Bill exists in system
- **Primary Path**:
  1. User taps "Next Upcoming Bill" card on Home (or Bill card in Plan).
  2. Bill Detail Sheet opens displaying: Bill Name, Amount, Due Date, Recurrence, Payment Status, and "Mark as Paid" button.
  3. User reviews details.
- **Decision Points**:
  - *User taps "Mark as Paid"?* -> Triggers Flow 23.
  - *User taps "Edit Bill"?* -> Opens Bill Editor (Flow 24).
- **Success State**: Bill details inspected.
- **Error / Recovery Path**: Close sheet if item unavailable.
- **Offline Consideration**: Render cached bill details.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Truthful due-date urgency ("Due in 2 days").
- **Accessibility Consideration**: Screen reader announces due date and payment status clearly.
- **Exit / Return Location**: Sheet closes back to `SCR-HOM-01` or `SCR-PLN-03`.
- **Maximum Navigation Depth**: 2
- **Notes**: Home card displays single most urgent bill due date.

#### FLOW 23 — Mark bill paid
- **Flow ID**: FLOW-23
- **Flow Name**: Mark bill paid
- **User Goal**: Mark an upcoming bill as paid and log the corresponding Money Out expense.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Bill Detail Sheet (`SCR-PLN-03`) or Home Upcoming Bill Card
- **Entry Point**: Tap "Mark as Paid" button on Bill Card/Sheet
- **Preconditions**: Unpaid bill exists
- **Primary Path**:
  1. User taps "Mark as Paid" on Bill Card/Sheet.
  2. Action Confirmation Modal opens: "Mark [Bill Name] as Paid for [Amount]? This will log a Money Out expense for today."
  3. User taps "Confirm & Log Expense".
  4. System updates Bill status to "Paid for [Current Month]" and automatically logs a Money Out transaction (classified as Normal Expense under bill category).
  5. System recalculates Money Out, Money Left, and Spending Plan totals.
  6. Sheet closes; Bill card updates to "Paid" status with checkmark toast.
- **Data Model Disclaimer**: `[OPEN DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]` *(Evaluated: Linking "Mark as Paid" directly to Money Out transaction generation to preserve financial calculation truth).*
- **Decision Points**:
  - *User cancels confirmation?* -> Dialog closes; bill remains unpaid.
- **Success State**: Bill marked paid; Money Out expense automatically logged; financial metrics updated.
- **Error / Recovery Path**: Server error alert with Retry option.
- **Offline Consideration**: Save bill status and expense transaction to IndexedDB local queue.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Satisfaction checkmark feedback; bill due alert removed.
- **Accessibility Consideration**: Alertdialog announcement for expense logging confirmation.
- **Exit / Return Location**: Returns to `SCR-PLN-03` or `SCR-HOM-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Eliminates double data entry by logging expense automatically upon marking paid.

#### FLOW 24 — Edit/Delete bill
- **Flow ID**: FLOW-24
- **Flow Name**: Edit/Delete bill
- **User Goal**: Modify bill details (name, amount, due date) or delete a recurring bill.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Bill Detail Sheet (`SCR-PLN-03`)
- **Entry Point**: Tap Bill Item -> "Edit Bill" or "Delete Bill"
- **Preconditions**: Bill exists
- **Primary Path (Edit)**:
  1. User taps "Edit Bill" on Detail Sheet.
  2. Bill Editor Sheet opens; User modifies Name, Amount, or Due Date and taps "Save Changes".
  3. Sheet closes; Bill details update.
- **Primary Path (Delete)**:
  1. User taps "Delete Bill".
  2. Confirmation dialog displays: "Delete recurring bill [Bill Name]? Previously logged paid expense records will remain in Activity history."
  3. User taps "Confirm Delete".
  4. Bill removed from tracked bills list; historical expense transactions preserved.
- **Decision Points**:
  - *User cancels deletion?* -> Dialog closes; bill preserved.
- **Success State**: Bill updated or deleted cleanly.
- **Error / Recovery Path**: Inline error alert.
- **Offline Consideration**: Saved locally to IndexedDB.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Safe confirmation prompt.
- **Accessibility Consideration**: Accessible modal dialog controls.
- **Exit / Return Location**: Returns to `SCR-PLN-03`.
- **Maximum Navigation Depth**: 2
- **Notes**: Preserves historical expense timeline records upon bill deletion.

---

### TRACKED SUBSCRIPTIONS FLOWS

#### FLOW 25 — Add tracked subscription
- **Flow ID**: FLOW-25
- **Flow Name**: Add tracked subscription
- **User Goal**: Track external recurring user subscriptions (e.g. *Netflix*, *Spotify*, *Internet*) separate from Opti-Plan's app subscription.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Plan View -> Bills & Subscriptions Tab (`SCR-PLN-03`)
- **Entry Point**: Tap "Add Tracked Subscription" button on Subscriptions Section
- **Preconditions**: Viewing Subscriptions Section on Plan Tab
- **Primary Path**:
  1. User taps "Add Tracked Subscription" on `SCR-PLN-03`.
  2. Create Tracked Subscription Modal Sheet opens.
  3. User inputs Service Name (e.g. "Netflix"), Amount (e.g. 4,500), Billing Cycle (Monthly/Annual), and Renewal Date.
  4. User taps "Save Subscription".
  5. System saves record under Tracked Subscriptions list.
  6. Sheet closes; Subscriptions list updates showing recurring cost summary.
- **Decision Points**:
  - *Input empty?* -> Inline validation error.
- **Success State**: External subscription tracked; renewal date alert scheduled.
- **Error / Recovery Path**: Inline error formatting.
- **Offline Consideration**: Saved to IndexedDB locally.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Clear summary of total monthly recurring subscriptions.
- **Accessibility Consideration**: Form inputs labeled cleanly.
- **Exit / Return Location**: Returns to `SCR-PLN-03`.
- **Maximum Navigation Depth**: 2
- **Notes**: Terminology explicitly distinguishes external user subscriptions from Opti-Plan Plus app subscription.

---

### MONTHLY CHECK-IN FLOWS

#### FLOW 26 — Start Monthly Money Check-In
- **Flow ID**: FLOW-26
- **Flow Name**: Start Monthly Money Check-In
- **User Goal**: Initiate end-of-month review to review financial performance and prepare next month's cycle.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`) at month end (or via Check-In prompt)
- **Entry Point**: Tap "Start Monthly Check-In" banner on Home at month end (or `/app/check-in`)
- **Preconditions**: Current calendar month ending ($\le 3$ days remaining) or new month started
- **Primary Path**:
  1. User taps "Start Monthly Check-In" prompt.
  2. Monthly Check-In View (`SCR-CHK-01`) opens.
  3. Screen displays Step 1: **Money In Summary** (Total income logged vs planned).
  4. User taps "Next" -> Step 2: **Money Out & Top Categories** (Total expenses and top spending categories).
  5. User taps "Next" -> Step 3: **Savings & Debt Summary** (Total saved and debt repayments completed).
  6. User taps "Next" -> Step 4: **Final Money Left Recap** (Net Money Left for the month).
- **Decision Points**:
  - *User taps "Cancel / Close"?* -> Dismisses check-in; returns to Home (can resume later).
- **Success State**: All 4 summary recap steps reviewed cleanly.
- **Error / Recovery Path**: If calculation fails, display retry button.
- **Offline Consideration**: Recap calculated locally from IndexedDB stored month transactions.
- **Subscription Consideration**: Available on all tiers; Plus tier unlocks historical check-in comparison archives.
- **Behavioral Engagement Consideration**: Truthful month-end urgency prompt; non-shaming recap presentation.
- **Accessibility Consideration**: Stepper navigation labeled (`Step 1 of 4`); keyboard arrow navigation supported.
- **Exit / Return Location**: Advances to Flow 27 (Complete Check-In).
- **Maximum Navigation Depth**: 2
- **Notes**: Takes under 90 seconds to complete.

#### FLOW 27 — Complete monthly check-in
- **Flow ID**: FLOW-27
- **Flow Name**: Complete monthly check-in
- **User Goal**: Finalize month review, trigger recap reveal, and initialize rollover for the new planning cycle.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Step 4 of Monthly Check-In (`SCR-CHK-01`)
- **Entry Point**: Tap "Complete Check-In & Start New Month" button
- **Preconditions**: Completed Check-In review steps
- **Primary Path**:
  1. User taps "Complete Check-In & Start New Month" on final step of `SCR-CHK-01`.
  2. System marks current month check-in state as "Completed".
  3. System displays Monthly Recap Reveal animation (celebration card summarizing Net Saved & Adherence).
  4. System initializes new month planning cycle (copies recurring spending plan targets to new month).
  5. User taps "Go to Dashboard".
  6. Check-In View closes; user returns to Home Dashboard (`SCR-HOM-01`) updated for the new month cycle.
- **Decision Points**:
  - *User wants to copy spending plan to new month?* -> Toggle enabled by default ("Carry forward category budget targets").
- **Success State**: Check-in completed; monthly streak incremented; new month dashboard initialized.
- **Error / Recovery Path**: Local fallback save if server sync fails.
- **Offline Consideration**: Save completion state locally; sync rollover token on reconnect.
- **Subscription Consideration**: Free tier retains check-in capability; Plus tier archives historical recap cards.
- **Behavioral Engagement Consideration**: Monthly recap reveal celebration badge; positive completion streak milestone.
- **Accessibility Consideration**: Accessible celebration announcement; `prefers-reduced-motion` supported.
- **Exit / Return Location**: Returns to `SCR-HOM-01` (Home Dashboard initialized for new month).
- **Maximum Navigation Depth**: 2
- **Notes**: Next-month plan setup is strictly optional; user is not forced into immediate setup.

---

### SUBSCRIPTION / PAYWALL FLOWS

#### FLOW 28 — Encounter paid feature
- **Flow ID**: FLOW-28
- **Flow Name**: Encounter paid feature
- **User Goal**: View transparent paywall details when attempting a premium paid feature on free tier.
- **Applicable Personas**: All 8 Universal Personas (Free Tier)
- **Starting State**: Free tier user attempting premium action (e.g. creating 2nd savings goal or custom category)
- **Entry Point**: Tap "Create Goal" (when 1 active goal exists `[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]`) OR tap "Upgrade" on Profile
- **Preconditions**: User on `free` subscription state
- **Primary Path**:
  1. Free user attempts premium action (e.g. create 2nd active goal `[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]`).
  2. Upgrade / Paywall Sheet (`SCR-SUB-01`) slides up contextually over active view.
  3. Sheet displays: Locked feature indicator ("Unlimited Savings Goals"), Opti-Plan Plus benefits list, Billing disclaimers `[WORKING ASSUMPTION — REQUIRES APPROVAL]`, and "Upgrade to Opti-Plan Plus" primary button.
  4. User reviews features and pricing disclaimers.
- **Decision Points**:
  - *User taps "Upgrade to Opti-Plan Plus"?* -> Advances to Paystack Checkout (Flow 29).
  - *User taps "Maybe Later" or Close (X)?* -> Paywall sheet dismisses safely back to caller view without data loss.
- **Success State**: Paywall clearly presented; user can upgrade or safely return.
- **Error / Recovery Path**: Close sheet safely on dismissal.
- **Offline Consideration**: Displays "Internet connection required to upgrade" banner if offline.
- **Subscription Consideration**: Core conversion touchpoint; demonstrates contextual paywall trigger (`[WORKING MONETIZATION ASSUMPTION — REQUIRES PRODUCT APPROVAL]`).
- **Behavioral Engagement Consideration**: Zero deceptive countdown timers, fake social proof, or manufactured scarcity.
- **Accessibility Consideration**: Dialog role `aria-modal="true"`; close button receiving accessible focus.
- **Exit / Return Location**: Advances to Flow 29 OR returns safely to originating view.
- **Maximum Navigation Depth**: 2
- **Notes**: Paywall dismissal NEVER discards unsubmitted draft data on originating view. One free goal limit is an illustrative working monetization assumption, not a finalized restriction.

#### FLOW 29 — Successful Opti-Plan subscription
- **Flow ID**: FLOW-29
- **Flow Name**: Successful Opti-Plan subscription
- **User Goal**: Complete Paystack checkout and unlock Opti-Plan Plus premium features upon server verification.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Paywall Sheet (`SCR-SUB-01`)
- **Entry Point**: Tap "Upgrade to Opti-Plan Plus" button on Paywall Sheet
- **Preconditions**: Active network connection; user on Paywall sheet
- **Primary Path**:
  1. User taps "Upgrade to Opti-Plan Plus" on `SCR-SUB-01`.
  2. System initializes Paystack checkout session and opens Paystack payment popup / redirect interface.
  3. User completes payment on Paystack interface (Card, Bank Transfer, or USSD).
  4. Paystack redirects user back to Opti-Plan verification screen (`/app/subscription/verify?reference=...`).
  5. Opti-Plan displays verification state: "Verifying payment with Paystack...".
  6. Paystack webhook fires to backend server; server cryptographically validates signature and updates user `subscription_state` to `active` in database.
  7. Client receives verified `active` entitlement confirmation from server.
  8. Screen displays success state: "Welcome to Opti-Plan Plus!"; User taps "Continue".
  9. User is returned safely to the originating feature (e.g. 2nd Goal creation now unlocked).
- **Decision Points**:
  - *Webhook processing delayed?* -> Display polling status: "Payment received. Activating your subscription..." (Retries server check up to 10s).
  - *Payment failed on Paystack?* -> Display calm error: "Payment was not completed. Your account remains on the free plan." (Allows retry).
- **Success State**: Server-verified active subscription; premium features unlocked across all devices.
- **Error / Recovery Path**: Allow retrying checkout or returning to free tier without data corruption.
- **Offline Consideration**: Requires active connection.
- **Subscription Consideration**: NON-NEGOTIABLE: Browser redirect alone NEVER unlocks paid access; entitlement requires signed server webhook confirmation.
- **Behavioral Engagement Consideration**: Clean activation celebration feedback.
- **Accessibility Consideration**: Clear textual status updates during payment verification (`aria-live="assertive"`).
- **Exit / Return Location**: Returns safely to originating premium feature site.
- **Maximum Navigation Depth**: 2
- **Notes**: Entitlement strictly server-controlled per `AGENTS.md` rules.

#### FLOW 30 — Cancel Opti-Plan subscription
- **Flow ID**: FLOW-30
- **Flow Name**: Cancel Opti-Plan subscription
- **User Goal**: Cancel active Opti-Plan Plus paid subscription without dark-pattern friction in $\le 2$ clicks.
- **Applicable Personas**: All 8 Universal Personas (Paid Users)
- **Starting State**: Profile Tab (`SCR-PRF-01`) -> Manage Subscription Sheet (`SCR-SUB-02`)
- **Entry Point**: Tap "Manage Subscription" on Profile -> Tap "Cancel Subscription"
- **Preconditions**: Active paid subscription (`subscription_state` = `active`)
- **Primary Path**:
  1. User taps "Manage Subscription" on Profile Tab (`SCR-PRF-01`).
  2. Manage Subscription Sheet (`SCR-SUB-02`) opens displaying active plan details and next billing date.
  3. User taps "Cancel Subscription" (Click 1).
  4. Confirmation dialog displays: "Cancel Opti-Plan Plus subscription? You will retain Plus features until [Expiration Date]. No further charges will be made."
  5. User taps "Confirm Cancellation" (Click 2).
  6. System submits cancellation request to server/Paystack API.
  7. Server updates subscription state to `cancelled` (access remains valid until cycle end date).
  8. Sheet updates displaying status: "Subscription cancelled. Access valid until [Date]".
- **Decision Points**:
  - *User taps "Keep Subscription"?* -> Dialog closes; active subscription preserved.
- **Success State**: Subscription cancelled in 2 clicks; clear expiration date communicated; zero dark patterns.
- **Error / Recovery Path**: Display error message if cancellation API call fails, providing support contact link.
- **Offline Consideration**: Active network connection required to process cancellation.
- **Subscription Consideration**: Strictly complies with 2-click cancellation requirement in `AGENTS.md` (no retention surveys, phone calls, or artificial delays).
- **Behavioral Engagement Consideration**: Respectful, transparent confirmation copy; zero shame language.
- **Accessibility Consideration**: Alertdialog markup for cancellation confirmation.
- **Exit / Return Location**: Returns to `SCR-PRF-01` (Profile Tab).
- **Maximum Navigation Depth**: 2
- **Notes**: User retains paid access until the end of the paid billing period.

---

### PROFILE & SETTINGS FLOWS

#### FLOW 31 — Change profile information
- **Flow ID**: FLOW-31
- **Flow Name**: Change profile information
- **User Goal**: Update display name or persona profile selection.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Profile Tab (`SCR-PRF-01`)
- **Entry Point**: Tap "Edit Profile" or Settings -> Profile Context (`SCR-PRF-02`)
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Settings" on Profile Tab.
  2. Settings Modal (`SCR-PRF-02`) opens.
  3. User modifies Display Name or selects a new Persona Profile type (e.g., changes from *Student* to *Salaried Employee*).
  4. User taps "Save Preferences".
  5. System updates user metadata in database/IndexedDB and updates suggested category hints accordingly.
  6. Modal closes with success toast.
- **Decision Points**:
  - *Display Name empty?* -> Inline validation error.
- **Success State**: Profile updated; category/onboarding suggestions adapt to new persona.
- **Error / Recovery Path**: Inline error formatting.
- **Offline Consideration**: Save locally to IndexedDB and queue sync.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Neutral adaptation of copy suggestions.
- **Accessibility Consideration**: Form fields labeled with clear focus indicators.
- **Exit / Return Location**: Returns to `SCR-PRF-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Changing persona updates suggestions ONLY; financial calculation engine remains 100% unified.

#### FLOW 32 — Change currency
- **Flow ID**: FLOW-32
- **Flow Name**: Change currency
- **User Goal**: Modify default currency symbol/code for UI display.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Settings Modal (`SCR-PRF-02`)
- **Entry Point**: Tap Settings -> Currency Selector
- **Preconditions**: Viewing Settings Modal
- **Primary Path**:
  1. User selects Currency dropdown on `SCR-PRF-02`.
  2. User selects new Currency Code (e.g. USD, EUR, NGN, GBP).
  3. System displays confirmation disclaimers: "Change primary currency code? This updates the currency symbol displayed across your app. Existing transaction numbers remain unchanged."
  4. User taps "Confirm Currency Change".
  5. System updates display currency preference in database/IndexedDB.
  6. Modal closes; all app screens render new currency symbol.
- **Data Model Disclaimer**: `[OPEN PRODUCT / DATA DECISION — REQUIRES PHASE 2 CONFIRMATION]` *(Changing display currency code updates UI symbol presentation; historical multi-currency conversion engines are not supported in V1).*
- **Decision Points**:
  - *User cancels confirmation?* -> Currency selection reverted.
- **Success State**: Display currency code updated across UI.
- **Error / Recovery Path**: Inline error handling.
- **Offline Consideration**: Save preference locally.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Transparent disclosure that numerical values are not automatically converted.
- **Accessibility Consideration**: Currency dropdown accessible via keyboard arrow keys.
- **Exit / Return Location**: Returns to `SCR-PRF-01`.
- **Maximum Navigation Depth**: 2
- **Notes**: Does not perform silent currency conversion on stored raw minor units.

#### FLOW 33 — Change appearance
- **Flow ID**: FLOW-33
- **Flow Name**: Change appearance
- **User Goal**: Toggle visual theme between System Default, Dark Mode, and Light Mode.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Settings Modal (`SCR-PRF-02`)
- **Entry Point**: Tap Settings -> Appearance Selector
- **Preconditions**: Viewing Settings Modal
- **Primary Path**:
  1. User taps "Appearance" section in Settings (`SCR-PRF-02`).
  2. User selects Theme option: **System Default**, **Dark Mode**, or **Light Mode**.
  3. System applies theme CSS class instantly to root document element (`<html>`).
  4. System persists theme preference in local storage and user settings database table.
- **Decision Points**: None.
- **Success State**: App theme updated seamlessly without page reload.
- **Error / Recovery Path**: Fallback to System theme if preference corrupted.
- **Offline Consideration**: Theme preference cached locally in `localStorage`.
- **Subscription Consideration**: Full Dark Mode supported on all Free and Plus tiers.
- **Behavioral Engagement Consideration**: Premium, calm dark mode presentation.
- **Accessibility Consideration**: Complies with high-contrast color ratios across light and dark themes.
- **Exit / Return Location**: Remains on `SCR-PRF-02`.
- **Maximum Navigation Depth**: 2
- **Notes**: Instant visual theme transition.

#### FLOW 34 — Logout
- **Flow ID**: FLOW-34
- **Flow Name**: Logout
- **User Goal**: Terminate current session and return to public unauthenticated state.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Profile Tab (`SCR-PRF-01`)
- **Entry Point**: Tap "Sign Out" button at bottom of Profile View
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Sign Out" on `SCR-PRF-01`.
  2. System displays confirmation prompt: "Sign out of Opti-Plan on this device?"
  3. User taps "Confirm Sign Out".
  4. System revokes Supabase Auth session token, clears sensitive session storage, and preserves offline queued items in IndexedDB.
  5. System redirects user to Login Page (`SCR-AUTH-02`) with toast: "Signed out successfully".
- **Decision Points**:
  - *User cancels confirmation?* -> Dialog closes; session remains active.
- **Success State**: Session terminated; user redirected to `/login`.
- **Error / Recovery Path**: Force local session clear if server signout request times out.
- **Offline Consideration**: Clears local session token while preserving offline queued transaction data securely.
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Reassuring signout confirmation.
- **Accessibility Consideration**: Focus redirected to Login form header upon redirect.
- **Exit / Return Location**: Redirects to `SCR-AUTH-02` (Login Page).
- **Maximum Navigation Depth**: 1
- **Notes**: Prevents unauthorized access on shared devices.

#### FLOW 35 — Delete account
- **Flow ID**: FLOW-35
- **Flow Name**: Delete account
- **User Goal**: Permanently wipe all personal data, transaction history, and account records.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Settings Modal (`SCR-PRF-02`) -> Privacy & Account Controls
- **Entry Point**: Tap "Delete Account" link in Settings
- **Preconditions**: Authenticated user session
- **Primary Path**:
  1. User taps "Delete Account" in Settings (`SCR-PRF-02`).
  2. Delete Account Confirmation Dialog (`SCR-PRF-03`) opens displaying strict warning: "Permanently delete your Opti-Plan account? All transaction records, spending plans, and savings goals will be permanently erased. This action cannot be undone."
  3. User must type confirmation keyword "DELETE" into input field.
  4. User taps "Permanently Delete My Account".
  5. System executes account deletion API call (wipes user database rows via RLS cascade, cancels active Paystack subscription, clears local IndexedDB data).
  6. System revokes session and redirects to Landing Page (`SCR-PUB-01`) with toast: "Account permanently deleted".
- **Decision Points**:
  - *Confirmation keyword "DELETE" incorrect?* -> Delete button remains disabled.
  - *User taps "Cancel"?* -> Dialog closes; account preserved intact.
- **Success State**: Account and all personal financial data permanently erased.
- **Error / Recovery Path**: Server error alert with instructions to retry or contact support.
- **Offline Consideration**: Active network connection strictly required to process database deletion.
- **Subscription Consideration**: Cancels active Paystack recurring subscription automatically upon deletion.
- **Behavioral Engagement Consideration**: Strict, objective confirmation procedure; zero emotional manipulation or guilt copy.
- **Accessibility Consideration**: `role="alertdialog"`; strict focus lock on confirmation input and buttons.
- **Exit / Return Location**: Redirects to `SCR-PUB-01` (Landing Page).
- **Maximum Navigation Depth**: 2
- **Notes**: Complete data deletion respects user privacy rights.

---

### PWA & OFFLINE FLOWS

#### FLOW 36 — Install Opti-Plan PWA
- **Flow ID**: FLOW-36
- **Flow Name**: Install Opti-Plan PWA
- **User Goal**: Add Opti-Plan to mobile or desktop home screen for instant native-like access.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: User browsing Opti-Plan on compatible mobile/desktop web browser
- **Entry Point**: PWA Install Banner (`SCR-SYS-01`) trigger on Home Dashboard or Settings link
- **Preconditions**: Browser supports Web App Manifest and PWA installation (`beforeinstallprompt` event)
- **Primary Path**:
  1. User completes onboarding and logs at least 1 transaction (or returns for 2nd session).
  2. PWA Install Banner (`SCR-SYS-01`) appears unobtrusively at bottom of screen: "Install Opti-Plan for fast offline access".
  3. User taps "Install App".
  4. Native browser PWA installation prompt opens; User confirms "Install".
  5. App installs to device home screen / app launcher.
  6. Install banner dismisses; success toast displays: "Opti-Plan installed to home screen".
- **Decision Points**:
  - *User taps "Dismiss"?* -> Banner dismisses and hides for 14 days.
- **Success State**: Opti-Plan installed as standalone PWA.
- **Error / Recovery Path**: If installation fails, display manual instructions (e.g. "Tap Share -> Add to Home Screen").
- **Offline Consideration**: PWA shell assets cached by Service Worker for offline launch.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Non-intrusive prompt timing (triggers only after initial value delivered).
- **Accessibility Consideration**: Accessible banner markup (`role="region"` / `aria-label="PWA Installation"`).
- **Exit / Return Location**: Banner dismisses; user remains on active view.
- **Maximum Navigation Depth**: 1
- **Notes**: Does not block app usage if user declines installation.

#### FLOW 37 — Add transaction offline
- **Flow ID**: FLOW-37
- **Flow Name**: Add transaction offline
- **User Goal**: Record a Money In or Money Out transaction when device has no internet connection.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`) or any primary anchor while device is offline
- **Entry Point**: Tap persistent Quick Add (+) FAB while offline
- **Preconditions**: Device network disconnected (`navigator.onLine` = `false`)
- **Primary Path**:
  1. User taps (+) FAB while offline.
  2. Quick Add Sheet (`SCR-QA-01`) opens. Top status bar indicates "Offline Mode".
  3. User enters Amount, Category, and taps "Save Transaction".
  4. System generates client-side UUID, writes transaction record to IndexedDB local offline queue with `sync_status` = `pending`.
  5. System updates local React query state optimistically (Money Left and dashboard metrics recalculate instantly).
  6. Sheet closes; Home Dashboard displays updated totals and top status bar: "Offline - Saved locally (1 item pending sync)".
- **Decision Points**: None.
- **Success State**: Transaction recorded locally; Money Left updated optimistically; pending sync status displayed.
- **Error / Recovery Path**: If IndexedDB write fails, display inline alert "Failed to save locally".
- **Offline Consideration**: NON-NEGOTIABLE: App NEVER claims data is "Synced" when saved only locally. Banner explicitly states "Saved locally".
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: High-trust offline reassurance banner ("Saved locally").
- **Accessibility Consideration**: Offline status announced via `aria-live="polite"`.
- **Exit / Return Location**: Returns to active dashboard view.
- **Maximum Navigation Depth**: 1
- **Notes**: Guarantees zero transaction loss when logging money on the go without network.

#### FLOW 38 — Reconnect and sync
- **Flow ID**: FLOW-38
- **Flow Name**: Reconnect and sync
- **User Goal**: Automatically synchronize local offline transactions to Supabase PostgreSQL upon network restoration.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Device re-establishes internet connection with pending items in IndexedDB
- **Entry Point**: Automatic system trigger on `online` network event
- **Preconditions**: Internet connectivity restored; pending offline queue exists
- **Primary Path**:
  1. Device reconnects to internet.
  2. Service Worker / Sync Manager detects `online` event and reads pending records from IndexedDB queue.
  3. Top status bar updates to: "Syncing 2 offline items...".
  4. System sends batch payload to Supabase database containing client UUIDs for deduplication.
  5. Supabase processes items, verifies RLS policies, and returns success response.
  6. System updates local IndexedDB items to `sync_status` = `synced`.
  7. Top status bar updates briefly to "All transactions synced" and auto-dismisses after 3 seconds.
- **Decision Points**:
  - *Duplicate item detected on server?* -> Server idempotency key rejects duplicate insert; returns existing record confirmation.
- **Success State**: All local offline records synced seamlessly to cloud database with zero duplicate records.
- **Error / Recovery Path**: If sync fails for an item, advance to Flow 39 (Sync Failure).
- **Offline Consideration**: Seamless transition from offline queue to synced server state.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Reassuring background sync feedback banner.
- **Accessibility Consideration**: Status changes announced via `aria-live="polite"`.
- **Exit / Return Location**: Banner auto-dismisses; user continues normal usage.
- **Maximum Navigation Depth**: 0 (Background system process)
- **Notes**: Idempotency keys prevent duplicate transaction entries upon reconnect.

#### FLOW 39 — Sync failure
- **Flow ID**: FLOW-39
- **Flow Name**: Sync failure
- **User Goal**: Receive clear notification if offline sync encounters an error, with local data preservation and retry trigger.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Automatic background sync execution encounters network timeout or server error
- **Entry Point**: Sync manager error response
- **Preconditions**: Pending offline items exist in IndexedDB; sync attempt fails
- **Primary Path**:
  1. Background sync fails due to network drop or server error.
  2. Top status bar updates to warning state: "Sync failed - Your data is still saved on this device. [Retry Sync]".
  3. Pending items remain safely in IndexedDB queue with `sync_status` = `sync_failed`.
  4. Local dashboard metrics remain accurate based on local store.
  5. User taps "Retry Sync" when network stabilizes.
  6. System re-executes sync queue payload.
- **Decision Points**:
  - *User taps "Retry Sync"?* -> Re-executes Flow 38.
- **Success State**: User informed data is safe locally; retry trigger available.
- **Error / Recovery Path**: Allow manual retry; keep local data intact indefinitely.
- **Offline Consideration**: Data is NEVER discarded on sync failure.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Non-frightening, reassuring error messaging (prohibits raw database error codes like `PGRST116`).
- **Accessibility Consideration**: Error announced via `aria-live="assertive"`.
- **Exit / Return Location**: Status bar remains until resolved or retried.
- **Maximum Navigation Depth**: 0 (Background system process)
- **Notes**: Guarantees zero financial data loss.

---

### BEHAVIORAL ENGAGEMENT FLOWS

#### FLOW 40 — Money Win (Real-Data Insight)
- **Flow ID**: FLOW-40
- **Flow Name**: Money Win (Real-Data Insight)
- **User Goal**: Receive a personalized, data-backed observation celebrating healthy money management behavior.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`)
- **Entry Point**: Automatic render at Slot 10 of Home Dashboard scroll area
- **Preconditions**: Verified real database transaction data qualifies (e.g., *Transport spending is 12% lower than 30-day average*)
- **Primary Path**:
  1. System executes background analytics calculation on user transaction history.
  2. Qualifying real-data condition met (e.g. transport spending reduction).
  3. Single Money Win card renders at bottom of Home Dashboard (Slot 10): "Money Win: Your transport spending is 12% lower than your recent average!"
  4. User views Money Win card while scrolling Home.
  5. User taps "Got it" or dismisses card (or taps to view category breakdown in Activity).
  6. Card dismisses or collapses; frequency cap recorder sets 7-day cooldown before displaying next Money Win.
- **Decision Points**:
  - *No real data condition qualifies?* -> Render ZERO cards (honest empty space).
  - *User dismisses card?* -> Card hides immediately.
- **Success State**: User receives real-data positive reinforcement; zero fake metrics displayed.
- **Error / Recovery Path**: If calculation error occurs, card does not render.
- **Offline Consideration**: Renders offline based on local IndexedDB transaction math.
- **Subscription Consideration**: Basic Money Wins on Free tier; advanced category comparison wins on Plus tier.
- **Behavioral Engagement Consideration**: Strictly capped frequency (max 1 card on Home; 7-day cooldown); 100% real data required.
- **Accessibility Consideration**: Accessible card markup; dismiss button labeled `aria-label="Dismiss Money Win"`.
- **Exit / Return Location**: Remains on `SCR-HOM-01`.
- **Maximum Navigation Depth**: 1
- **Notes**: Prohibits casino visuals, loot boxes, or fabricated savings claims.

#### FLOW 41 — Savings milestone
- **Flow ID**: FLOW-41
- **Flow Name**: Savings milestone
- **User Goal**: Receive subtle visual feedback upon crossing 25%, 50%, or 75% of a savings goal target.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: User saves contribution that crosses milestone threshold on `SCR-PLN-02`
- **Entry Point**: Automatic trigger upon saving qualifying savings contribution
- **Preconditions**: Verified database savings total crosses 25%, 50%, or 75% target mark
- **Primary Path**:
  1. User saves savings contribution on Goal Card.
  2. Goal balance updates and crosses milestone threshold (e.g. 50% saved).
  3. Goal card progress bar fills with smooth progress animation.
  4. Milestone badge appears inline on Goal Card: "Halfway there! 50% Saved."
  5. Subtle toast notification displays: "Milestone reached: 50% of [Goal Name] saved!".
  6. User continues browsing Plan view.
- **Decision Points**: None.
- **Success State**: Milestone recognized with positive visual feedback.
- **Error / Recovery Path**: N/A
- **Offline Consideration**: Calculated locally offline.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Calm milestone badge; no intrusive modal popups.
- **Accessibility Consideration**: Progress percentage updated in `aria-valuenow`; `prefers-reduced-motion` disables fill animation.
- **Exit / Return Location**: Remains on `SCR-PLN-02`.
- **Maximum Navigation Depth**: 1
- **Notes**: Real-data verification invariant ensures milestones trigger only on actual database math.

#### FLOW 42 — Bill due urgency
- **Flow ID**: FLOW-42
- **Flow Name**: Bill due urgency
- **User Goal**: Receive timely notification of an impending bill due date to prevent missed payments.
- **Urgency Window Disclaimer**: `[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]` *(Truthful due-date urgency is approved, but the exact number of days before a bill becomes "due soon" is a working assumption to be evaluated in Phase 1C).*
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`) or Plan View
- **Entry Point**: Automatic render of "Next Upcoming Bill" card on Home when due date is within due-soon window (`[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]`: default $\le 3$ days)
- **Preconditions**: Verified unpaid bill exists with due date within due-soon threshold
- **Primary Path**:
  1. System checks upcoming bill dates against current date.
  2. Internet bill due date is 2 days away.
  3. Home Dashboard "Next Upcoming Bill" card renders urgent indicator: "Internet Bill due in 2 days (15,000)".
  4. User taps "Next Upcoming Bill" card.
  5. Bill Detail Sheet opens (Flow 22); User taps "Mark as Paid" (Flow 23).
  6. Bill marked paid; expense logged; urgency card updates to next upcoming bill or dismisses.
- **Decision Points**:
  - *User marks bill paid?* -> Urgency status cleared.
  - *No bill due within due-soon threshold?* -> Home displays next upcoming bill with standard neutral date format.
- **Success State**: User alerted to real upcoming bill date; payment completed smoothly.
- **Error / Recovery Path**: N/A
- **Offline Consideration**: Calculated locally from IndexedDB bill records.
- **Subscription Consideration**: Free tier includes baseline bill alerts; Plus tier includes push/email due reminders.
- **Behavioral Engagement Consideration**: Truthful deadline urgency (backed 100% by real bill due date). Zero fake countdown timers.
- **Accessibility Consideration**: Due date announced via screen reader (`aria-label="Internet bill due in 2 days"`).
- **Exit / Return Location**: Navigates to Bill Detail Sheet or returns to Home.
- **Maximum Navigation Depth**: 2
- **Notes**: Helps users avoid late payment penalties through timely awareness. Urgency threshold is a working UX assumption.

#### FLOW 43 — Month-end FOMO
- **Flow ID**: FLOW-43
- **Flow Name**: Month-end FOMO
- **User Goal**: Prompt user to complete their monthly check-in before the calendar month ends.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Home Dashboard (`SCR-HOM-01`) during final 3 days of calendar month
- **Entry Point**: Month-End Check-In Banner on Home Dashboard
- **Preconditions**: Current calendar month ending ($\le 3$ days remaining) AND monthly check-in incomplete
- **Primary Path**:
  1. Calendar date reaches 3 days before month end (e.g. August 29).
  2. Home Dashboard renders month-end urgency banner: "August ends in 3 days. Complete your Money Check-In before September begins."
  3. Banner provides two actions: "Start Check-In" and "Remind Me Later" (Dismiss).
  4. User taps "Start Check-In".
  5. System navigates user to Monthly Check-In View (`SCR-CHK-01` / Flow 26).
- **Decision Points**:
  - *User taps "Remind Me Later"?* -> Banner dismisses for 24 hours.
- **Success State**: User prompted for timely month-end check-in; dismissible without pressure.
- **Error / Recovery Path**: Allow manual access to Check-In from Plan tab if banner dismissed.
- **Offline Consideration**: Renders based on device system calendar date.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Truthful calendar urgency (backed 100% by real calendar date). Banners MUST be dismissible.
- **Accessibility Consideration**: Banner formatted as non-modal notification region (`role="status"`).
- **Exit / Return Location**: Navigates to `SCR-CHK-01` (Check-In) or dismisses back to Home.
- **Maximum Navigation Depth**: 1
- **Notes**: Motivates timely financial reviews without aggressive lockouts.

---

### ERROR & RECOVERY FLOWS

#### FLOW 44 — Transaction save error
- **Flow ID**: FLOW-44
- **Flow Name**: Transaction save error
- **User Goal**: Receive clear error feedback if a transaction save fails, with data preservation and retry capability.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Quick Add Sheet (`SCR-QA-01`)
- **Entry Point**: Tap "Save Transaction" when server/local database write fails
- **Preconditions**: Unhandled database write failure or invalid payload
- **Primary Path**:
  1. User taps "Save Transaction" on Quick Add Sheet.
  2. Database write fails (e.g., storage error).
  3. Quick Add sheet remains open; entered data (Amount, Category, Date, Note) is strictly preserved in form inputs.
  4. System displays human-readable error banner at top of sheet: "We couldn't save this expense right now. Your entries are kept below. Tap Retry."
  5. User taps "Retry Save".
  6. System re-executes save payload successfully; sheet closes with success toast.
- **Decision Points**:
  - *User taps "Cancel"?* -> Confirmation prompt asks if user wants to discard entries.
- **Success State**: User informed of exact failure state; draft inputs preserved; successful retry.
- **Error / Recovery Path**: Allow saving locally or retrying request.
- **Offline Consideration**: Fallback to IndexedDB local queue if server is unreachable.
- **Subscription Consideration**: Available on all tiers.
- **Behavioral Engagement Consideration**: Calm, non-technical error copy (hides raw database codes). Reassures user that input data is safe.
- **Accessibility Consideration**: Error announced immediately via `aria-live="assertive"`.
- **Exit / Return Location**: Remains on `SCR-QA-01` until saved or explicitly cancelled.
- **Maximum Navigation Depth**: 1
- **Notes**: Guarantees user does not have to re-type transaction entries after an error.

#### FLOW 45 — Unauthorized / session expired
- **Flow ID**: FLOW-45
- **Flow Name**: Unauthorized / session expired
- **User Goal**: Safely recover session when auth token expires while preserving intended action destination.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Authenticated app session where refresh token becomes invalid/expired
- **Entry Point**: Automatic API 401 Unauthorized response from backend
- **Preconditions**: Auth token expired and unrefreshable
- **Primary Path**:
  1. User performs an action (e.g. opening Plan or saving a transaction).
  2. Backend API returns HTTP 401 Unauthorized due to expired session.
  3. System saves active route and unsubmitted form state in session storage (`redirect_after_login = /app/plan`).
  4. System redirects user to Login Page (`SCR-AUTH-02`) displaying notification: "Your session expired. Please log in again to continue."
  5. User enters password and taps "Sign In".
  6. System re-authenticates session and automatically redirects user back to intended destination (`/app/plan`).
- **Decision Points**: None.
- **Success State**: Session recovered; user safely returned to intended destination without losing app context.
- **Error / Recovery Path**: Standard login error handling if credentials invalid.
- **Offline Consideration**: If offline, local session remains active for IndexedDB access.
- **Subscription Consideration**: Restores verified subscription state upon re-authentication.
- **Behavioral Engagement Consideration**: Reassuring session recovery copy.
- **Accessibility Consideration**: Focus automatically placed on Password field on Login redirect.
- **Exit / Return Location**: Returns to intended destination route.
- **Maximum Navigation Depth**: 1
- **Notes**: Eliminates frustration by remembering where the user was heading.

#### FLOW 46 — Generic server failure & recovery
- **Flow ID**: FLOW-46
- **Flow Name**: Generic server failure & recovery
- **User Goal**: Gracefully recover when a major unexpected server error occurs.
- **Applicable Personas**: All 8 Universal Personas
- **Starting State**: Any screen in application encountering unhandled React Exception or 500 Server Error
- **Entry Point**: App React Error Boundary or API 500 response
- **Preconditions**: Unhandled server/runtime exception
- **Primary Path**:
  1. Unexpected 500 server error or runtime exception occurs.
  2. Generic Error Boundary Overlay (`SCR-SYS-03`) renders calmly over active view.
  3. Overlay displays calm icon, clear human-readable message: "Something went wrong on our end. Your saved data is safe. [Reload App]", and "Reload App" primary button.
  4. User taps "Reload App".
  5. Application reloads, clears transient UI state, restores local IndexedDB session, and renders Home Dashboard.
- **Decision Points**:
  - *User taps "Report Issue"?* -> Opens mailto/support link with anonymized diagnostic code.
- **Success State**: App safely recovered; user reassured that stored financial data is safe.
- **Error / Recovery Path**: Fallback to local offline mode if server remains down.
- **Offline Consideration**: Renders offline error screen if network is unavailable.
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Non-alarming, supportive language. Strictly hides raw technical stack traces from end users.
- **Accessibility Consideration**: Accessible error boundary markup (`role="alert"`).
- **Exit / Return Location**: Reloads to `SCR-HOM-01` (Home Dashboard).
- **Maximum Navigation Depth**: 0 (System Boundary)
- **Notes**: Protects user experience from raw unhandled crashes.
