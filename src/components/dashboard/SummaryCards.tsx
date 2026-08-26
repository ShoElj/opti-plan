"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, CreditCard } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatItem } from "@/components/shared/StatItem";

interface SummaryCardsProps {
  currencySymbol: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  currencySymbol,
  totalIncome,
  totalExpenses,
  totalSavings,
  totalDebt
}) => {
  return (
    <div className="space-y-2">
      <SectionHeader title="Monthly overview" />

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Money In"
          amount={totalIncome}
          currencySymbol={currencySymbol}
          icon={ArrowDownLeft}
          colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatItem
          label="Money Out"
          amount={totalExpenses}
          currencySymbol={currencySymbol}
          icon={ArrowUpRight}
          colorClass="bg-slate-500/10 text-slate-600 dark:text-slate-300"
        />
        <StatItem
          label="Saved"
          amount={totalSavings}
          currencySymbol={currencySymbol}
          icon={PiggyBank}
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatItem
          label="Debt Paid"
          amount={totalDebt}
          currencySymbol={currencySymbol}
          icon={CreditCard}
          colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>
    </div>
  );
};
