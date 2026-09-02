import { SmartAlert, MinorUnits } from '@/domain/types';
import { MoneyCalculationEngine } from '@/domain/money/engine';
import { SupabaseMoneyDataProvider } from '@/services/moneyProvider';
import { SpendingPlanService } from '@/services/spendingPlan';
import { BillService } from '@/services/bills';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class SmartAlertsService {
  constructor(private supabase: SupabaseClientType) {}

  private mapFromDb(row: Record<string, unknown>): SmartAlert {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      type: row.type as SmartAlert['type'],
      severity: row.severity as SmartAlert['severity'],
      title: row.title as string,
      message: row.message as string,
      createdAt: row.created_at as string,
      readAt: (row.read_at as string) || undefined,
      transactionId: (row.entity_id as string)?.startsWith('tx-') ? (row.entity_id as string).replace('tx-', '') : undefined,
      billOccurrenceId: (row.entity_id as string)?.startsWith('bill-') ? (row.entity_id as string).replace('bill-', '') : undefined
    };
  }

  /**
   * Evaluates deterministic alert rules for user and persists new alerts with strict deduplication.
   */
  async evaluateRules(userId: string, _userTimezone: string = 'Africa/Lagos'): Promise<void> {
    const provider = new SupabaseMoneyDataProvider(this.supabase);
    const engine = new MoneyCalculationEngine(provider);

    const currentPeriod = await engine.getCurrentPeriod(userId);
    const breakdown = await engine.getMoneyLeft(userId, currentPeriod);

    const alertsToUpsert: {
      user_id: string;
      type: SmartAlert['type'];
      severity: SmartAlert['severity'];
      title: string;
      message: string;
      entity_id: string;
    }[] = [];

    // RULE 1 — UPCOMING BILL ALERTS
    const billService = new BillService(this.supabase);
    const unpaidOccs = await billService.listOccurrences(userId, currentPeriod.start, currentPeriod.end);
    const unpaid = unpaidOccs.filter((b: { status: string }) => b.status === 'unpaid');
    const todayStr = new Date().toISOString().split('T')[0];

    for (const b of unpaid) {
      if (b.dueDate === todayStr) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'bill_due',
          severity: 'critical',
          title: 'Bill Due Today',
          message: `${b.name} (${(b.expectedAmount / 100).toLocaleString()}) is due today.`,
          entity_id: `bill-due-today-${b.id}`
        });
      } else if (b.dueDate > todayStr) {
        const diffMs = new Date(b.dueDate).getTime() - new Date(todayStr).getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays > 0) {
          alertsToUpsert.push({
            user_id: userId,
            type: 'bill_due',
            severity: 'warning',
            title: 'Bill Due Soon',
            message: `${b.name} (${(b.expectedAmount / 100).toLocaleString()}) is due in ${diffDays} day(s).`,
            entity_id: `bill-due-${b.id}`
          });
        }
      }
    }

    // RULE 2 — SPENDING PLAN ALERTS
    const planService = new SpendingPlanService(this.supabase);
    const plan = await planService.getForPeriod(userId, currentPeriod.start, currentPeriod.end);
    if (plan) {
      const progress = await planService.calculateProgress(userId, currentPeriod.start, currentPeriod.end, plan.limitAmount);
      if (progress.percentage >= 100) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'spending_plan',
          severity: 'critical',
          title: 'Spending Plan Limit Exceeded',
          message: `You've used ${progress.percentage}% of your spending plan limit.`,
          entity_id: `plan-limit-100-${currentPeriod.start}`
        });
      } else if (progress.percentage >= 80) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'spending_plan',
          severity: 'warning',
          title: 'Spending Plan Limit Approaching',
          message: `You've used ${progress.percentage}% of your spending plan limit.`,
          entity_id: `plan-limit-80-${currentPeriod.start}`
        });
      }
    }

    // RULE 3 — MONEY LEFT ALERTS (Evaluate only if hasIncomeLogged = true)
    if (breakdown.hasIncomeLogged) {
      if (breakdown.moneyLeft < 0) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'money_left',
          severity: 'critical',
          title: 'Money Left Deficit',
          message: `Your Money Left is in deficit for this pay cycle.`,
          entity_id: `ml-deficit-${currentPeriod.start}`
        });
      } else if (breakdown.income > 0) {
        const mlPct = (breakdown.moneyLeft / breakdown.income) * 100;
        if (mlPct < 10) {
          alertsToUpsert.push({
            user_id: userId,
            type: 'money_left',
            severity: 'critical',
            title: 'Money Left Very Low',
            message: `Money Left has fallen below 10% of your income.`,
            entity_id: `ml-10-${currentPeriod.start}`
          });
        } else if (mlPct < 25) {
          alertsToUpsert.push({
            user_id: userId,
            type: 'money_left',
            severity: 'warning',
            title: 'Money Left Low',
            message: `Money Left has fallen below 25% of your income.`,
            entity_id: `ml-25-${currentPeriod.start}`
          });
        }
      }
    }

    // RULE 4 — UPCOMING COMMITMENTS ALERTS
    const totalUnpaid: MinorUnits = unpaid.reduce((sum: number, b: { expectedAmount: number }) => sum + b.expectedAmount, 0);
    if (breakdown.moneyLeft > 0) {
      if (totalUnpaid > breakdown.moneyLeft) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'money_left',
          severity: 'critical',
          title: 'Commitments Exceed Money Left',
          message: `Upcoming unpaid bills exceed your remaining Money Left.`,
          entity_id: `commit-exceed-${currentPeriod.start}`
        });
      } else if (totalUnpaid >= breakdown.moneyLeft * 0.5) {
        alertsToUpsert.push({
          user_id: userId,
          type: 'money_left',
          severity: 'warning',
          title: 'High Upcoming Commitments',
          message: `Upcoming unpaid bills account for 50%+ of your remaining Money Left.`,
          entity_id: `commit-50-${currentPeriod.start}`
        });
      }
    }

    // Upsert Alerts for Deduplication
    try {
      for (const item of alertsToUpsert) {
        const { data: existing, error } = await this.supabase
          .from('smart_alerts')
          .select('id')
          .eq('user_id', userId)
          .eq('type', item.type)
          .eq('entity_id', item.entity_id)
          .maybeSingle();

        if (error && error.code === 'PGRST205') break; // Table not deployed to DB yet

        if (!existing) {
          await this.supabase.from('smart_alerts').insert(item as never);
        }
      }
    } catch {
      // Graceful fallback if table is not deployed
    }
  }

  async listAlerts(userId: string): Promise<SmartAlert[]> {
    const { data, error } = await this.supabase
      .from('smart_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return []; // Fallback for pending remote table migration
      throw error;
    }
    return (data || []).map((row) => this.mapFromDb(row as Record<string, unknown>));
  }

  async markRead(alertId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await this.supabase
      .from('smart_alerts')
      .update({ read_at: new Date().toISOString() } as never)
      .eq('id', alertId)
      .eq('user_id', user.id);

    if (error && error.code !== 'PGRST205') throw error;
  }

  async markAllRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('smart_alerts')
      .update({ read_at: new Date().toISOString() } as never)
      .eq('user_id', userId)
      .is('read_at', null);

    if (error && error.code !== 'PGRST205') throw error;
  }
}
