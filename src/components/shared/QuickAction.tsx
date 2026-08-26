"use client";

import React from "react";
import { motion } from "framer-motion";

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBgColor?: string;
  iconTextColor?: string;
  onClick: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-slate-500/10",
  iconTextColor = "text-slate-600 dark:text-slate-300",
  onClick
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-3.5 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-emerald-500/30 hover:bg-card/80 transition-all flex flex-col items-center sm:items-start text-center sm:text-left justify-between shadow-sm shadow-black/5 group touch-target cursor-pointer w-full"
    >
      <div className={`p-2.5 rounded-xl ${iconBgColor} ${iconTextColor} group-hover:scale-105 transition-transform mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground leading-snug">{title}</h4>
        <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5 leading-normal">
          {description}
        </p>
      </div>
    </motion.button>
  );
};
