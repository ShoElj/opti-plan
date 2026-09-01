import { createBrowserClient } from '@supabase/ssr';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SavingsGoal, MinorUnits } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class SavingsGoalService {
  constructor(private supabase: SupabaseClientType) {}

  static async createForServer() {
    const supabase = await createServerSupabaseClient();
    return new SavingsGoalService(supabase);
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
    return new SavingsGoalService(supabase);
  }

  private mapFromDb(row: Record<string, unknown>, savedAmount: MinorUnits = 0): SavingsGoal {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      targetAmount: Math.round(Number(row.target_amount) * 100),
      savedAmount,
      targetDate: (row.target_date as string) || undefined,
      status: row.status as "active" | "completed" | "archived",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    };
  }

  async create(input: Omit<SavingsGoal, "id" | "userId" | "savedAmount" | "createdAt" | "updatedAt">): Promise<SavingsGoal> {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    if (input.targetAmount <= 0) {
      throw new Error("Target amount must be greater than 0");
    }

    const row = {
      user_id: user.id,
      name: input.name,
      target_amount: input.targetAmount / 100,
      target_date: input.targetDate || null,
      status: input.status || 'active'
    };

    const { data, error } = await this.supabase
      .from('savings_goals')
      .insert(row as never)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data as Record<string, unknown>, 0);
  }

  async update(id: string, patch: Partial<Omit<SavingsGoal, "id" | "userId" | "createdAt">>): Promise<SavingsGoal> {
    const updateData: Record<string, unknown> = {};
    if (patch.name !== undefined) updateData.name = patch.name;
    if (patch.targetAmount !== undefined) {
      if (patch.targetAmount <= 0) throw new Error("Target amount must be greater than 0");
      updateData.target_amount = patch.targetAmount / 100;
    }
    if (patch.targetDate !== undefined) updateData.target_date = patch.targetDate || null;
    if (patch.status !== undefined) updateData.status = patch.status;

    const { data, error } = await this.supabase
      .from('savings_goals')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const savedAmount = await this.calculateSavedAmount(data.id);
    return this.mapFromDb(data as Record<string, unknown>, savedAmount);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async calculateSavedAmount(goalId: string): Promise<MinorUnits> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('amount_minor_units')
      .eq('goal_id', goalId)
      .eq('type', 'goal_contribution');

    if (error) throw error;
    if (!data) return 0;

    return data.reduce((sum, row) => sum + Number((row as Record<string, unknown>).amount_minor_units), 0);
  }

  async list(userId: string): Promise<SavingsGoal[]> {
    const { data: goals, error: goalsError } = await this.supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (goalsError) throw goalsError;
    if (!goals) return [];

    // Fetch all goal_contributions for this user's transactions
    const { data: txs, error: txsError } = await this.supabase
      .from('transactions')
      .select('goal_id, amount_minor_units')
      .eq('user_id', userId)
      .eq('type', 'goal_contribution')
      .not('goal_id', 'is', null);

    if (txsError) throw txsError;

    const savedMap = new Map<string, number>();
    if (txs) {
      for (const tx of txs) {
        const goalId = (tx as Record<string, unknown>).goal_id as string;
        const amount = Number((tx as Record<string, unknown>).amount_minor_units);
        savedMap.set(goalId, (savedMap.get(goalId) || 0) + amount);
      }
    }

    return (goals as Record<string, unknown>[]).map((g) => {
      const goalId = g.id as string;
      const savedAmount = savedMap.get(goalId) || 0;
      return this.mapFromDb(g, savedAmount);
    });
  }
}
