/**
 * India Green Grid - Rooftop Solar ROI & Subsidy Calculation Engine
 * Pure TypeScript module using external configurable parameters from /config.
 * Implements PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA),
 * SERC slab tariffs, annual degradation, tariff inflation, and carbon abatement.
 */

import tariffConfig from "@/config/tariffs.json";
import subsidyConfig from "@/config/subsidy.json";
import emissionConfig from "@/config/emission_factors.json";

export interface SolarCalculatorParams {
  state: string;
  monthlyBillOrUnits: "units" | "bill";
  value: number; // units in kWh/month OR bill in INR/month
  roofAreaSqFt: number;
  tariffInflationPct?: number; // defaults to config
  panelDegradationPct?: number; // defaults to config
}

export interface YearProjection {
  year: number;
  solarGenerationKwh: number;
  gridTariffPerKwh: number;
  annualSavingsInr: number;
  omCostInr: number;
  inverterReplacementInr: number;
  netAnnualCashFlowInr: number;
  cumulativeSavingsInr: number;
}

export interface SolarCalculationResult {
  state: string;
  monthlyUnits: number;
  monthlyBillEstimatedInr: number;
  recommendedKw: number;
  roofAreaProvidedSqFt: number;
  roofAreaRequiredSqFt: number;
  roofAreaConstrained: boolean;
  benchmarkCostPerKwInr: number;
  grossSystemCostInr: number;
  centralSubsidyInr: number;
  stateSubsidyInr: number;
  totalSubsidyInr: number;
  netCostInr: number;
  annualGenerationYear1Kwh: number;
  dailyGenerationAverageKwh: number;
  firstYearSavingsInr: number;
  paybackPeriodYears: number;
  lifetimeTwentyFiveYearSavingsInr: number;
  co2AvoidedTonsPerYear: number;
  twentyFiveYearCo2AvoidedTons: number;
  treesEquivalent: number;
  yearlyProjection: YearProjection[];
  tariffDetails: {
    discom: string;
    averageTariffInr: number;
  };
}

/**
 * Calculates estimated electricity units from a given monthly bill using SERC slab rates.
 */
export function estimateUnitsFromBill(state: string, billInr: number): number {
  const stateData = (tariffConfig.states as Record<string, any>)[state] || tariffConfig.states["Maharashtra"];
  const fixedCharge = stateData.fixed_charge_per_kw || 100;
  let remainingBill = Math.max(0, billInr - fixedCharge);
  let totalUnits = 0;

  for (const slab of stateData.slabs) {
    if (remainingBill <= 0) break;
    const slabSpan = slab.max_units - slab.min_units;
    const slabRate = slab.rate > 0 ? slab.rate : 0.01;
    const maxSlabCost = slabSpan * slabRate;

    if (remainingBill > maxSlabCost) {
      totalUnits += slabSpan;
      remainingBill -= maxSlabCost;
    } else {
      totalUnits += remainingBill / slabRate;
      remainingBill = 0;
      break;
    }
  }

  // Fallback if bill exceeds last slab
  if (remainingBill > 0 && stateData.slabs.length > 0) {
    const lastRate = stateData.slabs[stateData.slabs.length - 1].rate || 7.0;
    totalUnits += remainingBill / lastRate;
  }

  return Math.round(totalUnits);
}

/**
 * Calculates estimated monthly electricity bill from units using SERC slab tariffs.
 */
export function estimateBillFromUnits(state: string, units: number): number {
  const stateData = (tariffConfig.states as Record<string, any>)[state] || tariffConfig.states["Maharashtra"];
  const fixedCharge = stateData.fixed_charge_per_kw || 100;
  let bill = fixedCharge;
  let remainingUnits = units;

  for (const slab of stateData.slabs) {
    if (remainingUnits <= 0) break;
    const slabSpan = slab.max_units - slab.min_units;
    const unitsInThisSlab = Math.min(remainingUnits, slabSpan);
    bill += unitsInThisSlab * slab.rate;
    remainingUnits -= unitsInThisSlab;
  }

  return Math.round(bill);
}

/**
 * Computes PM Surya Ghar Central Financial Assistance (CFA) based on system kW size.
 * Up to 2 kW: ₹30,000/kW
 * Additional up to 3 kW: ₹18,000/kW
 * > 3 kW: Capped at ₹78,000
 */
export function calculateCentralSubsidy(kw: number): number {
  if (kw <= 0) return 0;
  if (kw <= 1) {
    return Math.round(kw * 30000);
  }
  if (kw <= 2) {
    return Math.round(kw * 30000);
  }
  if (kw <= 3) {
    return Math.round(60000 + (kw - 2) * 18000);
  }
  // Systems above 3 kW are capped at ₹78,000
  return 78000;
}

/**
 * Computes state top-up subsidy based on state policies in /config/subsidy.json
 */
export function calculateStateSubsidy(state: string, kw: number): number {
  const topupInfo = (subsidyConfig.state_topups as Record<string, any>)[state];
  if (!topupInfo || !topupInfo.per_kw_inr) return 0;

  const rawTopup = kw * topupInfo.per_kw_inr;
  const maxCap = topupInfo.max_inr || 0;
  if (maxCap > 0) {
    return Math.min(rawTopup, maxCap);
  }
  return rawTopup;
}

/**
 * Main Solar ROI & Subsidy Calculation Engine
 */
export function calculateSolarRoi(params: SolarCalculatorParams): SolarCalculationResult {
  const { state, monthlyBillOrUnits, value, roofAreaSqFt } = params;

  // 1. Resolve Monthly Units and Bill
  let monthlyUnits = 0;
  let monthlyBillEstimatedInr = 0;

  if (monthlyBillOrUnits === "bill") {
    monthlyBillEstimatedInr = Math.max(100, value);
    monthlyUnits = estimateUnitsFromBill(state, monthlyBillEstimatedInr);
  } else {
    monthlyUnits = Math.max(20, value);
    monthlyBillEstimatedInr = estimateBillFromUnits(state, monthlyUnits);
  }

  // 2. Solar Constants from /config/emission_factors.json
  const solarAssumptions = emissionConfig.solar_assumptions;
  const annualGenPerKw = solarAssumptions.annual_generation_kwh_per_kw || 1460; // 4 kWh/kW/day
  const sqFtPerKw = solarAssumptions.sq_ft_per_kw || 100;
  const degradationPct = (params.panelDegradationPct ?? solarAssumptions.annual_panel_degradation_pct) / 100;
  const inflationPct = (params.tariffInflationPct ?? tariffConfig.default_annual_escalation_pct) / 100;
  const benchmarkCostPerKw = subsidyConfig.benchmark_cost_per_kw_inr || 55000;

  // 3. Recommended System Sizing (kW)
  // Required kW to offset 100% of annual household consumption
  const idealKw = (monthlyUnits * 12) / annualGenPerKw;
  // Maximum kW allowed by physical roof area
  const maxKwByRoof = roofAreaSqFt > 0 ? roofAreaSqFt / sqFtPerKw : 100;

  let recommendedKw = Math.min(idealKw, maxKwByRoof);
  const roofAreaConstrained = idealKw > maxKwByRoof;

  // Round to 1 decimal place (e.g. 2.5 kW, minimum 1 kW)
  recommendedKw = Math.max(1, Math.round(recommendedKw * 10) / 10);
  const roofAreaRequiredSqFt = Math.round(recommendedKw * sqFtPerKw);

  // 4. Financial Costs & Subsidies
  const grossSystemCostInr = Math.round(recommendedKw * benchmarkCostPerKw);
  const centralSubsidyInr = calculateCentralSubsidy(recommendedKw);
  const stateSubsidyInr = calculateStateSubsidy(state, recommendedKw);
  const totalSubsidyInr = centralSubsidyInr + stateSubsidyInr;
  const netCostInr = Math.max(0, grossSystemCostInr - totalSubsidyInr);

  // 5. Tariff Details
  const stateTariff = (tariffConfig.states as Record<string, any>)[state] || tariffConfig.states["Maharashtra"];
  let baseTariff = stateTariff.average_tariff_inr || 7.0;

  // 6. Annual Generation and 25-Year Projection
  const annualGenerationYear1Kwh = Math.round(recommendedKw * annualGenPerKw);
  const dailyGenerationAverageKwh = Number((annualGenerationYear1Kwh / 365).toFixed(1));
  const firstYearSavingsInr = Math.round(annualGenerationYear1Kwh * baseTariff);

  // Simple payback period
  const paybackPeriodYears = firstYearSavingsInr > 0 ? Number((netCostInr / firstYearSavingsInr).toFixed(1)) : 99;

  // 25-Year Cash Flow Projection
  const yearlyProjection: YearProjection[] = [];
  let cumulativeSavings = -netCostInr;
  let currentGen = annualGenerationYear1Kwh;
  let currentTariff = baseTariff;
  const baseOm = (grossSystemCostInr * (solarAssumptions.annual_om_cost_pct || 1.5)) / 100;

  for (let yr = 1; yr <= 25; yr++) {
    // Panel degradation applies each year after Year 1
    if (yr > 1) {
      currentGen = currentGen * (1 - degradationPct);
      currentTariff = currentTariff * (1 + inflationPct);
    }

    const annualGrossSavings = Math.round(currentGen * currentTariff);
    const omCost = Math.round(baseOm * Math.pow(1.03, yr - 1)); // O&M inflates at 3%
    let inverterCost = 0;

    // Inverter replacement in Year 12
    if (yr === solarAssumptions.inverter_replacement_year) {
      inverterCost = Math.round((grossSystemCostInr * solarAssumptions.inverter_replacement_cost_pct) / 100);
    }

    const netAnnualCashFlow = annualGrossSavings - omCost - inverterCost;
    cumulativeSavings += netAnnualCashFlow;

    yearlyProjection.push({
      year: yr,
      solarGenerationKwh: Math.round(currentGen),
      gridTariffPerKwh: Number(currentTariff.toFixed(2)),
      annualSavingsInr: annualGrossSavings,
      omCostInr: omCost,
      inverterReplacementInr: inverterCost,
      netAnnualCashFlowInr: netAnnualCashFlow,
      cumulativeSavingsInr: Math.round(cumulativeSavings),
    });
  }

  const lifetimeTwentyFiveYearSavingsInr = yearlyProjection[yearlyProjection.length - 1].cumulativeSavingsInr;

  // 7. Environmental Impact
  const gridEmissionFactor = emissionConfig.grid_emission_factor_kg_co2_per_kwh || 0.716;
  const co2AvoidedTonsPerYear = Number(((annualGenerationYear1Kwh * gridEmissionFactor) / 1000).toFixed(2));
  const twentyFiveYearCo2AvoidedTons = Number(
    ((yearlyProjection.reduce((sum, y) => sum + y.solarGenerationKwh, 0) * gridEmissionFactor) / 1000).toFixed(1)
  );
  const treesEquivalent = Math.round(co2AvoidedTonsPerYear * (emissionConfig.trees_equivalent_per_ton_co2 || 45));

  return {
    state,
    monthlyUnits,
    monthlyBillEstimatedInr,
    recommendedKw,
    roofAreaProvidedSqFt: roofAreaSqFt,
    roofAreaRequiredSqFt,
    roofAreaConstrained,
    benchmarkCostPerKwInr: benchmarkCostPerKw,
    grossSystemCostInr,
    centralSubsidyInr,
    stateSubsidyInr,
    totalSubsidyInr,
    netCostInr,
    annualGenerationYear1Kwh,
    dailyGenerationAverageKwh,
    firstYearSavingsInr,
    paybackPeriodYears,
    lifetimeTwentyFiveYearSavingsInr,
    co2AvoidedTonsPerYear,
    twentyFiveYearCo2AvoidedTons,
    treesEquivalent,
    yearlyProjection,
    tariffDetails: {
      discom: stateTariff.discom,
      averageTariffInr: baseTariff,
    },
  };
}
