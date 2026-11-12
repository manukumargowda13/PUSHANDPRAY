import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

test("Dataset Test: capacity.json conforms to CEA structure", () => {
  const file = path.join(rootDir, "data", "capacity.json");
  assert.ok(fs.existsSync(file), "data/capacity.json must exist");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  assert.equal(typeof data.national_summary.total_mw, "number");
  assert.ok(data.national_summary.total_mw > 400000, "Total installed capacity > 400 GW");
  assert.ok(Array.isArray(data.national_summary.by_source), "by_source must be an array");
  assert.ok(data.national_summary.by_source.length >= 7, "At least 7 generation technologies");

  const coal = data.national_summary.by_source.find((s) => s.source === "Coal");
  assert.ok(coal, "Coal source must exist");
  assert.ok(coal.mw > 200000, "Coal capacity > 200 GW");

  const solar = data.national_summary.by_source.find((s) => s.source === "Solar");
  assert.ok(solar, "Solar source must exist");
  assert.ok(solar.mw > 80000, "Solar capacity > 80 GW");

  assert.ok(Array.isArray(data.state_snapshots), "State snapshots must be present");
  assert.ok(data.state_snapshots.length >= 5, "At least 5 state snapshots");
});

test("Dataset Test: generation.json conforms to NPP daily records", () => {
  const file = path.join(rootDir, "data", "generation.json");
  assert.ok(fs.existsSync(file), "data/generation.json must exist");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  assert.equal(typeof data.daily_snapshot.total_gwh, "number");
  assert.ok(data.daily_snapshot.total_gwh > 4000, "Daily generation > 4,000 GWh");
  assert.ok(data.daily_snapshot.thermal_coal_share_pct > 65, "Thermal coal share > 65% of daily generation");
  assert.ok(Array.isArray(data.recent_daily_trend), "recent_daily_trend must be an array");
  assert.ok(data.recent_daily_trend.length >= 10, "At least 10 daily trend snapshots");
});

test("Dataset Test: jobs.json contains at least 40 seeded listings", () => {
  const file = path.join(rootDir, "data", "jobs.json");
  assert.ok(fs.existsSync(file), "data/jobs.json must exist");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  assert.ok(Array.isArray(data.jobs), "jobs must be an array");
  assert.ok(data.jobs.length >= 40, `Must have at least 40 jobs; found ${data.jobs.length}`);

  const categories = new Set(data.jobs.map((j) => j.category));
  assert.ok(categories.has("Solar Installation"), "Must include Solar Installation");
  assert.ok(categories.has("Wind Maintenance"), "Must include Wind Maintenance");
  assert.ok(categories.has("Battery Design"), "Must include Battery Design");
  assert.ok(categories.has("Organic Farming"), "Must include Organic Farming");
  assert.ok(categories.has("Sustainability"), "Must include Sustainability");

  for (const job of data.jobs) {
    assert.ok(job.id, "Job must have id");
    assert.ok(job.title, "Job must have title");
    assert.ok(job.company, "Job must have company");
    assert.ok(job.location, "Job must have location");
    assert.ok(job.apply_url, "Job must have apply_url");
  }
});

test("Config Test: rpo_trajectory.json reflects statutory MoP trajectory", () => {
  const file = path.join(rootDir, "config", "rpo_trajectory.json");
  assert.ok(fs.existsSync(file), "config/rpo_trajectory.json must exist");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  assert.ok(Array.isArray(data.trajectory), "trajectory must be array");
  const t24 = data.trajectory.find((t) => t.year === "2024-25");
  const t29 = data.trajectory.find((t) => t.year === "2029-30");

  assert.ok(t24, "2024-25 milestone must exist");
  assert.equal(t24.total_pct, 29.91, "2024-25 target must be 29.91%");

  assert.ok(t29, "2029-30 milestone must exist");
  assert.equal(t29.total_pct, 43.33, "2029-30 target must be 43.33%");
});

test("Config Test: subsidy.json adheres to PM Surya Ghar caps", () => {
  const file = path.join(rootDir, "config", "subsidy.json");
  assert.ok(fs.existsSync(file), "config/subsidy.json must exist");
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  assert.ok(data.central_subsidy_slabs.length >= 3, "At least 3 central subsidy slabs");
  const maxCap = Math.max(...data.central_subsidy_slabs.map((s) => s.max_total_inr));
  assert.equal(maxCap, 78000, "PM Surya Ghar residential CFA must cap at ₹78,000");
});
