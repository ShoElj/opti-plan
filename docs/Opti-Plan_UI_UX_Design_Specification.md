# Opti-Plan Complete UI/UX Design Specification

**Version:** 1.0  
**Status:** Pre-development design blueprint  
**Product:** Opti-Plan Web App + Progressive Web App  
**Primary design objective:** Make everyday money planning feel simpler than a spreadsheet while remaining trustworthy, useful, and visually premium.

---

## 1. Purpose and authority

This document is the UI/UX source of truth for Opti-Plan before implementation. It translates the product and audit requirements into a concrete experience that Antigravity, designers, developers, QA reviewers, and auditors can follow.

It must be used together with:

- `AGENTS.md`
- `docs/Opti-Plan_Master_Development_Audit_Document.docx`
- the approved PRD and technical architecture once created

If a coded screen conflicts with this document, the design must be corrected or this specification must be deliberately amended and re-approved. The coding agent must not silently redesign the product while implementing it.

### Design gate principle

The UI should progress through:

**Information architecture -> low-fidelity wireframe -> design system -> high-fidelity screen -> interaction prototype -> UX audit -> implementation**

The real frontend should not become the place where unresolved UX decisions are discovered.

---

## 2. Product experience north star

Opti-Plan should feel like a calm personal money companion, not a bank portal and not accounting software.

A user should be able to open the product and answer five questions quickly:

1. How much money came in?
2. How much money went out?
3. Where did the money go?
4. How much do I have left?
5. Am I making progress toward my plan and goals?

### North-star sentence

> **Know what came in. Know where it went. Know what you have left.**

### Experience personality

Opti-Plan should feel:

- simple;
- calm;
- capable;
- premium;
- friendly;
- trustworthy;
- modern;
- encouraging without being childish.

It should not feel:

- like bookkeeping;
- like an online bank;
- like a spreadsheet copied onto cards;
- crowded;
- judgmental;
- gamified like a casino;
- aggressively sales-driven.

---

## 3. Core UX principles

### 3.1 Simplicity over feature visibility

A feature does not need to be visible at all times simply because it exists. The primary user should see only what is relevant now.

### 3.2 One obvious next action

Most major screens should have one dominant next action. Secondary actions should remain discoverable without competing visually.

### 3.3 Progressive disclosure

Advanced controls appear only when needed. For example, Quick Add should not expose recurring rules, attachments, custom tags, and notes before the user has entered an amount.

### 3.4 Mobile-first information hierarchy

The mobile PWA is the reference experience. Desktop can expand the same hierarchy but must not introduce a fundamentally different mental model.

### 3.5 Financial truth is visually dominant

Numbers that answer the user's core money questions should be easier to see than charts, tips, promotional content, or engagement mechanics.

### 3.6 Never shame the user

Avoid red-heavy interfaces, moral labels, failure language, and copy such as “bad spending.” Use neutral and useful language.

### 3.7 Reward useful behavior, not app usage for its own sake

Streaks, variable rewards, and FOMO should encourage meaningful actions such as recording transactions, reviewing a month, paying attention to an upcoming bill, or progressing toward a goal.

### 3.8 Performance is part of UX

Quick Add, dashboard loading, and transaction history should feel immediate. Decorative motion must never delay input.

---

## 4. User contexts and universal personalization

Opti-Plan supports one universal financial model while adapting suggestions to different user types.

### Profile examples

**Salaried employee** — Suggested Money In: Salary, bonus, allowance, overtime, side income. UX emphasis: monthly plan, bills, and savings.

**Freelancer / gig worker** — Suggested Money In: Client payment, project payment, retainer, commission. UX emphasis: irregular income and monthly runway.

**Self-employed** — Suggested Money In: Business draw, sales withdrawal, side income. UX emphasis: variable income and planned spending.

**Business owner using personal finance** — Suggested Money In: Owner draw, salary, dividend. UX emphasis: clear separation from business bookkeeping.

**Student** — Suggested Money In: Allowance, scholarship, family support, part-time work. UX emphasis: simplicity, spending awareness, and goals.

**Couple / family** — Suggested Money In: Partner income, shared income, side income. UX emphasis: shared household categories and bills.

**Retiree / pensioner** — Suggested Money In: Pension, rental income, investment income, family support. UX emphasis: bills, predictable cash flow, and simple planning.

**Multiple-income earner** — Suggested Money In: Salary, freelance, rent, business draw. UX emphasis: source clarity and a consolidated monthly view.

### Personalization rule

Profiles may change:

- suggested income labels;
- suggested categories;
- onboarding examples;
- default education content;
- optional insight copy.

Profiles must not change the trusted accounting/calculation model.

---

## 5. Visual direction

### 5.1 Visual concept

**Calm premium fintech.**

Use generous whitespace, strong typography, restrained color, large touch targets, soft surfaces, clear numbers, subtle motion, and deliberate hierarchy.

### 5.2 Brand color direction

Proposed foundation tokens:

**Opti Teal 600** — Light `#0F766E`; dark accent `#2DD4BF`; primary actions and active states.

**Opti Teal 50** — Light `#F0FDFA`; dark equivalent is a deep teal-tinted surface; soft highlighted surfaces.

**Ink** — Light `#0F172A`; dark `#F8FAFC`; primary text.

**Muted text** — Light `#64748B`; dark `#94A3B8`; secondary copy.

**Canvas** — Light `#F8FAFC`; dark `#090E14`; application background.

**Surface** — Light `#FFFFFF`; dark `#111821`; cards and sheets.

**Border** — Light `#E2E8F0`; dark `#263241`; subtle separation.

**Positive** — Light `#15803D`; dark `#4ADE80`; verified positive progress.

**Warning** — Light `#B45309`; dark `#FBBF24`; genuine approaching deadlines.

**Destructive** — Light `#B91C1C`; dark `#F87171`; delete/error states only.

**Important:** green/teal should not automatically mean “good financial behavior.” It is primarily a brand color. Financial status should be communicated with text and icons as well as color.

### 5.3 Typography

Recommended application font: **Inter** or an approved equivalent with strong legibility across devices.

Use tabular numerals for important monetary figures.

**Money hero:** 36-44 px mobile; 44-56 px desktop; weight 650-750.

**Page title:** 24-28 px mobile; 28-32 px desktop; weight 650-700.

**Section title:** 18-20 px mobile; 20-22 px desktop; weight 600-650.

**Body:** 15-16 px across breakpoints; weight 400-500.

**Label:** 13-14 px; weight 500-600.

**Supporting/meta:** 12-13 px; weight 400-500.

Never shrink important financial copy to make more cards fit.

### 5.4 Spacing system

Use a 4 px base scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

Mobile page padding: **16-20 px**.  
Desktop main-content padding: **24-32 px**.

### 5.5 Radius

- Inputs/buttons: 12-14 px
- Standard cards: 16 px
- Hero/feature cards: 20-24 px
- Bottom sheet top corners: 24-28 px
- Pills: full radius only when semantically appropriate

Avoid making every element a pill.

### 5.6 Shadows and borders

Prefer subtle borders and ambient shadows. Avoid heavy floating-card shadows.

Cards should normally use either:

- surface + thin border; or
- surface + soft shadow;

not both aggressively.

---

## 6. Layout and responsive shell

### 6.1 Reference widths

Design and test at minimum:

- 360 px mobile
- 390 px mobile
- 430 px large mobile
- 768 px tablet
- 1024 px compact desktop
- 1280 px desktop
- 1440 px desktop

### 6.2 Mobile shell

Primary bottom navigation:

**Home | Activity | Plan | Profile**

A central or prominently docked **Quick Add** action remains available without becoming a fifth information section.

Mobile shell requirements:

- respect safe-area insets;
- avoid content hidden behind bottom navigation;
- no horizontal scrolling;
- primary actions reachable with one hand where practical;
- minimum preferred touch target: 44 x 44 px.

### 6.3 Desktop shell

Use a restrained left sidebar approximately 240-264 px wide.

Recommended items:

- Overview
- Activity
- Plan
- Profile

Within Plan, expose Goals and Bills as clear subsections/tabs rather than multiplying top-level navigation.

Sidebar also contains:

- compact subscription status;
- Settings;
- help/support entry;
- logout under profile menu, not as a dominant nav item.

Desktop content width should remain readable; do not stretch dashboard cards edge-to-edge on large screens.

---

## 7. Information architecture

### Public

- Landing
- Pricing
- Sign up
- Login
- Forgot password
- Reset password
- Terms
- Privacy
- Support

### Onboarding

- Welcome
- Choose profile
- Choose currency
- Optional monthly spending target
- Optional savings target
- Optional notification permission explainer
- First Money In / skip

### Authenticated application

- Home / Overview
- Quick Add
  - Money In
  - Money Out
- Activity
  - Search/filter
  - Transaction detail/edit
- Plan
  - Monthly plan
  - Savings target
  - Goals
  - Bills & tracked subscriptions
- Monthly Check-In
- Insights / Money Wins
- Upgrade / Paywall
- Subscription management
- Profile
- Settings
- Install PWA prompt
- Offline/sync states

---

## 8. Mobile navigation behavior

### Home

Answers “Where do I stand?”

### Activity

Answers “What happened?”

### Plan

Answers “What am I trying to do next?”

### Profile

Answers “How is Opti-Plan configured for me?”

### Quick Add

Quick Add is an action, not a destination.

Tapping Quick Add opens a bottom sheet with two large choices:

- **Money In**
- **Money Out**

The sheet should be dismissible by swipe, close button, or system Back behavior.

---

## 9. Desktop navigation behavior

Desktop retains the same mental model as mobile. It may show a persistent **+ Add** button at the top of the sidebar.

Plan can reveal secondary navigation:

- This Month
- Goals
- Bills

Do not create separate top-level items for every tool unless user testing demonstrates that Plan becomes too deep.

---

## 10. Key screen wireframes

### 10.1 Home — mobile

```text
┌──────────────────────────────┐
│ Good morning                 │
│ August 2026              ○   │
│                              │
│ MONEY LEFT                   │
│ ₦170,000                     │
│                              │
│ Money In      Money Out      │
│ ₦350,000      ₦180,000       │
│ Saved         Debt Paid      │
│ ₦30,000       ₦15,000        │
│                              │
│ [        + Add Money       ] │
│                              │
│ This month's plan            │
│ ███████████░░░   68%         │
│ ₦135k of ₦200k spent         │
│                              │
│ Where your money went        │
│ Food              ₦55,000    │
│ Transport         ₦30,000    │
│ Bills             ₦25,000    │
│                              │
│ Money Win                    │
│ Transport is down 12%        │
│ from your recent average.    │
└──────────────────────────────┘
  Home   Activity   Plan Profile
             (+)
```

### 10.2 Quick Add sheet

```text
┌──────────────────────────────┐
│                              │
│        What happened?        │
│                              │
│  ┌────────────────────────┐  │
│  │ ↓  Money In            │  │
│  │ Salary, freelance...   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ ↑  Money Out           │  │
│  │ Food, transport...     │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

### 10.3 Money Out

```text
┌──────────────────────────────┐
│ ← Record spending            │
│                              │
│ How much?                    │
│ ₦ 0                          │
│                              │
│ What was it for?             │
│ [ Food & Groceries       ▾ ] │
│                              │
│ Date                         │
│ [ Today                   ]  │
│                              │
│ Note (optional)              │
│ [ Lunch at work           ]  │
│                              │
│ [      Save expense       ]  │
└──────────────────────────────┘
```

### 10.4 Activity

```text
┌──────────────────────────────┐
│ Activity                     │
│ [ Search transactions...   ] │
│ [All] [In] [Out] [Filter]    │
│                              │
│ TODAY                        │
│ Food & Groceries  -₦8,000    │
│ Transport         -₦5,500    │
│ Data              -₦3,000    │
│                              │
│ YESTERDAY                    │
│ Salary          +₦350,000    │
│ Groceries        -₦26,000    │
└──────────────────────────────┘
```

### 10.5 Plan

```text
┌──────────────────────────────┐
│ Plan                         │
│ August                       │
│                              │
│ Spending limit               │
│ ₦135,000 of ₦200,000         │
│ █████████████░░░             │
│ ₦65,000 available            │
│                              │
│ Savings target               │
│ ₦30,000 of ₦50,000           │
│ █████████░░░░░░              │
│                              │
│ Goals                        │
│ Emergency Fund       24%     │
│ New Laptop           31%     │
│                              │
│ Upcoming bills               │
│ Internet        Tomorrow     │
│ ₦25,000                     │
└──────────────────────────────┘
```

### 10.6 Monthly Check-In

```text
┌──────────────────────────────┐
│ Your August Check-In         │
│                              │
│ You received                 │
│ ₦520,000                     │
│                              │
│ You spent                    │
│ ₦315,000                     │
│                              │
│ You saved                    │
│ ₦80,000                      │
│                              │
│ You kept                     │
│ ₦125,000                     │
│                              │
│ Top category                 │
│ Food & Groceries ₦105,000    │
│                              │
│ [ Plan September ]           │
└──────────────────────────────┘
```

---

## 11. Screen specification: Landing page

**Purpose:** Explain Opti-Plan quickly and move qualified users to sign up or pricing.

### Required structure

1. Header: Logo, Product, Pricing, Login, Get Started
2. Hero: one clear promise + dashboard visual
3. Three-step explanation: Money In -> Money Out -> Know What Is Left
4. Feature proof: Plan, Goals, Bills, Monthly Check-In
5. Universal user profiles
6. PWA/install convenience
7. Pricing
8. FAQ
9. Trust/privacy statement
10. Final CTA

### Hero content direction

Headline:

**Know where your money goes before the month disappears.**

Supporting copy:

**Track what comes in, record what goes out, plan your month, and see what you have left — without complicated budgeting software.**

Primary CTA: **Start planning**  
Secondary CTA: **See how it works**

### UX rules

- Do not lead with 15 features.
- Do not use fake live user counts.
- Do not use fake countdowns.
- Dashboard preview must resemble the actual product.

---

## 12. Screen specification: Authentication

### Sign up

Required fields initially:

- email;
- password;
- accepted terms checkbox if legally required.

Avoid asking for profile/currency before account creation unless research proves it improves completion.

### Login

- Email
- Password
- Forgot password
- Primary login button
- Link to create account

### States

- submitting;
- invalid credentials;
- unverified account if applicable;
- offline;
- rate-limited;
- successful redirect.

### UX acceptance

The user should never be unsure whether login succeeded, failed, or is still processing.

---

## 13. Screen specification: Onboarding

### Goal

Reach first value quickly. Maximum recommended onboarding is 4-6 lightweight steps.

### Step 1 — Welcome

Copy direction:

**Let's set up Opti-Plan around your life.**

Do not present a tutorial carousel.

### Step 2 — Profile

Cards:

- Salaried employee
- Freelancer / gig worker
- Self-employed
- Business owner
- Student
- Couple / family
- Retired
- Multiple income streams

One selection.

### Step 3 — Currency

Show likely currency first, searchable list if needed.

### Step 4 — Spending limit

Optional.

Copy:

**Want to give yourself a monthly spending limit?**

Buttons:

- Set a limit
- Not now

### Step 5 — Savings target

Optional.

### Step 6 — First Money In

Offer:

**Add your first income so your dashboard has something useful to show.**

Allow Skip.

### Onboarding progress

Use a subtle progress indicator, not “Step 1 of 12.”

---

## 14. Screen specification: Home dashboard

### Primary objective

Communicate the user's current financial position in approximately five seconds.

### Information priority

1. Reporting month
2. Money Left
3. Money In / Money Out
4. Saved / Debt Paid
5. Quick Add
6. Monthly plan progress if configured
7. Top categories
8. Upcoming bill
9. Maximum one reward/insight card in the main viewport flow

### Money Left behavior

If Money Left is positive:

`₦170,000 left this month`

If negative:

`₦20,000 over what came in this month`

Do not use alarming failure copy.

### Empty dashboard

Instead of zero-filled analytics, show:

**Your month starts here.**  
Add Money In or Money Out and Opti-Plan will build your picture as you go.

Buttons:

- Add Money In
- Add Money Out

---

## 15. Screen specification: Money In

### Required fields

1. Amount
2. Source
3. Date
4. Note — optional

### Amount input

- currency prefix based on profile settings;
- numeric keypad on mobile;
- format visually but preserve safe editing;
- submit disabled when invalid.

### Source suggestions

Adapt suggestions by profile but always allow Other.

### Successful save

Use a short success response such as:

**Money added. Your dashboard is updated.**

Avoid celebratory animation for every normal income entry; reserve richer feedback for meaningful milestones.

---

## 16. Screen specification: Money Out

### Required fields

1. Amount
2. Category
3. Date
4. Description/note — optional

### Default category set

- Housing
- Food & Groceries
- Utilities & Data
- Transport
- Health & Care
- Education
- Family & Personal
- Entertainment & Shopping
- Bills & Subscriptions
- Business & Work
- Giving & Travel
- Savings
- Debt Repayment
- Other

### Category picker

Use an accessible bottom sheet or popover with icon + label. Search only if custom categories make the list long enough to justify it.

### Success state

**Expense saved.**

If it changes plan status meaningfully, the follow-up may say:

**You have ₦65,000 left in this month's spending plan.**

This follow-up is deterministic, not a variable reward.

---

## 17. Screen specification: Activity

### Purpose

Give users confidence that the record is complete and editable.

### Default view

- chronological groups by date;
- category icon;
- description/category;
- amount;
- income visually distinguished with a plus sign, not only color.

### Filters

Keep first-level filters simple:

- All
- Money In
- Money Out
- Date/month
- Category

### Transaction details

Tap a row to open detail/edit view.

Actions:

- Edit
- Delete

Delete requires confirmation when irreversible.

---

## 18. Screen specification: Plan

Plan is a single coherent area containing:

- Monthly spending plan
- Monthly savings target
- Goals
- Bills

### Top state

Show current month and a concise health summary.

### Spending plan

If configured:

`₦135,000 of ₦200,000 spent`  
`₦65,000 available`

If not configured:

**Set a spending limit if you want a simple boundary for the month.**

Do not show a zero/negative chart when no plan exists.

### Savings target

Same optional-state principle.

---

## 19. Screen specification: Goals

### Goals list

Each goal card shows:

- name;
- current amount;
- target;
- percentage;
- target date only if set.

### Goal detail

- progress;
- contribution history;
- Add contribution;
- edit goal;
- complete/archive behavior.

### Milestone motion

Allow a short meaningful progress animation when crossing approved thresholds such as 25%, 50%, 75%, and 100%.

Do not animate on every tiny contribution.

---

## 20. Screen specification: Bills and tracked subscriptions

### Bills list

Group by:

- overdue, if applicable;
- due soon;
- later.

Avoid making an upcoming bill look like a financial emergency unless it is actually overdue or user-defined as urgent.

### Bill row

- name;
- amount;
- due date;
- recurrence;
- paid state.

### FOMO use

Truthful urgency examples:

- **Internet is due tomorrow.**
- **3 bills are due in the next 7 days.**

Do not repeatedly notify for the same bill without a defined cadence.

---

## 21. Screen specification: Monthly Money Check-In

### Purpose

Create a recurring reflection ritual and transition into the next month's plan.

### Recommended sequence

1. Money received
2. Money spent
3. Money saved
4. Debt paid
5. Money kept/left
6. Top categories
7. Comparison with previous month when enough history exists
8. One useful insight/reward
9. Plan next month CTA

### Interaction

A short card-by-card sequence may be used, but the user must be able to skip animations and view the full summary.

Do not hide important information behind randomized reveal mechanics.

---

## 22. Screen specification: Insights and Money Wins

Insights are observations derived from real data.

### Insight classes

- Spending pattern
- Savings progress
- Category change
- Bill pattern
- Month-over-month comparison
- Consistency milestone

### Example

**Money Win**  
Your transport spending is 12% lower than your recent average.

### Empty state

**Keep tracking and Opti-Plan will start showing useful patterns here.**

Never fabricate insights to prevent an empty state.

---

## 23. Screen specification: Paywall and upgrade

### Principles

- show the feature the user attempted to use;
- explain why Plus helps;
- display price and billing cadence prominently;
- make dismissal possible unless the feature cannot function without payment;
- never create a fake timer;
- never hide cancellation terms.

### Structure

1. Benefit-focused headline
2. 3-5 paid benefits maximum
3. Price
4. Monthly/annual selection if supported
5. CTA
6. Renewal/cancellation explanation
7. Restore/refresh subscription if relevant

### Example headline

**Plan beyond the current month with Opti-Plan Plus.**

---

## 24. Screen specification: Profile and settings

### Profile

- name/display identity;
- profile type;
- currency;
- subscription status.

### Settings groups

- Money preferences
- Categories
- Notifications
- Appearance
- Data/export if approved
- Subscription
- Privacy/security
- Help
- Account deletion

Do not place all settings into one uninterrupted list.

---

## 25. PWA install UX

Do not ask for installation on the first page load.

Recommended install-prompt eligibility:

- user has completed onboarding; and
- user has experienced real product value, such as recording several transactions or returning for a second session.

### Prompt copy

**Keep Opti-Plan within reach.**  
Install it for a faster app-like experience from your home screen.

Actions:

- Install
- Not now

Respect dismissal cooldowns.

The product should still function as a normal web app when the user declines installation.

---

## 26. Offline and sync UX

### Required states

- Online
- Offline
- Saved on this device
- Syncing
- Synced
- Sync failed

### Offline save example

**Saved offline. We'll sync this when you're connected again.**

### Sync failure

**This expense is still safe on this device, but it hasn't synced yet. Try again.**

Never claim data is backed up when it only exists locally.

---

## 27. Component system

Use shadcn/ui as the component foundation, customized into an Opti-Plan system rather than shipping default visual styling unchanged.

### 27.1 Button

Variants:

- Primary
- Secondary
- Ghost
- Destructive
- Icon

Minimum comfortable height: 44 px mobile; primary actions may use 48-52 px.

Primary buttons should not appear more than once or twice per viewport without strong reason.

### 27.2 Summary card

Used for:

- Money In
- Money Out
- Saved
- Debt Paid

Contains:

- label;
- value;
- optional short change indicator;
- optional icon.

No mini-chart unless it communicates meaningful trend.

### 27.3 Hero balance card

Used for Money Left.

This is the strongest card on Home and should not compete with promotional surfaces.

### 27.4 Progress card

Used for:

- spending plan;
- savings target;
- goals.

Always show numeric progress alongside the visual bar.

### 27.5 Insight / Money Win card

Use a subtly differentiated tinted surface, not a flashing banner.

### 27.6 Urgency card

Use only for truthful time-sensitive information.

Severity levels:

- Informational: due this week
- Warning: due tomorrow / plan nearly used
- Destructive/error: overdue action only when genuinely overdue or failed

### 27.7 Sheet / drawer

Mobile: bottom sheet for quick contextual actions.  
Desktop: dialog/popover/side sheet depending task complexity.

### 27.8 Toast

Use for short confirmations, not important instructions.

Examples:

- Expense saved
- Goal updated
- Bill marked paid

### 27.9 Skeleton

Mirror the final layout enough to prevent content jump.

Avoid indefinite spinners for full-page loads when skeletons make more sense.

---

## 28. Iconography

Use a single icon family, preferably Lucide.

### Icon principles

- Outline style consistency
- 18-20 px common UI icons
- 20-24 px primary/action icons
- Never depend on icon alone for critical meaning
- Use labels for unfamiliar actions

Suggested semantic icons:

- Money In: ArrowDownToLine / WalletCards direction adapted carefully
- Money Out: ArrowUpFromLine / Receipt
- Activity: List / History
- Plan: CalendarRange / Target
- Goals: Target
- Bills: CalendarClock / ReceiptText
- Profile: UserRound
- Insight: Sparkles used sparingly

Do not use a slot-machine, trophy overload, coins raining, or casino imagery for rewards.

---

## 29. Motion system

Motion should confirm cause and effect.

### Timing guidance

- **Button/state feedback:** 100-160 ms.
- **Small surface transition:** 160-220 ms.
- **Sheet/dialog:** 220-320 ms.
- **Progress change:** 300-500 ms.
- **Meaningful milestone:** maximum approximately 700 ms.

### Approved motion

- button press scale of approximately 0.98;
- sheet spring entrance;
- card fade/translate of 4-8 px;
- progress fill;
- check confirmation;
- subtle Money Win reveal;
- tasteful 100% goal completion.

### Prohibited motion

- continuous bouncing money icons;
- confetti for ordinary expenses;
- forced animation before data is visible;
- flashing urgency;
- motion that resembles gambling rewards.

### Reduced motion

When reduced motion is requested:

- replace large transforms with opacity/state changes;
- skip celebratory movement;
- maintain all information and feedback.

---

## 30. Intermittent variable rewards in the UX

Variable rewards are allowed only for non-critical, truthful insights and celebrations.

### 30.1 Reward placement

Good placements:

- after a completed weekly review;
- after several meaningful tracked actions;
- after a goal milestone;
- within Monthly Check-In;
- occasionally on Home after enough new data exists.

Do not show variable rewards while the user is entering an expense if they would slow entry.

### 30.2 Reward selection model

The system can maintain a pool of **eligible real insights** and select/rotate one subject to cooldown and relevance rules.

Important information such as an overdue bill must never be randomly withheld as part of the reward system.

### 30.3 Recommended frequency

Start conservatively:

- maximum one Money Win/variable insight in the primary Home flow per session;
- milestone rewards only when a real threshold is crossed;
- weekly discovery no more than once per approved period.

Tune after user research.

### 30.4 Reward content examples

- **Money Win:** You spent less on transport than your recent average.
- **New pattern:** Food is taking a smaller share of your spending this month.
- **Milestone:** Halfway to your emergency-fund goal.
- **Consistency:** You've completed four weekly money check-ins.

Every message must have a deterministic data explanation available to the system/audit layer.

---

## 31. FOMO and urgency in the UX

FOMO is permitted as truthful urgency that helps the user act on real timing.

### Approved placements

- Home upcoming bill
- Plan near month end
- Monthly Check-In
- Goal with user-selected target date
- Genuine free-trial expiration
- Genuine promotional expiration

### Visual hierarchy

Do not make every deadline red.

- 7 days: neutral/informational
- 2-3 days: amber emphasis
- overdue/failed: destructive styling only when true

### Copy examples

**3 days left in August. Finish your check-in before September begins.**

**Internet is due tomorrow — ₦25,000.**

**You're ₦8,500 away from this month's savings target.**

### Prohibited

- Fake “ending soon”
- Fake scarcity
- Restarting countdown
- Fake popularity
- Financial shame
- Threatening loss that is not real
- Subscription cancellation obstruction

---

## 32. Content design and microcopy

### Tone

- calm;
- precise;
- human;
- concise;
- non-judgmental.

### Preferred language

Instead of: **You failed your budget.**  
Use: **You've spent ₦12,000 above the limit you set for this month.**

Instead of: **Bad spending.**  
Use: **Highest spending category.**

Instead of: **Congratulations! You're financially healthy!**  
Use: **You saved more this month than last month.**

### Confirmation copy

- Money added
- Expense saved
- Goal updated
- Bill marked paid

### Empty states

Every empty state should answer:

1. What is this area?
2. Why is it empty?
3. What can I do now?

Avoid decorative emptiness with no next action.

---

## 33. Loading states

### Dashboard

Use skeletons matching:

- hero amount;
- summary cards;
- plan card;
- activity preview.

### Quick Add

Opening the form should not wait on non-critical dashboard queries.

### Slow operation

If saving takes longer than expected, button text becomes:

**Saving...**

Keep input values intact until success is confirmed.

---

## 34. Error states

### Principles

- Say what failed.
- Say whether data is safe.
- Say what to do next.

Examples:

**We couldn't save this expense. Nothing was added. Try again.**

**This expense is saved on your device but hasn't synced yet.**

Do not expose provider errors or technical codes to users.

---

## 35. Accessibility requirements

Target **WCAG 2.2 AA** for the product design and audit baseline.

### Required design behavior

- body text contrast at least 4.5:1 where applicable;
- important controls have visible focus;
- touch targets preferably 44 x 44 px or larger;
- dialogs and sheets manage focus correctly;
- errors are associated with their fields;
- money meaning is not communicated by red/green alone;
- charts have text summaries or accessible data representation;
- keyboard use is possible on desktop;
- reduced-motion preference is respected;
- zoom/reflow does not hide critical actions.

Accessibility must be tested manually as well as automatically.

---

## 36. Charts and data visualization

Use charts only when the chart answers a question faster than text.

### Approved V1 visualizations

- top-category horizontal bars;
- simple spending distribution donut if accessible and useful;
- plan progress bar;
- goal progress bar;
- month comparison bars in Check-In.

### Rules

- no 3D charts;
- no tiny legends;
- no more than one dominant chart per dashboard section;
- values must be readable without hovering;
- use text summary for accessibility.

---

## 37. Dark mode

Dark mode should be intentionally designed, not mechanically inverted.

Requirements:

- surfaces retain clear hierarchy;
- pure black is not required;
- brand teal remains legible;
- semantic positive/warning/destructive colors maintain contrast;
- charts are re-tokenized, not simply dimmed;
- screenshots and QR/install surfaces remain readable.

Default appearance may follow system preference unless product research determines otherwise.

---

## 38. Subscription UX

### Free experience

Free users should experience the core value before being asked to pay.

### Paywall triggers

A paywall should appear at a genuine paid-feature boundary, not randomly during basic tracking.

### Upgrade surfaces

Allowed:

- small Plus indicator in navigation/profile;
- contextual upgrade when attempting a paid feature;
- pricing screen;
- occasional non-blocking benefit reminder after value is established.

Avoid persistent flashing upgrade banners.

### Cancellation

Subscription management must clearly show:

- plan;
- price;
- renewal date;
- cancel action;
- what access changes after cancellation.

---

## 39. PWA-specific design requirements

The installed PWA should feel native enough without pretending to be a native application.

Requirements:

- standalone-safe header spacing;
- safe-area support;
- bottom-nav positioning;
- install icons and splash/theme colors;
- offline feedback;
- no browser-only instructions once installed;
- back navigation behaves predictably;
- external links clearly leave the app where relevant.

Installation should be offered after value, not immediately.

---

## 40. Major user flows

### Flow A — New user to first value

```text
Landing
-> Sign up
-> Profile
-> Currency
-> Optional plan
-> Optional savings target
-> Add first Money In
-> Home shows meaningful state
-> Quick Add Money Out
-> Home updates
```

**Success criterion:** user sees a useful Money Left result without needing explanation.

### Flow B — Daily expense capture

```text
Open PWA
-> Quick Add
-> Money Out
-> Amount
-> Category
-> Save
-> confirmation
-> return to previous context
```

Target: common transaction recording feels fast enough for daily use.

### Flow C — Monthly planning

```text
Plan
-> set spending limit
-> set savings target
-> return Home
-> progress visible
```

### Flow D — Savings goal

```text
Plan
-> Goals
-> New Goal
-> target
-> optional date
-> create
-> add contribution later
-> milestone if crossed
```

### Flow E — Bill urgency

```text
Bill approaches due date
-> Home/Plan truthful reminder
-> open bill
-> mark paid or edit
-> reminder clears
```

### Flow F — Monthly Check-In

```text
Month ending / new month begins
-> Check-In prompt
-> summary
-> optional Money Win
-> Plan next month
```

### Flow G — PWA installation

```text
User obtains value
-> install suggestion
-> accepts
-> browser/system install
-> launches standalone
-> authenticated state handled correctly
```

### Flow H — Offline expense

```text
Offline
-> Quick Add
-> Money Out
-> Save
-> Saved Offline state
-> reconnect
-> syncing
-> synced exactly once
```

### Flow I — Upgrade

```text
Free user selects paid feature
-> contextual paywall
-> sees exact plan/price
-> checkout
-> server-confirmed entitlement
-> returns to intended feature
```

---

## 41. Design acceptance criteria by screen

Every priority screen must pass:

- clear purpose;
- one obvious primary action;
- responsive mobile state;
- responsive desktop state;
- loading state;
- empty state where applicable;
- error state;
- success state;
- accessibility notes;
- analytics notes where relevant;
- dark-mode state;
- no deceptive FOMO/reward behavior;
- implementation-ready component mapping.

---

## 42. UI component mapping to shadcn/ui

The implementation should favor current shadcn/ui primitives and compose Opti-Plan-specific components around them.

Likely mappings:

- **Primary actions:** Button.
- **Quick Add:** Drawer or Sheet plus Button.
- **Category selection:** Popover/Command on larger screens or Drawer on mobile when appropriate.
- **Confirmation:** Alert Dialog.
- **Forms:** Input, Label, Select, and approved Form patterns.
- **Navigation:** Sidebar/navigation primitives plus a custom mobile bottom navigation.
- **Cards:** Card, visually customized into the Opti-Plan system.
- **Progress:** Progress.
- **Status:** Badge.
- **Feedback:** approved Toast/Sonner pattern.
- **Loading:** Skeleton.
- **Plan subsections:** Tabs where they improve clarity.
- **Date selection:** Calendar/date-picker pattern.

As of July 2026, shadcn/ui defaults new projects to Base UI while continuing to support other bases. The architecture phase should make one deliberate base choice and keep it consistent rather than mixing primitives.

---

## 43. Design tokens to implement in code

Create semantic tokens rather than scattering literal colors.

Recommended groups:

```text
--background
--foreground
--surface
--surface-muted
--border
--primary
--primary-foreground
--positive
--warning
--destructive
--muted-foreground
--chart-1 ...
--radius-sm / md / lg / xl
--shadow-card
--nav-height
--sidebar-width
```

Money status components should consume semantic tokens, not raw hex values.

---

## 44. UX analytics plan

Analytics should measure friction, not spy on financial details.

### Useful events

- onboarding_started
- onboarding_completed
- first_income_added
- first_expense_added
- quick_add_opened
- transaction_saved
- transaction_save_failed
- monthly_plan_created
- goal_created
- bill_created
- monthly_checkin_started
- monthly_checkin_completed
- money_win_shown
- money_win_opened
- fomo_prompt_shown
- fomo_prompt_actioned
- install_prompt_shown
- pwa_installed where detectable
- paywall_viewed
- checkout_started
- subscription_activated
- subscription_cancelled

Do not send raw transaction descriptions or exact financial values to generic analytics by default.

---

## 45. UX success metrics

Initial UX evaluation should monitor:

- onboarding completion rate;
- time to first transaction;
- first-session Money In + Money Out completion;
- Quick Add completion rate;
- transaction error rate;
- percentage of users who understand Money Left in usability testing;
- monthly Check-In completion;
- goal creation/return rate;
- install prompt acceptance after value;
- repeated dismissals of FOMO surfaces;
- reward engagement without increased confusion;
- free-to-paid conversion;
- cancellation friction/support complaints.

Do not optimize engagement metrics at the expense of user clarity or financial well-being.

---

## 46. UX audit protocol before development

### Round 1 — Expert review

Check:

- information hierarchy;
- consistency;
- mobile reachability;
- terminology;
- action clarity;
- accessibility;
- behavioral ethics;
- visual density.

### Round 2 — Task-based usability

Ask representative users to complete without instruction:

1. Add salary.
2. Record food spending.
3. Find how much is left.
4. Set a spending limit.
5. Create a savings goal.
6. Find a bill due soon.

Observe behavior; do not coach unless the task is impossible.

### Round 3 — Responsive review

Test all priority screens at mobile, tablet, and desktop sizes.

### Round 4 — Interaction prototype review

Test:

- bottom sheets;
- navigation;
- transitions;
- errors;
- loading;
- offline states;
- reward reveal;
- FOMO actions;
- paywall dismissal/upgrade.

### UX Gate PASS requires

- zero Critical UX issues;
- zero High accessibility or navigation issues;
- all core flows understandable;
- no deceptive reward/FOMO pattern;
- approved design system;
- implementation-ready high-fidelity designs for priority screens.

---

## 47. High-fidelity screen priority

### Priority 0 — must be designed before core implementation

1. Landing hero/product preview
2. Login
3. Sign up
4. Onboarding profile
5. Onboarding currency/plan
6. Home — empty
7. Home — populated
8. Quick Add
9. Money In
10. Money Out
11. Activity
12. Transaction detail/edit
13. Plan overview
14. Goal list/detail/create
15. Bills list/create
16. Monthly Check-In
17. Paywall
18. Profile/settings shell
19. Offline/sync states
20. Mobile bottom navigation
21. Desktop sidebar

### Priority 1 — design before corresponding feature phase

- Pricing details
- Subscription management
- Password reset states
- Install PWA prompt
- Custom categories
- deeper insight history
- support screens

---

## 48. Design-to-development handoff

Each approved screen should provide:

- mobile frame;
- desktop frame;
- component names;
- responsive behavior;
- states;
- spacing/token usage;
- interaction notes;
- accessibility notes;
- content copy;
- analytics events;
- reward/FOMO rule if present.

The coding agent should not substitute a different interaction merely because it is faster to code without first documenting the deviation.

---

## 49. Antigravity implementation instruction

When this specification is approved, place the Markdown file under `docs/` and make it an explicit required source in `AGENTS.md`.

Before coding a screen, Antigravity must:

1. read the corresponding section of this specification;
2. identify required components and states;
3. confirm the active audit phase;
4. implement only the approved scope;
5. verify responsive behavior;
6. verify loading/empty/error/success states;
7. run applicable tests;
8. provide evidence for audit.

Do not allow Antigravity to generate arbitrary dashboard cards or navigation structures outside the specification without an approved design change.

---

## 50. Design review checklist

### Visual

- [ ] Clear hierarchy
- [ ] Consistent typography
- [ ] Consistent spacing
- [ ] Consistent radii
- [ ] Brand color restrained
- [ ] Monetary figures easy to scan
- [ ] No unnecessary card grid
- [ ] Dark mode designed

### Interaction

- [ ] One obvious primary action
- [ ] Quick Add is fast
- [ ] Back/dismiss behavior predictable
- [ ] No accidental destructive action
- [ ] Form state preserved on recoverable errors
- [ ] Loading feedback present

### Mobile/PWA

- [ ] Safe areas respected
- [ ] Bottom nav does not cover content
- [ ] Keyboard does not hide required controls
- [ ] Touch targets comfortable
- [ ] Offline state clear
- [ ] Installed state works without browser-dependent copy

### Accessibility

- [ ] WCAG 2.2 AA target considered
- [ ] Focus visible
- [ ] Labels present
- [ ] Contrast acceptable
- [ ] Meaning not color-only
- [ ] Reduced motion supported
- [ ] Charts have text equivalent

### Behavioral engagement

- [ ] Reward uses real data
- [ ] Critical information is never randomly withheld
- [ ] FOMO is backed by real date/data
- [ ] Frequency cap exists
- [ ] No fake scarcity/countdown
- [ ] No shame
- [ ] No gambling-like reward treatment

### Subscription

- [ ] Price visible
- [ ] Billing cadence visible
- [ ] Renewal behavior visible
- [ ] Cancellation discoverable
- [ ] Paywall appears at a genuine feature boundary

---

## 51. Standards baseline

This specification should be implemented with current standards and framework guidance verified during the architecture phase.

Baseline references:

- **WCAG 2.2**, W3C — accessibility target and evaluation foundation.
- **shadcn/ui current documentation** — component primitives and selected base architecture.
- **web.dev Progressive Web Apps guidance** — installation, manifest, offline, and service-worker behavior.

As of July 2026, shadcn/ui uses Base UI as the default for new projects while continuing to support alternatives. The architecture phase should lock the chosen base before component implementation.

---

## 52. Final design principle

Before approving any Opti-Plan screen, ask:

> **Can the user understand what matters, know what to do next, and complete the task without feeling like they are using accounting software?**

If not, simplify the screen.

Opti-Plan should remain:

**simple on the surface, reliable underneath, visually calm, delightful when useful, and professionally auditable.**
