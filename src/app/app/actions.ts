'use server';

import { TransactionService } from '@/services/transactions';
import { SupabaseMoneyDataProvider } from '@/services/moneyProvider';
import { MoneyCalculationEngine } from '@/domain/money/engine';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Transaction, MinorUnits } from '@/domain/types';

export async function createTransactionAction(input: Omit<Transaction, "id" | "createdAt" | "userId">) {
  const service = await TransactionService.createForServer();
  return service.create(input);
}

export async function markBillPaidAction(billOccurrenceId: string, paidAmount?: MinorUnits) {
  const service = await TransactionService.createForServer();
  return service.markBillPaid(billOccurrenceId, paidAmount);
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

  return {
    moneyLeftBreakdown,
    upcomingBills,
    recentTransactions: recentTransactions.transactions,
    currentPeriod
  };
}
