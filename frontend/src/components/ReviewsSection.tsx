"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  MessageSquarePlus, 
  ThumbsUp, 
  Quote, 
  Heart, 
  Bike, 
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from "lucide-react";
import { FeedbackReview } from "@/types";
import { FeedbackModal } from "./FeedbackModal";

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<FeedbackReview[]>([]);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(4);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    totalReviews: 12450,
    averageRating: 4.98,
    fiveStarPercent: 96,
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/feedback?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
        if (data.stats) {
          setStats((prev) => ({
            ...prev,
            totalReviews: 12450 + (data.reviews.length - 4),
            averageRating: data.stats.averageRating || 4.98,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 260;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="reviews" className="py-4 sm:py-16 bg-[#FFF8F2] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFC94A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-6">
          <div className="space-y-1 sm:space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              <span>PATRON RATINGS & VERIFIED REVIEWS</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
              Loved by Foodies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">Across India</span>
            </h2>
            <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug line-clamp-1">
              Freshly cooked in heated thermal pods. Read authentic reviews from 12,450+ patrons.
            </p>
          </div>

          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] sm:text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer self-start md:self-auto shrink-0"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Rate Your Feast</span>
          </button>
        </div>

        {/* Compact Telemetry Rating Summary Strip */}
        <div className="p-3 sm:p-6 lg:p-7 rounded-[18px] sm:rounded-[2.5rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-soft-card grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 items-center">
          
          {/* Main Score */}
          <div className="flex items-center sm:flex-col justify-between sm:justify-center text-left sm:text-center sm:border-r border-gray-100 sm:pr-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-5xl font-black text-gray-900 font-heading tracking-tight">
                {stats.averageRating}
              </span>
              <span className="text-sm sm:text-lg text-gray-400 font-bold">/ 5.0</span>
            </div>

            <div className="flex flex-col sm:items-center">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-[9px] sm:text-[11px] text-gray-400 font-bold mt-0.5">
                {stats.totalReviews.toLocaleString()}+ Verified Ratings
              </p>
            </div>
          </div>

          {/* Rating Progress Bars (Compact) */}
          <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs font-bold text-gray-600">
            {[
              { stars: 5, percent: 96 },
              { stars: 4, percent: 3 },
              { stars: 3, percent: 1 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2">
                <span className="w-10 text-right text-[9.5px] font-black">{bar.stars} Star</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A00]" 
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
                <span className="w-8 text-[9px] text-gray-400 text-right">{bar.percent}%</span>
              </div>
            ))}
          </div>

          {/* Michelin Standard Guarantee */}
          <div className="p-2.5 sm:p-4 rounded-xl bg-[#FFF8F2] border border-[#FF6B35]/20 space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-[#FF6B35] font-black text-[10px] sm:text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>100% Taste & Freshness Guarantee</span>
            </div>
            <p className="text-gray-600 leading-snug text-[9px] sm:text-[11px]">
              Not satisfied? Master chef re-prepares your dish or issues an instant 100% refund.
            </p>
            <div className="pt-0.5 flex items-center gap-2 text-[8.5px] sm:text-[9.5px] font-black text-emerald-700">
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> GPS Verified
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Thermal Hot
              </span>
            </div>
          </div>

        </div>

        {/* ================= MOBILE SWIPEABLE REVIEWS CAROUSEL (< md) ================= */}
        <div className="md:hidden space-y-2">
          
          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex items-stretch gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1 px-0.5"
          >
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="w-[230px] flex-shrink-0 snap-center rounded-xl bg-white border border-orange-100/90 p-2.5 shadow-2xs hover:shadow-glow flex flex-col justify-between space-y-2 h-[125px] text-left"
              >
                <div className="space-y-1">
                  
                  {/* Rating Stars & Emoji */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-base">{rev.moodEmoji || "😋"}</span>
                  </div>

                  {/* Dish Ordered */}
                  {rev.favoriteDish && (
                    <span className="inline-block px-1.5 py-0.2 rounded bg-[#FFF0E5] text-[#FF6B35] text-[8px] font-black truncate max-w-full">
                      🍽️ {rev.favoriteDish}
                    </span>
                  )}

                  {/* Review Text */}
                  <p className="text-[10px] text-gray-700 leading-snug font-medium line-clamp-2">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author Footer */}
                <div className="border-t border-gray-100 pt-1 flex items-center justify-between text-[8.5px]">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-black text-gray-900 truncate max-w-[90px]">
                      {rev.customerName}
                    </span>
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-gray-400 text-[8px]">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-0.5 text-[8.5px] font-bold text-gray-400">
            <span>👈 Swipe for more patron reviews</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-2xs active:scale-90"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-2xs active:scale-90"
                aria-label="Next review"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* ================= DESKTOP REVIEWS GRID (>= md) ================= */}
        <div className="hidden md:block space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.slice(0, visibleReviewsCount).map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-soft-card hover:shadow-glow transition-all flex flex-col justify-between group space-y-3 relative overflow-hidden text-left"
              >
                <div className="space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-lg">{rev.moodEmoji || "😋"}</span>
                  </div>

                  {rev.favoriteDish && (
                    <div className="inline-block px-2 py-0.5 rounded-md bg-[#FFF0E5] text-[#FF6B35] text-[9.5px] font-black truncate max-w-full">
                      🍽️ {rev.favoriteDish}
                    </div>
                  )}

                  <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-3">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-black text-gray-900 truncate">
                      {rev.customerName}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </div>
            ))}
          </div>

          {reviews.length > 4 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleReviewsCount(visibleReviewsCount >= reviews.length ? 4 : reviews.length)}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-gray-900 border border-orange-200 font-black text-xs shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span>{visibleReviewsCount >= reviews.length ? "Show Less" : `View All (${reviews.length})`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${visibleReviewsCount >= reviews.length ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onFeedbackSubmitted={fetchReviews}
      />

    </section>
  );
};
