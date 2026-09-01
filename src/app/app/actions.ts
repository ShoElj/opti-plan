'use server';

import { TransactionService } from '@/services/transactions';
import { SavingsGoalService } from '@/services/savingsGoals';
import { BillService } from '@/services/bills';
import { SpendingPlanService } from '@/services/spendingPlan';
import { FinancialHealthService } from '@/services/financialHealth';
import { FinancialCalendarService } from '@/services/financialCalendar';
import { SpendingCalendarService } from '@/services/spendingCalendar';
import { SmartAlertsService } from '@/services/smartAlerts';
import { SupabaseMoneyDataProvider } from '@/services/moneyProvider';
import { MoneyCalculationEngine } from '@/domain/money/engine';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Transaction, SavingsGoal, TrackedBill, MinorUnits } from '@/domain/types';

export async function createTransactionAction(input: Omit<Transaction, "id" | "createdAt" | "userId">) {
  const service = await TransactionService.createForServer();
  return service.create(input);
}

export async function markBillPaidAction(billOccurrenceId: string, paidAmount?: MinorUnits) {
  const service = await BillService.createForServer();
  return service.markOccurrencePaid(billOccurrenceId, paidAmount);
}

export async function createSavingsGoalAction(input: Omit<SavingsGoal, "id" | "userId" | "savedAmount" | "createdAt" | "updatedAt">) {
  const service = await SavingsGoalService.createForServer();
  return service.create(input);
}

export async function updateSavingsGoalAction(id: string, patch: Partial<SavingsGoal>) {
  const service = await SavingsGoalService.createForServer();
  return service.update(id, patch);
}

export async function deleteSavingsGoalAction(id: string) {
  const service = await SavingsGoalService.createForServer();
  return service.delete(id);
}

export async function listSavingsGoalsAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = await SavingsGoalService.createForServer();
  return service.list(user.id);
}

export async function createBillAction(input: {
  name: string;
  expectedAmount: MinorUnits;
  frequency?: "weekly" | "biweekly" | "monthly" | "yearly" | "custom";
  dueDayOfMonth?: number;
  dueDate?: string;
  category?: string;
}) {
  const service = await BillService.createForServer();
  return service.createBill(input);
}

export async function updateBillAction(id: string, patch: Partial<TrackedBill>) {
  const service = await BillService.createForServer();
  return service.updateBill(id, patch);
}

export async function deleteBillAction(id: string) {
  const service = await BillService.createForServer();
  return service.deleteBill(id);
}

export async function listBillsAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = await BillService.createForServer();
  return service.listBills(user.id);
}

export async function listBillOccurrencesAction(periodStart?: string, periodEnd?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = await BillService.createForServer();
  return service.listOccurrences(user.id, periodStart, periodEnd);
}

export async function setSpendingPlanLimitAction(input: {
  periodStart: string;
  periodEnd: string;
  limitAmount: MinorUnits;
}) {
  const service = await SpendingPlanService.createForServer();
  return service.setLimitForPeriod(input);
}

export async function getSpendingPlanAction(periodStart: string, periodEnd: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = await SpendingPlanService.createForServer();
  const plan = await service.getForPeriod(user.id, periodStart, periodEnd);
  const progress = plan
    ? await service.calculateProgress(user.id, periodStart, periodEnd, plan.limitAmount)
    : null;

  return { plan, progress };
}

export async function getFinancialHealthAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = new FinancialHealthService(supabase);
  return service.calculateHealth(user.id);
}

export async function getFinancialCalendarAction(year: number, month: number, userTimezone: string = 'Africa/Lagos') {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = new FinancialCalendarService(supabase);
  return service.getEventsForMonth(user.id, year, month, userTimezone);
}

export async function getSpendingCalendarAction(year: number, month: number, userTimezone: string = 'Africa/Lagos') {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = new SpendingCalendarService(supabase);
  return service.getSpendingDaysForMonth(user.id, year, month, userTimezone);
}

export async function evaluateAndListSmartAlertsAction(userTimezone: string = 'Africa/Lagos') {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = new SmartAlertsService(supabase);
  await service.evaluateRules(user.id, userTimezone);
  return service.listAlerts(user.id);
}

export async function markAlertReadAction(alertId: string) {
  const supabase = await createServerSupabaseClient();
  const service = new SmartAlertsService(supabase);
  return service.markRead(alertId);
}

export async function markAllAlertsReadAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = new SmartAlertsService(supabase);
  return service.markAllRead(user.id);
}

export async function getDashboardDataAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const provider = new SupabaseMoneyDataProvider(supabase);
  const engine = new MoneyCalculationEngine(provider);
  
  const currentPeriod = await engine.getCurrentPeriod(user.id);
  const moneyLeftBreakdown = await engine.getMoneyLeft(user.id, currentPeriod);
  const upcomingBills = await engine.getUpcomingBillsProjection(user.id, currentPeriod);
  
  const service = await TransactionService.createForServer();
  const recentTransactions = await service.list({
    userId: user.id,
    period: currentPeriod,
    limit: 50
  });

  const goalService = await SavingsGoalService.createForServer();
  const savingsGoals = await goalService.list(user.id);

  const billService = await BillService.createForServer();
  const billOccurrences = await billService.listOccurrences(user.id, currentPeriod.start, currentPeriod.end);

  const spendingPlanService = await SpendingPlanService.createForServer();
  const spendingPlan = await spendingPlanService.getForPeriod(user.id, currentPeriod.start, currentPeriod.end);
  const spendingProgress = spendingPlan
    ? await spendingPlanService.calculateProgress(user.id, currentPeriod.start, currentPeriod.end, spendingPlan.limitAmount)
    : null;

  const healthService = new FinancialHealthService(supabase);
  const financialHealth = await healthService.calculateHealth(user.id);

  const alertsService = new SmartAlertsService(supabase);
  await alertsService.evaluateRules(user.id);
  const smartAlerts = await alertsService.listAlerts(user.id);

  const calendarService = new FinancialCalendarService(supabase);
  const now = new Date();
  const financialEvents = await calendarService.getEventsForMonth(user.id, now.getFullYear(), now.getMonth() + 1);

  const spendingCalendarService = new SpendingCalendarService(supabase);
  const { days: spendingDays, insights: spendingInsights } = await spendingCalendarService.getSpendingDaysForMonth(user.id, now.getFullYear(), now.getMonth() + 1);

  return {
    moneyLeftBreakdown,
    upcomingBills,
    recentTransactions: recentTransactions.transactions,
    currentPeriod,
    savingsGoals,
    billOccurrences,
    spendingPlan,
    spendingProgress,
    financialHealth,
    smartAlerts,
    financialEvents,
    spendingDays,
    spendingInsights
  };
}

