import { MoneyDataProvider } from '@/domain/money/engine';
import { PayCycleConfig, Transaction, TransactionType } from '@/domain/types';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class SupabaseMoneyDataProvider implements MoneyDataProvider {
  constructor(private supabase: SupabaseClientType) {}

  private mapFromDb(row: Record<string, unknown>): Transaction {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      type: row.type as TransactionType,
      amount: Number(row.amount_minor_units),
      occurredAt: row.occurred_at as string,
      createdAt: row.created_at as string,
      goalId: row.goal_id as string | undefined,
      note: (row.note as string) || undefined,
      category: row.category as string
    };
  }

  async getPayCycleConfig(userId: string, date: string): Promise<PayCycleConfig | null> {
    const { data, error } = await this.supabase
      .from('pay_cycles')
      .select('*')
      .eq('user_id', userId)
      .lte('effective_from', date)
      .order('effective_from', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const dbData = data as Record<string, unknown>;
    return {
      userId: dbData.user_id as string,
      anchorDayOfMonth: dbData.anchor_day_of_month as number,
      effectiveFrom: dbData.effective_from as string
    };
  }

  async getTransactions(userId: string, periodStart: string, periodEnd: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('occurred_at', periodStart)
      .lt('occurred_at', periodEnd);

    if (error) throw error;
    return (data as Record<string, unknown>[]).map((row) => this.mapFromDb(row));
  }

  async getUnpaidBills(userId: string, periodStart: string, periodEnd: string) {
    const { data, error } = await this.supabase
      .from('bill_occurrences')
      .select('*, tracked_recurring_expenses(*)')
      .eq('user_id', userId)
      .eq('status', 'unpaid')
      .gte('due_date', periodStart)
      .lt('due_date', periodEnd);

    if (error) throw error;

    return (data as Record<string, unknown>[]).map((b) => ({
      id: b.id as string,
      label: (b.tracked_recurring_expenses as Record<string, unknown>)?.name as string,
      dueDate: b.due_date as string,
      amount: Number(b.expected_amount)
    }));
  }
}
