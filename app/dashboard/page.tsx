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
  PieChart,
  Pie,
} from "recharts";
import {
  Zap,
  Flame,
  Sun,
  Wind,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { useUserRole } from "@/lib/role-context";
import {
  getCapacityData,
  getGenerationData,
  getRpoTrajectory,
  CapacityDataset,
  GenerationDataset,
  RpoTrajectoryDataset,
} from "@/lib/data-service";
import { formatIndianNumber, formatEnergy, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const { roleConfig } = useUserRole();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [capacity, setCapacity] = useState<CapacityDataset | null>(null);
  const [generation, setGeneration] = useState<GenerationDataset | null>(null);
  const [rpo, setRpo] = useState<RpoTrajectoryDataset | null>(null);
  const [activeStateTab, setActiveStateTab] = useState<string>("National");

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [capRes, genRes, rpoRes] = await Promise.all([
          getCapacityData(),
          getGenerationData(),
          getRpoTrajectory(),
        ]);
        setCapacity(capRes);
        setGeneration(genRes);
        setRpo(rpoRes);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted || loading || !capacity || !generation) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">
          Loading statutory energy mix snapshots from CEA & NPP...
        </p>
      </div>
    );
  }

  // Energy source colors mapping
  const sourceColors: Record<string, string> = {
    Coal: "#374151", // Slate 700 / Charcoal
    Solar: "#eab308", // Yellow 500
    Wind: "#10b981", // Emerald 500
    Hydro: "#2563eb", // Blue 600
    Gas: "#d97706", // Amber 600
    Nuclear: "#9333ea", // Purple 600
    "Bio Power & Others": "#14b8a6", // Teal 500
    "Other RE": "#14b8a6",
    Diesel: "#6b7280",
  };

  // Prepare Gap Comparison Data
  const gapComparisonData = [
    {
      metric: "Installed Capacity Share",
      Coal: capacity.national_summary.by_source.find((s) => s.source === "Coal")?.share_pct || 48.06,
      RenewablesClean: capacity.national_summary.non_fossil_share_pct || 46.28,
      Gap: Math.abs((capacity.national_summary.by_source.find((s) => s.source === "Coal")?.share_pct || 48.06) - (capacity.national_summary.non_fossil_share_pct || 46.28)),
    },
    {
      metric: "Actual Daily Generation Share",
      Coal: generation.daily_snapshot.thermal_coal_share_pct,
      RenewablesClean: generation.daily_snapshot.total_clean_share_pct,
      Gap: Number((generation.daily_snapshot.thermal_coal_share_pct - generation.daily_snapshot.total_clean_share_pct).toFixed(1)),
    },
  ];

  // 30-Second RCO vs Generation Trajectory data
  const rcoTrajectoryComparison = (rpo?.trajectory || []).map((t) => ({
    year: t.year,
    "Statutory RCO Target %": t.total_pct,
    "Current Daily RE Gen %": generation.daily_snapshot.renewables_share_pct,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Module Title & Data Provenance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Module D1
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All-India Energy Mix & Generation Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Live public energy transition radar monitoring <strong>452.7 GW</strong> of installed capacity and <strong>4,680 GWh/day</strong> of generation, exposing the structural gap between capacity additions and actual daily dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DataFreshnessBadge source={capacity.source} lastUpdated={capacity.as_of} />
          <DataFreshnessBadge source={generation.source} lastUpdated={generation.as_of} />
        </div>
      </div>

      {/* Role Lens Banner */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-sky-50/80 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold">
              {roleConfig.badge}
            </div>
            <div>
              <span className="font-bold text-slate-900">Stakeholder Takeaway:</span>{" "}
              <span className="text-slate-700">{roleConfig.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-emerald-200">
            <span>Focus Area: {roleConfig.focusArea}</span>
          </div>
        </div>
      </div>

      {/* 30-Second Snapshot Alert */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">30-Second Executive Insight:</span>
            <span className="ml-1 text-slate-700">
              India has achieved <strong>46.3% non-fossil installed capacity</strong> (209.5 GW), yet coal still generates <strong>70.8% of daily kilowatt-hours</strong>. Closing this <strong>56.8% gap</strong> requires aggressive battery energy storage (BESS) and pumped hydro storage to dispatch solar and wind during evening peak hours.
            </span>
          </div>
        </div>
        <span className="font-mono text-[11px] font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded whitespace-nowrap self-start sm:self-center">
          Gap: 56.8% Points
        </span>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Installed Capacity"
          value="452.7 GW"
          subtitle="All-India Generation Base"
          change={{ value: "+46.28% Non-Fossil", trend: "up" }}
          variant="emerald"
          badge="CEA"
          icon={<Zap className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Renewable Capacity (RES)"
          value="154.6 GW"
          subtitle="Solar, Wind, Biomass, Small Hydro"
          change={{ value: "34.15% of National Grid", trend: "up" }}
          variant="blue"
          badge="MNRE / CEA"
          icon={<Sun className="w-4 h-4 text-sky-600" />}
        />
        <StatCard
          title="Thermal Coal Generation"
          value="70.83%"
          subtitle="3,315.2 GWh of Daily Power"
          change={{ value: "Base-Load Dominance", trend: "neutral" }}
          variant="amber"
          badge="NPP Grid"
          icon={<Flame className="w-4 h-4 text-amber-600" />}
        />
        <StatCard
          title="Coal vs Renewables Gap"
          value="56.83%"
          subtitle="Actual Daily Generation Gap"
          change={{ value: "RE PLF: ~21% vs Coal: ~68%", trend: "down" }}
          variant="purple"
          badge="Grid-India"
          icon={<TrendingDown className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* HIGHLIGHTED SECTION: The Coal vs Renewables Gap */}
      <div className="rounded-xl border-2 border-emerald-500/30 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>Core Problem Statement</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              The "Coal vs Renewables" Generation Gap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Why installed capacity parity does not equal electricity generation parity.
            </p>
          </div>
          <DataFreshnessBadge source="CEA Installed Capacity vs NPP Generation" lastUpdated="2024-11-10" />
        </div>

        {/* Visual Gap Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Capacity bar */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">1. Installed Capacity Share (452.7 GW)</span>
              <span className="font-mono text-emerald-700 font-bold">Near Parity (48% vs 46%)</span>
            </div>
            <div className="h-6 w-full rounded-full bg-slate-200 overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
              <div
                style={{ width: "48.1%" }}
                className="bg-slate-700 flex items-center justify-center"
                title="Coal: 48.06%"
              >
                Coal 48.1%
              </div>
              <div
                style={{ width: "46.3%" }}
                className="bg-emerald-600 flex items-center justify-center"
                title="Non-Fossil: 46.28%"
              >
                Clean RE 46.3%
              </div>
              <div
                style={{ width: "5.6%" }}
                className="bg-amber-600 flex items-center justify-center text-[9px]"
                title="Gas/Diesel: 5.6%"
              >
                Gas
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Clean and renewable sources (Solar, Wind, Hydro, Nuclear) comprise <strong>46.28%</strong> of total capacity.
            </p>
          </div>

          {/* Actual generation bar */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">2. Actual Daily Generation Share (4,680 GWh)</span>
              <span className="font-mono text-rose-700 font-bold">Huge Disparity (71% vs 25%)</span>
            </div>
            <div className="h-6 w-full rounded-full bg-slate-200 overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
              <div
                style={{ width: "70.8%" }}
                className="bg-slate-700 flex items-center justify-center"
                title="Coal: 70.83%"
              >
                Coal 70.8%
              </div>
              <div
                style={{ width: "25.3%" }}
                className="bg-emerald-600 flex items-center justify-center"
                title="Clean / RE: 25.31%"
              >
                Clean 25.3%
              </div>
              <div
                style={{ width: "3.9%" }}
                className="bg-amber-600 flex items-center justify-center text-[9px]"
                title="Gas: 3.86%"
              >
                Gas
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Due to intermittency and weather variation, coal generates <strong>70.83%</strong> of daily energy, while renewables contribute only <strong>14.0%</strong>.
            </p>
          </div>
        </div>

        {/* Root Causes & Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Plant Load Factor (PLF)</span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Thermal coal operates 24x7 at <strong>65-75% PLF</strong>, while solar generates only ~4-5 equivalent hours/day (<strong>~21% CUF</strong>).
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evening Peak Deficit</span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              India's maximum grid demand occurs between <strong>7 PM - 10 PM</strong> when solar output drops to zero, requiring thermal ramping.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>The BESS Imperative</span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Meeting the 2030 target requires pairing 40+ GW of battery and pumped hydro storage to time-shift daytime solar generation.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Capacity Breakdown & Daily Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Installed Capacity by Fuel Source */}
        <ChartCard
          title="Installed Capacity by Source (MW)"
          subtitle="All-India generation assets registered under CEA"
          source={capacity.source}
          lastUpdated={capacity.as_of}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacity.national_summary.by_source}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)} GW`}
                  fontSize={11}
                />
                <YAxis
                  dataKey="source"
                  type="category"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value: any) => [`${formatIndianNumber(Number(value))} MW`, "Capacity"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="mw" radius={[0, 4, 4, 0]}>
                  {capacity.national_summary.by_source.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sourceColors[entry.source] || "#059669"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Daily Generation Time-Series Trend */}
        <ChartCard
          title="Recent Daily Generation Trend (GWh)"
          subtitle="Fuel dispatch over the past 11 reporting days"
          source={generation.source}
          lastUpdated={generation.as_of}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generation.recent_daily_trend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCoal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis fontSize={11} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} GWh`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="coal" name="Coal" stroke="#374151" fillOpacity={1} fill="url(#colorCoal)" />
                <Area type="monotone" dataKey="solar" name="Solar" stroke="#eab308" fillOpacity={1} fill="url(#colorSolar)" />
                <Area type="monotone" dataKey="wind" name="Wind" stroke="#10b981" fillOpacity={1} fill="url(#colorWind)" />
                <Line type="monotone" dataKey="hydro" name="Hydro" stroke="#2563eb" strokeWidth={2} dot={false} />
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
          subtitle="Solar and Wind installed capacity in top states"
          source="CEA State Reports"
          lastUpdated={capacity.as_of}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacity.state_snapshots}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="state" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${formatIndianNumber(Number(val))} MW`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="solar_mw" name="Solar (MW)" fill="#eab308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wind_mw" name="Wind (MW)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="coal_mw" name="Coal (MW)" fill="#374151" radius={[4, 4, 0, 0]} />
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
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rcoTrajectoryComparison}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={11} />
                <YAxis fontSize={11} domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="Statutory RCO Target %"
                  stroke="#059669"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="stepAfter"
                  dataKey="Current Daily RE Gen %"
                  stroke="#ef4444"
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
