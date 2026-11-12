"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  variant?: "default" | "emerald" | "amber" | "blue" | "purple";
  badge?: string;
  className?: string;
}

const variantStyles = {
  default: "bg-white border-slate-200 text-slate-900",
  emerald: "bg-emerald-50/50 border-emerald-200 text-slate-900",
  amber: "bg-amber-50/50 border-amber-200 text-slate-900",
  blue: "bg-sky-50/50 border-sky-200 text-slate-900",
  purple: "bg-purple-50/50 border-purple-200 text-slate-900",
};

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = "default",
  badge,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-5 shadow-sm transition-all hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-100/80 text-slate-700">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-200/80 text-slate-700">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center font-medium",
                change.trend === "up" && "text-emerald-700 font-semibold",
                change.trend === "down" && "text-rose-700 font-semibold",
                change.trend === "neutral" && "text-slate-600"
              )}
            >
              {change.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
              {change.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {change.trend === "neutral" && <Minus className="w-3.5 h-3.5 mr-0.5" />}
              {change.value}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
