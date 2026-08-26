AGENTS.md — Opti-Plan Engineering & Audit Rules

0. Purpose

This file governs every AI agent, coding assistant, auditor, reviewer, or automated development process working inside the Opti-Plan repository.

Opti-Plan is a subscription-based personal money planning web application and Progressive Web App (PWA). It is based on a simple universal money-management idea: users should quickly understand what came in, what went out, what they saved, what they paid toward debt, and what they have left.

The required development rhythm is:

Build -> Test -> Audit -> Fix -> Re-test -> Sign off -> Move to next phase

No agent may skip this process.

1. Source of truth

Use this priority order when instructions conflict:

AGENTS.md

docs/Opti-Plan_Master_Development_Audit_Document.docx

Approved Markdown copy of the Master Development Audit Document

Approved active-phase specification or audit

Approved PRD

Approved architecture documents

Existing implementation and tests

Individual development prompts

Do not silently invent requirements.

Do not expand the MVP because a feature looks useful.

If implementation can safely proceed from established product principles, choose the simplest interpretation and document the assumption.

2. Product definition

Product: Opti-Plan

Type:

Subscription-based web app

Installable PWA

Universal personal money planner

Primary objective: Make everyday money planning extremely easy.

Opti-Plan should help users answer:

How much money came in?

How much money went out?

Where did it go?

How much is left?

Am I progressing toward my goals?

Opti-Plan is not accounting software in Version 1.

3. Core user profiles

The same product must work for:

Salaried employees

Freelancers / gig workers

Self-employed users

Business owners managing personal money

Students

Couples / families

Retirees / pensioners

Multiple-income earners

Profiles may personalize suggestions, categories, onboarding copy, and insights.

Profiles must NOT create duplicated financial engines.

All profiles use one trusted transaction and calculation model.

4. Non-negotiable product principles

4.1 Simplicity first

The app must feel easier than a spreadsheet.

A new user should be able to:

create an account;

add income;

record an expense;

understand Money Left;

set a goal;

without reading a manual.

Prefer:

Money In

Money Out

Money Left

Saved

Bills

Goals

Avoid unnecessary finance jargon.

4.2 Progressive disclosure

Do not show every option at once.

Expose only what the current task requires.

4.3 Mobile/PWA first-class

Every feature must be designed and tested for:

mobile web;

installed PWA;

tablet;

desktop.

Do not build desktop first and shrink it later.

4.4 Fast entry

Recording normal income or spending must require as few interactions as reasonably possible.

Quick Add is a core product feature.

4.5 Beautiful but calm

The app should feel:

modern;

premium;

friendly;

calm;

trustworthy.

It must not resemble heavy accounting software.

4.6 Real data only

Never fabricate:

balances;

savings;

insights;

streaks;

achievements;

deadlines;

popularity;

scarcity;

subscription states.

If there is insufficient data, show an honest empty state.

5. Approved Version 1 scope

Version 1 may include:

Authentication

Onboarding

Profile setup

Dashboard

Money In

Money Out

Activity / transaction history

Monthly spending plan

Savings target

Savings goals

Bills and subscription tracking

Monthly money check-in

Settings

Paid subscription/paywall

Installable PWA

Basic offline transaction capture and sync

Responsive design

Dark mode

Behavioral engagement layer

MVP analytics

Do NOT add without explicit approval:

bank integrations;

investment recommendations;

crypto;

loans;

tax filing;

full accounting;

invoicing;

credit scoring;

advanced business bookkeeping;

AI financial advisor;

complex forecasting;

social feed;

gambling-style rewards.

6. Approved technology direction

Unless an approved architecture gate changes it:

Frontend

Next.js

React

TypeScript strict mode

Tailwind CSS

shadcn/ui

Lucide icons

Motion for purposeful transitions

Forms

Use a consistent validated form strategy, preferably:

React Hook Form

Zod

Never trust client-side validation alone.

Data / authentication

Supabase Auth

Supabase PostgreSQL

Supabase Row Level Security

Payments

Paystack initially

Server-verified subscription state

Validated webhook signatures

Browser redirects must never grant paid access

PWA / offline

Web App Manifest

Service Worker

Installable experience

Explicit cache strategy

Offline transaction queue

Sync strategy

Duplicate prevention

IndexedDB or approved abstraction for local structured data

Testing

Unit tests

Integration tests where required

Playwright for critical E2E flows

7. Phase-gated development

A phase is not complete because code exists.

Every phase must pass through:

Requirements understood

Implementation plan

Build

Developer verification

Automated tests

Manual verification where required

Audit evidence

Independent audit

Fix findings

Re-test

Gate decision

Allowed gate decisions:

PASS

PASS WITH ACTIONS

FAIL

7.1 Phase lock

Only work on the currently authorized phase.

Do not begin a later phase because it is convenient.

Future work should be documented under:

Deferred / Future Phase

7.2 Gate ownership

The implementation agent does NOT award itself a PASS.

It may only report:

READY FOR AUDIT

7.3 Blocking findings

Any unresolved Critical or High issue involving these areas blocks progression:

authentication;

authorization;

cross-user data access;

data corruption;

financial calculations;

payment validation;

subscription access;

secrets;

privacy;

destructive data behavior;

offline duplicate/data-loss risk;

production-breaking runtime failures.

8. Required phase order

Phase 0 — Product Definition

Create and approve:

PRD

MVP scope

user profiles

subscription assumptions

product guardrails

success criteria

Phase 1 — UX Architecture

Create and approve:

information architecture

user journeys

mobile journeys

desktop journeys

wireframe specifications

loading/empty/error states

behavioral engagement placement

Phase 2 — Technical Architecture

Create and approve:

app architecture

database architecture

auth architecture

payment architecture

PWA/offline architecture

testing architecture

environment strategy

Phase 3 — Engineering Foundation

Set up:

Next.js

strict TypeScript

Tailwind

shadcn/ui

linting

formatting

unit-test runner

Playwright

CI

environment validation

Phase 4 — Database & RLS

Implement:

schema

migrations

ownership

RLS

isolation tests

Phase 5 — Authentication

Implement:

sign up

login

logout

verification

password reset

sessions

protected routes

account controls

Phase 6 — Core Money Engine

Implement:

Money In

Money Out

trusted calculations

transaction classification

month boundaries

financial invariants

Phase 7 — Dashboard

Implement:

Money Left

Income

Spending

Savings

Debt Paid

simple category summary

useful upcoming information

Phase 8 — Planning / Goals / Bills

Implement:

spending plan

savings target

savings goals

bills

subscriptions tracking

Phase 9 — Paid Subscription

Implement:

plans

checkout

webhook handling

subscription state

cancellation

expiry

paid-feature authorization

Phase 10 — Behavioral Engagement

Implement:

intermittent variable rewards

FOMO / urgency based on real circumstances

milestones/streaks where approved

content triggers

analytics

ethical controls

Phase 11 — PWA & Offline

Implement:

manifest

service worker

install flow

offline capture

sync

duplicate prevention

conflict behavior

Phase 12 — Accessibility

Audit and correct accessibility.

Phase 13 — Security

Perform focused application-security review.

Phase 14 — Performance & Reliability

Verify real-world performance and graceful failure.

Phase 15 — Full E2E Release Gate

Run critical customer journeys.

Phase 16 — Independent Professional Audit

Perform separate audit pass.

Phase 17 — Beta / UAT

Validate with target users.

Phase 18 — Production Release

Complete release checklist and production smoke testing.

Phase 19 — Post-launch Audit

Review:

Day 7

Day 14

Day 30

bugs

retention

subscription behavior

UX friction

engagement mechanics

security signals

9. UX rules

9.1 Navigation

Mobile/PWA should stay intentionally small, normally around:

Home

Activity

Plan

Profile

with a prominent Quick Add action.

Desktop may use a sidebar but must preserve simplicity.

9.2 Dashboard hierarchy

Prioritize:

Money Left

Money In

Money Out

Saved

Debt Paid

Secondary information may include:

spending-plan progress;

savings progress;

top categories;

upcoming bills;

one useful insight.

Do not fill the dashboard with charts.

9.3 Quick Add

Always make the distinction clear:

Money In

Money Out

Do not require unnecessary fields.

9.4 Forms

Every form requires:

visible labels;

useful validation;

loading state;

duplicate-submit prevention where needed;

success feedback;

safe errors.

Do not use placeholders as the only label.

9.5 shadcn/ui

Use shadcn/ui as the primary component foundation.

Do not mix unrelated design systems without a documented reason.

9.6 Icons

Use Lucide consistently.

Icons must clarify meaning rather than create visual noise.

9.7 Motion

Approved:

subtle entrance;

sheet transition;

progress fill;

success feedback;

goal completion;

active navigation animation.

Avoid:

constant decorative motion;

long splash animations;

blocking animation;

excessive card movement.

Respect reduced-motion preferences.

## UI Skills — External Design Engineering Guidance

### Purpose
For tasks involving:
- UI design;
- UX refinement;
- responsive layout;
- accessibility;
- typography;
- color;
- visual hierarchy;
- interaction design;
- motion;
- frontend craft;
- component polish;
- loading states;
- empty states;
- form usability;
- mobile/PWA interface quality;
- UI performance;
Antigravity MAY consult UI Skills (https://www.ui-skills.com/agents/antigravity) when it would materially improve implementation quality.

UI Skills is NOT required for unrelated tasks such as:
- database migrations;
- RLS;
- backend architecture;
- payment processing;
- financial calculations;
- infrastructure;
- data modeling;
unless a UI concern is directly involved.

### Authority Order
The existing Opti-Plan governance hierarchy remains superior. The authority order is:
1. AGENTS.md
2. Approved Opti-Plan product and architecture specifications
3. Active authorized phase requirements
4. Formal audit findings and remediation requirements
5. Approved Opti-Plan UX and design-system specifications
6. UI Skills guidance
7. Agent design judgment

If UI Skills conflicts with any requirement above it, the higher-authority Opti-Plan requirement wins. UI Skills must never silently override Opti-Plan.

### UI Skills Must Not Authorize
UI Skills is strictly supplementary external design guidance and does NOT authorize:
- new product features;
- new navigation destinations;
- information-architecture changes;
- financial-model changes;
- database changes;
- backend implementation;
- subscription-policy changes;
- monetization decisions;
- bank-sync changes;
- security-rule changes;
- removal of accessibility safeguards;
- phase-boundary violations;
- reopening a formally passed phase;
- replacing approved Opti-Plan terminology;
- redesigning approved screens without authorization.

### Opti-Plan Design Principles Remain Authoritative
All UI Skills guidance must be interpreted through Opti-Plan's existing product principles. The following principles remain authoritative:
- consumer-finance simplicity;
- Money Left as the primary financial truth;
- Home / Activity / Plan / Profile + Quick Add navigation;
- desktop as an intentional full product workspace;
- tablet as an intentional intermediate experience;
- mobile as a focused money companion;
- responsive continuity;
- premium but restrained fintech presentation;
- limited card clutter;
- strong visual hierarchy;
- human-readable labels;
- no developer/internal terminology in customer UI;
- financial truth before engagement;
- maximum one contextual Money Win on Home;
- truthful urgency only;
- non-shaming financial language;
- accessible interaction;
- shadcn/Radix foundation customized to Opti-Plan rather than generic defaults.

UI Skills may improve execution of these principles, but it may not replace them.

### Skill Selection Rule
For an applicable UI task, Antigravity should use the smallest relevant subset of UI Skills. Do NOT automatically load every available skill.
Before using UI Skills, the agent should identify:
1. the actual UI problem;
2. the relevant skill category;
3. the smallest useful skill or skills;
4. why the skill is applicable;
5. whether any guidance conflicts with Opti-Plan.

Only applicable, non-conflicting guidance should be implemented.

### UI Skills Workflow
The preferred workflow for consulting UI Skills is:
1. Read AGENTS.md.
2. Read the relevant Opti-Plan design/product documentation.
3. Identify the UI problem.
4. Discover the relevant UI Skills category.
5. Load the smallest applicable skill.
6. Compare its guidance against Opti-Plan requirements.
7. Reject conflicting recommendations.
8. Implement applicable recommendations.
9. Run existing quality checks.
10. Audit the final result against Opti-Plan rather than against UI Skills alone.

UI Skills is not required to be used when it would add no meaningful value.

### CLI / Version Governance
UI Skills is an agent/development aid. It must NOT become an Opti-Plan production runtime dependency. Do not install it into production dependencies, and do not modify package.json or package-lock.json.
If CLI usage is required for a UI task, prefer a reviewed/pinned version rather than an uncontrolled moving latest version. The current candidate reviewed during project discussion is:
`ui-skills@0.2.4`

Conceptual development-agent usage is:
`npx ui-skills@0.2.4 start`
followed by the appropriate category/list/get workflow supported by that version.
Do not execute these commands or install ui-skills during this governance update. Future version upgrades must be reviewed before becoming the project default.

### External Guidance Safety
Because UI Skills is external guidance:
- do not assume every recommendation fits Opti-Plan;
- do not copy patterns mechanically;
- do not treat popularity or aesthetic preference as product evidence;
- do not add complexity solely because a skill suggests it;
- do not weaken security or financial clarity for visual polish;
- do not sacrifice accessibility for aesthetics;
- do not copy another product's identity;
- do not reopen formally accepted UX without an authorized change request.

### When UI Skills Is Most Useful
UI Skills may be especially valuable in the following areas:
- new production dashboard implementation;
- responsive screen refinement;
- forms and validation UX;
- Quick Add refinement;
- Activity timeline/list refinement;
- planning interface;
- goals and bills;
- onboarding;
- paywall;
- loading/error/empty states;
- accessible dialogs/sheets;
- motion polish;
- typography;
- visual hierarchy;
- touch targets;
- layout shift;
- frontend performance;
- PWA/mobile polish;
- final visual/accessibility audits.

### Phase 1 Status
The addition of UI Skills does NOT reopen Phase 1. Phase 1 UX remains formally PASS. UI Skills applies prospectively to newly authorized UI work and future refinement tasks. Existing approved UI may only be changed when an active phase or formal change request authorizes the modification.

### Formal Audits
UI Skills guidance does not replace implementation testing, accessibility testing, responsive verification, formal independent audits, product acceptance, or security reviews. Formal Opti-Plan gates remain authoritative.

10. Behavioral engagement strategy

Opti-Plan intentionally includes:

Intermittent Variable Rewards

FOMO / urgency

These are first-class UX/content requirements.

Their goal is to increase useful financial engagement and retention without falsifying information or pressuring users into harmful financial behavior.

11. Intermittent Variable Rewards

Variable rewards should make healthy money-management behavior feel rewarding.

Approved examples:

personalized Money Win;

unexpected useful insight;

weekly discovery card;

savings milestone celebration;

spending improvement observation;

category discovery;

monthly recap reveal;

goal-progress milestone;

positive streak milestone;

relevant educational tip;

new comparison unlocked after enough history exists.

Example:

Money Win: Your transport spending is 12% lower than your recent average.

Only show this if real transaction data proves it.

Another example:

New insight unlocked: Bills now represent 18% of this month's spending.

Again, it must be calculated from real data.

11.1 Required reward specification

Every variable reward must define:

trigger;

eligibility;

data source;

calculation;

presentation;

frequency cap;

user benefit;

empty/failure behavior;

analytics event;

accessibility behavior.

11.2 Prohibited reward mechanics

Never implement:

casino-style mechanics;

loot boxes;

slot-machine visuals;

fake mystery money;

fake savings;

rewards for unnecessary spending;

rewards for creating debt;

gambling-like cash outcomes;

unpredictable subscription pricing.

Variability should be in useful content/reveal, never in financial truth.

12. FOMO / urgency

FOMO should motivate timely, beneficial action.

Preferred uses:

month ending soon;

bill due soon;

savings deadline approaching;

plan nearly exhausted;

monthly check-in incomplete;

genuine trial ending;

genuine promotion ending;

streak at risk where approved;

planning cycle incomplete.

Approved examples:

August ends in 3 days. Complete your Money Check-In before September begins.

Your internet bill is due tomorrow.

You're 8,500 away from this month's savings target.

Two days left to complete this month's planning cycle.

12.1 Truth requirement

Every FOMO message must be backed by:

a real date;

real deadline;

real account data;

genuine product rule;

or genuine offer expiration.

12.2 Prohibited FOMO

Never use:

fake countdowns;

resetting timers;

fake scarcity;

fake customer/view counts;

fabricated social proof;

fabricated savings;

shame;

threats;

fear about financial failure;

hidden cancellation friction;

deceptive subscription urgency.

12.3 Subscription FOMO

Always clearly present:

price;

billing frequency;

trial end date;

renewal behavior;

cancellation path;

what changes after cancellation.

Do not intentionally make cancellation harder than purchase.

13. Behavioral engagement audit

Every engagement feature requires evidence.

Use:

Feature:
Behavior type:
Trigger:
Data source:
Eligibility:
Frequency cap:
Copy:
User benefit:
Why the claim is true:
Analytics event:
Accessibility impact:
Subscription impact:
Manipulation risk:
Test evidence:
Verdict:

Automatic FAIL:

fabricated urgency;

false savings claim;

unverifiable financial insight;

dark-pattern subscription behavior;

gambling-like financial reward;

misleading countdown;

hidden billing information.

14. Financial calculation rules

Financial correctness is release-critical.

14.1 Single source of truth

Do not duplicate financial calculations across UI components.

Dashboard, reports, summaries, and insights must consume trusted domain logic.

14.2 Core formula

At MVP level:

Money Left =
Total Income
- Normal Expenses
- Savings Contributions
- Debt Repayments

Do not double-count savings or debt.

14.3 Transaction classification

Every financial transaction needs an explicit valid classification, at minimum:

income;

normal expense;

savings;

debt repayment.

14.4 Money representation

Do not use floating-point arithmetic for stored money.

Use an exact representation such as PostgreSQL numeric or integer minor units where appropriate.

14.5 Currency

Do not silently convert currencies.

Store/handle currency according to approved architecture.

14.6 Negative values

Reject negative amounts unless an explicit approved refund/reversal model requires them.

14.7 Required financial tests

Test:

no transactions;

income only;

expense only;

savings;

debt;

multiple transactions;

edited transactions;

deleted transactions;

month boundaries;

timezone boundaries;

large values;

decimals where valid;

spending above income;

unset plan;

unset savings target.

15. Database rules

All database changes must be migrations.

Do not rely on undocumented manual production changes.

Every user-owned row must have enforceable ownership.

15.1 RLS

Enable and test Row Level Security for exposed user-owned tables.

Test:

User A reads own data.

User A cannot read User B data.

User A inserts own valid rows.

User A cannot insert rows for User B.

User A updates own rows.

User A cannot update User B rows.

User A deletes only permitted own rows.

Signed-out users cannot access protected financial data.

Hidden UI is not authorization.

15.2 Service role

Never expose the Supabase service-role key to browser code.

15.3 Integrity

Use database constraints where appropriate for:

ownership;

transaction type;

valid amounts;

referential integrity;

required uniqueness.

16. Authentication rules

Implement approved flows:

sign up;

login;

logout;

verification;

password reset;

session recovery;

protected routes.

Never weaken security or middleware to make tests pass.

Never hardcode QA credentials in tracked source.

17. Subscription and payment rules

The frontend does not decide paid entitlement.

Do not unlock access because:

URL says success=true;

localStorage says plus;

client state was modified;

checkout redirected.

Subscription entitlement must come from trusted server/payment state.

17.1 Webhooks

Validate webhook authenticity.

Webhook handling must be idempotent.

A duplicate event must not create duplicate subscription effects.

17.2 Subscription states

Use explicit architecture-approved states, such as:

free;

trialing;

active;

grace;

past_due;

cancelled;

expired.

17.3 Cancellation

Cancellation must be discoverable and understandable.

Never intentionally obstruct cancellation.

18. PWA and offline rules

Offline support must preserve financial integrity.

18.1 Offline queue

Offline-created transactions need stable client-generated IDs or another approved idempotency method.

18.2 Sync

On reconnect:

sync pending records;

mark success;

keep failures;

allow retry;

prevent duplicates.

18.3 Conflicts

Define behavior when local and remote versions both changed.

Never silently discard user financial data.

18.4 Offline UX

Clearly communicate:

Offline

Saved locally

Syncing

Synced

Sync failed

Never show cloud-synced status when data is only local.

19. Accessibility

Verify:

keyboard navigation;

visible focus;

labels;

meaningful errors;

semantic headings;

dialog focus;

contrast;

touch targets;

screen-reader names;

reduced motion;

zoom/reflow.

Automated scans do not replace manual review.

20. Content rules

Content should be:

concise;

clear;

supportive;

factual;

action-oriented.

Never guarantee financial outcomes.

Avoid:

Opti-Plan will save you 100,000 every month.

Prefer:

See where your money is going and make more deliberate decisions.

Do not provide regulated investment advice in V1.

21. Error handling

Never expose raw provider/database errors to users.

Errors should explain:

what failed;

whether data was saved;

what the user can do next.

Example:

Good:
We couldn't sync this expense yet. It is still saved on this device and we'll retry when you're online.

Bad:
PostgREST PGRST116...

22. State completeness

Every meaningful async feature must consider:

initial loading;

slow loading;

empty data;

success;

validation error;

server error;

unauthorized;

offline;

retry.

A feature is not complete if only the ideal state works.

23. Testing requirements

23.1 Unit tests

Required for:

financial calculations;

spending-plan progress;

goal progress;

insight eligibility;

FOMO timing;

entitlement logic;

validation.

23.2 Integration tests

Use for:

database behavior;

RLS;

authentication integration;

payment transitions;

offline synchronization.

23.3 E2E tests

Minimum final critical flows:

Flow A — New user

Sign up
-> onboarding
-> add income
-> add expense
-> dashboard updates
-> logout
-> login
-> data persists

Flow B — Planning

Create monthly plan
-> add spending
-> plan progress updates correctly

Flow C — Goal

Create goal
-> record savings
-> goal progress updates

Flow D — Bills

Create bill
-> upcoming bill displayed
-> paid behavior verified

Flow E — Subscription

Free user
-> attempts paid feature
-> paywall
-> verified subscription
-> feature unlocks

Flow F — Authorization

User A
-> attempts User B record
-> denied

Flow G — Offline

Go offline
-> add expense
-> save locally
-> reconnect
-> sync
-> exactly one server record

Flow H — Behavioral engagement

Create qualifying real-data state
-> correct reward/FOMO appears
-> non-qualifying state does not show false message

24. Test quality rules

Never:

delete assertions to make tests pass;

mock a real DB flow merely to green a release gate;

increase timeouts as the primary fix;

use .first() when a specific created record is required;

silently skip critical assertions;

let tests pass when required controls are missing;

hardcode changing database IDs.

Tests must fail when the actual user workflow is broken.

25. Code quality

TypeScript

Use strict typing. Avoid any unless documented.

Components

Keep components focused. Reuse meaningful patterns without over-abstracting.

Server/client boundaries

Keep privileged operations server-side. Never send secrets to client components.

Validation

Validate untrusted data at trusted boundaries.

Dependencies

Before adding a package:

check existing stack;

justify the dependency;

avoid large packages for trivial tasks.

Dead code

Remove abandoned competing implementations.

26. Security

Treat Opti-Plan as holding sensitive personal financial information.

Review:

authentication;

authorization;

sessions;

input validation;

injection;

XSS;

CSRF where relevant;

secrets;

database policies;

webhooks;

dependencies;

security headers;

rate limits;

sensitive-data exposure.

Never log:

passwords;

access tokens;

secret keys;

full payment credentials.

Minimize logging of financial details.

27. Privacy

Collect only data required for the product.

Do not send raw user financial information to third-party analytics by default.

Prefer analytics metadata like:

feature used;

success/failure;

completion time;

screen visited;

instead of exact amounts/descriptions unless explicitly approved.

28. Analytics

Analytics should answer:

Did onboarding complete?

Was the first transaction added?

Is Quick Add used?

Where is UX friction?

Do users return for monthly check-ins?

Are rewards helpful?

Do FOMO messages lead to useful action?

Where does subscription conversion happen?

Where do cancellations happen?

Do not turn Opti-Plan into surveillance software.

29. Repository documentation

Maintain approved docs under docs/ as phases require them.

Expected examples:

docs/
  Opti-Plan_Master_Development_Audit_Document.docx
  PRD.md
  MVP_SCOPE.md
  USER_PERSONAS.md
  PRODUCT_GUARDRAILS.md
  UX_ARCHITECTURE.md
  TECHNICAL_ARCHITECTURE.md
  DATABASE_SCHEMA.md
  SECURITY_MODEL.md
  PWA_OFFLINE_STRATEGY.md
  SUBSCRIPTION_MODEL.md
  BEHAVIORAL_ENGAGEMENT_SPEC.md
  TEST_STRATEGY.md
  RELEASE_GATE.md
  audits/

Do not create all documents prematurely.

30. Audit finding format

Use:

ID:
Severity:
Phase:
Area:
File(s):
Requirement:
Observed behavior:
Expected behavior:
Evidence:
Risk:
Recommended fix:
Verification required:
Status:

Severity:

Critical — immediate release blocker

High — major issue blocking phase progression

Medium — important issue, potentially PASS WITH ACTIONS where allowed

Low — minor quality issue

31. Evidence requirements

Do not claim verification without evidence.

Possible evidence:

changed files;

migrations;

command output;

unit tests;

integration tests;

Playwright output;

screenshots;

traces;

database queries;

RLS tests;

accessibility output;

security audit output;

manual QA notes.

Evidence must prove the claim.

A production build does not prove a payment workflow.

32. Required implementation report

At the end of a phase:

PHASE [N] — [NAME]

Implementation Status:
COMPLETE / PARTIAL / BLOCKED

Scope Implemented:
- ...

Files Created:
- ...

Files Modified:
- ...

Database Changes:
- ...

Security Changes:
- ...

UX Changes:
- ...

Behavioral Engagement Changes:
- ...

Tests Added:
- ...

Commands Executed:
- ...

Typecheck:
PASS / FAIL / NOT RUN

Lint:
PASS / FAIL / NOT RUN

Unit Tests:
PASS / FAIL / NOT RUN

Integration Tests:
PASS / FAIL / NOT RUN

E2E Tests:
PASS / FAIL / NOT RUN

Build:
PASS / FAIL / NOT RUN

Manual Verification:
- ...

Known Issues:
- ...

Deferred Work:
- ...

Audit Evidence:
- ...

Requested Gate Status:
READY FOR AUDIT / NOT READY FOR AUDIT

The implementation agent must not declare the gate PASS.

33. Required auditor report

Use:

PHASE [N] AUDIT — [NAME]

Functional:
PASS / PASS WITH ACTIONS / FAIL

Data Integrity:
PASS / PASS WITH ACTIONS / FAIL / N/A

Security:
PASS / PASS WITH ACTIONS / FAIL / N/A

Privacy:
PASS / PASS WITH ACTIONS / FAIL / N/A

UX:
PASS / PASS WITH ACTIONS / FAIL

Accessibility:
PASS / PASS WITH ACTIONS / FAIL / N/A

PWA/Offline:
PASS / PASS WITH ACTIONS / FAIL / N/A

Payments:
PASS / PASS WITH ACTIONS / FAIL / N/A

Behavioral Engagement:
PASS / PASS WITH ACTIONS / FAIL / N/A

Testing:
PASS / PASS WITH ACTIONS / FAIL

Findings:
Critical: [number]
High: [number]
Medium: [number]
Low: [number]

Blocking Findings:
- ...

Required Corrections:
- ...

Evidence Reviewed:
- ...

FINAL GATE:
PASS / PASS WITH ACTIONS / FAIL

34. Definition of done — feature

A feature is not done until applicable items are true:

requirement implemented;

responsive;

mobile verified;

desktop verified;

loading state;

empty state;

error state;

success state;

server validation;

authorization verified;

DB constraints/RLS where relevant;

tests added;

tests executed;

no related regression;

accessibility reviewed;

analytics considered;

behavioral engagement considered but not forced;

documentation updated;

audit evidence available.

35. Definition of done — phase

A phase is complete only when:

approved scope is implemented;

required tests pass;

audit evidence exists;

audit is complete;

Critical findings = 0;

High findings = 0;

Medium findings are fixed or formally accepted where allowed;

gate decision allows progression.

36. Production release

Do not recommend production release until required release gates pass.

Final verification should cover:

product requirements;

UX;

authentication;

authorization;

RLS;

financial calculations;

persistence;

subscription billing;

cancellation;

PWA;

offline sync;

accessibility;

security;

performance;

E2E;

beta/UAT;

production environment;

backups;

monitoring.

Final report must state either:

RELEASE DECISION:
APPROVED

or:

RELEASE DECISION:
NOT APPROVED

37. No fake success

Never claim:

implemented;

fixed;

working;

production-ready;

secure;

passed;

unless relevant work and verification actually occurred.

If a command cannot be run, report:

NOT VERIFIED

38. Do not hide failures

If a fix reveals another failure:

report it;

diagnose it;

continue only within active-phase scope;

do not weaken assertions without justification.

A failed gate is useful information.

39. Preserve working functionality

When correcting bugs:

identify root cause;

make the smallest safe correction;

add regression coverage where appropriate;

verify related behavior still works.

Do not rewrite working modules unnecessarily.

40. New-feature decision rule

For every new idea ask:

Does it make money management easier?

Does it fit the active MVP?

Does it improve retention without confusion?

Does it introduce security/privacy complexity?

Does it belong to a later phase?

Can we measure whether it works?

If it does not clearly belong in the active phase, defer it.

41. Opti-Plan simplicity test

At major UX gates, verify a new user can:

Create an account.

Finish onboarding.

Add salary/income.

Record food/transport spending.

Find Money Left.

Understand where money went.

Set a savings target.

If users repeatedly fail the same task, redesign rather than adding instructions.

42. Final guiding principle

Every agent must ask:

Does this make managing money easier, safer, clearer, and more useful for the Opti-Plan user?

If not, do not add complexity merely to make the product look advanced.

Opti-Plan should be:

simple on the surface, reliable underneath, delightful when useful, and professionally auditable from start to finish.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
