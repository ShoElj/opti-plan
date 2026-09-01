"use client";

import React, { useState } from "react";
import { Target, PiggyBank, Clock, Edit2 } from "lucide-react";
import { SavingsGoal, BillItem } from "@/domain/types";
import { GoalsSection } from "./GoalsSection";
import { BillsSection } from "./BillsSection";
import { AppCard } from "@/components/shared/AppCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface PlanWorkspaceProps {
  overallLimit: number;
  categoryBudgets: { category: string; plannedLimit: number; actualSpent: number }[];
  goals: SavingsGoal[];
  bills: BillItem[];
  currencySymbol: string;
  onUpdateOverallLimit: (newLimit: number) => void;
  onCreateGoal: (goal: Omit<SavingsGoal, "id" | "savedAmount" | "status">) => void;
  onAddGoalContribution: (goalId: string, amount: number) => void;
  onCreateBill: (bill: Omit<BillItem, "id" | "status">) => void;
  onMarkBillPaid: (billId: string) => void;
}

export const PlanWorkspace: React.FC<PlanWorkspaceProps> = ({
  overallLimit,
  categoryBudgets,
  goals,
  bills,
  currencySymbol,
  onUpdateOverallLimit,
  onCreateGoal,
  onAddGoalContribution,
  onCreateBill,
  onMarkBillPaid
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"spending" | "goals" | "bills">("spending");
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState(overallLimit.toString());

  const totalSpent = categoryBudgets.reduce((acc, c) => acc + c.actualSpent, 0);
  const remaining = Math.max(0, overallLimit - totalSpent);
  const spendPercent = Math.min(100, Math.round((totalSpent / overallLimit) * 100));

  const handleLimitSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempLimit);
    if (isNaN(val) || val <= 0) return;
    onUpdateOverallLimit(val);
    setIsEditingLimit(false);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Your plan</h2>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          Monthly spending limit, savings targets, and recurring bills
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex bg-muted/60 p-1 rounded-xl border border-border/30">
        <button
          onClick={() => setActiveSubTab("spending")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === "spending"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Spending plan</span>
        </button>
        <button
          onClick={() => setActiveSubTab("goals")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === "goals"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Savings goals</span>
        </button>
        <button
          onClick={() => setActiveSubTab("bills")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === "bills"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bills tracker</span>
        </button>
      </div>

      {/* Sub-tab 1: Spending Plan Baseline */}
      {activeSubTab === "spending" && (
        <div className="space-y-4">
          <AppCard level={2} className="space-y-4">
            <SectionHeader
              title="Monthly spending plan"
              action={
                <button
                  onClick={() => setIsEditingLimit(true)}
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-colors touch-target flex items-center justify-center cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              }
            />

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {currencySymbol}
                {overallLimit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Total monthly limit
              </p>
            </div>

            {/* Overall Progress Indicator */}
            <div className="space-y-1.5">
              <Progress value={spendPercent} />
              <div className="flex justify-between text-xs font-medium pt-1 text-muted-foreground">
                <span>
                  Spent: <strong className="text-foreground">{currencySymbol}{totalSpent.toLocaleString()}</strong>
                </span>
                <span>
                  Remaining: <strong className="text-emerald-600 dark:text-emerald-400">{currencySymbol}{remaining.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          </AppCard>

          {/* Edit Overall Limit Modal */}
          {isEditingLimit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
                <SectionHeader title="Set monthly spending limit" />
                <form onSubmit={handleLimitSave} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Monthly Limit ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Save limit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditingLimit(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Savings Goals */}
      {activeSubTab === "goals" && (
        <GoalsSection
          goals={goals}
          currencySymbol={currencySymbol}
          onCreateGoal={onCreateGoal}
          onAddContribution={onAddGoalContribution}
        />
      )}

      {/* Sub-tab 3: Bills Tracker */}
      {activeSubTab === "bills" && (
        <BillsSection
          bills={bills}
          currencySymbol={currencySymbol}
          onCreateBill={onCreateBill}
          onMarkPaid={onMarkBillPaid}
        />
      )}
    </div>
  );
};
