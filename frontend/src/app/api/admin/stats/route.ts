import { NextRequest, NextResponse } from "next/server";
import { statsController } from "@/backend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const telemetry = statsController.getSystemTelemetry();

    return NextResponse.json({
      success: true,
      ...telemetry,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
