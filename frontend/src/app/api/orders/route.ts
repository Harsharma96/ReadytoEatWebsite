import { NextRequest, NextResponse } from "next/server";
import { ordersController, promosController, productsController } from "@/backend";
import { database } from "@/backend/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const orders = ordersController.getAllOrders();
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
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
      deliveryInstructions,
      paymentMethod,
      paymentStatus,
      transactionRef,
      utrNumber,
      upiAppUsed,
      qrCodeScanned,
      items,
      promoCode,
      appliedPromoCode,
      subtotal: rawSubtotal,
      discount: rawDiscount,
      deliveryFee: rawDeliveryFee,
      tax: rawTax,
      total: rawTotal,
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Customer details and at least one food item are required." },
        { status: 400 }
      );
    }

    const settings = database.getSettings();

    // Validate items
    const allProducts = productsController.getProducts();
    let calculatedSubtotal = 0;
    const validatedItems = items.map((item: any) => {
      const dbProduct = allProducts.find((p) => p.id?.toString() === item.productId?.toString());
      const price = typeof item.price === "number" && item.price > 0 
        ? item.price 
        : (dbProduct ? dbProduct.price : 0);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += price * quantity;
      return {
        productId: String(item.productId || `item-${Date.now()}`),
        name: String(item.name || dbProduct?.name || "Delicious Dish"),
        price,
        quantity,
        image: item.image || (dbProduct && dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : ""),
      };
    });

    const activePromo = promoCode || appliedPromoCode;
    let discount = typeof rawDiscount === "number" ? rawDiscount : 0;
    if (activePromo && discount === 0) {
      const promoResult = promosController.validatePromo(activePromo, calculatedSubtotal);
      if (promoResult.valid) {
        discount = promoResult.discount;
      }
    }

    const subtotal = typeof rawSubtotal === "number" && rawSubtotal > 0 ? rawSubtotal : calculatedSubtotal;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    
    const deliveryFee = typeof rawDeliveryFee === "number"
      ? rawDeliveryFee
      : (settings.isFreeDeliveryEnabled && discountedSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee);
    
    const taxRate = settings.isGstEnabled ? (settings.gstPercent / 100) : 0.05;
    const tax = typeof rawTax === "number" ? rawTax : Math.round(discountedSubtotal * taxRate * 100) / 100;
    const total = typeof rawTotal === "number" && rawTotal > 0 ? rawTotal : Math.round((discountedSubtotal + deliveryFee + tax) * 100) / 100;

    const newOrder = ordersController.createOrder({
      customerName: String(customerName).trim(),
      email: (email || "").trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      aptSuite: aptSuite ? String(aptSuite).trim() : undefined,
      notes: (notes || deliveryInstructions) ? String(notes || deliveryInstructions).trim() : undefined,
      paymentMethod: paymentMethod || "card",
      paymentStatus: paymentStatus,
      transactionRef: transactionRef ? String(transactionRef).trim() : undefined,
      utrNumber: utrNumber ? String(utrNumber).trim() : undefined,
      upiAppUsed: upiAppUsed ? String(upiAppUsed).trim() : undefined,
      qrCodeScanned: qrCodeScanned !== undefined ? Boolean(qrCodeScanned) : undefined,
      items: validatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      promoCode: activePromo ? String(activePromo).toUpperCase() : undefined,
      deliveryFee,
      tax,
      total,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully! 🍽️",
        orderId: newOrder.id,
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST order error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
