"""
India Green Grid - Master Scraper Runner
Orchestrates CEA Capacity and NPP Daily Generation scrapers.
Saves validated snapshots to /data and optionally syncs to Supabase.
"""

import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path

# Load sibling scrapers
from cea_capacity_scraper import fetch_cea_installed_capacity
from npp_generation_scraper import fetch_npp_daily_generation

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("ScraperPipeline")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

def load_json_file(file_path):
    """Safely loads a JSON file if it exists."""
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Could not read existing file {file_path}: {e}")
    return None

def save_json_file(file_path, data):
    """Atomically writes formatted JSON with indentation."""
    temp_path = file_path.with_suffix(".tmp")
    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        temp_path.replace(file_path)
        logger.info(f"Successfully updated snapshot: {file_path.name}")
        return True
    except Exception as e:
        logger.error(f"Failed to write snapshot {file_path}: {e}")
        if temp_path.exists():
            temp_path.unlink()
        return False

def sync_to_supabase(capacity_data, generation_data):
    """Optionally upserts scraped records into Supabase PostgreSQL."""
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key or "your-project" in supabase_url:
        logger.info("Supabase not configured or in offline mode. Skipping live database upsert.")
        return

    try:
        from supabase import create_client
        logger.info(f"Connecting to Supabase at {supabase_url}...")
        client = create_client(supabase_url, supabase_key)

        # 1. Upsert Capacity
        if capacity_data and "national_summary" in capacity_data:
            cap_records = []
            as_of = capacity_data.get("as_of", datetime.now().strftime("%Y-%m-%d"))
            for item in capacity_data["national_summary"].get("by_source", []):
                cap_records.append({
                    "state": "All-India",
                    "source": item["source"],
                    "category": item["category"],
                    "mw": item["mw"],
                    "share_pct": item["share_pct"],
                    "as_of": as_of
                })
            res = client.table("capacity").upsert(cap_records).execute()
            logger.info("Supabase capacity table updated successfully.")

        # 2. Upsert Generation
        if generation_data and "daily_snapshot" in generation_data:
            gen_records = []
            date = generation_data["daily_snapshot"].get("date", datetime.now().strftime("%Y-%m-%d"))
            for item in generation_data["daily_snapshot"].get("by_source", []):
                category = "Fossil" if item["source"] in ["Coal", "Gas", "Diesel"] else "Renewable"
                if item["source"] in ["Hydro", "Nuclear"]:
                    category = "Clean/Non-Fossil"
                gen_records.append({
                    "date": date,
                    "source": item["source"],
                    "category": category,
                    "gwh": item["gwh"],
                    "share_pct": item["share_pct"]
                })
            res = client.table("generation").upsert(gen_records, on_conflict="date,source").execute()
            logger.info("Supabase generation table updated successfully.")

    except Exception as e:
        logger.warning(f"Supabase upsert encountered an error: {e}. Preserved JSON snapshots safely.")

def run_pipeline():
    """Main pipeline execution function."""
    logger.info("=======================================================")
    logger.info(" India Green Grid - Scheduled Scraper Pipeline Initiated")
    logger.info("=======================================================")

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    capacity_file = DATA_DIR / "capacity.json"
    generation_file = DATA_DIR / "generation.json"

    # Step 1: Ingest Capacity
    existing_cap = load_json_file(capacity_file)
    try:
        updated_cap = fetch_cea_installed_capacity(existing_snapshot=existing_cap)
        if updated_cap and "national_summary" in updated_cap:
            save_json_file(capacity_file, updated_cap)
    except Exception as e:
        logger.error(f"Error during CEA capacity scraper: {e}", exc_info=True)
        updated_cap = existing_cap

    # Step 2: Ingest Generation
    existing_gen = load_json_file(generation_file)
    try:
        updated_gen = fetch_npp_daily_generation(existing_snapshot=existing_gen)
        if updated_gen and "daily_snapshot" in updated_gen:
            save_json_file(generation_file, updated_gen)
    except Exception as e:
        logger.error(f"Error during NPP generation scraper: {e}", exc_info=True)
        updated_gen = existing_gen

    # Step 3: Sync to Supabase if configured
    sync_to_supabase(updated_cap, updated_gen)

    logger.info("Pipeline execution completed successfully with zero unhandled errors.")
    return 0

if __name__ == "__main__":
    sys.exit(run_pipeline())
