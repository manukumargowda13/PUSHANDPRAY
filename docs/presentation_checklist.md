# Platform Verification & Operational Walkthrough - India Green Grid

**Platform**: India Green Grid — National Clean Energy Decision-Support Platform  
**Scope**: Verification and operational walkthrough across core modules D1–D4.  
**Reviewer Guide**: Step-by-step verification checklist for operational readiness.

---

## 📋 1. Statutory Data Integrity Checklist

- [ ] **CEA National Installed Capacity (452,693 MW)**
  - *Verification*: Confirm total installed capacity is ~452.7 GW and non-fossil capacity is 209.5 GW (~46.3%).
  - *Location*: Checked via `data/capacity.json` and displayed on `/dashboard`.
- [ ] **NPP Daily Generation Dispatch (~4,680 GWh/day)**
  - *Verification*: Confirm daily coal dispatch is ~3,315 GWh (70.8%) and renewables dispatch is ~655 GWh (14.0%).
  - *Location*: Checked via `data/generation.json` and displayed on `/dashboard`.
- [ ] **The Coal vs Renewables Generation Gap**
  - *Verification*: Confirm generation gap displays ~56.8% structural difference.
- [ ] **RCO Statutory Trajectory (Oct 2023 Gazette)**
  - *Verification*: FY 2024-25 = 29.91% rising to FY 2029-30 = 43.33%.
  - *Location*: Defined in `config/rpo_trajectory.json` and displayed on `/rpo`.
- [ ] **PM Surya Ghar Subsidy Caps**
  - *Verification*: ₹30,000/kW for 1–2 kW, ₹78,000 max for 3 kW+.
  - *Location*: Defined in `config/subsidy.json` and computed on `/solar`.

---

## 🛡️ 2. Zero-Crash Fallback Verification

- [ ] Disconnect internet or set invalid Supabase keys in `.env.local`.
- [ ] Verify pages load smoothly with authenticated static snapshots in `/data`.
- [ ] Verify `DataFreshnessBadge` labels data provenance correctly.

---

## 🌐 3. Multilingual & Accessibility Verification

- [ ] Verify all 8 Indian languages in the navbar: English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali.
- [ ] Verify high-contrast mode and large-text toggles function without layout distortion.
- [ ] Verify "What does this mean?" term explainers open modal dialogs with plain-language definitions.

---

## 🎤 4. Executive Platform Walkthrough & Briefing Script

1. **The Problem & D1 Dashboard**:
   - *"India's energy data is fragmented across CEA PDFs, NPP operational logs, and state SERC orders. The headline says India has 46% clean capacity, but when you look at actual daily generation on our D1 Dashboard, coal still produces 71% of all kilowatt-hours. That's a 56.8% gap caused by plant load factor differences."*
2. **The Industry & Citizen Decision Engines (D2 & D3)**:
   - *"For obligated entities under the amended Energy Conservation Act, our D2 RCO Tracker calculates exact compliance percentages and shortfall in kWh against the 2024-25 29.91% mandate."*
   - *"For homeowners, our D3 Calculator automatically models PM Surya Ghar subsidies up to ₹78,000, state top-ups, and 25-year returns factoring in panel degradation and tariff growth."*
3. **Green Workforce & Roadmap (D4 & D5-D9)**:
   - *"Our D4 board curates verified clean tech jobs across battery design, wind maintenance, and agro-PV. Behind the scenes, automated daily Python scrapers keep snapshots fresh with zero-crash fallbacks, with a clear expansion roadmap for green finance and solar recycling."*
