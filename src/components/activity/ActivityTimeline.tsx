"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowDownLeft, ArrowUpRight, PiggyBank, CreditCard, X, Trash2 } from "lucide-react";
import { Transaction } from "@/prototype/mockData";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Button } from "@/components/ui/button";

interface ActivityTimelineProps {
  transactions: Transaction[];
  currencySymbol: string;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  transactions,
  currencySymbol,
  onDeleteTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "inflow" && tx.type === "inflow") ||
      (selectedFilter === "outflow" && tx.type === "outflow" && tx.classification === "expense") ||
      (selectedFilter === "savings" && tx.classification === "savings") ||
      (selectedFilter === "debt" && tx.classification === "debt");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Page Header & Filter Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Activity</h2>
          <p className="text-xs text-muted-foreground font-medium">Your recent financial transaction timeline</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          {filtered.length} items
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-card/50 border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors cursor-pointer ${
            selectedFilter !== "all"
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "bg-card/50 border-input text-muted-foreground hover:text-foreground"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Modal Sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <h3 className="text-xs font-bold text-foreground">Filter activity</h3>
              <button onClick={() => setIsFilterSheetOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { id: "all", label: "All Activity" },
                { id: "inflow", label: "Money In" },
                { id: "outflow", label: "Expenses" },
                { id: "savings", label: "Savings" },
                { id: "debt", label: "Debt Paid" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedFilter(item.id);
                    setIsFilterSheetOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedFilter === item.id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clean Timeline List with Light Separators */}
      {filtered.length === 0 ? (
        <AppCard level={3} className="p-8 text-center">
          <p className="text-xs font-semibold text-foreground">No transactions found</p>
        </AppCard>
      ) : (
        <div className="space-y-3">
          <SectionHeader title="Recent transactions" />
          <AppCard level={2} className="p-0 overflow-hidden divide-y divide-border/20">
            {filtered.map((tx) => {
              const isInflow = tx.type === "inflow";
              const isSavings = tx.classification === "savings";
              const isDebt = tx.classification === "debt";

              return (
                <motion.div
                  key={tx.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  onClick={() => setSelectedTransaction(tx)}
                  className="p-3.5 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isInflow
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isSavings
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : isDebt
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {isInflow ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isSavings ? (
                        <PiggyBank className="w-4 h-4" />
                      ) : isDebt ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{tx.category}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {tx.date} {tx.note ? `• ${tx.note}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isInflow ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      }`}
                    >
                      {isInflow ? "+" : "-"}
                      {currencySymbol}
                      {tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground block capitalize mt-0.5">
                      {tx.classification}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AppCard>
        </div>
      )}

      {/* Transaction Detail Sheet */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Transaction detail</h3>
                <button onClick={() => setSelectedTransaction(null)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-foreground">
                    {currencySymbol}
                    {selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">{selectedTransaction.date}</span>
                </div>
                {selectedTransaction.note && (
                  <div className="flex justify-between py-1 border-b border-border/20">
                    <span className="text-muted-foreground">Note</span>
                    <span className="font-semibold text-foreground">{selectedTransaction.note}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    onDeleteTransaction(selectedTransaction.id);
                    setSelectedTransaction(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span>Delete</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
