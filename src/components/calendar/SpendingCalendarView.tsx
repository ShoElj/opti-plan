"use client";

import React from "react";
import { SpendingDay } from "@/domain/types";
import { SpendingCalendarInsights } from "@/services/spendingCalendar";
import { AppCard } from "@/components/shared/AppCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Flame, PieChart, CalendarCheck } from "lucide-react";

interface SpendingCalendarViewProps {
  days: SpendingDay[];
  insights: SpendingCalendarInsights;
  currencySymbol: string;
}

export const SpendingCalendarView: React.FC<SpendingCalendarViewProps> = ({
  days,
  insights,
  currencySymbol
}) => {
  return (
    <div className="space-y-4">
      {/* Insights Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <AppCard level={2} className="p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-muted-foreground font-medium">
            <PieChart className="w-3.5 h-3.5 text-emerald-500" />
            <span>Total Spent</span>
          </div>
          <p className="text-base font-extrabold text-foreground">
            {currencySymbol}{(insights.totalSpent / 100).toLocaleString()}
          </p>
        </AppCard>

        <AppCard level={2} className="p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-muted-foreground font-medium">
            <span>Daily Average</span>
          </div>
          <p className="text-base font-extrabold text-foreground">
            {currencySymbol}{(insights.averageSpendPerActiveDay / 100).toLocaleString()}
          </p>
        </AppCard>

        <AppCard level={2} className="p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-muted-foreground font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Highest Spend Day</span>
          </div>
          <p className="text-base font-extrabold text-foreground">
            {insights.highestSpendDay ? `${currencySymbol}${(insights.highestSpendDay.amount / 100).toLocaleString()}` : "N/A"}
          </p>
        </AppCard>

        <AppCard level={2} className="p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-muted-foreground font-medium">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>No-Spend Days</span>
          </div>
          <p className="text-base font-extrabold text-foreground">
            {insights.noSpendDaysCount} Days
          </p>
        </AppCard>
      </div>

      {/* Daily Spending Breakdown */}
      <SectionHeader title="Daily Spending Breakdown" subtitle="Actual expense transactions aggregated by date" />

      {days.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-card border border-border/40 text-xs text-muted-foreground">
          No spending transactions recorded for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day) => (
            <AppCard key={day.date} level={2} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <span className="text-xs font-bold text-foreground">{day.date}</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {currencySymbol}{(day.total / 100).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                {day.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{tx.category}</span>
                      {tx.note && <span className="text-muted-foreground ml-2">({tx.note})</span>}
                    </div>
                    <span className="font-medium text-foreground">
                      {currencySymbol}{(tx.amount / 100).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </AppCard>
          ))}
        </div>
      )}
    </div>
  );
};
