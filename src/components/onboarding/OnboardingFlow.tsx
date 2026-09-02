"use client";

import React, { useState } from "react";
import { Check, ChevronRight, ArrowRight, Wallet, Target, Clock } from "lucide-react";
import { createTransactionAction, setSpendingPlanLimitAction, createBillAction } from "@/app/app/actions";

interface OnboardingFlowProps {
  onComplete: () => void;
  currencySymbol: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, currencySymbol }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 State: Income
  const [incomeAmount, setIncomeAmount] = useState("");
  
  // Step 2 State: Spending Plan
  const [limitAmount, setLimitAmount] = useState("");

  // Step 3 State: Bills
  const [bills, setBills] = useState<{name: string, amount: string, dueDate: string}[]>([
    { name: "", amount: "", dueDate: "" }
  ]);

  const handleNext = () => setStep((s) => s + 1);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Income if provided
      const parsedIncome = parseFloat(incomeAmount);
      if (!isNaN(parsedIncome) && parsedIncome > 0) {
        await createTransactionAction({
          type: "income",
          amount: Math.round(parsedIncome * 100),
          category: "Salary / Wages",
          occurredAt: new Date().toISOString()
        });
      }

      // 2. Set Spending Limit if provided
      const parsedLimit = parseFloat(limitAmount);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        await setSpendingPlanLimitAction({
          periodStart: firstDay.split('T')[0],
          periodEnd: lastDay.split('T')[0],
          limitAmount: Math.round(parsedLimit * 100)
        });
      }

      // 3. Create Bills if provided
      for (const bill of bills) {
        const parsedAmount = parseFloat(bill.amount);
        if (bill.name && !isNaN(parsedAmount) && parsedAmount > 0) {
          await createBillAction({
            name: bill.name,
            expectedAmount: Math.round(parsedAmount * 100),
            frequency: "monthly",
            dueDate: bill.dueDate || new Date().toISOString().split('T')[0]
          });
        }
      }

      onComplete();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Fallback to completion anyway so they don't get stuck
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBillRow = () => {
    setBills([...bills, { name: "", amount: "", dueDate: "" }]);
  };

  const updateBill = (index: number, field: keyof typeof bills[0], value: string) => {
    const newBills = [...bills];
    newBills[index][field] = value;
    setBills(newBills);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
              OP
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Opti-Plan Setup</h1>
              <p className="text-xs text-muted-foreground">Universal Personal Money Planner</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Monthly Income */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Monthly Income</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                How much money comes in each month? We'll log this as your first income transaction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleNext}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-1.5 transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="py-3.5 px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Spending Limit */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Spending Limit</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Set a goal for how much you want to limit your spending to this month.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Monthly Plan Limit ({currencySymbol})
              </label>
              <input
                type="number"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                placeholder="e.g. 350000"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleNext}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-1.5 transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="py-3.5 px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bills */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Recurring Bills</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your fixed monthly expenses like rent, utilities, or subscriptions so we can remind you.
              </p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {bills.map((bill, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Name</label>
                    <input
                      type="text"
                      value={bill.name}
                      onChange={(e) => updateBill(index, "name", e.target.value)}
                      placeholder="e.g. Internet"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Amount ({currencySymbol})</label>
                    <input
                      type="number"
                      value={bill.amount}
                      onChange={(e) => updateBill(index, "amount", e.target.value)}
                      placeholder="e.g. 20000"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</label>
                    <input
                      type="date"
                      value={bill.dueDate}
                      onChange={(e) => updateBill(index, "dueDate", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={addBillRow}
                className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:border-emerald-500/50 transition-colors"
              >
                + Add another bill
              </button>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
              >
                <span>{isSubmitting ? "Setting up..." : "Finish Setup"}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="py-3.5 px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
