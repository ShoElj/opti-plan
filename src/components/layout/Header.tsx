"use client";

import React from "react";
import { Moon, Sun, Wifi, WifiOff, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface HeaderProps {
  userName: string;
  personaName: string;
  isOffline: boolean;
  onToggleOffline: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCheckIn: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  personaName,
  isOffline,
  onToggleOffline,
  isDarkMode,
  onToggleDarkMode,
  onOpenCheckIn
}) => {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-xl border-b border-border/30 transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Mobile/Tablet Brand & Persona Context */}
        <div className="flex items-center space-x-3">
          <div className="lg:hidden w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-emerald-500/20">
            OP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-foreground">
                August 2026
              </span>
              <StatusBadge variant="success">
                {personaName}
              </StatusBadge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Money Planning • {userName}
            </p>
          </div>
        </div>

        {/* Right Side: Header Utilities & Check-In Action */}
        <div className="flex items-center space-x-2">
          {/* Monthly Check-In Action Button */}
          <button
            onClick={onOpenCheckIn}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Money Check-In</span>
          </button>

          {/* Offline Mode Simulator Toggle */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? "Simulating Offline Mode" : "Online Status"}
            className={`p-2 rounded-xl transition-all touch-target flex items-center justify-center cursor-pointer ${isOffline
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground transition-all touch-target flex items-center justify-center cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="text-center text-[11px] font-medium py-1 px-4 bg-amber-500/15 text-amber-700 dark:text-amber-300 border-t border-amber-500/20 flex items-center justify-center space-x-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-600" />
          <span>Offline mode active   changes saved locally</span>
        </div>
      )}
    </header>
  );
};
