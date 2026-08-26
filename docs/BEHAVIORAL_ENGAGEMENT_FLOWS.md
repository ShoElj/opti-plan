# Opti-Plan Behavioral Engagement Flows Specification

**Version:** 1.0  
**Phase:** Phase 1B — User Flows  
**Status:** Approved Behavioral Engagement Blueprint  
**Governance:** Governed by `AGENTS.md`, `docs/Opti-Plan_UI_UX_Design_Specification.md`, and Approved Phase 0 & Phase 1A Documents

---

## 1. Executive Engagement Philosophy

Opti-Plan incorporates **Intermittent Variable Rewards** (Money Wins, Spending Insights, Milestones) and **Truthful FOMO** (real bill/month deadlines) to make healthy personal money management feel rewarding and encouraging.

However, behavioral engagement MUST NEVER displace or obscure core financial truth. At all times, financial information (Money Left hero numbers, spending plans, actual totals) maintains absolute visual dominance over engagement cards.

### 4-Tier Visual Priority System
When multiple cards or alerts compete for presentation, Opti-Plan enforces a strict 4-tier visual priority hierarchy:

1. **Priority 1 (Critical Real Financial Status)**: Money Left hero number, total income/spending cards, sync failure warnings.
2. **Priority 2 (Real Deadline Urgency / FOMO)**: Real upcoming bill due alerts ($\le 3$ days), real month-end check-in banners ($\le 3$ days).
3. **Priority 3 (Useful Data-Backed Insights)**: Single Money Win card, category spending improvement observation.
4. **Priority 4 (Celebrations & Milestone Badges)**: Savings goal progress milestone, check-in completion streak badge.

*Maximum Density Rule*: Home Dashboard displays a maximum of **ONE (1)** Priority 3/4 engagement card at any time (rendered at Slot 10, bottom of scroll view).

---

## 2. Definitive Engagement Specifications (ENG-01 to ENG-10)

### ENG-01 — Money Win (Spending Improvement Observation)
- **Engagement ID**: ENG-01
- **Name**: Money Win — Spending Improvement
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Encourages positive spending habits by recognizing real data-backed spending reductions.
- **Trigger**: User opens Home Dashboard after logging transactions.
- **Data Required**: Minimum 14 days of logged transaction history.
- **Eligibility**: Verified spending in a major category (e.g. *Transport*, *Dining*) is $\ge 10\%$ lower than user's 30-day average.
- **Frequency Cap**: Maximum 1 reveal per 7 days.
- **Placement**: Home Dashboard (Slot 10, bottom of scroll area).
- **Dismissible**: Yes (1-tap "Got it" or close icon dismisses card).
- **Repeat Behavior**: Does not re-render until cooldown expires and new qualifying data exists.
- **Accessibility**: Screen reader role `region`; `aria-label="Money Win insight"`.
- **Analytics Event**: `engagement_money_win_viewed` (Metadata only; no raw amounts sent).
- **Prohibited Misuse**: NEVER fabricate spending reductions; NEVER generate fake percentage savings.
- **Example Copy**: *"Money Win: Your transport spending is 12% lower than your recent average!"*
- **Truth Verification**: Calculated strictly from `SUM(amount)` in PostgreSQL database.

### ENG-02 — Category Discovery Insight
- **Engagement ID**: ENG-02
- **Name**: Category Discovery Insight
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Provides self-knowledge about spending distribution across recurring monthly categories.
- **Trigger**: Completing 10th logged transaction in a month.
- **Data Required**: Current month transaction history.
- **Eligibility**: Single category represents $\ge 25\%$ of total month spending.
- **Frequency Cap**: Maximum 1 reveal per month.
- **Placement**: Home Dashboard (Slot 10) or Monthly Check-In view.
- **Dismissible**: Yes.
- **Repeat Behavior**: Re-evaluates on next monthly check-in cycle.
- **Accessibility**: High-contrast text formatting; screen reader accessible.
- **Analytics Event**: `engagement_category_insight_viewed`.
- **Prohibited Misuse**: NEVER suggest moral judgments ("You spend too much on food"). Use factual percentage terms only.
- **Example Copy**: *"Insight: Bills and fixed costs represent 28% of your spending so far this month."*
- **Truth Verification**: Verified via database aggregation query.

### ENG-03 — Savings Milestone Progress
- **Engagement ID**: ENG-03
- **Name**: Savings Milestone Progress
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Motivates continued savings contributions through visual progress recognition.
- **Trigger**: Logging a savings contribution that crosses milestone thresholds (`[WORKING ENGAGEMENT ASSUMPTION — SUBJECT TO PHASE 1C UX TESTING]`: default 25%, 50%, 75%, 100%). *The principle of milestone celebration is approved; exact milestone percentages are working assumptions to test in Phase 1C whether density feels helpful rather than excessive. All claims must use real goal progress*.
- **Data Required**: Verified goal balance and target amount.
- **Eligibility**: Goal saved balance $/ \text{Target} \ge 0.25, 0.50, 0.75, 1.00$ (`[WORKING ENGAGEMENT ASSUMPTION — SUBJECT TO PHASE 1C UX TESTING]`).
- **Frequency Cap**: Triggers once per milestone threshold per goal.
- **Placement**: Savings Goal Card on Plan View (`SCR-PLN-02`).
- **Dismissible**: Yes (Badge collapses inline into Goal Card).
- **Repeat Behavior**: Advances to next threshold.
- **Accessibility**: `aria-valuenow` updated; reduced-motion safe animation.
- **Analytics Event**: `engagement_savings_milestone_reached`.
- **Prohibited Misuse**: NEVER trigger milestone celebrations for routine tiny contributions unless real percentage boundary is crossed.
- **Example Copy**: *"Halfway there! You've reached 50% of your Rent Goal."*
- **Truth Verification**: Verified via `goal.saved_amount / goal.target_amount`.

### ENG-04 — Goal Completion Celebration
- **Engagement ID**: ENG-04
- **Name**: Goal Completion Celebration
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Celebrates full 100% achievement of a user savings goal.
- **Trigger**: Savings contribution brings goal saved balance $\ge$ target amount.
- **Data Required**: Goal saved balance matches or exceeds target amount.
- **Eligibility**: `saved_amount >= target_amount`.
- **Frequency Cap**: Triggers once upon reaching 100% completion.
- **Placement**: Savings Goal Card & Goal Detail Sheet.
- **Dismissible**: Yes ("Mark Completed & Archive" button).
- **Repeat Behavior**: Archived upon completion.
- **Accessibility**: Accessible celebration status announcement.
- **Analytics Event**: `engagement_goal_completed`.
- **Prohibited Misuse**: Strictly prohibit casino visuals, slot machine wheels, or mystery cash claims.
- **Example Copy**: *"Goal Completed! You've saved 350,000 for your Emergency Fund."*
- **Truth Verification**: Verified via database goal target math.

### ENG-05 — Weekly Discovery Card
- **Engagement ID**: ENG-05
- **Name**: Weekly Discovery Card
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Highlights a useful financial observation after a full week of transaction logging.
- **Trigger**: First login of a new week (Monday morning).
- **Data Required**: 7 days of active logging.
- **Eligibility**: User logged at least 3 transactions during prior week.
- **Frequency Cap**: Maximum 1 card per 7 days.
- **Placement**: Home Dashboard (Slot 10).
- **Dismissible**: Yes.
- **Repeat Behavior**: Evaluated weekly.
- **Accessibility**: Screen reader accessible card.
- **Analytics Event**: `engagement_weekly_card_viewed`.
- **Prohibited Misuse**: NEVER display fake comparison metrics with other users.
- **Example Copy**: *"Weekly Discovery: You logged 5 expenses last week, keeping planned discretionary spending on track."*
- **Truth Verification**: Verified via transaction count in prior 7-day window.

### ENG-06 — Monthly Recap Reveal
- **Engagement ID**: ENG-06
- **Name**: Monthly Recap Reveal
- **Behavior Type**: Intermittent Variable Reward
- **User Benefit**: Unlocks a rewarding financial summary presentation upon completing the monthly check-in.
- **Trigger**: User completes Monthly Money Check-In (`SCR-CHK-01`).
- **Data Required**: Completed monthly check-in review steps.
- **Eligibility**: Monthly check-in state marked "Completed".
- **Frequency Cap**: Once per calendar month cycle.
- **Placement**: Monthly Check-In completion screen (`SCR-CHK-01`).
- **Dismissible**: Yes ("Go to Dashboard" button).
- **Repeat Behavior**: Archived in check-in history.
- **Accessibility**: Structured summary screen; keyboard navigable.
- **Analytics Event**: `engagement_monthly_recap_revealed`.
- **Prohibited Misuse**: NEVER guarantee future financial outcomes or provide regulated advice.
- **Example Copy**: *"August Money Recap: You kept spending within your plan and saved 100,000 toward your targets!"*
- **Truth Verification**: Calculated strictly from month-end database totals.

### ENG-07 — Bill Due Soon Urgency
- **Engagement ID**: ENG-07
- **Name**: Bill Due Soon Urgency
- **Behavior Type**: Truthful FOMO / Urgency
- **User Benefit**: Prevents missed payments and late fees by highlighting impending bill due dates.
- **Trigger**: Current date is within due-soon window of an unpaid bill due date (`[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]`: default $\le 3$ days). *Truthful due-date urgency is approved; exact number of days before a bill becomes "due soon" is a working assumption to evaluate presentation and timing in Phase 1C. Urgency must always derive from real due date without artificial countdowns*.
- **Data Required**: Unpaid bill record with due date within due-soon threshold (`[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]`: $\le 3$ days).
- **Eligibility**: `bill.status = 'unpaid'` AND `due_date - current_date <= 3 days` (`[WORKING UX ASSUMPTION — SUBJECT TO USER TESTING]`).
- **Frequency Cap**: Active until bill is marked paid or due date passes.
- **Placement**: Home Dashboard "Next Upcoming Bill" Card & Plan Bills Tab.
- **Dismissible**: No (Remains visible as real financial reminder; removed when bill marked paid).
- **Repeat Behavior**: Deactivates upon payment.
- **Accessibility**: Due date urgency text announced via `aria-label`.
- **Analytics Event**: `engagement_bill_urgency_viewed`.
- **Prohibited Misuse**: Strictly prohibit fake countdown timers or fabricated social pressure.
- **Example Copy**: *"Internet Bill due in 2 days (15,000). Tap to mark paid."*
- **Truth Verification**: Verified against real system calendar date and bill due date.

### ENG-08 — Goal Deadline Approaching Urgency
- **Engagement ID**: ENG-08
- **Name**: Goal Deadline Approaching Urgency
- **Behavior Type**: Truthful FOMO / Urgency
- **User Benefit**: Reminds users of self-imposed savings goal deadlines to encourage timely contributions.
- **Trigger**: Target completion date of an uncompleted goal is within 14 days.
- **Data Required**: Active goal with target date $\le 14$ days away and balance $< 100\%$.
- **Eligibility**: Goal target date approaching; balance incomplete.
- **Frequency Cap**: Displays on Savings Goal Card until completed or date updated.
- **Placement**: Savings Goal Card on Plan View (`SCR-PLN-02`).
- **Dismissible**: Yes (Dismiss banner inline).
- **Repeat Behavior**: Updates daily.
- **Accessibility**: Accessible status badge.
- **Analytics Event**: `engagement_goal_urgency_viewed`.
- **Prohibited Misuse**: NEVER shame the user if deadline passes. Display factual remaining balance neutrally.
- **Example Copy**: *"14 days remaining to reach your Rent Goal target."*
- **Truth Verification**: Verified against real target completion date set by user.

### ENG-09 — Month Ending Soon Urgency
- **Engagement ID**: ENG-09
- **Name**: Month Ending Soon Urgency
- **Behavior Type**: Truthful FOMO / Urgency
- **User Benefit**: Prompts user to review month performance before calendar month closes.
- **Trigger**: Current date is within final 3 days of calendar month.
- **Data Required**: Current calendar month ending ($\le 3$ days remaining) AND check-in incomplete.
- **Eligibility**: Month-end date window active; check-in incomplete.
- **Frequency Cap**: Displays during final 3 days of month.
- **Placement**: Home Dashboard Top Notification Banner.
- **Dismissible**: Yes ("Remind Me Later" dismiss button hides banner for 24h).
- **Repeat Behavior**: Re-appears once after 24h if check-in remains incomplete.
- **Accessibility**: Accessible notification banner (`role="status"`).
- **Analytics Event**: `engagement_monthend_urgency_viewed`.
- **Prohibited Misuse**: Banners MUST be dismissible; MUST NOT block core dashboard navigation.
- **Example Copy**: *"August ends in 3 days. Complete your Money Check-In before September begins."*
- **Truth Verification**: Verified against real calendar month boundary.

### ENG-10 — Trial Ending Urgency
- **Engagement ID**: ENG-10
- **Name**: Trial Ending Urgency
- **Behavior Type**: Truthful FOMO / Urgency
- **User Benefit**: Reminds users of genuine trial expiration to avoid unexpected plan reversion.
- **Trigger**: Active premium trial expiration date is within 3 days `[WORKING ASSUMPTION — REQUIRES APPROVAL]`.
- **Data Required**: `subscription_state = 'trialing'` AND trial end date $\le 3$ days away.
- **Eligibility**: Real active trial ending soon.
- **Frequency Cap**: Active during final 3 days of trial.
- **Placement**: Settings / Profile Banner.
- **Dismissible**: Yes.
- **Repeat Behavior**: Deactivates when trial ends or paid subscription activates.
- **Accessibility**: Screen reader accessible status region.
- **Analytics Event**: `engagement_trial_urgency_viewed`.
- **Prohibited Misuse**: Strictly prohibit fake trial timers for non-trial users.
- **Example Copy**: *"Your Opti-Plan Plus trial ends in 2 days. Upgrade to retain unlimited goals."*
- **Truth Verification**: Verified against server-enforced trial expiration date in database.
