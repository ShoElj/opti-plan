import { createBrowserClient } from '@supabase/ssr';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Transaction, TransactionType, MinorUnits, MoneyPeriod } from '@/domain/types';
import { validateGoalInvariant } from '@/domain/transactions/invariant';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// For brevity in client/server context handling
type SupabaseClientType = SupabaseClient<Database>;

export class TransactionService {
  private constructor(private supabase: SupabaseClientType) {}

  static async createForServer() {
    const supabase = await createServerSupabaseClient();
    return new TransactionService(supabase);
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
    return new TransactionService(supabase);
  }

  private mapFromDb(row: Record<string, unknown>): Transaction {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      type: row.type as TransactionType,
      amount: Number(row.amount_minor_units),
      occurredAt: row.occurred_at as string,
      createdAt: row.created_at as string,
      goalId: row.goal_id as string | undefined,
      // recurringExpenseId: handled by bill_payment_links in a more complex setup, left empty here per simple spec
      note: (row.note as string) || undefined,
      category: row.category as string
    };
  }

  async create(input: Omit<Transaction, "id" | "createdAt" | "userId">): Promise<Transaction> {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    validateGoalInvariant(input.type, input.goalId);

    const row = {
      user_id: user.id,
      type: input.type,
      flow_direction: input.type === 'income' || input.type === 'transfer' ? 'inflow' : 'outflow',
      amount_minor_units: input.amount,
      occurred_at: input.occurredAt,
      goal_id: input.goalId || null,
      note: input.note,
      category: input.category || 'Uncategorized'
    };

    const { data, error } = await this.supabase
      .from('transactions')
      .insert(row as never)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  }

  async update(id: string, patch: Partial<Omit<Transaction, "id" | "userId" | "createdAt">>): Promise<Transaction> {
    const updateData: Record<string, unknown> = {};
    if (patch.type) {
      updateData.type = patch.type;
      updateData.flow_direction = patch.type === 'income' || patch.type === 'transfer' ? 'inflow' : 'outflow';
    }
    if (patch.amount !== undefined) updateData.amount_minor_units = patch.amount;
    if (patch.occurredAt) updateData.occurred_at = patch.occurredAt;
    if (patch.goalId !== undefined) updateData.goal_id = patch.goalId || null;
    
    // We only perform the full domain invariant validation if we are setting type/goalId, 
    // but without full object hydration, a partial patch validation might be tricky.
    // However, if we change type or goalId, we should at least check what we are patching.
    if (patch.type && patch.type === "goal_contribution" && !patch.goalId && patch.goalId !== undefined) {
       validateGoalInvariant(patch.type, patch.goalId);
    }
    if (patch.type && patch.type === "savings" && patch.goalId) {
       validateGoalInvariant(patch.type, patch.goalId);
    }

    if (patch.note !== undefined) updateData.note = patch.note;
    if (patch.category !== undefined) updateData.category = patch.category;

    const { data, error } = await this.supabase
      .from('transactions')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async list(params: {
    userId: string;
    period?: MoneyPeriod;
    types?: TransactionType[];
    search?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; nextCursor?: string }> {
    let query = this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', params.userId)
      .order('occurred_at', { ascending: false });

    if (params.period) {
      query = query.gte('occurred_at', params.period.start).lt('occurred_at', params.period.end);
    }

    if (params.types && params.types.length > 0) {
      query = query.in('type', params.types);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      transactions: data.map((row: Record<string, unknown>) => this.mapFromDb(row)),
      // Naive cursor for now
      nextCursor: undefined
    };
  }

  async markBillPaid(billOccurrenceId: string, paidAmount?: MinorUnits): Promise<Transaction> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // First fetch the bill occurrence
    const { data: billOcc, error: billError } = await this.supabase
      .from('bill_occurrences')
      .select('*, tracked_recurring_expenses(*)')
      .eq('id', billOccurrenceId)
      .single();

    if (billError || !billOcc) throw new Error("Bill not found");
    const dbBill = billOcc as Record<string, unknown>;
    const amount = paidAmount ?? Number(dbBill.expected_amount);

    // Create the transaction
    const txRow = {
      user_id: user.id,
      type: 'expense',
      flow_direction: 'outflow',
      amount_minor_units: amount,
      category: (dbBill.tracked_recurring_expenses as Record<string, unknown>)?.category as string,
      note: `Paid ${(dbBill.tracked_recurring_expenses as Record<string, unknown>)?.name as string}`,
      occurred_at: new Date().toISOString()
    };

    const { data: tx, error: txError } = await this.supabase
      .from('transactions')
      .insert(txRow as never)
      .select()
      .single();

    if (txError) throw txError;

    // Link it via bill_payment_links
    const { error: linkError } = await this.supabase
      .from('bill_payment_links')
      .insert({
        bill_occurrence_id: billOccurrenceId,
        transaction_id: (tx as Record<string, unknown>).id,
        user_id: user.id
      } as never);

    if (linkError) throw linkError;

    // Update bill occurrence status
    await this.supabase
      .from('bill_occurrences')
      .update({ status: 'paid' } as never)
      .eq('id', billOccurrenceId);

    return this.mapFromDb(tx as Record<string, unknown>);
  }
}
