import { NextRequest, NextResponse } from "next/server";
import { promosController } from "@/backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const promos = promosController.getPromos();
    const flashPromo = promosController.getFlashPromo();
    return NextResponse.json({
      success: true,
      promos,
      flashPromo,
    });
  } catch (error: any) {
    console.error("Admin fetch promos error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch promos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, title, discountPercent, fixedDiscount, minSpend, description, isFlashBanner, freeItem, badgeText, hoursLeft } = body;

    if (!code || (!discountPercent && !fixedDiscount)) {
      return NextResponse.json(
        { success: false, message: "Promo Code and Discount value are required." },
        { status: 400 }
      );
    }

    const saved = promosController.addPromo({
      code: code.trim().toUpperCase(),
      title: title || `Unlock ${discountPercent ? `${discountPercent}% Off` : `₹${fixedDiscount} Off`} on Royal Feast`,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      fixedDiscount: fixedDiscount ? Number(fixedDiscount) : undefined,
      minSpend: Number(minSpend) || 0,
      description: description || `${code.toUpperCase()} special voucher`,
      isActive: true,
      isFlashBanner: !!isFlashBanner,
      freeItem: freeItem || "2 Free 24K Gold Gulab Jamuns",
      badgeText: badgeText || "👑 LIMITED SHAHI RASOI OFFER",
      hoursLeft: hoursLeft ? Number(hoursLeft) : 3,
    });

    return NextResponse.json(
      { success: true, message: `Promo voucher ${saved.code} created!`, promo: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin add promo error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
