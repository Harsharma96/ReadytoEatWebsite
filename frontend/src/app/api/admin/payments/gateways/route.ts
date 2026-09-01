import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/payments/gateways - Retrieve gateway settings
export async function GET() {
  try {
    const settings = database.getGatewaySettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("GET payment gateway settings error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch gateway settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/payments/gateways - Update gateway settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = database.updateGatewaySettings(body || {});
    return NextResponse.json({
      success: true,
      message: "Payment gateway settings updated successfully.",
      settings,
    });
  } catch (error: any) {
    console.error("PUT payment gateway settings error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update gateway settings" },
      { status: 500 }
    );
  }
}

// POST /api/admin/payments/gateways - Also support POST
export async function POST(req: NextRequest) {
  return PUT(req);
}
