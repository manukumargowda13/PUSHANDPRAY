# Technical and Financial Assumptions - India Green Grid

**Project**: India Green Grid — National Clean Energy Decision-Support Platform  
**Governance Principle**: All assumptions are transparently stored in editable JSON configuration files in `/config`, ensuring zero hard-coded mathematical constants in application code.

---

## 1. Solar Performance & Technical Parameters
*Source File*: [`config/emission_factors.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/emission_factors.json)

| Parameter | Value | Unit | Engineering Justification & Provenance |
| :--- | :--- | :--- | :--- |
| **Annual Specific Yield** | `1,460` | kWh / kW / year | Corresponds to 4.0 kWh/kW/day across average Indian latitudes (MNRE / NISE Solar Radiation Atlas). |
| **Daily Average Yield** | `4.0` | kWh / kW / day | Average daily sunshine generation for south-facing tilt angles (15°–25°). |
| **Rooftop Space Requirement** | `100` | sq. ft / kW | Standard footprint for ~550Wp mono-crystalline PERC panels including inter-row shading clearance (9.29 sq.m/kW). |
| **Annual Panel Degradation** | `0.7%` | % per annum | Standard Tier-1 manufacturer linear power warranty (max 2% Year 1, 0.55%–0.7% thereafter). |
| **Economic Useful Lifespan** | `25` | Years | Standard solar module performance guarantee term. |
| **Inverter Replacement Timing** | Year `12` | Year | Central string inverters typically require one replacement over a 25-year plant life. |
| **Inverter Replacement Cost** | `12%` | % of initial CAPEX | Replacement cost of inverter electronics at Year 12. |
| **Annual O&M Cost** | `1.5%` | % of initial CAPEX | Routine module washing, tightening, and electrical safety audits. |
| **O&M Cost Inflation** | `3.0%` | % per annum | Labor and consumable replacement cost escalation. |

---

## 2. Subsidy & Capital Cost Assumptions
*Source File*: [`config/subsidy.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/subsidy.json)

| Parameter | Value | Unit | Statutory Mandate & Administrative Guidelines |
| :--- | :--- | :--- | :--- |
| **Benchmark Capital Cost** | `55,000` | ₹ / kW | National benchmark cost for grid-connected rooftop PV with net metering. |
| **PM Surya Ghar Tier 1 CFA** | `30,000` | ₹ / kW | For capacity up to 1.0 kW (Max ₹30,000). |
| **PM Surya Ghar Tier 2 CFA** | `30,000` | ₹ / kW | For capacity from 1.0 to 2.0 kW (Max ₹60,000 for 2 kW). |
| **PM Surya Ghar Tier 3 CFA** | `18,000` | ₹ / kW | For incremental capacity between 2.0 and 3.0 kW (Max ₹78,000 for 3 kW). |
| **PM Surya Ghar Hard Cap** | `78,000` | ₹ | Systems exceeding 3.0 kW are capped at ₹78,000 for residential sector. |
| **UP State Top-up** | `15,000` | ₹ / kW | Uttar Pradesh NEDA top-up (up to ₹30,000 cap). |
| **Delhi State Top-up** | `2,000` | ₹ / kW | Delhi Solar Policy 2024 capital subsidy (up to ₹10,000 cap). |

---

## 3. Electricity Tariffs & Escalation
*Source File*: [`config/tariffs.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/tariffs.json)

| State | DISCOM | Average Tariff (₹/kWh) | Fixed Charge (₹/kW/mo) | Key Slabs (Units & Rates) |
| :--- | :--- | :--- | :--- | :--- |
| **Maharashtra** | MSEDCL | ₹8.15 | ₹128 | 0-100: ₹5.88 \| 101-300: ₹11.46 \| 301-500: ₹15.72 \| >500: ₹17.81 |
| **Gujarat** | UGVCL/DGVCL | ₹6.20 | ₹70 | 0-100: ₹3.75 \| 101-250: ₹4.80 \| 251-500: ₹5.95 \| >500: ₹6.85 |
| **Karnataka** | BESCOM | ₹7.45 | ₹110 | 0-100: ₹4.75 \| 101-200: ₹7.00 \| 201-500: ₹8.50 \| >500: ₹9.25 |
| **Tamil Nadu** | TANGEDCO | ₹6.80 | ₹50 | 0-100: ₹0.00 \| 101-200: ₹2.25 \| 201-400: ₹4.50 \| >500: ₹8.00 |
| **Delhi** | BSES / TPDDL | ₹6.50 | ₹60 | 0-200: ₹3.00 \| 201-400: ₹4.50 \| 401-800: ₹6.50 \| >800: ₹8.00 |
| **Rajasthan** | JVVNL | ₹7.20 | ₹100 | 0-100: ₹4.75 \| 101-150: ₹6.50 \| 151-300: ₹7.35 \| >500: ₹7.95 |
| **Uttar Pradesh**| UPPCL | ₹6.90 | ₹110 | 0-100: ₹3.35 \| 101-150: ₹3.85 \| 151-300: ₹5.00 \| >500: ₹7.00 |
| **Default Escalation**| All | `4.5%` | % per annum | Historical SERC Multi-Year Tariff CAGR over past 10 years. |

---

## 4. Environmental & Carbon Abatement Parameters
*Source File*: [`config/emission_factors.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/emission_factors.json)

| Metric | Value | Unit | Provenance |
| :--- | :--- | :--- | :--- |
| **Grid Average Emission Factor** | `0.716` | kg CO₂ / kWh | Central Electricity Authority (CEA) Baseline Carbon Dioxide Database v19.0 (Weighted National Average). |
| **Coal Thermal Emission Factor** | `0.985` | kg CO₂ / kWh | Displaced marginal thermal generation factor. |
| **Tree Sequestration Equivalent** | `45` | Trees / Ton CO₂ | Standard environmental forestry conversion factor for mature broadleaf trees over annual cycle. |

---

## 5. Statutory RCO / RPO Trajectory
*Source File*: [`config/rpo_trajectory.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/rpo_trajectory.json)

| Financial Year | Wind RCO % | HPO (Hydro) % | Other RE % | Total Statutory Mandate % |
| :--- | :--- | :--- | :--- | :--- |
| **2024-25** | 0.67% | 0.38% | 28.86% | **29.91%** |
| **2025-26** | 1.45% | 1.49% | 30.07% | **33.01%** |
| **2026-27** | 2.22% | 2.60% | 31.13% | **35.95%** |
| **2027-28** | 3.00% | 3.71% | 32.10% | **38.81%** |
| **2028-29** | 3.78% | 4.82% | 32.76% | **41.36%** |
| **2029-30** | 4.55% | 5.93% | 32.85% | **43.33%** |

*Regulatory Note*: 1 Renewable Energy Certificate (REC) represents exactly 1,000 kWh (1 MWh) of audited renewable power.
