"use client";

import React from "react";
import { Home, Activity, Target, User, Plus } from "lucide-react";

export type NavTab = "home" | "activity" | "plan" | "profile";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenQuickAdd: () => void;
  userName?: string;
  userEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickAdd,
  userName = "Alex Johnson",
  userEmail = "alex@opti-plan.app"
}) => {
  const navItems = [
    { id: "home" as NavTab, label: "Home", icon: Home },
    { id: "activity" as NavTab, label: "Activity", icon: Activity },
    { id: "plan" as NavTab, label: "Plan", icon: Target },
    { id: "profile" as NavTab, label: "Profile", icon: User }
  ];

  return (
    <>
      {/* Mobile & Tablet Bottom Navigation Bar (Active < 1024px / lg:hidden) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-4 py-2">
        <div className="flex items-center justify-around relative max-w-lg mx-auto">
          {/* First 2 Tabs: Home & Activity */}
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-target cursor-pointer ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Central Persistent Quick Add FAB */}
          <div className="relative -top-4">
            <button
              onClick={onOpenQuickAdd}
              aria-label="Quick Add Transaction"
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-4 border-background transition-transform cursor-pointer"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>

          {/* Last 2 Tabs: Plan & Profile */}
          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-target cursor-pointer ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Persistent Sidebar (Active ≥ 1024px / hidden lg:flex) */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30 bg-card border-r border-border/60 p-5 shadow-sm justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 px-1 py-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
              OP
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-foreground">Opti-Plan</h1>
              <p className="text-[11px] font-medium text-muted-foreground">Personal Money Companion</p>
            </div>
          </div>

          {/* Quick Add Primary Button */}
          <button
            onClick={onOpenQuickAdd}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add Transaction</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Identity Footer Card */}
        <div className="pt-4 border-t border-border/40 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden text-left">
            <h4 className="text-xs font-bold text-foreground truncate">{userName}</h4>
            <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </aside>
    </>
  );
};
