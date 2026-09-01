"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAddSheetProps {
  isOpen: boolean;
  initialTab?: "outflow" | "inflow";
  onClose: () => void;
  onSaveTransaction: (transaction: {
    type: "outflow" | "inflow";
    classification: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    goalId?: string;
  }) => void;
  currencySymbol: string;
  goals?: { id: string; name: string }[];
}

export const QuickAddSheet: React.FC<QuickAddSheetProps> = ({
  isOpen,
  initialTab = "outflow",
  onClose,
  onSaveTransaction,
  currencySymbol,
  goals
}) => {
  const [activeTab, setActiveTab] = useState<"outflow" | "inflow">(initialTab);
  const [amount, setAmount] = useState<string>("");
  // FIND-1C-01: Explicit default category state initialization
  const [category, setCategory] = useState<string>(
    initialTab === "inflow" ? "Salary Inflow" : "Food & Groceries"
  );
  const [classification, setClassification] = useState<"income" | "expense" | "savings" | "goal_contribution" | "debt">(
    initialTab === "inflow" ? "income" : "expense"
  );
  const [goalId, setGoalId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showNoteField, setShowNoteField] = useState<boolean>(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setAmount("");
    setCategory("Food & Groceries");
    setNote("");
    setShowNoteField(false);
    setActiveTab("outflow");
    setClassification("expense");
    setGoalId("");
    onClose();
  };

  const categories =
    activeTab === "inflow"
      ? ["Salary Inflow", "Client Payment", "Side Hustle", "Bonus / Gift", "Other Inflow"]
      : ["Food & Groceries", "Transport & Fuel", "Utilities & Internet", "Entertainment", "Shopping", "Other Expense"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const selectedCategory = category || (activeTab === "inflow" ? "Salary Inflow" : "Food & Groceries");
    const finalClassification = activeTab === "inflow" ? "income" : classification;

    if (finalClassification === "goal_contribution" && !goalId) {
      alert("Please select a savings goal.");
      return;
    }

    onSaveTransaction({
      type: activeTab,
      classification: finalClassification,
      amount: numericAmount,
      category: selectedCategory,
      date: new Date().toISOString().split("T")[0],
      note: note || undefined,
      goalId: finalClassification === "goal_contribution" ? goalId : undefined
    });

    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-card border border-border/50 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/30">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {activeTab === "inflow" ? "Record Money In" : "Record Money Out"}
              </h2>
              <p className="text-xs text-muted-foreground">Quick financial entry</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground touch-target flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Money Out vs Money In Switcher */}
          <div className="flex bg-muted/60 p-1 rounded-xl my-4 border border-border/30">
            <button
              type="button"
              onClick={() => {
                setActiveTab("outflow");
                setClassification("expense");
                setCategory("Food & Groceries");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === "outflow"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
              <span>Money Out</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("inflow");
                setClassification("income");
                setCategory("Salary Inflow");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === "inflow"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
              <span>Money In</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Amount Focus (Primary Visual Focus) */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                  {currencySymbol}
                </span>
                <input
                  ref={amountInputRef}
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-2xl text-3xl font-extrabold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Allocation Classification (for Outflow) */}
            {activeTab === "outflow" && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Allocation Type
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setClassification("expense"); setGoalId(""); }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      classification === "expense"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-input bg-background text-muted-foreground"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClassification("savings"); setGoalId(""); }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      classification === "savings"
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-input bg-background text-muted-foreground"
                    }`}
                  >
                    General Savings
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassification("goal_contribution")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      classification === "goal_contribution"
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-input bg-background text-muted-foreground"
                    }`}
                  >
                    Goal Contribution
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClassification("debt"); setGoalId(""); }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      classification === "debt"
                        ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400"
                        : "border-input bg-background text-muted-foreground"
                    }`}
                  >
                    Debt Repayment
                  </button>
                </div>
                
                {/* Goal Selector */}
                {classification === "goal_contribution" && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Select Goal
                    </label>
                    <select
                      value={goalId}
                      onChange={(e) => setGoalId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="" disabled>Select a savings goal...</option>
                      {goals && goals.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Optional Note Field */}
            <div>
              {!showNoteField ? (
                <button
                  type="button"
                  onClick={() => setShowNoteField(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                >
                  + Add optional note
                </button>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly grocery trip"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full py-3.5 h-12 text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20">
              <Check className="w-4 h-4 mr-1.5" />
              <span>Save Transaction</span>
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
