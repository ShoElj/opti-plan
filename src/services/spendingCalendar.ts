import { SpendingDay, MinorUnits } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export interface SpendingCalendarInsights {
  totalSpent: MinorUnits;
  activeSpendDaysCount: number;
  averageSpendPerActiveDay: MinorUnits;
  highestSpendDay: { date: string; amount: MinorUnits } | null;
  noSpendDaysCount: number;
}

export class SpendingCalendarService {
  constructor(private supabase: SupabaseClientType) {}

  private formatTimestampToLocalDate(utcTimestamp: string, timeZone: string): string {
    const date = new Date(utcTimestamp);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  }

  async getSpendingDaysForMonth(
    userId: string,
    year: number,
    month: number,
    userTimezone: string = 'Africa/Lagos'
  ): Promise<{ days: SpendingDay[]; insights: SpendingCalendarInsights }> {
    const monthStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEndStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    // Fetch actual expense transactions ONLY (type = 'expense')
    const { data: txs, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('occurred_at', `${monthStartStr}T00:00:00.000Z`)
      .lt('occurred_at', `${monthEndStr}T00:00:00.000Z`)
      .order('occurred_at', { ascending: true });

    if (error) throw error;

    const daysMap = new Map<string, SpendingDay>();

    if (txs) {
      for (const t of txs) {
        const localDate = this.formatTimestampToLocalDate(t.occurred_at, userTimezone);
        const amount = Number(t.amount_minor_units);

        const existing = daysMap.get(localDate) || {
          date: localDate,
          total: 0,
          transactions: []
        };

        existing.total += amount;
        existing.transactions.push({
          id: t.id,
          amount,
          category: t.category || 'General Expense',
          note: t.note || undefined,
          occurredAt: t.occurred_at
        });

        daysMap.set(localDate, existing);
      }
    }

    const days = Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate Insights
    const totalSpent: MinorUnits = days.reduce((sum, d) => sum + d.total, 0);
    const activeSpendDaysCount = days.length;
    const averageSpendPerActiveDay = activeSpendDaysCount > 0 ? Math.round(totalSpent / activeSpendDaysCount) : 0;

    let highestSpendDay: { date: string; amount: MinorUnits } | null = null;
    for (const d of days) {
      if (!highestSpendDay || d.total > highestSpendDay.amount) {
        highestSpendDay = { date: d.date, amount: d.total };
      }
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const noSpendDaysCount = Math.max(0, daysInMonth - activeSpendDaysCount);

    return {
      days,
      insights: {
        totalSpent,
        activeSpendDaysCount,
        averageSpendPerActiveDay,
        highestSpendDay,
        noSpendDaysCount
      }
    };
  }
}
