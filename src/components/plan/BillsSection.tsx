"use client";

import React, { useState } from "react";
import { Plus, Clock, CheckCircle2, X } from "lucide-react";
import { BillItem } from "@/domain/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface BillsSectionProps {
  bills: BillItem[];
  currencySymbol: string;
  onCreateBill: (bill: Omit<BillItem, "id" | "status">) => void;
  onMarkPaid: (billId: string) => void;
}

export const BillsSection: React.FC<BillsSectionProps> = ({
  bills,
  currencySymbol,
  onCreateBill,
  onMarkPaid
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedPaidBill, setSelectedPaidBill] = useState<BillItem | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(billAmount);
    if (!billName || isNaN(amount) || amount <= 0) return;

    onCreateBill({
      name: billName,
      amount: amount,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      category: "Utilities & Internet",
      frequency: "Monthly"
    });

    setBillName("");
    setBillAmount("");
    setDueDate("");
    setIsCreateOpen(false);
  };

  const handleConfirmPaid = () => {
    if (!selectedPaidBill) return;
    onMarkPaid(selectedPaidBill.id);
    setSelectedPaidBill(null);
  };

  return (
    <div className="space-y-4">
      {/* Section Header & Create Action */}
      <SectionHeader
        title="Bills & subscriptions"
        subtitle="Track upcoming bill due dates"
        action={
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-8 text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Bill</span>
          </Button>
        }
      />

      {/* Bills List */}
      <div className="space-y-2">
        {bills.map((bill) => {
          const isPaid = bill.status === "paid";

          return (
            <AppCard
              key={bill.id}
              level={2}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isPaid
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-foreground">{bill.name}</h4>
                    {!isPaid && (
                      <StatusBadge variant="warning">
                        Due in 2 days
                      </StatusBadge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Due {bill.dueDate} • {bill.frequency}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-foreground">
                  {currencySymbol}
                  {bill.amount.toLocaleString()}
                </span>

                {!isPaid ? (
                  <Button
                    size="sm"
                    onClick={() => setSelectedPaidBill(bill)}
                    className="h-7 text-[11px] px-2.5"
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
          );
        })}
      </div>

      {/* Create Bill Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Add recurring bill</h3>
              <button onClick={() => setIsCreateOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Bill name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Internet Subscription"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="15000"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <Button type="submit" className="w-full">
                Save bill
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Mark Paid Confirmation Modal */}
      {selectedPaidBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Mark bill as paid</h3>
              <button onClick={() => setSelectedPaidBill(null)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs text-foreground">
              Mark <strong>{selectedPaidBill.name}</strong> ({currencySymbol}{selectedPaidBill.amount.toLocaleString()}) as Paid for this month?
            </p>

            <div className="flex space-x-2 pt-2">
              <Button className="flex-1" onClick={handleConfirmPaid}>
                Confirm paid
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedPaidBill(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
