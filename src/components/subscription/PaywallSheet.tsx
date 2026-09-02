"use client";

import React from "react";
import { Crown, CheckCircle, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpgrade: () => void;
}

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  isOpen,
  onClose,
  onConfirmUpgrade
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4">
      <div className="relative w-full max-w-md bg-card border border-border/60 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 z-10">
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Opti-Plan Plus</h3>
              <p className="text-xs text-muted-foreground">Premium Money Planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground touch-target flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Comparison */}
        <div className="space-y-4">
          <div className="grid grid-cols-5 text-[10px] font-bold text-muted-foreground border-b border-border/40 pb-2">
            <div className="col-span-3">Features</div>
            <div className="col-span-1 text-center">Free</div>
            <div className="col-span-1 text-center text-emerald-500">Plus</div>
          </div>
          
          {[
            { name: "Monthly Spending Plan", free: true, plus: true },
            { name: "Activity Timeline", free: true, plus: true },
            { name: "Smart Alerts", free: true, plus: true },
            { name: "Custom Categories", free: false, plus: true },
            { name: "Unlimited Savings Goals", free: false, plus: true },
            { name: "Cross-Device Sync", free: false, plus: true },
            { name: "Historical Check-In Archive", free: false, plus: true },
          ].map((feature, idx) => (
            <div key={idx} className="grid grid-cols-5 items-center text-xs py-1 border-b border-border/10 last:border-0">
              <div className="col-span-3 text-foreground font-medium pr-2">
                {feature.name}
              </div>
              <div className="col-span-1 flex justify-center">
                {feature.free ? (
                  <CheckCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                ) : (
                  <X className="w-3.5 h-3.5 text-muted-foreground/30" />
                )}
              </div>
              <div className="col-span-1 flex justify-center">
                {feature.plus ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <X className="w-4 h-4 text-emerald-500/30" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={onConfirmUpgrade}
            className="w-full py-3.5 h-12 text-xs font-bold rounded-xl"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span>Start 14-Day Free Trial</span>
          </Button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
