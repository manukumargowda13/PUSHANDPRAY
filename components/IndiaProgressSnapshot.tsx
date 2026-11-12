"use client";

import React from "react";
import { Flag, Sparkles, TrendingUp, CheckCircle, Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { TermExplainer } from "./TermExplainer";

export function IndiaProgressSnapshot() {
  const { t } = useLanguage();

  // Statutory National Target: 500 GW non-fossil by 2030 (COP26 Panchamrit)
  const targetGw = 500;
  const currentNonFossilGw = 209.48; // CEA Snapshot Oct 2024
  const progressPct = Number(((currentNonFossilGw / targetGw) * 100).toFixed(1));
  const remainingGw = Number((targetGw - currentNonFossilGw).toFixed(1));

  return (
    <div className="rounded-2xl border border-ivory-300 bg-white p-5 sm:p-6 shadow-card space-y-4 relative overflow-hidden">
      {/* Subtle national flag accent at corner */}
      <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-saffron-600 via-ivory-100 to-naturalGreen-700" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-saffron-50 text-saffron-800 border border-saffron-200">
            <Target className="w-5 h-5 text-saffron-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-800 bg-saffron-100/80 px-2 py-0.5 rounded border border-saffron-300">
                National Milestone
              </span>
              <TermExplainer termKey="capacity_vs_generation" variant="badge" label="Capacity Explainer" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-navy-950 mt-0.5">
              India's 500 GW Non-Fossil Electricity Target by 2030
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            National Progress
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-teal-800 font-mono">
            {progressPct}% Achieved
          </p>
        </div>
      </div>

      {/* Progress Bar with National Milestones */}
      <div className="space-y-2">
        <div className="relative h-5 w-full rounded-full bg-ivory-100 overflow-hidden border border-ivory-300 shadow-inner">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-teal-700 via-teal-600 to-saffron-600 transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
          >
            {currentNonFossilGw} GW
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>0 GW (2010 Baseline)</span>
          <span className="text-navy-900 font-bold">
            Current: {currentNonFossilGw} GW
          </span>
          <span className="text-saffron-800 font-bold">Goal: 500 GW by 2030</span>
        </div>
      </div>

      {/* 3 Citizen-Friendly Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-ivory-200">
        <div className="p-2.5 rounded-lg bg-ivory-50 border border-ivory-200">
          <span className="text-slate-500 block text-[11px] font-medium">Current Installed</span>
          <span className="font-extrabold text-navy-950 text-sm">209.5 GW Clean Energy</span>
          <span className="block text-[10px] text-slate-500 mt-0.5">Solar (90.8 GW), Wind (47.4 GW), Hydro (46.9 GW)</span>
        </div>
        <div className="p-2.5 rounded-lg bg-ivory-50 border border-ivory-200">
          <span className="text-slate-500 block text-[11px] font-medium">Remaining to Build</span>
          <span className="font-extrabold text-saffron-800 text-sm">290.5 GW Needed</span>
          <span className="block text-[10px] text-slate-500 mt-0.5">~50 GW clean capacity additions annually</span>
        </div>
        <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200">
          <span className="text-teal-900 block text-[11px] font-medium">Citizen Opportunity</span>
          <span className="font-extrabold text-teal-900 text-sm">Rooftop Solar & Jobs</span>
          <span className="block text-[10px] text-teal-800 mt-0.5">Homeowners can adopt rooftop solar under PM Surya Ghar</span>
        </div>
      </div>
    </div>
  );
}
