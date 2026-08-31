"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  X, 
  Bell, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Gift, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export interface PendingRatingOrder {
  id: string;
  customerName: string;
  dishName: string;
  dishImage?: string;
  total: number;
  placedAt: string;
  rated?: boolean;
}

export const OrderRatingNotification: React.FC = () => {
  const [pendingOrder, setPendingOrder] = useState<PendingRatingOrder | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [preSelectedRating, setPreSelectedRating] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Play gentle bell chime using Web Audio API
  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Chime note 1 (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.6);

      // Chime note 2 (G#5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(830.61, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.9);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const checkPendingOrder = () => {
    try {
      const raw = localStorage.getItem("foodeat_pending_rating");
      if (raw) {
        const parsed: PendingRatingOrder = JSON.parse(raw);
        if (!parsed.rated) {
          setPendingOrder(parsed);
          setIsVisible(true);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    // Initial check after delay
    const timer = setTimeout(() => {
      checkPendingOrder();
    }, 2500);

    // Listen to custom event when order is placed
    const handleOrderPlaced = (e: CustomEvent<PendingRatingOrder>) => {
      if (e.detail) {
        setPendingOrder(e.detail);
        setIsVisible(true);
        setDismissed(false);
        setTimeout(playNotificationChime, 800);
      }
    };

    window.addEventListener("foodeat:order_placed" as any, handleOrderPlaced);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("foodeat:order_placed" as any, handleOrderPlaced);
    };
  }, []);

  const handleStarClick = (rating: number) => {
    setPreSelectedRating(rating);
    setIsModalOpen(true);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  const handleRatingSubmitted = () => {
    setIsModalOpen(false);
    setIsVisible(false);
    if (pendingOrder) {
      const updated = { ...pendingOrder, rated: true };
      localStorage.setItem("foodeat_pending_rating", JSON.stringify(updated));
    }
  };

  if (!pendingOrder || !isVisible || dismissed) {
    return (
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={pendingOrder?.id || "ORD-RECENT"}
        defaultCustomerName={pendingOrder?.customerName || "Valued Patron"}
        defaultDishName={pendingOrder?.dishName || "Royal Feast"}
        initialRating={preSelectedRating}
        onFeedbackSubmitted={handleRatingSubmitted}
      />
    );
  }

  const starCount = hoverStars || 5;
  const moodLabels = ["Needs Work 😠", "Fair 😐", "Good 🙂", "Delicious 😋", "Royal Mind Blowing! 👑"];

  return (
    <>
      {/* FLOATING LUXURY RATING NOTIFICATION CARD */}
      <aside 
        aria-label="Order Rating Notification"
        className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 max-w-[390px] w-[calc(100%-24px)] transition-all duration-500 animate-in slide-in-from-bottom-6 fade-in duration-300"
      >
        <div className="relative rounded-[28px] bg-[#FFF8F2]/95 backdrop-blur-[24px] border-2 border-[#FF6B35]/30 shadow-[0_20px_60px_rgba(255,107,53,0.25)] p-4 sm:p-5 overflow-hidden group">
          
          {/* Top Moving Rainbow Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#FFC94A] to-[#3ECF6E]" />

          {/* Decorative Corner Glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3ECF6E]/15 rounded-full blur-xl pointer-events-none" />

          {/* Card Header with Bell and Close */}
          <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white flex items-center justify-center shadow-glow animate-bounce">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B35] bg-[#FFF0E5] px-2.5 py-0.5 rounded-full border border-[#FF6B35]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6B35]" /> How Was Your Feast?
                </span>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-all border border-gray-200"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Order Details Preview */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/90 border border-orange-100/90 shadow-xs mb-3.5">
            {pendingOrder.dishImage ? (
              <img
                src={pendingOrder.dishImage}
                alt={pendingOrder.dishName}
                className="w-12 h-12 rounded-xl object-cover border border-orange-200/60 shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF0E5] to-[#FFE4D6] flex items-center justify-center text-2xl flex-shrink-0">
                🍽️
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black text-gray-500 font-mono">
                  #{pendingOrder.id}
                </span>
                <span className="text-[9px] font-black text-[#3ECF6E] bg-[#EAF9EF] px-1.5 py-0.2 rounded-md">
                  Delivered Hot ✓
                </span>
              </div>
              <h4 className="text-xs font-black text-[#0B1220] truncate font-heading">
                {pendingOrder.dishName}
              </h4>
              <p className="text-[10px] text-gray-500 font-bold truncate">
                For {pendingOrder.customerName}
              </p>
            </div>
          </div>

          {/* Interactive 1-Click Star Selector */}
          <div className="space-y-2 mb-3.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-gray-600">Tap to rate experience:</span>
              <span className="font-black text-[#FF6B35] font-heading">
                {moodLabels[starCount - 1]}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 rounded-2xl bg-white/70 border border-orange-100">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverStars(s)}
                  onMouseLeave={() => setHoverStars(null)}
                  onClick={() => handleStarClick(s)}
                  className="p-1 transition-all duration-200 hover:scale-125 active:scale-95 focus:outline-none group/star"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      s <= starCount
                        ? "text-[#FFB800] fill-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.5)]"
                        : "text-gray-200 hover:text-[#FFB800]/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Reward Badge & Main Action Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-[#FF6B35] bg-[#FFF0E5] py-1 px-3 rounded-full border border-[#FF6B35]/30">
              <Gift className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Earn 100 VIP Reward Points Instantly (₹100 Value)</span>
            </div>

            <button
              onClick={() => {
                setPreSelectedRating(5);
                setIsModalOpen(true);
                setIsVisible(false);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Write Royal Review & Claim Points</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Embedded Enhanced Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={pendingOrder.id}
        defaultCustomerName={pendingOrder.customerName}
        defaultDishName={pendingOrder.dishName}
        initialRating={preSelectedRating}
        onFeedbackSubmitted={handleRatingSubmitted}
      />
    </>
  );
};
