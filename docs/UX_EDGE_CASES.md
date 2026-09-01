# Opti-Plan Master UX Edge Cases & Failure Recovery Matrix

**Version:** 1.0  
**Phase:** Phase 1B   User Flows  
**Status:** Approved UX Edge Cases Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 & Phase 1A Documents

---

## 1. Purpose & Scope

This document specifies the exact user experience rules, failure recovery paths, and visual presentation behaviors for non-ideal, boundary, and edge-case scenarios across **Opti-Plan**.

Designing for edge cases before wireframing guarantees that Opti-Plan remains calm, resilient, and non-shaming under unexpected conditions.

---

## 2. Transactions Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-TX-01** | User enters zero amount (`0.00`) | Disable "Save Transaction" button; display inline message: "Enter an amount greater than 0". | Prevents invalid 0-amount database records. |
| **EC-TX-02** | User attempts negative amount (`-500`) | Reject negative inputs at input masking level. Reject at DB constraint level. | Negative values forbidden in V1. |
| **EC-TX-03** | User enters huge amount (`999,999,999,999`) | Format number cleanly with comma separators; validate input against maximum numeric limit (`10^12`). | Inline error if maximum threshold exceeded. |
| **EC-TX-04** | User inputs decimal precision (`45.6789`) | Truncate/round to 2 decimal places matching currency minor integer units. | Auto-formats to `45.68`. |
| **EC-TX-05** | User double-taps "Save" rapidly | Save button disables instantly on first tap ($0 \text{ ms}$ debounce); renders loading spinner. | Prevents duplicate API/IndexedDB writes. |
| **EC-TX-06** | User selects future transaction date | Allow future dating for planned transactions (e.g. post-dated income/cheque). | Tag item with "Future" badge in timeline. |
| **EC-TX-07** | User edits past-month transaction | Recalculate past month totals and adjust current net Money Left balance accordingly. | Toast notice: "Transaction updated. Financial totals recalculated." |
| **EC-TX-08** | Transaction deleted after monthly check-in | System updates current running Money Left balance while archiving historical check-in audit state. | Audit log preserves historical recap snapshot. |

---

## 3. Dashboard Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-DB-01** | First login (Zero transactions logged) | Render calm empty dashboard state: "No transactions logged yet this month. Tap Quick Add (+) to record your first income or expense." | Zero dummy data or fake charts. |
| **EC-DB-02** | Income logged only (Zero expenses/savings) | Money Left = Total Income. Money Out = 0. Spending Plan bars remain empty. | Honest representation of available cash flow. |
| **EC-DB-03** | Expenses logged only (Zero income logged) | Money Left = Negative Total Expenses (`-45,000`). Display calm amber hero number. | Non-shaming neutral copy: "Total spending exceeds logged income for this month." |
| **EC-DB-04** | Total spending exceeds logged income | Money Left displays negative net value in calm warm amber tint (never harsh alarm red). | Display neutral info banner: "Spending is higher than logged income. Tap Quick Add if you have unrecorded income." |
| **EC-DB-05** | Zero savings contributions logged | Saved card displays `0.00` with helpful prompt: "No savings allocations logged this month." | Neutral presentation. |
| **EC-DB-06** | Zero debt repayments logged | Debt Paid card displays `0.00`. | Neutral presentation. |
| **EC-DB-07** | No spending plan set for current month | Plan bar displays "No plan set for this month. Tap to set category targets." | Non-blocking prompt. |
| **EC-DB-08** | No recurring bills tracked | Upcoming Bill card displays: "No upcoming bills tracked. Tap to add a recurring bill." | Option to add bill. |

---

## 4. Goals Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-GL-01** | Goal target amount set to zero | Reject form submission; display inline error: "Target amount must be greater than 0". | Block save until valid. |
| **EC-GL-02** | Saved contribution exceeds target amount | Progress bar fills to 100%; displays "110% Saved" with completion badge. | Render completion card with choice to keep active or archive. |
| **EC-GL-03** | Target completion date passes (Uncompleted goal) | Display calm status badge: "Target date passed - 75% Saved". | Allow extending target date or keeping current progress. Zero failure shaming. |
| **EC-GL-04** | Goal completed | Trigger Flow 19 (Goal Completed celebration); prompt user to archive goal. | Move to Archived Goals list. |
| **EC-GL-05** | Goal deleted by user | Confirmation dialog asks to confirm deletion; historical transaction activity records preserved. | Removes goal card without corrupting historical transaction ledgers. |

---

## 5. Bills Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-BL-01** | Bill due date passes without payment (Overdue) | Display neutral status badge: "Overdue by 2 days (15,000)". | Render "Mark as Paid" action to log expense. |
| **EC-BL-02** | Bill due today | Display urgent badge: "Due Today (15,000)". | Prominent "Mark as Paid" shortcut. |
| **EC-BL-03** | Bill payment amount differs from tracked bill amount | When marking paid, user can adjust exact expense amount before confirming. | Expense logged with modified amount. |
| **EC-BL-04** | Recurring bill amount updated | User updates bill amount; future bill instances reflect new amount. | Past logged expenses remain unchanged. |
| **EC-BL-05** | Zero bills tracked | Bills list displays empty state: "No recurring bills tracked. Add your rent, utilities, or subscriptions." | Primary "Add Bill" button. |

---

## 6. Subscription Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-SB-01** | Paystack payment verification pending | Display status screen: "Verifying payment with Paystack...". Poll server status up to 10s. | If timeout occurs, inform user: "Payment received. Activating subscription shortly." |
| **EC-SB-02** | Paystack payment popup cancelled/failed | Return user to Paywall sheet with notification: "Payment was not completed. Free plan remains active." | Allow retrying checkout or closing paywall safely. |
| **EC-SB-03** | Renewal payment fails (`past_due`) | Server updates state to `grace` (3-day grace period disclaimed `[WORKING ASSUMPTION   REQUIRES APPROVAL]`). | Display top banner: "Renewal payment failed. Please update billing info to keep Plus access." |
| **EC-SB-04** | Paid subscription cancelled by user | State updates to `cancelled`; paid features remain 100% active until current period ends. | Settings screen displays: "Plus access valid until [Expiration Date]". |
| **EC-SB-05** | Paystack webhook delayed | Entitlement check queries server DB; client polling verifies state once webhook completes. | Entitlement unlocked only upon signed server webhook payload confirmation. |

---

## 7. PWA & Offline Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-OL-01** | Transaction logged while offline | Write transaction to IndexedDB offline queue; recalculate React query state optimistically. | Top status bar renders: "Offline - Saved locally". Never claim "Synced". |
| **EC-OL-02** | Device reconnects to network | Service Worker reads IndexedDB queue, posts items with client UUIDs to backend. | Status bar renders: "Syncing 2 offline items..." -> "All transactions synced". |
| **EC-OL-03** | Duplicate retry attempt during sync | Server idempotency check identifies matching UUID; returns HTTP 200 without duplicate insert. | Guarantees zero duplicate transaction rows. |
| **EC-OL-04** | App browser closed before offline sync completes | IndexedDB retains queue persistently; sync executes upon next app launch. | Data safe in local browser storage. |
| **EC-OL-05** | Network drops midway during multi-item sync | Successfully synced items marked `synced`; failed items remain `pending`. | Top status bar renders: "Partial sync - 1 item pending. [Retry]". |

---

## 8. Currency Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-CR-01** | User changes primary profile currency code | Display explicit confirmation disclaimer: "Change currency symbol? Existing transaction numbers will remain unchanged." | Updating currency updates UI display symbol ONLY (`[OPEN PRODUCT / DATA DECISION   REQUIRES PHASE 2 CONFIRMATION]`). |
| **EC-CR-02** | Unrecognized currency code | Fallback to default currency symbol (e.g. `₦` or `$`) based on system region. | Render standard currency code string. |

---

## 9. Authentication Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-AU-01** | Auth token expires while using app | API returns 401 Unauthorized; save active route path in session storage. | Redirect to Login (`/login`) with message: "Session expired. Please log in to continue." |
| **EC-AU-02** | User attempts duplicate registration email | Supabase returns email registered error; render inline message: "Email already registered. Tap here to log in." | Provide direct link to Login form. |
| **EC-AU-03** | Password reset link expired | Render error page: "Password reset link has expired. Tap below to request a new link." | Primary "Request New Link" button. |

---

## 10. Behavioral Engagement Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-BE-01** | No real data insight qualifies for Money Win | Render **ZERO** Money Win cards on Home Dashboard. | Honest empty space (Slot 10 omitted). Never display fake insights. |
| **EC-BE-02** | Multiple insights qualify simultaneously | Apply 4-tier visual priority hierarchy; render ONLY the highest-priority single insight. | Lower-priority insights deferred to subsequent weeks. |
| **EC-BE-03** | User dismisses Money Win or Month-End banner | Card dismisses immediately; frequency cap recorder sets cooldown (24h for month-end, 7 days for Money Win). | Suppresses card during cooldown window. |
| **EC-BE-04** | Transaction edit invalidates active Money Win | System recalculates background analytics; stale Money Win card auto-removes on next load. | Guarantees engagement cards reflect 100% true data. |

---

## 11. Accessibility & Visual Layout Edge Cases

| Scenario ID | Edge Case Scenario | System Behavior & UX Response | Error / Recovery Handling |
|---|---|---|---|
| **EC-AC-01** | Screen reader navigation active | All dynamic sheets announce title and primary purpose via `aria-live="polite"` or `role="dialog"`. | Focus locked inside modal container. |
| **EC-AC-02** | OS `prefers-reduced-motion` enabled | Disable visual slide-up animations and progress bar fill transitions. | Replace animations with instantaneous 0 ms opacity fades. |
| **EC-AC-03** | Extremely long category or description strings | Truncate string with ellipsis (`...`) after 24 characters in timeline list. | Full string viewable in Transaction Detail sheet. |
| **EC-AC-04** | Large currency figures (`1,000,000,000.00`) | Text scales dynamically using fluid typography (`clamp`) to prevent card clipping. | Card container flexes without horizontal overflow. |
