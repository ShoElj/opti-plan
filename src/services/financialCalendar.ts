import { FinancialCalendarEvent } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class FinancialCalendarService {
  constructor(private supabase: SupabaseClientType) {}

  /**
   * Helper to format a UTC timestamp string into a local YYYY-MM-DD string according to the user's timezone.
   */
  private formatTimestampToLocalDate(utcTimestamp: string, timeZone: string): string {
    const date = new Date(utcTimestamp);
    // Use Intl.DateTimeFormat with timeZone to format as YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date); // Output format: YYYY-MM-DD
  }

  async getEventsForMonth(userId: string, year: number, month: number, userTimezone: string = 'Africa/Lagos'): Promise<FinancialCalendarEvent[]> {
    const events: FinancialCalendarEvent[] = [];

    // Calculate month range bounds in ISO strings
    const monthStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEndStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    // 1. Fetch Actual Transactions
    const { data: txs, error: txErr } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('occurred_at', `${monthStartStr}T00:00:00.000Z`)
      .lt('occurred_at', `${monthEndStr}T00:00:00.000Z`);

    if (!txErr && txs) {
      for (const t of txs) {
        const localDate = this.formatTimestampToLocalDate(t.occurred_at, userTimezone);
        let eventType: FinancialCalendarEvent['type'] = 'expense';
        if (t.type === 'income') eventType = 'income';
        else if (t.type === 'savings') eventType = 'savings';
        else if (t.type === 'goal_contribution') eventType = 'goal_contribution';
        else if (t.type === 'debt') eventType = 'debt';

        events.push({
          id: `tx-${t.id}`,
          date: localDate,
          type: eventType,
          isProjected: false,
          label: t.note || t.category || (t.type === 'income' ? 'Income Received' : 'Expense'),
          amount: Number(t.amount_minor_units),
          category: t.category || undefined,
          transactionId: t.id,
          goalId: t.goal_id || undefined
        });
      }
    }

    // 2. Fetch Bill Occurrences (both paid and unpaid)
    const { data: occs, error: occErr } = await this.supabase
      .from('bill_occurrences')
      .select('*, tracked_recurring_expenses(*)')
      .eq('user_id', userId)
      .gte('due_date', monthStartStr)
      .lt('due_date', monthEndStr);

    if (!occErr && occs) {
      for (const o of occs) {
        const isPaid = o.status === 'paid';
        const parentExp = o.tracked_recurring_expenses as { name?: string; category?: string } | null;
        const parentName = parentExp?.name || 'Bill';
        
        events.push({
          id: `bill-${o.id}`,
          date: o.due_date, // Date-only value kept intact per timezone policy
          type: isPaid ? 'bill_payment' : 'bill',
          isProjected: !isPaid,
          label: isPaid ? `Paid ${parentName}` : parentName,
          amount: Math.round(Number(o.expected_amount) * 100),
          category: parentExp?.category || 'Utilities & Bills',
          billOccurrenceId: o.id
        });
      }
    }

    // 3. Fetch Payday anchor dates
    const { data: payCycle } = await this.supabase
      .from('pay_cycles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (payCycle) {
      const anchorDay = payCycle.anchor_day_of_month;
      const paydayDateStr = `${year}-${String(month).padStart(2, '0')}-${String(Math.min(anchorDay, 28)).padStart(2, '0')}`;
      const nowLocalDate = this.formatTimestampToLocalDate(new Date().toISOString(), userTimezone);
      const isPast = paydayDateStr < nowLocalDate;

      events.push({
        id: `payday-${paydayDateStr}`,
        date: paydayDateStr,
        type: 'payday',
        isProjected: !isPast,
        label: 'Payday Cycle Anchor'
      });
    }

    // Sort by date ascending
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }
}
