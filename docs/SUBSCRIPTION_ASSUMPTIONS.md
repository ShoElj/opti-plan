# Opti-Plan Subscription & Monetization Architecture Assumptions

**Version:** 1.0  
**Phase:** Phase 0   Product Definition  
**Status:** Approved Subscription Assumptions  
**Governance:** Governed by `AGENTS.md` and `docs/Opti-Plan_UI_UX_Design_Specification.md`

---

## 1. Monetization Model Overview

Opti-Plan is built as a **subscription-based Web App and PWA**.

### Tier Structure
1. **Free Tier**: Accessible to all registered users. Provides core transaction logging, Quick Add, basic Money Left dashboard, and single savings goal support with baseline category limits.
2. **Premium Paid Tier (Opti-Plan Plus)**: Unlocks unlimited savings goals, multi-income stream analytics, advanced monthly check-in history, bill due reminders, custom categories, and priority offline sync capabilities.

---

## 2. Payment Gateway Integration & Pricing Assumptions (Paystack Initial)

- **Primary Provider**: **Paystack** initially for primary target market coverage (supporting card, bank transfer, USSD, and mobile money channels).
- **Billing Frequencies**: Monthly and Annual recurring subscription plans `[OPEN PRODUCT DECISION   exact pricing tiers to be finalized]`.
- **Exact Pricing Amounts**: Monthly and Annual subscription price points `[OPEN PRODUCT DECISION   subject to market testing]`.
- **Trial Strategy**: Optional explicit 14-day premium trial for new users `[WORKING ASSUMPTION   REQUIRES APPROVAL]`.
- **Family / Multi-User Tier**: Potential household/family subscription tier `[OPEN PRODUCT DECISION   deferred to post-V1]`.
- **Refund Policy & Grace Extensions**: Refund disclaimers and renewal policies `[OPEN PRODUCT DECISION   to be finalized prior to Phase 9]`.

---

## 3. Subscription Lifecycle States

Every user account in the database is associated with a single authoritative `subscription_state` field defined by the following state machine:

```
[free] ---> [trialing] ---> [active] ---> [cancelled] ---> [expired] ---> [free]
                 |              |              ^
                 v              v              |
            [past_due] <--- [grace] -----------+
```

### State Definitions
- **`free`**: Default free tier user. Standard limits enforced.
- **`trialing`**: User currently on an active, non-expired trial period `[WORKING ASSUMPTION   REQUIRES APPROVAL: 14-day default]`.
- **`active`**: Paid subscription confirmed, in good standing with recurring billing active.
- **`grace`**: Renewal payment failed; temporary grace period `[WORKING ASSUMPTION   REQUIRES APPROVAL: 3-day default]` allowing user to update billing details without immediate access lock.
- **`past_due`**: Grace period expired without payment; paid features suspended pending billing resolution.
- **`cancelled`**: User initiated cancellation; paid access remains valid until current paid period ends.
- **`expired`**: Subscription period ended after cancellation; entitlement reverted to `free`.

---

## 4. Server-Side Entitlement Invariant

### NON-NEGOTIABLE SECURITY REQUIREMENT
The frontend client component, browser state, or local storage MUST NEVER decide paid entitlement.

- ❌ NEVER unlock paid features because a URL parameter contains `?payment=success` or `?status=paid`.
- ❌ NEVER unlock paid features based on `localStorage`, `sessionStorage`, or client-side cookie states.
- ❌ NEVER rely on client-side state flags that can be modified via browser console inspection tools.

### Server Verification Flow
1. User completes checkout on Paystack redirect interface.
2. Paystack issues a secure signed HTTP Webhook event directly to the Opti-Plan backend server endpoint.
3. Opti-Plan server verifies the Paystack cryptographic signature (`x-paystack-signature`).
4. Opti-Plan server parses the payload and updates the user's `subscription_state` and entitlement record in Supabase PostgreSQL.
5. Client queries server/Supabase DB via RLS-protected RPC or authenticated API route to fetch verified entitlement state.

---

## 5. Webhook Reliability & Idempotency Rules

- **Signature Verification**: Every incoming webhook request MUST be rejected (HTTP 401) if HMAC signature verification fails against `PAYSTACK_SECRET_KEY`.
- **Idempotent Handling**: Paystack may retry webhooks multiple times. Webhook event handlers MUST be idempotent. Processing the same `event_id` or transaction reference multiple times MUST result in exactly one database subscription update.
- **Event Audit Logging**: Raw webhook payloads (excluding full card details) must be logged to a secure internal audit table for dispute resolution and payment debugging.

---

## 6. Transparent Cancellation & Ethical Billing

Opti-Plan prohibits all dark patterns regarding subscriptions:
1. **Easy Cancellation**: Cancellation option MUST be clearly visible under Settings -> Subscription, requiring no more than 2 clicks to complete.
2. **No Retention Obstructs**: Users MUST NOT be forced through multi-step survey loops, phone calls, or artificial customer service delays to cancel.
3. **Period Completion**: Cancelling a paid subscription immediately marks the state as `cancelled` while preserving premium features until the end of the paid billing cycle.
4. **Clear Renewal Notices**: Transparent renewal pricing and billing dates displayed clearly on the Subscription management screen.
