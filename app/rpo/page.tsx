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
} from "recharts";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Scale,
  Sparkles,
  Calculator,
  Info,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TermExplainer } from "@/components/TermExplainer";
import { useUserRole } from "@/lib/role-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { calculateRpoCompliance, RpoOutput } from "@/lib/calculators/rpo";
import { formatIndianNumber } from "@/lib/utils";
import rpoConfig from "@/config/rpo_trajectory.json";

export default function RpoPage() {
  const { roleConfig } = useUserRole();
  const { t } = useLanguage();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-navy-50 text-navy-850 px-2.5 py-0.5 rounded border border-navy-200">
              Module D2
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              RPO / RCO Statutory Compliance Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-3xl">
            Audit compliance percentage, calculate required clean energy volume, and determine shortfall against the statutory <strong>Renewable Consumption Obligation (RCO)</strong> trajectory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TermExplainer termKey="rco_obligation" variant="badge" label="What is RCO?" />
          <DataFreshnessBadge
            source={rpoConfig.authority}
            lastUpdated={rpoConfig.last_updated}
          />
        </div>
      </div>

      {/* Statutory Framework Transition Alert */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-warm text-xs text-navy-950">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
            <Scale className="w-5 h-5 text-teal-700" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-navy-950 text-sm">
                Regulatory Framework: Transition from RPO to National RCO
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Energy Conservation Act 2022
              </span>
            </div>
            <p className="text-navy-700 leading-relaxed text-xs">
              Under the amended <strong>Energy Conservation Act, 2022</strong>, the regulatory regime has evolved from fragmented state-by-state Renewable Purchase Obligations (RPO) into a <strong>unified national Renewable Consumption Obligation (RCO)</strong>. All DISCOMs, open-access commercial/industrial users, and designated consumers must meet these statutory quotas or purchase Renewable Energy Certificates (RECs).
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Form & Immediate Output Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-ivory-300 bg-white p-6 shadow-warm space-y-6">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-navy-50 text-navy-850">
                <Calculator className="w-4 h-4 text-navy-850" />
              </div>
              <h2 className="text-base font-bold text-navy-950">
                Consumption & Procurement Input
              </h2>
            </div>
            <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Statutory Formula
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Year Selector */}
            <div>
              <label className="block font-bold text-navy-900 mb-1">
                Target Compliance Financial Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-2 text-xs font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              <label className="block font-bold text-navy-900 mb-1">
                Obligated Entity Classification:
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                <label className="font-bold text-navy-900">
                  Total Electricity Consumption:
                </label>
                <span className="font-mono font-extrabold text-navy-950">
                  {formatIndianNumber(totalConsumption)} kWh
                </span>
              </div>
              <input
                type="number"
                min="1000"
                step="50000"
                value={totalConsumption}
                onChange={(e) => setTotalConsumption(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {/* Presets */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTotalConsumption(p.value)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      totalConsumption === p.value
                        ? "bg-navy-900 text-ivory font-bold shadow-2xs"
                        : "bg-ivory-100 text-navy-800 hover:bg-ivory-200 border border-ivory-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                <Info className="w-3 h-3 text-teal-700" />
                <span>Tip: 10 Lakh kWh = 1 Million units (1 GWh)</span>
              </div>
            </div>

            {/* Renewable Consumption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-navy-900">
                  Renewable Energy Consumed:
                </label>
                <span className="font-mono font-extrabold text-teal-800">
                  {formatIndianNumber(renewableConsumption)} kWh ({calculation.actualPct}%)
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10000"
                value={renewableConsumption}
                onChange={(e) => setRenewableConsumption(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-ivory-300 px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-navy-700 mt-1">
                Includes onsite rooftop solar/wind, green power open access (GEOA), and green tariff billing from your DISCOM.
              </p>
            </div>
          </div>

          {/* Statutory Formula Explanation Box */}
          <div className="rounded-xl bg-ivory-50 border border-ivory-200 p-3 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-950 uppercase tracking-wider text-[10px]">
                Statutory Formula
              </span>
              <TermExplainer termKey="rco_obligation" variant="icon" />
            </div>
            <div className="font-mono text-xs text-navy-900 bg-white p-2.5 rounded-lg border border-ivory-300 shadow-2xs">
              Shortfall = (Target % × Total Consumption) − Renewable Consumption
            </div>
          </div>
        </div>

        {/* Right Output: KPI Cards & Compliance Meter (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Status Callout */}
          <ErrorBoundary fallbackTitle="Compliance Meter Unavailable">
            <div
              className={`rounded-2xl border p-5 shadow-warm transition-all ${
                calculation.isCompliant
                  ? "bg-naturalGreen-50/70 border-naturalGreen-300 text-navy-950"
                  : "bg-saffron-50/70 border-saffron-300 text-navy-950"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {calculation.isCompliant ? (
                    <div className="p-2 rounded-xl bg-naturalGreen-100 text-naturalGreen-800">
                      <CheckCircle2 className="w-7 h-7 text-naturalGreen-700 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-saffron-100 text-saffron-800">
                      <XCircle className="w-7 h-7 text-saffron-700 flex-shrink-0" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-navy-950">
                        {calculation.isCompliant
                          ? "RCO Statutory Compliance Achieved"
                          : "Renewable Compliance Shortfall Detected"}
                      </h3>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          calculation.isCompliant
                            ? "bg-naturalGreen-200 text-naturalGreen-900 border border-naturalGreen-300"
                            : "bg-saffron-200 text-saffron-900 border border-saffron-300"
                        }`}
                      >
                        {calculation.isCompliant ? "COMPLIANT" : "DEFICIT"}
                      </span>
                    </div>
                    <p className="text-xs mt-1.5 leading-relaxed text-navy-800">
                      {calculation.isCompliant ? (
                        <>
                          Your organization has procured <strong>{calculation.actualPct}%</strong> clean energy against the statutory mandate of <strong>{calculation.targetPct}%</strong> for FY {selectedYear}, generating a surplus of <strong>{formatIndianNumber(calculation.surplusKwh)} kWh</strong>.
                        </>
                      ) : (
                        <>
                          Your procurement of <strong>{calculation.actualPct}%</strong> falls short of the statutory mandate (<strong>{calculation.targetPct}%</strong>). You require an additional <strong>{formatIndianNumber(calculation.shortfallKwh)} kWh</strong> of renewable power to avoid regulatory non-compliance penalties.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>

          {/* KPI Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title={`FY ${selectedYear} Target`}
              value={`${calculation.targetPct}%`}
              subtitle={`Required: ${formatIndianNumber(calculation.requiredReKwh)} kWh`}
              variant="navy"
              badge="Statutory"
              explainerKey="rco_obligation"
            />
            <StatCard
              title="Your Actual RE Share"
              value={`${calculation.actualPct}%`}
              subtitle={`${formatIndianNumber(calculation.renewableConsumptionKwh)} kWh consumed`}
              change={{
                value: `${calculation.complianceRatioPct}% of Target`,
                trend: calculation.isCompliant ? "up" : "down",
              }}
              variant={calculation.isCompliant ? "teal" : "amber"}
            />
            <StatCard
              title={calculation.isCompliant ? "Surplus RE (kWh)" : "Shortfall (kWh)"}
              value={formatIndianNumber(calculation.isCompliant ? calculation.surplusKwh : calculation.shortfallKwh)}
              subtitle={
                calculation.isCompliant
                  ? "Eligible for REC issuance"
                  : `Equivalent to ${calculation.recEquivalentPcs} RECs`
              }
              variant={calculation.isCompliant ? "teal" : "amber"}
            />
          </div>

          {/* Compliance Visual Progress Meter */}
          <div className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-warm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-navy-950">
                Compliance Gauge vs Mandate ({calculation.actualPct}% / {calculation.targetPct}%)
              </span>
              <span className="font-mono font-extrabold text-navy-950">
                {calculation.complianceRatioPct}% Fulfilled
              </span>
            </div>

            <div className="relative h-6 w-full rounded-full bg-ivory-100 overflow-hidden border border-ivory-300 shadow-inner">
              {/* Progress bar */}
              <div
                style={{ width: `${Math.min(100, (calculation.actualPct / 50) * 100)}%` }}
                className={`h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                  calculation.isCompliant ? "bg-teal-700" : "bg-saffron-600"
                }`}
              >
                {calculation.actualPct > 4 ? `${calculation.actualPct}%` : ""}
              </div>
              {/* Target Marker Needle */}
              <div
                style={{ left: `${(calculation.targetPct / 50) * 100}%` }}
                className="absolute top-0 bottom-0 w-1 bg-navy-950 z-10"
                title={`Target: ${calculation.targetPct}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-navy-950 font-bold">▲ Mandated Target: {calculation.targetPct}%</span>
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
        explainerKey="rco_obligation"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trajectoryChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" fontSize={11} stroke="#64748B" />
              <YAxis domain={[0, 50]} fontSize={11} tickFormatter={(val) => `${val}%`} stroke="#64748B" />
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  fontSize: "12px",
                  border: "1px solid #CBD5E1",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="Statutory RCO Target %"
                stroke="#0F766E"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0F766E" }}
              />
              <Line
                type="monotone"
                dataKey="Wind Target %"
                stroke="#2563EB"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="Hydro Target %"
                stroke="#7C3AED"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              {/* Highlight user's actual position */}
              <ReferenceDot
                x={selectedYear}
                y={calculation.actualPct}
                r={8}
                fill={calculation.isCompliant ? "#0F766E" : "#D97706"}
                stroke="#ffffff"
                strokeWidth={2}
                label={{
                  value: `You (${calculation.actualPct}%)`,
                  position: "top",
                  fontSize: 11,
                  fontWeight: "bold",
                  fill: calculation.isCompliant ? "#0F766E" : "#B45309",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recommended Procurement Options to Close Shortfall */}
      {!calculation.isCompliant && (
        <div className="rounded-2xl border border-saffron-300 bg-saffron-50/70 p-5 space-y-3 shadow-warm">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saffron-700" />
            <span>Recommended Compliance Actions for {entityType}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-800">
            <div className="bg-white p-3.5 rounded-xl border border-ivory-300 shadow-2xs">
              <strong className="block text-navy-950 mb-1">1. Green Day-Ahead Market (IEX GDAM)</strong>
              Purchase {formatIndianNumber(calculation.shortfallKwh)} units directly through power exchanges on 15-minute delivery contracts.
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-ivory-300 shadow-2xs">
              <strong className="block text-navy-950 mb-1">2. Buy Renewable Energy Certificates (RECs)</strong>
              Surrender {calculation.recEquivalentPcs} RECs via the national registry to offset statutory obligation without physical wheeling.
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-ivory-300 shadow-2xs">
              <strong className="block text-navy-950 mb-1">3. Green Energy Open Access (GEOA)</strong>
              Contract with an off-site solar/wind developer under the relaxed 100 kW minimum load open-access rules.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
