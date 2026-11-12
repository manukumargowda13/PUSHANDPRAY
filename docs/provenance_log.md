# Data Provenance and Source Registry

**Project**: India Green Grid (CodeSpark 2026 Hackathon)  
**Objective**: Comprehensive audit trail of statutory Indian public energy datasets used across D1–D4 modules.  
**Rule**: Transparent attribution with live URLs, access dates, update frequencies, and statutory authority.  

---

## 1. Statutory Source Inventory

### 1. Central Electricity Authority (CEA)
- **Organization**: Central Electricity Authority, Ministry of Power, Govt. of India
- **Statutory Mandate**: Section 73 of the Electricity Act, 2003 (National Electricity Plan & Sector Statistics)
- **Public URL**: [https://cea.nic.in](https://cea.nic.in)
- **Target Report**: *Monthly Executive Summary on Power Sector* & *All-India Installed Capacity Report*
- **Report Download Path / Direct Link**: `https://cea.nic.in/executive-summary-report/?lang=en`
- **Access Date**: 2024-11-10
- **Update Frequency**: Monthly (typically released by the 10th of following month)
- **Format**: PDF / HTML Tables / Excel
- **Data Extracted**:
  - All-India Installed Generation Capacity (Total: 452,693 MW)
  - Fuel Breakdown: Coal (217,580 MW), Solar (90,760 MW), Wind (47,360 MW), Hydro (46,928 MW), Gas (25,038 MW), Nuclear (8,180 MW), Other RE (16,458 MW), Diesel (589 MW)
  - CO2 Baseline Database for Indian Power Sector (User Guide v19.0): Weighted average grid emission factor `0.716 kg CO2/kWh`
- **Internal / Alternate Feed**: ____________________________ *(fill if available)*
- **API Token / Credentials**: ____________________________ *(fill if available)*

---

### 2. National Power Portal (NPP)
- **Organization**: Ministry of Power & CEA, Govt. of India
- **Statutory Mandate**: Real-time generation reporting and power monitoring infrastructure
- **Public URL**: [https://npp.gov.in](https://npp.gov.in)
- **Target Report**: *Daily Generation Report (Fuel-Wise & Station-Wise)*
- **Report Download Path / Direct Link**: `https://npp.gov.in/dailyReports`
- **Access Date**: 2024-11-10
- **Update Frequency**: Daily (published morning for preceding calendar day)
- **Format**: Dynamic Web Grid / Excel / PDF
- **Data Extracted**:
  - Daily All-India generation (GWh)
  - Fuel share breakdown: Coal (~3,315 GWh / 70.8%), Hydro (~395 GWh), Solar (~365 GWh), Wind (~235 GWh), Gas (~180 GWh), Nuclear (~134 GWh)
  - Fuel gap metric: Highlights the disparity between 46.3% clean installed capacity vs ~25% clean daily generation
- **Scraper Target Endpoint**: `https://npp.gov.in/publishedReports`
- **Internal / Alternate Feed**: ____________________________ *(fill if available)*
- **Contact / Desk Officer**: ____________________________ *(fill if available)*

---

### 3. Grid Controller of India Limited (Grid-India / POSOCO)
- **Organization**: Grid Controller of India Limited (formerly Power System Operation Corporation)
- **Statutory Mandate**: Section 26 & 27 of Electricity Act, 2003 (National Load Despatch Centre)
- **Public URL**: [https://grid-india.in](https://grid-india.in)
- **Target Report**: *Daily Operational Reports & Regional RE Penetration Dashboards*
- **Report Download Path / Direct Link**: `https://grid-india.in/reports/daily-reports/`
- **Access Date**: 2024-11-10
- **Update Frequency**: Daily (sub-hourly SCADA aggregation)
- **Format**: PDF / CSV / Web Dashboard
- **Data Extracted**:
  - Peak demand met (MW)
  - Maximum daily solar and wind generation peaks
  - Regional transmission constraints and inter-regional RE exchange
- **Internal / Alternate Feed**: ____________________________ *(fill if available)*
- **API Key**: ____________________________ *(fill if available)*

---

### 4. Ministry of New and Renewable Energy (MNRE)
- **Organization**: Ministry of New and Renewable Energy, Govt. of India
- **Statutory Mandate**: Nodal ministry for national renewable energy targets, schemes, and guidelines
- **Public URL**: [https://mnre.gov.in](https://mnre.gov.in)
- **Portal URL**: [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in) (National Portal for PM Surya Ghar)
- **Target Guidelines**: *PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA) Operational Guidelines*
- **Notification Reference**: MNRE Order No. 318/331/2023-GCRT (February 2024)
- **Access Date**: 2024-10-15
- **Update Frequency**: Event-driven / Policy revisions
- **Format**: Gazette Notifications / Policy Circulars (PDF)
- **Data Extracted**:
  - CFA Subsidy Slabs: ₹30,000/kW up to 2 kW, ₹18,000 for 3rd kW, capped at ₹78,000 for residential systems > 3 kW
  - National benchmark cost: ~₹55,000/kW
- **Internal / Alternate Feed**: ____________________________ *(fill if available)*

---

### 5. Central Pollution Control Board (CPCB)
- **Organization**: Central Pollution Control Board, Ministry of Environment, Forest and Climate Change
- **Statutory Mandate**: Water Act 1974 & Air Act 1981 (National Air Quality & Environmental Standards)
- **Public URL**: [https://cpcb.nic.in](https://cpcb.nic.in)
- **Portal URL**: [https://app.cpcbccr.com/AQI_India/](https://app.cpcbccr.com/AQI_India/) (National AQI Portal)
- **Access Date**: 2024-11-01
- **Update Frequency**: Continuous (Hourly automated CAAQMS stations)
- **Format**: JSON API / Web Portal
- **Data Extracted**:
  - Ambient air particulate baselines (PM2.5, PM10, SO2, NOx)
  - Thermal power plant emission norms (SOx scrubbers / FGD compliance benchmarks)
- **API Endpoint / Token**: ____________________________ *(fill if available)*
- **CAAQMS Station Identifier**: ____________________________ *(fill if available)*

---

### 6. Bureau of Energy Efficiency (BEE) & Ministry of Power (MoP)
- **Organization**: Bureau of Energy Efficiency & Ministry of Power, Govt. of India
- **Statutory Mandate**: Energy Conservation Act, 2001 (amended in 2022 to introduce statutory RCO)
- **Public URL**: [https://beeindia.gov.in](https://beeindia.gov.in)
- **Target Notification**: *Trajectory for Renewable Consumption Obligation (RCO) up to 2029-30*
- **Gazette Reference**: S.O. 4589(E) dated 20th October 2023
- **Access Date**: 2024-04-01
- **Update Frequency**: Multi-year statutory trajectory (annual milestones)
- **Format**: Gazette Notification (PDF)
- **Data Extracted**:
  - FY 2024-25: Total 29.91% (Wind 0.67%, HPO 0.38%, Other RE 28.86%)
  - FY 2025-26: Total 33.01%
  - FY 2026-27: Total 35.95%
  - FY 2027-28: Total 38.81%
  - FY 2028-29: Total 41.36%
  - FY 2029-30: Total 43.33%
- **Compliance Registry**: ____________________________ *(fill if available)*

---

### 7. State Electricity Regulatory Commissions (SERCs)
- **Authorities**:
  - **MERC** (Maharashtra Electricity Regulatory Commission): [https://merc.gov.in](https://merc.gov.in)
  - **GERC** (Gujarat Electricity Regulatory Commission): [https://gercin.org](https://gercin.org)
  - **KERC** (Karnataka Electricity Regulatory Commission): [https://kerc.karnataka.gov.in](https://kerc.karnataka.gov.in)
  - **TNERC** (Tamil Nadu Electricity Regulatory Commission): [https://tnerc.gov.in](https://tnerc.gov.in)
  - **DERC** (Delhi Electricity Regulatory Commission): [https://derc.gov.in](https://derc.gov.in)
  - **UPERC** (Uttar Pradesh Electricity Regulatory Commission): [https://uperc.org](https://uperc.org)
- **Target Orders**: Annual Retail Tariff Orders for State DISCOMs (FY 2024-25)
- **Access Date**: 2024-11-01
- **Update Frequency**: Annual
- **Format**: Multi-Year Tariff (MYT) Orders (PDF)
- **Data Extracted**:
  - Residential consumption tier slabs (0-100, 101-300, 301-500, >500 kWh/month)
  - Energy charges (Rs/kWh), fixed demand charges (Rs/kW/month), and fuel surcharge adjustment (FSA)
- **Discom Billing API Endpoint**: ____________________________ *(fill if available)*

---

## 2. Maintenance and Re-Verification Protocol
1. **Automated Verification**: Scraper in `/scraper` verifies MD5 hash / ETags of target CEA/NPP PDFs daily.
2. **Snapshot Refresh**: In case of statutory revisions, updated figures are merged into `/data` snapshots and upserted to Supabase.
3. **Audit Trail**: Any manual edit to `/config` or `/data` must update the corresponding `last_updated` date string in ISO `YYYY-MM-DD` format.
