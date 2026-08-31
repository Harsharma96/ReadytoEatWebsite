import { NextRequest, NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forAdmin = searchParams.get("admin") === "true";

    const categories = forAdmin
      ? db.getAllCategoriesForAdmin()
      : db.getCategories();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, emoji, subtitle, bgGradient, borderColor, accent, priority } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = db.addCategory({
      name: name.trim(),
      emoji: emoji?.trim() || "🍽️",
      subtitle: subtitle?.trim() || "Chef Specialty",
      bgGradient: bgGradient || "from-[#FFF0E5] to-[#FFE4D6]",
      borderColor: borderColor || "border-[#FF6B35]/40",
      accent: accent || "#FF6B35",
      priority: priority ? Number(priority) : 1,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category added successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const updated = db.updateCategory(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: updated,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const deleted = db.deleteCategory(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
