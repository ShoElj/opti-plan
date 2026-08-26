# Opti-Plan Master Navigation Model & Simplicity Specification

**Version:** 1.0  
**Phase:** Phase 1A — UX Information Architecture  
**Status:** Approved Navigation Model Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 Documents

---

## 1. Mobile / PWA Navigation Architecture

The mobile Progressive Web App (PWA) is the **reference navigation experience** for Opti-Plan. It relies on a simple, predictable 4-anchor bottom navigation bar combined with a persistent, prominent **Quick Add** action.

```
+-------------------------------------------------------------+
|                          TOP BAR                            |
|               [Logo / Status / Currency Indicator]          |
+-------------------------------------------------------------+
|                                                             |
|                      PRIMARY VIEW CONTENT                   |
|                   (Home / Activity / Plan / Profile)        |
|                                                             |
+-------------------------------------------------------------+
|                     BOTTOM NAVIGATION BAR                   |
|   [Home]     [Activity]     (+) Quick Add     [Plan]    [Profile]  |
+-------------------------------------------------------------+
```

### 1.1 Core Navigation Anchors
1. **Home** (`/app`): Primary financial dashboard displaying Money Left hero, summary cards, and spending plan progress.
2. **Activity** (`/app/activity`): Searchable, filterable transaction timeline and history.
3. **Plan** (`/app/plan`): Forward-looking workspace containing Spending Plan budgets, Savings Goals, and Bills.
4. **Profile** (`/app/profile`): User context identity, subscription management, and system settings.

### 1.2 Persistent Quick Add Action
- **Position**: Centrally anchored in the bottom navigation bar (mobile) or prominent header button (desktop).
- **Behavior**: Tapping (+) opens the **Quick Add Modal Sheet** (SCR-QA-01) over the active screen.
- **Dismissal**: Saving a transaction or tapping close/outside immediately returns the user to their prior screen with an updated state. Quick Add **never** changes the underlying route stack.

### 1.3 Stack Depth & Back-Navigation Rules
- **Maximum Depth Invariant**: A user is **never more than 2 levels away** from a primary anchor.
- **Level 0**: Primary Anchors (Home, Activity, Plan, Profile).
- **Level 1**: Primary Sub-Tabs or Modals (e.g. Plan -> Savings Goals Tab; Activity -> Transaction Detail Sheet).
- **Level 2**: Deep Action Modals (e.g. Savings Goal -> Edit Goal Modal; Settings -> Delete Account Confirmation).
- **Back Button Behavior**:
  - Tapping a bottom nav tab immediately resets the stack to Level 0 of that anchor.
  - Tapping browser/system back when a modal sheet is open closes the modal sheet without navigating away.
  - Tapping back from a primary anchor exits to device home (or returns to landing page if unauthenticated).

### 1.4 Sub-Sheet Return Paths
- **Goal Detail Sheet** -> Closes back to `Plan (Savings Goals Tab)`.
- **Bill Detail Sheet** -> Closes back to `Plan (Bills Tab)` or `Home` (if opened from Home card).
- **Transaction Detail Sheet** -> Closes back to `Activity Timeline`.
- **Paywall Interrupt Sheet** -> Cancelling or completing checkout returns the user safely to the originating action site without data loss.

---

## 2. Desktop Navigation Architecture

Desktop navigation expands the mobile navigation model to utilize larger screen real estate while **preserving the exact same mental anchors**.

```
+-------------------+---------------------------------------------------------+
| OPTI-PLAN SIDEBAR |                   MAIN CONTENT AREA                     |
|                   |                                                         |
|  [Logo]           |                  [View Header / Search]                 |
|                   |                                                         |
|  [+] Quick Add    |                                                         |
|                   |                                                         |
|  (H) Home         |                                                         |
|  (A) Activity     |                                                         |
|  (P) Plan         |                 PRIMARY VIEW CONTENT                    |
|  (U) Profile      |                                                         |
|                   |                                                         |
|  ---------------- |                                                         |
|  [Offline Status] |                                                         |
|  [User Avatar]    |                                                         |
+-------------------+---------------------------------------------------------+
```

### 2.1 Sidebar Navigation Model
- Persistent left sidebar containing: Logo, (+) Quick Add primary button, Home, Activity, Plan, Profile navigation items.
- Active navigation item highlighted with calm primary accent color.
- Sidebar collapses gracefully on tablet screen widths while retaining icon anchors.

### 2.2 Responsive Continuity Invariant
A user switching between mobile web, desktop browser, and installed PWA encounters **identical terminology, icon representations, and section structures**.

---

## 3. Global Quick Add Placement

Quick Add is available globally across all application states.

| Platform / Viewport | Quick Add Visual Representation | Access Location |
|---|---|---|
| **Mobile Web & PWA** | Prominent floating (+) action button embedded in bottom nav bar | Bottom Center Navigation |
| **Tablet** | Top-right header (+) button & bottom nav bar action | Top Header & Bottom Nav |
| **Desktop Web & App** | Primary accent (+) "Quick Add" button at top of sidebar | Top Left Sidebar & Keyboard Shortcut `[WORKING ASSUMPTION — INTERACTION DECISION TO BE FINALIZED IN PHASE 1B]` |

### 3.1 Keyboard Shortcut Assumption & Non-Dependence Invariant
- **Shortcut Assumption**: `Cmd+K` / `Ctrl+K` `[WORKING ASSUMPTION — INTERACTION DECISION TO BE FINALIZED IN PHASE 1B]`.
- **Convention Conflict Note**: `Cmd+K` / `Ctrl+K` is commonly associated with global search or command palettes in modern web applications. Opti-Plan has not yet finalized whether `Cmd+K` / `Ctrl+K` will trigger Quick Add or global transaction search.
- **Phase 1B Evaluation**: The exact keyboard shortcut binding will be evaluated during Phase 1B interaction design and usability testing.
- **Primary Control Rule**: The visible Quick Add (+) button remains the primary interaction mechanism across all viewports.
- **Non-Dependence Invariant**: The application must **never** depend on a keyboard shortcut for access to Quick Add or any core money-management feature. All actions must be 100% accessible via visible screen controls.

---

## 4. Behavioral Engagement Structural Placement & Max Density Rules

Opti-Plan incorporates **Intermittent Variable Rewards** (Money Wins) and **Truthful FOMO** (real deadlines) with strict structural density controls to ensure core financial truth is never displaced.

### 4.1 Structural Placement Map
- **Home Dashboard**:
  - *Location*: Slot 10 (bottom of dashboard scroll area).
  - *Allowed Content*: Maximum **ONE (1)** contextual Money Win card or educational tip.
  - *Rule*: Never display engagement cards above Money Left or Summary cards.
- **Plan View**:
  - *Location*: Inside Savings Goals and Monthly Plan progress headers.
  - *Allowed Content*: Subtle milestone celebration banners (e.g. "50% of Rent Goal saved!").
- **Bills Tracker**:
  - *Location*: Upcoming bill item cards.
  - *Allowed Content*: Truthful due-date urgency badges (e.g. "Due in 2 days").
- **Monthly Money Check-In**:
  - *Location*: End-of-month review reveal modal.
  - *Allowed Content*: Month recap reveal animation and streak completion badge.

### 4.2 Maximum Density & Frequency Rules
1. **Home Insight Density**: Maximum 1 variable-reward card rendered on Home at any time. If no data-backed insight qualifies, render **zero** cards (honest empty space).
2. **FOMO Urgency Rule**: Urgency indicators render **ONLY** when a verified real condition exists (e.g. bill due in $\le 3$ days or month ending in $\le 3$ days). Fake timers are strictly banned.

---

## 5. Universal Profile Navigation Validation

Opti-Plan's navigation structure works identically across all 8 universal user personas:

| Persona Profile | Onboarding Customization | Primary Nav Anchor Emphasis | Navigation Customization |
|---|---|---|---|
| **Salaried Employee** | Salary & Rent categories | Home -> Plan (Budgets) | Standard 4-anchor model (No extra tabs) |
| **Freelancer / Gig Worker** | Client Invoices & Tax reserve | Home -> Activity (Inflow filter) | Standard 4-anchor model |
| **Self-Employed** | Personal Draw categories | Home -> Plan (Draw plan) | Standard 4-anchor model |
| **Business Owner** | Owner Draw categories | Home -> Profile (Separation) | Standard 4-anchor model |
| **Student** | Allowance & Food categories | Home -> Quick Add | Standard 4-anchor model |
| **Couple / Household** | Shared Income & Joint Bills | Home -> Plan (Bills & Goals) | Standard 4-anchor model |
| **Retiree / Pensioner** | Pension & Healthcare | Home -> Plan (Bills) | Standard 4-anchor model |
| **Multiple-Income Earner** | Multi-source inflows | Activity -> Inflow breakdown | Standard 4-anchor model |

**Architectural Principle**: Persona profiles customize content hints and category suggestions ONLY. Navigation anchors and structural hierarchy remain **100% unified**.

---

## 6. Simplicity Test Evaluation

To prove navigation efficiency, the proposed architecture was evaluated against 8 primary user tasks:

### Task 1: A new user wants to record salary income
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap persistent Quick Add (+) -> Select "Money In" tab -> Input Amount -> Select "Salary" Category -> Tap "Save"
- **Navigation Decisions**: 2 clicks
- **Potential Confusion**: None (Quick Add is immediately visible)
- **Verdict**: **PASS** (Path length = 2 touches)

### Task 2: A user wants to record transport spending
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap Quick Add (+) -> Input Amount -> Select "Transport" Category -> Tap "Save"
- **Navigation Decisions**: 2 clicks
- **Potential Confusion**: None (Defaults to Money Out)
- **Verdict**: **PASS** (Path length = 2 touches)

### Task 3: A user wants to find how much money remains
- **Start Location**: Any screen in app
- **Expected Path**: Tap "Home" anchor on bottom nav
- **Navigation Decisions**: 1 click
- **Potential Confusion**: None (Money Left is the dominant hero number at top of Home)
- **Verdict**: **PASS** (Immediate visibility)

### Task 4: A user wants to find an old expense
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap "Activity" anchor -> Input search term or select Category filter
- **Navigation Decisions**: 2 clicks
- **Potential Confusion**: None (Search bar anchored at top of Activity)
- **Verdict**: **PASS**

### Task 5: A user wants to set a monthly spending limit
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap "Plan" anchor -> Tap "Edit Spending Plan" -> Input category limits -> Save
- **Navigation Decisions**: 2 clicks
- **Potential Confusion**: None (Plan tab clearly houses category limits)
- **Verdict**: **PASS**

### Task 6: A user wants to create a savings goal
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap "Plan" anchor -> Select "Savings Goals" tab -> Tap "Create Goal" -> Save
- **Navigation Decisions**: 3 clicks
- **Potential Confusion**: None
- **Verdict**: **PASS**

### Task 7: A user wants to check which bill is due next
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: View "Next Upcoming Bill" card on Home (0 clicks) OR Tap "Plan" -> Select "Bills" tab (1 click)
- **Navigation Decisions**: 0 to 1 click
- **Potential Confusion**: None
- **Verdict**: **PASS**

### Task 8: A user wants to manage their subscription
- **Start Location**: Home Dashboard (`/app`)
- **Expected Path**: Tap "Profile" anchor -> Tap "Manage Subscription"
- **Navigation Decisions**: 2 clicks
- **Potential Confusion**: None (Subscription status clearly displayed on Profile)
- **Verdict**: **PASS**

---

## 7. Accessibility Considerations (Information Architecture Level)

1. **Non-Gesture Dependent Navigation**: Every primary navigation destination is reachable via explicit visible touch/click buttons. Swipe gestures are optional progressive enhancements.
2. **Explicit Textual Navigation Labels**: Bottom navigation and sidebar items include visible text labels alongside icons (never icon-only navigation).
3. **Touch Target Size Standards**: All primary navigation touch targets comply with minimum $44 \times 44$ pt touch bounds.
4. **Visible Focus Order**: Navigation elements follow a logical sequential keyboard DOM focus order (`Tab` key navigation).
5. **Screen Reader Semantic Roles**: Bottom nav uses HTML5 `<nav>` with `aria-label="Primary Navigation"`. Modals use `dialog` roles with `aria-modal="true"`.
6. **System Status Discovery**: Offline and sync status banners have explicit textual descriptions (`aria-live="polite"` region) so non-visual users receive immediate connectivity feedback.
