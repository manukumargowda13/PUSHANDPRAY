import { NextRequest, NextResponse } from "next/server";
import { calculateSolarRoi, SolarCalculatorParams } from "@/lib/calculators/solar";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const state = body.state || "Maharashtra";
    const monthlyBillOrUnits = body.monthlyBillOrUnits === "bill" ? "bill" : "units";
    const value = Number(body.value) || 300;
    const roofAreaSqFt = Number(body.roofAreaSqFt) || 400;

    const params: SolarCalculatorParams = {
      state,
      monthlyBillOrUnits,
      value,
      roofAreaSqFt,
      tariffInflationPct: body.tariffInflationPct ? Number(body.tariffInflationPct) : undefined,
      panelDegradationPct: body.panelDegradationPct ? Number(body.panelDegradationPct) : undefined,
    };

    const result = calculateSolarRoi(params);

    return NextResponse.json({
      status: "success",
      source: "MNRE PM Surya Ghar & SERC Tariffs",
      last_updated: "2024-11-01",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to calculate solar ROI" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const state = searchParams.get("state") || "Maharashtra";
  const monthlyBillOrUnits = searchParams.get("type") === "bill" ? "bill" : "units";
  const value = Number(searchParams.get("value")) || 300;
  const roofAreaSqFt = Number(searchParams.get("roofArea")) || 400;

  try {
    const result = calculateSolarRoi({
      state,
      monthlyBillOrUnits,
      value,
      roofAreaSqFt,
    });

    return NextResponse.json({
      status: "success",
      source: "MNRE PM Surya Ghar & SERC Tariffs",
      last_updated: "2024-11-01",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to calculate solar ROI" },
      { status: 400 }
    );
  }
}
