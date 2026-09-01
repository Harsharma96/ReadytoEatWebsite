import { NextRequest, NextResponse } from "next/server";
import { ordersController, OrderStatus } from "@/backend";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = ordersController.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: `Order #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, note, updates, action } = body;

    if (action === "APPROVE_COD_PAYMENT") {
      const res = ordersController.approveCodPayment(id);
      return NextResponse.json({
        success: res.success,
        message: res.message,
        order: res.order,
      });
    }

    if (updates) {
      const updated = ordersController.updateOrder(id, updates);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: `Order #${id} not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Order #${id} updated successfully.`,
        order: updated,
      });
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required." },
        { status: 400 }
      );
    }

    const updated = ordersController.updateOrderStatus(id, status as OrderStatus, note);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Order #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} status updated to ${status}.`,
      order: updated,
    });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return PATCH(req, context);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = ordersController.deleteOrder(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Order #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} deleted from database.`,
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
