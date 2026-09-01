# Opti-Plan Product Guardrails & Ethical Specification

**Version:** 1.0  
**Phase:** Phase 0   Product Definition  
**Status:** Approved Guardrails Blueprint  
**Governance:** Governed by `AGENTS.md` and `docs/Opti-Plan_UI_UX_Design_Specification.md`

---

## 1. Purpose of Guardrails

This document establishes the mandatory non-negotiable rules governing financial data integrity, visual presentation, UX messaging tone, behavioral engagement ethics, security, and privacy for **Opti-Plan**.

Every feature implemented across all phases must comply with these guardrails. Any violation of these principles constitutes an automatic release gate failure.

---

## 2. Financial Data Integrity Guardrails

### 2.1 Universal Formula Invariant
At all times, financial calculations must strictly follow the core invariant:
$$\text{Money Left} = \text{Total Income} - \text{Normal Expenses} - \text{Savings Contributions} - \text{Debt Repayments}$$

- **No Double Counting**: Savings contributions and debt repayments are distinct transaction classifications. They MUST NOT be counted as both normal expenses and savings/debt allocations.
- **Single Source of Truth**: UI components must NEVER compute independent financial totals using inline math formulas. All financial metrics must be consumed from centralized, tested domain calculation functions.

### 2.2 Numerical Precision Rules
- **No Floating-Point Storage**: Financial amounts MUST NEVER be stored or computed using native JavaScript floating-point numbers (`number`).
- **Storage Standards**:
  - Database: PostgreSQL `numeric` type or minor integer units (e.g. cents, kobo).
  - Codebase: Integer minor units or exact arbitrary-precision decimal abstractions.
- **Negative Value Rejection**: Negative transaction amounts are strictly rejected at API and database constraint levels unless an explicit refund/reversal model is approved.

---

## 3. Truthfulness & Zero-Fabrication Mandate

### 3.1 Real Data Only
Opti-Plan MUST NEVER fabricate or synthesize fake metrics to manipulate user behavior:
- ❌ NEVER generate fake balances, savings numbers, or imaginary net worth.
- ❌ NEVER display artificial active user counts, fake popularity counters, or fake social proof.
- ❌ NEVER fabricate streaks, achievement badges, or milestones unless verified by real database transaction history.
- ❌ NEVER display artificial "money saved" figures that are not calculated directly from user transaction records.

### 3.2 Honest Empty States
When insufficient transaction or plan data exists for a user screen or widget:
- Display a clear, calm, helpful empty state (e.g. "No spending logged yet this month. Tap Quick Add to record your first expense.").
- DO NOT display dummy placeholder data, sample fake charts, or misleading zero warnings.

---

## 4. Non-Shaming UX & Copy Guidelines

Opti-Plan is designed to empower, clarify, and encourage never to judge or shame.

### 4.1 Approved Language Standards
- **Neutral Financial Terms**: Use "Money In", "Money Out", "Spending Plan", "Plan Remaining", "Category Total".
- **Constructive Notifications**: "You've reached 90% of your Dining plan."
- **Avoid Moral Judgments**: Strictly prohibit terms like "bad spending", "wasteful", "financial failure", "reckless", or "poor control".

### 4.2 Visual Tone Controls
- Avoid harsh red-dominant screens or warning alarms when a spending plan limit is exceeded.
- Use calm warning tints (amber/warm gray) with clear neutral metrics rather than alarming error banners.

---

## 5. Ethical Intermittent Variable Rewards Guardrails

Opti-Plan incorporates **Intermittent Variable Rewards** to make healthy personal money management feel rewarding and engaging. However, variable rewards must strictly adhere to safety and ethical bounds.

### 5.1 Variable Reward Specifications
Every variable reward feature must explicitly document:
1. **Trigger**: User action (e.g. logging 5th transaction, completing monthly check-in).
2. **Eligibility**: Verified real-data qualification criteria.
3. **Data Source**: Trusted database query results.
4. **Calculation**: Deterministic formula (e.g. compare current week spending to 30-day average).
5. **Presentation**: Subtle card reveal or milestone animation.
6. **Frequency Cap**: Capped (e.g. maximum 1 reward reveal per 7 days).
7. **User Benefit**: Real financial self-knowledge or encouragement.
8. **Analytics Event**: Anonymized metadata tracking.

### 5.2 Prohibited Reward Mechanics
- ❌ Casino-style visuals (slot machine wheels, rolling dice, mystery scratch cards).
- ❌ Mystery financial rewards or fake bonus money claims.
- ❌ Rewarding unnecessary spending or debt creation.
- ❌ Gambling-like cash outcomes or unpredictable subscription pricing.

---

## 6. Truthful FOMO & Urgency Guardrails

FOMO (Fear Of Missing Out) and urgency mechanics are permitted ONLY to motivate timely, beneficial financial actions based on real deadlines.

### 6.1 Permitted Urgency Drivers
- Real calendar month boundaries (e.g. "August ends in 3 days. Complete your Money Check-In before September begins.").
- Real upcoming bill due dates (e.g. "Electricity bill is due tomorrow.").
- Real user-defined savings deadlines (e.g. "14 days remaining to reach your Rent Goal.").
- Genuine subscription renewal dates and promotion expiry dates.

### 6.2 Prohibited Deceptive Urgency Mechanics
- ❌ Fake resetting countdown timers.
- ❌ Manufactured inventory or subscription scarcity ("Only 3 spots left!").
- ❌ Fabricated social pressure ("14 people in your city bought this plan today").
- ❌ Intentionally complicated cancellation flows to induce renewal fear.
