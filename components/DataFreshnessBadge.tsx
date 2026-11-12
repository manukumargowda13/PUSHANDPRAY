"use client";

import React from "react";
import { Clock, Database, CheckCircle2, AlertCircle, Calculator } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface DataFreshnessBadgeProps {
  source: string;
  lastUpdated?: string;
  isSampleData?: boolean;
  isEstimated?: boolean;
  reportingPeriod?: string;
  className?: string;
}

export function DataFreshnessBadge({
  source,
  lastUpdated,
  isSampleData = false,
  isEstimated = false,
  reportingPeriod,
  className = "",
}: DataFreshnessBadgeProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-medium ${className}`}
      title={`Data Source: ${source}${lastUpdated ? ` | Snapshot: ${lastUpdated}` : ""}`}
    >
      {/* Source Citation Pill */}
      <span className="inline-flex items-center gap-1 bg-ivory-100 text-navy-900 px-2 py-0.5 rounded-md border border-ivory-300 font-medium">
        <Database className="w-3 h-3 text-teal-700" />
        <span className="truncate max-w-[200px] sm:max-w-[260px]">{source}</span>
      </span>

      {/* Reporting Period / Last Updated */}
      {(lastUpdated || reportingPeriod) && (
        <span className="inline-flex items-center gap-1 bg-white text-slate-700 px-2 py-0.5 rounded-md border border-ivory-300">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{reportingPeriod || (lastUpdated ? formatDate(lastUpdated) : "")}</span>
        </span>
      )}

      {/* Actual / Sample / Estimated Transparency Indicator */}
      {isSampleData ? (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] font-semibold">
          <AlertCircle className="w-3 h-3 text-amber-700" />
          <span>Sample Public Dataset</span>
        </span>
      ) : isEstimated ? (
        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-900 px-2 py-0.5 rounded-md border border-teal-200 text-[11px] font-semibold">
          <Calculator className="w-3 h-3 text-teal-700" />
          <span>Calculated Model</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 bg-naturalGreen-50 text-naturalGreen-900 px-2 py-0.5 rounded-md border border-naturalGreen-200 text-[11px] font-semibold">
          <CheckCircle2 className="w-3 h-3 text-naturalGreen-700" />
          <span>Statutory Data</span>
        </span>
      )}
    </div>
  );
}
