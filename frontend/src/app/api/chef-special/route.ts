import { NextRequest, NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const chefSpecial = db.getChefSpecial();
    return NextResponse.json({
      success: true,
      chefSpecial,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch chef special" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = db.updateChefSpecial(body);
    return NextResponse.json({
      success: true,
      chefSpecial: updated,
      message: "Royal Chef Special updated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update chef special" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE() {
  try {
    db.deleteChefSpecial();
    return NextResponse.json({
      success: true,
      message: "Chef Special spotlight removed from website!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete chef special" },
      { status: 500 }
    );
  }
}
