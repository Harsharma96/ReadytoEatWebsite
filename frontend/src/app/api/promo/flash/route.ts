import { NextResponse } from "next/server";
import { promosController } from "@/backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const flashPromo = promosController.getFlashPromo();
    return NextResponse.json({
      success: true,
      hasActiveOffer: !!flashPromo,
      promo: flashPromo,
    });
  } catch (error: any) {
    console.error("Public get flash promo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch flash promo" },
      { status: 500 }
    );
  }
}
