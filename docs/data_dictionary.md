# Data Dictionary - India Green Grid

**Project**: India Green Grid — National Clean Energy Decision-Support Platform  
**Database**: PostgreSQL 15 / Supabase  
**Storage Engine**: Normalized relational tables with JSON snapshot fallbacks  
**Version**: 1.0.0  

---

## Table 1: `sources`
Metadata registry of statutory Indian institutions and public reporting platforms providing energy data.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique internal identifier | `11111111-1111-1111-1111-111111111101` |
| `code` | VARCHAR(50) | No | UNIQUE | Short institutional acronym code | `CEA` |
| `name` | VARCHAR(150) | No | - | Common display name of the authority | `Central Electricity Authority` |
| `full_name` | VARCHAR(255) | No | - | Full legal statutory designation | `Central Electricity Authority, Ministry of Power` |
| `agency` | VARCHAR(255) | No | - | Parent government ministry or nodal agency | `Ministry of Power, Govt. of India` |
| `url` | TEXT | Yes | - | Official portal web address | `https://cea.nic.in` |
| `update_frequency` | VARCHAR(50) | No | - | Reporting cadence (`Daily`, `Monthly`, `Annual`) | `Monthly` |
| `description` | TEXT | Yes | - | Contextual mandate and statutory scope | `Section 73 Electricity Act power statistics publisher` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Record creation timestamp | `2026-11-12 12:00:00+05:30` |
| `updated_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Last schema update timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 2: `capacity`
Installed power generation capacity snapshots at All-India and State levels.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique capacity entry identifier | `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d` |
| `state` | VARCHAR(100) | No | DEFAULT `'All-India'` | Geographic scope (state name or national) | `All-India` |
| `source` | VARCHAR(100) | No | - | Fuel or generation technology | `Solar` |
| `category` | VARCHAR(50) | No | - | Broad classification (`Fossil`, `Renewable`, `Clean`) | `Renewable` |
| `mw` | NUMERIC(12,2)| No | CHECK `mw >= 0` | Installed capacity in Megawatts (MW) | `90760.00` |
| `share_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= share_pct <= 100` | Share of total installed capacity (%) | `20.05` |
| `as_of` | DATE | No | - | Official reporting snapshot cut-off date | `2024-10-31` |
| `source_id` | UUID | Yes | FOREIGN KEY -> `sources(id)` | Attribution backlink to data publisher | `11111111-1111-1111-1111-111111111101` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Database insertion timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 3: `generation`
Daily operational power generation metrics by fuel source in Gigawatt-hours (GWh).

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique daily generation row ID | `e7e2d9a0-2f3b-4890-a3e2-8b3c9d123456` |
| `date` | DATE | No | - | Operational calendar date of recorded dispatch | `2024-11-10` |
| `source` | VARCHAR(100) | No | - | Fuel type (`Coal`, `Hydro`, `Solar`, `Wind`, `Gas`) | `Coal` |
| `category` | VARCHAR(50) | No | - | Sector category (`Fossil`, `Renewable`, `Clean`) | `Fossil` |
| `gwh` | NUMERIC(10,2)| No | CHECK `gwh >= 0` | Actual energy generated across 24h in GWh | `3315.20` |
| `share_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= share_pct <= 100` | Fraction of total daily generation (%) | `70.83` |
| `source_id` | UUID | Yes | FOREIGN KEY -> `sources(id)` | Attribution backlink to reporting authority | `11111111-1111-1111-1111-111111111102` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Record insertion timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 4: `rpo_targets`
Statutory Renewable Consumption Obligation (RCO) / RPO trajectory targets notified by Ministry of Power.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique target ID | `c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f` |
| `year` | VARCHAR(10) | No | UNIQUE | Target financial year milestone | `2024-25` |
| `total_pct` | NUMERIC(5,2) | No | CHECK `0 <= total_pct <= 100` | Mandatory total renewable consumption (%) | `29.91` |
| `solar_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= solar_pct <= 100` | Indicative solar sub-target share (%) | `21.00` |
| `non_solar_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= non_solar_pct <= 100` | Non-solar renewable target share (%) | `8.91` |
| `wind_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= wind_pct <= 100` | Specific Wind RPO trajectory sub-mandate (%) | `0.67` |
| `hydro_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= hydro_pct <= 100` | Hydro Purchase Obligation (HPO) share (%) | `0.38` |
| `other_re_pct` | NUMERIC(5,2) | Yes | CHECK `0 <= other_re_pct <= 100` | Other RE (biomass, co-firing, waste) share (%)| `28.86` |
| `statutory_framework`| VARCHAR(100)| Yes| DEFAULT `'RCO'` | Regulatory statutory framework label | `Renewable Consumption Obligation (RCO)` |
| `notified_date` | DATE | Yes | - | MoP Gazette notification date | `2023-10-20` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Target creation timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 5: `subsidies`
Financial assistance tiers and caps under PM Surya Ghar and state top-up schemes.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique subsidy tier identifier | `d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a` |
| `scheme` | VARCHAR(150)| No | - | Government program title | `PM Surya Ghar: Muft Bijli Yojana` |
| `state` | VARCHAR(100)| No | DEFAULT `'All-India'` | Applicable state jurisdiction or national | `All-India` |
| `kw_min` | NUMERIC(5,2) | No | DEFAULT `0` | Lower capacity threshold for tier in kW | `0.00` |
| `kw_max` | NUMERIC(5,2) | No | - | Upper capacity threshold for tier in kW | `2.00` |
| `amount` | NUMERIC(10,2)| No | CHECK `amount >= 0` | Financial assistance rate per kW in INR | `30000.00` |
| `max_amount` | NUMERIC(10,2)| No | CHECK `max_amount >= 0` | Maximum monetary cap for tier in INR | `60000.00` |
| `subsidy_type` | VARCHAR(50) | No | DEFAULT `'central_cfa'` | Class (`central_cfa`, `state_topup`, `gbi`) | `central_cfa` |
| `notes` | TEXT | Yes | - | Eligibility caveats and procedural rules | `₹30,000 per kW up to 2 kW capacity` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Insertion timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 6: `jobs`
Green workforce listings across clean technology and environmental engineering domains.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | No | PRIMARY KEY | Custom slug or identifier | `job-001` |
| `title` | VARCHAR(200)| No | - | Designation of opening | `Senior Solar PV Site Engineer` |
| `category` | VARCHAR(100)| No | - | Sector segment (`Solar`, `Wind`, `Battery`) | `Solar Installation` |
| `company` | VARCHAR(200)| No | - | Hiring organization | `Tata Power Solar Systems` |
| `location` | VARCHAR(200)| No | - | City and State of posting | `Ahmedabad, Gujarat` |
| `type` | VARCHAR(50) | No | DEFAULT `'Full-Time'` | Engagement (`Full-Time`, `Contract`) | `Full-Time` |
| `experience` | VARCHAR(100)| Yes | - | Required relevant tenure | `3-5 years` |
| `salary_range` | VARCHAR(100)| Yes | - | Compensation range in INR per annum | `₹6,00,000 - ₹9,50,000` |
| `description` | TEXT | Yes | - | Role responsibilities and operational scope | `Supervise 50MW ground-mounted solar PV...`|
| `skills` | TEXT[] | Yes | - | Key competencies array | `{"AutoCAD", "PVSyst", "HT Substations"}` |
| `apply_url` | TEXT | No | - | Application destination link | `https://careers.tatapower.com` |
| `is_sample` | BOOLEAN | Yes | DEFAULT `TRUE` | Demo indicator flag | `true` |
| `posted_date` | DATE | Yes | DEFAULT `CURRENT_DATE` | Date listing was published | `2024-11-05` |
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Ingestion timestamp | `2026-11-12 12:00:00+05:30` |

---

## Table 7: `green_finance_schemes`
Concessional institutional lending facilities and credit mechanisms.

| Field Name | Type | Nullable | Constraints / Defaults | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | PRIMARY KEY, default `uuid_generate_v4()` | Unique scheme ID | `a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d` |
| `institution` | VARCHAR(150)| No | - | Financial institution (`IREDA`, `SIDBI`, `PFC`) | `IREDA` |
| `scheme_name` | VARCHAR(200)| No | - | Credit facility title | `Access to Clean Energy Financing` |
| `category` | VARCHAR(100)| No | - | Asset class target (`Utility RE Capex`, `MSME`) | `Utility RE Capex` |
| `target_borrower`| VARCHAR(100)| No| - | Borrower persona (`MSME`, `Developer`, `Farmer`)| `RE Developer` |
| `interest_rate_pct`| NUMERIC(4,2)| Yes| - | Indicative concessional borrowing rate (%) | `8.25` |
| `max_tenure_years` | INT | Yes | - | Maximum loan repayment term in years | `15` |
| `eligible_technologies`| TEXT[] | Yes | - | Permitted clean tech assets | `{"Solar PV", "Wind", "Hybrid RE", "BESS"}` |
| `apply_url` | TEXT | Yes | - | Portal for application submission | `https://ireda.in` |
| `description` | TEXT | Yes | - | Financial summary and covenants | `Concessional debt for grid-scale solar...`|
| `created_at` | TIMESTAMPTZ | Yes | DEFAULT `NOW()` | Record creation timestamp | `2026-11-12 12:00:00+05:30` |
