import { NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = db.deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/feedback/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
