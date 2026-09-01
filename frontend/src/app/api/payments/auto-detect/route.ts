import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/payments/auto-detect - Instant UPI payment auto detection node
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = database.autoDetectPayment(body || {});
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Auto detect payment error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to auto-detect payment" },
      { status: 500 }
    );
  }
}
