"use client";
import React, { useState } from "react";
import { SmartAlert } from "@/domain/types";
const PERSONA_PROFILES = [
  { id: "salaried", name: "Salaried Employee", description: "" },
  { id: "freelancer", name: "Freelancer", description: "" }
];
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  createTransactionAction,
  createSavingsGoalAction,
  createBillAction,
  markBillPaidAction,
  setSpendingPlanLimitAction
} from "./actions";
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
import { Sparkles, Settings, Target, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FinancialHealthCard } from "@/components/health/FinancialHealthCard";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";
import { AlertsWorkspace } from "@/components/alerts/AlertsWorkspace";
import {
  markAlertReadAction,
  markAllAlertsReadAction
} from "./actions";

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

  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [quickAddInitialTab, setQuickAddInitialTab] = useState<"outflow" | "inflow">("outflow");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showDevDrawer, setShowDevDrawer] = useState(false);

  // Calendar State
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);

  const {
    moneyLeftBreakdown,
    upcomingBills,
    recentTransactions,
    savingsGoals = [],
    billOccurrences = [],
    spendingPlan,
    currentPeriod,
    financialHealth,
    smartAlerts = [],
    financialEvents = [],
    spendingDays = [],
    spendingInsights = {
      totalSpent: 0,
      activeSpendDaysCount: 0,
      averageSpendPerActiveDay: 0,
      highestSpendDay: null,
      noSpendDaysCount: 0
    }
  } = dashboardData;

  const [alertsList, setAlertsList] = useState<SmartAlert[]>(smartAlerts);
  const unreadAlertsCount = alertsList.filter((a) => !a.readAt).length;

  const isEmptyState = !moneyLeftBreakdown.hasIncomeLogged && recentTransactions.length === 0;
  const overallMonthlyLimit = spendingPlan ? spendingPlan.limitAmount / 100 : 500000;

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      await markAlertReadAction(alertId);
      setAlertsList((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, readAt: new Date().toISOString() } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      await markAllAlertsReadAction();
      setAlertsList((prev) =>
        prev.map((a) => ({ ...a, readAt: new Date().toISOString() }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCalendarMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
    startTransition(() => {
      router.refresh();
    });
  };

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTransaction = async (newTx: any) => {
    const mappedType = newTx.classification || newTx.type;
    let finalType = mappedType;
    if (finalType === 'inflow') finalType = 'income';
    if (finalType === 'outflow') finalType = 'expense';

    try {
      await createTransactionAction({
        type: finalType,
        amount: Math.round(newTx.amount * 100), // convert major to minor units
        category: newTx.category,
        note: newTx.note,
        goalId: newTx.goalId,
        occurredAt: new Date(newTx.date || Date.now()).toISOString()
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save transaction.");
    }
  };

  const handleCreateGoal = async (goal: { name: string; targetAmount: number; targetDate?: string }) => {
    try {
      await createSavingsGoalAction({
        name: goal.name,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        status: "active"
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to create savings goal.");
    }
  };

  const handleAddGoalContribution = async (goalId: string, amountMinorUnits: number) => {
    try {
      await createTransactionAction({
        type: "goal_contribution",
        amount: amountMinorUnits,
        category: "Savings Goal Contribution",
        goalId: goalId,
        occurredAt: new Date().toISOString()
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to record goal contribution.");
    }
  };

  const handleCreateBill = async (bill: { name: string; amount: number; dueDate: string; category?: string; frequency?: string }) => {
    try {
      await createBillAction({
        name: bill.name,
        expectedAmount: bill.amount,
        dueDate: bill.dueDate,
        category: bill.category,
        frequency: (bill.frequency as "weekly" | "biweekly" | "monthly" | "yearly" | "custom") || "monthly"
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to create bill.");
    }
  };

  const handleMarkBillPaid = async (billOccurrenceId: string) => {
    try {
      await markBillPaidAction(billOccurrenceId);
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to mark bill as paid.");
    }
  };

  const handleUpdateOverallLimit = async (newLimitMajorUnits: number) => {
    try {
      await setSpendingPlanLimitAction({
        periodStart: currentPeriod.start,
        periodEnd: currentPeriod.end,
        limitAmount: Math.round(newLimitMajorUnits * 100)
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update spending plan limit.");
    }
  };

  const currentPersona = PERSONA_PROFILES.find((p) => p.id === user.personaId) || PERSONA_PROFILES[0];
  const topGoal = savingsGoals[0];

  if (isOnboarding) {
    return (
      <div>
        <OnboardingFlow
          currencySymbol={user.currencySymbol}
          onComplete={async () => {
            setIsOnboarding(false);
            // Hard refresh the data so dashboard loads it
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Right-Side Content Wrapper (Offset by 256px / lg:pl-64 on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Sticky Top Application Header */}
        <Header
          userName={user.name}
          personaName={currentPersona.name}
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
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
                  spendingLimit={overallMonthlyLimit}
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

              </div>

              {/* Right Supporting Panel Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Financial Health Indicator */}
                {financialHealth && (
                  <FinancialHealthCard health={financialHealth} currencySymbol={user.currencySymbol} />
                )}

                {/* 1. Upcoming Payment */}
                {!isEmptyState && (
                  upcomingBills?.bills?.length > 0 ? (
                    <UpcomingBillCard
                      bill={upcomingBills.bills[0]}
                      currencySymbol={user.currencySymbol}
                      onMarkPaid={(billId) => handleMarkBillPaid(billId)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <SectionHeader title="Upcoming bill" />
                      <AppCard level={2} className="flex flex-col items-center justify-center p-5 text-center space-y-3">
                        <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">No upcoming bills</p>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] mx-auto">Track recurring payments so you never miss a due date.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("plan")} className="text-xs mt-1">
                          + Add a bill
                        </Button>
                      </AppCard>
                    </div>
                  )
                )}

                {/* 2. Savings Progress */}
                {!isEmptyState && (
                  topGoal ? (
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
                                {user.currencySymbol}{(topGoal.savedAmount / 100).toLocaleString()} of {user.currencySymbol}{(topGoal.targetAmount / 100).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {topGoal.targetAmount > 0 ? Math.round((topGoal.savedAmount / topGoal.targetAmount) * 100) : 0}%
                          </span>
                        </div>
                        <Progress value={topGoal.targetAmount > 0 ? Math.min(100, (topGoal.savedAmount / topGoal.targetAmount) * 100) : 0} />
                      </AppCard>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SectionHeader title="Savings target" />
                      <AppCard level={2} className="flex flex-col items-center justify-center p-5 text-center space-y-3">
                        <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">No savings goals yet</p>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] mx-auto">Set a target to start building your future.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("plan")} className="text-xs mt-1">
                          + Set a goal
                        </Button>
                      </AppCard>
                    </div>
                  )
                )}

                {/* 3. Helpful Insight (Money Win Card) */}
                {!isEmptyState && spendingInsights.insightMessage && (
                  <MoneyWinCard insightMessage={spendingInsights.insightMessage} />
                )}

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
                  classification: t.type === 'income' || t.type === 'expense' ? t.type : (t.type === 'goal_contribution' ? 'savings' : t.type),
                  type: (t.type === 'income' || t.type === 'transfer') ? 'inflow' : 'outflow'
                }))}
                currencySymbol={user.currencySymbol}
                onDeleteTransaction={() => { }}
                onEditTransaction={() => { }}
              />
            </div>
          )}

          {/* TAB 3: PLAN WORKSPACE */}
          {activeTab === "plan" && (
            <div className="max-w-4xl mx-auto">
              <PlanWorkspace
                overallLimit={overallMonthlyLimit}
                categoryBudgets={[]}
                goals={savingsGoals}
                bills={billOccurrences.map((o: { id: string; billId: string; name?: string; expectedAmount: number; dueDate: string; category?: string; status: string }) => ({
                  id: o.id,
                  billId: o.billId,
                  name: o.name || "Bill Payment",
                  amount: o.expectedAmount,
                  dueDate: o.dueDate,
                  category: o.category,
                  status: o.status === 'paid' ? ('paid' as const) : ('unpaid' as const)
                }))}
                currencySymbol={user.currencySymbol}
                onUpdateOverallLimit={handleUpdateOverallLimit}
                onCreateGoal={handleCreateGoal}
                onAddGoalContribution={handleAddGoalContribution}
                onCreateBill={handleCreateBill}
                onMarkBillPaid={handleMarkBillPaid}
              />
            </div>
          )}

          {/* TAB 4: CALENDAR WORKSPACE */}
          {activeTab === "calendar" && (
            <div className="max-w-4xl mx-auto">
              <CalendarWorkspace
                financialEvents={financialEvents}
                spendingDays={spendingDays}
                spendingInsights={spendingInsights}
                currencySymbol={user.currencySymbol}
                year={calendarYear}
                month={calendarMonth}
                onMonthChange={handleCalendarMonthChange}
              />
            </div>
          )}

          {/* TAB 5: ALERTS WORKSPACE */}
          {activeTab === "alerts" && (
            <div className="max-w-3xl mx-auto">
              <AlertsWorkspace
                alerts={alertsList}
                onMarkRead={handleMarkAlertRead}
                onMarkAllRead={handleMarkAllAlertsRead}
              />
            </div>
          )}

          {/* TAB 6: PROFILE & SETTINGS */}
          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <ProfileView
                userName={user.name}
                userEmail={user.email}
                personaId={user.personaId}
                currencyCode={user.currencyCode}
                subscriptionTier={user.subscriptionTier}
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
        goals={savingsGoals}
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
