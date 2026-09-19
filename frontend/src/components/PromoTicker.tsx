"use client";

import React from "react";
import { Flame, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const PromoTicker: React.FC = () => {
  const { availablePromos, activePromo } = useCart();

  return (
    <div className="w-full bg-[#0B1220] text-white py-2 sm:py-2.5 overflow-hidden shadow-md border-y border-white/10 relative z-20">
      <div className="animate-marquee-slow flex items-center gap-8 sm:gap-12 whitespace-nowrap text-[11px] sm:text-xs font-black tracking-wider uppercase">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-8">
            <span className="flex items-center gap-1.5 text-[#FF6B35]">
              <Flame className="w-3.5 h-3.5 fill-[#FF6B35]" /> 1,487 ORDERS PLACED TODAY
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1.5 text-[#FFC94A]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" /> ADMIN SPOTLIGHT OFFERS LIVE
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-[#3ECF6E]">100% PURE COW DESI GHEE</span>
            <span className="text-gray-500">•</span>
            {availablePromos && availablePromos.length > 0 ? (
              <span className="text-[#FF4D6D] font-black">
                VIP VOUCHERS: {availablePromos.slice(0, 3).map(p => `${p.code} (${p.discountPercent ? `${p.discountPercent}% OFF` : `₹${p.fixedDiscount} OFF`})`).join(" • ")}
              </span>
            ) : activePromo ? (
              <span className="text-[#FF4D6D]">VIP COUPON: {activePromo.code}</span>
            ) : (
              <span className="text-[#FF4D6D]">25-MIN HOT THERMAL DISPATCH</span>
            )}
            <span className="text-gray-500">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
