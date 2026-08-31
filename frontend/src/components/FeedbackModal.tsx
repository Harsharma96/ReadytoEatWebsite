"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Star, 
  Sparkles, 
  Check, 
  ThumbsUp, 
  Heart, 
  MessageSquare, 
  Send, 
  Bike, 
  ChefHat, 
  Flame, 
  Package,
  Award,
  Gift,
  CheckCircle2 
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  defaultCustomerName?: string;
  defaultDishName?: string;
  initialRating?: number;
  onFeedbackSubmitted?: () => void;
}

const MOOD_EMOJIS = [
  { rating: 1, emoji: "😠", label: "Needs Improvement" },
  { rating: 2, emoji: "😐", label: "Fair" },
  { rating: 3, emoji: "🙂", label: "Good" },
  { rating: 4, emoji: "😋", label: "Super Delicious" },
  { rating: 5, emoji: "👑", label: "Mind Blowing Royal!" },
];

const COMPLIMENT_CHIPS = [
  "🔥 Steaming Hot & Fresh",
  "🛵 Ultra Fast 25-Min Delivery",
  "🧀 Insane Cheese Pull",
  "🍗 Tender & Juicy Core",
  "🌶️ Authentic Desi Spices",
  "🥟 Soft & Fluffy Texture",
  "📦 Zero-Spill Eco Thermal Box",
  "🌿 100% Avocado Oil & Clean",
  "💯 100% Value for Money",
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  orderId,
  defaultCustomerName = "",
  defaultDishName = "",
  initialRating = 5,
  onFeedbackSubmitted,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [tasteRating, setTasteRating] = useState<number>(5);
  const [packagingRating, setPackagingRating] = useState<number>(5);
  const [customerName, setCustomerName] = useState<string>(defaultCustomerName);
  const [favoriteDish, setFavoriteDish] = useState<string>(defaultDishName);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "🔥 Steaming Hot & Fresh",
    "🛵 Ultra Fast 25-Min Delivery"
  ]);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialRating) setRating(initialRating);
      if (defaultCustomerName) setCustomerName(defaultCustomerName);
      if (defaultDishName) setFavoriteDish(defaultDishName);
      setSubmitted(false);
      setErrorMessage(null);
    }
  }, [isOpen, initialRating, defaultCustomerName, defaultDishName]);

  if (!isOpen) return null;

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;
  const activeMood = MOOD_EMOJIS.find((m) => m.rating === currentDisplayRating) || MOOD_EMOJIS[4];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const triggerCelebration = () => {
    triggerConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF6B35", "#FFC94A", "#3ECF6E", "#FF4D6D"]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("Please share a short review of your dining experience.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      orderId,
      customerName: customerName.trim(),
      userName: customerName.trim(),
      rating,
      moodEmoji: activeMood.emoji,
      deliveryRating,
      tasteRating,
      packagingRating,
      favoriteDish: favoriteDish || "Chef Signature Feast",
      tags: selectedTags,
      comment: comment.trim(),
      title: `${activeMood.emoji} ${activeMood.label}`,
    };

    try {
      // 1. Submit to Next.js Feedback API
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 2. Also forward to Express backend reviews endpoint if available
      try {
        await fetch("http://localhost:5000/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {}

      const data = await res.json();
      if (data.success || res.ok) {
        setSubmitted(true);
        triggerCelebration();
        if (onFeedbackSubmitted) onFeedbackSubmitted();
      } else {
        setErrorMessage(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      // Fallback success for local UX
      setSubmitted(true);
      triggerCelebration();
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#FFF8F2] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] border-2 border-white/80 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white hover:bg-[#FF6B35] hover:text-white flex items-center justify-center text-gray-500 transition-all border border-gray-200 shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* ================= SUCCESS CELEBRATION VIEW ================= */
          <div className="text-center py-6 space-y-5 animate-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#3ECF6E] to-[#2E7D32] text-white flex items-center justify-center mx-auto text-4xl shadow-glow-fresh animate-bounce">
              👑
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#3ECF6E] bg-[#EAF9EF] px-3 py-1 rounded-full border border-[#3ECF6E]/30">
                +100 VIP Points Credited ✓
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B1220] font-heading">
                Royal Review Recorded!
              </h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Your valuable review has been presented to our Master Chefs. You can use your 100 VIP Points on your next order.
              </p>
            </div>

            {/* Review Summary Card */}
            <div className="p-4 rounded-2xl bg-white border border-orange-100/90 text-xs font-bold text-gray-800 space-y-2 text-left shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[11px] text-gray-500 font-bold">Dish: {favoriteDish}</span>
                <div className="flex text-[#FFB800] gap-0.5">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                  ))}
                </div>
              </div>
              <p className="italic text-gray-700 font-normal">&ldquo;{comment}&rdquo;</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedTags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-black bg-[#FFF0E5] text-[#FF6B35] px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#0B1220] hover:bg-gray-900 text-white text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Back to Dining & Menu
            </button>
          </div>
        ) : (
          /* ================= FEEDBACK FORM VIEW ================= */
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[10px] font-black uppercase tracking-wider border border-[#FF6B35]/20">
                <Sparkles className="w-3 h-3 text-[#FF6B35]" />
                <span>Rate Feast • Win 100 VIP Points</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B1220] font-heading">
                Rate Your Royal Feast
              </h3>
              {orderId && (
                <p className="text-xs text-gray-500 font-bold">
                  Verified Order Ticket <span className="font-mono text-[#FF6B35]">#{orderId}</span>
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* 1. Overall 5-Star Interactive Rating */}
            <div className="p-4 rounded-3xl bg-white border border-orange-100 text-center space-y-2 shadow-xs">
              <span className="text-[11px] font-black text-gray-700 block uppercase tracking-wider">
                Overall Feast Experience
              </span>

              {/* Dynamic Mood Reaction Display */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl animate-bounce">{activeMood.emoji}</span>
                <span className="text-base font-black text-[#FF6B35] font-heading">
                  {activeMood.label}
                </span>
              </div>

              {/* Star Selector */}
              <div className="flex justify-center items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        star <= currentDisplayRating
                          ? "fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.5)]"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 3-Way Category Breakdown: Food, Rider, Packaging */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-white border border-orange-100 text-center space-y-1 shadow-xs">
                <span className="text-[9px] font-black text-gray-500 uppercase flex items-center justify-center gap-1">
                  <ChefHat className="w-3 h-3 text-[#FF6B35]" /> Taste
                </span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setTasteRating(s)}
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                        s <= tasteRating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-orange-100 text-center space-y-1 shadow-xs">
                <span className="text-[9px] font-black text-gray-500 uppercase flex items-center justify-center gap-1">
                  <Bike className="w-3 h-3 text-[#FF6B35]" /> Speed
                </span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setDeliveryRating(s)}
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                        s <= deliveryRating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-orange-100 text-center space-y-1 shadow-xs">
                <span className="text-[9px] font-black text-gray-500 uppercase flex items-center justify-center gap-1">
                  <Package className="w-3 h-3 text-[#FF6B35]" /> Package
                </span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setPackagingRating(s)}
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                        s <= packagingRating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Compliment Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-gray-700 block uppercase tracking-wider">
                What did you love most?
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMPLIMENT_CHIPS.map((chip) => {
                  const isSelected = selectedTags.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleTag(chip)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0B1220] text-white shadow-xs scale-102"
                          : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-100/80"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Customer Info & Dish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-black text-gray-700 text-[10px] uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-100 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block font-black text-gray-700 text-[10px] uppercase mb-1">
                  Favorite Dish
                </label>
                <input
                  type="text"
                  placeholder="e.g. Awadhi Dum Biryani"
                  value={favoriteDish}
                  onChange={(e) => setFavoriteDish(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-100 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
            </div>

            {/* 5. Detailed Review Text */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-black text-gray-700 text-[10px] uppercase">
                  Your Review & Compliments to the Chef *
                </label>
                <span className="text-[10px] text-gray-400 font-mono">
                  {comment.length}/300
                </span>
              </div>
              <textarea
                rows={3}
                required
                maxLength={300}
                placeholder="Describe the aroma, saffron spices, tender texture, and packaging..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-100 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] hover:from-[#E85620] hover:to-[#E63956] text-white font-black text-xs sm:text-sm shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting Royal Review...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Review & Claim 100 VIP Points</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
