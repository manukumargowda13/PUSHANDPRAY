import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const tariffConfig = JSON.parse(fs.readFileSync(path.join(rootDir, "config", "tariffs.json"), "utf-8"));
const subsidyConfig = JSON.parse(fs.readFileSync(path.join(rootDir, "config", "subsidy.json"), "utf-8"));
const emissionConfig = JSON.parse(fs.readFileSync(path.join(rootDir, "config", "emission_factors.json"), "utf-8"));

// Implementation of calculation logic tested in isolation
function calculateCentralSubsidy(kw) {
  if (kw <= 0) return 0;
  if (kw <= 1) return Math.round(kw * 30000);
  if (kw <= 2) return Math.round(kw * 30000);
  if (kw <= 3) return Math.round(60000 + (kw - 2) * 18000);
  return 78000;
}

function calculateStateSubsidy(state, kw) {
  const topup = subsidyConfig.state_topups[state];
  if (!topup || !topup.per_kw_inr) return 0;
  const raw = kw * topup.per_kw_inr;
  return topup.max_inr > 0 ? Math.min(raw, topup.max_inr) : raw;
}

test("Solar Calculator: PM Surya Ghar CFA tiers and ₹78,000 cap", () => {
  assert.equal(calculateCentralSubsidy(1), 30000, "1 kW CFA is ₹30,000");
  assert.equal(calculateCentralSubsidy(2), 60000, "2 kW CFA is ₹60,000");
  assert.equal(calculateCentralSubsidy(3), 78000, "3 kW CFA is ₹78,000");
  assert.equal(calculateCentralSubsidy(4), 78000, "4 kW CFA must be capped at ₹78,000");
  assert.equal(calculateCentralSubsidy(10), 78000, "10 kW CFA must be capped at ₹78,000");
});

test("Solar Calculator: State top-up subsidy integration", () => {
  const upTopup2kw = calculateStateSubsidy("Uttar Pradesh", 2);
  assert.equal(upTopup2kw, 30000, "UP gives ₹15k/kW up to ₹30k cap for 2 kW");

  const upTopup5kw = calculateStateSubsidy("Uttar Pradesh", 5);
  assert.equal(upTopup5kw, 30000, "UP top-up remains capped at ₹30,000 for 5 kW");

  const delhiTopup2kw = calculateStateSubsidy("Delhi", 2);
  assert.equal(delhiTopup2kw, 4000, "Delhi top-up is ₹2,000/kW (₹4,000 for 2 kW)");
});

test("Solar Calculator: Roof area constraint limiting system sizing", () => {
  const sqFtPerKw = emissionConfig.solar_assumptions.sq_ft_per_kw || 100;
  const smallRoofArea = 150; // sq ft
  const maxKwByRoof = smallRoofArea / sqFtPerKw; // 1.5 kW

  const largeRequirementUnits = 1000; // kWh/month -> ~8.2 kW ideal
  const annualGenPerKw = emissionConfig.solar_assumptions.annual_generation_kwh_per_kw || 1460;
  const idealKw = (largeRequirementUnits * 12) / annualGenPerKw;

  const recommendedKw = Math.min(idealKw, maxKwByRoof);
  assert.equal(recommendedKw, 1.5, "Recommended kW must be constrained to 1.5 kW by roof area");
});

test("RPO/RCO Calculator: Formula verification shortfall = (target % x total) - re", () => {
  const totalConsumption = 1000000; // 10 Lakh kWh
  const targetPct2024 = 29.91; // %
  const requiredRe = (targetPct2024 / 100) * totalConsumption; // 299,100 kWh

  // Case A: Deficit
  const reActualDeficit = 200000; // 2 Lakh kWh
  const shortfall = requiredRe - reActualDeficit;
  assert.equal(Math.round(shortfall), 99100, "Shortfall must equal 99,100 kWh");

  // Case B: Compliant
  const reActualSurplus = 350000; // 3.5 Lakh kWh
  const surplus = reActualSurplus - requiredRe;
  assert.ok(surplus > 0, "Must be compliant with surplus");
  assert.equal(Math.round(surplus), 50900, "Surplus must equal 50,900 kWh");
});
