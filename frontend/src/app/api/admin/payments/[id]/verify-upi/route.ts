import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/admin/payments/[id]/verify-upi - Verify UPI transaction
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const utrNumber = body?.utrNumber;

    const result = database.verifyUpiPayment(id, utrNumber);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Verify UPI payment error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to verify UPI payment" },
      { status: 500 }
    );
  }
}
