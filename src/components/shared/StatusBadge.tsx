"use client";

import React from "react";

export type BadgeVariant = "success" | "warning" | "info" | "neutral";

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = "neutral",
  children,
  className = ""
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    neutral: "border-border/40 bg-muted/60 text-muted-foreground"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
