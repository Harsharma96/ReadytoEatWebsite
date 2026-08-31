import { NextRequest, NextResponse } from "next/server";
import { inquiriesController } from "@/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, Email, and Message are required." },
        { status: 400 }
      );
    }

    const newInquiry = inquiriesController.createContact({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      eventType: eventType || "VIP Private Dining",
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your concierge message has been received! Our Master Chef will reach out within 2 hours.",
        inquiryId: newInquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST contact error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
