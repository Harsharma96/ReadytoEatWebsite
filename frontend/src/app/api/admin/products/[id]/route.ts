import { NextRequest, NextResponse } from "next/server";
import { productsController } from "@/backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = productsController.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Dish #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Dish "${updated.name}" updated successfully.`,
      product: updated,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = productsController.deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Dish #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Dish #${id} removed from menu.`,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
