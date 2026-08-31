"use client";

import React, { useState, useEffect } from "react";
import { Award, ChefHat, Eye, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ChefSpecialConfig } from "@/backend/types";

export const ChefSpecialSection: React.FC = () => {
  const { openQuickView, addToCart, setIsCartOpen } = useCart();
  const [chefSpecial, setChefSpecial] = useState<ChefSpecialConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const fetchChefSpecial = () => {
    fetch(`/api/chef-special?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.chefSpecial) {
          setChefSpecial(data.chefSpecial);
          setActiveImageIdx(0);
        } else {
          setChefSpecial(null);
        }
      })
      .catch((err) => console.error("Error fetching chef special:", err))
      .finally(() => setLoading(false));
  };

  // 1. Initial Load & Storage Listeners
  useEffect(() => {
    fetchChefSpecial();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_chef_special_updated" || e.key === "foodeat_menu_last_updated") {
        fetchChefSpecial();
      }
    };
    const handleFocus = () => {
      fetchChefSpecial();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 2. Compute images array unconditionally
  const product = chefSpecial?.product;
  const allImages: string[] = (chefSpecial?.customImages && chefSpecial.customImages.length > 0)
    ? chefSpecial.customImages
    : (chefSpecial?.customImage ? [chefSpecial.customImage] : (product?.images || ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop"]));

  const imagesCount = allImages.length;

  // 3. Smooth Auto-Cycle Animation Hook (every 3.8s)
  useEffect(() => {
    if (!chefSpecial?.isActive || imagesCount <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % imagesCount);
    }, 3800);
    return () => clearInterval(interval);
  }, [imagesCount, chefSpecial?.isActive]);

  // If deleted or disabled by admin, hide cleanly
  if (loading || !chefSpecial || !chefSpecial.isActive) {
    return null;
  }

  const displayTitle = chefSpecial.customTitle || product?.name || "Royal Chef Special of the Month";
  const displayDesc = chefSpecial.customDescription || product?.fullDescription || product?.shortDescription || "Curated by Master Ustads of Royal Rasoi using pure cow desi ghee and stone-ground spices.";
  const displayPrice = chefSpecial.customPrice || product?.price || 549;

  const handleOrderSpecial = () => {
    if (product) {
      addToCart(product, 1, true);
      setIsCartOpen(true);
    } else {
      const el = document.getElementById("menu");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickViewSpecial = () => {
    if (product) {
      openQuickView(product);
    }
  };

  return (
    <section className="py-6 sm:py-16 bg-gradient-to-b from-[#FFF9F5] via-[#FFF3EB] to-[#FFF9F5] relative overflow-hidden">
      
      {/* Ambient Warm Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[750px] h-[350px] sm:h-[750px] bg-gradient-to-tr from-[#FF6B35]/15 via-[#FF8A00]/10 to-[#FF4D6D]/15 rounded-full filter blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[22px] sm:rounded-[44px] bg-white/90 backdrop-blur-2xl border border-white/90 p-3.5 sm:p-10 lg:p-12 shadow-[0_15px_50px_rgba(255,107,53,0.08)]">
          
          {/* Side-by-Side Grid (7 Cols Text Left, 5 Cols Image Right on Mobile) */}
          <div className="grid grid-cols-12 gap-3 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left: Content Hierarchy (7 cols on mobile, 7 cols on desktop) */}
            <div className="col-span-7 sm:col-span-7 space-y-1.5 sm:space-y-4 text-left">
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-50 text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/20">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6B35]" />
                <span className="truncate max-w-[180px] sm:max-w-none">{chefSpecial.badgeText || "👑 ROYAL CHEF SPECIAL"}</span>
              </div>

              <h2 className="text-sm sm:text-2xl lg:text-4xl font-black text-[#0B1220] font-heading leading-tight tracking-tight line-clamp-2 sm:line-clamp-none">
                {displayTitle}
              </h2>

              <p className="text-[10px] sm:text-sm md:text-base text-gray-600 leading-snug line-clamp-2 sm:line-clamp-none">
                {displayDesc}
              </p>

              {/* Heritage & Craft Tags (Compact Micro Pills) */}
              <div className="flex items-center gap-1 sm:gap-2 pt-1 border-t border-gray-100 flex-wrap">
                <div className="bg-[#FFF8F2] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-xl border border-[#FF6B35]/15 text-left">
                  <span className="text-[7.5px] sm:text-[9px] text-gray-400 block font-bold uppercase">Heritage</span>
                  <span className="text-[9px] sm:text-xs font-black text-[#0B1220] truncate block">{chefSpecial.heritageTag || "Awadh Royals"}</span>
                </div>
                <div className="bg-[#FFF8F2] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-xl border border-[#FF6B35]/15 text-left">
                  <span className="text-[7.5px] sm:text-[9px] text-gray-400 block font-bold uppercase">Cooking</span>
                  <span className="text-[9px] sm:text-xs font-black text-[#FF6B35] truncate block">{chefSpecial.slowCookingTag || "4-Hr Dum"}</span>
                </div>
                <div className="bg-[#FFF8F2] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-xl border border-[#FF6B35]/15 text-left hidden sm:block">
                  <span className="text-[7.5px] sm:text-[9px] text-gray-400 block font-bold uppercase">Daily Batch</span>
                  <span className="text-[9px] sm:text-xs font-black text-[#3ECF6E] truncate block">{chefSpecial.dailyBatchTag || "Only 40 Handis"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1.5 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-3">
                <button
                  onClick={handleOrderSpecial}
                  className="relative overflow-hidden px-3 py-1.5 sm:px-7 sm:py-3.5 rounded-lg sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] sm:text-sm shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer"
                >
                  <ChefHat className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span>Reserve • ₹{displayPrice}</span>
                </button>

                {product && (
                  <button
                    onClick={handleQuickViewSpecial}
                    className="px-2.5 py-1 sm:px-5 sm:py-3.5 rounded-lg sm:rounded-2xl bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] font-black text-[10px] sm:text-sm border border-gray-200 hover:border-[#FF6B35]/40 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3 h-3 text-[#FF6B35]" />
                    <span>Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Pure 100% Clean Animated Dish Showcase (5 cols on mobile, 5 cols on desktop) */}
            <div className="col-span-5 sm:col-span-5 flex items-center justify-center">
              
              {/* Pure Food Showcase Card with Smooth Dissolve Animation */}
              <div 
                onClick={handleQuickViewSpecial}
                className="relative w-full max-w-[145px] sm:max-w-[320px] aspect-square rounded-[18px] sm:rounded-[36px] overflow-hidden shadow-soft-card border-2 sm:border-4 border-white bg-white group/card hover:shadow-glow transition-all duration-500 cursor-pointer animate-float-slow"
              >
                {/* Stacked Animated Image Layers */}
                {allImages.map((img, idx) => {
                  const isCurrent = idx === activeImageIdx;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        isCurrent 
                          ? "opacity-100 scale-100 z-10 pointer-events-auto" 
                          : "opacity-0 scale-105 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${displayTitle} View ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                      />
                    </div>
                  );
                })}

                {/* Floating Top-Left Chef Tag */}
                <div className="absolute top-1.5 left-1.5 z-20">
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[7.5px] sm:text-[9px] font-black flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2 text-yellow-300" />
                    <span>Chef Pick</span>
                  </span>
                </div>

                {/* Minimal Hover Quick Inspect Tooltip */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-gray-900 text-[8.5px] sm:text-[10px] font-black shadow-md border border-gray-100 flex items-center gap-1 whitespace-nowrap">
                    <Eye className="w-2.5 h-2.5 text-[#FF6B35]" />
                    <span>View</span>
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
