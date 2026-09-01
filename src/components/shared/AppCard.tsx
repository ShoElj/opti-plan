"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export type SurfaceLevel = 1 | 2 | 3;

interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: SurfaceLevel;
  className?: string;
  animate?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  level = 2,
  className,
  animate = false,
  children,
  ...props
}) => {
  const levelStyles: Record<SurfaceLevel, string> = {
    // Level 1   Hero: Strong visual emphasis, rounded-[28px], generous spacing, rich gradient/surface
    1: "rounded-[28px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-7 shadow-lg shadow-emerald-700/15 border border-emerald-500/20 overflow-hidden",

    // Level 2   Supporting Card: Soft neutral translucent surface, rounded-2xl, restrained shadow
    2: "rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 p-5 shadow-sm shadow-black/5 hover:border-emerald-500/20 transition-all",

    // Level 3   List / Inline Surface: Minimal visual chrome, rounded-xl, light background
    3: "rounded-xl bg-card/30 border border-border/20 p-3.5 hover:bg-card/60 transition-colors"
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(levelStyles[level], className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(levelStyles[level], className)} {...props}>
      {children}
    </div>
  );
};
