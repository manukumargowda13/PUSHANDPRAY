import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "India Green Grid",
    version: "0.1.0-mvp",
    hackathon: "CodeSpark 2026",
    timestamp: new Date().toISOString(),
    supabase_configured: isSupabaseConfigured(),
    offline_fallback_ready: true,
  });
}
