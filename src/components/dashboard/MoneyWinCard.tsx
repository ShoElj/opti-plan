"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MoneyWinCardProps {
  onDismiss?: () => void;
  insightMessage?: string;
}

export const MoneyWinCard: React.FC<MoneyWinCardProps> = ({ onDismiss, insightMessage }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !insightMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 relative transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                Money Win
              </span>
              <p className="text-xs font-medium text-foreground mt-0.5 leading-snug">
                {insightMessage}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDismissed(true);
              if (onDismiss) onDismiss();
            }}
            className="text-muted-foreground hover:text-foreground p-1 touch-target flex items-center justify-center rounded-lg cursor-pointer shrink-0"
            aria-label="Dismiss Money Win insight"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
