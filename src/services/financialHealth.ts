import { MoneyCalculationEngine } from '@/domain/money/engine';
import { SupabaseMoneyDataProvider } from '@/services/moneyProvider';
import { SpendingPlanService } from '@/services/spendingPlan';
import { SavingsGoalService } from '@/services/savingsGoals';
import { BillService } from '@/services/bills';
import { FinancialHealth, MinorUnits } from '@/domain/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type SupabaseClientType = SupabaseClient<Database>;

export class FinancialHealthService {
  constructor(private supabase: SupabaseClientType) {}

  async calculateHealth(userId: string): Promise<FinancialHealth> {
    const provider = new SupabaseMoneyDataProvider(this.supabase);
    const engine = new MoneyCalculationEngine(provider);

    const currentPeriod = await engine.getCurrentPeriod(userId);
    const breakdown = await engine.getMoneyLeft(userId, currentPeriod);

    // Spending Plan
    const spendingPlanService = new SpendingPlanService(this.supabase);
    const spendingPlan = await spendingPlanService.getForPeriod(userId, currentPeriod.start, currentPeriod.end);
    let spendingProgress = null;
    if (spendingPlan) {
      spendingProgress = await spendingPlanService.calculateProgress(userId, currentPeriod.start, currentPeriod.end, spendingPlan.limitAmount);
    }

    // Upcoming Unpaid Bills
    const billService = new BillService(this.supabase);
    const unpaidOccurrences = await billService.listOccurrences(userId, currentPeriod.start, currentPeriod.end);
    const upcomingUnpaidBills = unpaidOccurrences.filter((o) => o.status === 'unpaid');
    const upcomingTotal: MinorUnits = upcomingUnpaidBills.reduce((sum, b) => sum + b.expectedAmount, 0);

    // Savings Goals
    const goalService = new SavingsGoalService(this.supabase);
    const goals = await goalService.list(userId);
    let goalsOnTrack = 0;
    let goalsNeedingAttention = 0;

    for (const g of goals) {
      const pct = g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0;
      if (pct >= 50 || g.savedAmount >= g.targetAmount) {
        goalsOnTrack++;
      } else {
        goalsNeedingAttention++;
      }
    }

    // Evaluate Deterministic Rules (ATTENTION > WARNING > HEALTHY)
    const reasons: string[] = [];
    let healthStatus: "healthy" | "warning" | "attention" = "healthy";

    const moneyLeft = breakdown.moneyLeft;
    const spentAmount = breakdown.expenses;
    const planLimit = spendingPlan ? spendingPlan.limitAmount : undefined;

    // Spending Status
    let spendingStatus: "on_track" | "warning" | "over" = "on_track";
    if (spendingProgress && planLimit) {
      if (spendingProgress.percentage >= 100) {
        spendingStatus = "over";
      } else if (spendingProgress.percentage >= 80) {
        spendingStatus = "warning";
      }
    }

    // Rule Evaluations
    if (moneyLeft < 0) {
      healthStatus = "attention";
      reasons.push("Your Money Left is in deficit for this pay cycle.");
    } else if (upcomingTotal > moneyLeft) {
      healthStatus = "attention";
      reasons.push(`Upcoming unpaid bills (${(upcomingTotal / 100).toLocaleString()}) exceed your remaining Money Left (${(moneyLeft / 100).toLocaleString()}).`);
    }

    if (healthStatus !== "attention") {
      if (spendingProgress && spendingProgress.percentage >= 100) {
        healthStatus = "attention";
        reasons.push("You have exceeded your monthly spending plan limit.");
      } else if (spendingProgress && spendingProgress.percentage >= 80) {
        healthStatus = "warning";
        reasons.push(`Your spending has reached ${spendingProgress.percentage}% of your spending plan limit.`);
      }

      if (moneyLeft > 0 && upcomingTotal >= moneyLeft * 0.5 && upcomingTotal <= moneyLeft) {
        if (healthStatus !== "attention") healthStatus = "warning";
        reasons.push("Upcoming bills account for over 50% of your remaining Money Left.");
      }
    }

    if (healthStatus === "healthy" && reasons.length === 0) {
      reasons.push("You're currently on track for this pay cycle.");
    }

    const summary = healthStatus === "healthy"
      ? "You're on track this cycle."
      : healthStatus === "warning"
      ? "Your spending or commitments require attention."
      : "Your current commitments exceed remaining money.";

    return {
      status: healthStatus,
      moneyLeft,
      summary,
      reasons,
      spending: {
        spent: spentAmount,
        limit: planLimit,
        remaining: planLimit ? planLimit - spentAmount : undefined,
        status: spendingStatus
      },
      upcomingBills: {
        total: upcomingTotal,
        count: upcomingUnpaidBills.length
      },
      savings: {
        goalsOnTrack,
        goalsNeedingAttention
      },
      debt: {
        total: breakdown.debt
      }
    };
  }
}
