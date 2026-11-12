"use client";

import React from "react";
import { DataFreshnessBadge } from "./DataFreshnessBadge";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  source: string;
  lastUpdated?: string;
  isSampleData?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function ChartCard({
  title,
  subtitle,
  source,
  lastUpdated,
  isSampleData = false,
  action,
  children,
  className,
  minHeight = "min-h-[300px]",
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {action}
          <DataFreshnessBadge
            source={source}
            lastUpdated={lastUpdated}
            isSampleData={isSampleData}
          />
        </div>
      </div>

      <div className={cn("mt-4 w-full flex flex-col justify-center", minHeight)}>
        {children}
      </div>
    </div>
  );
}
