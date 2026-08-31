import { NextRequest, NextResponse } from "next/server";
import { promosController } from "@/backend";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const body = await req.json();

    const updated = promosController.updatePromo(code, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Promo code ${code} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Promo code ${updated.code} updated.`,
      promo: updated,
    });
  } catch (error) {
    console.error("Update promo error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const success = promosController.deletePromo(code);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Promo code ${code} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Promo code ${code.toUpperCase()} deleted.`,
    });
  } catch (error) {
    console.error("Delete promo error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
