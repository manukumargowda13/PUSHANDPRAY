"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Sun,
  Zap,
  TrendingUp,
  Leaf,
  Trees,
  Award,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { useUserRole } from "@/lib/role-context";
import { calculateSolarRoi, SolarCalculationResult } from "@/lib/calculators/solar";
import { formatIndianNumber, formatINR, formatPercent } from "@/lib/utils";
import tariffConfig from "@/config/tariffs.json";
import subsidyConfig from "@/config/subsidy.json";

export default function SolarPage() {
  const { roleConfig } = useUserRole();
  const [mounted, setMounted] = useState(false);

  // Form States
  const [state, setState] = useState<string>("Maharashtra");
  const [inputType, setInputType] = useState<"units" | "bill">("bill");
  const [value, setValue] = useState<number>(3500); // ₹3,500 monthly bill
  const [roofArea, setRoofArea] = useState<number>(400); // 400 sq.ft
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [tariffInflation, setTariffInflation] = useState<number>(4.5);
  const [panelDegradation, setPanelDegradation] = useState<number>(0.7);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute Solar ROI dynamically
  const result: SolarCalculationResult = useMemo(() => {
    return calculateSolarRoi({
      state,
      monthlyBillOrUnits: inputType,
      value,
      roofAreaSqFt: roofArea,
      tariffInflationPct: tariffInflation,
      panelDegradationPct: panelDegradation,
    });
  }, [state, inputType, value, roofArea, tariffInflation, panelDegradation]);

  if (!mounted) {
    return null;
  }

  const stateList = Object.keys(tariffConfig.states);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              Module D3
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rooftop Solar ROI & PM Surya Ghar Subsidy Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Evaluate optimal system sizing (kW), calculate <strong>PM Surya Ghar</strong> Central Financial Assistance (CFA) + state subsidies, and forecast 25-year financial savings factoring in panel degradation and tariff escalation.
          </p>
        </div>

        <DataFreshnessBadge
          source={subsidyConfig.source}
          lastUpdated={subsidyConfig.last_updated}
        />
      </div>

      {/* Main Grid: Inputs vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Solar Sizing Parameters</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Pure TypeScript Engine</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* State Selector */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                State Jurisdiction (SERC Slabs):
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {stateList.map((s) => (
                  <option key={s} value={s}>
                    {s} ({tariffConfig.states[s as keyof typeof tariffConfig.states].discom})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Average DISCOM Tariff: ₹{result.tariffDetails.averageTariffInr.toFixed(2)}/kWh
              </p>
            </div>

            {/* Input Type Toggle */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Consumption Metric:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputType("bill");
                    setValue(3500);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                    inputType === "bill"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Monthly Bill (₹)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputType("units");
                    setValue(350);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                    inputType === "units"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Monthly Units (kWh)
                </button>
              </div>
            </div>

            {/* Value Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {inputType === "bill" ? "Average Monthly Electricity Bill:" : "Monthly Units Consumed:"}
                </label>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  {inputType === "bill" ? formatINR(value) : `${value} kWh`}
                </span>
              </div>
              <input
                type="range"
                min={inputType === "bill" ? 500 : 50}
                max={inputType === "bill" ? 25000 : 2500}
                step={inputType === "bill" ? 250 : 25}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{inputType === "bill" ? "₹500" : "50 kWh"}</span>
                <span>{inputType === "bill" ? "₹25,000" : "2,500 kWh"}</span>
              </div>
            </div>

            {/* Roof Area Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  Available Shadow-Free Rooftop Area:
                </label>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {roofArea} sq. ft
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>100 sq.ft (1 kW)</span>
                <span>2,500 sq.ft (25 kW)</span>
              </div>
              {result.roofAreaConstrained && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>
                    System capped at {result.recommendedKw} kW due to {roofArea} sq.ft roof limit (100 sq.ft/kW).
                  </span>
                </div>
              )}
            </div>

            {/* Advanced Settings Accordion */}
            <div className="border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Advanced Parameters (Degradation & Inflation)</span>
                </span>
                <span>{showAdvanced ? "▲" : "▼"}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Annual Tariff Escalation Rate:</span>
                      <span className="font-mono font-bold">{tariffInflation}%</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="8.0"
                      step="0.5"
                      value={tariffInflation}
                      onChange={(e) => setTariffInflation(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Annual Panel Degradation Rate:</span>
                      <span className="font-mono font-bold">{panelDegradation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.5"
                      step="0.1"
                      value={panelDegradation}
                      onChange={(e) => setPanelDegradation(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Financial & Sizing Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recommended System Card */}
          <div className="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50/90 to-yellow-50/70 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Optimal System Sizing
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                    {result.recommendedKw} kW
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    (Requires ~{result.roofAreaRequiredSqFt} sq. ft roof)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Generates ~<strong>{formatIndianNumber(result.annualGenerationYear1Kwh)} kWh/year</strong> (~{result.dailyGenerationAverageKwh} units/day). Offsets estimated monthly consumption of {result.monthlyUnits} units.
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-amber-200 sm:pl-6">
                <span className="text-xs font-semibold text-slate-500">Payback Period</span>
                <p className="text-2xl font-extrabold text-emerald-800 font-mono">
                  {result.paybackPeriodYears} Years
                </p>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Then free power for 20+ years
                </span>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Gross Cost"
              value={formatINR(result.grossSystemCostInr, true)}
              subtitle={`₹${result.benchmarkCostPerKwInr}/kW benchmark`}
              variant="default"
            />
            <StatCard
              title="PM Surya Ghar Subsidy"
              value={formatINR(result.centralSubsidyInr, true)}
              subtitle="Direct Central CFA"
              change={{ value: "Up to ₹78,000", trend: "up" }}
              variant="emerald"
            />
            <StatCard
              title="Net Investment"
              value={formatINR(result.netCostInr, true)}
              subtitle={result.stateSubsidyInr > 0 ? `Incl. ${formatINR(result.stateSubsidyInr)} State Aid` : "After all subsidies"}
              variant="amber"
            />
            <StatCard
              title="Year 1 Savings"
              value={formatINR(result.firstYearSavingsInr, true)}
              subtitle="Electricity bill saved"
              change={{ value: "+4.5% annual tariff growth", trend: "up" }}
              variant="blue"
            />
          </div>

          {/* Subsidy Calculation Breakdown Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>PM Surya Ghar: Muft Bijli Yojana Subsidy Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Central CFA</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {formatINR(result.centralSubsidyInr)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  ₹30k/kW (1-2kW) + ₹18k (3kW)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">{state} State Top-up</span>
                <span className="font-bold text-sky-800 text-sm">
                  {formatINR(result.stateSubsidyInr)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  State policy incentives
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 block text-[11px] font-semibold">Total Benefit</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {formatINR(result.totalSubsidyInr)}
                </span>
                <span className="block text-[10px] text-emerald-700 mt-0.5">
                  {formatPercent((result.totalSubsidyInr / result.grossSystemCostInr) * 100)} of gross cost funded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 25-Year Financial Projection Chart */}
      <ChartCard
        title="25-Year Cumulative Net Financial Savings (₹)"
        subtitle="Accounts for 0.7% annual panel degradation, 4.5% tariff inflation, and Year 12 inverter replacement"
        source="MNRE Financial Benchmark Model"
        lastUpdated="2024-11-01"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={result.yearlyProjection}
              margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} fontSize={11} />
              <YAxis
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                fontSize={11}
              />
              <Tooltip
                formatter={(val: any, name: any) => [formatINR(Number(val)), name]}
                labelFormatter={(yr) => `Year ${yr} Projection`}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area
                type="monotone"
                dataKey="cumulativeSavingsInr"
                name="Cumulative Net Savings (₹)"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSavings)"
              />
              <Line
                type="monotone"
                dataKey="annualSavingsInr"
                name="Annual Bill Savings (₹)"
                stroke="#eab308"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Environmental Impact Banner */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                CEA Grid Emission Baseline Abatement
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {result.co2AvoidedTonsPerYear} Metric Tons of CO₂ Avoided Annually
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Calculated using the official CEA Baseline Emission Factor of <strong>0.716 kg CO₂/kWh</strong>. Over 25 years, this rooftop system avoids <strong>{result.twentyFiveYearCo2AvoidedTons} tons</strong> of greenhouse gas emissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-center bg-white px-5 py-3 rounded-xl border border-emerald-200">
            <Trees className="w-7 h-7 text-emerald-600" />
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Equivalent To</span>
              <p className="text-xl font-extrabold text-slate-900 font-mono">
                {result.treesEquivalent} Trees Planted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
