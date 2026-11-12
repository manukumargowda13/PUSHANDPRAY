"use client";

import React, { useState } from "react";
import { Zap, Sun, Factory, Home, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { TermExplainer } from "./TermExplainer";

export function SimpleEnergyExplainer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-ivory-300 bg-white p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Energy 101 Guide
            </span>
            <span className="text-xs text-slate-500 font-medium">For Citizens, Students & Businesses</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-navy-950 mt-1">
            How India's Electricity Grid Works
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Understanding how electricity flows from solar parks and coal plants straight to your light switch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-ivory-100 hover:bg-ivory-200 text-navy-900 border border-ivory-300 transition-colors self-start sm:self-auto"
        >
          <span>{expanded ? "Hide Explainer" : "Read 2-Min Explainer"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4-Step Visual Grid Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-navy-850 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <span className="font-bold text-navy-950">Generation</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Electricity is produced at thermal coal plants, massive solar parks (like Bhadla), wind farms, and hydro dams.
          </p>
          <div className="pt-1">
            <TermExplainer termKey="capacity_vs_generation" variant="badge" label="Capacity vs Gen" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="font-bold text-navy-950">National Grid</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Grid Controller of India (Grid-India) operates high-voltage interstate transmission lines to balance demand across regions in real time.
          </p>
          <div className="pt-1">
            <TermExplainer termKey="coal_gap" variant="badge" label="Coal Gap" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-saffron-700 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="font-bold text-navy-950">Your DISCOM</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            State distribution companies (like BESCOM, MSEDCL, TANGEDCO) step down voltage to supply power to homes and shops.
          </p>
          <div className="pt-1">
            <TermExplainer termKey="rco_obligation" variant="badge" label="RCO Mandate" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-naturalGreen-700 text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span className="font-bold text-navy-950">Your Rooftop</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Installing rooftop solar allows you to generate power locally, offset your monthly bill, and feed excess clean power back to the grid.
          </p>
          <div className="pt-1">
            <TermExplainer termKey="net_metering" variant="badge" label="Net Metering" />
          </div>
        </div>
      </div>

      {/* Expanded citizen deep-dive */}
      {expanded && (
        <div className="p-4 rounded-xl bg-ivory-100/70 border border-ivory-300 text-xs text-navy-900 space-y-3 animate-in fade-in duration-150">
          <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Why Is India's Clean Energy Transition Unique?</span>
          </h4>
          <p className="leading-relaxed text-slate-700">
            India is the third largest electricity producer in the world. Rapid economic growth means electricity demand grows by 6% to 8% every year. To satisfy this growth without multiplying air pollution, India has set a target of <strong>500 GW of clean non-fossil capacity by 2030</strong>.
          </p>
          <p className="leading-relaxed text-slate-700">
            Every citizen can participate directly through programs like <strong>PM Surya Ghar: Muft Bijli Yojana</strong>, which provides up to ₹78,000 in direct government subsidies to install solar on household rooftops.
          </p>
        </div>
      )}
    </div>
  );
}
