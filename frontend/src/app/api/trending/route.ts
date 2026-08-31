import { NextRequest, NextResponse } from "next/server";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/trending - Get all active trending spotlights for website or all for admin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forAdmin = searchParams.get("admin") === "true";

    const items = forAdmin
      ? database.getAllTrendingSpotlightsForAdmin()
      : database.getTrendingSpotlights();

    return NextResponse.json({
      success: true,
      spotlights: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch trending spotlights" },
      { status: 500 }
    );
  }
}

// POST /api/trending - Add a dish to Trending Spotlight with custom offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customOfferTag, offerBadge, discountPercent, priority, isActive } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required" },
        { status: 400 }
      );
    }

    const created = database.addTrendingSpotlight({
      productId: String(productId),
      customOfferTag: customOfferTag || "🔥 TODAY'S POPULAR TRENDING DEAL",
      offerBadge: offerBadge || "CHEF PICK",
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      priority: priority ? Number(priority) : 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({
      success: true,
      message: "Dish added to Trending Spotlights successfully",
      spotlight: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add trending spotlight" },
      { status: 500 }
    );
  }
}

// PUT /api/trending - Update trending spotlight item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "id is required" },
        { status: 400 }
      );
    }

    const updated = database.updateTrendingSpotlight(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Trending spotlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Trending spotlight updated successfully",
      spotlight: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update trending spotlight" },
      { status: 500 }
    );
  }
}

// DELETE /api/trending?id=... - Delete from trending
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "id is required" },
        { status: 400 }
      );
    }

    const success = database.deleteTrendingSpotlight(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Trending spotlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dish removed from Trending Spotlights",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete trending spotlight" },
      { status: 500 }
    );
  }
}
