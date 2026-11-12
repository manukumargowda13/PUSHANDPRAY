import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "India Green Grid",
    version: "1.0.0",
    platform: "National Clean Energy Decision-Support Platform",
    timestamp: new Date().toISOString(),
    supabase_configured: isSupabaseConfigured(),
    offline_fallback_ready: true,
    data_sources: ["CEA", "NPP", "Grid-India", "MNRE"],
  });
}
