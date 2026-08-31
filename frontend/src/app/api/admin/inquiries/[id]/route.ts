import { NextRequest, NextResponse } from "next/server";
import { inquiriesController } from "@/backend";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = inquiriesController.deleteContact(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Inquiry #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry #${id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
