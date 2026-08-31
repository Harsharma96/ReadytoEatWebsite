import { NextRequest, NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const tier = db.getFeastBoxTierById(id);
    if (!tier) {
      return NextResponse.json({ success: false, error: "Feast Box Tier not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, tier });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tier." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await req.json();
    const updated = db.updateFeastBoxTier(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Feast Box Tier not found." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: `Feast Box Tier #${id} updated successfully!`,
      tier: updated,
    });
  } catch (error) {
    console.error("PATCH /api/bundles/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update feast box tier." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = db.deleteFeastBoxTier(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Feast Box Tier not found." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: `Feast Box Tier #${id} deleted successfully!`,
    });
  } catch (error) {
    console.error("DELETE /api/bundles/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete feast box tier." }, { status: 500 });
  }
}
