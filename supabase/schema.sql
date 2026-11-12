-- ==============================================================================
-- India Green Grid - Database Schema (PostgreSQL / Supabase)
-- Hackathon: CodeSpark 2026 (12-Hour Sprint)
-- Framework: Next.js 15 App Router + Supabase + Fallback JSON snapshots
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: sources
-- Metadata repository for statutory public energy data origins
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'CEA', 'NPP', 'GRID_INDIA', 'MNRE', 'CPCB'
    name VARCHAR(150) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    agency VARCHAR(255) NOT NULL,
    url TEXT,
    update_frequency VARCHAR(50) NOT NULL, -- 'Daily', 'Monthly', 'Annual', 'Static'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Table: capacity
-- Installed power generation capacity (All-India and State level snapshots)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(100) NOT NULL DEFAULT 'All-India',
    source VARCHAR(100) NOT NULL, -- 'Coal', 'Gas', 'Nuclear', 'Hydro', 'Solar', 'Wind', 'Bio Power & Others', 'Diesel'
    category VARCHAR(50) NOT NULL, -- 'Fossil', 'Renewable', 'Clean/Non-Fossil'
    mw NUMERIC(12, 2) NOT NULL CHECK (mw >= 0),
    share_pct NUMERIC(5, 2) CHECK (share_pct >= 0 AND share_pct <= 100),
    as_of DATE NOT NULL,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy aggregate dashboard queries
CREATE INDEX IF NOT EXISTS idx_capacity_state_as_of ON public.capacity(state, as_of);
CREATE INDEX IF NOT EXISTS idx_capacity_source ON public.capacity(source);

-- ------------------------------------------------------------------------------
-- 3. Table: generation
-- Daily operational electricity generation by fuel type in GWh
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'Coal', 'Gas', 'Nuclear', 'Hydro', 'Solar', 'Wind', 'Other RE'
    category VARCHAR(50) NOT NULL, -- 'Fossil', 'Renewable', 'Clean/Non-Fossil'
    gwh NUMERIC(10, 2) NOT NULL CHECK (gwh >= 0),
    share_pct NUMERIC(5, 2) CHECK (share_pct >= 0 AND share_pct <= 100),
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint ensuring one entry per date per source
CREATE UNIQUE INDEX IF NOT EXISTS idx_generation_date_source ON public.generation(date, source);
CREATE INDEX IF NOT EXISTS idx_generation_date ON public.generation(date DESC);

-- ------------------------------------------------------------------------------
-- 4. Table: rpo_targets
-- Statutory Renewable Purchase Obligation / Renewable Consumption Obligation trajectory
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rpo_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(10) UNIQUE NOT NULL, -- e.g. '2024-25', '2025-26', '2029-30'
    total_pct NUMERIC(5, 2) NOT NULL CHECK (total_pct >= 0 AND total_pct <= 100),
    solar_pct NUMERIC(5, 2) CHECK (solar_pct >= 0 AND solar_pct <= 100),
    non_solar_pct NUMERIC(5, 2) CHECK (non_solar_pct >= 0 AND non_solar_pct <= 100),
    wind_pct NUMERIC(5, 2) CHECK (wind_pct >= 0 AND wind_pct <= 100),
    hydro_pct NUMERIC(5, 2) CHECK (hydro_pct >= 0 AND hydro_pct <= 100),
    other_re_pct NUMERIC(5, 2) CHECK (other_re_pct >= 0 AND other_re_pct <= 100),
    statutory_framework VARCHAR(100) DEFAULT 'Renewable Consumption Obligation (RCO)',
    notified_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Table: subsidies
-- Central (PM Surya Ghar) and State rooftop solar financial assistance slabs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subsidies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme VARCHAR(150) NOT NULL, -- e.g. 'PM Surya Ghar: Muft Bijli Yojana', 'UP NEDA Solar Rooftop'
    state VARCHAR(100) NOT NULL DEFAULT 'All-India',
    kw_min NUMERIC(5, 2) NOT NULL DEFAULT 0,
    kw_max NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0), -- CFA or top-up rate per kW
    max_amount NUMERIC(10, 2) NOT NULL CHECK (max_amount >= 0), -- Cap in INR
    subsidy_type VARCHAR(50) NOT NULL DEFAULT 'central_cfa', -- 'central_cfa', 'state_topup', 'generation_incentive'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subsidies_state ON public.subsidies(state);

-- ------------------------------------------------------------------------------
-- 6. Table: jobs
-- Clean energy and sustainability sector job postings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'job-001' or UUID
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Solar Installation', 'Wind Maintenance', 'Battery Design', 'Organic Farming', 'Sustainability'
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Full-Time', -- 'Full-Time', 'Contract', 'Internship'
    experience VARCHAR(100),
    salary_range VARCHAR(100),
    description TEXT,
    skills TEXT[],
    apply_url TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT TRUE,
    posted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);

-- ------------------------------------------------------------------------------
-- 7. Table: green_finance_schemes
-- Concessional green loans and institutional financial programs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.green_finance_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution VARCHAR(150) NOT NULL, -- 'IREDA', 'PFC', 'REC', 'SIDBI', 'NABARD'
    scheme_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Rooftop Solar MSME', 'Utility RE Capex', 'Agro-Solar (KUSUM)', 'EV Fleet'
    target_borrower VARCHAR(100) NOT NULL, -- 'MSME', 'Commercial Entity', 'Farmer', 'RE Developer'
    interest_rate_pct NUMERIC(4, 2),
    max_tenure_years INT,
    eligible_technologies TEXT[],
    apply_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Public read access enabled for demo; writes restricted
-- ==============================================================================
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rpo_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsidies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_finance_schemes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read on all tables
CREATE POLICY "Allow public read on sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Allow public read on capacity" ON public.capacity FOR SELECT USING (true);
CREATE POLICY "Allow public read on generation" ON public.generation FOR SELECT USING (true);
CREATE POLICY "Allow public read on rpo_targets" ON public.rpo_targets FOR SELECT USING (true);
CREATE POLICY "Allow public read on subsidies" ON public.subsidies FOR SELECT USING (true);
CREATE POLICY "Allow public read on jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read on green_finance_schemes" ON public.green_finance_schemes FOR SELECT USING (true);

-- Allow service role full management
CREATE POLICY "Allow service_role full management on sources" ON public.sources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on capacity" ON public.capacity FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on generation" ON public.generation FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on rpo_targets" ON public.rpo_targets FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on subsidies" ON public.subsidies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on jobs" ON public.jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service_role full management on green_finance_schemes" ON public.green_finance_schemes FOR ALL USING (auth.role() = 'service_role');
