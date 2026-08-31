import { NextRequest, NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tiers = db.getFeastBoxTiers();
    return NextResponse.json({
      success: true,
      count: tiers.length,
      tiers,
    });
  } catch (error) {
    console.error("GET /api/bundles error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch feast box tiers." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.count || body.discountPercent === undefined) {
      return NextResponse.json(
        { success: false, error: "Dish count and discount percentage are required." },
        { status: 400 }
      );
    }

    const newTier = db.addFeastBoxTier(body);
    return NextResponse.json(
      { success: true, message: "Feast Box Tier created successfully!", tier: newTier },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bundles error:", error);
    return NextResponse.json({ success: false, error: "Failed to create feast box tier." }, { status: 500 });
  }
}
