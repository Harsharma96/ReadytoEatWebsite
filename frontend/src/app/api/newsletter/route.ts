import { NextRequest, NextResponse } from "next/server";
import { subscribersController } from "@/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email is required." },
        { status: 400 }
      );
    }

    const result = subscribersController.subscribe(email);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST newsletter error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
