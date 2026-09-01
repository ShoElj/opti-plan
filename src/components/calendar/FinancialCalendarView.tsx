"use client";

import React, { useState } from "react";
import { FinancialCalendarEvent } from "@/domain/types";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowDownLeft, ArrowUpRight, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialCalendarViewProps {
  events: FinancialCalendarEvent[];
  currencySymbol: string;
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

export const FinancialCalendarView: React.FC<FinancialCalendarViewProps> = ({
  events,
  currencySymbol,
  year,
  month,
  onMonthChange
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (month === 1) onMonthChange(year - 1, 12);
    else onMonthChange(year, month - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) onMonthChange(year + 1, 1);
    else onMonthChange(year, month + 1);
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events;

  const getEventIcon = (type: FinancialCalendarEvent["type"]) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
      case "bill":
      case "bill_payment":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "goal_contribution":
      case "savings":
        return <Target className="w-4 h-4 text-blue-500" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Month Header */}
      <AppCard level={2} className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">
              {monthNames[month - 1]} {year}
            </h3>
            <p className="text-xs text-muted-foreground">Financial events timeline</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </AppCard>

      {/* Date Filter Bar */}
      {selectedDate && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 text-xs">
          <span>Showing events for <strong>{selectedDate}</strong></span>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Show All Events
          </button>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-2">
        {selectedEvents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/40 text-xs text-muted-foreground">
            No financial events recorded for this period.
          </div>
        ) : (
          selectedEvents.map((evt) => (
            <AppCard key={evt.id} level={2} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted/60 shrink-0">
                  {getEventIcon(evt.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-foreground">{evt.label}</h4>
                    <StatusBadge variant={evt.isProjected ? "warning" : "success"}>
                      {evt.isProjected ? "Projected" : "Actual"}
                    </StatusBadge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {evt.date} {evt.category ? `• ${evt.category}` : ""}
                  </p>
                </div>
              </div>

              {evt.amount !== undefined && (
                <span className={`text-xs font-extrabold ${evt.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                  {evt.type === 'income' ? '+' : '-'}{currencySymbol}{(evt.amount / 100).toLocaleString()}
                </span>
              )}
            </AppCard>
          ))
        )}
      </div>
    </div>
  );
};
