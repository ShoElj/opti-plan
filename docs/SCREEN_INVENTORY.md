# Opti-Plan Master Screen Inventory

**Version:** 1.0  
**Phase:** Phase 1A   UX Information Architecture  
**Status:** Approved Screen Inventory Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 Documents

---

## 1. Executive Inventory Summary

This document defines the complete, definitive Version 1 screen inventory for **Opti-Plan**. 

To preserve mobile-first simplicity, Opti-Plan uses **modal bottom-sheets and dialog overlays** for secondary workflows (such as Quick Add, transaction details, goal creation, and settings disclaimers) rather than navigating users away to separate deep sub-pages.

- **Total Functional Surfaces**: 30 Defined Entries
- **Core Mobile Navigation Anchors**: 4 (Home, Activity, Plan, Profile) + 1 Global Action (Quick Add)
- **Consolidation Rationale**: Quick Add tabs (Money In vs Money Out), Transaction Details, Goal/Bill Editors, and Delete confirmations are implemented as lightweight modal sheets over their parent views to eliminate deep page stacks. System states are not automatically treated as separate navigation destinations.

---

## 1.1 Screen Inventory Rationalization

The 30 defined inventory entries are explicitly rationalized and categorized into three operational UI categories:

### Routable Application Routes   8
These represent full top-level routable pages with dedicated URL paths in the application:
1. `SCR-PUB-01`: Landing Page (`/`)
2. `SCR-AUTH-01`: Sign Up (`/signup`)
3. `SCR-AUTH-02`: Login (`/login`)
4. `SCR-AUTH-03`: Forgot Password (`/forgot-password`)
5. `SCR-AUTH-04`: Reset Password (`/reset-password`)
6. `SCR-HOM-01`: Home Dashboard (`/app`)
7. `SCR-ACT-01`: Activity Timeline (`/app/activity`)
8. `SCR-PRF-01`: Profile Dashboard (`/app/profile`)

### Modal / Sheet Experiences   12
These represent lightweight overlay drawers, bottom-sheets, and dialogs rendered over active routes without navigating away:
1. `SCR-ONB-01`: Onboarding Welcome & Profile Selection Sheet
2. `SCR-ONB-02`: Onboarding Currency & Setup Sheet
3. `SCR-QA-01`: Quick Add Sheet (Money In vs Money Out Tabs)
4. `SCR-ACT-02`: Transaction Detail & Edit Sheet
5. `SCR-PLN-01`: Plan Overview & Budget Editor Sheet
6. `SCR-PLN-02`: Savings Goals List & Goal Editor Sheet
7. `SCR-PLN-03`: Bills & Subscriptions Tracker Sheet
8. `SCR-CHK-01`: Monthly Check-In & Recap Reveal Sheet
9. `SCR-SUB-01`: Upgrade / Paywall Sheet
10. `SCR-SUB-02`: Manage Subscription & Cancellation Sheet
11. `SCR-PRF-02`: Settings & Preferences Modal
12. `SCR-PRF-03`: Delete Account Confirmation Dialog

### Component / System States   10
These represent UI component-level feedback states, status banners, and empty data conditions rendered inline within routes/sheets:
1. `SCR-AUTH-05`: Verification Notice Component (`/verify`)
2. `SCR-SYS-01`: PWA Install Prompt Banner Component
3. `SCR-SYS-02`: Universal Offline & Sync Status Banner Component
4. `SCR-SYS-03`: Generic Error Boundary Overlay State
5. Home Empty Dashboard State (Inline within `SCR-HOM-01`)
6. Activity Empty Timeline State (Inline within `SCR-ACT-01`)
7. Plan Empty Spending Plan State (Inline within `SCR-PLN-01`)
8. Plan Empty Savings Goals State (Inline within `SCR-PLN-02`)
9. Plan Empty Bills Tracker State (Inline within `SCR-PLN-03`)
10. Transaction Success Toast State (Inline within `SCR-QA-01`)

*Reconciliation Total:* 8 Routable Routes + 12 Modal Sheets + 10 Component States = 30 Defined Inventory Entries. System states are not automatically treated as separate navigation destinations.

---

## 2. Definitive Screen Inventory

### PUBLIC AREA

#### Screen ID: SCR-PUB-01
- **Screen Name**: Landing Page / App Shell Entry
- **Area**: Public / Marketing
- **Purpose**: Introduce Opti-Plan core value proposition, PWA installation prompt, and login/signup entry points.
- **Primary User**: Unauthenticated Visitor / New Prospect
- **Primary Action**: Tap "Get Started" (navigates to Sign Up)
- **Secondary Actions**: Tap "Sign In", View Feature Overview, View PWA Install Info
- **Information Priority**: Core Promise ("Know what came in..."), Value proposition, Pricing transparency, Call to Action
- **Entry Points**: Direct URL (`/`), Marketing link, PWA install link
- **Exit Points**: Sign Up (`/signup`), Login (`/login`)
- **Empty State Required**: No
- **Loading State Required**: Yes (Skeleton shell)
- **Error State Required**: No
- **Offline Consideration**: Cache landing page shell in Service Worker
- **Subscription Consideration**: N/A (Public view)
- **Behavioral Engagement Consideration**: Transparent pricing clarity
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### AUTHENTICATION AREA

#### Screen ID: SCR-AUTH-01
- **Screen Name**: Sign Up
- **Area**: Authentication
- **Purpose**: Capture email and password to create a new Opti-Plan account.
- **Primary User**: New User
- **Primary Action**: Tap "Create Account"
- **Secondary Actions**: Tap "Log In", View Terms & Privacy Policy
- **Information Priority**: Title, Email field, Password field, Terms checkbox, Submit button
- **Entry Points**: Landing Page (`/`), Direct link (`/signup`)
- **Exit Points**: Email Verification (`/verify`), Login (`/login`)
- **Empty State Required**: No
- **Loading State Required**: Yes (Button loading spinner)
- **Error State Required**: Yes (Inline validation, email already registered error)
- **Offline Consideration**: Form submission requires active internet connection
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Encouraging, non-intrusive copy
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-AUTH-02
- **Screen Name**: Login
- **Area**: Authentication
- **Purpose**: Authenticate existing user with email and password.
- **Primary User**: Returning User
- **Primary Action**: Tap "Sign In"
- **Secondary Actions**: Tap "Create Account", Tap "Forgot Password?"
- **Information Priority**: Title, Email field, Password field, Submit button, Recovery link
- **Entry Points**: Landing Page (`/`), Sign Up (`/signup`), Direct link (`/login`)
- **Exit Points**: Home (`/app`), Forgot Password (`/forgot-password`), Sign Up (`/signup`)
- **Empty State Required**: No
- **Loading State Required**: Yes (Button loading spinner)
- **Error State Required**: Yes (Invalid credentials banner)
- **Offline Consideration**: Active connection required to authenticate session
- **Subscription Consideration**: Restores verified subscription session state
- **Behavioral Engagement Consideration**: Calm, welcoming copy
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-AUTH-03
- **Screen Name**: Forgot Password
- **Area**: Authentication
- **Purpose**: Request a password reset email link.
- **Primary User**: Returning User with forgotten credentials
- **Primary Action**: Tap "Send Reset Link"
- **Secondary Actions**: Tap "Back to Login"
- **Information Priority**: Instructions, Email field, Submit button
- **Entry Points**: Login (`/login`)
- **Exit Points**: Login (`/login`)
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes (Email not found / Rate limit error)
- **Offline Consideration**: Active connection required
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Reassuring support copy
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-AUTH-04
- **Screen Name**: Reset Password
- **Area**: Authentication
- **Purpose**: Set a new password following password reset link validation.
- **Primary User**: User recovering account
- **Primary Action**: Tap "Update Password"
- **Secondary Actions**: None
- **Information Priority**: Title, New Password field, Confirm Password field, Submit button
- **Entry Points**: Email Reset Link (`/reset-password?token=...`)
- **Exit Points**: Login (`/login`) with success banner
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes (Invalid/expired token error)
- **Offline Consideration**: Active connection required
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Clear confirmation feedback
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-AUTH-05
- **Screen Name**: Verification / Check Email
- **Area**: Authentication
- **Purpose**: Inform user to verify their email address before accessing the application.
- **Primary User**: Newly registered user
- **Primary Action**: Tap "Resend Email"
- **Secondary Actions**: Tap "Back to Login"
- **Information Priority**: Envelope icon, Instructions copy, Registered email address, Resend button
- **Entry Points**: Sign Up (`/signup`)
- **Exit Points**: Onboarding (`/onboarding`) upon link confirmation, Login (`/login`)
- **Empty State Required**: No
- **Loading State Required**: Yes (Resend status)
- **Error State Required**: Yes (Resend rate limit error)
- **Offline Consideration**: Display check inbox message
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Friendly guidance
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### ONBOARDING AREA

#### Screen ID: SCR-ONB-01
- **Screen Name**: Onboarding   Welcome & Profile Selection
- **Area**: Onboarding
- **Purpose**: Select 1 of 8 universal user profiles to personalize category and onboarding suggestions.
- **Primary User**: First-time authenticated user
- **Primary Action**: Tap "Continue"
- **Secondary Actions**: Select Profile card (Salaried, Freelancer, Self-Employed, etc.)
- **Information Priority**: Welcome header, Profile grid cards with icons & descriptions, Continue button
- **Entry Points**: Auth Verification redirect (`/onboarding`)
- **Exit Points**: Currency Selection (Step 2)
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes (Profile selection required warning)
- **Offline Consideration**: Store selection locally if connection drops
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Welcoming, empowering tone
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-ONB-02
- **Screen Name**: Onboarding   Currency Selection & Plan Setup
- **Area**: Onboarding
- **Purpose**: Select default currency code and optional initial monthly income target.
- **Primary User**: First-time authenticated user
- **Primary Action**: Tap "Complete Setup"
- **Secondary Actions**: Select Currency dropdown, Input estimated monthly income (optional), Tap "Skip"
- **Information Priority**: Header, Currency picker, Optional income input, Complete button, Skip link
- **Entry Points**: Onboarding Step 1 (`/onboarding?step=2`)
- **Exit Points**: Home (`/app`)
- **Empty State Required**: No
- **Loading State Required**: Yes (Saving profile payload)
- **Error State Required**: Yes (Invalid input error)
- **Offline Consideration**: Save locally and sync upon reconnect
- **Subscription Consideration**: Default free tier initialized
- **Behavioral Engagement Consideration**: Positive milestone completion feedback
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### HOME AREA

#### Screen ID: SCR-HOM-01
- **Screen Name**: Home   Dashboard View (Populated & Empty)
- **Area**: Home
- **Purpose**: Primary financial dashboard displaying Money Left hero, summary cards, spending plan progress, upcoming bills, and top categories.
- **Primary User**: Authenticated User
- **Primary Action**: Tap Quick Add FAB / button
- **Secondary Actions**: Tap Summary card for breakdown, Tap Upcoming bill to mark paid, Tap Money Win card
- **Information Priority**: 1. Money Left Hero, 2. Money In, 3. Money Out, 4. Saved, 5. Debt Paid, 6. Quick Add FAB, 7. Spending Plan bar, 8. Next Bill, 9. Top Categories, 10. Max 1 Money Win
- **Entry Points**: App Launch, Bottom Nav "Home" tab (`/app`)
- **Exit Points**: Quick Add Sheet, Activity Tab (`/app/activity`), Plan Tab (`/app/plan`), Profile Tab (`/app/profile`)
- **Empty State Required**: Yes (Calm empty dashboard state when 0 transactions logged)
- **Loading State Required**: Yes (Skeleton dashboard layout)
- **Error State Required**: Yes (Failed to load metrics with Retry button)
- **Offline Consideration**: Render cached local calculations with "Offline" status banner
- **Subscription Consideration**: Display free tier limits if applicable
- **Behavioral Engagement Consideration**: Dominant financial truth; max 1 real-data Money Win card
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### QUICK ADD AREA

#### Screen ID: SCR-QA-01
- **Screen Name**: Quick Add Sheet (Money In vs Money Out)
- **Area**: Quick Add
- **Purpose**: Speed-optimized modal bottom-sheet to record income or spending in under 5 seconds.
- **Primary User**: Authenticated User logging daily cash flow
- **Primary Action**: Tap "Save Transaction"
- **Secondary Actions**: Switch tab (Money In / Money Out), Select Category, Change Date, Toggle Classification (Normal Expense, Savings, Debt), Add optional note
- **Information Priority**: Tab selector, Amount input (large keypad), Category picker, Date picker, Save button
- **Entry Points**: Persistent Quick Add FAB / Button from any screen
- **Exit Points**: Return to caller screen with success toast
- **Empty State Required**: No
- **Loading State Required**: Yes (Submit loading state)
- **Error State Required**: Yes (Amount required inline error)
- **Offline Consideration**: Save to IndexedDB offline queue immediately with optimistic UI update
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Instantaneous completion feedback animation
- **Mobile Required**: Yes (Bottom sheet)
- **Desktop Required**: Yes (Centered modal dialog)
- **MVP Status**: IN-SCOPE (V1)

---

### ACTIVITY AREA

#### Screen ID: SCR-ACT-01
- **Screen Name**: Activity Timeline & Transaction History
- **Area**: Activity
- **Purpose**: Display searchable, filterable timeline of all logged inflows and outflows.
- **Primary User**: Authenticated User reviewing past transactions
- **Primary Action**: Tap transaction item to view details
- **Secondary Actions**: Input Search text, Filter by classification (Money In/Out/Saved/Debt), Change Month picker
- **Information Priority**: Search/Filter header, Month selector, Date-grouped transaction timeline list
- **Entry Points**: Bottom Nav "Activity" tab (`/app/activity`)
- **Exit Points**: Transaction Detail Sheet (SCR-ACT-02), Home (`/app`), Plan (`/app/plan`)
- **Empty State Required**: Yes ("No transactions found for this month / search")
- **Loading State Required**: Yes (Timeline skeleton list)
- **Error State Required**: Yes (Fetch error banner with Retry)
- **Offline Consideration**: Query local IndexedDB store + remote cached records
- **Subscription Consideration**: Free tier access includes full transaction timeline history
- **Behavioral Engagement Consideration**: Clear categorization visual clarity
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-ACT-02
- **Screen Name**: Transaction Detail & Edit Sheet
- **Area**: Activity
- **Purpose**: Modal view to inspect, edit, or delete an existing transaction.
- **Primary User**: Authenticated User modifying a record
- **Primary Action**: Tap "Update Transaction" or "Delete"
- **Secondary Actions**: Modify fields (Amount, Category, Date, Note), Tap "Cancel"
- **Information Priority**: Amount, Classification badge, Category icon, Date, Note, Edit fields, Delete button
- **Entry Points**: Activity Timeline item tap (SCR-ACT-01)
- **Exit Points**: Return to Activity Timeline
- **Empty State Required**: No
- **Loading State Required**: Yes (Update/Delete spinner)
- **Error State Required**: Yes (Update failure alert)
- **Offline Consideration**: Queue edit/delete operation in local offline queue
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Non-destructive confirmation prompts
- **Mobile Required**: Yes (Bottom Sheet)
- **Desktop Required**: Yes (Modal Dialog)
- **MVP Status**: IN-SCOPE (V1)

---

### PLAN AREA

#### Screen ID: SCR-PLN-01
- **Screen Name**: Plan Overview & Monthly Spending Plan
- **Area**: Plan
- **Purpose**: Unified workspace for category spending limits, plan vs actual tracking, and navigation to Goals and Bills.
- **Primary User**: Authenticated User planning monthly finances
- **Primary Action**: Tap "Edit Spending Plan"
- **Secondary Actions**: Switch tab (Spending Plan / Savings Goals / Bills), View Category progress bars
- **Information Priority**: Total Plan vs Income summary bar, Plan Sub-nav tabs, Category budget list with progress indicators
- **Entry Points**: Bottom Nav "Plan" tab (`/app/plan`)
- **Exit Points**: Goal Detail (SCR-PLN-02), Bill Detail (SCR-PLN-03), Quick Add
- **Empty State Required**: Yes ("No spending plan set for this month. Tap Edit Plan to start.")
- **Loading State Required**: Yes (Plan skeleton layout)
- **Error State Required**: Yes (Failed to load plan error)
- **Offline Consideration**: Read local plan data from IndexedDB
- **Subscription Consideration**: Custom category plan limits on free tier
- **Behavioral Engagement Consideration**: Neutral over-plan progress bars (amber/gray, non-shaming)
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-PLN-02
- **Screen Name**: Savings Goals List & Goal Editor Sheet
- **Area**: Plan
- **Purpose**: Display savings targets/goals and create or update goal details.
- **Primary User**: Authenticated User tracking savings progress
- **Primary Action**: Tap "Create Goal" or "Add Savings Contribution"
- **Secondary Actions**: Tap Goal card to inspect detail, Edit target amount / target date
- **Information Priority**: Aggregate Savings total, Goal cards (Name, Target, Saved, Progress bar), Create button
- **Entry Points**: Plan Tab -> Savings Goals Sub-tab (`/app/plan?tab=goals`)
- **Exit Points**: Goal Contribution modal, Plan Tab
- **Empty State Required**: Yes ("No savings goals created yet. Tap Create Goal.")
- **Loading State Required**: Yes
- **Error State Required**: Yes
- **Offline Consideration**: Save goal edits locally
- **Subscription Consideration**: Free tier limits active goals to 1; Paywall trigger on 2nd goal creation
- **Behavioral Engagement Consideration**: Milestone progress animations upon reaching 50%, 100%
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-PLN-03
- **Screen Name**: Bills & Subscriptions Tracker Sheet
- **Area**: Plan
- **Purpose**: Track upcoming recurring bills and mark bills as paid.
- **Primary User**: Authenticated User managing recurring expenses
- **Primary Action**: Tap "Mark as Paid" (logs Money Out expense)
- **Secondary Actions**: Tap "Add Bill", View subscription list, Edit bill amount/due date
- **Information Priority**: Monthly bills total, Upcoming due date list, Subscription list, Add Bill button
- **Entry Points**: Plan Tab -> Bills Sub-tab (`/app/plan?tab=bills`), Home "Upcoming Bill" card
- **Exit Points**: Plan Tab, Home Tab
- **Empty State Required**: Yes ("No recurring bills tracked yet.")
- **Loading State Required**: Yes
- **Error State Required**: Yes
- **Offline Consideration**: Queue "Mark as Paid" transaction offline
- **Subscription Consideration**: Free tier baseline bill tracking
- **Behavioral Engagement Consideration**: Truthful due-date urgency ("Internet bill due tomorrow")
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### MONTHLY CHECK-IN AREA

#### Screen ID: SCR-CHK-01
- **Screen Name**: Monthly Money Check-In & Recap Reveal
- **Area**: Monthly Check-In
- **Purpose**: End-of-month financial review reveal summarizing Money In, Money Out, Saved, and Plan adherence.
- **Primary User**: Returning User completing monthly cycle
- **Primary Action**: Tap "Complete Check-In & Start New Month"
- **Secondary Actions**: Review month recap cards, Share summary screenshot (optional)
- **Information Priority**: Month title, Net Money Left recap, Income vs Spending summary, Savings achieved, Rollover toggle, Complete button
- **Entry Points**: Home Month-End Banner trigger, Activity Check-In prompt (`/app/check-in`)
- **Exit Points**: Home Tab (`/app`) initialized for new month
- **Empty State Required**: No
- **Loading State Required**: Yes (Calculating monthly recap)
- **Error State Required**: Yes
- **Offline Consideration**: Can complete locally; sync rollover state on reconnect
- **Subscription Consideration**: Advanced historical check-in archives unlocked on Plus tier
- **Behavioral Engagement Consideration**: Monthly recap reveal celebration animation
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### SUBSCRIPTION & PAYWALL AREA

#### Screen ID: SCR-SUB-01
- **Screen Name**: Upgrade / Paywall Sheet
- **Area**: Subscription
- **Purpose**: Transparent feature comparison and checkout trigger powered by Paystack.
- **Primary User**: Free tier user attempting premium action or tapping Upgrade
- **Primary Action**: Tap "Upgrade to Opti-Plan Plus" (initiates Paystack checkout)
- **Secondary Actions**: Switch billing frequency (Monthly / Annual), Tap "Maybe Later" (dismiss)
- **Information Priority**: Title, Benefit list (Unlimited goals, advanced analytics, bill alerts), Pricing disclaimers `[OPEN PRODUCT DECISION]`, Upgrade button, Close button
- **Entry Points**: Goal limit trigger, Custom category limit trigger, Profile Upgrade button
- **Exit Points**: Paystack Redirect / Modal, Dismiss back to caller screen
- **Empty State Required**: No
- **Loading State Required**: Yes (Paystack initialization spinner)
- **Error State Required**: Yes (Paystack popup failure notice)
- **Offline Consideration**: Display "Internet connection required to upgrade" banner
- **Subscription Consideration**: High-priority conversion touchpoint
- **Behavioral Engagement Consideration**: Transparent pricing, zero deceptive urgency
- **Mobile Required**: Yes (Modal Sheet)
- **Desktop Required**: Yes (Modal Dialog)
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-SUB-02
- **Screen Name**: Manage Subscription & Cancellation Sheet
- **Area**: Subscription
- **Purpose**: View current subscription status, renewal date, and perform 2-click cancellation.
- **Primary User**: Active Paid Subscription User
- **Primary Action**: Tap "Cancel Subscription"
- **Secondary Actions**: View Plan details, View Next billing date, Update payment method
- **Information Priority**: Active status badge, Renewal date, Billing frequency, Cancel subscription button
- **Entry Points**: Profile Tab -> Manage Subscription (`/app/profile/subscription`)
- **Exit Points**: Profile Tab
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes
- **Offline Consideration**: Requires online connection to modify subscription
- **Subscription Consideration**: Ethical cancellation flow (max 2 clicks, zero dark patterns)
- **Behavioral Engagement Consideration**: Respectful, clear cancellation confirmation
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### PROFILE & SETTINGS AREA

#### Screen ID: SCR-PRF-01
- **Screen Name**: Profile Dashboard View
- **Area**: Profile
- **Purpose**: Primary anchor for user identity, subscription status, and access to Settings.
- **Primary User**: Authenticated User
- **Primary Action**: Tap "Settings"
- **Secondary Actions**: Tap "Manage Subscription", Change Display Name, Sign Out
- **Information Priority**: User Avatar/Name, Email, Persona Profile badge, Subscription banner, Settings link, Sign Out button
- **Entry Points**: Bottom Nav "Profile" tab (`/app/profile`)
- **Exit Points**: Settings Modal (SCR-PRF-02), Home Tab
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes
- **Offline Consideration**: Render cached profile info
- **Subscription Consideration**: Displays Free or Plus tier indicator
- **Behavioral Engagement Consideration**: Calm identity management
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-PRF-02
- **Screen Name**: Settings & Preferences Modal
- **Area**: Profile & Settings
- **Purpose**: Modal workspace for system preferences, currency selection, theme toggle, privacy, and account controls.
- **Primary User**: Authenticated User modifying settings
- **Primary Action**: Tap "Save Preferences" or "Close"
- **Secondary Actions**: Change Currency, Toggle Dark Mode, Export Data (CSV), Open Delete Account Prompt
- **Information Priority**: Currency selector, Theme toggle, Persona switcher, Privacy controls, Export Data, Delete Account link
- **Entry Points**: Profile Tab -> Tap Settings icon/button
- **Exit Points**: Return to Profile Tab
- **Empty State Required**: No
- **Loading State Required**: Yes
- **Error State Required**: Yes
- **Offline Consideration**: Save preferences locally and sync
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Transparent control
- **Mobile Required**: Yes (Full-screen Sheet)
- **Desktop Required**: Yes (Modal Dialog)
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-PRF-03
- **Screen Name**: Delete Account Confirmation Dialog
- **Area**: Profile & Settings
- **Purpose**: Double-confirmation dialog to permanently delete user account and wipe all database transaction data.
- **Primary User**: User requesting account deletion
- **Primary Action**: Tap "Permanently Delete My Account"
- **Secondary Actions**: Tap "Cancel"
- **Information Priority**: Warning title, Permanent deletion explanation, Type "DELETE" input, Confirm button, Cancel button
- **Entry Points**: Settings Modal -> Tap "Delete Account"
- **Exit Points**: Account wiped -> Redirect to Landing Page (`/`) with toast
- **Empty State Required**: No
- **Loading State Required**: Yes (Deletion processing)
- **Error State Required**: Yes (Deletion error banner)
- **Offline Consideration**: Requires active internet connection to execute server deletion
- **Subscription Consideration**: Cancels active Paystack subscription upon deletion
- **Behavioral Engagement Consideration**: Strict security verification
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

---

### PWA & SYSTEM AREA

#### Screen ID: SCR-SYS-01
- **Screen Name**: PWA Install Prompt Banner
- **Area**: PWA / System
- **Purpose**: Non-intrusive banner prompting eligible browser users to install Opti-Plan to home screen.
- **Primary User**: Web user on compatible mobile/desktop browser
- **Primary Action**: Tap "Install App"
- **Secondary Actions**: Tap "Dismiss"
- **Information Priority**: App Icon, Title ("Install Opti-Plan"), Brief benefit ("Fast access & offline logging"), Install button, Close button
- **Entry Points**: Home Tab / Landing Page trigger on supported browsers
- **Exit Points**: Browser PWA installation prompt dialog, Dismiss banner
- **Empty State Required**: No
- **Loading State Required**: No
- **Error State Required**: No
- **Offline Consideration**: N/A
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Non-blocking prompt
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-SYS-02
- **Screen Name**: Universal Offline & Sync Status Banner
- **Area**: PWA / System
- **Purpose**: Top bar notification indicating offline state, active background sync, or sync failure.
- **Primary User**: User operating offline or reconnecting
- **Primary Action**: Tap "Retry Sync" (if sync failed)
- **Secondary Actions**: Tap banner for sync queue breakdown
- **Information Priority**: Status icon, Status text ("Offline - Saved locally" / "Syncing 3 items..." / "Sync failed"), Retry button
- **Entry Points**: Automatic system trigger upon browser `online`/`offline` event
- **Exit Points**: Auto-dismiss when synced successfully
- **Empty State Required**: No
- **Loading State Required**: Yes (Animated sync spinner)
- **Error State Required**: Yes ("Sync failed - Local data preserved")
- **Offline Consideration**: Core offline reassurance component
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: High-trust data safety feedback
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)

#### Screen ID: SCR-SYS-03
- **Screen Name**: Generic Error & Recovery Overlay
- **Area**: PWA / System
- **Purpose**: Graceful boundary fallback when an unhandled application error occurs.
- **Primary User**: User encountering system exception
- **Primary Action**: Tap "Reload App"
- **Secondary Actions**: Tap "Report Issue"
- **Information Priority**: Calm illustration, Reassuring error message, Reload button
- **Entry Points**: Application React Error Boundary
- **Exit Points**: Reload application
- **Empty State Required**: No
- **Loading State Required**: No
- **Error State Required**: Yes
- **Offline Consideration**: Works offline
- **Subscription Consideration**: N/A
- **Behavioral Engagement Consideration**: Reassuring, non-technical explanation
- **Mobile Required**: Yes
- **Desktop Required**: Yes
- **MVP Status**: IN-SCOPE (V1)
