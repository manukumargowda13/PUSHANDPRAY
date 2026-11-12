"use client";

import React from "react";
import { Compass, Landmark, RefreshCw, Leaf, Cpu, ShieldAlert, ArrowRight } from "lucide-react";
import { useUserRole } from "@/lib/role-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ROADMAP_MODULES = [
  {
    id: "D5",
    title: "Green Finance & Concessional Debt Aggregator",
    icon: Landmark,
    status: "Phase 2 Delivery",
    color: "teal",
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
    title: "Circular Economy & Solar PV Recycling Ledger",
    icon: RefreshCw,
    status: "Phase 2 Delivery",
    color: "blue",
    description:
      "End-of-life solar panel tracking, authorized e-waste recycler matching under CPCB Battery & E-Waste Management Rules, and critical raw material recovery benchmarks (silver, silicon, glass).",
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
    status: "Phase 2 Delivery",
    color: "green",
    description:
      "Granular avoided PM2.5, SOx, NOx emissions, cooling water withdrawal savings from displaced thermal power, and public healthcare benefit estimations correlated with CPCB air quality indices.",
    deliverables: [
      "CPCB Air Quality Index (AQI) abatement correlation",
      "Thermal cooling tower water withdrawal reduction metrics",
      "Social Cost of Carbon (SCC) economic ledger",
    ],
  },
  {
    id: "D8",
    title: "AI Renewable Forecasting & Battery Storage Dispatch",
    icon: Cpu,
    status: "Phase 3 Delivery",
    color: "purple",
    description:
      "Day-ahead solar and wind generation forecasting using NWP weather models, BESS charge-discharge arbitrage optimization, and Deviation Settlement Mechanism (DSM) penalty avoidance.",
    deliverables: [
      "IEX Real-Time Market (RTM) price arbitrage scheduler",
      "DSM penalty risk mitigation engine",
      "Optimal 2-hour / 4-hour battery storage dispatch profile",
    ],
  },
  {
    id: "D9",
    title: "Enterprise Single Sign-On Regulatory Portals",
    icon: ShieldAlert,
    status: "Phase 3 Delivery",
    color: "amber",
    description:
      "Enterprise RBAC portals with secure DISCOM billing integrations, state SERC petition filing assistants, and audited commercial PPA execution workflows.",
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
    <div className="space-y-8 pb-12">
      <div className="border-b border-ivory-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-navy-50 text-navy-850 px-2.5 py-0.5 rounded border border-navy-200">
            Modules D5 – D9
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            National Clean Energy Expansion Roadmap
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-3xl">
          Scheduled multi-phase expansion roadmap for India Green Grid. Current operational modules include D1 (Energy Mix Radar), D2 (RCO Compliance Tracker), D3 (Rooftop Solar Financial Engine), and D4 (Green Workforce Board).
        </p>
      </div>

      <ErrorBoundary fallbackTitle="Roadmap Information Unavailable">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROADMAP_MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm hover:shadow-lifted hover:border-teal-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-ivory-100 text-teal-800 border border-ivory-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {item.id}
                        </span>
                        <h2 className="text-base font-bold text-navy-950">
                          {item.title}
                        </h2>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-navy-700 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-ivory-200 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Planned Technical Deliverables
                  </p>
                  <ul className="space-y-1.5">
                    {item.deliverables.map((del, i) => (
                      <li key={i} className="text-xs text-navy-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </ErrorBoundary>
    </div>
  );
}
