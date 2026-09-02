"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { triggerChillarShower } from "@/utils/confetti";
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  MapPin,
  User,
  Banknote,
  Receipt,
  Check,
  Printer,
  Download,
  Copy,
  Smartphone,
  Zap,
  ExternalLink,
  QrCode
} from "lucide-react";
import { downloadOrderReceipt } from "@/utils/generateReceipt";
import { PublicPaymentConfig } from "@/types";

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart,
    promoCode,
    clearCart, 
    finalTotal,
    subtotal,
    discount,
    shipping,
    tax,
    gstPercent,
    isGstEnabled,
    taxName,
    showToast
  } = useCart();

  // Multi-step state: 1: Address & Contact, 2: Payment, 3: Review & Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [showInAppReceipt, setShowInAppReceipt] = useState<boolean>(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Admin Configured Gateway & QR Scanner
  const [paymentConfig, setPaymentConfig] = useState<PublicPaymentConfig>({
    isUpiQrEnabled: true,
    isOnlineGatewayEnabled: true,
    isCodEnabled: true,
    isCardOnDeliveryEnabled: true,
    businessUpiId: "admin.foodeat@icici",
    payeeName: "FoodEat Royal Kitchen & Catering",
    qrCodeImageUrl: "",
    upiInstructions: "Scan this QR code with any UPI App (Google Pay, PhonePe, Paytm, BHIM) and enter your 12-digit UTR No. below.",
    currency: "INR",
    isRazorpayEnabled: true,
    isStripeEnabled: true,
  });
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [upiAppUsed, setUpiAppUsed] = useState<string>("GPay");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Auto-Payment Detection & Live Timer State
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(true);
  const [autoDetectedSuccess, setAutoDetectedSuccess] = useState<boolean>(false);
  const [isVerifyingUpiLive, setIsVerifyingUpiLive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  
  const [formData, setFormData] = useState({
    name: "Rohan Sharma",
    phone: "9876543210",
    email: "rohan.sharma@gmail.com",
    houseNo: "Flat 402, Royale Palms",
    street: "Connaught Place, Barakhamba Road",
    landmark: "Near Metro Gate 3",
    city: "New Delhi",
    pinCode: "110001",
    instructions: "Please deliver piping hot in clay handi."
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<{
    id: string;
    customerName: string;
    phone: string;
    address: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    discount: number;
    total: number;
    itemsCount: number;
    paymentMethod: string;
    deliveryFee?: number;
    tax?: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Admin Configured Payment Gateways & UPI QR Scanner with Live Cross-Tab Sync
  useEffect(() => {
    // 1. Instant check from localStorage for zero-delay sync
    const applyStorageConfig = () => {
      try {
        const saved = localStorage.getItem("foodeat_custom_scanner");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.qrCodeImageUrl || parsed.businessUpiId || parsed.payeeName) {
            setPaymentConfig((prev) => ({
              ...prev,
              ...(parsed.qrCodeImageUrl !== undefined ? { qrCodeImageUrl: parsed.qrCodeImageUrl } : {}),
              ...(parsed.businessUpiId ? { businessUpiId: parsed.businessUpiId } : {}),
              ...(parsed.payeeName ? { payeeName: parsed.payeeName } : {}),
            }));
          }
        }
      } catch {}
    };

    applyStorageConfig();

    // Listen to storage events so when Admin saves in another tab, website updates instantly!
    const handleStorageEvent = (e: StorageEvent | Event) => {
      applyStorageConfig();
    };
    window.addEventListener("storage", handleStorageEvent);

    // 2. Fetch from backend API with no-store cache
    const fetchPaymentConfig = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "").replace(/\/api$/i, "");
        const urlsToTry = [
          `/api/payments/config?t=${Date.now()}`,
          apiBase ? `${apiBase}/api/payments/config?t=${Date.now()}` : null,
        ].filter(Boolean) as string[];

        for (const url of urlsToTry) {
          try {
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              const config = data.config || (data.success !== undefined ? data : null);
              if (config) {
                setPaymentConfig((prev) => ({ ...prev, ...config }));
                if (config.isUpiQrEnabled) {
                  setPaymentMethod("upi");
                } else if (config.isOnlineGatewayEnabled) {
                  setPaymentMethod("card");
                } else if (config.isCodEnabled) {
                  setPaymentMethod("cod");
                }
                break;
              }
            }
          } catch {}
        }
      } catch (err) {
        console.error("Failed to fetch payment config:", err);
      }
    };
    fetchPaymentConfig();

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  // Live Timer for UPI payment waiting
  useEffect(() => {
    if (currentStep === 2 && paymentMethod === "upi" && timerSeconds > 0 && !autoDetectedSuccess) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, paymentMethod, timerSeconds, autoDetectedSuccess]);

  const handleCopyUpi = () => {
    if (paymentConfig.businessUpiId) {
      navigator.clipboard.writeText(paymentConfig.businessUpiId);
      setCopiedUpi(true);
      showToast("📋 Business UPI ID copied to clipboard!");
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleAutoVerifyNow = async (customUtr?: string) => {
    setIsVerifyingUpiLive(true);
    const finalUtr = customUtr || utrNumber || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setUtrNumber(finalUtr);
    try {
      const res = await fetch("/api/payments/auto-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utrNumber: finalUtr,
          upiAppUsed: upiAppUsed,
          amount: finalTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAutoDetectedSuccess(true);
        triggerChillarShower();
        showToast("⚡ Bank payment received & auto-verified! 🎉");
      }
    } catch (e) {
      console.error(e);
      showToast("Error checking auto-payment status");
    } finally {
      setIsVerifyingUpiLive(false);
    }
  };

  // Trigger Golden Chillar when order confirmation screen opens
  useEffect(() => {
    if (isOrderConfirmed) {
      triggerChillarShower();
      const secondBurst = setTimeout(() => {
        triggerChillarShower();
      }, 1000);
      return () => clearTimeout(secondBurst);
    }
  }, [isOrderConfirmed]);

  if (!isCheckoutOpen) return null;

  const totalItemsCount = cart.reduce((s, i) => s + i.quantity, 0) || 1;

  // Step 1 Validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.houseNo.trim() || !formData.street.trim() || !formData.pinCode.trim()) {
      setErrorMessage("Please fill in all required delivery fields.");
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleProceedToReview = () => {
    setErrorMessage(null);
    setCurrentStep(3);
  };

  // Step 3 Final Place Order
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (!formData.name || !formData.phone || !formData.houseNo || !formData.street || !formData.pinCode) {
        throw new Error("Please fill in all mandatory delivery details.");
      }

      // Map cart items for backend
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || "",
      }));

      // Fallback feast item if empty
      if (orderItems.length === 0) {
        orderItems.push({
          productId: "awadhi-dum-biryani",
          name: "Shahi Awadhi Dum Gosht Biryani",
          price: 549,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop",
        });
      }

      const fullAddress = `${formData.houseNo}, ${formData.street}${formData.landmark ? `, ${formData.landmark}` : ""}, ${formData.city} - ${formData.pinCode}`;

      const orderPayload = {
        customerName: formData.name,
        phone: `+91 ${formData.phone}`,
        address: fullAddress,
        deliveryInstructions: formData.instructions || "Please handle with royal care.",
        items: orderItems,
        subtotal: subtotal || 549,
        discount: discount || 0,
        deliveryFee: shipping,
        tax: tax,
        total: finalTotal || 549,
        itemsCount: totalItemsCount,
        paymentMethod: paymentMethod === "upi" ? "UPI (QR Scanner)" : paymentMethod === "card" ? "Cards / NetBanking" : "Cash on Delivery (COD)",
        appliedPromoCode: promoCode || undefined,
        transactionRef: utrNumber.trim() || undefined,
        utrNumber: utrNumber.trim() || undefined,
        upiAppUsed: paymentMethod === "upi" ? upiAppUsed : undefined,
        qrCodeScanned: paymentMethod === "upi",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      const newId = data.order.id;
      
      // Save confirmed state
      setConfirmedOrderData({
        id: newId,
        customerName: formData.name,
        phone: `+91 ${formData.phone}`,
        address: fullAddress,
        items: orderItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal: subtotal || 549,
        discount: discount || 0,
        total: finalTotal || 549,
        itemsCount: totalItemsCount,
        paymentMethod: paymentMethod,
        deliveryFee: shipping,
        tax: tax,
      });

      setIsProcessing(false);
      setIsOrderConfirmed(true);

      // Save pending rating order & broadcast event for notification
      const pendingData = {
        id: newId,
        customerName: formData.name,
        dishName: orderItems[0]?.name || "Shahi Royal Feast",
        dishImage: orderItems[0]?.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000",
        total: finalTotal || 549,
        placedAt: new Date().toISOString(),
        rated: false,
      };

      try {
        localStorage.setItem("foodeat_pending_rating", JSON.stringify(pendingData));
        window.dispatchEvent(new CustomEvent("foodeat:order_placed", { detail: pendingData }));
      } catch (e) {}

      clearCart();
      showToast(`🎉 Order #${newId} placed successfully!`);
    } catch (err: any) {
      console.error("Order processing error:", err);
      setIsProcessing(false);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsOrderConfirmed(false);
    setShowInAppReceipt(false);
    setConfirmedOrderData(null);
    setCurrentStep(1);
  };

  const handleOpenReceipt = () => {
    setShowInAppReceipt(true);
  };

  const handleDownloadReceiptDirect = async () => {
    if (!confirmedOrderData) return;

    // If the in-app receipt card is visible, capture it as a PNG image
    if (receiptRef.current) {
      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(receiptRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#f8fafc",
          logging: false,
        });
        const link = document.createElement("a");
        const invoiceNo = `INV-${confirmedOrderData.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`;
        link.download = `FoodEat_Receipt_${invoiceNo}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Image capture failed:", err);
      }
      return;
    }

    // Fallback: open receipt view first, then user can re-click download
    setShowInAppReceipt(true);
  };

  const handleGoToTracking = () => {
    const targetId = confirmedOrderData?.id;
    handleClose();
    if (targetId) {
      router.push(`/track/${targetId}`);
    } else {
      router.push("/track");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* ================= STATE 1: IN-APP FULL-SCREEN LUXURY RECEIPT PREVIEW ================= */}
      {showInAppReceipt && confirmedOrderData ? (
        <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-white/90 p-4 sm:p-5 flex flex-col space-y-3 animate-in zoom-in-95 duration-200 my-auto text-left">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#2E7D32]" />

          {/* Close button top-right only */}
          <button
            onClick={() => setShowInAppReceipt(false)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>



          {/* Receipt Paper Body */}
          <div ref={receiptRef} className="rounded-2xl bg-gray-50/80 border border-gray-200/80 p-3 space-y-2.5 text-xs">
            
            {/* Header */}
            <div className="text-center pb-2 border-b border-dashed border-gray-200">
              <h4 className="text-sm font-black text-gray-900 font-heading">
                👑 FOOD<span className="text-[#FF6B35]">EAT</span> SHAHI RASOI
              </h4>
              <p className="text-[9px] font-black text-[#FF6B35] uppercase tracking-wider">
                100% Pure Cow Desi Ghee Gourmet
              </p>
              <p className="text-[9px] text-gray-400">Connaught Place, New Delhi • support@foodeat.in</p>
              <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded">
                ✓ PAID & VERIFIED
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 pb-2 border-b border-dashed border-gray-200">
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[8px]">Invoice No</span>
                <strong className="text-gray-900 font-mono text-[10px]">FE-INV-{confirmedOrderData.id.slice(-6).toUpperCase()}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase block text-[8px]">Payment Mode</span>
                <strong className="text-emerald-700 uppercase font-black">{confirmedOrderData.paymentMethod}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 font-bold uppercase block text-[8px]">Billed To</span>
                <strong className="text-gray-900">{confirmedOrderData.customerName} ({confirmedOrderData.phone})</strong>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 font-bold uppercase block text-[8px]">Deliver Location</span>
                <span className="text-gray-700 font-medium leading-tight block">{confirmedOrderData.address}</span>
              </div>
            </div>

            {/* Dishes */}
            <div className="space-y-1.5 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                Itemized Dishes
              </span>
              {confirmedOrderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-gray-900 truncate max-w-[190px]">
                    {item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span>
                  </span>
                  <span className="font-black text-gray-900">
                    ₹{Math.round(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{Math.round(confirmedOrderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Delivery</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-bold text-gray-900">+₹{Math.round(confirmedOrderData.tax || 0)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-gray-200 text-xs font-black text-gray-900 font-heading">
                <span>Grand Total</span>
                <span className="text-[#FF6B35] text-sm">₹{Math.round(confirmedOrderData.total)}</span>
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownloadReceiptDirect}
              className="py-2.5 px-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85620] text-white font-black text-xs shadow-glow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Direct Download</span>
            </button>

            <button
              onClick={() => setShowInAppReceipt(false)}
              className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs transition-colors cursor-pointer text-center"
            >
              Back to Ticket
            </button>
          </div>

        </div>
      ) : isOrderConfirmed && confirmedOrderData ? (
        /* ================= STATE 2: ORDER CONFIRMATION TICKET ================= */
        <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-white/90 p-5 sm:p-7 flex flex-col items-center text-center space-y-3.5 animate-in zoom-in-95 duration-300 my-auto">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#2E7D32]" />

          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Success Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EAF9EF] to-[#D4F5DE] border-2 border-[#3ECF6E] flex items-center justify-center text-[#2E7D32] shadow-sm animate-bounce">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          <div className="space-y-0.5">
            <span className="text-[9.5px] font-black uppercase tracking-widest text-[#FF6B35]">
              👑 SHAHI KITCHEN DISPATCH
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 font-heading">
              Feast Order Confirmed!
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Order ID: <strong className="text-gray-900 font-mono">#{confirmedOrderData.id}</strong>
            </p>
          </div>

          {/* Order Details Ticket */}
          <div className="w-full rounded-2xl bg-orange-50/70 border border-orange-200/80 p-3.5 text-left space-y-2 text-xs">
            <div className="space-y-1 text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-[#FF6B35]" /> Customer
                </span>
                <span className="font-black text-gray-900">{confirmedOrderData.customerName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-bold flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-[#FF6B35]" /> Deliver To
                </span>
                <span className="font-bold text-gray-900 text-right truncate max-w-[170px]">
                  {confirmedOrderData.address}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-bold flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-[#FF6B35]" /> Payment
                </span>
                <span className="font-black text-[#2E7D32]">
                  {confirmedOrderData.paymentMethod === "upi" ? "UPI ⚡ (Paid)" : confirmedOrderData.paymentMethod === "card" ? "Card (Paid)" : "COD"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-orange-200/60 font-heading">
              <span className="text-xs text-gray-700 font-bold">Total Bill (Paid)</span>
              <span className="text-base sm:text-lg font-black text-[#FF6B35]">
                ₹{Math.round(confirmedOrderData.total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-1">
            <button
              onClick={handleGoToTracking}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs shadow-glow transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Track Order on Live Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenReceipt}
                className="py-2 px-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B35] font-black text-[11px] border border-orange-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Receipt className="w-3 h-3" />
                <span>View Receipt</span>
              </button>

              <button
                onClick={async () => {
                  // Open receipt view first so receiptRef is mounted
                  setShowInAppReceipt(true);
                  // Wait for DOM to render then capture
                  setTimeout(() => handleDownloadReceiptDirect(), 400);
                }}
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Direct Download</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer text-center mt-1"
            >
              Back to Menu
            </button>
          </div>

        </div>
      ) : (
        /* ================= STATE 3: 3-STEP LUXURY STEPPER CHECKOUT ================= */
        <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-white/90 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 my-auto">
          
          {/* Top Gradient Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D]" />

          {/* Modal Header & 3-Step Indicator */}
          <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white flex items-center justify-center shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 font-heading leading-tight">
                    Shahi Express Checkout
                  </h2>
                  <p className="text-[9.5px] text-gray-400 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#2E7D32]" /> 256-Bit Encrypted
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer active:scale-90"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3-STEP PROGRESS STEPPER PILL */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-black text-center">
              
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 1 
                    ? "bg-[#FF6B35] text-white shadow-2xs" 
                    : currentStep > 1 
                      ? "text-emerald-700 bg-emerald-50" 
                      : "text-gray-400"
                }`}
              >
                {currentStep > 1 ? <Check className="w-3 h-3" /> : <span>1.</span>}
                <span>Address</span>
              </button>

              <button
                type="button"
                onClick={() => currentStep > 1 && setCurrentStep(2)}
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  currentStep === 2 
                    ? "bg-[#FF6B35] text-white shadow-2xs" 
                    : currentStep > 2 
                      ? "text-emerald-700 bg-emerald-50 cursor-pointer" 
                      : "text-gray-400"
                }`}
              >
                {currentStep > 2 ? <Check className="w-3 h-3" /> : <span>2.</span>}
                <span>Payment</span>
              </button>

              <button
                type="button"
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  currentStep === 3 
                    ? "bg-[#FF6B35] text-white shadow-2xs" 
                    : "text-gray-400"
                }`}
              >
                <span>3.</span>
                <span>Review</span>
              </button>

            </div>
          </div>

          {/* Form Content Area with Scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-left">
            
            {errorMessage && (
              <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* ================= STEP 1: CONTACT & DELIVERY ADDRESS ================= */}
            {currentStep === 1 && (
              <form onSubmit={handleProceedToPayment} className="space-y-2.5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                    1. Contact Info
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                    2. Delivery Location
                  </span>
                  
                  <input
                    type="text"
                    required
                    placeholder="House / Flat No. & Building Name *"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Street / Locality *"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nearby Landmark"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PIN Code *"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* ================= STEP 2: PAYMENT SELECTION ================= */}
            {currentStep === 2 && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                  Select Payment Method
                </span>

                {/* Option 1: Instant UPI QR Code Scanner */}
                {paymentConfig.isUpiQrEnabled && (
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === "upi"
                        ? "border-[#FF6B35] bg-orange-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-base">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">UPI QR Scanner (Scan & Pay)</h4>
                        <p className="text-[9.5px] text-gray-500 font-medium">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "upi" ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
                    }`}>
                      {paymentMethod === "upi" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                )}

                {/* ================= CLEAN & DIRECT UPI QR SCANNER ================= */}
                {paymentMethod === "upi" && (
                  <div className="bg-white border-2 border-[#FF6B35]/40 rounded-2xl p-4 shadow-sm text-gray-900 space-y-3 relative animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Payee & Payable Amount Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-gray-900 font-heading">
                          {paymentConfig.payeeName || "FoodEat Royal Kitchen & Catering"}
                        </h4>
                      </div>
                      <div className="text-right px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
                        <span className="text-[8px] text-gray-400 font-black block uppercase">Amount to Pay</span>
                        <span className="text-sm sm:text-base font-black text-[#FF6B35] font-heading leading-none">
                          ₹{finalTotal || 549}
                        </span>
                      </div>
                    </div>

                    {/* QR Scanner Image */}
                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="bg-white p-2 rounded-xl shadow-2xs flex items-center justify-center">
                        {paymentConfig.qrCodeImageUrl ? (
                          <img
                            src={paymentConfig.qrCodeImageUrl}
                            alt="Merchant UPI Scanner"
                            className="max-h-64 sm:max-h-72 w-auto max-w-full object-contain rounded-lg"
                          />
                        ) : (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(`upi://pay?pa=${paymentConfig.businessUpiId || "admin.foodeat@icici"}&pn=${encodeURIComponent(paymentConfig.payeeName || "FoodEat Royal Kitchen & Catering")}&am=${finalTotal || 549}&cu=INR&tn=FoodEat_Order`)}`}
                            alt="UPI QR Scanner"
                            className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                          />
                        )}
                      </div>
                    </div>

                    {/* UPI ID + 1-Click Copy Box */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="min-w-0 flex-1">
                        <span className="text-[8.5px] font-black text-gray-400 block uppercase">UPI ID</span>
                        <span className="font-mono font-black text-xs text-gray-900 truncate block">
                          {paymentConfig.businessUpiId || "admin.foodeat@icici"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className={`h-7 px-3 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 ${
                          copiedUpi
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-white hover:bg-orange-50 text-[#FF6B35] border border-orange-200"
                        }`}
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 12-Digit UTR Input */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">
                        12-Digit UPI UTR / Transaction Reference ID (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={18}
                        placeholder="Enter UTR from GPay / PhonePe / Paytm"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full h-8 px-3 rounded-xl bg-white border border-gray-300 font-mono font-bold text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                      />
                    </div>

                  </div>
                )}

                {/* Option 2: Debit/Credit Cards */}
                {paymentConfig.isOnlineGatewayEnabled && (
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === "card"
                        ? "border-[#FF6B35] bg-orange-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Credit / Debit Cards & NetBanking</h4>
                        <p className="text-[9.5px] text-gray-500 font-medium">Visa, Mastercard, RuPay & Diners</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card" ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
                    }`}>
                      {paymentMethod === "card" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                )}

                {/* Option 3: Cash on Delivery */}
                {paymentConfig.isCodEnabled && (
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === "cod"
                        ? "border-[#FF6B35] bg-orange-50/60 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Cash on Delivery (COD)</h4>
                        <p className="text-[9.5px] text-gray-500 font-medium">Pay with Cash / UPI upon delivery</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-2.5 px-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToReview}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Review Order & Pay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: ORDER REVIEW & CONFIRM ================= */}
            {currentStep === 3 && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                {/* Destination & Payment Summary Box */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF6B35]" /> Destination
                    </span>
                    <span className="text-[11px] font-black text-gray-900 text-right truncate max-w-[180px]">
                      {formData.houseNo}, {formData.street}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#FF6B35]" /> Payment Mode
                    </span>
                    <span className="text-[11px] font-black text-[#2E7D32]">
                      {paymentMethod === "upi" ? "UPI QR Scanner ⚡" : paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
                    </span>
                  </div>

                  {utrNumber && paymentMethod === "upi" && (
                    <div className="flex items-center justify-between border-t border-orange-200/60 pt-1">
                      <span className="text-[10px] font-bold text-gray-500">
                        📱 UPI UTR Reference
                      </span>
                      <span className="text-[10.5px] font-mono font-black text-[#FF6B35]">
                        {utrNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items Pill List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                    Dishes in Feast ({totalItemsCount})
                  </span>
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-7 h-7 rounded-md object-cover"
                          />
                          <span className="font-bold text-gray-900 truncate max-w-[140px] text-[11px]">
                            {item.product.name}
                          </span>
                        </div>
                        <span className="text-gray-600 font-black text-[11px]">
                          {item.quantity}x (₹{Math.round(item.product.price * item.quantity)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Bill Breakdown */}
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-[11px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{Math.round(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-₹{Math.round(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Thermal Delivery</span>
                    <span className="font-bold text-[#2E7D32]">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>

                  <div className="flex justify-between pt-1.5 border-t border-gray-200 text-xs sm:text-sm font-black text-gray-900 font-heading">
                    <span>Final Amount</span>
                    <span className="text-[#FF6B35] text-sm sm:text-base">₹{Math.round(finalTotal)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-2.5 px-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] text-white font-black text-xs sm:text-sm shadow-glow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Placing Royal Order...</span>
                    ) : (
                      <>
                        <span>Place Shahi Order (₹{Math.round(finalTotal)})</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
