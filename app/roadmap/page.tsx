"use client";

import React from "react";
import { Compass, Landmark, RefreshCw, Leaf, Cpu, ShieldAlert, ArrowUpRight } from "lucide-react";
import { useUserRole } from "@/lib/role-context";

const ROADMAP_MODULES = [
  {
    id: "D5",
    title: "Green Finance & Subsidies Aggregator",
    icon: Landmark,
    status: "Planned (v2.0)",
    color: "emerald",
    description:
      "Unified aggregator of concessional green credit lines (IREDA, PFC, REC, SIDBI) and NABARD agricultural clean energy loans with one-click eligibility matching.",
    deliverables: [
      "IREDA clean tech interest rate radar",
      "SIDBI MSME rooftop solar green loan calculator",
      "Automated debt service coverage ratio (DSCR) projection",
    ],
  },
  {
    id: "D6",
    title: "Circular Economy & Solar PV Recycling Tracker",
    icon: RefreshCw,
    status: "Planned (v2.0)",
    color: "blue",
    description:
      "End-of-life solar panel tracking, e-waste recycler matching under CPCB Battery & E-Waste Management Rules, and material recovery benchmarks (silver, silicon, glass).",
    deliverables: [
      "Extended Producer Responsibility (EPR) credit ledger",
      "Registered recycler locator and logistics quote estimator",
      "Critical raw materials recovery index",
    ],
  },
  {
    id: "D7",
    title: "Comprehensive Environmental & Health Impact Engine",
    icon: Leaf,
    status: "Planned (v2.0)",
    color: "teal",
    description:
      "Granular avoided PM2.5, SOx, NOx emissions, water savings from displaced thermal power cooling towers, and public healthcare benefit estimations.",
    deliverables: [
      "CPCB Air Quality Index (AQI) abatement correlation",
      "Thermal cooling tower water withdrawal reduction metrics",
      "Social Cost of Carbon (SCC) economic ledger",
    ],
  },
  {
    id: "D8",
    title: "AI Renewable Forecasting & Battery Storage Sizing",
    icon: Cpu,
    status: "Planned (v2.1)",
    color: "purple",
    description:
      "Day-ahead solar and wind generation forecasting using NWP weather models, BESS charge-discharge arbitrage optimization, and Deviation Settlement Mechanism (DSM) avoidance.",
    deliverables: [
      "IEX Real-Time Market (RTM) price arbitrage scheduler",
      "DSM penalty risk mitigation engine",
      "Optimal 2-hour / 4-hour battery storage dispatch profile",
    ],
  },
  {
    id: "D9",
    title: "Role-Based Single Sign-On Enterprise Portals",
    icon: ShieldAlert,
    status: "Planned (v2.1)",
    color: "amber",
    description:
      "Full Supabase Auth RBAC portals with secure DISCOM billing integrations, state SERC petition filing assistants, and audited commercial PPA execution workflows.",
    deliverables: [
      "DISCOM automated meter data management (MDM) connector",
      "SERC compliance petition generator",
      "Verified green energy certificate (GEC) wallet",
    ],
  },
];

export default function RoadmapPage() {
  const { roleConfig } = useUserRole();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
            Modules D5 - D9
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Roadmap & Expansion Scope
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Features planned beyond the 12-hour MVP scope (CodeSpark 2026). The current MVP focuses on D1 (Energy Mix), D2 (RPO Tracker), D3 (Solar ROI), and D4 (Green Jobs).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROADMAP_MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {item.id}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h2>
                  </div>
                </div>
                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Planned Deliverables
                </p>
                <ul className="space-y-1">
                  {item.deliverables.map((del, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
