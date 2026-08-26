"use client";

import React, { useState } from "react";
import { Check, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { PERSONA_PROFILES } from "@/prototype/mockData";

interface OnboardingFlowProps {
  onComplete: (personaId: string, currencyCode: string, currencySymbol: string) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedPersona, setSelectedPersona] = useState<string>("salaried");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("NGN");

  const getSymbol = (code: string) => {
    switch (code) {
      case "USD": return "$";
      case "GBP": return "£";
      case "EUR": return "€";
      default: return "₦";
    }
  };

  const handleFinish = () => {
    onComplete(selectedPersona, selectedCurrency, getSymbol(selectedCurrency));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
              OP
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Opti-Plan</h1>
              <p className="text-xs text-muted-foreground">Universal Personal Money Planner</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Select Persona Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Choose your money profile</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Personalizes category hints and insights. Your underlying financial calculation engine remains 100% unified.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {PERSONA_PROFILES.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 shadow-sm"
                        : "bg-background border-border hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{p.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              <span>Continue to Currency</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Select Currency */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Select primary currency</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Sets the display currency symbol across your dashboard and timeline.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
                { code: "USD", symbol: "$", name: "US Dollar" },
                { code: "GBP", symbol: "£", name: "British Pound" },
                { code: "EUR", symbol: "€", name: "Euro" }
              ].map((c) => {
                const isSelected = selectedCurrency === c.code;
                return (
                  <div
                    key={c.code}
                    onClick={() => setSelectedCurrency(c.code)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 shadow-sm"
                        : "bg-background border-border hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center">
                        {c.symbol}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-foreground">{c.name}</div>
                        <span className="text-[10px] text-muted-foreground">{c.code}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              <span>Continue to Optional Setup</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Optional Plan Setup with Fast-Track Skip */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Optional Initial Setup</h2>
              <p className="text-xs text-muted-foreground mt-1">
                You can set an initial income baseline now or skip straight to your Home Dashboard.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Estimated Monthly Income ({getSymbol(selectedCurrency)}) - Optional
              </label>
              <input
                type="number"
                placeholder="e.g. 350000"
                className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-muted-foreground">
                Setting a spending plan or income estimate is optional and can be skipped.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5"
              >
                <span>Complete Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleFinish}
                className="py-3.5 px-5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-xs transition-colors"
              >
                Skip to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
