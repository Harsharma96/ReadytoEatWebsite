"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Sparkles, ArrowRight, Flame, Clock, Gift, CheckCircle2, Copy, Check, Zap } from "lucide-react";

interface FlashPromo {
  code: string;
  title?: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minSpend: number;
  description: string;
  isActive: boolean;
  isFlashBanner?: boolean;
  freeItem?: string;
  badgeText?: string;
  hoursLeft?: number;
  bgGradient?: string;
}

export const FlashOfferBanner: React.FC = () => {
  const { applyPromoCode, setIsCartOpen, showToast } = useCart();
  const [flashPromo, setFlashPromo] = useState<FlashPromo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 59,
    seconds: 57,
  });

  const fetchFlashPromo = async () => {
    try {
      const res = await fetch(`/api/promo/flash?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.hasActiveOffer && data.promo) {
        setFlashPromo(data.promo);
        if (data.promo.hoursLeft) {
          setTimeLeft({
            hours: Math.max(1, Math.min(24, data.promo.hoursLeft)),
            minutes: 59,
            seconds: 57,
          });
        }
      } else {
        setFlashPromo(null);
      }
    } catch (err) {
      console.error("Error fetching live flash promo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashPromo();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated" || e.key === "foodeat_promos_updated") {
        fetchFlashPromo();
      }
    };
    const handleFocus = () => fetchFlashPromo();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // If no promo is active or ready in admin, gracefully don't show the banner
  if (loading || !flashPromo || !flashPromo.isActive) {
    return null;
  }

  const discountLabel = flashPromo.discountPercent 
    ? `${flashPromo.discountPercent}% Off` 
    : `₹${flashPromo.fixedDiscount} Off`;

  const bannerHeadline = flashPromo.title || 
    `Unlock ${discountLabel} + ${flashPromo.freeItem || "2 Free 24K Gold Gulab Jamuns"}`;

  const handleClaimOffer = async () => {
    if (flashPromo?.code) {
      const res = await applyPromoCode(flashPromo.code);
      if (res.success) {
        showToast(`🎉 Promo code "${flashPromo.code}" applied! ${discountLabel} activated for your feast.`);
      } else {
        showToast(res.message || `✨ Code ${flashPromo.code} ready in your cart!`);
      }
    }
    setIsCartOpen(true);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && flashPromo?.code) {
      navigator.clipboard.writeText(flashPromo.code);
      setCopied(true);
      showToast(`📋 Copied code "${flashPromo.code}" to clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="offer" className="py-3 sm:py-10 bg-[#FFF8F2] relative overflow-hidden animate-in fade-in-50 duration-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Luxury Royal Ticket Voucher Container */}
        <div className="relative rounded-[22px] sm:rounded-[32px] bg-gradient-to-r from-[#FF512F] via-[#DD2476] to-[#FF8A00] p-3.5 sm:p-7 lg:p-8 text-white shadow-2xl overflow-hidden border-2 border-white/35 group">
          
          {/* Ambient Background Light Flares */}
          <div className="absolute -top-12 -right-12 w-48 sm:w-80 h-48 sm:h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 sm:w-80 h-48 sm:h-80 bg-black/25 rounded-full blur-3xl pointer-events-none" />

          {/* Ticket Edge Notches (Classic Ticket Cutout) */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFF8F2] shadow-inner pointer-events-none hidden sm:block" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFF8F2] shadow-inner pointer-events-none hidden sm:block" />

          <div className="grid grid-cols-12 gap-2.5 sm:gap-6 items-center relative z-10">
            
            {/* Left Section: Voucher Value & Details (7.5 cols on mobile, 7 cols on desktop) */}
            <div className="col-span-8 sm:col-span-7 space-y-1.5 sm:space-y-2.5 text-left">
              
              {/* Row 1: Badges & Copy Promo Code Pill */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white text-[8px] sm:text-xs font-black uppercase tracking-wider shrink-0 border border-white/25 shadow-2xs">
                  <Flame className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
                  <span>{flashPromo.badgeText || "👑 ROYAL DEAL"}</span>
                </span>

                {/* Instant Copy Promo Code Pill */}
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md text-yellow-300 text-[8px] sm:text-xs font-black tracking-wider transition-all border border-amber-400/40 cursor-pointer active:scale-95 shadow-xs"
                  title="Click to copy coupon code"
                >
                  <Gift className="w-2.5 h-2.5 text-yellow-300" />
                  <span>CODE: <strong className="text-white underline">{flashPromo.code}</strong></span>
                  {copied ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-white/80" />
                  )}
                </button>
              </div>

              {/* Row 2: Headline */}
              <h3 className="text-sm sm:text-2xl lg:text-3xl font-black font-heading leading-tight tracking-tight text-white drop-shadow-sm line-clamp-1">
                {bannerHeadline}
              </h3>

              {/* Row 3: Perks Line */}
              <div className="flex items-center gap-1.5 text-[8.5px] sm:text-xs font-bold text-white/95 flex-wrap">
                <span className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 text-yellow-300 shrink-0" />
                  <span>Free Thermal Delivery</span>
                </span>
                {flashPromo.minSpend > 0 && (
                  <span className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-md backdrop-blur-xs text-yellow-200">
                    <Zap className="w-2.5 h-2.5 text-yellow-300 shrink-0" />
                    <span>Min ₹{flashPromo.minSpend}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right Section: Urgent Countdown & CTA (4 cols on mobile, 5 cols on desktop) */}
            <div className="col-span-4 sm:col-span-5 flex flex-col items-center sm:items-end justify-center space-y-1.5 sm:space-y-3 text-center sm:text-right pl-2 sm:pl-4 border-l border-dashed border-white/35">
              
              {/* Countdown Pill */}
              <div className="flex flex-col items-center sm:items-end w-full">
                <span className="text-[7px] sm:text-[9.5px] font-black uppercase tracking-wider text-yellow-200 block mb-0.5">
                  ⏱️ Ends In
                </span>
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 bg-black/45 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-400/35 shadow-inner w-full max-w-[130px] sm:max-w-none">
                  <span className="text-[10.5px] sm:text-base font-black font-mono text-yellow-300">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span className="text-[8px] text-white/60 font-bold">:</span>
                  <span className="text-[10.5px] sm:text-base font-black font-mono text-yellow-300">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span className="text-[8px] text-white/60 font-bold">:</span>
                  <span className="text-[10.5px] sm:text-base font-black font-mono text-yellow-300">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              {/* Claim Action Button */}
              <button
                onClick={handleClaimOffer}
                className="w-full sm:w-auto px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl bg-white hover:bg-yellow-50 text-gray-950 font-black text-[9.5px] sm:text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Claim Deal</span>
                <ArrowRight className="w-3 h-3 text-[#DD2476]" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
