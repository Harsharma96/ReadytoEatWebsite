import { NextResponse } from "next/server";
import { database as db } from "@/backend/db";

export async function GET() {
  try {
    const reviews = db.getReviews();
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 4.98;

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(avgRating * 100) / 100,
        fiveStarPercent: 96,
      },
    });
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      orderId, 
      customerName, 
      rating, 
      moodEmoji, 
      deliveryRating, 
      tasteRating, 
      favoriteDish, 
      tags, 
      comment 
    } = body;

    if (!customerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Name, rating (1-5), and feedback comments are required" },
        { status: 400 }
      );
    }

    const review = db.createReview({
      orderId: orderId || undefined,
      customerName: customerName.trim(),
      rating: Number(rating),
      moodEmoji: moodEmoji || "😋",
      deliveryRating: Number(deliveryRating || 5),
      tasteRating: Number(tasteRating || 5),
      favoriteDish: favoriteDish || "Chef Special",
      tags: Array.isArray(tags) ? tags : ["Super Delicious"],
      comment: comment.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your valuable feedback! Royal points credited to your account.",
      review,
    });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save feedback review" },
      { status: 500 }
    );
  }
}
