"use client";

import React from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { BillItem } from "@/domain/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface UpcomingBillCardProps {
  bill: BillItem;
  currencySymbol: string;
  onMarkPaid: (billId: string) => void;
}

export const UpcomingBillCard: React.FC<UpcomingBillCardProps> = ({
  bill,
  currencySymbol,
  onMarkPaid
}) => {
  const isPaid = bill.status === "paid";

  return (
    <div className="space-y-2">
      <SectionHeader title="Upcoming payment" />

      <AppCard level={2} className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground leading-snug">{bill.name}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>Due {bill.dueDate} • {bill.category}</span>
              </p>
            </div>
          </div>

          <StatusBadge variant={isPaid ? "success" : "warning"}>
            {isPaid ? "Paid" : "Due in 2 days"}
          </StatusBadge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <span className="text-sm font-bold text-foreground">
            {currencySymbol}
            {bill.amount.toLocaleString()}
          </span>

          {!isPaid ? (
            <Button
              size="sm"
              onClick={() => onMarkPaid(bill.id)}
              className="h-8 px-3 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Mark paid
            </Button>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid</span>
            </span>
          )}
        </div>
      </AppCard>
    </div>
  );
};
