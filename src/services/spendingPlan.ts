import { createBrowserClient } from '@supabase/ssr';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SpendingPlan, MinorUnits, CurrencyCode } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class SpendingPlanService {
  constructor(private supabase: SupabaseClientType) {}

  static async createForServer() {
    const supabase = await createServerSupabaseClient();
    return new SpendingPlanService(supabase);
  }

  static createForBrowser() {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    };
    const supabase = createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );
    return new SpendingPlanService(supabase);
  }

  private mapFromDb(row: Record<string, unknown>, periodStart: string, periodEnd: string): SpendingPlan {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      periodStart,
      periodEnd,
      limitAmount: Math.round(Number(row.spending_limit) * 100),
      currencyCode: row.currency_code as CurrencyCode,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    };
  }

  async setLimitForPeriod(input: {
    periodStart: string;
    periodEnd: string;
    limitAmount: MinorUnits;
    currencyCode?: CurrencyCode;
  }): Promise<SpendingPlan> {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    if (input.limitAmount <= 0) {
      throw new Error("Spending plan limit must be greater than 0");
    }

    const periodKey = input.periodStart.substring(0, 7);

    const row = {
      user_id: user.id,
      period_key: periodKey,
      spending_limit: input.limitAmount / 100,
      currency_code: input.currencyCode || 'NGN'
    };

    const { data, error } = await this.supabase
      .from('monthly_spending_plans')
      .upsert(row as never, { onConflict: 'user_id,period_key' })
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data as Record<string, unknown>, input.periodStart, input.periodEnd);
  }

  async getForPeriod(userId: string, periodStart: string, periodEnd: string): Promise<SpendingPlan | null> {
    const periodKey = periodStart.substring(0, 7);

    const { data, error } = await this.supabase
      .from('monthly_spending_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('period_key', periodKey)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return this.mapFromDb(data as Record<string, unknown>, periodStart, periodEnd);
  }

  async calculateProgress(userId: string, periodStart: string, periodEnd: string, limitAmount: MinorUnits) {
    // Normal Expenses ONLY (type = 'expense') per user decision
    const { data: txs, error } = await this.supabase
      .from('transactions')
      .select('amount_minor_units')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('occurred_at', periodStart)
      .lt('occurred_at', periodEnd);

    if (error) throw error;

    const totalSpent = (txs || []).reduce((sum, row) => sum + Number((row as Record<string, unknown>).amount_minor_units), 0);
    const remaining = limitAmount - totalSpent;
    const percentage = limitAmount > 0 ? Math.round((totalSpent / limitAmount) * 100) : 0;

    return {
      totalSpent,
      remaining,
      percentage,
      limitAmount
    };
  }
}
