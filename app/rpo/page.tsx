"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { useUserRole } from "@/lib/role-context";
import { calculateRpoCompliance, RpoOutput } from "@/lib/calculators/rpo";
import { formatIndianNumber, formatPercent } from "@/lib/utils";
import rpoConfig from "@/config/rpo_trajectory.json";

export default function RpoPage() {
  const { roleConfig } = useUserRole();
  const [mounted, setMounted] = useState(false);

  // Form Inputs
  const [selectedYear, setSelectedYear] = useState<string>("2024-25");
  const [totalConsumption, setTotalConsumption] = useState<number>(1000000); // 10 Lakh kWh
  const [renewableConsumption, setRenewableConsumption] = useState<number>(220000); // 2.2 Lakh kWh (22%)
  const [entityType, setEntityType] = useState<string>("Open Access Consumer");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute compliance using pure calculation engine
  const calculation: RpoOutput = useMemo(() => {
    return calculateRpoCompliance({
      totalConsumptionKwh: totalConsumption,
      renewableConsumptionKwh: renewableConsumption,
      year: selectedYear,
    });
  }, [totalConsumption, renewableConsumption, selectedYear]);

  // Quick preset consumption buttons
  const presets = [
    { label: "10 Lakh kWh (1 GWh)", value: 1000000 },
    { label: "50 Lakh kWh (5 GWh)", value: 5000000 },
    { label: "1 Crore kWh (10 GWh)", value: 10000000 },
    { label: "5 Crore kWh (50 GWh)", value: 50000000 },
  ];

  // Chart data formatting: merge user's actual position into trajectory
  const trajectoryChartData = useMemo(() => {
    return (rpoConfig.trajectory || []).map((t) => {
      const isSelectedYear = t.year === selectedYear;
      return {
        year: t.year,
        "Statutory RCO Target %": t.total_pct,
        "Wind Target %": t.wind_pct,
        "Hydro Target %": t.hydro_pct,
        "Other RE %": t.other_re_pct,
        "Your Compliance %": isSelectedYear ? calculation.actualPct : null,
      };
    });
  }, [selectedYear, calculation.actualPct]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
              Module D2
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              RPO / RCO Statutory Compliance Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Audit compliance percentage, calculate required clean energy volume, and determine shortfall against the statutory <strong>Renewable Consumption Obligation (RCO)</strong> trajectory.
          </p>
        </div>

        <DataFreshnessBadge
          source={rpoConfig.authority}
          lastUpdated={rpoConfig.last_updated}
        />
      </div>

      {/* Statutory Framework Transition Alert */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-950">
        <div className="flex items-start gap-2.5">
          <Scale className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sky-900">
              Regulatory Framework Note: Transition to Renewable Consumption Obligation (RCO)
            </p>
            <p className="text-slate-700 leading-relaxed">
              Under the amended <strong>Energy Conservation Act, 2022</strong>, the regulatory regime has evolved from state-by-state Renewable Purchase Obligations (RPO) to a <strong>unified national Renewable Consumption Obligation (RCO)</strong> notified by the Ministry of Power and Bureau of Energy Efficiency (BEE). All DISCOMs, open-access industrial users, and designated commercial consumers must fulfill mandatory minimum clean energy procurement quotas.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Form & Immediate Output Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">
                Consumption & Procurement Input
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Formula Driven</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Year Selector */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Target Compliance Financial Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {rpoConfig.trajectory.map((t) => (
                  <option key={t.year} value={t.year}>
                    FY {t.year} (Statutory Target: {t.total_pct}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Entity Type */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Obligated Entity Classification:
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Open Access Consumer">Open Access Consumer (&gt;100 kW under GEOA 2022)</option>
                <option value="DISCOM">Power Distribution Company (DISCOM)</option>
                <option value="Captive Consumer">Captive Generating Consumer (CGP)</option>
                <option value="Designated Consumer">BEE Designated Industrial Consumer (PAT Scheme)</option>
              </select>
            </div>

            {/* Total Consumption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  Total Electricity Consumption:
                </label>
                <span className="font-mono font-bold text-slate-900">
                  {formatIndianNumber(totalConsumption)} kWh
                </span>
              </div>
              <input
                type="number"
                min="1000"
                step="50000"
                value={totalConsumption}
                onChange={(e) => setTotalConsumption(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {/* Presets */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTotalConsumption(p.value)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      totalConsumption === p.value
                        ? "bg-sky-600 text-white font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Renewable Consumption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  Renewable Energy Consumed:
                </label>
                <span className="font-mono font-bold text-emerald-700">
                  {formatIndianNumber(renewableConsumption)} kWh ({calculation.actualPct}%)
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10000"
                value={renewableConsumption}
                onChange={(e) => setRenewableConsumption(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Includes onsite solar/wind, green power open access (GEOA), and green tariff billing.
              </p>
            </div>
          </div>

          {/* Statutory Formula Explanation Box */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Statutory Formula
            </span>
            <div className="font-mono text-slate-900 bg-white p-2 rounded border border-slate-200">
              Shortfall = (Target % × Total Consumption) − Renewable Consumption
            </div>
          </div>
        </div>

        {/* Right Output: KPI Cards & Compliance Meter (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Status Callout */}
          <div
            className={`rounded-xl border p-5 shadow-xs transition-all ${
              calculation.isCompliant
                ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                : "bg-rose-50/90 border-rose-300 text-rose-950"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {calculation.isCompliant ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">
                      {calculation.isCompliant
                        ? "RCO Statutory Compliance Achieved"
                        : "Renewable Compliance Shortfall Detected"}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        calculation.isCompliant
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-rose-200 text-rose-900"
                      }`}
                    >
                      {calculation.isCompliant ? "COMPLIANT" : "DEFICIT"}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">
                    {calculation.isCompliant ? (
                      <>
                        Your organization has procured <strong>{calculation.actualPct}%</strong> clean energy against the statutory mandate of <strong>{calculation.targetPct}%</strong> for FY {selectedYear}, generating a surplus of <strong>{formatIndianNumber(calculation.surplusKwh)} kWh</strong>.
                      </>
                    ) : (
                      <>
                        Your procurement of <strong>{calculation.actualPct}%</strong> falls short of the statutory mandate (<strong>{calculation.targetPct}%</strong>). You require an additional <strong>{formatIndianNumber(calculation.shortfallKwh)} kWh</strong> of renewable power to avoid regulatory penalties.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title={`FY ${selectedYear} Target`}
              value={`${calculation.targetPct}%`}
              subtitle={`Required: ${formatIndianNumber(calculation.requiredReKwh)} kWh`}
              variant="default"
              badge="Statutory"
            />
            <StatCard
              title="Your Actual RE Share"
              value={`${calculation.actualPct}%`}
              subtitle={`${formatIndianNumber(calculation.renewableConsumptionKwh)} kWh consumed`}
              change={{
                value: `${calculation.complianceRatioPct}% of Target`,
                trend: calculation.isCompliant ? "up" : "down",
              }}
              variant={calculation.isCompliant ? "emerald" : "amber"}
            />
            <StatCard
              title={calculation.isCompliant ? "Surplus RE (kWh)" : "Shortfall (kWh)"}
              value={formatIndianNumber(calculation.isCompliant ? calculation.surplusKwh : calculation.shortfallKwh)}
              subtitle={
                calculation.isCompliant
                  ? "Eligible for REC issuance"
                  : `Equivalent to ${calculation.recEquivalentPcs} RECs`
              }
              variant={calculation.isCompliant ? "emerald" : "amber"}
            />
          </div>

          {/* Compliance Visual Progress Meter */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Compliance Gauge vs Mandate ({calculation.actualPct}% / {calculation.targetPct}%)
              </span>
              <span className="font-mono font-bold text-slate-700">
                {calculation.complianceRatioPct}% Fulfilled
              </span>
            </div>

            <div className="relative h-6 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              {/* Progress bar */}
              <div
                style={{ width: `${Math.min(100, (calculation.actualPct / 50) * 100)}%` }}
                className={`h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                  calculation.isCompliant ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                {calculation.actualPct > 4 ? `${calculation.actualPct}%` : ""}
              </div>
              {/* Target Marker Needle */}
              <div
                style={{ left: `${(calculation.targetPct / 50) * 100}%` }}
                className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10"
                title={`Target: ${calculation.targetPct}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span className="text-slate-900 font-bold">▲ Target: {calculation.targetPct}%</span>
              <span>50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Chart with User Position Marked */}
      <ChartCard
        title={`RCO Trajectory (2024-25 to 2029-30) & Your Entity's Position`}
        subtitle="Your position is dynamically plotted on the statutory curve for the selected financial year"
        source={rpoConfig.authority}
        lastUpdated={rpoConfig.last_updated}
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trajectoryChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" fontSize={11} />
              <YAxis domain={[0, 50]} fontSize={11} tickFormatter={(val) => `${val}%`} />
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, name]}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="Statutory RCO Target %"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4, fill: "#059669" }}
              />
              <Line
                type="monotone"
                dataKey="Wind Target %"
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="Hydro Target %"
                stroke="#2563eb"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              {/* Highlight user's actual position */}
              <ReferenceDot
                x={selectedYear}
                y={calculation.actualPct}
                r={8}
                fill={calculation.isCompliant ? "#059669" : "#e11d48"}
                stroke="#ffffff"
                strokeWidth={2}
                label={{
                  value: `You (${calculation.actualPct}%)`,
                  position: "top",
                  fontSize: 11,
                  fontWeight: "bold",
                  fill: calculation.isCompliant ? "#047857" : "#be123c",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recommended Procurement Options to Close Shortfall */}
      {!calculation.isCompliant && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Recommended Compliance Actions for {entityType}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <strong className="block text-slate-900 mb-1">1. Green Day-Ahead Market (IEX GDAM)</strong>
              Purchase {formatIndianNumber(calculation.shortfallKwh)} units directly through power exchanges on 15-minute delivery contracts.
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <strong className="block text-slate-900 mb-1">2. Buy Renewable Energy Certificates (RECs)</strong>
              Surrender {calculation.recEquivalentPcs} RECs via national registry to offset statutory obligation without physical wheeling.
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <strong className="block text-slate-900 mb-1">3. Green Energy Open Access (GEOA)</strong>
              Contract with an off-site solar/wind developer under the relaxed 100 kW minimum load open-access rules.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
