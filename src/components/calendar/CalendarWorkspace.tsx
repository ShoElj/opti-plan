"use client";

import React, { useState } from "react";
import { FinancialCalendarEvent, SpendingDay } from "@/domain/types";
import { SpendingCalendarInsights } from "@/services/spendingCalendar";
import { FinancialCalendarView } from "./FinancialCalendarView";
import { SpendingCalendarView } from "./SpendingCalendarView";
import { Calendar as CalendarIcon, PieChart } from "lucide-react";

interface CalendarWorkspaceProps {
  financialEvents: FinancialCalendarEvent[];
  spendingDays: SpendingDay[];
  spendingInsights: SpendingCalendarInsights;
  currencySymbol: string;
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

export const CalendarWorkspace: React.FC<CalendarWorkspaceProps> = ({
  financialEvents,
  spendingDays,
  spendingInsights,
  currencySymbol,
  year,
  month,
  onMonthChange
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"financial" | "spending">("financial");

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex bg-muted/60 p-1 rounded-xl border border-border/30 max-w-md">
        <button
          onClick={() => setActiveSubTab("financial")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === "financial"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Financial Calendar</span>
        </button>
        <button
          onClick={() => setActiveSubTab("spending")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === "spending"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Spending Calendar</span>
        </button>
      </div>

      {activeSubTab === "financial" ? (
        <FinancialCalendarView
          events={financialEvents}
          currencySymbol={currencySymbol}
          year={year}
          month={month}
          onMonthChange={onMonthChange}
        />
      ) : (
        <SpendingCalendarView
          days={spendingDays}
          insights={spendingInsights}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};
