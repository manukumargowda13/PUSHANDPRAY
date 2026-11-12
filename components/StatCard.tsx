"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "./ErrorBoundary";
import { TermExplainer } from "./TermExplainer";
import { TECHNICAL_EXPLAINERS } from "@/lib/i18n/translations";

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
  variant?: "default" | "emerald" | "amber" | "blue" | "purple" | "teal" | "navy";
  badge?: string;
  explainerKey?: keyof typeof TECHNICAL_EXPLAINERS | string;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-white border-ivory-300 text-navy-950",
  emerald: "bg-naturalGreen-50/50 border-naturalGreen-200 text-navy-950",
  teal: "bg-teal-50/50 border-teal-200 text-navy-950",
  amber: "bg-saffron-50/50 border-saffron-200 text-navy-950",
  blue: "bg-sky-50/50 border-sky-200 text-navy-950",
  purple: "bg-purple-50/50 border-purple-200 text-navy-950",
  navy: "bg-navy-900 border-navy-800 text-ivory",
};

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = "default",
  badge,
  explainerKey,
  className,
}: StatCardProps) {
  const chosenStyle = variantStyles[variant] || variantStyles.default;
  const isNavy = variant === "navy";

  return (
    <ErrorBoundary fallbackTitle={`Metric: ${title}`}>
      <div
        className={cn(
          "relative rounded-xl border p-5 shadow-warm transition-all hover:shadow-lifted",
          chosenStyle,
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "text-xs font-bold tracking-wider uppercase",
                isNavy ? "text-ivory-300" : "text-navy-700"
              )}
            >
              {title}
            </span>
            {explainerKey && (
              <TermExplainer termKey={explainerKey} variant="icon" />
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "p-2 rounded-lg",
                isNavy ? "bg-navy-800 text-ivory" : "bg-ivory-100 text-navy-800"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={cn(
              "text-2xl sm:text-3xl font-extrabold tracking-tight",
              isNavy ? "text-ivory" : "text-navy-950"
            )}
          >
            {value}
          </span>
          {badge && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-semibold",
                isNavy
                  ? "bg-navy-800 text-ivory-200 border border-navy-700"
                  : "bg-ivory-200 text-navy-800 border border-ivory-300"
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {(subtitle || change) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center font-bold",
                  change.trend === "up" && "text-naturalGreen-700",
                  change.trend === "down" && "text-rose-700",
                  change.trend === "neutral" && (isNavy ? "text-ivory-400" : "text-slate-600")
                )}
              >
                {change.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === "neutral" && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {change.value}
              </span>
            )}
            {subtitle && (
              <span
                className={cn(
                  "truncate",
                  isNavy ? "text-ivory-400" : "text-slate-600"
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
