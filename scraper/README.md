# India Green Grid - Energy Data Scraper Pipeline

Scheduled ingestion engine for statutory public energy statistics from the Central Electricity Authority (CEA) and National Power Portal (NPP).

---

## 🚀 Running Locally

### 1. Prerequisites
- Python 3.10+ (or use Node companion `npm run scrape`)
- `pip`

### 2. Environment Setup
```bash
# Navigate to the scraper directory
cd scraper

# Create and activate virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

### 3. Execution
```bash
# Run master pipeline from project root
python scraper/main.py
```

Or run individual scrapers:
```bash
python scraper/cea_capacity_scraper.py
python scraper/npp_generation_scraper.py
```

*Node.js Fallback runner:*
```bash
npm run scrape
```

---

## 🛡 Fault Tolerance & Crash-Proof Design
1. **Never Crashes**: All HTTP requests use exponential backoff retries and are enclosed in structured try-except blocks.
2. **Snapshot Preservation**: If remote portals return 5xx errors, are blocked by CAPTCHA, or change HTML structure, the pipeline logs a warning and **preserves the last validated snapshot** in `/data`.
3. **Atomic Writes**: Data is written to `.tmp` files first and atomically replaced, preventing partial or corrupted writes.
4. **Offline-First**: Can run fully decoupled from Supabase without failing.

---

## 📥 Exact Manual Download URLs (If Automated Access is Blocked)

If government portals are undergoing maintenance, gated by CAPTCHAs, or require manual downloads:

### 1. Central Electricity Authority (CEA) - Installed Capacity
- **Exact URL**: [https://cea.nic.in/installed-capacity-report/?lang=en](https://cea.nic.in/installed-capacity-report/?lang=en)
- **Alternate URL**: [https://cea.nic.in/executive-summary-report/?lang=en](https://cea.nic.in/executive-summary-report/?lang=en)
- **File to Fetch**: Look for the latest month titled *"All India Installed Capacity of Power Stations"* (PDF or Excel).
- **Target Fields**: Table titled *"Fuel-wise Installed Capacity"* (Coal, Gas, Nuclear, Hydro, Solar, Wind).
- **Output Destination**: Review and merge figures into [`data/capacity.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/data/capacity.json).

### 2. National Power Portal (NPP) - Daily Generation
- **Exact URL**: [https://npp.gov.in/dailyReports](https://npp.gov.in/dailyReports)
- **Alternate URL**: [https://grid-india.in/reports/daily-reports/](https://grid-india.in/reports/daily-reports/)
- **File to Fetch**: Select latest date -> Download *"Daily Generation Report (Fuel Wise Summary)"* (PDF/Excel).
- **Target Fields**: Actual Generation (GWh) for Thermal Coal, Hydro, Solar, Wind, Gas, Nuclear.
- **Output Destination**: Review and merge figures into [`data/generation.json`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/data/generation.json).

---

## ⚙️ Automated GitHub Actions Workflow
The pipeline runs automatically every day at **18:00 UTC (11:30 PM IST)** via [`.github/workflows/scraper_cron.yml`](file:///C:/Users/itops/.gemini/antigravity/scratch/india-green-grid/.github/workflows/scraper_cron.yml).  
It commits fresh snapshots to `/data` and syncs to Supabase when repository secrets (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are present.
