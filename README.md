# India Green Grid

> **CodeSpark 2026 Hackathon (12-Hour Sprint)**  
> A role-based public energy decision-support platform turning fragmented Indian energy data into actionable intelligence for citizens, DISCOMs, industries, regulators, and financiers.

---

## ⚡ Key Highlights & MVP Scope
- **D1 Energy Mix & Generation Dashboard**: Installed capacity vs daily generation breakdown highlighting the thermal coal vs renewable energy gap.
- **D2 RPO / RCO Compliance Tracker**: Compute Renewable Consumption Obligation compliance percentage and shortfall (kWh) against the statutory trajectory (29.91% in 2024-25 rising to 43.33% by 2029-30).
- **D3 Rooftop Solar ROI & Subsidy Calculator**: System sizing, PM Surya Ghar central CFA + state subsidies, net investment, payback years, panel degradation, and 25-year financial returns.
- **D4 Green Jobs Board**: Searchable and filterable listings across solar PV, wind maintenance, battery design, agro-photovoltaics, and ESG auditing (42 seeded listings).
- **D5–D9 Expansion Roadmap**: Future scope for green finance aggregators, circular solar recycling, air quality impact, AI battery dispatch, and enterprise SSO portals.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Visualizations**: Recharts (interactive responsive charts)
- **Database / Auth**: Supabase (PostgreSQL with graceful offline JSON snapshot fallback)
- **Scraper**: Python (requests + pandas) scheduled via GitHub Actions

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Installation
```bash
# Navigate to the project directory
cd india-green-grid

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Note: If Supabase credentials are not provided, the application automatically runs in zero-crash offline mode using curated JSON snapshots in `/data`.)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Tests
```bash
npm test
```

---

## 📁 Directory Structure
```
india-green-grid/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx            # Global RootLayout with RoleProvider & Navbar
│   ├── page.tsx              # Landing page with hero & module links
│   ├── dashboard/page.tsx    # D1 Energy Mix Dashboard
│   ├── rpo/page.tsx          # D2 RPO / RCO Compliance Tracker
│   ├── solar/page.tsx        # D3 Rooftop Solar ROI & Subsidy Calculator
│   ├── jobs/page.tsx         # D4 Green Jobs Board
│   ├── roadmap/page.tsx      # D5-D9 Product Expansion Roadmap
│   └── api/                  # API endpoints
├── components/               # Small, reusable UI components
│   ├── Navbar.tsx            # Responsive navigation bar with mobile drawer
│   ├── RoleSwitcher.tsx      # Multi-role lens switcher (Citizen, DISCOM, Regulator, Financier)
│   ├── StatCard.tsx          # KPI metric card with trend indicators
│   ├── ChartCard.tsx         # Chart container with DataFreshnessBadge slot
│   └── DataFreshnessBadge.tsx# Mandatory data provenance and freshness badge
├── lib/                      # Core utilities and data layer
│   ├── supabase.ts           # Supabase client with offline fallback detection
│   ├── utils.ts              # Currency, energy, and date formatters
│   ├── role-context.tsx      # Role state management React context
│   └── calculators/          # Financial and compliance calculation engines
├── config/                   # Configurable assumptions (never hardcoded)
│   ├── tariffs.json          # State slab tariffs and escalation rates
│   ├── subsidy.json          # PM Surya Ghar CFA and state top-up rules
│   ├── rpo_trajectory.json   # Statutory RCO targets (2024-25 to 2029-30)
│   └── emission_factors.json # CEA grid carbon emission factors & solar parameters
├── data/                     # Offline JSON snapshots (fail-safe fallback)
│   ├── capacity.json         # CEA installed capacity by source (MW)
│   ├── generation.json       # NPP/CEA daily generation by source (GWh)
│   └── jobs.json             # 42 seeded green job listings (sample data)
├── scraper/                  # Python scraper scripts for CEA & NPP reports
├── supabase/                 # Database schema (schema.sql) and migrations
└── docs/                     # Provenance log, data dictionary, and reuse audit
    └── reuse_log.md          # Log of newly written vs reused components
```

---

## 🏛 Statutory Data Sources
- **CEA (Central Electricity Authority)**: Installed Capacity Reports & CO2 Baseline Database v19.0.
- **NPP (National Power Portal)**: Daily Generation Reports by fuel type.
- **Grid-India (POSOCO)**: National grid operational reports.
- **MNRE**: PM Surya Ghar Muft Bijli Yojana subsidy schedules.
- **SERCs**: State electricity tariff orders.
