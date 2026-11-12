# India Green Grid

> **National Clean Energy Intelligence & Decision-Support Platform**  
> A role-based public energy decision-support platform turning fragmented Indian statutory data into actionable intelligence for citizens, DISCOMs, industries, regulators, and financiers.

---

## ⚡ Core Operational Modules
- **D1 Energy Mix & Generation Dashboard**: Installed capacity (452.7 GW) vs daily generation (4,680 GWh) breakdown exposing the structural 56.8% gap between non-fossil capacity additions and actual daily dispatch.
- **D2 RPO / RCO Compliance Tracker**: Compute Renewable Consumption Obligation (RCO) compliance percentage and shortfall (kWh) against the statutory Ministry of Power trajectory (29.91% in 2024-25 rising to 43.33% by 2029-30).
- **D3 Rooftop Solar ROI & Subsidy Calculator**: Deterministic financial engine for system sizing, PM Surya Ghar central CFA (up to ₹78,000) + state subsidies, net investment, payback years, panel degradation, and 25-year cumulative financial returns.
- **D4 Green Jobs Board**: Searchable and filterable listings across solar PV, wind maintenance, battery design, agro-photovoltaics, and ESG auditing.
- **D5–D9 Expansion Roadmap**: National expansion roadmap for concessional green debt aggregators, circular solar recycling, air quality impact, AI battery dispatch, and enterprise SSO portals.

---

## 🌐 Multilingual & Public Accessibility Features
- **8 Indian Languages**: English (`en`), Hindi (`hi`), Kannada (`kn`), Tamil (`ta`), Telugu (`te`), Malayalam (`ml`), Marathi (`mr`), and Bengali (`bn`) with zero-crash English fallback.
- **Interactive Technical Term Explainers**: Instant "What does this mean?" explainers for ordinary citizens covering Capacity vs Generation, Plant Load Factor (PLF), Coal Gap, RCO mandates, Net Metering, and Carbon emission factors.
- **Accessibility Controls**: Large-text scaling and high-contrast accessibility modes available directly in the navigation bar.
- **Component-Level Error Boundaries**: Resilient React error boundaries around all cards, charts, and calculators ensuring isolated widget failures never crash the page.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons (Midnight Navy `#0F2137`, Warm Ivory `#FBF9F4`, Muted Teal `#0F766E`, Saffron Amber `#D97706`, Natural Green `#15803D`)
- **Visualizations**: Recharts (interactive responsive charts)
- **Database / Auth**: Supabase (PostgreSQL with graceful offline JSON snapshot fallback)
- **Scraper**: Python (requests + pandas) scheduled via GitHub Actions

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Note: If Supabase credentials are not provided, the application automatically runs in zero-crash offline mode using verified statutory JSON snapshots in `/data`.)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Tests & Production Build
```bash
npm test
npm run build
```

---

## 📁 Directory Structure
```
india-green-grid/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx            # Global RootLayout with LanguageProvider, RoleProvider & Navbar
│   ├── page.tsx              # Landing page with hero, snapshot, and module links
│   ├── dashboard/page.tsx    # D1 Energy Mix Dashboard
│   ├── rpo/page.tsx          # D2 RPO / RCO Compliance Tracker
│   ├── solar/page.tsx        # D3 Rooftop Solar ROI & Subsidy Calculator
│   ├── jobs/page.tsx         # D4 Green Jobs Board
│   ├── roadmap/page.tsx      # D5-D9 Product Expansion Roadmap
│   └── api/                  # API endpoints (/api/health, /api/solar)
├── components/               # Small, reusable UI components
│   ├── Navbar.tsx            # Navigation bar with 8-language switcher & accessibility toggles
│   ├── RoleSwitcher.tsx      # Multi-role lens switcher (Citizen, DISCOM, Regulator, Financier)
│   ├── StatCard.tsx          # KPI metric card with trend indicators & TermExplainer
│   ├── ChartCard.tsx         # Chart container with ErrorBoundary & DataFreshnessBadge
│   ├── TermExplainer.tsx     # Plain-language explainer modal for energy terminology
│   ├── IndiaProgressSnapshot.tsx # National progress towards 500 GW non-fossil 2030 target
│   ├── SimpleEnergyExplainer.tsx # Citizen guide on generation, grid, and net metering
│   ├── ErrorBoundary.tsx     # Component-level fault isolation boundary
│   └── DataFreshnessBadge.tsx# Mandatory data provenance and freshness badge
├── lib/                      # Core utilities and data layer
│   ├── i18n/                 # 8 Indian languages dictionary and language context
│   ├── supabase.ts           # Supabase client with offline fallback detection
│   ├── utils.ts              # Currency, energy, and date formatters
│   ├── role-context.tsx      # Role state management React context
│   └── calculators/          # Financial and compliance calculation engines
├── config/                   # Configurable assumptions (never hardcoded)
│   ├── tariffs.json          # State slab tariffs and escalation rates
│   ├── subsidy.json          # PM Surya Ghar CFA and state top-up rules
│   ├── rpo_trajectory.json   # Statutory RCO targets (2024-25 to 2029-30)
│   └── emission_factors.json # CEA grid carbon emission factors & solar parameters
├── data/                     # Offline JSON snapshots (fail-safe statutory fallback)
├── scraper/                  # Python scraper scripts for CEA & NPP reports
├── supabase/                 # Database schema (schema.sql) and migrations
└── docs/                     # Data dictionary, user guides, assumptions, provenance logs
```

---

## 📜 Regulatory Sources & Attribution
All data in India Green Grid is sourced directly from public statutory authorities:
- **Central Electricity Authority (CEA)**: Monthly Executive Summaries & Installed Capacity Reports.
- **National Power Portal (NPP)**: Daily Generation Dispatches & Coal Stock Monitoring.
- **Grid Controller of India (POSOCO / Grid-India)**: Daily Regional Power Supply Positions.
- **Ministry of New and Renewable Energy (MNRE)**: PM Surya Ghar Guidelines & Benchmark Cost Norms.
- **Ministry of Power**: Gazette Notification on RCO Trajectory (Oct 20, 2023).
