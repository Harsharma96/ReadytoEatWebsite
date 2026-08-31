import { NextRequest, NextResponse } from "next/server";
import { productsController } from "@/backend";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, calories, rating, shortDescription, fullDescription, images, dietary } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Name, Price, and Category are required." },
        { status: 400 }
      );
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const newProduct: Product = {
      id,
      slug: id,
      name: name.trim(),
      category: (category as any) || "Gourmet Burgers",
      accentColor: "#FF6B35",
      gradientBg: "from-[#FFF0E5] to-[#FFE4D6]",
      badge: "Chef Special",
      tagline: "Handcrafted Luxury",
      shortDescription: shortDescription || "Master chef handcrafted culinary dish.",
      fullDescription: fullDescription || shortDescription || "Handcrafted with pure avocado oil, farm-fresh regenerative harvests, and zero seed oils.",
      price: Number(price),
      currency: "USD",
      rating: Number(rating) || 4.9,
      reviewCount: 1,
      tags: ["Chef Special", "Artisanal", category],
      dietary: Array.isArray(dietary) ? dietary : ["Organic", "Chef Special"],
      nutrition: {
        calories: Number(calories) || 450,
        protein: "32g",
        carbs: "45g",
        sugar: "4g",
        fat: "18g",
        fiber: "6g",
      },
      ingredients: ["Organic produce", "100% Avocado oil", "Chef seasonings"],
      benefits: ["Clean Fuel", "Seed-oil Free", "Rich in Nutrients"],
      servingSuggestion: "Serve piping hot immediately upon arrival.",
      storage: "Keep warm or refrigerate up to 48 hours.",
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"],
      featured: true,
      isNew: true,
      inStock: true,
      netWeight: "420g",
    };

    const saved = productsController.addProduct(newProduct);

    return NextResponse.json(
      { success: true, message: "New dish added to menu!", product: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin add product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
