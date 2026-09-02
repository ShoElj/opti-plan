"use client";

import React, { useState } from "react";
import { Plus, Target, Sparkles, X } from "lucide-react";
import { SavingsGoal } from "@/domain/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GoalsSectionProps {
  goals: SavingsGoal[];
  currencySymbol: string;
  onCreateGoal: (goal: { name: string; targetAmount: number; targetDate?: string }) => void;
  onAddContribution: (goalId: string, amount: number) => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  currencySymbol,
  onCreateGoal,
  onAddContribution
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (!goalName || isNaN(amount) || amount <= 0) return;

    onCreateGoal({
      name: goalName,
      targetAmount: Math.round(amount * 100), // convert to minor units
      targetDate: targetDate || undefined
    });

    setGoalName("");
    setTargetAmount("");
    setTargetDate("");
    setIsCreateOpen(false);
  };

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;

    onAddContribution(selectedGoal.id, Math.round(amount * 100)); // convert to minor units
    setContributionAmount("");
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-4">
      {/* Section Header & Create Action */}
      <SectionHeader
        title="Savings goals"
        subtitle="Track progress toward specific financial targets"
        action={
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-8 text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Goal</span>
          </Button>
        }
      />

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map((goal) => {
          const targetMajor = goal.targetAmount / 100;
          const savedMajor = goal.savedAmount / 100;
          const percent = goal.targetAmount > 0 ? Math.round((goal.savedAmount / goal.targetAmount) * 100) : 0;
          const visualProgress = Math.min(100, percent);
          const isMilestone = percent >= 50;

          return (
            <AppCard key={goal.id} level={2} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{goal.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Target: {currencySymbol}{targetMajor.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGoal(goal)}
                  className="h-7 text-[11px] px-2.5"
                >
                  + Add
                </Button>
              </div>

              {/* Progress Indicator */}
              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span className="text-muted-foreground">
                    Saved: {currencySymbol}{savedMajor.toLocaleString()}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {percent}% Saved
                  </span>
                </div>
                <Progress value={visualProgress} />
              </div>

              {/* Milestone Celebration */}
              {isMilestone && (
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <StatusBadge variant="success">
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span>{percent >= 100 ? "Goal achieved!" : "Halfway there! 50%+ Saved"}</span>
                  </StatusBadge>
                </div>
              )}
            </AppCard>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Create savings goal</h3>
              <button onClick={() => setIsCreateOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Goal name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Reserve"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Target amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="350000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Target date (Optional)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <Button type="submit" className="w-full">
                Save goal
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Goal Contribution Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Goal contribution</h3>
                <p className="text-xs text-muted-foreground">{selectedGoal.name}</p>
              </div>
              <button onClick={() => setSelectedGoal(null)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleContributionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Contribution amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="25000"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <Button type="submit" className="w-full">
                Add contribution
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
