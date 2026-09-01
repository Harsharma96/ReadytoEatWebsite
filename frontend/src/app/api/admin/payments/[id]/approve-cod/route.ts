import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/admin/payments/[id]/approve-cod - Approve COD payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = database.approveCodPayment(id);
    if (!result.success || !result.order) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Approve COD payment error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to approve COD payment" },
      { status: 500 }
    );
  }
}
