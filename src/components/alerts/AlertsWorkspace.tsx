"use client";

import React, { useState } from "react";
import { SmartAlert } from "@/domain/types";
import { AppCard } from "@/components/shared/AppCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Bell, Check, CheckCheck, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertsWorkspaceProps {
  alerts: SmartAlert[];
  onMarkRead: (alertId: string) => void;
  onMarkAllRead: () => void;
}

export const AlertsWorkspace: React.FC<AlertsWorkspaceProps> = ({
  alerts,
  onMarkRead,
  onMarkAllRead
}) => {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const unreadCount = alerts.filter((a) => !a.readAt).length;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unread") return !a.readAt;
    if (filter === "critical") return a.severity === "critical";
    return true;
  });

  const getSeverityBadge = (severity: SmartAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <StatusBadge variant="danger">
            <AlertCircle className="w-3 h-3 mr-1 text-rose-500" />
            <span>Critical</span>
          </StatusBadge>
        );
      case "warning":
        return (
          <StatusBadge variant="warning">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
            <span>Warning</span>
          </StatusBadge>
        );
      default:
        return (
          <StatusBadge variant="info">
            <Info className="w-3 h-3 mr-1 text-blue-500" />
            <span>Info</span>
          </StatusBadge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Smart Alerts"
        subtitle="Actionable financial notifications requiring attention"
        action={
          unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={onMarkAllRead} className="h-8 text-xs">
              <CheckCheck className="w-4 h-4 mr-1" />
              <span>Mark all read</span>
            </Button>
          )
        }
      />

      {/* Filter Chips */}
      <div className="flex space-x-2 border-b border-border/30 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            filter === "all" ? "bg-card text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            filter === "unread" ? "bg-card text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            filter === "critical" ? "bg-card text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Critical
        </button>
      </div>

      {/* Alert Items List */}
      <div className="space-y-2">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
              <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Smart Alerts will appear here when you need to take action. Opti-Plan monitors your activity and will notify you about upcoming bills, exceeding plan limits, or critical cash flow warnings.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isUnread = !alert.readAt;

            return (
              <AppCard
                key={alert.id}
                level={2}
                className={`p-4 flex items-start justify-between transition-colors ${
                  isUnread ? "bg-card border-l-4 border-l-emerald-500 shadow-sm" : "bg-card/60 opacity-85"
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-extrabold text-foreground">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{alert.message}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>

                {isUnread && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkRead(alert.id)}
                    className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                    title="Mark read"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </AppCard>
            );
          })
        )}
      </div>
    </div>
  );
};
