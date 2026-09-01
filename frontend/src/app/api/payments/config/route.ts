import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/payments/config - Returns public payment configuration (UPI ID, active gateways, etc.)
export async function GET() {
  try {
    const config = database.getPublicPaymentConfig();
    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error: any) {
    console.error("GET payment config error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch payment config" },
      { status: 500 }
    );
  }
}
