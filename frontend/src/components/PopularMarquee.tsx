"use client";

import React, { useState, useEffect } from "react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  Plus, 
  Heart, 
  Flame, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  TrendingUp,
  Tag,
  Zap
} from "lucide-react";
import { Product } from "@/types/product";

interface TrendingDisplayItem {
  id: string;
  product: Product;
  customOfferTag?: string;
  offerBadge?: string;
  rank: number;
}

export const PopularMarquee: React.FC = () => {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, activePromo } = useCart();
  const [trendingItems, setTrendingItems] = useState<TrendingDisplayItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 2 : 4;

  // Fetch trending spotlights from API
  const fetchTrendingSpotlights = () => {
    fetch(`/api/trending?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.spotlights) && data.spotlights.length > 0) {
          const activeSpotlights = data.spotlights.filter((s: any) => s.product && s.isActive !== false);
          const formatted: TrendingDisplayItem[] = activeSpotlights.map((s: any, idx: number) => ({
            id: s.id,
            product: s.product,
            customOfferTag: s.customOfferTag || "🔥 TODAY'S POPULAR TRENDING DEAL",
            offerBadge: s.offerBadge || (idx === 0 ? "CHEF PICK" : idx === 1 ? "BESTSELLER" : "HOT DEAL"),
            rank: s.priority || idx + 1,
          }));

          setTrendingItems(formatted);
        } else {
          setTrendingItems([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching trending spotlights:", err);
        setTrendingItems([]);
      });
  };

  useEffect(() => {
    fetchTrendingSpotlights();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchTrendingSpotlights();
      }
    };
    const handleFocus = () => {
      fetchTrendingSpotlights();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Group items into responsive pages (2 per page on phone, 4 on desktop)
  const pages: TrendingDisplayItem[][] = [];
  for (let i = 0; i < trendingItems.length; i += itemsPerPage) {
    pages.push(trendingItems.slice(i, i + itemsPerPage));
  }

  const totalPages = pages.length || 1;

  // Reset to page 0 if current page is out of bounds after resize
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  // Trigger animation effect on change
  const triggerSlide = (direction: "next" | "prev", newPage: number) => {
    setSlideDirection(direction);
    setIsTransitioning(true);
    setCurrentPage(newPage);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    const nextP = currentPage >= totalPages - 1 ? 0 : currentPage + 1;
    triggerSlide("next", nextP);
  };

  const handlePrev = () => {
    const prevP = currentPage <= 0 ? totalPages - 1 : currentPage - 1;
    triggerSlide("prev", prevP);
  };

  // Autoplay loop
  useEffect(() => {
    if (!isAutoPlay || totalPages <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages, currentPage]);

  return (
    <section id="trending" className="py-8 sm:py-16 bg-[#FFF8F2] relative overflow-hidden">
      
      {/* Live Moving Ticker Header */}
      <div className="w-full bg-[#0B1220] text-white py-1.5 sm:py-2.5 overflow-hidden shadow-md border-y border-white/10 mb-6 sm:mb-10">
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
              {activePromo ? (
                <span className="text-[#FF4D6D]">VIP COUPON: {activePromo.code}</span>
              ) : (
                <span className="text-[#FF4D6D]">25-MIN HOT THERMAL DISPATCH</span>
              )}
              <span className="text-gray-500">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Next / Prev Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-3 sm:gap-4">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-xs font-bold border border-orange-200">
              <Flame className="w-3.5 h-3.5 fill-[#FF6B35] animate-pulse" />
              <span>Live Spotlight • Today&apos;s Trending Offers</span>
            </div>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-[#0B1220] font-heading flex items-center gap-2 flex-wrap">
              <span>🔥 Popular & Trending Today</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                ★ 4-Dish Showcase
              </span>
            </h2>
            <p className="text-gray-500 text-[11px] sm:text-xs max-w-lg font-medium">
              Handpicked live favorites with exclusive today offers and express 25-min hot delivery.
            </p>
          </div>

          {/* Slider Controls (Prev / Next & Counter) */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white border border-gray-200 shadow-xs text-[11px] sm:text-xs font-black text-gray-800">
              <TrendingUp className="w-3 h-3 text-[#FF6B35]" />
              <span>Showcase {currentPage + 1} / {totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white hover:bg-orange-500 hover:text-white border border-gray-200 text-gray-800 flex items-center justify-center shadow-soft-card transition-all duration-300 hover:scale-105 active:scale-90 cursor-pointer group"
                title="Previous 4 Dishes"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0B1220] hover:bg-[#FF6B35] text-white flex items-center justify-center shadow-soft-card transition-all duration-300 hover:scale-105 active:scale-90 cursor-pointer group"
                title="Next 4 Dishes"
              >
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ULTRA-ANIMATED 4-CARD SHOWCASE CONTAINER (2-COL ON MOBILE) */}
        <div 
          className="relative overflow-hidden py-1 sm:py-3"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Animated Track Glide */}
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >
            {pages.map((pageDishes, pageIndex) => (
              <div 
                key={pageIndex} 
                className={`w-full shrink-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5.5 px-0.5 items-start transition-opacity duration-500 ${
                  currentPage === pageIndex ? "opacity-100" : "opacity-40"
                }`}
              >
                {pageDishes.map((item) => {
                  const dish = item.product;
                  if (!dish) return null;
                  const isFav = isInWishlist(dish.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => openQuickView(dish)}
                      className="rounded-[16px] sm:rounded-[24px] bg-white border border-gray-200/90 shadow-soft-card hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden select-none relative h-auto"
                    >
                      {/* 🔥 TOP PROMO OFFER TAG (ADMIN CUSTOM OFFER BADGE) */}
                      {item.customOfferTag && (
                        <div className="w-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#E65100] text-white px-2 py-1 text-xs font-bold tracking-wide text-center uppercase flex items-center justify-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-yellow-200 animate-pulse" />
                          <span className="truncate">{item.customOfferTag}</span>
                        </div>
                      )}

                      {/* DEDICATED HD FOOD PHOTO WINDOW (4:3 ASPECT RATIO) */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <img
                          src={dish.images[0]}
                          alt={dish.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        {/* Bottom Gradient for Badges */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />

                        {/* Floating Top-Left: Rank / Offer Badge */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1">
                          <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-xl text-[7.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md flex items-center gap-0.5 transition-transform group-hover:scale-105 ${
                            item.rank === 1 ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black" :
                            item.rank === 2 ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white" :
                            item.rank === 3 ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" :
                            "bg-[#0B1220]/85 text-white"
                          }`}>
                            {item.rank <= 3 && <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                            #{item.rank} {item.offerBadge || (item.rank === 1 ? "Top" : "Popular")}
                          </span>
                        </div>

                        {/* Floating Top-Right: Wishlist Heart */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(dish.id);
                          }}
                          className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 hover:bg-[#FF4D6D] backdrop-blur-md flex items-center justify-center text-white transition-all shadow-sm hover:scale-110 active:scale-90 cursor-pointer"
                          title={isFav ? "Favorited" : "Save Favorite"}
                        >
                          <Heart 
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                              isFav ? "fill-white text-white" : "text-white"
                            }`} 
                          />
                        </button>

                        {/* Floating Bottom-Left: Rating Pill */}
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 z-10">
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[8px] sm:text-[9.5px] font-black text-white flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#FFC94A] text-[#FFC94A]" />
                            {dish.rating || 4.9}
                          </span>
                        </div>

                        {/* Floating Bottom-Right: 100% Veg Pill */}
                        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 z-10">
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[7.5px] sm:text-[9px] font-black text-emerald-300 border border-emerald-400/40">
                            ● Veg
                          </span>
                        </div>
                      </div>

                      {/* STRUCTURED WHITE CARD BODY */}
                      <div className="p-2 sm:p-3 flex flex-col space-y-1.5 bg-white text-left">
                        
                        <div>
                          {/* Dish Name */}
                          <h3 className="text-[11px] sm:text-sm font-black text-gray-900 font-heading leading-tight line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                            {dish.name}
                          </h3>

                          {/* Category & Calories Subtext */}
                          <div className="text-[9px] sm:text-xs text-gray-500 font-medium flex items-center justify-between mt-0.5">
                            <span className="truncate max-w-[75px] sm:max-w-[120px] font-semibold text-gray-600">{dish.category}</span>
                            <span className="text-gray-400 font-bold">🔥 {dish.nutrition?.calories || 480} kcal</span>
                          </div>
                        </div>

                        {/* Price & Add to Cart Button */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <div>
                            <span className="text-xs sm:text-base font-black text-gray-900 font-heading">
                              ₹{dish.price}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dish, 1);
                            }}
                            className="py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-md sm:rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white text-[10px] sm:text-xs font-black shadow-glow flex items-center gap-1 transition-all group-hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Clean Page Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-8">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => triggerSlide(i > currentPage ? "next" : "prev", i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentPage === i 
                  ? "w-6 sm:w-8 bg-[#FF6B35] shadow-xs" 
                  : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              title={`Go to Showcase ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
