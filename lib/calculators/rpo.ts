/**
 * India Green Grid - RPO / RCO Compliance Calculation Engine
 * Implements Ministry of Power statutory trajectory calculations under the Energy Conservation Act.
 * Formula: Shortfall = (Target % × Total Consumption) − Renewable Consumption
 */

import rpoConfig from "@/config/rpo_trajectory.json";

export interface RpoInput {
  totalConsumptionKwh: number;
  renewableConsumptionKwh: number;
  year?: string; // defaults to 2024-25
  entityType?: "DISCOM" | "Open Access Consumer" | "Captive Consumer" | "Commercial/Industrial";
}

export interface RpoMilestonePoint {
  year: string;
  targetPct: number;
  windPct: number;
  hydroPct: number;
  otherRePct: number;
}

export interface RpoOutput {
  year: string;
  targetPct: number;
  windTargetPct: number;
  hydroTargetPct: number;
  otherReTargetPct: number;
  totalConsumptionKwh: number;
  renewableConsumptionKwh: number;
  actualPct: number;
  requiredReKwh: number;
  isCompliant: boolean;
  shortfallKwh: number;
  surplusKwh: number;
  complianceRatioPct: number;
  statutoryFramework: string;
  recEquivalentPcs: number; // 1 REC = 1 MWh = 1000 kWh
  trajectoryPoints: RpoMilestonePoint[];
  regulatoryNote: string;
}

export function calculateRpoCompliance(input: RpoInput): RpoOutput {
  const total = Math.max(0, input.totalConsumptionKwh || 0);
  const re = Math.max(0, input.renewableConsumptionKwh || 0);
  const targetYear = input.year || rpoConfig.current_year || "2024-25";

  // Find target from config
  const milestone =
    rpoConfig.trajectory.find((t) => t.year === targetYear) ||
    rpoConfig.trajectory[0];

  const targetPct = milestone.total_pct;
  const actualPct = total > 0 ? Number(((re / total) * 100).toFixed(2)) : 0;
  const requiredReKwh = Math.round((targetPct / 100) * total);

  // Shortfall formula: (Target % × Total Consumption) - Renewable Consumption
  const rawDifference = requiredReKwh - re;
  const isCompliant = rawDifference <= 0;
  const shortfallKwh = isCompliant ? 0 : Math.round(rawDifference);
  const surplusKwh = isCompliant ? Math.round(Math.abs(rawDifference)) : 0;

  const complianceRatioPct =
    requiredReKwh > 0 ? Number(((re / requiredReKwh) * 100).toFixed(1)) : 100;

  // 1 Renewable Energy Certificate (REC) = 1,000 kWh (1 MWh)
  const recEquivalentPcs = Math.ceil(shortfallKwh / 1000);

  const trajectoryPoints: RpoMilestonePoint[] = rpoConfig.trajectory.map((t) => ({
    year: t.year,
    targetPct: t.total_pct,
    windPct: t.wind_pct,
    hydroPct: t.hydro_pct,
    otherRePct: t.other_re_pct,
  }));

  return {
    year: targetYear,
    targetPct,
    windTargetPct: milestone.wind_pct,
    hydroTargetPct: milestone.hydro_pct,
    otherReTargetPct: milestone.other_re_pct,
    totalConsumptionKwh: total,
    renewableConsumptionKwh: re,
    actualPct,
    requiredReKwh,
    isCompliant,
    shortfallKwh,
    surplusKwh,
    complianceRatioPct,
    statutoryFramework: rpoConfig.framework,
    recEquivalentPcs,
    trajectoryPoints,
    regulatoryNote: rpoConfig.note,
  };
}
