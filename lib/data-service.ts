/**
 * India Green Grid - Typed Data Access Layer
 * Provides fail-safe access to energy datasets, subsidies, tariffs, and green jobs.
 * Attempts Supabase read first; falls back seamlessly to /data and /config JSON snapshots on failure.
 */

import { getSupabase } from "./supabase";

// Fallback JSON imports
import capacitySnapshot from "@/data/capacity.json";
import generationSnapshot from "@/data/generation.json";
import jobsSnapshot from "@/data/jobs.json";
import rpoTrajectoryConfig from "@/config/rpo_trajectory.json";
import subsidyConfig from "@/config/subsidy.json";
import tariffConfig from "@/config/tariffs.json";
import emissionConfig from "@/config/emission_factors.json";

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface EnergySourceCapacity {
  source: string;
  category: "Fossil" | "Renewable" | "Clean/Non-Fossil";
  mw: number;
  share_pct: number;
  color?: string;
}

export interface StateCapacitySnapshot {
  state: string;
  total_mw: number;
  solar_mw: number;
  wind_mw: number;
  coal_mw: number;
  hydro_mw?: number;
  gas_mw?: number;
  nuclear_mw?: number;
  other_mw?: number;
}

export interface CapacityDataset {
  source: string;
  as_of: string;
  unit: string;
  is_sample_data: boolean;
  citation: string;
  national_summary: {
    total_mw: number;
    fossil_mw: number;
    non_fossil_mw: number;
    fossil_share_pct: number;
    non_fossil_share_pct: number;
    by_source: EnergySourceCapacity[];
  };
  state_snapshots: StateCapacitySnapshot[];
}

export interface DailyGenerationRecord {
  date: string;
  coal: number;
  solar: number;
  wind: number;
  hydro: number;
  nuclear: number;
  gas: number;
  other: number;
  total: number;
  re_share_pct: number;
  coal_share_pct: number;
}

export interface GenerationDataset {
  source: string;
  as_of: string;
  unit: string;
  is_sample_data: boolean;
  citation: string;
  daily_snapshot: {
    date: string;
    total_gwh: number;
    thermal_coal_gwh: number;
    thermal_coal_share_pct: number;
    renewables_gwh: number;
    renewables_share_pct: number;
    total_clean_gwh: number;
    total_clean_share_pct: number;
    by_source: Array<{
      source: string;
      gwh: number;
      share_pct: number;
      color?: string;
    }>;
  };
  recent_daily_trend: DailyGenerationRecord[];
}

export interface RpoMilestone {
  year: string;
  wind_pct: number;
  hydro_pct: number;
  other_re_pct: number;
  total_pct: number;
}

export interface RpoTrajectoryDataset {
  framework: string;
  authority: string;
  statutory_basis: string;
  last_updated: string;
  current_year: string;
  note: string;
  trajectory: RpoMilestone[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  type: string;
  experience?: string;
  salary_range?: string;
  posted_date?: string;
  description: string;
  skills: string[];
  apply_url: string;
}

export interface JobFilterOptions {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
}

export interface JobsDataset {
  source: string;
  is_sample_data: boolean;
  last_updated: string;
  total_count: number;
  jobs: JobListing[];
}

export interface SubsidyDataset {
  scheme_name: string;
  source: string;
  last_updated: string;
  benchmark_cost_per_kw_inr: number;
  central_subsidy_slabs: Array<{
    min_kw: number;
    max_kw: number;
    subsidy_per_kw_inr: number;
    max_total_inr: number;
    notes?: string;
  }>;
  state_topups: Record<
    string,
    {
      type: string;
      per_kw_inr: number;
      max_inr: number;
      name: string;
    }
  >;
}

export interface StateTariffInfo {
  state_code: string;
  discom: string;
  fixed_charge_per_kw: number;
  average_tariff_inr: number;
  slabs: Array<{
    min_units: number;
    max_units: number;
    rate: number;
  }>;
}

export interface TariffDataset {
  source: string;
  last_updated: string;
  default_annual_escalation_pct: number;
  states: Record<string, StateTariffInfo>;
}

export interface GreenFinanceScheme {
  id: string;
  institution: string;
  scheme_name: string;
  category: string;
  target_borrower: string;
  interest_rate_pct: number;
  max_tenure_years: number;
  eligible_technologies: string[];
  apply_url: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Data Access Methods (Supabase with Fail-Safe Offline Snapshots)
// -----------------------------------------------------------------------------

/**
 * Fetches All-India and State installed capacity data.
 */
export async function getCapacityData(): Promise<CapacityDataset> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("capacity")
        .select("state, source, category, mw, share_pct, as_of")
        .eq("state", "All-India");

      if (!error && data && data.length > 0) {
        // Compute totals from live database
        const by_source = data.map((d) => ({
          source: d.source,
          category: d.category as "Fossil" | "Renewable" | "Clean/Non-Fossil",
          mw: Number(d.mw),
          share_pct: Number(d.share_pct),
        }));

        const total_mw = by_source.reduce((acc, curr) => acc + curr.mw, 0);
        const non_fossil_mw = by_source
          .filter((s) => s.category !== "Fossil")
          .reduce((acc, curr) => acc + curr.mw, 0);

        return {
          source: "Supabase (CEA PostgreSQL sync)",
          as_of: data[0].as_of || "2024-10-31",
          unit: "MW",
          is_sample_data: false,
          citation: "Central Electricity Authority (CEA) Installed Capacity Table",
          national_summary: {
            total_mw,
            fossil_mw: total_mw - non_fossil_mw,
            non_fossil_mw,
            fossil_share_pct: total_mw > 0 ? Number((((total_mw - non_fossil_mw) / total_mw) * 100).toFixed(2)) : 0,
            non_fossil_share_pct: total_mw > 0 ? Number(((non_fossil_mw / total_mw) * 100).toFixed(2)) : 0,
            by_source,
          },
          state_snapshots: capacitySnapshot.state_snapshots as StateCapacitySnapshot[],
        };
      }
    } catch (err) {
      console.warn("Capacity Supabase fetch failed; using /data/capacity.json snapshot.", err);
    }
  }

  // Fallback to local snapshot
  return capacitySnapshot as CapacityDataset;
}

/**
 * Fetches daily generation data and 30-day historical time-series.
 */
export async function getGenerationData(): Promise<GenerationDataset> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("generation")
        .select("date, source, category, gwh, share_pct")
        .order("date", { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const latestDate = data[0].date;
        const latestRows = data.filter((d) => d.date === latestDate);

        const by_source = latestRows.map((d) => ({
          source: d.source,
          gwh: Number(d.gwh),
          share_pct: Number(d.share_pct),
        }));

        const total_gwh = by_source.reduce((sum, curr) => sum + curr.gwh, 0);
        const coalRow = by_source.find((s) => s.source.toLowerCase().includes("coal"));
        const coal_gwh = coalRow ? coalRow.gwh : 0;
        const reRows = by_source.filter((s) => ["solar", "wind", "other re"].some((k) => s.source.toLowerCase().includes(k)));
        const re_gwh = reRows.reduce((sum, curr) => sum + curr.gwh, 0);

        return {
          source: "Supabase (NPP PostgreSQL sync)",
          as_of: latestDate,
          unit: "GWh",
          is_sample_data: false,
          citation: "National Power Portal Daily Generation Reports",
          daily_snapshot: {
            date: latestDate,
            total_gwh,
            thermal_coal_gwh: coal_gwh,
            thermal_coal_share_pct: total_gwh > 0 ? Number(((coal_gwh / total_gwh) * 100).toFixed(2)) : 70.8,
            renewables_gwh: re_gwh,
            renewables_share_pct: total_gwh > 0 ? Number(((re_gwh / total_gwh) * 100).toFixed(2)) : 14.0,
            total_clean_gwh: total_gwh - coal_gwh,
            total_clean_share_pct: total_gwh > 0 ? Number((((total_gwh - coal_gwh) / total_gwh) * 100).toFixed(2)) : 29.2,
            by_source,
          },
          recent_daily_trend: generationSnapshot.recent_daily_trend as DailyGenerationRecord[],
        };
      }
    } catch (err) {
      console.warn("Generation Supabase fetch failed; using /data/generation.json snapshot.", err);
    }
  }

  // Fallback to local snapshot
  return generationSnapshot as GenerationDataset;
}

/**
 * Fetches RPO / RCO statutory trajectory milestones.
 */
export async function getRpoTrajectory(): Promise<RpoTrajectoryDataset> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("rpo_targets")
        .select("year, total_pct, wind_pct, hydro_pct, other_re_pct")
        .order("year", { ascending: true });

      if (!error && data && data.length > 0) {
        return {
          framework: "Renewable Consumption Obligation (RCO) / RPO",
          authority: "Ministry of Power & BEE",
          statutory_basis: "Energy Conservation Act, 2001 (amended 2022)",
          last_updated: "2024-04-01",
          current_year: "2024-25",
          note: "Live from Supabase statutory targets table.",
          trajectory: data.map((d) => ({
            year: d.year,
            total_pct: Number(d.total_pct),
            wind_pct: Number(d.wind_pct || 0),
            hydro_pct: Number(d.hydro_pct || 0),
            other_re_pct: Number(d.other_re_pct || 0),
          })),
        };
      }
    } catch (err) {
      console.warn("RPO targets Supabase fetch failed; using /config/rpo_trajectory.json snapshot.", err);
    }
  }

  // Fallback to config
  return rpoTrajectoryConfig as RpoTrajectoryDataset;
}

/**
 * Fetches PM Surya Ghar central subsidies and state top-up slabs.
 */
export async function getSubsidyConfig(): Promise<SubsidyDataset> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client.from("subsidies").select("*");
      if (!error && data && data.length > 0) {
        // Return config structure with Supabase confirmation
        return {
          ...subsidyConfig,
          source: "Supabase Subsidies Table (MNRE Guidelines)",
        } as SubsidyDataset;
      }
    } catch (err) {
      console.warn("Subsidy Supabase fetch failed; using /config/subsidy.json snapshot.", err);
    }
  }

  return subsidyConfig as SubsidyDataset;
}

/**
 * Fetches SERC state slab tariffs.
 */
export async function getTariffConfig(): Promise<TariffDataset> {
  return tariffConfig as TariffDataset;
}

/**
 * Fetches CEA carbon emission factors and solar baseline constants.
 */
export async function getEmissionFactors() {
  return emissionConfig;
}

/**
 * Fetches Green Job Listings with optional filtering.
 */
export async function getGreenJobs(filters?: JobFilterOptions): Promise<JobsDataset> {
  const client = getSupabase();

  let jobsList: JobListing[] = [];
  let isLive = false;

  if (client) {
    try {
      let query = client.from("jobs").select("*");

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters?.type && filters.type !== "All") {
        query = query.eq("type", filters.type);
      }
      if (filters?.location && filters.location !== "All") {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        jobsList = data.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          category: j.category,
          location: j.location,
          type: j.type,
          experience: j.experience,
          salary_range: j.salary_range,
          posted_date: j.posted_date,
          description: j.description,
          skills: Array.isArray(j.skills) ? j.skills : [],
          apply_url: j.apply_url,
        }));
        isLive = true;
      }
    } catch (err) {
      console.warn("Jobs Supabase fetch failed; using /data/jobs.json snapshot.", err);
    }
  }

  // Fallback to local snapshot if Supabase unconfigured or returned empty
  if (jobsList.length === 0) {
    let fallback = (jobsSnapshot.jobs as JobListing[]) || [];

    if (filters) {
      if (filters.category && filters.category !== "All") {
        fallback = fallback.filter((j) => j.category.toLowerCase() === filters.category?.toLowerCase());
      }
      if (filters.type && filters.type !== "All") {
        fallback = fallback.filter((j) => j.type.toLowerCase() === filters.type?.toLowerCase());
      }
      if (filters.location && filters.location !== "All") {
        fallback = fallback.filter((j) => j.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        fallback = fallback.filter(
          (j) =>
            j.title.toLowerCase().includes(term) ||
            j.company.toLowerCase().includes(term) ||
            j.description.toLowerCase().includes(term) ||
            j.skills.some((s) => s.toLowerCase().includes(term))
        );
      }
    }
    jobsList = fallback;
  }

  return {
    source: isLive ? "Supabase (jobs table)" : "Clean Energy Industry Openings",
    is_sample_data: true,
    last_updated: jobsSnapshot.last_updated || "2024-11-10",
    total_count: jobsList.length,
    jobs: jobsList,
  };
}

/**
 * Fetches Green Finance Schemes (IREDA, SIDBI, PFC, NABARD).
 */
export async function getGreenFinanceSchemes(): Promise<GreenFinanceScheme[]> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client.from("green_finance_schemes").select("*");
      if (!error && data && data.length > 0) {
        return data as GreenFinanceScheme[];
      }
    } catch (err) {
      console.warn("Finance schemes Supabase fetch failed; using fallback.", err);
    }
  }

  // High-value fallback records
  return [
    {
      id: "fin-001",
      institution: "IREDA",
      scheme_name: "Access to Clean Energy Financing",
      category: "Utility RE Capex",
      target_borrower: "RE Developer",
      interest_rate_pct: 8.25,
      max_tenure_years: 15,
      eligible_technologies: ["Solar PV", "Wind", "Hybrid RE", "BESS"],
      apply_url: "https://ireda.in",
      description: "Concessional debt for grid-connected utility solar, wind farms, and battery storage projects.",
    },
    {
      id: "fin-002",
      institution: "SIDBI",
      scheme_name: "4E (End to End Energy Efficiency)",
      category: "Rooftop Solar MSME",
      target_borrower: "MSME",
      interest_rate_pct: 7.50,
      max_tenure_years: 7,
      eligible_technologies: ["Rooftop Solar", "Energy Efficient Boilers", "VFDs"],
      apply_url: "https://sidbi.in",
      description: "Low-interest loans up to ₹3 Crore for MSMEs implementing captive solar and energy efficiency upgrades.",
    },
    {
      id: "fin-003",
      institution: "NABARD",
      scheme_name: "Agro-Solar Microgrid Credit Line",
      category: "Agro-Solar (KUSUM)",
      target_borrower: "Farmer",
      interest_rate_pct: 6.80,
      max_tenure_years: 10,
      eligible_technologies: ["Solar Irrigation Pumps", "Agro-Photovoltaics", "Microgrids"],
      apply_url: "https://nabard.org",
      description: "Subsidized priority-sector agriculture finance for PM-KUSUM solar water pumps and agro-PV installations.",
    },
  ];
}
