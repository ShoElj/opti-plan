"use client";

import React, { useState } from "react";
import { Moon, Sun, LogOut, Trash2, Crown, X } from "lucide-react";
import { PERSONA_PROFILES } from "@/prototype/mockData";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface ProfileViewProps {
  userName: string;
  userEmail: string;
  personaId: string;
  currencyCode: string;
  subscriptionTier: "free" | "plus";
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onChangePersona: (personaId: string) => void;
  onChangeCurrency: (code: string) => void;
  onOpenPaywall: () => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName,
  userEmail,
  personaId,
  currencyCode,
  subscriptionTier,
  isDarkMode,
  onToggleDarkMode,
  onChangePersona,
  onChangeCurrency,
  onOpenPaywall,
  onSignOut
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteKeyword, setDeleteKeyword] = useState("");

  const currentPersona = PERSONA_PROFILES.find((p) => p.id === personaId) || PERSONA_PROFILES[0];

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 1. Profile Identity */}
      <AppCard level={2} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">{userName}</h2>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
            <div className="mt-1">
              <StatusBadge variant="success">{currentPersona.name}</StatusBadge>
            </div>
          </div>
        </div>
      </AppCard>

      {/* 2. Subscription Status */}
      <div className="space-y-2">
        <SectionHeader title="Subscription" />
        <AppCard level={2} className="bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-transparent border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  Opti-Plan {subscriptionTier === "plus" ? "Plus" : "Free"}
                </h3>
                <StatusBadge variant={subscriptionTier === "plus" ? "success" : "neutral"}>
                  {subscriptionTier === "plus" ? "Active" : "Current plan"}
                </StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {subscriptionTier === "plus"
                  ? "Full access to unlimited savings targets."
                  : "Basic money planning features."}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onOpenPaywall}
            className="h-8 text-xs font-bold shrink-0"
          >
            {subscriptionTier === "plus" ? "Manage" : "Explore Plus"}
          </Button>
        </AppCard>
      </div>

      {/* 3. Preferences */}
      <div className="space-y-2">
        <SectionHeader title="Preferences" />
        <AppCard level={2} className="space-y-3.5">
          {/* Persona Selection */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Money profile type
            </label>
            <select
              value={personaId}
              onChange={(e) => onChangePersona(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PERSONA_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Currency */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Display currency
            </label>
            <select
              value={currencyCode}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="NGN">NGN (₦) - Nigerian Naira</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="EUR">EUR (€) - Euro</option>
            </select>
          </div>

          {/* Theme Appearance */}
          <div className="flex items-center justify-between py-2 border-t border-border/20">
            <div className="flex items-center space-x-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-emerald-600" />}
              <span className="text-xs font-semibold text-foreground">Theme</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDarkMode}
              className="h-8 text-xs font-medium"
            >
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Button>
          </div>
        </AppCard>
      </div>

      {/* 4. Account & Privacy */}
      <div className="space-y-2">
        <SectionHeader title="Account & privacy" />
        <AppCard level={2} className="space-y-3">
          <div className="flex space-x-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 h-10 text-xs font-semibold"
              onClick={onSignOut}
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              <span>Sign Out</span>
            </Button>

            <Button
              variant="destructive"
              className="flex-1 h-10 text-xs font-semibold"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>Delete account</span>
            </Button>
          </div>
        </AppCard>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400">Delete account</h3>
              <button onClick={() => setIsDeleteModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              This action will permanently erase your data.
            </p>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Type <strong className="text-foreground">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={deleteKeyword}
                onChange={(e) => setDeleteKeyword(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteKeyword !== "DELETE"}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  onSignOut();
                }}
              >
                Confirm delete
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteModalOpen(false)}
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
