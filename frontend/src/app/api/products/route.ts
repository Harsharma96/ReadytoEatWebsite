import { NextRequest, NextResponse } from "next/server";
import { productsController } from "@/backend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const diet = searchParams.get("diet") || undefined;
    const search = searchParams.get("search") || undefined;

    const products = productsController.getProducts({ category, diet, search });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
