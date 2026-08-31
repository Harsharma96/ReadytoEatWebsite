"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  Zap, 
  Percent, 
  Gift, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Flame,
  Award
} from "lucide-react";

interface Coupon {
  code: string;
  title: string;
  discount: string;
  description: string;
  minOrder: number;
  validTill: string;
  badge: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

const COUPONS: Coupon[] = [
  {
    code: "ROYAL50",
    title: "Flat ₹50 Instant Discount",
    discount: "₹50 OFF",
    description: "Applicable on all orders above ₹299. Valid on all Gourmet Burgers, Pizzas & Biryanis.",
    minOrder: 299,
    validTill: "Tonight 11:59 PM",
    badge: "MOST POPULAR",
    color: "#FF6B35",
    bgGradient: "from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2]",
    borderColor: "border-[#FF6B35]/40",
  },
  {
    code: "FEAST100",
    title: "Flat ₹100 Off Royal Dawat",
    discount: "₹100 OFF",
    description: "Celebrate grand dining with flat ₹100 discount on orders above ₹599.",
    minOrder: 599,
    validTill: "Valid All Week",
    badge: "WEEKEND SPECIAL",
    color: "#FF4D6D",
    bgGradient: "from-[#FFE8EC] via-[#FFD5DC] to-[#FFF8F2]",
    borderColor: "border-[#FF4D6D]/40",
  },
  {
    code: "PARTY25",
    title: "25% OFF Custom Feast Boxes",
    discount: "25% OFF",
    description: "Build your 4-course feast box and enjoy flat 25% instant savings plus free dessert.",
    minOrder: 799,
    validTill: "Limited Slots Daily",
    badge: "FEAST BOX SPECIAL",
    color: "#FF8A00",
    bgGradient: "from-[#FFF4E5] via-[#FFE6CC] to-[#FFF8F2]",
    borderColor: "border-[#FF8A00]/40",
  },
  {
    code: "FIRSTBITE",
    title: "Flat 30% Welcome Bonus",
    discount: "30% OFF",
    description: "Welcome to FoodEat! Enjoy 30% discount on your first royal order up to ₹150.",
    minOrder: 199,
    validTill: "New Foodies Only",
    badge: "FIRST ORDER",
    color: "#3ECF6E",
    bgGradient: "from-[#E8F8F0] via-[#D0F2DF] to-[#FFF8F2]",
    borderColor: "border-[#3ECF6E]/40",
  },
  {
    code: "FREESHIP",
    title: "Free Thermal Pod Delivery",
    discount: "FREE DELIVERY",
    description: "Zero delivery fees on all orders dispatched within 25 minutes. No minimum limit.",
    minOrder: 149,
    validTill: "All Orders",
    badge: "ZERO DELIVERY FEE",
    color: "#9C6ADE",
    bgGradient: "from-[#F5EFFE] via-[#E9DCFC] to-[#FFF8F2]",
    borderColor: "border-[#9C6ADE]/40",
  },
  {
    code: "SHAHI200",
    title: "Flat ₹200 Off Mega Banquets",
    discount: "₹200 OFF",
    description: "For family get-togethers and celebrations. Flat ₹200 discount on orders above ₹1199.",
    minOrder: 1199,
    validTill: "Party Orders",
    badge: "MEGA FEAST",
    color: "#D4A373",
    bgGradient: "from-[#FFFBF5] via-[#EFE1CE] to-[#FFF8F2]",
    borderColor: "border-[#D4A373]/40",
  },
];

const BANK_OFFERS = [
  { bank: "HDFC Bank Cards", offer: "Flat ₹75 Cashback on Credit/Debit Cards above ₹499", code: "HDFCROYAL" },
  { bank: "ICICI Bank UPI", offer: "Flat ₹50 Instant Cashback using ICICI UPI QR", code: "ICICI50" },
  { bank: "Paytm Wallet", offer: "Up to ₹100 Cashback on Paytm Wallet Payments", code: "PAYTMFEAST" },
  { bank: "CRED Pay", offer: "Assured ₹30 - ₹150 Cashback on CRED Pay", code: "CREDBITE" },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rewardWon, setRewardWon] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const spinDailyReward = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRewardWon(null);

    setTimeout(() => {
      const rewards = [
        "🎉 You Won: 20% Instant Discount on Gourmet Burgers!",
        "🍰 You Won: Free Warm Choco Lava Cake on orders > ₹349!",
        "🚚 You Won: Free Thermal Pod Express Delivery!",
        "👑 You Won: Flat ₹75 Shahi Cash credited to your cart!",
      ];
      const random = rewards[Math.floor(Math.random() * rewards.length)];
      setRewardWon(random);
      setIsSpinning(false);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* ================= 1. HERO BANNER ================= */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2] relative overflow-hidden border-b border-black/5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 right-10 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B35] text-xs font-black shadow-xs border border-[#FF6B35]/20">
            <Percent className="w-3.5 h-3.5" />
            <span>SAVE UP TO 30% • LIVE FOOD PROMOS & COUPONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            Royal Deals & Dawat Offers
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Copy your favorite coupon code with 1-click and apply it at checkout to enjoy royal dining at unmissable prices.
          </p>
        </div>
      </section>

      {/* ================= 2. INTERACTIVE DAILY REWARD SPIN ================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1220] via-[#1E293B] to-[#0B1220] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-black">
              <Gift className="w-3.5 h-3.5" />
              <span>DAILY LUCKY REWARD</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
              Unlock Your Secret Daily Chef Perk
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md">
              Tap the button to reveal today&apos;s surprise bonus — from free desserts to instant discounts!
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 z-10">
            <button
              onClick={spinDailyReward}
              disabled={isSpinning}
              className={`px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-sm shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ${
                isSpinning ? "opacity-75 cursor-wait animate-pulse" : ""
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
              <span>{isSpinning ? "Spinning Royal Wheel..." : "🎁 Reveal Daily Perk"}</span>
            </button>

            {rewardWon && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black animate-in zoom-in-95 duration-300 text-center">
                {rewardWon}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 3. COUPONS GRID ================= */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 font-heading">
              Active Promo Coupons
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Click any coupon code to copy instantly</p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B35] hover:underline"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUPONS.map((c) => {
            const isCopied = copiedCode === c.code;

            return (
              <div
                key={c.code}
                className={`p-6 rounded-3xl bg-gradient-to-b ${c.bgGradient} border ${c.borderColor} shadow-soft-card flex flex-col justify-between space-y-5 relative group hover:shadow-glow transition-all duration-300`}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-gray-800 shadow-2xs border border-black/5">
                      {c.badge}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF6B35]" />
                      <span>{c.validTill}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 font-heading pt-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Dashed Coupon Pill */}
                <div className="pt-2">
                  <div className="p-3 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Promo Code</span>
                      <span className="text-base font-black text-gray-900 tracking-wider">{c.code}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(c.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isCopied
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-[#FF6B35] hover:bg-[#E85620] text-white shadow-glow"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 4. BANK & UPI OFFERS ================= */}
      <section className="py-12 bg-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-gray-900 font-heading">
              Bank & Payment Partner Cashbacks
            </h3>
            <p className="text-xs text-gray-500">
              Combine your FoodEat promo codes with payment gateway cashbacks for maximum savings!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {BANK_OFFERS.map((b, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#FFF8F2] border border-[#FF6B35]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-gray-900">{b.bank}</span>
                  <span className="text-[10px] font-bold text-[#FF6B35]">{b.code}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{b.offer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
