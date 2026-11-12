"use client";

import React from "react";
import Link from "next/link";
import { useUserRole } from "@/lib/role-context";
import { useLanguage } from "@/lib/i18n/language-context";
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
  Compass,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { IndiaProgressSnapshot } from "@/components/IndiaProgressSnapshot";
import { SimpleEnergyExplainer } from "@/components/SimpleEnergyExplainer";
import { TermExplainer } from "@/components/TermExplainer";

export default function HomePage() {
  const { roleConfig } = useUserRole();
  const { t } = useLanguage();

  const ROADMAP_MODULES = [
    {
      id: "D5",
      title: "Green Finance & Subsidies Aggregator",
      icon: Landmark,
      color: "text-naturalGreen-700 bg-naturalGreen-50 border border-naturalGreen-200",
      description:
        "Unified marketplace aggregating concessional clean debt facilities from IREDA, SIDBI, NABARD, and PFC for MSMEs and developers.",
      deliverables: ["IREDA clean debt tracker", "SIDBI 4E MSME loan calculator", "Automated DSCR modeling"],
    },
    {
      id: "D6",
      title: "Circular Economy & Solar PV Recycling",
      icon: RefreshCw,
      color: "text-sky-700 bg-sky-50 border border-sky-200",
      description:
        "Decommissioning ledger for end-of-life solar panels and batteries under CPCB E-Waste Rules with critical raw material recovery tracking.",
      deliverables: ["EPR credit compliance ledger", "Authorized recycler matching", "Silver/Silicon recovery index"],
    },
    {
      id: "D7",
      title: "Environmental & Health Impact Engine",
      icon: Leaf,
      color: "text-teal-700 bg-teal-50 border border-teal-200",
      description:
        "Fine-grained modeling of avoided PM2.5, SOx, NOx particulates and thermal power cooling water savings, correlated with CPCB air quality indices.",
      deliverables: ["Local Air Quality Index abatement", "Thermal cooling water savings", "Public health benefit index"],
    },
    {
      id: "D8",
      title: "AI Renewable Forecasting & Battery Dispatch",
      icon: Cpu,
      color: "text-purple-700 bg-purple-50 border border-purple-200",
      description:
        "Day-ahead solar and wind dispatch forecasting using Numerical Weather Prediction (NWP) to minimize Deviation Settlement Mechanism (DSM) penalties.",
      deliverables: ["IEX Real-Time Market arbitrage", "Optimal 2h/4h BESS sizing", "DSM penalty mitigation"],
    },
    {
      id: "D9",
      title: "Enterprise Regulatory Portals",
      icon: ShieldAlert,
      color: "text-saffron-700 bg-saffron-50 border border-saffron-200",
      description:
        "Enterprise RBAC authentication portals with direct DISCOM meter data management (MDM) connectors and SERC regulatory filing tools.",
      deliverables: ["DISCOM automated MDM sync", "SERC petition generator", "Verified GEC certificate wallet"],
    },
  ];

  return (
    <div className="space-y-10 py-2 pb-16">
      {/* Stakeholder Perspective Banner */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-4 sm:p-5 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-navy-900 text-ivory mt-0.5 shadow-2xs">
              <Sparkles className="w-4 h-4 text-saffron-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-navy-700">
                  {t("roleLensLabel", "Stakeholder Perspective")}:
                </span>
                <span className="text-xs font-extrabold text-navy-950 bg-ivory-100 px-2.5 py-0.5 rounded-md border border-ivory-300">
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-xs text-navy-700 mt-1 leading-snug">
                {roleConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
              Focus: {roleConfig.focusArea}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-bold text-teal-900 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-saffron-600 fill-current" />
          <span>{t("statutoryBadge", "National Clean Energy Observatory")}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight">
          Turning Fragmented Public Energy Data into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-saffron-600">
            Actionable Grid Intelligence
          </span>
        </h1>
        <p className="text-sm sm:text-base text-navy-700 leading-relaxed max-w-2xl mx-auto">
          India Green Grid bridges the information gap between CEA, NPP, and Grid-India datasets, providing specialized decision-support for citizens, obligated DISCOMs, regulators, and financiers.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-bold text-white shadow-warm hover:bg-teal-800 transition-all hover:scale-102"
          >
            <span>{t("viewDashboard", "Explore Energy Mix")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/solar"
            className="inline-flex items-center gap-2 rounded-xl border border-ivory-300 bg-white px-5 py-2.5 text-xs font-bold text-navy-900 shadow-warm hover:bg-ivory-50 transition-all"
          >
            <Sun className="w-4 h-4 text-saffron-600" />
            <span>{t("calculateSavings", "Calculate Solar Savings")}</span>
          </Link>
        </div>
      </div>

      {/* 3 Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={t("statTotalCapacityTitle", "All-India Installed Capacity")}
          value="452.7 GW"
          subtitle={t("statCleanShare", "46.3% Clean / Non-Fossil Generation Base")}
          change={{ value: "209.5 GW Non-Fossil", trend: "up" }}
          variant="teal"
          badge="CEA Statutory Record"
          explainerKey="capacity_vs_generation"
          icon={<Zap className="w-4 h-4 text-teal-700" />}
        />
        <StatCard
          title={t("statGenerationGapTitle", "Daily Generation Gap")}
          value="~70.8%"
          subtitle="Coal Share of Daily Units vs 14% RE"
          change={{ value: "56.8% Generation Gap", trend: "down" }}
          variant="amber"
          badge="NPP Grid Dispatch"
          explainerKey="coal_gap"
          icon={<TrendingDown className="w-4 h-4 text-saffron-700" />}
        />
        <StatCard
          title={t("statRcoMandateTitle", "Statutory RCO Mandate")}
          value="29.91%"
          subtitle="FY 2024-25 Trajectory → 43.3% by 2030"
          change={{ value: "Energy Conservation Act", trend: "up" }}
          variant="navy"
          badge="Ministry of Power"
          explainerKey="rco_obligation"
          icon={<ShieldCheck className="w-4 h-4 text-saffron-400" />}
        />
      </div>

      {/* India's 500 GW Progress Snapshot */}
      <IndiaProgressSnapshot />

      {/* Citizen Simple Energy Explainer */}
      <SimpleEnergyExplainer />

      {/* 4 Core Decision-Support Modules (D1 - D4) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-navy-950 tracking-tight">
              Core Decision-Support Modules
            </h2>
            <p className="text-xs text-navy-700">
              Interactive statutory tools designed to answer critical energy transition questions within 30 seconds.
            </p>
          </div>
          <span className="text-xs text-teal-800 font-bold bg-teal-50 px-3 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
            Live Operational Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* D1 */}
          <Link
            href="/dashboard"
            className="group rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm hover:border-teal-400 hover:shadow-lifted transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                  <BarChart3 className="w-5 h-5 text-teal-700" />
                </div>
                <span className="text-xs font-mono font-bold bg-ivory-100 text-navy-800 px-2 py-0.5 rounded border border-ivory-200">
                  Module D1
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-950 group-hover:text-teal-700 transition-colors">
                Energy Mix & Generation Gap Dashboard
              </h3>
              <p className="text-xs text-navy-700 mt-1.5 leading-relaxed">
                Breakdown of 452.7 GW installed capacity and 4,680 GWh daily dispatch by fuel type (coal, gas, nuclear, hydro, solar, wind). Uncovers the 56.8% structural gap between clean capacity additions and actual daily generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs font-bold text-teal-800">
              <span>View Capacity & Dispatch Trends</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D2 */}
          <Link
            href="/rpo"
            className="group rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm hover:border-navy-400 hover:shadow-lifted transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-navy-50 text-navy-850 border border-navy-200">
                  <ShieldCheck className="w-5 h-5 text-navy-850" />
                </div>
                <span className="text-xs font-mono font-bold bg-ivory-100 text-navy-800 px-2 py-0.5 rounded border border-ivory-200">
                  Module D2
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-950 group-hover:text-navy-800 transition-colors">
                RPO / RCO Statutory Compliance Tracker
              </h3>
              <p className="text-xs text-navy-700 mt-1.5 leading-relaxed">
                Compute clean energy compliance and shortfall in kWh using the statutory formula: <code>Shortfall = (Target % × Consumption) − RE</code>. Tracks against the Ministry of Power trajectory (29.91% to 43.33%) with user position plotted.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs font-bold text-navy-850">
              <span>Audit RCO Compliance & Shortfall</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D3 */}
          <Link
            href="/solar"
            className="group rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm hover:border-saffron-400 hover:shadow-lifted transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-saffron-50 text-saffron-800 border border-saffron-200">
                  <Sun className="w-5 h-5 text-saffron-700" />
                </div>
                <span className="text-xs font-mono font-bold bg-ivory-100 text-navy-800 px-2 py-0.5 rounded border border-ivory-200">
                  Module D3
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-950 group-hover:text-saffron-800 transition-colors">
                Rooftop Solar ROI & Subsidy Calculator
              </h3>
              <p className="text-xs text-navy-700 mt-1.5 leading-relaxed">
                Deterministic financial engine calculating system kW sizing, PM Surya Ghar Central CFA (up to ₹78,000) + state subsidies, net cost, payback years, panel degradation, and 25-year cumulative financial savings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs font-bold text-saffron-800">
              <span>Calculate Sizing, Subsidies & Payback</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* D4 */}
          <Link
            href="/jobs"
            className="group rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm hover:border-naturalGreen-400 hover:shadow-lifted transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-naturalGreen-50 text-naturalGreen-800 border border-naturalGreen-200">
                  <Briefcase className="w-5 h-5 text-naturalGreen-700" />
                </div>
                <span className="text-xs font-mono font-bold bg-ivory-100 text-navy-800 px-2 py-0.5 rounded border border-ivory-200">
                  Module D4
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-950 group-hover:text-naturalGreen-800 transition-colors">
                Green Jobs & Clean Workforce Board
              </h3>
              <p className="text-xs text-navy-700 mt-1.5 leading-relaxed">
                Searchable listings across solar PV installation, wind maintenance, battery design, organic agro-PV, and ESG reporting. Features verified public opportunities with multi-category filters and direct application links.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs font-bold text-naturalGreen-800">
              <span>Explore Verified Clean Tech Openings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* ROADMAP SECTION (D5 - D9) */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-6 sm:p-8 space-y-6 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-800 bg-ivory-100 px-2.5 py-0.5 rounded-full mb-1 border border-ivory-200">
              <Compass className="w-3.5 h-3.5 text-navy-700" />
              <span>National Expansion Roadmap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
              Product Roadmap: Expansion Modules (D5 – D9)
            </h2>
            <p className="text-xs text-navy-700 mt-1 max-w-2xl">
              Advanced modules (green finance aggregation, circular PV recycling, localized AQI correlation, AI forecasting, and enterprise SSO) scheduled for subsequent release phases.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 self-start sm:self-auto bg-ivory-50 px-3 py-1.5 rounded-lg border border-ivory-300 shadow-2xs transition-colors"
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
                className="rounded-xl border border-ivory-300 bg-ivory-50/50 p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {item.id}
                    </span>
                    <h3 className="text-xs font-bold text-navy-950 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-navy-700 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-ivory-200 pt-2 space-y-1">
                  {item.deliverables.slice(0, 2).map((del, i) => (
                    <div key={i} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-teal-600" />
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
