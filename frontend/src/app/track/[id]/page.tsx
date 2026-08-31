"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LiveOrderMap } from "@/components/LiveOrderMap";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Order, OrderStatus } from "@/lib/db";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Flame, 
  Bike, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft,
  Receipt,
  Star,
  MessageSquarePlus
} from "lucide-react";
import Link from "next/link";
import { downloadOrderReceipt } from "@/utils/generateReceipt";

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    key: "ORDER_RECEIVED",
    label: "Order Confirmed",
    desc: "Kitchen dispatch received ticket",
    icon: CheckCircle2,
  },
  {
    key: "CHEF_PREPARING",
    label: "Chef Preparing",
    desc: "Executive Chef searing & plating",
    icon: ChefHat,
  },
  {
    key: "WOOD_FIRED_BAKING",
    label: "Oven Baking",
    desc: "800°F stone oven crisping",
    icon: Flame,
  },
  {
    key: "COURIER_DISPATCHED",
    label: "Dispatched in Thermal Pod",
    desc: "Courier en route with heated case",
    icon: Bike,
  },
  {
    key: "DELIVERED",
    label: "Feast Delivered",
    desc: "Handed over safely to you",
    icon: ShieldCheck,
  },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setError(null);
      } else {
        setError(data.message || "Order not found");
      }
    } catch (err) {
      setError("Failed to connect to kitchen tracking server");
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchOrder();
    // Auto-poll every 6 seconds for live kitchen & GPS telemetry
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [orderId]);

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    downloadOrderReceipt({
      orderId: order.id,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email,
      address: order.address,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.deliveryFee || 0,
      tax: order.tax || 0,
      gstPercent: 5,
      total: order.total,
      paymentMethod: order.paymentMethod,
      date: new Date(order.createdAt).toLocaleString("en-IN"),
    });
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B1220]/70 hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={fetchOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-gray-700 shadow-xs border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span suppressHydrationWarning>
              Live Radar Sync ({isMounted ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Active"})
            </span>
          </button>
        </div>

        {loading ? (
          <div className="p-16 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white shadow-soft-card text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#FF6B35] border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-black text-gray-700">Connecting to Kitchen Telemetry & Satellite Radar...</p>
          </div>
        ) : error || !order ? (
          <div className="p-12 rounded-[32px] bg-white/90 backdrop-blur-xl border border-red-100 shadow-soft-card text-center space-y-4">
            <span className="text-4xl block">🔍</span>
            <h2 className="text-xl font-black text-[#0B1220] font-heading">Order #{orderId} Not Found</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">{error || "Please check your order confirmation code."}</p>
            <Link
              href="/track"
              className="inline-block px-6 py-3 rounded-2xl bg-[#FF6B35] text-white font-black text-xs shadow-glow"
            >
              Search Another Order
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header Hero Card */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#0B1220] via-[#1A2234] to-[#0B1220] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/25 text-[#FF8A00] text-[10px] font-black tracking-wider uppercase border border-[#FF6B35]/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LIVE DISPATCH TELEMETRY</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
                    Order #{order.id}
                  </h1>
                  <p className="text-xs text-gray-300" suppressHydrationWarning>
                    Placed on {isMounted ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"} • Delivery to <strong>{order.address}</strong>
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center sm:text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Estimated Arrival</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#3ECF6E] font-heading block">
                    {order.status === "DELIVERED" ? "Arrived 🎉" : `${order.etaMinutes} mins`}
                  </span>
                </div>
              </div>
            </div>

            {/* 🗺️ REAL-TIME ANIMATED SATELLITE RADAR GPS MAP */}
            <LiveOrderMap
              orderStatus={order.status}
              deliveryAddress={order.address}
              customerName={order.customerName}
              etaMinutes={order.etaMinutes}
              courierName={order.courierLocation?.name || "Rameshwar Sharma"}
              vehicle={order.courierLocation?.vehicle || "Electric Thermal Pod #09"}
            />

            {/* ⭐ RATE YOUR ORDER FEEDBACK CARD */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#FFF0E5] to-[#FFE4D6] border border-[#FF6B35]/30 shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in duration-300">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-[#FF6B35] text-xs font-black">
                  <Star className="w-4 h-4 fill-[#FF6B35]" />
                  <span>HOW WAS YOUR FEAST?</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 font-heading">
                  Leave Rating & Compliments for the Chef
                </h3>
                <p className="text-xs text-gray-600">
                  Rate your food taste and rider delivery to earn 100 VIP reward points.
                </p>
              </div>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs sm:text-sm shadow-glow transition-all flex items-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Rate This Order & Get Points</span>
              </button>
            </div>

            {/* Live Step Progression */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white/90 backdrop-blur-xl border border-white/80 shadow-soft-card">
              <h3 className="text-lg font-black text-[#0B1220] font-heading mb-6">Kitchen & Delivery Status</h3>

              <div className="relative">
                {/* Connecting Bar */}
                <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                <div 
                  className="hidden md:block absolute top-1/2 left-8 h-1 bg-gradient-to-r from-[#FF6B35] to-[#3ECF6E] -translate-y-1/2 transition-all duration-700 z-0" 
                  style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 90}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`flex md:flex-col items-center gap-3 p-3 rounded-2xl transition-all ${
                          isCurrent
                            ? "bg-[#FFF0E5] border border-[#FF6B35]/30 shadow-xs"
                            : isCompleted
                            ? "opacity-90"
                            : "opacity-40"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${
                            isCurrent
                              ? "bg-[#FF6B35] text-white shadow-glow scale-110 animate-pulse"
                              : isCompleted
                              ? "bg-[#3ECF6E] text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="text-left md:text-center">
                          <p className={`text-xs font-black ${isCurrent ? "text-[#FF6B35]" : "text-gray-900"}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white/90 backdrop-blur-xl border border-white/80 shadow-soft-card space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#FF6B35]" />
                  <h3 className="text-lg font-black text-[#0B1220] font-heading">Order Receipt</h3>
                </div>

                <button
                  onClick={handleDownloadInvoice}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B35] font-black text-xs border border-orange-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Download Tax Invoice (PDF)</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      />
                      <div>
                        <span className="text-xs font-black text-gray-900 block">{item.name}</span>
                        <span className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{Math.round(item.price)}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      ₹{Math.round(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{Math.round(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#3ECF6E] font-bold">
                    <span>Discount ({order.promoCode || "PROMO"})</span>
                    <span>-₹{Math.round(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Thermal Eco Delivery</span>
                  <span className="font-bold text-gray-900">
                    {order.deliveryFee === 0 ? "FREE" : `₹${Math.round(order.deliveryFee)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (5%)</span>
                  <span className="font-bold text-gray-900">₹{Math.round(order.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span className="text-[#FF6B35] font-heading font-black text-lg">₹{Math.round(order.total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Interactive Feedback Modal */}
      {order && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          orderId={order.id}
          defaultCustomerName={order.customerName}
          defaultDishName={order.items?.[0]?.name || ""}
          onFeedbackSubmitted={() => {
            fetchOrder();
          }}
        />
      )}

      <Footer />
    </main>
  );
}
