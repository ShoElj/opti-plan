import { createBrowserClient } from '@supabase/ssr';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TrackedBill, BillOccurrence, MinorUnits } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class BillService {
  constructor(private supabase: SupabaseClientType) {}

  static async createForServer() {
    const supabase = await createServerSupabaseClient();
    return new BillService(supabase);
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
    return new BillService(supabase);
  }

  private mapBillFromDb(row: Record<string, unknown>): TrackedBill {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      expectedAmount: Math.round(Number(row.expected_amount) * 100),
      frequency: row.frequency as "weekly" | "biweekly" | "monthly" | "yearly" | "custom",
      dueDayOfMonth: (row.due_day_of_month as number) || undefined,
      category: row.category as string,
      isActive: row.is_active as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    };
  }

  private mapOccurrenceFromDb(row: Record<string, unknown>): BillOccurrence {
    const parent = row.tracked_recurring_expenses as Record<string, unknown> | undefined;
    return {
      id: row.id as string,
      billId: row.bill_id as string,
      userId: row.user_id as string,
      dueDate: row.due_date as string,
      expectedAmount: Math.round(Number(row.expected_amount) * 100),
      status: row.status as "unpaid" | "paid" | "skipped" | "overdue",
      periodKey: (row.period_key as string) || undefined,
      name: (parent?.name as string) || (row.name as string) || "Bill Payment",
      category: (parent?.category as string) || (row.category as string) || "Utilities & Bills",
      createdAt: row.created_at as string
    };
  }

  async createBill(input: {
    name: string;
    expectedAmount: MinorUnits;
    frequency?: "weekly" | "biweekly" | "monthly" | "yearly" | "custom";
    dueDayOfMonth?: number;
    dueDate?: string;
    category?: string;
  }): Promise<{ bill: TrackedBill; initialOccurrence: BillOccurrence }> {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    if (input.expectedAmount <= 0) {
      throw new Error("Bill amount must be greater than 0");
    }

    const billRow = {
      user_id: user.id,
      name: input.name,
      expected_amount: input.expectedAmount / 100,
      frequency: input.frequency || 'monthly',
      due_day_of_month: input.dueDayOfMonth || 1,
      category: input.category || 'Utilities & Bills',
      is_active: true
    };

    const { data: bill, error: billError } = await this.supabase
      .from('tracked_recurring_expenses')
      .insert(billRow as never)
      .select()
      .single();

    if (billError) throw billError;

    // Create initial bill occurrence
    const dueDateStr = input.dueDate || new Date().toISOString().split('T')[0];
    const occurrenceRow = {
      bill_id: bill.id,
      user_id: user.id,
      due_date: dueDateStr,
      expected_amount: input.expectedAmount / 100,
      status: 'unpaid'
    };

    const { data: occ, error: occError } = await this.supabase
      .from('bill_occurrences')
      .insert(occurrenceRow as never)
      .select('*, tracked_recurring_expenses(*)')
      .single();

    if (occError) throw occError;

    return {
      bill: this.mapBillFromDb(bill as Record<string, unknown>),
      initialOccurrence: this.mapOccurrenceFromDb(occ as Record<string, unknown>)
    };
  }

  async updateBill(id: string, patch: Partial<Omit<TrackedBill, "id" | "userId" | "createdAt">>): Promise<TrackedBill> {
    const updateData: Record<string, unknown> = {};
    if (patch.name !== undefined) updateData.name = patch.name;
    if (patch.expectedAmount !== undefined) {
      if (patch.expectedAmount <= 0) throw new Error("Bill amount must be greater than 0");
      updateData.expected_amount = patch.expectedAmount / 100;
    }
    if (patch.frequency !== undefined) updateData.frequency = patch.frequency;
    if (patch.dueDayOfMonth !== undefined) updateData.due_day_of_month = patch.dueDayOfMonth;
    if (patch.category !== undefined) updateData.category = patch.category;
    if (patch.isActive !== undefined) updateData.is_active = patch.isActive;

    const { data, error } = await this.supabase
      .from('tracked_recurring_expenses')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapBillFromDb(data as Record<string, unknown>);
  }

  async deleteBill(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tracked_recurring_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async listBills(userId: string): Promise<TrackedBill[]> {
    const { data, error } = await this.supabase
      .from('tracked_recurring_expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Record<string, unknown>[]).map((b) => this.mapBillFromDb(b));
  }

  async listOccurrences(userId: string, periodStart?: string, periodEnd?: string): Promise<BillOccurrence[]> {
    let query = this.supabase
      .from('bill_occurrences')
      .select('*, tracked_recurring_expenses(*)')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (periodStart) query = query.gte('due_date', periodStart);
    if (periodEnd) query = query.lt('due_date', periodEnd);

    const { data, error } = await query;
    if (error) throw error;

    return (data as Record<string, unknown>[]).map((o) => this.mapOccurrenceFromDb(o));
  }

  async markOccurrencePaid(billOccurrenceId: string, paidAmount?: MinorUnits): Promise<{ occurrence: BillOccurrence; transactionId: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check existing bill_occurrence
    const { data: occ, error: occErr } = await this.supabase
      .from('bill_occurrences')
      .select('*, tracked_recurring_expenses(*)')
      .eq('id', billOccurrenceId)
      .single();

    if (occErr || !occ) throw new Error("Bill occurrence not found");

    const dbOcc = occ as Record<string, unknown>;

    // Ownership check
    if (dbOcc.user_id !== user.id) {
      throw new Error("Unauthorized");
    }

    // IDEMPOTENCY CHECK: If already paid, return existing payment link
    if (dbOcc.status === 'paid') {
      const { data: existingLink } = await this.supabase
        .from('bill_payment_links')
        .select('transaction_id')
        .eq('bill_occurrence_id', billOccurrenceId)
        .single();

      if (existingLink) {
        return {
          occurrence: this.mapOccurrenceFromDb(dbOcc),
          transactionId: existingLink.transaction_id
        };
      }
    }

    const amount = paidAmount ?? Math.round(Number(dbOcc.expected_amount) * 100);
    const parentName = (dbOcc.tracked_recurring_expenses as Record<string, unknown>)?.name as string || "Bill";
    const category = (dbOcc.tracked_recurring_expenses as Record<string, unknown>)?.category as string || "Utilities & Bills";

    // Create transaction via TransactionService pattern
    const txRow = {
      user_id: user.id,
      type: 'expense',
      flow_direction: 'outflow',
      amount_minor_units: amount,
      category,
      note: `Paid ${parentName}`,
      occurred_at: new Date().toISOString()
    };

    const { data: tx, error: txError } = await this.supabase
      .from('transactions')
      .insert(txRow as never)
      .select()
      .single();

    if (txError) throw txError;

    const txId = (tx as Record<string, unknown>).id as string;

    // Insert payment link
    const { error: linkError } = await this.supabase
      .from('bill_payment_links')
      .insert({
        bill_occurrence_id: billOccurrenceId,
        transaction_id: txId,
        user_id: user.id
      } as never);

    if (linkError) throw linkError;

    // Update status to paid
    const { data: updatedOcc, error: updateErr } = await this.supabase
      .from('bill_occurrences')
      .update({ status: 'paid' } as never)
      .eq('id', billOccurrenceId)
      .select('*, tracked_recurring_expenses(*)')
      .single();

    if (updateErr) throw updateErr;

    return {
      occurrence: this.mapOccurrenceFromDb(updatedOcc as Record<string, unknown>),
      transactionId: txId
    };
  }
}
