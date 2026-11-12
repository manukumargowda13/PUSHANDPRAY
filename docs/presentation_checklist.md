# Hackathon Demo & Presentation Checklist - India Green Grid

**Event**: CodeSpark 2026 Hackathon (12-Hour Sprint)  
**Deliverable**: Live Demoable MVP of "India Green Grid"  
**Reviewer / Presenter Guide**: Step-by-step manual verification checklist before taking the stage.

---

## 📋 1. Statutory Data Integrity Checklist

- [ ] **CEA National Installed Capacity (452,693 MW)**
  - *Verification*: Confirm total installed capacity is ~452.7 GW and non-fossil capacity is 209.5 GW (~46.3%).
  - *Location*: Checked via [`data/capacity.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/data/capacity.json) and displayed on `/dashboard`.
- [ ] **NPP Daily Generation Dispatch (~4,680 GWh/day)**
  - *Verification*: Confirm daily coal dispatch is ~3,315 GWh (70.8%) and renewables dispatch is ~655 GWh (14.0%).
  - *Location*: Checked via [`data/generation.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/data/generation.json) and displayed on `/dashboard`.
- [ ] **The "Coal vs Renewables Gap" (56.8% Points)**
  - *Verification*: Ensure the gap card explicitly highlights that despite 46.3% clean capacity, coal delivers 70.8% of daily energy due to Plant Load Factor (PLF) differentials.
- [ ] **Mandatory DataFreshnessBadge**
  - *Verification*: Verify that every single chart on `/dashboard`, `/rpo`, and `/solar` carries a visible source name and last-updated timestamp.

---

## 💰 2. Subsidy & Tariff Figures Checklist

- [ ] **PM Surya Ghar CFA Subsidy Tiers**
  - *Verification*: Check that systems up to 2 kW receive ₹30,000/kW, 3 kW systems receive ₹78,000, and systems &gt;3 kW remain strictly **capped at ₹78,000**.
  - *Location*: Configured in [`config/subsidy.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/subsidy.json) and tested in `tests/solar-calculator.test.mjs`.
- [ ] **State Top-Up Subsidies**
  - *Verification*: Test selecting **Uttar Pradesh** in `/solar` and ensure an additional state top-up (up to ₹30,000) is factored in.
  - *Verification*: Test selecting **Delhi** and ensure ₹2,000/kW state top-up is applied.
- [ ] **State Slab Tariffs**
  - *Verification*: Confirm Maharashtra (MSEDCL ₹8.15/kWh), Gujarat (UGVCL ₹6.20/kWh), and Karnataka (BESCOM ₹7.45/kWh) reflect current SERC tariff orders.

---

## ⚖️ 3. RPO / RCO Trajectory Verification

- [ ] **Ministry of Power Statutory Milestones**
  - *Verification*: Confirm FY 2024-25 target is exactly **29.91%** and FY 2029-30 target is **43.33%**.
  - *Location*: Checked in [`config/rpo_trajectory.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/config/rpo_trajectory.json).
- [ ] **Dynamic User Position Marking**
  - *Verification*: On `/rpo`, input 10 Lakh kWh total consumption and 2 Lakh kWh renewable consumption. Verify that the user's position (20%) is rendered as a marked reference dot below the statutory trajectory line.
- [ ] **Shortfall Formula**
  - *Verification*: Confirm shortfall displays 99,100 kWh (with 100 RECs needed).

---

## 💼 4. Green Jobs & Sample Data Tagging

- [ ] **At Least 40 Seeded Listings**
  - *Verification*: Confirm [`data/jobs.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/data/jobs.json) contains **42 listings** across Solar, Wind, Battery, Agro-PV, and ESG.
- [ ] **Mandatory Sample Data Tags**
  - *Verification*: Confirm every job card on `/jobs` displays a visible `sample data` badge in the UI and is commented accordingly in the code.
- [ ] **Search & Filter Functionality**
  - *Verification*: Test clicking the "Battery Design" category pill and searching for "BMS" or "AutoCAD" to demonstrate reactive filtering.

---

## 🛡 5. Zero-Crash Offline Resilience & Code Licenses

- [ ] **Offline Fallback Guarantee**
  - *Verification*: Confirm that running the app without active Supabase credentials loads all pages safely from `/data` snapshots with zero unhandled exceptions.
- [ ] **Third-Party Code License Compliance**
  - *Next.js*: MIT License
  - *Tailwind CSS*: MIT License
  - *Recharts*: MIT License
  - *Lucide Icons*: ISC License
  - *Supabase Client*: Apache 2.0 License
  - *Audit Log*: Documented in [`docs/reuse_log.md`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/docs/reuse_log.md).

---

## 🎤 6. Recommended 3-Minute Hackathon Pitch Script

1. **Minute 1 - The Problem & D1 Dashboard**:
   - *"India's energy data is fragmented across CEA PDFs, NPP operational logs, and state SERC orders. The headline says India has 46% clean capacity, but when you look at actual daily generation on our D1 Dashboard, coal still produces 71% of all kilowatt-hours. That's a 56.8% gap caused by plant load factor differences."*
2. **Minute 2 - The Industry & Citizen Decision Engines (D2 & D3)**:
   - *"For obligated entities under the amended Energy Conservation Act, our D2 RCO Tracker calculates exact compliance percentages and shortfall in kWh against the 2024-25 29.91% mandate."*
   - *"For homeowners, our D3 Calculator automatically models PM Surya Ghar subsidies up to ₹78,000, state top-ups, and 25-year returns factoring in panel degradation and tariff growth."*
3. **Minute 3 - Green Workforce & Roadmap (D4 & D5-D9)**:
   - *"Our D4 board curates 42 clean tech jobs across battery design, wind maintenance, and agro-PV. Behind the scenes, automated daily Python scrapers keep snapshots fresh with zero-crash fallbacks, with a clear expansion roadmap for green finance and solar recycling."*
