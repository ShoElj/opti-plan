// Opti-Plan Isolated Prototype Mock Data Layer
// Phase 1C — Interactive UI Prototype

export interface PersonaProfile {
  id: string;
  name: string;
  description: string;
  recommendedCategories: string[];
}

export const PERSONA_PROFILES: PersonaProfile[] = [
  {
    id: "salaried",
    name: "Salaried Employee",
    description: "Fixed monthly or bi-weekly paycheck with predictable recurring bills.",
    recommendedCategories: ["Salary", "Housing / Rent", "Utilities", "Groceries", "Transport", "Savings Target"]
  },
  {
    id: "freelancer",
    name: "Freelancer / Gig Worker",
    description: "Fluctuating client payments and variable monthly income dates.",
    recommendedCategories: ["Client Payment", "Project Inflow", "Software Tools", "Tax Reserve", "Groceries", "Emergency Fund"]
  },
  {
    id: "self_employed",
    name: "Self-Employed",
    description: "Managing personal draw from business revenue with seasonal shifts.",
    recommendedCategories: ["Business Owner Draw", "Personal Expenses", "Health Insurance", "Retirement", "Savings Goal"]
  },
  {
    id: "business_owner",
    name: "Business Owner",
    description: "Separating personal household budget from commercial cash flow.",
    recommendedCategories: ["Executive Salary", "Dividend Draw", "Household Bills", "Family Savings", "Debt Repayment"]
  },
  {
    id: "student",
    name: "Student",
    description: "Managing allowances, part-time earnings, tuition, and living costs.",
    recommendedCategories: ["Allowance / Stipend", "Part-Time Job", "Books & Study", "Food & Meals", "Transport"]
  },
  {
    id: "couple",
    name: "Couple / Family",
    description: "Joint household spending, shared bills, and long-term goal planning.",
    recommendedCategories: ["Combined Income", "Household Rent", "Family Groceries", "Children Education", "Vacation Goal"]
  },
  {
    id: "retiree",
    name: "Retiree / Pensioner",
    description: "Living on pension drawdowns, investments, or annuities.",
    recommendedCategories: ["Pension Inflow", "Annuity", "Healthcare & Meds", "Home Maintenance", "Family Support"]
  },
  {
    id: "multi_income",
    name: "Multiple-Income Earner",
    description: "Combining salary, side-hustle revenue, and passive inflows.",
    recommendedCategories: ["Primary Salary", "Side Hustle", "Rental Income", "Investment Dividends", "Groceries", "Debt Paid"]
  }
];

export interface Transaction {
  id: string;
  type: "inflow" | "outflow";
  classification: "income" | "expense" | "savings" | "debt";
  amount: number;
  category: string;
  date: string;
  note?: string;
  syncStatus: "synced" | "pending";
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-01",
    type: "inflow",
    classification: "income",
    amount: 350000,
    category: "Salary Inflow",
    date: "2026-08-01",
    note: "August Primary Salary Payment",
    syncStatus: "synced"
  },
  {
    id: "tx-02",
    type: "outflow",
    classification: "expense",
    amount: 80000,
    category: "Food & Groceries",
    date: "2026-08-05",
    note: "Monthly Household Market Shopping",
    syncStatus: "synced"
  },
  {
    id: "tx-03",
    type: "outflow",
    classification: "expense",
    amount: 40000,
    category: "Transport & Fuel",
    date: "2026-08-10",
    note: "Fuel & Transit Subscriptions",
    syncStatus: "synced"
  },
  {
    id: "tx-04",
    type: "outflow",
    classification: "expense",
    amount: 15000,
    category: "Utilities & Internet",
    date: "2026-08-15",
    note: "Fiber Internet Renewal",
    syncStatus: "synced"
  },
  {
    id: "tx-05",
    type: "outflow",
    classification: "savings",
    amount: 30000,
    category: "Emergency Fund",
    date: "2026-08-18",
    note: "Monthly Target Goal Contribution",
    syncStatus: "synced"
  },
  {
    id: "tx-06",
    type: "outflow",
    classification: "debt",
    amount: 15000,
    category: "Car Loan Repayment",
    date: "2026-08-20",
    note: "August Vehicle Financing Installment",
    syncStatus: "synced"
  }
];

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  status: "active" | "completed";
}

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: "goal-01",
    name: "Emergency Reserve",
    targetAmount: 500000,
    savedAmount: 250000, // 50% Milestone reached
    targetDate: "2026-12-31",
    status: "active"
  },
  {
    id: "goal-02",
    name: "New Laptop Fund",
    targetAmount: 350000,
    savedAmount: 140000,
    targetDate: "2026-10-15",
    status: "active"
  }
];

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: "unpaid" | "paid";
  frequency: "Monthly" | "Annual";
}

export const INITIAL_BILLS: BillItem[] = [
  {
    id: "bill-01",
    name: "Fiber Internet Subscription",
    amount: 15000,
    dueDate: "2026-08-27", // Due in 2 days from Aug 25
    category: "Utilities & Internet",
    status: "unpaid",
    frequency: "Monthly"
  },
  {
    id: "bill-02",
    name: "Apartment Electricity Bill",
    amount: 25000,
    dueDate: "2026-09-05",
    category: "Utilities",
    status: "unpaid",
    frequency: "Monthly"
  }
];

export interface CategoryBudget {
  category: string;
  plannedLimit: number;
  actualSpent: number;
}

export const INITIAL_SPENDING_PLAN = {
  overallMonthlyLimit: 200000, // Baseline overall plan
  categoryBudgets: [
    { category: "Food & Groceries", plannedLimit: 100000, actualSpent: 80000 },
    { category: "Transport & Fuel", plannedLimit: 50000, actualSpent: 40000 },
    { category: "Utilities & Internet", plannedLimit: 30000, actualSpent: 15000 }
  ]
};

export const PROTOTYPE_USER = {
  name: "Alex Johnson",
  email: "alex@optiplan.app",
  personaId: "salaried",
  currencyCode: "NGN",
  currencySymbol: "₦",
  subscriptionTier: "free" as "free" | "plus",
  isOffline: false,
  pendingOfflineCount: 0
};
