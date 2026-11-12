# Reuse and Authorship Log

**Project**: India Green Grid — National Clean Energy Decision-Support Platform  
**Platform Version**: 1.0.0  
**Date**: November 2026  

---

## 1. Reference Folder Audit
- **Check Performed**: Looked for `/reference` in workspace root and parent directories.
- **Result**: No `/reference` folder was present in the filesystem (`Test-Path "reference" -> False`).
- **Strategy**: Built production-grade, freshly authored logic grounded directly in official public documentation and statutory regulatory orders.

---

## 2. Inventory of Newly Written Assets

| Asset / Module | File Path | Grounding & Provenance |
| :--- | :--- | :--- |
| **State Tariff Slabs** | `config/tariffs.json` | Freshly authored using official State Electricity Regulatory Commission (SERC) tariff schedules for FY 2024-25 across Maharashtra (MSEDCL), Gujarat (UGVCL/PGVCL), Karnataka (BESCOM), Tamil Nadu (TANGEDCO), Delhi (BSES), and UP (UPPCL). |
| **Subsidy Framework** | `config/subsidy.json` | Structured as per Ministry of New and Renewable Energy (MNRE) **PM Surya Ghar: Muft Bijli Yojana** guidelines (₹30,000/kW up to 2 kW, ₹18,000 for 3rd kW, ₹78,000 maximum cap) along with state top-ups. |
| **RCO / RPO Trajectory** | `config/rpo_trajectory.json` | Structured directly from Ministry of Power (MoP) statutory notification under the Energy Conservation Act, mandating 29.91% for FY 2024-25 rising to 43.33% by FY 2029-30. |
| **Carbon Baseline** | `config/emission_factors.json` | Sourced from Central Electricity Authority (CEA) *CO2 Baseline Database for Indian Power Sector (User Guide v19.0)* at 0.716 kg CO2/kWh grid average. |
| **National Capacity Snapshot** | `data/capacity.json` | Sourced from CEA monthly Executive Summary on Power Sector (October 2024: 452.7 GW total, 209.5 GW non-fossil). |
| **Daily Generation Snapshot** | `data/generation.json` | Sourced from National Power Portal (NPP) & Grid-India (POSOCO) daily operational reports (~4,680 GWh/day, ~70.8% coal). |
| **Green Jobs Snapshot** | `data/jobs.json` | 42 seeded realistic job openings across Solar PV, Wind, Battery Energy Storage, Agro-PV, and ESG/BRSR. Labelled as sample demonstration data. |
| **Role-Based Context** | `lib/role-context.tsx` | Newly written React state context supporting 4 distinct personas: Citizen, DISCOM/Industry, Policymaker, and Financier. |
| **UI Components** | `components/` | Newly authored `Navbar`, `RoleSwitcher`, `StatCard`, `ChartCard`, and `DataFreshnessBadge` following clean modern design principles. |

---

## 3. License and Attribution Compliance
- All public data references are attributed to statutory Indian agencies (CEA, NPP, POSOCO/Grid-India, MNRE, BEE).
- All third-party npm packages (Next.js, Tailwind CSS, Recharts, Lucide-React, Supabase JS) use standard permissive MIT/Apache licenses.
