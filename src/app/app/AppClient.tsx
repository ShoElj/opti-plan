"use client";
import React, { useState } from "react";
import { SavingsGoal, BillItem } from "@/domain/types";
const PERSONA_PROFILES = [
  { id: "salaried", name: "Salaried Employee", description: "" },
  { id: "freelancer", name: "Freelancer", description: "" }
];
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createTransactionAction } from "./actions";
import { logoutAction } from "@/lib/auth/actions";
import { Header } from "@/components/layout/Header";
import { Navbar, NavTab } from "@/components/layout/Navbar";
import { MoneyLeftHero } from "@/components/dashboard/MoneyLeftHero";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { HomePlanCard } from "@/components/dashboard/HomePlanCard";
import { MoneyWinCard } from "@/components/dashboard/MoneyWinCard";
import { UpcomingBillCard } from "@/components/dashboard/UpcomingBillCard";
import { QuickAddSheet } from "@/components/quick-add/QuickAddSheet";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { PlanWorkspace } from "@/components/plan/PlanWorkspace";
import { MonthlyCheckInModal } from "@/components/check-in/MonthlyCheckInModal";
import { ProfileView } from "@/components/profile/ProfileView";
import { PaywallSheet } from "@/components/subscription/PaywallSheet";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Sparkles, Settings, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AppClientProps {
  initialUser: {
    name: string;
    email: string;
    personaId: string;
    currencyCode: string;
    currencySymbol: string;
    subscriptionTier: "free" | "plus";
  };
  dashboardData: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function AppClient({ initialUser, dashboardData }: AppClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // State
  const [user, setUser] = useState(initialUser);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [bills, setBills] = useState<BillItem[]>([]);
  const [spendingPlan, setSpendingPlan] = useState({
    overallMonthlyLimit: 500000,
    categoryBudgets: []
  });

  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [quickAddInitialTab, setQuickAddInitialTab] = useState<"outflow" | "inflow">("outflow");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showDevDrawer, setShowDevDrawer] = useState(false);

  const { moneyLeftBreakdown, upcomingBills, recentTransactions } = dashboardData;
  const isEmptyState = !moneyLeftBreakdown.hasIncomeLogged && recentTransactions.length === 0;

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTransaction = async (newTx: any) => {
    // Map from UI payload to Domain Payload
    const mappedType = newTx.classification || newTx.type; 
    let finalType = mappedType;
    if (finalType === 'inflow') finalType = 'income'; // fallback if needed
    if (finalType === 'outflow') finalType = 'expense'; // fallback if needed

    try {
      await createTransactionAction({
        type: finalType,
        amount: newTx.amount,
        category: newTx.category,
        note: newTx.note,
        goalId: newTx.goalId,
        occurredAt: new Date(newTx.date).toISOString() // simplistic conversion
      });
      
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save transaction.");
    }
  };

  const handleDeleteTransaction = async () => {
    // We don't have a delete action yet, but when we do:
    // await deleteTransactionAction(id);
    // startTransition(() => router.refresh());
    alert("Delete not wired in this phase brief");
  };

  const handleCreateGoal = (goal: Omit<SavingsGoal, "id" | "savedAmount" | "status">) => {
    const created: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      savedAmount: 0,
      status: "active"
    };
    setGoals([...goals, created]);
  };

  const handleAddGoalContribution = (goalId: string, amount: number) => {
    setGoals(
      goals.map((g) => (g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g))
    );
    handleSaveTransaction({
      type: "outflow",
      classification: "savings",
      amount: amount,
      category: "Savings Goal Contribution",
      date: new Date().toISOString().split("T")[0],
      note: "Goal progress contribution"
    });
  };

  const handleCreateBill = (bill: Omit<BillItem, "id" | "status">) => {
    const created: BillItem = {
      ...bill,
      id: `bill-${Date.now()}`,
      status: "unpaid"
    };
    setBills([...bills, created]);
  };

  const handleMarkBillPaid = async () => {
    // For Phase 6.1, we leave bills local state until Phase 8, but we want it to affect money left if it's wired.
    // Since Phase 8 is not done, we just alert for now.
    alert("Bills are local prototype data. Mark Paid requires real bill occurrences.");
  };

  const currentPersona = PERSONA_PROFILES.find((p) => p.id === user.personaId) || PERSONA_PROFILES[0];
  const topGoal = goals[0];

  if (isOnboarding) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <OnboardingFlow
          onComplete={(personaId, currencyCode, currencySymbol) => {
            setUser({ ...user, personaId, currencyCode, currencySymbol });
            setIsOnboarding(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? "dark" : ""}`}>
      {/* Desktop Persistent Navigation Sidebar & Mobile/Tablet Bottom Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenQuickAdd={() => {
          setQuickAddInitialTab("outflow");
          setIsQuickAddOpen(true);
        }}
        userName={user.name}
        userEmail={user.email}
      />

      {/* Main Right-Side Content Wrapper (Offset by 256px / lg:pl-64 on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Sticky Top Application Header */}
        <Header
          userName={user.name}
          personaName={currentPersona.name}
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
        />

        {/* Responsive Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
          {/* TAB 1: HOME DASHBOARD (Desktop Multi-Column Layout) */}
          {activeTab === "home" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Primary Column (8 Cols on Desktop) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Personal Greeting & Dominant Money Left Hero */}
                <MoneyLeftHero
                  userName={user.name}
                  moneyLeft={moneyLeftBreakdown.moneyLeft}
                  currencySymbol={user.currencySymbol}
                  totalIncome={moneyLeftBreakdown.income}
                  totalExpenses={moneyLeftBreakdown.expenses}
                  totalSavings={moneyLeftBreakdown.savings}
                  totalDebt={moneyLeftBreakdown.debt}
                  spendingLimit={spendingPlan.overallMonthlyLimit}
                />

                {/* Quick Actions Bar */}
                <QuickActionsBar
                  onOpenAddExpense={() => {
                    setQuickAddInitialTab("outflow");
                    setIsQuickAddOpen(true);
                  }}
                  onOpenAddIncome={() => {
                    setQuickAddInitialTab("inflow");
                    setIsQuickAddOpen(true);
                  }}
                  onGoToPlan={() => setActiveTab("plan")}
                />

                {/* Monthly Cash Flow Overview */}
                <SummaryCards
                  currencySymbol={user.currencySymbol}
                  totalIncome={moneyLeftBreakdown.income}
                  totalExpenses={moneyLeftBreakdown.expenses}
                  totalSavings={moneyLeftBreakdown.savings}
                  totalDebt={moneyLeftBreakdown.debt}
                />

                {/* Monthly Spending Target Progress */}
                {!isEmptyState && (
                  <HomePlanCard
                    overallLimit={spendingPlan.overallMonthlyLimit}
                    totalSpent={moneyLeftBreakdown.expenses}
                    currencySymbol={user.currencySymbol}
                    onGoToPlan={() => setActiveTab("plan")}
                  />
                )}
              </div>

              {/* Right Supporting Panel Column ("Your month" Assistant Order: 1. Upcoming, 2. Goals, 3. Insight) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. Upcoming Payment */}
                {upcomingBills && upcomingBills.bills && upcomingBills.bills.length > 0 && !isEmptyState && (
                  <UpcomingBillCard
                    bill={upcomingBills.bills[0]}
                    currencySymbol={user.currencySymbol}
                    onMarkPaid={handleMarkBillPaid}
                  />
                )}

                {/* 2. Savings Progress */}
                {topGoal && !isEmptyState && (
                  <div className="space-y-2">
                    <SectionHeader
                      title="Savings target"
                      action={
                        <button
                          onClick={() => setActiveTab("plan")}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center cursor-pointer"
                        >
                          <span>Goals</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      }
                    />

                    <AppCard level={2} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{topGoal.name}</h4>
                            <span className="text-[11px] text-muted-foreground">
                              {user.currencySymbol}{topGoal.savedAmount.toLocaleString()} of {user.currencySymbol}{topGoal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round((topGoal.savedAmount / topGoal.targetAmount) * 100)}%
                        </span>
                      </div>
                      <Progress value={(topGoal.savedAmount / topGoal.targetAmount) * 100} />
                    </AppCard>
                  </div>
                )}

                {/* 3. Helpful Insight (Money Win Card) */}
                {!isEmptyState && <MoneyWinCard />}

                {/* Empty State View */}
                {isEmptyState && (
                  <div className="p-8 text-center rounded-3xl bg-card border border-border/40 space-y-3">
                    <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-bold text-foreground">Welcome to Opti-Plan</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      You haven&apos;t recorded any income or expenses yet this month. Tap Quick Add below to start.
                    </p>
                    <Button
                      onClick={() => setIsQuickAddOpen(true)}
                      className="py-2.5 px-5 h-10 text-xs font-bold"
                    >
                      <span>Record First Transaction</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY TIMELINE */}
          {activeTab === "activity" && (
            <div className="max-w-4xl mx-auto">
              <ActivityTimeline
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transactions={recentTransactions.map((t: any) => ({
                  ...t,
                  date: t.occurredAt.split('T')[0],
                  // map backend type to frontend classification for component
                  classification: t.type === 'income' || t.type === 'expense' ? t.type : (t.type === 'goal_contribution' ? 'savings' : t.type),
                  type: (t.type === 'income' || t.type === 'transfer') ? 'inflow' : 'outflow'
                }))}
                currencySymbol={user.currencySymbol}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={() => {}}
              />
            </div>
          )}

          {/* TAB 3: PLAN WORKSPACE */}
          {activeTab === "plan" && (
            <div className="max-w-4xl mx-auto">
              <PlanWorkspace
                overallLimit={spendingPlan.overallMonthlyLimit}
                categoryBudgets={spendingPlan.categoryBudgets}
                goals={goals}
                bills={bills}
                currencySymbol={user.currencySymbol}
                onUpdateOverallLimit={(newLimit) =>
                  setSpendingPlan({ ...spendingPlan, overallMonthlyLimit: newLimit })
                }
                onCreateGoal={handleCreateGoal}
                onAddGoalContribution={handleAddGoalContribution}
                onCreateBill={handleCreateBill}
                onMarkBillPaid={handleMarkBillPaid}
              />
            </div>
          )}

          {/* TAB 4: PROFILE & SETTINGS */}
          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <ProfileView
                userName={user.name}
                userEmail={user.email}
                personaId={user.personaId}
                currencyCode={user.currencyCode}
                subscriptionTier={user.subscriptionTier}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                onChangePersona={(personaId) => setUser({ ...user, personaId })}
                onChangeCurrency={(code) => {
                  const sym = code === "USD" ? "$" : code === "GBP" ? "£" : code === "EUR" ? "€" : "₦";
                  setUser({ ...user, currencyCode: code, currencySymbol: sym });
                }}
                onOpenPaywall={() => setIsPaywallOpen(true)}
                onSignOut={() => startTransition(() => { logoutAction() })}
              />

              {/* Isolated Dev Prototype Drawer */}
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowDevDrawer(!showDevDrawer)}
                  className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Dev Prototype Tools</span>
                </button>

                {showDevDrawer && (
                  <div className="mt-3 p-3 rounded-2xl bg-muted/60 border border-border/40 text-xs inline-flex flex-wrap items-center justify-center gap-2">
                    <span className="font-bold text-foreground">State Toggles:</span>
                    <button
                      onClick={() => setIsOnboarding(true)}
                      className="px-2.5 py-1 rounded-lg bg-background border border-border/50 font-medium cursor-pointer"
                    >
                      Test Onboarding
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Sheet */}
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        initialTab={quickAddInitialTab}
        onClose={() => setIsQuickAddOpen(false)}
        onSaveTransaction={handleSaveTransaction}
        currencySymbol={user.currencySymbol}
        goals={goals}
      />

      {/* Monthly Money Check-In Modal */}
      <MonthlyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        currencySymbol={user.currencySymbol}
        totalIncome={moneyLeftBreakdown.income}
        totalExpenses={moneyLeftBreakdown.expenses}
        totalSavings={moneyLeftBreakdown.savings}
        totalDebt={moneyLeftBreakdown.debt}
        moneyLeft={moneyLeftBreakdown.moneyLeft}
      />

      {/* Contextual Paywall Sheet */}
      <PaywallSheet
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onConfirmUpgrade={() => {
          setUser({ ...user, subscriptionTier: "plus" });
          setIsPaywallOpen(false);
        }}
      />
    </div>
  );
}
