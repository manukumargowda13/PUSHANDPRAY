-- ==============================================================================
-- India Green Grid - Database Seed Data (PostgreSQL / Supabase)
-- Platform: National Clean Energy Decision-Support Platform
-- ==============================================================================

-- 1. Insert Sources
INSERT INTO public.sources (id, code, name, full_name, agency, url, update_frequency, description)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'CEA', 'Central Electricity Authority', 'Central Electricity Authority, Ministry of Power', 'Ministry of Power, Govt. of India', 'https://cea.nic.in', 'Monthly', 'Statutory authority under Section 73 of the Electricity Act 2003 publishing installed capacity and sector reviews.'),
    ('11111111-1111-1111-1111-111111111102', 'NPP', 'National Power Portal', 'National Power Portal Daily Generation Reports', 'Ministry of Power, Govt. of India', 'https://npp.gov.in', 'Daily', 'Centralized system for daily generation, outage monitoring, and fuel stock tracking.'),
    ('11111111-1111-1111-1111-111111111103', 'GRID_INDIA', 'Grid Controller of India', 'Grid Controller of India Limited (formerly POSOCO)', 'Grid-India', 'https://grid-india.in', 'Daily', 'National load despatch center ensuring secure, reliable operation of the Indian national electricity grid.'),
    ('11111111-1111-1111-1111-111111111104', 'MNRE', 'MNRE', 'Ministry of New and Renewable Energy', 'Govt. of India', 'https://mnre.gov.in', 'Monthly', 'Nodal ministry for renewable energy policy, PM Surya Ghar CFA subsidies, and National Green Hydrogen Mission.'),
    ('11111111-1111-1111-1111-111111111105', 'CPCB', 'Central Pollution Control Board', 'Central Pollution Control Board', 'Ministry of Environment, Forest and Climate Change', 'https://cpcb.nic.in', 'Continuous', 'Statutory organization monitoring environmental quality, industrial emissions, and air quality index.'),
    ('11111111-1111-1111-1111-111111111106', 'BEE', 'Bureau of Energy Efficiency', 'Bureau of Energy Efficiency', 'Ministry of Power, Govt. of India', 'https://beeindia.gov.in', 'Annual', 'Statutory body administering Energy Conservation Act, RCO compliance mechanisms, and PAT scheme.')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert National Capacity Snapshot (CEA as of Oct 31, 2024)
INSERT INTO public.capacity (state, source, category, mw, share_pct, as_of, source_id)
VALUES
    ('All-India', 'Coal', 'Fossil', 217580.00, 48.06, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Solar', 'Renewable', 90760.00, 20.05, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Wind', 'Renewable', 47360.00, 10.46, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Hydro', 'Clean/Non-Fossil', 46928.00, 10.37, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Gas', 'Fossil', 25038.00, 5.53, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Bio Power & Others', 'Renewable', 16458.00, 3.64, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Nuclear', 'Clean/Non-Fossil', 8180.00, 1.81, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('All-India', 'Diesel', 'Fossil', 589.00, 0.13, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    -- State snapshots
    ('Rajasthan', 'Solar', 'Renewable', 23400.00, 55.52, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Rajasthan', 'Wind', 'Renewable', 5190.00, 12.31, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Rajasthan', 'Coal', 'Fossil', 9680.00, 22.97, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Gujarat', 'Solar', 'Renewable', 14200.00, 28.86, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Gujarat', 'Wind', 'Renewable', 11800.00, 23.98, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Gujarat', 'Coal', 'Fossil', 15800.00, 32.11, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Maharashtra', 'Coal', 'Fossil', 26400.00, 56.41, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Maharashtra', 'Solar', 'Renewable', 6200.00, 13.25, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Maharashtra', 'Wind', 'Renewable', 5200.00, 11.11, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Tamil Nadu', 'Wind', 'Renewable', 10500.00, 26.99, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Tamil Nadu', 'Solar', 'Renewable', 8400.00, 21.59, '2024-10-31', '11111111-1111-1111-1111-111111111101'),
    ('Tamil Nadu', 'Coal', 'Fossil', 13200.00, 33.93, '2024-10-31', '11111111-1111-1111-1111-111111111101');

-- 3. Insert Daily Generation Sample (NPP Daily snapshot)
INSERT INTO public.generation (date, source, category, gwh, share_pct, source_id)
VALUES
    ('2024-11-10', 'Coal', 'Fossil', 3315.20, 70.83, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Hydro', 'Clean/Non-Fossil', 395.00, 8.44, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Solar', 'Renewable', 365.40, 7.81, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Wind', 'Renewable', 235.80, 5.04, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Gas', 'Fossil', 180.50, 3.86, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Nuclear', 'Clean/Non-Fossil', 134.40, 2.87, '11111111-1111-1111-1111-111111111102'),
    ('2024-11-10', 'Other RE', 'Renewable', 54.20, 1.16, '11111111-1111-1111-1111-111111111102')
ON CONFLICT (date, source) DO NOTHING;

-- 4. Insert RPO/RCO Trajectory Targets
INSERT INTO public.rpo_targets (year, total_pct, wind_pct, hydro_pct, other_re_pct, solar_pct, statutory_framework, notified_date)
VALUES
    ('2024-25', 29.91, 0.67, 0.38, 28.86, 21.00, 'Renewable Consumption Obligation (RCO)', '2023-10-20'),
    ('2025-26', 33.01, 1.45, 1.49, 30.07, 22.50, 'Renewable Consumption Obligation (RCO)', '2023-10-20'),
    ('2026-27', 35.95, 2.22, 2.60, 31.13, 24.00, 'Renewable Consumption Obligation (RCO)', '2023-10-20'),
    ('2027-28', 38.81, 3.00, 3.71, 32.10, 25.50, 'Renewable Consumption Obligation (RCO)', '2023-10-20'),
    ('2028-29', 41.36, 3.78, 4.82, 32.76, 26.50, 'Renewable Consumption Obligation (RCO)', '2023-10-20'),
    ('2029-30', 43.33, 4.55, 5.93, 32.85, 27.50, 'Renewable Consumption Obligation (RCO)', '2023-10-20')
ON CONFLICT (year) DO NOTHING;

-- 5. Insert Subsidies (PM Surya Ghar + State Top-ups)
INSERT INTO public.subsidies (scheme, state, kw_min, kw_max, amount, max_amount, subsidy_type, notes)
VALUES
    ('PM Surya Ghar: Muft Bijli Yojana', 'All-India', 0.00, 1.00, 30000.00, 30000.00, 'central_cfa', '₹30,000 per kW for 1st kW capacity'),
    ('PM Surya Ghar: Muft Bijli Yojana', 'All-India', 1.00, 2.00, 30000.00, 60000.00, 'central_cfa', '₹30,000 per kW up to 2 kW capacity (Total ₹60,000)'),
    ('PM Surya Ghar: Muft Bijli Yojana', 'All-India', 2.00, 3.00, 18000.00, 78000.00, 'central_cfa', '₹18,000 for additional 3rd kW (Total ₹78,000)'),
    ('PM Surya Ghar: Muft Bijli Yojana', 'All-India', 3.00, 100.00, 0.00, 78000.00, 'central_cfa', 'Capped at ₹78,000 for systems exceeding 3 kW in residential sector'),
    ('Delhi Solar Policy 2024 Top-up', 'Delhi', 0.00, 5.00, 2000.00, 10000.00, 'state_topup', 'GNCTD state capital top-up up to ₹10,000 per installation'),
    ('UP NEDA Solar Rooftop State Subsidy', 'Uttar Pradesh', 0.00, 2.00, 15000.00, 30000.00, 'state_topup', 'State top-up subsidy provided through UPNEDA portal (up to ₹30,000)'),
    ('Surya Gujarat Scheme Top-up', 'Gujarat', 0.00, 3.00, 0.00, 0.00, 'state_topup', 'Aligned with PM Surya Ghar national portal');

-- 6. Insert Green Finance Schemes
INSERT INTO public.green_finance_schemes (institution, scheme_name, category, target_borrower, interest_rate_pct, max_tenure_years, eligible_technologies, apply_url, description)
VALUES
    ('IREDA', 'Access to Clean Energy Financing', 'Utility RE Capex', 'RE Developer', 8.25, 15, ARRAY['Solar PV', 'Wind', 'Hybrid RE', 'BESS'], 'https://ireda.in', 'Concessional debt for grid-connected utility solar, wind farms, and battery storage projects.'),
    ('SIDBI', '4E (End to End Energy Efficiency)', 'Rooftop Solar MSME', 'MSME', 7.50, 7, ARRAY['Rooftop Solar', 'Energy Efficient Boilers', 'VFDs'], 'https://sidbi.in', 'Low-interest loans up to ₹3 Crore for MSMEs implementing captive solar and energy efficiency upgrades.'),
    ('NABARD', 'Agro-Solar Microgrid Credit Line', 'Agro-Solar (KUSUM)', 'Farmer', 6.80, 10, ARRAY['Solar Irrigation Pumps', 'Agro-Photovoltaics', 'Microgrids'], 'https://nabard.org', 'Subsidized priority-sector agriculture finance for PM-KUSUM solar water pumps and agro-PV installations.'),
    ('PFC', 'DISCOM Smart Grid & RE Evacuation Loan', 'Grid Infrastructure', 'DISCOM', 8.50, 20, ARRAY['Substation Modernization', 'HVDC Transmission', 'Smart Meters'], 'https://pfcindia.com', 'Long-term infrastructure loans to state power distribution utilities for renewable evacuation and grid resilience.');

-- 7. Insert First Batch of Sample Jobs (Full list also imported dynamically)
INSERT INTO public.jobs (id, title, category, company, location, type, experience, salary_range, description, skills, apply_url, is_sample)
VALUES
    ('job-001', 'Senior Solar PV Site Engineer', 'Solar Installation', 'Tata Power Solar Systems', 'Ahmedabad, Gujarat', 'Full-Time', '3-5 years', '₹6,00,000 - ₹9,50,000', 'Supervise 50MW ground-mounted solar PV installation, inverter commissioning, and grid synchronization.', ARRAY['AutoCAD', 'PVSyst', 'HT Substations', 'Quality Compliance'], 'https://careers.tatapower.com', true),
    ('job-008', 'Wind Turbine Lead Service Technician', 'Wind Maintenance', 'Suzlon Energy Ltd', 'Jaisalmer, Rajasthan', 'Full-Time', '3-5 years', '₹5,00,000 - ₹7,50,000', 'Perform scheduled gearbox overhauls, yaw drive servicing, and pitch cylinder calibrations on S120 turbines.', ARRAY['GWO Certified', 'Hydraulics', 'Gearbox Inspection', 'Work at Height'], 'https://suzlon.com/careers', true),
    ('job-014', 'Battery Management System (BMS) Firmware Engineer', 'Battery Design', 'Ola Electric', 'Bengaluru, Karnataka', 'Full-Time', '3-6 years', '₹12,00,000 - ₹18,00,000', 'Architect State of Charge (SoC), State of Health (SoH) algorithms, and thermal runaway protection on CAN bus.', ARRAY['Embedded C', 'MATLAB Simulink', 'CANalyzer', 'ISO 26262'], 'https://careers.olaelectric.com', true),
    ('job-020', 'Agro-Photovoltaics (Agri-PV) Project Manager', 'Organic Farming', 'Harsha Abakus Solar', 'Nashik, Maharashtra', 'Full-Time', '3-6 years', '₹6,50,000 - ₹9,50,000', 'Deploy dual-land use solar arrays optimized for shade-tolerant horticultural crops and micro-irrigation systems.', ARRAY['Agro-PV System Design', 'Micro-Irrigation', 'Crop Shading Indices'], 'https://harshasolar.com', true),
    ('job-026', 'Corporate ESG Reporting & BRSR Manager', 'Sustainability', 'Ernst & Young (EY) Climate Change and Sustainability', 'Gurugram / Mumbai', 'Full-Time', '4-8 years', '₹14,00,000 - ₹22,00,000', 'Advise NSE top 1000 listed entities on SEBI Business Responsibility and Sustainability Reporting (BRSR) core metrics.', ARRAY['SEBI BRSR', 'GRI Standards', 'Scope 1/2/3 GHG Protocol', 'TCFD'], 'https://ey.com/en_in/careers', true)
ON CONFLICT (id) DO NOTHING;
