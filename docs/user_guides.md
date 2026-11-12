# Stakeholder User Guides - India Green Grid

**Platform**: India Green Grid — National Clean Energy Decision-Support Platform  
**Access Architecture**: Role-based decision support with stateful persona switching  

---

## 1. Citizen & Homeowner Guide

### Objective
Maximize household electricity bill savings, claim up to **₹78,000** under the **PM Surya Ghar: Muft Bijli Yojana**, evaluate rooftop net-metering payback, and explore local clean energy employment.

### Key Workflows
1. **Calculate Rooftop Solar Sizing & Subsidies (Module D3)**:
   - Navigate to `/solar`.
   - Select your state (e.g. Maharashtra, Gujarat, Uttar Pradesh).
   - Input your average monthly electricity bill (e.g. ₹3,500) or units (e.g. 350 kWh).
   - Enter your available shadow-free roof area in square feet.
   - Instantly review:
     - **Recommended System Size**: Scaled to offset 100% of your bill while respecting your physical roof area (100 sq.ft per kW).
     - **PM Surya Ghar Central CFA**: Directly calculated as ₹30,000/kW up to 2 kW, +₹18,000 for the 3rd kW, up to a hard cap of ₹78,000.
     - **State Top-Up Subsidy**: Automatically calculated for states like Uttar Pradesh (up to ₹30,000) and Delhi.
     - **Payback Period**: Typically 2.5 to 4.2 years, after which power is generated free for 20+ years.
2. **Discover Local Clean Energy Careers (Module D4)**:
   - Navigate to `/jobs`.
   - Filter by **Solar Installation** to view rooftop technician, site survey, and Suryamitra certified installer openings in your region.

---

## 2. DISCOM & Obligated Industry Guide

### Objective
Audit compliance against the statutory **Renewable Consumption Obligation (RCO)**, compute clean energy deficits in kWh, avoid regulatory non-compliance penalties, and structure Green Energy Open Access (GEOA) contracts.

### Key Workflows
1. **Audit Annual RCO Compliance & Shortfall (Module D2)**:
   - Navigate to `/rpo`.
   - Select the target compliance financial year (e.g. FY 2024-25 at 29.91% rising to FY 2029-30 at 43.33%).
   - Select your entity classification (e.g. *DISCOM*, *Open Access Consumer &gt;100 kW*, or *BEE Designated Industrial Consumer*).
   - Enter your total annual electricity consumption (e.g. 10 Lakh kWh or 1 Crore kWh).
   - Enter your verified renewable energy procurement.
   - Review immediate statutory formula outputs:
     - **Compliance % Achieved**: `(RE Consumed / Total Consumption) × 100`.
     - **Shortfall in kWh**: If in deficit, see exact additional units required.
     - **REC Surrender Equivalent**: Calculates the number of Renewable Energy Certificates (1 REC = 1 MWh / 1,000 kWh) needed to extinguish the shortfall.
     - **Trajectory Plot**: Visual check of your entity plotted directly as a marked pin against the statutory national curve.
2. **Formulate Procurement Strategy**:
   - Consult the automated advisory box to evaluate purchasing physical green power on the **IEX Green Day-Ahead Market (GDAM)** vs off-site GEOA bilateral contracts.

---

## 3. Policymaker & Grid Regulator Guide

### Objective
Monitor the national clean energy transition, analyze the structural **Coal vs Renewables generation gap**, assess state-by-state capacity leadership, and calibrate statutory RCO trajectory milestones.

### Key Workflows
1. **Analyze the Coal vs Renewables Gap (Module D1)**:
   - Navigate to `/dashboard`.
   - Inspect the highlighted **Coal vs Renewables Gap** section:
     - Observe that non-fossil fuel capacity has reached **46.28%** (209.5 GW), nearing parity with coal (48.06% / 217.6 GW).
     - Contrast this with the daily operational generation share, where thermal coal still accounts for **70.83%** (3,315 GWh/day) while renewables account for only **14.0%** (655 GWh/day).
     - Review the 56.8% percentage point generation gap caused by differing Plant Load Factors (Coal ~68% vs Solar ~21%).
2. **Evaluate State Transition Leaders (Module D1)**:
   - Examine the state-level comparison chart comparing solar and wind leadership across Rajasthan (23.4 GW solar), Gujarat (14.2 GW solar, 11.8 GW wind), and Tamil Nadu (10.5 GW wind).
3. **Calibrate National RCO Trajectory (Module D2)**:
   - Verify that statutory targets (29.91% to 43.33%) are supported by sufficient storage capacity to avoid curtailment during peak solar hours.

---

## 4. Financier & Climate Fund Guide

### Objective
Assess clean energy project capital expenditure yields, stress-test 25-year financial models under panel degradation and tariff escalation, evaluate subsidy leverage ratios, and monitor clean employment growth.

### Key Workflows
1. **Stress-Test 25-Year Asset Yields (Module D3)**:
   - Navigate to `/solar`.
   - Open the **Advanced Parameters** drawer.
   - Adjust the **Annual Tariff Escalation Rate** (default 4.5%, testable from 2.0% to 8.0%) and **Panel Degradation Rate** (default 0.7%, testable from 0.3% to 1.5%).
   - Inspect the 25-year cash flow curve, verifying that cumulative net savings comfortably exceed gross CAPEX even after factoring in Year 12 inverter replacements and annual O&M inflation.
2. **Evaluate Subsidy Leverage**:
   - Observe that the PM Surya Ghar CFA funds between **35% and 55%** of gross CAPEX for residential systems below 3 kW, significantly reducing consumer default risk and debt payback periods.
3. **Analyze Green Workforce Expansion (Module D4)**:
   - Navigate to `/jobs` to analyze high-value technology domains such as **Battery Design** (BMS firmware, cell thermal management) and **Sustainability Consulting** (BRSR and ESG assurance).
