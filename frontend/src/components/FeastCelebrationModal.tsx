"use client";

import React, { useEffect, useState } from "react";
import { triggerChillarShower } from "@/utils/confetti";
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Coins,
  Receipt
} from "lucide-react";

interface FeastCelebrationProps {
  isOpen: boolean;
  orderNumber: string;
  onComplete: () => void;
}

export const FeastCelebrationModal: React.FC<FeastCelebrationProps> = ({
  isOpen,
  orderNumber,
  onComplete,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }

    setMounted(true);

    // 🪙 Trigger Golden Chillar & Coin Shower
    triggerChillarShower();
    const secondBurst = setTimeout(() => {
      triggerChillarShower();
    }, 1200);

    return () => clearTimeout(secondBurst);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Background Golden Aura Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#FFD700]/20 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute w-[400px] h-[400px] bg-[#FF6B35]/25 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md bg-white rounded-[36px] p-7 sm:p-8 shadow-2xl border border-white/80 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-300">
        
        {/* Animated Royal Golden Coin / Verifier Seal */}
        <div className="relative">
          {/* Rotating Glowing Ring */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#FFA500] to-[#FF6B35] flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.6)] animate-spin-slow p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5] animate-bounce" />
              </div>
            </div>
          </div>

          {/* Floating Gold Coin Badges */}
          <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#FFD700] text-amber-900 font-black text-sm flex items-center justify-center shadow-md animate-pulse">
            ₹
          </span>
          <span className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#FFA500] text-white font-black text-xs flex items-center justify-center shadow-md">
            🪙
          </span>
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment & Kitchen Verified</span>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 font-heading">
            Order Confirmed!
          </h2>
          
          <p className="text-xs text-gray-500 font-medium">
            Aapka royal order rasoi me dispatch ho chuka hai. 
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="w-full p-4 rounded-2xl bg-orange-50/70 border border-orange-100/80 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-500">Order ID</span>
            <span className="font-black text-gray-900 font-mono bg-white px-2 py-0.5 rounded-lg border border-orange-200 shadow-xs">
              #{orderNumber}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-500">Estimated Delivery</span>
            <span className="font-black text-[#FF6B35] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 22 - 25 Mins
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-orange-200/60 pt-2">
            <span className="font-bold text-gray-500">Thermal Transit</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> +100 VIP Coins Earned
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-1">
          <button
            onClick={onComplete}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Track Order on Live Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
