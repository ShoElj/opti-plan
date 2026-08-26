"use client";

import React, { useState } from "react";
import { Sparkles, X, ChevronRight, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

interface MonthlyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
  moneyLeft: number;
}

export const MonthlyCheckInModal: React.FC<MonthlyCheckInModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  totalIncome,
  totalExpenses,
  totalSavings,
  totalDebt,
  moneyLeft
}) => {
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Stepper & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-foreground">August Money Check-In</h3>
          </div>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step} of 4</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s === step
                    ? "bg-emerald-500"
                    : s < step
                    ? "bg-emerald-500/40"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Money In Summary */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Total Money In
              </span>
              <div className="text-3xl font-extrabold text-foreground mt-1">
                {currencySymbol}{totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Primary salary and incoming transfers recorded in August.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>Next: Spending Summary</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Money Out & Categories */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Total Normal Expenses
              </span>
              <div className="text-3xl font-extrabold text-foreground mt-1">
                {currencySymbol}{totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Top category: Food & Groceries ({currencySymbol}80,000)
              </p>
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>Next: Savings & Debt</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Savings & Debt */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Total Saved</span>
              <span className="text-base font-bold text-foreground">
                {currencySymbol}{totalSavings.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Debt Paid</span>
              <span className="text-base font-bold text-foreground">
                {currencySymbol}{totalDebt.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>Next: Final Money Left</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 4: Final Money Left Recap & Reveal */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                August Final Money Left
              </span>
              <div className="text-4xl font-extrabold text-foreground">
                {currencySymbol}{moneyLeft.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Awesome work! You kept spending within your plan and saved toward targets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>August Check-In Badge Completed!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              Complete Check-In & Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
