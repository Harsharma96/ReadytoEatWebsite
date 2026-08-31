import { NextRequest, NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isArchive = searchParams.get("archive") === "true";
    const days = Number(searchParams.get("days")) || 7;

    const transactions = isArchive ? db.getArchiveReceipts(days) : db.getTransactions();
    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    const deleted = db.deleteTransaction(orderId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Transaction / Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transaction for order #${orderId} deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
