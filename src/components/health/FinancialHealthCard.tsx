"use client";

import React from "react";
import { FinancialHealth } from "@/domain/types";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Activity, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

interface FinancialHealthCardProps {
  health: FinancialHealth;
  currencySymbol: string;
}

export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({
  health,
  currencySymbol
}) => {
  const getBadgeVariant = () => {
    switch (health.status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "attention":
        return "danger";
      default:
        return "info";
    }
  };

  const getStatusIcon = () => {
    switch (health.status) {
      case "healthy":
        return <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600 dark:text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 mr-1 text-amber-600 dark:text-amber-400" />;
      case "attention":
        return <AlertCircle className="w-4 h-4 mr-1 text-rose-600 dark:text-rose-400" />;
    }
  };

  return (
    <AppCard level={2} className="space-y-4 border border-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Financial Health</h3>
            <p className="text-[11px] text-muted-foreground">{health.summary}</p>
          </div>
        </div>

        <StatusBadge variant={getBadgeVariant()}>
          <span className="flex items-center capitalize">
            {getStatusIcon()}
            <span>{health.status}</span>
          </span>
        </StatusBadge>
      </div>

      {/* Explanatory Reasons */}
      {health.reasons.length > 0 && (
        <div className="p-3 rounded-xl bg-muted/50 border border-border/30 space-y-1">
          {health.reasons.map((reason, idx) => (
            <p key={idx} className="text-xs text-foreground font-medium flex items-start">
              <span className="mr-1.5 text-emerald-500">•</span>
              <span>{reason}</span>
            </p>
          ))}
        </div>
      )}

      {/* Metric Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">Spending</span>
          <p className="font-bold text-foreground capitalize">
            {health.spending.status === "on_track" ? "On Track" : health.spending.status === "warning" ? "Near Limit" : "Over Plan"}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">Upcoming Bills</span>
          <p className="font-bold text-foreground">
            {currencySymbol}{(health.upcomingBills.total / 100).toLocaleString()}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">Savings Goals</span>
          <p className="font-bold text-foreground">
            {health.savings.goalsOnTrack} On Track
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/40 space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">Debt Payments</span>
          <p className="font-bold text-foreground">
            {currencySymbol}{(health.debt.total / 100).toLocaleString()}
          </p>
        </div>
      </div>
    </AppCard>
  );
};
