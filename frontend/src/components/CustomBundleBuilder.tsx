"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PRODUCTS, BUNDLE_PACK_SIZES } from "@/data/products";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Gift, 
  ArrowRight, 
  Search,
  Zap,
  Flame,
  Check,
  RotateCcw
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";

const CATEGORY_TABS = [
  { id: "all", label: "🍽️ All Dishes" },
  { id: "Burgers & Wraps", label: "🍔 Burgers" },
  { id: "Pizzas & Garlic Breads", label: "🍕 Pizzas" },
  { id: "Snacks & Chaat", label: "🍟 Snacks" },
  { id: "Chinese & Momos", label: "🥢 Chinese" },
  { id: "Biryani & North Indian", label: "🍚 Biryani" },
  { id: "Gujarati & Thalis", label: "🟡 Gujarati" },
  { id: "Shahi Desserts", label: "🍰 Desserts" },
];

export const CustomBundleBuilder: React.FC = () => {
  const { addToCart, showToast, setIsCartOpen } = useCart();
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; emoji: string }[]>([]);
  const [packSizes, setPackSizes] = useState<any[]>([...BUNDLE_PACK_SIZES]);
  const [packSizeIndex, setPackSizeIndex] = useState<number>(0);
  const targetPack = packSizes[packSizeIndex] || packSizes[0] || BUNDLE_PACK_SIZES[0];
  const targetCount = targetPack.count;

  const [selectedSlots, setSelectedSlots] = useState<Product[]>([]);
  const [pickerCategory, setPickerCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const fetchBundleData = () => {
    // 1. Fetch live dishes
    fetch(`/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});

    // 2. Fetch live categories
    fetch(`/api/categories?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoriesList(data.categories);
        }
      })
      .catch(() => {});

    // 3. Fetch live Feast Box percentage tiers
    fetch(`/api/bundles?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tiers) && data.tiers.length > 0) {
          setPackSizes(data.tiers);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBundleData();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchBundleData();
      }
    };
    const handleFocus = () => {
      fetchBundleData();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const dynamicCategoryTabs = useMemo(() => {
    if (categoriesList.length > 0) {
      return [
        { id: "all", label: "🍽️ All Dishes" },
        ...categoriesList.map((c) => ({
          id: c.name,
          label: `${c.emoji || "🍲"} ${c.name}`,
        })),
      ];
    }
    return CATEGORY_TABS;
  }, [categoriesList]);

  const addBowlToSlot = (product: Product) => {
    if (selectedSlots.length >= targetCount) {
      showToast(`Box is complete (${targetCount}/${targetCount})! Remove a dish to swap.`);
      return;
    }
    const newSlots = [...selectedSlots, product];
    setSelectedSlots(newSlots);

    if (newSlots.length === targetCount) {
      showToast(`🎉 Custom Feast Box Complete! ${targetPack.discountPercent}% Discount Unlocked.`);
      triggerConfetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    }
  };

  const removeBowlFromSlot = (index: number) => {
    setSelectedSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBox = () => {
    setSelectedSlots([]);
  };

  const fillWithBestsellers = () => {
    const bestsellers = productsList.filter((p) => p.featured || p.bestSeller);
    const pool = bestsellers.length > 0 ? bestsellers : productsList;
    const filled: Product[] = [];
    for (let i = 0; i < targetCount; i++) {
      filled.push(pool[i % pool.length]);
    }
    setSelectedSlots(filled);
    showToast("Filled box with Chef Bestsellers! 🍔🍕");
  };

  const rawSubtotal = selectedSlots.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = (rawSubtotal * targetPack.discountPercent) / 100;
  const bundlePrice = Math.max(0, rawSubtotal - bundleDiscount);
  const isComplete = selectedSlots.length === targetCount;

  const filteredDishes = useMemo(() => {
    return productsList.filter((product) => {
      if (pickerCategory !== "all") {
        const matchesCategory =
          product.category === pickerCategory ||
          product.category?.toLowerCase() === pickerCategory.toLowerCase();
        if (!matchesCategory) return false;
      }
      if (vegOnly && product.isVeg === false) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory) return false;
      }
      return true;
    });
  }, [productsList, pickerCategory, vegOnly, searchQuery]);

  const handleAddBundleToCart = () => {
    if (!isComplete) {
      showToast(`Please select ${targetCount - selectedSlots.length} more dishes to complete your box!`);
      return;
    }

    selectedSlots.forEach((product) => {
      addToCart(product, 1, true);
    });

    showToast(`Added ${targetCount}-Dish Custom Gourmet Box to your bag! 🎉`);
    setIsCartOpen(true);
  };

  return (
    <section id="bundle-builder" className="py-4 sm:py-16 bg-gradient-to-b from-[#FFF8F2] via-[#FFF5EC] to-[#FFF8F2] relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFC94A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-7">
        
        {/* Section Header - Clean & Compact */}
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/25 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#FF6B35]" />
            <span>CUSTOM FEAST STUDIO • UP TO 35% OFF</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
            Build Your Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D]">Feast Box</span>
          </h2>
          
          <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug line-clamp-1">
            Pick your favorite dishes, unlock tiered savings & get complimentary desserts.
          </p>

          {/* Pack Tier Selector Cards - 4 Compact Clean Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1.5">
            {packSizes.map((pack, idx) => {
              const isSelected = packSizeIndex === idx;
              return (
                <button
                  key={pack.count}
                  onClick={() => {
                    setPackSizeIndex(idx);
                    if (selectedSlots.length > pack.count) {
                      setSelectedSlots(selectedSlots.slice(0, pack.count));
                    }
                  }}
                  className={`relative overflow-hidden p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 text-left flex flex-col justify-between border cursor-pointer group active:scale-97 ${
                    isSelected
                      ? "bg-[#0B1220] text-white border-[#FF6B35] shadow-glow ring-2 ring-[#FF6B35]/60"
                      : "bg-white hover:bg-orange-50/40 text-gray-800 border-gray-200/90 shadow-2xs hover:border-[#FF6B35]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[8.5px] sm:text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-[#FF6B35] text-white shadow-2xs" : "bg-[#FFF0E5] text-[#FF6B35]"
                    }`}>
                      {pack.count} Dishes
                    </span>
                    <span className="text-[8.5px] sm:text-[9.5px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                      Save {pack.discountPercent}%
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold font-heading line-clamp-1 leading-snug block">
                      {pack.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Builder Layout: Left Visualizer + Right Dish Picker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
          
          {/* Left Column: Visualizer Box (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-2xl sm:rounded-[24px] bg-white p-2.5 sm:p-5 shadow-lg border border-gray-200/90 space-y-2 sm:space-y-3">
              
              {/* Box Header & Status */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#FFF0E5] text-[#FF6B35] flex items-center justify-center shrink-0">
                    <Package className="w-3 h-3" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-gray-900 font-heading">
                      {targetPack.title}
                    </h3>
                    <span className="text-[9.5px] text-gray-400 font-bold">
                      ({selectedSlots.length}/{targetCount})
                    </span>
                  </div>
                </div>

                {selectedSlots.length > 0 && (
                  <button
                    onClick={clearBox}
                    className="text-[9.5px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" /> Clear
                  </button>
                )}
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-0.5">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] rounded-full transition-all duration-300"
                    style={{ width: `${(selectedSlots.length / targetCount) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-gray-400">
                  <span>{selectedSlots.length === 0 ? "Empty Box" : `${selectedSlots.length}/${targetCount} Selected`}</span>
                  <span className={isComplete ? "text-emerald-600 font-black" : "text-[#FF6B35]"}>
                    {isComplete ? "Box Ready to Ship! 🎁" : `Add ${targetCount - selectedSlots.length} more`}
                  </span>
                </div>
              </div>

              {/* Slots Mini Bento Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {[...Array(targetCount)].map((_, idx) => {
                  const filledProduct = selectedSlots[idx];
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center justify-center p-0.5 overflow-hidden group ${
                        filledProduct
                          ? "border-[#FF6B35]/50 bg-[#FFF0E5] shadow-2xs"
                          : "border-dashed border-gray-200 bg-gray-50/60"
                      }`}
                    >
                      {filledProduct ? (
                        <>
                          <img
                            src={filledProduct.images[0]}
                            alt={filledProduct.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeBowlFromSlot(idx)}
                            className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] shadow cursor-pointer transition-colors"
                            title="Remove dish"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-0.5 left-0.5 right-0.5 bg-black/70 backdrop-blur-xs text-[6.5px] text-white font-black truncate px-0.5 rounded text-center">
                            {filledProduct.name.split(" ")[0]}
                          </span>
                        </>
                      ) : (
                        <div className="text-center text-gray-300">
                          <span className="text-[8.5px] font-black">#{idx + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 1-Click Auto Fill Mini Pill */}
              {selectedSlots.length < targetCount && (
                <button
                  onClick={fillWithBestsellers}
                  className="w-full py-1.5 px-2 rounded-lg border border-dashed border-[#FF6B35]/40 text-[#FF6B35] bg-[#FFF0E5]/50 hover:bg-[#FFF0E5] text-[9.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#FF6B35]" />
                  <span>1-Click Auto-Fill Bestsellers</span>
                </button>
              )}

              {/* Compact 1-Line Perks Strip */}
              <div className="rounded-lg bg-[#EAF9EF] px-2 py-1 border border-[#3ECF6E]/30 flex items-center justify-between text-[8.5px] font-bold text-[#2E7D32]">
                <span className="flex items-center gap-1 truncate font-black">
                  <Gift className="w-2.5 h-2.5 text-[#3ECF6E] shrink-0" />
                  <span>Free Perks:</span>
                  <span className="font-medium text-emerald-700">Kesar Lassi • 18% Off • Pod Delivery</span>
                </span>
                <CheckCircle2 className="w-2.5 h-2.5 text-[#3ECF6E] shrink-0 ml-1" />
              </div>

              {/* Price & Add to Bag (Compact Row Layout) */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[8px] text-gray-400 font-bold block uppercase leading-none">
                    Total Feast Price:
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base sm:text-xl font-black text-gray-900 font-heading">
                      ₹{Math.round(isComplete ? bundlePrice : rawSubtotal * (1 - targetPack.discountPercent / 100))}
                    </span>
                    <span className="text-[8px] font-black text-[#FF6B35] bg-[#FFF0E5] px-1 py-0.2 rounded border border-[#FF6B35]/20">
                      -{targetPack.discountPercent}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  disabled={!isComplete}
                  className={`py-2 px-3.5 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                    isComplete
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white shadow-glow active:scale-95"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {isComplete ? (
                    <>
                      <span>Add to Bag</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  ) : (
                    <span>Add {targetCount - selectedSlots.length} More</span>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Clean Dish Picker with Category Tabs & Search */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
            
            {/* Filter & Search Bar - Compact Inline Header */}
            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-6 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] sm:text-xs font-bold text-gray-900 focus:outline-none focus:ring-1.5 focus:ring-[#FF6B35]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Pure Veg Toggle - Compact Pill */}
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    vegOnly
                      ? "bg-[#2E7D32] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${vegOnly ? "bg-white" : "bg-green-600"}`} />
                  <span>Veg Only</span>
                </button>

              </div>

              {/* Category Pills Track */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                {dynamicCategoryTabs.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPickerCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      pickerCategory === cat.id
                        ? "bg-[#0B1220] text-white font-black shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35] border border-gray-200/70"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Grid - Compact Sleek List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredDishes.map((product) => {
                const countInBox = selectedSlots.filter((p) => p.id === product.id).length;
                const isOutOfStock = product.inStock === false;

                return (
                  <div
                    key={product.id}
                    className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200/90 hover:border-[#FF6B35]/40 shadow-2xs hover:shadow-glow transition-all flex items-center gap-2.5 group"
                  >
                    {/* Food Photo */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full h-full object-cover transform transition-transform duration-300 ${
                          isOutOfStock ? "grayscale opacity-75" : "group-hover:scale-105"
                        }`}
                      />
                      {countInBox > 0 && (
                        <span className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded bg-[#FF6B35] text-white text-[7.5px] font-black">
                          {countInBox} in box
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-bold text-[#FF6B35] block uppercase tracking-wider truncate">
                        {product.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate leading-tight group-hover:text-[#FF6B35] transition-colors" title={product.name}>
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-600 font-semibold mt-0.5">
                        ₹{product.price} {product.nutrition?.calories ? `• ${product.nutrition.calories} kcal` : ""}
                      </p>
                    </div>

                    {/* Action Button (Standard Brand Orange CTA) */}
                    <div className="shrink-0">
                      {isOutOfStock ? (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          onClick={() => addBowlToSlot(product)}
                          disabled={selectedSlots.length >= targetCount}
                          className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            selectedSlots.length >= targetCount
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-[#FF6B35] hover:bg-[#FF7D20] text-white shadow-xs active:scale-95"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredDishes.length === 0 && (
              <div className="p-6 rounded-xl bg-white border border-gray-200 text-center space-y-1.5">
                <p className="text-xs font-bold text-gray-500">No dishes match your filter criteria.</p>
                <button
                  onClick={() => { setPickerCategory("all"); setVegOnly(false); setSearchQuery(""); }}
                  className="text-xs font-black text-[#FF6B35] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
