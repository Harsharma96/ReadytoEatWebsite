import { NextRequest, NextResponse } from "next/server";
import { ordersController, promosController, productsController } from "@/backend";

export async function GET() {
  try {
    const orders = ordersController.getAllOrders();
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      aptSuite,
      notes,
      paymentMethod,
      items,
      promoCode,
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Customer details and at least one food item are required." },
        { status: 400 }
      );
    }

    // Validate prices against catalog
    const allProducts = productsController.getProducts();
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const dbProduct = allProducts.find((p) => p.id === item.productId);
      const price = dbProduct ? dbProduct.price : item.price || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      subtotal += price * quantity;
      return {
        productId: item.productId,
        name: dbProduct ? dbProduct.name : item.name,
        price,
        quantity,
        image: dbProduct && dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : item.image || "",
      };
    });

    let discount = 0;
    if (promoCode) {
      const promoResult = promosController.validatePromo(promoCode, subtotal);
      if (promoResult.valid) {
        discount = promoResult.discount;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const deliveryFee = discountedSubtotal >= 50 || discountedSubtotal === 0 ? 0 : 4.99;
    const tax = Math.round(discountedSubtotal * 0.0825 * 100) / 100;
    const total = Math.round((discountedSubtotal + deliveryFee + tax) * 100) / 100;

    const newOrder = ordersController.createOrder({
      customerName: customerName.trim(),
      email: (email || "").trim(),
      phone: phone.trim(),
      address: address.trim(),
      aptSuite: aptSuite ? aptSuite.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      paymentMethod: paymentMethod || "card",
      items: validatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      promoCode: discount > 0 ? promoCode.toUpperCase() : undefined,
      deliveryFee,
      tax,
      total,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        orderId: newOrder.id,
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
