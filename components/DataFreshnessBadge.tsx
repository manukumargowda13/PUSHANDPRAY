"use client";

import React from "react";
import { Clock, Database, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface DataFreshnessBadgeProps {
  source: string;
  lastUpdated?: string;
  isSampleData?: boolean;
  className?: string;
}

export function DataFreshnessBadge({
  source,
  lastUpdated,
  isSampleData = false,
  className = "",
}: DataFreshnessBadgeProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium ${className}`}
      title={`Source: ${source}${lastUpdated ? ` | Updated: ${lastUpdated}` : ""}`}
    >
      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
        <Database className="w-3 h-3 text-emerald-600" />
        <span className="truncate max-w-[180px] sm:max-w-[240px]">{source}</span>
      </span>

      {lastUpdated && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
          <Clock className="w-3 h-3 text-emerald-600" />
          <span>{formatDate(lastUpdated)}</span>
        </span>
      )}

      {isSampleData && (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-semibold">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>sample data</span>
        </span>
      )}
    </div>
  );
}
