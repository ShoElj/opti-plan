"use client";

import React from "react";

interface StatItemProps {
  label: string;
  amount: number;
  currencySymbol: string;
  icon: React.ElementType;
  colorClass?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  label,
  amount,
  currencySymbol,
  icon: Icon,
  colorClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-card/40 border border-border/30 backdrop-blur-sm shadow-sm flex items-center space-x-3 transition-colors hover:bg-card/70">
      <div className={`p-2.5 rounded-xl ${colorClass} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="overflow-hidden min-w-0">
        <span className="text-[11px] font-medium text-muted-foreground block truncate">
          {label}
        </span>
        <span className="text-sm sm:text-base font-bold text-foreground tracking-tight block truncate">
          {currencySymbol}{amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
