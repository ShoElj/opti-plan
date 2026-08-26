# Opti-Plan Cross-Product Interaction Rules Specification

**Version:** 1.0  
**Phase:** Phase 1B — User Flows  
**Status:** Approved Interaction Rules Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 & Phase 1A Documents

---

## 1. Quick Add Interaction Rules

Quick Add is Opti-Plan's core speed-optimized transaction capture interface (`[INITIAL UX TARGET — SUBJECT TO USABILITY TESTING]`: Target completion $\le 5$ seconds. *This is a desired usability target, not a guaranteed product performance claim. Phase 1C wireframe testing should evaluate whether the flow actually feels fast; required financial clarity must not be sacrificed merely to hit a time target*).

- **Primary Control Requirement**: The visible (+) button on the mobile bottom navigation bar or desktop sidebar is ALWAYS the primary interaction trigger. Access MUST NEVER depend on keyboard shortcuts.
- **Tab Chooser Behavior**:
  - Opening Quick Add from Home or persistent nav defaults to the **Money Out** (Expense) tab (`[WORKING INTERACTION ASSUMPTION — TO BE TESTED IN PHASE 1C]`).
  - Opening Quick Add from an explicit "Income" button defaults to the **Money In** tab.
  - Switching between tabs preserves any entered numeric amount while resetting category choices.
- **Default Focus**: Opening Quick Add immediately focuses the numeric keypad on the Amount input field. The user can start typing digits instantly.
- **Dismissal Behavior**: Tapping outside the sheet backdrop, sliding down on mobile, or pressing `Escape` closes the sheet. If fields have been modified, a brief inline confirmation prompt prevents accidental data loss.
- **Keyboard Shortcut Disclaimers**:
  - `Cmd+K` / `Ctrl+K` `[WORKING ASSUMPTION — INTERACTION DECISION TO BE FINALIZED IN PHASE 1B / TESTED IN PHASE 1C]`.
  - Because `Cmd+K` / `Ctrl+K` is commonly associated with global command search palettes, its assignment is under active evaluation. The application MUST remain 100% functional without keyboard shortcuts.

---

## 2. Navigation Return & Back Behavior

Return logic MUST be predictable and uniform across all screens and sheets:

| Originating Context | Action / Trigger | Return Destination |
|---|---|---|
| **Activity Timeline** | Tap Transaction Item -> View Detail (`SCR-ACT-02`) | Close Detail Sheet -> Returns to `Activity Timeline` |
| **Plan Workspace (Goals Tab)** | Tap Goal Card -> View Goal Detail | Close Goal Sheet -> Returns to `Plan Workspace (Goals Tab)` |
| **Plan Workspace (Bills Tab)** | Tap Bill Card -> View Bill Detail | Close Bill Sheet -> Returns to `Plan Workspace (Bills Tab)` |
| **Home Dashboard** | Tap Upcoming Bill Card -> View Bill Detail | Close Bill Sheet -> Returns to `Home Dashboard` |
| **Any Screen** | Trigger Paywall Sheet (`SCR-SUB-01`) -> Dismiss / Close | Returns safely to originating view without data loss |
| **Any Screen** | Open Quick Add (`SCR-QA-01`) -> Save or Dismiss | Returns to exact prior active screen |

- **Modal Backdrop Tap Rule**: Tapping the darkened backdrop of any modal sheet dismisses the sheet and returns the user to the underlying route view.

---

## 3. Save, Loading & Submission Controls

- **Prevent Duplicate Submissions**: Upon tapping "Save", "Submit", or "Create", the submit button is immediately disabled, rendering a loading spinner. Double-tapping or rapid repeated taps MUST NOT generate duplicate transactions or API requests.
- **Optimistic Local Updates**: When saving transactions or updating plans, the local UI state updates immediately (optimistic UI update). If an offline queue is used, items write to IndexedDB in $\le 50$ ms.
- **Save Feedback**: Successful saves trigger a non-blocking checkmark toast banner ("Transaction saved") that auto-dismisses after 3 seconds.

---

## 4. Confirmation Behavior Guidelines

To prevent alert fatigue, confirmation prompts are strictly reserved for **destructive actions**:

- ✅ **Confirmation Required**:
  1. Deleting a transaction.
  2. Deleting a savings goal.
  3. Deleting a recurring bill.
  4. Cancelling an Opti-Plan Plus subscription.
  5. Permanently deleting a user account.
  6. Wiping local offline database cache.
- ❌ **Confirmation Prohibited (Instant Action)**:
  1. Saving a routine transaction.
  2. Setting a spending plan limit.
  3. Switching tabs.
  4. Changing visual theme (Light/Dark mode).
  5. Toggling search filters.

---

## 5. Sheet vs Modal vs Route Taxonomy Guidelines

- **Bottom Sheets (Mobile)**: Used for Quick Add, transaction details, goal/bill editors, and paywalls on mobile viewports. Sheets slide up from bottom edge, occupying $\le 85\%$ of screen height.
- **Modal Dialogs (Desktop)**: Used for the same sub-views on tablet and desktop viewports, rendered as centered floating dialog cards with backdrop dimming.
- **Full Routable Pages**: Reserved exclusively for major top-level application anchors (`/`, `/signup`, `/login`, `/app`, `/app/activity`, `/app/profile`).
- **Inline Expansion**: Used for collapsable FAQ items and category breakdown previews.

---

## 6. Toast Notification Rules

- **Purpose**: Toast notifications provide non-critical visual confirmation of completed background actions (e.g. "Transaction saved", "Copied to clipboard", "Settings updated").
- **Non-Criticality**: Toasts MUST NEVER contain critical information that requires user action (such as payment failures, server errors, or verification alerts). Critical items require inline error banners or modal dialogs.
- **Display Duration**: Standard toasts display for 3 seconds before sliding out smoothly.

---

## 7. Form Defaults & Auto-Fill Rules

- **Date Defaults**: Transaction dates default to **Today**.
- **Currency Symbol**: Symbol automatically formatting inputs inherits from the user's selected Profile Currency.
- **Optional Fields**: Note fields are optional and progressively disclosed (hidden behind "Add note" trigger until requested).
- **No Risky Defaults**: Quick Add amount inputs NEVER default to pre-filled non-zero numbers. Amount fields start empty with numeric placeholder `0.00`.

---

## 8. Keyboard Interactions & Focus Trapping

- **Standard Keys**:
  - `Tab`: Navigates to next interactive form element.
  - `Shift + Tab`: Navigates to previous element.
  - `Enter`: Submits form or triggers active button.
  - `Escape`: Dismisses open modal sheet or dialog.
- **Focus Trapping**: When a modal sheet or dialog is active, keyboard focus is trapped inside the modal container. Pressing `Tab` loops focus within the modal's interactive controls until dismissed.

---

## 9. Reduced Motion Fallbacks

- **Accessibility Mandate**: All purposeful UI transitions (sheet slide-ups, progress bar fills, milestone badge reveals) MUST respect the user's operating system `prefers-reduced-motion` setting.
- **Fallback Behavior**: When reduced motion is preferred, animated slide-ups and progress fill transitions are replaced with instantaneous opacity fades ($0 \text{ ms}$ slide duration).

---

## 10. Loading Thresholds & Visual Skeletons

To prevent visual layout shifts (CLS), Opti-Plan enforces progressive loading thresholds:

- **Instantaneous ($< 100 \text{ ms}$)**: Local IndexedDB data renders immediately without loading UI.
- **Fast ($100 \text{ ms} - 1000 \text{ ms}$)**: Render skeleton layout cards matching the exact dimensions of loaded cards (no layout shift).
- **Slow ($> 1000 \text{ ms}$)**: Skeleton layout retains progress indicator; after 3000 ms, display calm status message ("Loading your financial data...").
- **Timeout ($> 10000 \text{ ms}$)**: Cancel request; display Server Error Boundary with "Retry" button.
