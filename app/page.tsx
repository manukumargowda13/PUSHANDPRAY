"use client";

import React from "react";
import Link from "next/link";
import { useUserRole } from "@/lib/role-context";
import {
  Zap,
  BarChart3,
  ShieldCheck,
  Sun,
  Briefcase,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Landmark,
  RefreshCw,
  Leaf,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";

export default function HomePage() {
  const { role, roleConfig } = useUserRole();

  const ROADMAP_MODULES = [
    {
      id: "D5",
      title: "Green Finance & Subsidies Aggregator",
      icon: Landmark,
      color: "text-emerald-700 bg-emerald-100",
      description:
        "Unified marketplace aggregating concessional clean debt facilities from IREDA, SIDBI, NABARD, and PFC for MSMEs and developers.",
      deliverables: ["IREDA clean debt tracker", "SIDBI 4E MSME loan calculator", "Automated DSCR modeling"],
    },
    {
      id: "D6",
      title: "Circular Economy & Solar PV Recycling",
      icon: RefreshCw,
      color: "text-blue-700 bg-blue-100",
      description:
        "Decommissioning ledger for end-of-life solar panels and batteries under CPCB E-Waste Rules with critical raw material recovery tracking.",
      deliverables: ["EPR credit compliance ledger", "Authorized recycler matching", "Silver/Silicon recovery index"],
    },
    {
      id: "D7",
      title: "Environmental & Health Impact Engine",
      icon: Leaf,
      color: "text-teal-700 bg-teal-100",
      description:
        "Fine-grained modeling of avoided PM2.5, SOx, NOx particulates and thermal power cooling water savings, correlated with CPCB air quality indices.",
      deliverables: ["Local Air Quality Index abatement", "Thermal cooling water savings", "Public health benefit index"],
    },
    {
      id: "D8",
      title: "AI Renewable Forecasting & Battery Dispatch",
      icon: Cpu,
      color: "text-purple-700 bg-purple-100",
      description:
        "Day-ahead solar and wind dispatch forecasting using Numerical Weather Prediction (NWP) to minimize Deviation Settlement Mechanism (DSM) penalties.",
      deliverables: ["IEX Real-Time Market arbitrage", "Optimal 2h/4h BESS sizing", "DSM penalty mitigation"],
    },
    {
      id: "D9",
      title: "Role-Based Single Sign-On Enterprise Portals",
      icon: ShieldAlert,
      color: "text-amber-700 bg-amber-100",
      description:
        "Full Supabase RBAC authentication portals with direct DISCOM meter data management (MDM) connectors and SERC regulatory filing tools.",
      deliverables: ["DISCOM automated MDM sync", "SERC petition generator", "Verified GEC certificate wallet"],
    },
  ];

  return (
    <div className="space-y-12 py-4 pb-16">
      {/* Dynamic Stakeholder Lens Banner */}
      <div className="rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Active Stakeholder View:
                </span>
                <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                {roleConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300">
              Focus Area: {roleConfig.focusArea}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>CodeSpark 2026 Hackathon MVP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Turning Fragmented Public Energy Data into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
            Actionable Grid Intelligence
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          India Green Grid bridges the information gap between CEA, NPP, and Grid-India datasets, providing specialized decision-support for citizens, obligated DISCOMs, regulators, and financiers.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-102"
          >
            <span>Explore Energy Mix (D1)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/solar"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar Subsidy Calculator (D3)</span>
          </Link>
        </div>
      </div>

      {/* 3 Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="All-India Installed Capacity"
          value="452.7 GW"
          subtitle="46.3% Clean / Non-Fossil Generation Base"
          change={{ value: "209.5 GW Non-Fossil", trend: "up" }}
          variant="emerald"
          badge="CEA Snapshot"
          icon={<Zap className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Daily Generation Gap"
          value="~70.8%"
          subtitle="Coal Share of Daily Units vs 14% RE"
          change={{ value: "56.8% Generation Gap", trend: "down" }}
          variant="amber"
          badge="NPP Grid"
          icon={<TrendingDown className="w-4 h-4 text-amber-600" />}
        />
        <StatCard
          title="RCO Statutory Mandate"
          value="29.91%"
          subtitle="FY 2024-25 Trajectory -> 43.3% by 2030"
          change={{ value: "Energy Conservation Act", trend: "up" }}
          variant="blue"
          badge="Ministry of Power"
          icon={<ShieldCheck className="w-4 h-4 text-sky-600" />}
        />
      </div>

      {/* 4 Core MVP Feature Modules (D1 - D4) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Core Decision-Support Modules (12-Hour MVP)
            </h2>
            <p className="text-xs text-slate-500">
              Interactive tools designed to answer critical energy transition questions within 30 seconds.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
            4 Modules Ready for Demo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* D1 */}
          <Link
            href="/dashboard"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Module D1
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Energy Mix & Generation Gap Dashboard
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Breakdown of 452.7 GW installed capacity and 4,680 GWh daily dispatch by fuel type (coal, gas, nuclear, hydro, solar, wind). Uncovers the 56.8% structural gap between clean capacity additions and actual daily generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>View Capacity & Dispatch Trends</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D2 */}
          <Link
            href="/rpo"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-sky-100 text-sky-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Module D2
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                RPO / RCO Statutory Compliance Tracker
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Compute clean energy compliance and shortfall in kWh using the statutory formula: <code>Shortfall = (Target % × Consumption) − RE</code>. Tracks against the Ministry of Power trajectory (29.91% to 43.33%) with user position plotted.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>Audit RCO Compliance & Shortfall</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D3 */}
          <Link
            href="/solar"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Module D3
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Rooftop Solar ROI & Subsidy Calculator
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Pure TypeScript financial engine calculating system kW sizing, PM Surya Ghar Central CFA (up to ₹78,000) + state subsidies, net cost, payback years, panel degradation, and 25-year cumulative financial savings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Calculate Sizing, Subsidies & Payback</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D4 */}
          <Link
            href="/jobs"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-800">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Module D4
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Green Jobs & Clean Workforce Board
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Searchable listings across solar PV installation, wind maintenance, battery design, organic agro-PV, and ESG reporting. Features 42 seeded realistic opportunities with multi-category filters and direct application links.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Explore 42 Green Tech Openings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* THE D5-D9 ROADMAP SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full mb-1">
              <Compass className="w-3.5 h-3.5 text-slate-700" />
              <span>Future Scope / Out of 12-Hour Scope</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Product Roadmap: Expansion Modules (D5 – D9)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              These advanced modules (green finance aggregation, circular PV recycling, localized AQI correlation, AI forecasting, and enterprise SSO) are scheduled for subsequent release phases.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          >
            <span>Detailed Roadmap Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROADMAP_MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {item.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-1">
                  {item.deliverables.slice(0, 2).map((del, i) => (
                    <div key={i} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
