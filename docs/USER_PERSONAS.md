# Opti-Plan Universal User Personas & Personalization Specification

**Version:** 1.0  
**Phase:** Phase 0   Product Definition  
**Status:** Approved Product Blueprint  
**Governance:** Governed by `AGENTS.md` and `docs/Opti-Plan_UI_UX_Design_Specification.md`

---

## 1. Persona Architectural Rule

Opti-Plan uses **one universal financial transaction engine** across all user profiles. 

Profiles customize:
- suggested income labels during Quick Add;
- default category suggestions during setup;
- onboarding contextual examples;
- optional insight tone and educational copy;
- default dashboard emphasis.

Profiles **MUST NOT** alter:
- the core financial formula (`Money Left = Income - Expenses - Savings - Debt`);
- database schemas, calculation functions, or API contracts;
- Row Level Security policies or auth workflows;
- subscription billing rules.

---

## 2. Core User Personas

### 2.1 Persona 1: Salaried Employee ("The Structured Saver")
- **Profile Context**: Full-time employee receiving a predictable monthly or bi-weekly salary paycheck.
- **Income Pattern**: High predictability, fixed payday dates.
- **Primary Financial Goals**: Keep monthly spending within salary limits, automate bill payments, build emergency savings.
- **Onboarding Personalization**:
  - *Suggested Money In*: Salary, Bonus, Allowance, Overtime, Side Income.
  - *Suggested Categories*: Housing/Rent, Utilities, Food & Groceries, Transport, Subscriptions, Savings Target.
  - *Contextual Insight Hint*: "You have 14 days left until next payday. Your planned spending is on track."

### 2.2 Persona 2: Freelancer / Gig Worker ("The Variable Income Earner")
- **Profile Context**: Independent designer, developer, driver, or contractor with irregular invoice payouts.
- **Income Pattern**: Fluctuating amounts, unpredictable income dates throughout the month.
- **Primary Financial Goals**: Understand cash flow runway, avoid overspending during high-income months, maintain a baseline buffer.
- **Onboarding Personalization**:
  - *Suggested Money In*: Client Payment, Project Payout, Retainer, Commission, Gig Earnings.
  - *Suggested Categories*: Equipment, Software Tools, Living Expenses, Tax Reserve, Emergency Buffer.
  - *Contextual Insight Hint*: "Income logged this month covers your essential bills for 45 days."

### 2.3 Persona 3: Self-Employed Professional ("The Independent Practitioner")
- **Profile Context**: Consultant, agency owner, or private practice clinician managing personal compensation draws.
- **Income Pattern**: Monthly or quarterly owner draws from business revenues.
- **Primary Financial Goals**: Keep personal living expenses separate from practice finances and track personal wealth accumulation.
- **Onboarding Personalization**:
  - *Suggested Money In*: Personal Draw, Owner Salary, Director Fee, Dividend.
  - *Suggested Categories*: Household, Personal Care, Insurance, Retirement Savings, Discretionary.
  - *Contextual Insight Hint*: "Personal spending is within your planned draw limit for this month."

### 2.4 Persona 4: Business Owner ("The Personal Money Controller")
- **Profile Context**: Small business owner using Opti-Plan strictly for personal money tracking.
- **Income Pattern**: Executive salary, profit distributions, owner draws.
- **Primary Financial Goals**: Ensure personal lifestyle spending doesn't bleed business accounts and track net personal savings.
- **Onboarding Personalization**:
  - *Suggested Money In*: Owner Draw, Executive Salary, Distribution, Dividend.
  - *Suggested Categories*: Home Expenses, Family & Dependents, Investments, Personal Savings, Debt Service.
  - *Contextual Insight Hint*: "Clear separation between personal income and personal spending maintained this month."

### 2.5 Persona 5: Student ("The Conscious Budgeter")
- **Profile Context**: University student or trainee balancing allowances, family support, and part-time earnings.
- **Income Pattern**: Monthly allowance, stipend, or occasional part-time earnings.
- **Primary Financial Goals**: Avoid running out of money before month-end, control food/entertainment spending, save for small goals.
- **Onboarding Personalization**:
  - *Suggested Money In*: Monthly Allowance, Family Support, Part-time Pay, Scholarship, Stipend.
  - *Suggested Categories*: Textbooks/Study, Food & Dining, Campus Transport, Social/Entertainment, Savings Goal.
  - *Contextual Insight Hint*: "Food spending is 10% lower than last week. Great job keeping to your allowance!"

### 2.6 Persona 6: Couple / Family ("The Household Team")
- **Profile Context**: Partners managing combined household incomes and shared household expenses.
- **Income Pattern**: Dual salaries, combined business/freelance earnings.
- **Primary Financial Goals**: Track joint monthly household bills, manage family spending, achieve shared savings milestones (e.g. Home, Vacation).
- **Onboarding Personalization**:
  - *Suggested Money In*: Partner A Income, Partner B Income, Shared Side Income, Rental Income.
  - *Suggested Categories*: Rent/Mortgage, Groceries, Children/Dependents, Utilities, Household Maintenance, Vacation Fund.
  - *Contextual Insight Hint*: "Household bills for August are 100% covered by combined income logged so far."

### 2.7 Persona 7: Retiree / Pensioner ("The Wealth Preserver")
- **Profile Context**: Retired individual living on pension distributions, rental yields, or investment annuities.
- **Income Pattern**: Highly predictable fixed pension payouts or periodic investment withdrawals.
- **Primary Financial Goals**: Ensure fixed living costs are fully covered, monitor medical/health spending, preserve capital.
- **Onboarding Personalization**:
  - *Suggested Money In*: Monthly Pension, Annuity Distribution, Rental Income, Family Contribution.
  - *Suggested Categories*: Healthcare & Pharmacy, Utilities, Home Care, Groceries, Gifts/Family, Buffer.
  - *Contextual Insight Hint*: "Fixed monthly expenses are 100% matched by your pension income."

### 2.8 Persona 8: Multiple-Income Earner ("The Portfolio Worker")
- **Profile Context**: Individual earning across multiple jobs, freelance contracts, rental properties, and side hustles.
- **Income Pattern**: Multiple distinct income streams arriving on varied schedules.
- **Primary Financial Goals**: Consolidate total incoming cash flow clarity and manage overall spending against combined earnings.
- **Onboarding Personalization**:
  - *Suggested Money In*: Primary Salary, Freelance Client, Rental Income, Side Hustle, Dividends.
  - *Suggested Categories*: Core Living, Side Business Costs, Tax Reserve, Investments, High-Yield Savings.
  - *Contextual Insight Hint*: "You have 3 active income streams contributing to this month's Money In total."

---

## 3. Summary Matrix

| Persona | Primary Money In Emphasis | Key Dashboard Focus | Primary Behavioral Incentive |
|---|---|---|---|
| **Salaried Employee** | Salary, Bonus | Spending Plan & Bills | Monthly check-in streak |
| **Freelancer** | Client Invoices | Runway & Cash Buffer | Buffer growth milestone |
| **Self-Employed** | Personal Draw | Draw Plan vs Actual | Clean separation reward |
| **Business Owner** | Owner Distributions | Personal Savings Target | Net personal savings milestone |
| **Student** | Allowance, Part-time | Daily Spending & Food | Weekly spending win |
| **Couple / Family** | Combined Incomes | Household Bills & Goals | Joint goal progress reveal |
| **Retiree** | Pension, Annuity | Fixed Bills & Healthcare | Predictability reassurance |
| **Multi-Income** | Multiple Inflows | Aggregated Money In | Multi-stream breakdown insight |
