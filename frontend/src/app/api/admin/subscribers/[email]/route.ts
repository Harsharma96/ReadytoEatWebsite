import { NextRequest, NextResponse } from "next/server";
import { subscribersController } from "@/backend";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    const success = subscribersController.deleteSubscriber(email);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Subscriber ${email} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscriber ${email} unsubscribed and removed.`,
    });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
