"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import {
  Zap,
  Flame,
  Sun,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TermExplainer } from "@/components/TermExplainer";
import { useUserRole } from "@/lib/role-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  getCapacityData,
  getGenerationData,
  getRpoTrajectory,
  CapacityDataset,
  GenerationDataset,
  RpoTrajectoryDataset,
} from "@/lib/data-service";
import { formatIndianNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { roleConfig } = useUserRole();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<CapacityDataset | null>(null);
  const [generation, setGeneration] = useState<GenerationDataset | null>(null);
  const [rpo, setRpo] = useState<RpoTrajectoryDataset | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [capRes, genRes, rpoRes] = await Promise.all([
        getCapacityData(),
        getGenerationData(),
        getRpoTrajectory(),
      ]);
      setCapacity(capRes);
      setGeneration(genRes);
      setRpo(rpoRes);
    } catch (err: any) {
      console.error("[Dashboard] Data fetch error:", err);
      setError(
        "Could not load live regulatory feeds. Snapshot fallbacks are being verified."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-navy-700 font-semibold">
          Loading statutory energy mix snapshots from CEA & NPP...
        </p>
      </div>
    );
  }

  if (error || !capacity || !generation) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4 rounded-2xl border border-ivory-300 bg-white p-8 shadow-warm">
        <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-navy-950">
          Energy Mix Data Temporarily Unavailable
        </h3>
        <p className="text-xs text-navy-700 leading-relaxed">
          {error ||
            "Unable to parse the latest CEA/NPP generation reports. Please retry to load authenticated local snapshots."}
        </p>
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Dashboard</span>
        </button>
      </div>
    );
  }

  // Institutional energy source color mapping
  const sourceColors: Record<string, string> = {
    Coal: "#1E293B", // Midnight Slate/Coal
    Solar: "#D97706", // Amber 600 / Saffron
    Wind: "#0F766E", // Teal 700
    Hydro: "#2563EB", // Blue 600
    Gas: "#B45309", // Warm Amber
    Nuclear: "#7C3AED", // Purple 600
    "Bio Power & Others": "#15803D", // Natural Green
    "Other RE": "#15803D",
    Diesel: "#64748B",
  };

  // 30-Second RCO vs Generation Trajectory data
  const rcoTrajectoryComparison = (rpo?.trajectory || []).map((t) => ({
    year: t.year,
    "Statutory RCO Target %": t.total_pct,
    "Current Daily RE Gen %": generation.daily_snapshot.renewables_share_pct,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Module Title & Data Provenance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded border border-teal-200">
              Module D1
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              All-India Energy Mix & Generation Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-3xl">
            Live public energy transition radar monitoring <strong>452.7 GW</strong> of installed capacity and <strong>4,680 GWh/day</strong> of generation, exposing the structural gap between capacity additions and actual daily dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DataFreshnessBadge source={capacity.source} lastUpdated={capacity.as_of} />
          <DataFreshnessBadge source={generation.source} lastUpdated={generation.as_of} />
        </div>
      </div>

      {/* Stakeholder Lens Banner */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-4 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-navy-900 text-ivory font-bold">
              {roleConfig.badge}
            </div>
            <div>
              <span className="font-bold text-navy-950">Stakeholder Takeaway:</span>{" "}
              <span className="text-navy-700">{roleConfig.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-teal-900 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <span>Focus: {roleConfig.focusArea}</span>
          </div>
        </div>
      </div>

      {/* 30-Second Snapshot Alert */}
      <div className="rounded-2xl border border-saffron-300 bg-saffron-50/70 p-4 text-xs text-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-warm">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-saffron-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-navy-950">30-Second Executive Insight:</span>
              <TermExplainer termKey="coal_gap" variant="badge" label="Explain The Gap" />
            </div>
            <p className="mt-1 text-navy-800 leading-relaxed">
              India has achieved <strong>46.3% non-fossil installed capacity</strong> (209.5 GW), yet coal still generates <strong>70.8% of daily kilowatt-hours</strong>. Closing this <strong>56.8% gap</strong> requires aggressive battery energy storage (BESS) and pumped hydro storage to dispatch solar and wind during evening peak hours.
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] font-bold bg-saffron-100 text-saffron-900 border border-saffron-300 px-2.5 py-1 rounded-lg whitespace-nowrap self-start sm:self-center">
          Gap: 56.8% Points
        </span>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("statTotalCapacityTitle", "Total Installed Capacity")}
          value="452.7 GW"
          subtitle="All-India Generation Base"
          change={{ value: "+46.28% Non-Fossil", trend: "up" }}
          variant="teal"
          badge="CEA Record"
          explainerKey="capacity_vs_generation"
          icon={<Zap className="w-4 h-4 text-teal-700" />}
        />
        <StatCard
          title="Renewable Capacity (RES)"
          value="154.6 GW"
          subtitle="Solar, Wind, Biomass, Small Hydro"
          change={{ value: "34.15% of National Grid", trend: "up" }}
          variant="default"
          badge="MNRE / CEA"
          icon={<Sun className="w-4 h-4 text-saffron-600" />}
        />
        <StatCard
          title={t("statCoalDailyTitle", "Thermal Coal Generation")}
          value="70.83%"
          subtitle="3,315.2 GWh of Daily Power"
          change={{ value: "Base-Load Dominance", trend: "neutral" }}
          variant="amber"
          badge="NPP Grid"
          explainerKey="coal_gap"
          icon={<Flame className="w-4 h-4 text-saffron-700" />}
        />
        <StatCard
          title={t("statGenerationGapTitle", "Coal vs Renewables Gap")}
          value="56.83%"
          subtitle="Actual Daily Generation Gap"
          change={{ value: "RE PLF: ~21% vs Coal: ~68%", trend: "down" }}
          variant="navy"
          badge="Grid-India"
          explainerKey="capacity_vs_generation"
          icon={<TrendingDown className="w-4 h-4 text-saffron-400" />}
        />
      </div>

      {/* HIGHLIGHTED SECTION: The Coal vs Renewables Gap */}
      <ErrorBoundary fallbackTitle="Generation Gap Analysis Unavailable">
        <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Core Structural Analysis
                </span>
                <TermExplainer termKey="coal_gap" variant="badge" />
              </div>
              <h2 className="text-xl font-extrabold text-navy-950 tracking-tight mt-1">
                The "Coal vs Renewables" Generation Gap
              </h2>
              <p className="text-xs text-navy-700 mt-0.5">
                Why installed capacity parity does not equal electricity generation parity in India.
              </p>
            </div>
            <DataFreshnessBadge source="CEA Installed Capacity vs NPP Generation" lastUpdated="2024-11-10" />
          </div>

          {/* Visual Gap Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Capacity bar */}
            <div className="space-y-3 p-4 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy-950">1. Installed Capacity Share (452.7 GW)</span>
                <span className="font-mono text-teal-800 font-bold">Near Parity (48% vs 46%)</span>
              </div>
              <div className="h-6 w-full rounded-full bg-ivory-200 overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
                <div
                  style={{ width: "48.1%" }}
                  className="bg-navy-900 flex items-center justify-center"
                  title="Coal: 48.06%"
                >
                  Coal 48.1%
                </div>
                <div
                  style={{ width: "46.3%" }}
                  className="bg-teal-700 flex items-center justify-center"
                  title="Non-Fossil: 46.28%"
                >
                  Clean RE 46.3%
                </div>
                <div
                  style={{ width: "5.6%" }}
                  className="bg-saffron-600 flex items-center justify-center text-[9px]"
                  title="Gas/Diesel: 5.6%"
                >
                  Gas
                </div>
              </div>
              <p className="text-[11px] text-navy-700">
                Clean and renewable sources (Solar, Wind, Hydro, Nuclear) comprise <strong>46.28%</strong> of total capacity.
              </p>
            </div>

            {/* Actual generation bar */}
            <div className="space-y-3 p-4 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy-950">2. Actual Daily Generation Share (4,680 GWh)</span>
                <span className="font-mono text-rose-700 font-bold">Disparity (71% vs 25%)</span>
              </div>
              <div className="h-6 w-full rounded-full bg-ivory-200 overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
                <div
                  style={{ width: "70.8%" }}
                  className="bg-navy-900 flex items-center justify-center"
                  title="Coal: 70.83%"
                >
                  Coal 70.8%
                </div>
                <div
                  style={{ width: "25.3%" }}
                  className="bg-teal-700 flex items-center justify-center"
                  title="Clean / RE: 25.31%"
                >
                  Clean 25.3%
                </div>
                <div
                  style={{ width: "3.9%" }}
                  className="bg-saffron-600 flex items-center justify-center text-[9px]"
                  title="Gas: 3.86%"
                >
                  Gas
                </div>
              </div>
              <p className="text-[11px] text-navy-700">
                Due to weather intermittency and evening peak timings, coal generates <strong>70.83%</strong> of daily energy.
              </p>
            </div>
          </div>

          {/* Root Causes & Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-ivory-300 p-3.5 bg-white shadow-2xs">
              <h4 className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Plant Load Factor (PLF)</span>
              </h4>
              <p className="text-[11px] text-navy-700 mt-1 leading-relaxed">
                Thermal coal operates 24x7 at <strong>65-75% PLF</strong>, while solar generates only ~4-5 equivalent peak hours/day (<strong>~21% CUF</strong>).
              </p>
            </div>
            <div className="rounded-xl border border-ivory-300 p-3.5 bg-white shadow-2xs">
              <h4 className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Evening Peak Deficit</span>
              </h4>
              <p className="text-[11px] text-navy-700 mt-1 leading-relaxed">
                India's maximum grid demand occurs between <strong>7 PM - 10 PM</strong> when solar output drops to zero, requiring thermal plants to ramp up.
              </p>
            </div>
            <div className="rounded-xl border border-ivory-300 p-3.5 bg-white shadow-2xs">
              <h4 className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>The BESS Imperative</span>
              </h4>
              <p className="text-[11px] text-navy-700 mt-1 leading-relaxed">
                Meeting the 2030 target requires pairing 40+ GW of battery storage (BESS) and pumped hydro to time-shift daytime solar power.
              </p>
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {/* Row 1 Charts: Capacity Breakdown & Daily Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Installed Capacity by Fuel Source */}
        <ChartCard
          title="Installed Capacity by Source (MW)"
          subtitle="All-India generation assets registered under CEA"
          source={capacity.source}
          lastUpdated={capacity.as_of}
          explainerKey="capacity_vs_generation"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacity.national_summary.by_source}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)} GW`}
                  fontSize={11}
                  stroke="#64748B"
                />
                <YAxis
                  dataKey="source"
                  type="category"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={85}
                  stroke="#0F172A"
                />
                <Tooltip
                  formatter={(value: any) => [`${formatIndianNumber(Number(value))} MW`, "Capacity"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "12px",
                    border: "1px solid #CBD5E1",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Bar dataKey="mw" radius={[0, 4, 4, 0]}>
                  {capacity.national_summary.by_source.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sourceColors[entry.source] || "#0F766E"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Daily Generation Time-Series Trend */}
        <ChartCard
          title="Recent Daily Generation Trend (GWh)"
          subtitle="Fuel dispatch over recent reporting days"
          source={generation.source}
          lastUpdated={generation.as_of}
          explainerKey="coal_gap"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generation.recent_daily_trend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCoal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E293B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1E293B" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" fontSize={11} tickFormatter={(d) => d.slice(5)} stroke="#64748B" />
                <YAxis fontSize={11} tickFormatter={(val) => `${val}`} stroke="#64748B" />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} GWh`, name]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "12px",
                    border: "1px solid #CBD5E1",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="coal" name="Coal" stroke="#1E293B" fillOpacity={1} fill="url(#colorCoal)" />
                <Area type="monotone" dataKey="solar" name="Solar" stroke="#D97706" fillOpacity={1} fill="url(#colorSolar)" />
                <Area type="monotone" dataKey="wind" name="Wind" stroke="#0F766E" fillOpacity={1} fill="url(#colorWind)" />
                <Line type="monotone" dataKey="hydro" name="Hydro" stroke="#2563EB" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: State Comparison & RCO Trajectory Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Capacity Comparison */}
        <ChartCard
          title="State-Level Clean Energy Leaders (MW)"
          subtitle="Solar, Wind and Coal capacity in leading states"
          source="CEA State Reports"
          lastUpdated={capacity.as_of}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacity.state_snapshots}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="state" fontSize={11} stroke="#64748B" />
                <YAxis fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} stroke="#64748B" />
                <Tooltip
                  formatter={(val: any, name: any) => [`${formatIndianNumber(Number(val))} MW`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", fontSize: "12px", border: "1px solid #CBD5E1" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="solar_mw" name="Solar (MW)" fill="#D97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wind_mw" name="Wind (MW)" fill="#0F766E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="coal_mw" name="Coal (MW)" fill="#1E293B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 30-Second RCO Statutory Trajectory Benchmark */}
        <ChartCard
          title="RCO Trajectory vs Current RE Generation (%)"
          subtitle="Ministry of Power statutory target (29.9% to 43.3%)"
          source="Ministry of Power Gazette (Oct 2023)"
          lastUpdated={rpo?.last_updated}
          explainerKey="rco_obligation"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rcoTrajectoryComparison}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" fontSize={11} stroke="#64748B" />
                <YAxis fontSize={11} domain={[0, 50]} tickFormatter={(v) => `${v}%`} stroke="#64748B" />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", fontSize: "12px", border: "1px solid #CBD5E1" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="Statutory RCO Target %"
                  stroke="#0F766E"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="stepAfter"
                  dataKey="Current Daily RE Gen %"
                  stroke="#E11D48"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
