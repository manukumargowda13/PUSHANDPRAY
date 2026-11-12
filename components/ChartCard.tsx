"use client";

import React from "react";
import { DataFreshnessBadge } from "./DataFreshnessBadge";
import { ErrorBoundary } from "./ErrorBoundary";
import { TermExplainer } from "./TermExplainer";
import { TECHNICAL_EXPLAINERS } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  source: string;
  lastUpdated?: string;
  isSampleData?: boolean;
  explainerKey?: keyof typeof TECHNICAL_EXPLAINERS | string;
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
  explainerKey,
  action,
  children,
  className,
  minHeight = "min-h-[300px]",
}: ChartCardProps) {
  return (
    <ErrorBoundary fallbackTitle={`Chart: ${title}`}>
      <div
        className={cn(
          "rounded-xl border border-ivory-300 bg-white p-5 shadow-warm transition-all",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-ivory-200 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-navy-950 tracking-tight">
                {title}
              </h3>
              {explainerKey && (
                <TermExplainer termKey={explainerKey} variant="badge" />
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-navy-700 mt-0.5">{subtitle}</p>
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
          <ErrorBoundary fallbackTitle="Visualization Component Failed">
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}
