"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft, Target } from "lucide-react";
import { QuickAction } from "@/components/shared/QuickAction";

interface QuickActionsBarProps {
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onGoToPlan: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onOpenAddExpense,
  onOpenAddIncome,
  onGoToPlan
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      <QuickAction
        icon={ArrowUpRight}
        title="Add expense"
        description="Record money spent"
        iconBgColor="bg-slate-500/10"
        iconTextColor="text-slate-600 dark:text-slate-300"
        onClick={onOpenAddExpense}
      />
      <QuickAction
        icon={ArrowDownLeft}
        title="Add income"
        description="Record money received"
        iconBgColor="bg-emerald-500/10"
        iconTextColor="text-emerald-600 dark:text-emerald-400"
        onClick={onOpenAddIncome}
      />
      <QuickAction
        icon={Target}
        title="Check plan"
        description="See this month's progress"
        iconBgColor="bg-blue-500/10"
        iconTextColor="text-blue-600 dark:text-blue-400"
        onClick={onGoToPlan}
      />
    </div>
  );
};
