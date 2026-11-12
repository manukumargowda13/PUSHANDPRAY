"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
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
  Leaf,
  Trees,
  Award,
  AlertCircle,
  Sliders,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TermExplainer } from "@/components/TermExplainer";
import { useUserRole } from "@/lib/role-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { calculateSolarRoi, SolarCalculationResult } from "@/lib/calculators/solar";
import { formatIndianNumber, formatINR, formatPercent } from "@/lib/utils";
import tariffConfig from "@/config/tariffs.json";
import subsidyConfig from "@/config/subsidy.json";

export default function SolarPage() {
  const { roleConfig } = useUserRole();
  const { t } = useLanguage();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-saffron-50 text-saffron-800 px-2.5 py-0.5 rounded border border-saffron-200">
              Module D3
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Rooftop Solar ROI & PM Surya Ghar Subsidy Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-3xl">
            Evaluate optimal system sizing (kW), calculate <strong>PM Surya Ghar</strong> Central Financial Assistance (CFA) + state subsidies, and forecast 25-year financial savings factoring in panel degradation and tariff escalation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TermExplainer termKey="cfa_subsidy" variant="badge" label="Subsidy Guide" />
          <DataFreshnessBadge
            source={subsidyConfig.source}
            lastUpdated={subsidyConfig.last_updated}
          />
        </div>
      </div>

      {/* Main Grid: Inputs vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm space-y-6">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-saffron-50 text-saffron-700">
                <Sun className="w-4 h-4" />
              </div>
              <span>Solar Sizing Parameters</span>
            </h2>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              MNRE Benchmark Engine
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* State Selector */}
            <div>
              <label className="block font-bold text-navy-900 mb-1">
                State Jurisdiction (SERC Tariff Slabs):
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-2 text-xs font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {stateList.map((s) => (
                  <option key={s} value={s}>
                    {s} ({tariffConfig.states[s as keyof typeof tariffConfig.states].discom})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-navy-700 mt-1">
                Average DISCOM Tariff: ₹{result.tariffDetails.averageTariffInr.toFixed(2)}/kWh
              </p>
            </div>

            {/* Input Type Toggle */}
            <div>
              <label className="block font-bold text-navy-900 mb-1">
                Consumption Metric:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputType("bill");
                    setValue(3500);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                    inputType === "bill"
                      ? "bg-navy-900 text-ivory border-navy-900 shadow-2xs"
                      : "bg-ivory-50 text-navy-800 border-ivory-300 hover:bg-ivory-100"
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
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                    inputType === "units"
                      ? "bg-navy-900 text-ivory border-navy-900 shadow-2xs"
                      : "bg-ivory-50 text-navy-800 border-ivory-300 hover:bg-ivory-100"
                  }`}
                >
                  Monthly Units (kWh)
                </button>
              </div>
            </div>

            {/* Value Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-navy-900">
                  {inputType === "bill" ? "Average Monthly Electricity Bill:" : "Monthly Units Consumed:"}
                </label>
                <span className="font-mono font-extrabold text-saffron-800 text-sm">
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
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{inputType === "bill" ? "₹500" : "50 kWh"}</span>
                <span>{inputType === "bill" ? "₹25,000" : "2,500 kWh"}</span>
              </div>
            </div>

            {/* Roof Area Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-navy-900">
                  Available Shadow-Free Rooftop Area:
                </label>
                <span className="font-mono font-extrabold text-navy-950 text-xs">
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
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                <span>100 sq.ft (1 kW)</span>
                <span>2,500 sq.ft (25 kW)</span>
              </div>
              {result.roofAreaConstrained && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-saffron-900 bg-saffron-50 p-2.5 rounded-lg border border-saffron-200">
                  <AlertCircle className="w-3.5 h-3.5 text-saffron-700 flex-shrink-0" />
                  <span>
                    System capped at {result.recommendedKw} kW due to {roofArea} sq.ft roof limit (100 sq.ft/kW).
                  </span>
                </div>
              )}
            </div>

            {/* Advanced Settings Accordion */}
            <div className="border-t border-ivory-200 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-navy-800 hover:text-navy-950 text-xs font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-700" />
                  <span>Advanced Parameters (Degradation & Inflation)</span>
                </span>
                <span>{showAdvanced ? "▲" : "▼"}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 bg-ivory-50 p-3.5 rounded-xl border border-ivory-300">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-navy-700 font-medium">Annual Tariff Escalation Rate:</span>
                      <span className="font-mono font-bold text-navy-950">{tariffInflation}%</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="8.0"
                      step="0.5"
                      value={tariffInflation}
                      onChange={(e) => setTariffInflation(Number(e.target.value))}
                      className="w-full accent-teal-700"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-navy-700 font-medium">Annual Panel Degradation Rate:</span>
                      <span className="font-mono font-bold text-navy-950">{panelDegradation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.5"
                      step="0.1"
                      value={panelDegradation}
                      onChange={(e) => setPanelDegradation(Number(e.target.value))}
                      className="w-full accent-teal-700"
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
          <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-800">
                    Optimal System Sizing
                  </span>
                  <TermExplainer termKey="net_metering" variant="badge" label="Net Metering" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-navy-950">
                    {result.recommendedKw} kW
                  </span>
                  <span className="text-xs text-navy-700 font-medium">
                    (Requires ~{result.roofAreaRequiredSqFt} sq. ft roof)
                  </span>
                </div>
                <p className="text-xs text-navy-700 mt-1">
                  Generates ~<strong>{formatIndianNumber(result.annualGenerationYear1Kwh)} kWh/year</strong> (~{result.dailyGenerationAverageKwh} units/day). Offsets estimated monthly consumption of {result.monthlyUnits} units.
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-ivory-200 sm:pl-6">
                <span className="text-xs font-bold text-slate-500 uppercase">Payback Period</span>
                <p className="text-2xl font-extrabold text-naturalGreen-800 font-mono">
                  {result.paybackPeriodYears} Years
                </p>
                <span className="text-[11px] text-teal-800 font-semibold">
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
              variant="teal"
              explainerKey="cfa_subsidy"
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
              variant="navy"
            />
          </div>

          {/* Subsidy Calculation Breakdown Box */}
          <div className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-warm text-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-navy-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-700" />
                <span>PM Surya Ghar: Muft Bijli Yojana Subsidy Breakdown</span>
              </h3>
              <TermExplainer termKey="cfa_subsidy" variant="badge" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-navy-800">
              <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="text-slate-500 block text-[11px] font-medium">Central CFA</span>
                <span className="font-extrabold text-teal-900 text-sm">
                  {formatINR(result.centralSubsidyInr)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  ₹30k/kW (1-2kW) + ₹18k (3kW)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="text-slate-500 block text-[11px] font-medium">{state} State Top-up</span>
                <span className="font-extrabold text-navy-950 text-sm">
                  {formatINR(result.stateSubsidyInr)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  State policy incentives
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
                <span className="text-teal-900 block text-[11px] font-bold">Total Benefit</span>
                <span className="font-extrabold text-teal-950 text-sm">
                  {formatINR(result.totalSubsidyInr)}
                </span>
                <span className="block text-[10px] text-teal-800 mt-0.5 font-medium">
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
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} fontSize={11} stroke="#64748B" />
              <YAxis
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                fontSize={11}
                stroke="#64748B"
              />
              <Tooltip
                formatter={(val: any, name: any) => [formatINR(Number(val)), name]}
                labelFormatter={(yr) => `Year ${yr} Projection`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  fontSize: "12px",
                  border: "1px solid #CBD5E1",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area
                type="monotone"
                dataKey="cumulativeSavingsInr"
                name="Cumulative Net Savings (₹)"
                stroke="#0F766E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSavings)"
              />
              <Line
                type="monotone"
                dataKey="annualSavingsInr"
                name="Annual Bill Savings (₹)"
                stroke="#D97706"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Environmental Impact Banner */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200">
              <Leaf className="w-8 h-8 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  CEA Grid Emission Baseline Abatement
                </span>
                <TermExplainer termKey="co2_factor" variant="badge" label="Emission Factor" />
              </div>
              <h3 className="text-xl font-extrabold text-navy-950 mt-0.5">
                {result.co2AvoidedTonsPerYear} Metric Tons of CO₂ Avoided Annually
              </h3>
              <p className="text-xs text-navy-700 mt-1 max-w-xl">
                Calculated using the official CEA Baseline Emission Factor of <strong>0.716 kg CO₂/kWh</strong>. Over 25 years, this rooftop system avoids <strong>{result.twentyFiveYearCo2AvoidedTons} tons</strong> of greenhouse gas emissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-center bg-ivory-50 px-5 py-3 rounded-xl border border-ivory-300 shadow-2xs">
            <Trees className="w-7 h-7 text-naturalGreen-700" />
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold">Equivalent To</span>
              <p className="text-xl font-extrabold text-navy-950 font-mono">
                {result.treesEquivalent} Trees Planted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
