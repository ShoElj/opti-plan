"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground font-sans tracking-normal">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/80 font-normal mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
