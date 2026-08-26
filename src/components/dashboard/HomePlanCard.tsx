"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Target, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";

interface HomePlanCardProps {
  overallLimit: number;
  totalSpent: number;
  currencySymbol: string;
  onGoToPlan: () => void;
}

export const HomePlanCard: React.FC<HomePlanCardProps> = ({
  overallLimit,
  totalSpent,
  currencySymbol,
  onGoToPlan
}) => {
  const remaining = Math.max(0, overallLimit - totalSpent);
  const spendPercent = Math.min(100, Math.round((totalSpent / overallLimit) * 100));

  return (
    <div className="space-y-2">
      <SectionHeader
        title="Monthly spending plan"
        action={
          <button
            onClick={onGoToPlan}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center cursor-pointer"
          >
            <span>View plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      <AppCard level={2} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {currencySymbol}{totalSpent.toLocaleString()} spent of {currencySymbol}{overallLimit.toLocaleString()} limit
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">
                {currencySymbol}{remaining.toLocaleString()} remaining
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            {spendPercent}% used
          </span>
        </div>

        <Progress value={spendPercent} />
      </AppCard>
    </div>
  );
};
