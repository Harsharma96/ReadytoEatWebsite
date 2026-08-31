import { NextRequest, NextResponse } from "next/server";
import { promosController } from "@/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json(
        { valid: false, discount: 0, message: "Code and Subtotal are required." },
        { status: 400 }
      );
    }

    const validation = promosController.validatePromo(code, subtotal);

    return NextResponse.json({
      success: true,
      ...validation,
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { success: false, valid: false, discount: 0, message: "Server error validating promo code" },
      { status: 500 }
    );
  }
}
