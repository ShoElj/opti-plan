# Opti-Plan Payments & Entitlement Architecture

**Date:** August 25, 2026  
**Status:** PHASE 2 PAYMENTS ARCHITECTURE SPECIFICATION (BANK SYNC AMENDED)  
**Phase:** Phase 2   Technical Architecture  

---

## 1. Executive Summary

Opti-Plan is a subscription-based personal money planning application offering a Free tier and a paid **Opti-Plan Plus** tier. 

This document defines the subscription state machine, server-authoritative entitlement calculation, payment flow lifecycle, Paystack integration pattern, webhook idempotency model, cancellation flow, and feature-key authorization system.

---

## 2. Approved Subscription State Machine

Opti-Plan adopts the explicit subscription states established in Phase 0:

```
                ┌──────────────────────────────────────────────────┐
                │                     FREE                         │
                └────────────────────────┬─────────────────────────┘
                                         │ User Requests Upgrade
                                         ▼
                ┌──────────────────────────────────────────────────┐
                │                   TRIALING                       │
                │     [PHASE 0 ASSUMPTION: 14-day trial]           │
                └────────────────────────┬─────────────────────────┘
                                         │ Payment Validated / Conversion
                                         ▼
                ┌──────────────────────────────────────────────────┐
                │                    ACTIVE                        │
                │        (Paid access granted & renewed)           │
                └───────────┬──────────────────────────┬───────────┘
                            │                          │
           Payment Fails    │                          │ User Cancels
           [3-day grace]    ▼                          ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────┐
│                GRACE                 │    │          CANCELLED           │
│   (Access preserved during retry)    │    │ (Access kept until end date) │
└───────────────────┬──────────────────┘    └──────────────┬───────────────┘
                    │                                      │
    Payment Uncured │                                      │ Period Ends
                    ▼                                      ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────┐
│               PAST_DUE               │    │           EXPIRED            │
│       (Paid access suspended)        │    │    (Reverts to Free tier)    │
└──────────────────────────────────────┘    └──────────────────────────────┘
```

---

## 3. Server-Authoritative Entitlement Engine

$$\text{can\_access\_plus} = (\text{status} \in \{\text{'active'}, \text{'trialing'}, \text{'grace'}\}) \land (\text{current\_period\_end} > \text{NOW}())$$

Client-side state, URL query parameters, local storage, or browser cookies MUST NEVER be authoritative for paid entitlement.

---

## 4. Configurable Feature-Key Entitlement System

To allow product tier limits (e.g. Bank Sync connectivity, number of active savings goals on Free tier) to be adjusted without modifying payment logic or database schemas, Opti-Plan uses a decoupled **Feature Key** system:

| Feature Key | Free Tier Limit | Plus Tier Limit | Implementation Rule |
| :--- | :--- | :--- | :--- |
| `MAX_ACTIVE_SAVINGS_GOALS` | Configurable (e.g. 2 goals) | Unlimited ($\infty$) | Verified in Domain Layer (`src/domain/entitlement.ts`) |
| `BANK_SYNC_ENABLED` | **`[WORKING MONETIZATION OPTION   REQUIRES PRODUCT APPROVAL]`** <br> (e.g. 1 Account Free vs Unlimited Accounts Plus) | Full Bank Sync Access | Enforced via Feature Key Check |
| `UNLIMITED_CHECKIN_HISTORY` | Last 1 Check-In | Unlimited History | Enforced in DB Repository |
| `MULTI_CURRENCY_PREFERENCES` | Single Primary Currency | Multi-Currency Display | Enforced in UI Layer |
| `ADVANCED_REWARD_INSIGHTS` | Basic Insights | Full Discovery Cards | Verified in Domain Layer |

> **Working Monetization Option:** Bank Sync tier boundaries (e.g., 1 connected account free vs unlimited on Plus) are implemented via feature key flags to allow product management to finalize pricing parameters before Phase 9 release without altering database schemas or billing architecture.

---

## 5. Cancellation Flow (Zero Dark-Pattern Commitment)

1. **Discoverability:** Cancellation is accessible directly from Profile $\rightarrow$ Subscription $\rightarrow$ *Cancel Subscription*.
2. **Predictable Behavior:** Cancelling sets `status = 'cancelled'` and records `cancelled_at`.
3. **Period Preservation:** Paid Plus access remains fully active until `current_period_end`.
4. **Graceful Reversion:** Upon reaching `current_period_end`, status transitions to `expired` and feature limits revert to Free defaults. User data is NEVER destroyed upon cancellation.
