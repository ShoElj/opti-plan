"use client";

import React from "react";
import { Wallet, Sparkles } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { Progress } from "@/components/ui/progress";

interface MoneyLeftHeroProps {
  userName: string;
  moneyLeft: number;
  currencySymbol: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
  spendingLimit?: number;
}

export const MoneyLeftHero: React.FC<MoneyLeftHeroProps> = ({
  userName,
  moneyLeft,
  currencySymbol,
  totalExpenses,
  spendingLimit = 200000
}) => {
  const isNegative = moneyLeft < 0;
  const planRemaining = Math.max(0, spendingLimit - totalExpenses);
  const formattedAmount = Math.abs(moneyLeft).toLocaleString();

  // FIND-1C-02: Dynamic responsive font size scaling for large monetary values (e.g. ₦125,000,000)
  const getResponsiveFontClass = (len: number) => {
    if (len >= 12) return "text-2xl sm:text-3xl md:text-4xl"; // ₦125,000,000 (11+ chars)
    if (len >= 9) return "text-3xl sm:text-4xl md:text-5xl";  // ₦12,450,000 (9-11 chars)
    return "text-4xl sm:text-5xl";                           // ₦170,000 (<9 chars)
  };

  return (
    <div className="space-y-3">
      {/* Personal Greeting Context Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Good day, {userName.split(" ")[0]}
            </h2>
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Here is your August money overview
          </p>
        </div>
      </div>

      {/* Surface Level 1   Money Left Hero (rounded-[28px]) */}
      <AppCard level={1} animate={true}>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-white/15 text-white">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/90">
              Money Left
            </span>
          </div>
          <span className="text-[11px] px-3 py-0.5 rounded-full bg-white/15 text-emerald-50 font-medium border border-white/20">
            August 2026
          </span>
        </div>

        {/* Primary Monetary Number Display with Responsive Font Scaling */}
        <div className="my-1 relative z-10 overflow-hidden">
          <div className="flex items-baseline space-x-1 min-w-0 flex-wrap">
            <span 
              className="text-2xl sm:text-3xl font-semibold text-emerald-200 shrink-0"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontFeatureSettings: 'normal' }}
            >
              {currencySymbol}
            </span>
            <span
              className={`font-extrabold tracking-tight break-all overflow-wrap-anywhere ${isNegative ? "text-amber-300" : "text-white"
                } ${getResponsiveFontClass(formattedAmount.length)}`}
            >
              {formattedAmount}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15">
            <div className="flex flex-wrap items-center justify-between text-xs text-emerald-100/90 font-medium gap-1 mb-2">
              <span>{isNegative ? "Spending exceeds logged income" : "Monthly spending plan"}</span>
              <span className="font-semibold text-white">
                {currencySymbol}{planRemaining.toLocaleString()} remaining
              </span>
            </div>
            <Progress 
              value={Math.min(100, (totalExpenses / spendingLimit) * 100)} 
              className="h-2 bg-black/20 [&>div]:bg-white" 
            />
          </div>
        </div>
      </AppCard>
    </div>
  );
};
