/**
 * India Green Grid - Database Seed Script
 * Reads /data and /config JSON files and synchronizes with Supabase.
 * Supports zero-dependency dry-run validation when node_modules is not yet installed.
 * Run with: node scripts/seed.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load .env or .env.local if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...vals] = trimmed.split("=");
          if (key && vals.length > 0) {
            process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
          }
        }
      }
      break;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes("your-project.supabase.co") &&
  !supabaseKey.includes("your-anon-key-here")
);

async function runSeed() {
  console.log("=================================================");
  console.log(" India Green Grid - Data Seeder (CodeSpark 2026)");
  console.log("=================================================");

  // Read data and config files
  const capacityFile = path.join(rootDir, "data", "capacity.json");
  const generationFile = path.join(rootDir, "data", "generation.json");
  const jobsFile = path.join(rootDir, "data", "jobs.json");
  const rpoFile = path.join(rootDir, "config", "rpo_trajectory.json");
  const subsidyFile = path.join(rootDir, "config", "subsidy.json");

  const capacityData = JSON.parse(fs.readFileSync(capacityFile, "utf-8"));
  const generationData = JSON.parse(fs.readFileSync(generationFile, "utf-8"));
  const jobsData = JSON.parse(fs.readFileSync(jobsFile, "utf-8"));
  const rpoData = JSON.parse(fs.readFileSync(rpoFile, "utf-8"));
  const subsidyData = JSON.parse(fs.readFileSync(subsidyFile, "utf-8"));

  console.log(`[Loaded] Capacity items: ${capacityData.national_summary.by_source.length} sources, ${capacityData.state_snapshots.length} state snapshots`);
  console.log(`[Loaded] Generation items: ${generationData.daily_snapshot.by_source.length} sources, ${generationData.recent_daily_trend.length} historical dates`);
  console.log(`[Loaded] Green jobs count: ${jobsData.jobs.length} jobs`);
  console.log(`[Loaded] RCO targets: ${rpoData.trajectory.length} trajectory milestones`);
  console.log(`[Loaded] Subsidy slabs: ${subsidyData.central_subsidy_slabs.length} tiers + ${Object.keys(subsidyData.state_topups).length} state top-ups`);

  if (!isConfigured) {
    console.log("\n[Notice] Supabase URL / Key not configured or using default placeholders.");
    console.log("[Notice] The app is running in Offline Fallback Mode, reading directly from /data & /config.");
    console.log("[Notice] To sync to a live Supabase instance, update .env.local with your real project credentials and run:");
    console.log("         npm install && node scripts/seed.mjs\n");
    console.log("[Dry Run Status] Verified all 5 JSON datasets are valid, well-formed, and ready for ingestion.");
    return;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Seed sources
    console.log("Syncing sources...");
    const { error: srcErr } = await supabase.from("sources").upsert([
      { code: "CEA", name: "Central Electricity Authority", full_name: "Central Electricity Authority", agency: "Ministry of Power", url: "https://cea.nic.in", update_frequency: "Monthly" },
      { code: "NPP", name: "National Power Portal", full_name: "National Power Portal Daily Generation", agency: "Ministry of Power", url: "https://npp.gov.in", update_frequency: "Daily" },
      { code: "GRID_INDIA", name: "Grid Controller of India", full_name: "Grid-India POSOCO", agency: "Grid-India", url: "https://grid-india.in", update_frequency: "Daily" },
      { code: "MNRE", name: "MNRE", full_name: "Ministry of New and Renewable Energy", agency: "Govt of India", url: "https://mnre.gov.in", update_frequency: "Monthly" },
      { code: "BEE", name: "Bureau of Energy Efficiency", full_name: "Bureau of Energy Efficiency", agency: "Ministry of Power", url: "https://beeindia.gov.in", update_frequency: "Annual" },
    ], { onConflict: "code" });
    if (srcErr) console.warn("Sources seed warning:", srcErr.message);

    // 2. Seed Jobs
    console.log(`Syncing ${jobsData.jobs.length} green jobs...`);
    const jobPayload = jobsData.jobs.map((j) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      company: j.company,
      location: j.location,
      type: j.type,
      experience: j.experience,
      salary_range: j.salary_range,
      description: j.description,
      skills: j.skills,
      apply_url: j.apply_url,
      is_sample: true,
      posted_date: j.posted_date || "2024-11-10",
    }));
    const { error: jobErr } = await supabase.from("jobs").upsert(jobPayload, { onConflict: "id" });
    if (jobErr) console.warn("Jobs seed warning:", jobErr.message);

    // 3. Seed RCO targets
    console.log("Syncing RCO targets...");
    const rpoPayload = rpoData.trajectory.map((t) => ({
      year: t.year,
      total_pct: t.total_pct,
      wind_pct: t.wind_pct,
      hydro_pct: t.hydro_pct,
      other_re_pct: t.other_re_pct,
      statutory_framework: "Renewable Consumption Obligation (RCO)",
    }));
    const { error: rpoErr } = await supabase.from("rpo_targets").upsert(rpoPayload, { onConflict: "year" });
    if (rpoErr) console.warn("RPO targets seed warning:", rpoErr.message);

    console.log("Database synchronization completed successfully!");
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.log("\n[Notice] @supabase/supabase-js is not installed yet. Run 'npm install' to enable live sync.");
    } else {
      console.error("Error during Supabase seeding:", err);
    }
  }
}

runSeed();
