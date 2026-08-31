"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SideMenuDrawer } from "@/components/SideMenuDrawer";
import { PRODUCTS, CATEGORIES, CATEGORY_EMOJIS, DIETARY_FILTERS } from "@/data/products";
import { Product } from "@/types/product";
import { Sparkles, Search, SlidersHorizontal, ArrowLeft, ArrowRight, RefreshCw, X, RotateCcw, Zap, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Layers, Grid, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface MenuCategoryConfig {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  bgGradient: string;
  borderColor: string;
  accent: string;
}

const DEFAULT_CATEGORY_STYLES: Record<string, { bgGradient: string; borderColor: string; subtitle: string; accent: string }> = {
  "Burgers & Wraps": { bgGradient: "from-[#FFF0E5] to-[#FFE4D6]", borderColor: "border-[#FF6B35]/40", subtitle: "Smash & Crispy", accent: "#FF6B35" },
  "Pizzas & Garlic Breads": { bgGradient: "from-[#FFE8EC] to-[#FFD5DC]", borderColor: "border-[#FF4D6D]/40", subtitle: "Wood-Fired Crust", accent: "#FF4D6D" },
  "Snacks & Chaat": { bgGradient: "from-[#FFF4E5] to-[#FFE6CC]", borderColor: "border-[#FF8A00]/40", subtitle: "Crispy Peri-Peri", accent: "#FF8A00" },
  "Chinese & Momos": { bgGradient: "from-[#FFF2EB] to-[#FCD1B8]", borderColor: "border-[#E85620]/40", subtitle: "Wok & Steamed", accent: "#E85620" },
  "Biryani & North Indian": { bgGradient: "from-[#FFFBF5] to-[#EFE1CE]", borderColor: "border-[#D4A373]/40", subtitle: "Slow Cooked Dum", accent: "#D4A373" },
  "Gujarati & Thalis": { bgGradient: "from-[#FFF9E6] to-[#FFEAB3]", borderColor: "border-[#FFC94A]/50", subtitle: "Heritage Thali", accent: "#FFC94A" },
  "Shahi Desserts": { bgGradient: "from-[#FFF8F2] to-[#F5D8BF]", borderColor: "border-[#E0A96D]/40", subtitle: "Kesar & Malai", accent: "#E0A96D" },
};

export default function MenuPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [vegPreference, setVegPreference] = useState<"all" | "veg" | "nonveg">("all");
  const [quickBudget, setQuickBudget] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<"slide" | "grid">("slide");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const itemsPerPage = 8;

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategory = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    const clientWidth = categoryScrollRef.current.clientWidth;
    const scrollAmount = Math.max(260, clientWidth * 0.65);
    categoryScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Fetch live products and categories from backend database
  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products?t=${Date.now()}`),
        fetch(`/api/categories?t=${Date.now()}`),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
        setProductsList(prodData.products);
      }
      if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
        setCategoriesList(catData.categories);
      }
    } catch (err) {
      console.error("Error fetching live menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();

    // Auto-refresh when menu changes in Admin or when user focuses window
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchProductsAndCategories();
      }
    };
    const handleFocus = () => {
      fetchProductsAndCategories();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleQuickBudget = (price: number) => {
    if (quickBudget === price) {
      setQuickBudget(null);
      setMaxPrice(600);
    } else {
      setQuickBudget(price);
      setMaxPrice(price);
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Items": productsList.length };
    productsList.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
        const lower = p.category.toLowerCase();
        if (lower !== p.category) {
          counts[lower] = (counts[lower] || 0) + 1;
        }
      }
    });
    return counts;
  }, [productsList]);

  // Build full category cards list with luxury presets
  const activeCategories: MenuCategoryConfig[] = useMemo(() => {
    const allOption: MenuCategoryConfig = {
      id: "All Items",
      name: "All Dishes",
      emoji: "🍽️",
      subtitle: "All Flavors",
      bgGradient: "from-[#FFF2E8] to-[#FFE5D3]",
      borderColor: "border-[#FF6B35]/40",
      accent: "#FF6B35",
    };

    if (categoriesList.length > 0) {
      const dynamic = categoriesList
        .filter((c: any) => c.isActive !== false)
        .map((c: any) => {
          const fallback = DEFAULT_CATEGORY_STYLES[c.name] || {
            bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
            borderColor: "border-[#FF6B35]/40",
            subtitle: "Chef Special",
            accent: "#FF6B35",
          };
          return {
            id: c.name,
            name: c.name,
            emoji: c.emoji || CATEGORY_EMOJIS[c.name] || "🍲",
            subtitle: c.subtitle || fallback.subtitle,
            bgGradient: c.bgGradient || fallback.bgGradient,
            borderColor: c.borderColor || fallback.borderColor,
            accent: c.accent || fallback.accent,
          };
        });
      return [allOption, ...dynamic];
    }

    const fallbackCats = CATEGORIES.map((cat) => {
      const def = DEFAULT_CATEGORY_STYLES[cat] || {
        bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
        borderColor: "border-[#FF6B35]/40",
        subtitle: "Chef Special",
        accent: "#FF6B35",
      };
      return {
        id: cat,
        name: cat,
        emoji: CATEGORY_EMOJIS[cat] || "🍲",
        subtitle: def.subtitle,
        bgGradient: def.bgGradient,
        borderColor: def.borderColor,
        accent: def.accent,
      };
    });

    return [allOption, ...fallbackCats];
  }, [categoriesList]);

  const filteredProducts = productsList.filter((product) => {
    // Category match
    const matchesCategory =
      selectedCategory === "All Items" ||
      product.category === selectedCategory ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      product.name.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.cuisine?.toLowerCase().includes(q) ||
      product.tags.some((t) => t.toLowerCase().includes(q)) ||
      product.shortDescription.toLowerCase().includes(q);

    // Dietary match
    const matchesDiet =
      selectedDiet === "All" || (product.dietary && product.dietary.includes(selectedDiet as any));

    // Veg / Non-Veg match
    if (vegPreference === "veg" && product.isVeg === false) return false;
    if (vegPreference === "nonveg" && product.isVeg !== false) return false;

    // Max Price
    if (product.price > maxPrice) return false;

    return matchesCategory && matchesSearch && matchesDiet;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const currentDishes = useMemo(() => {
    if (displayMode === "slide") {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredProducts.slice(start, start + itemsPerPage);
    }
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, displayMode, currentPage, visibleCount, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSlideDirection("next");
      setCurrentPage((prev) => prev + 1);
      const el = document.getElementById("menu-grid-items");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setSlideDirection("prev");
      setCurrentPage((prev) => prev - 1);
      const el = document.getElementById("menu-grid-items");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleGoToPage = (pageNum: number) => {
    setSlideDirection(pageNum > currentPage ? "next" : "prev");
    setCurrentPage(pageNum);
    const el = document.getElementById("menu-grid-items");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProducts.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredProducts.length);
  };

  const handleCollapse = () => {
    setVisibleCount(8);
    const el = document.getElementById("menu-grid-items");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-20 sm:pt-28 pb-6 sm:pb-14 bg-gradient-to-b from-[#FFF0E5] to-[#FFF8F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-2.5 sm:space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-white text-[#FF6B35] text-[10px] sm:text-xs font-black shadow-xs border border-[#FF6B35]/20">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>🔥 BURGERS • PIZZAS • SNACKS • CHINESE • BIRYANI • CHAI & JUICES</span>
          </div>
          
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            Order Everything You Love
          </h1>
          
          <p className="text-gray-600 text-xs sm:text-base max-w-2xl mx-auto line-clamp-1 sm:line-clamp-none">
            Smash Burgers, Cheese Burst Pizzas, Peri Peri Fries, Hakka Noodles, Sizzling Dim Sums, Royal Biryanis, Kulhad Chai, and Choco Lava.
          </p>

          {/* Search Bar & 3-Way Veg Filter */}
          <div className="max-w-3xl mx-auto pt-3 sm:pt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Burger, Pizza, Fries, Dim Sums, Biryani, Coffee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 sm:py-3.5 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-xs"
              />
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3.5 top-2.5 sm:top-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 sm:top-3.5 w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 text-xs cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick 3-Way Veg / Non-Veg Filter */}
            <div className="flex items-center justify-center bg-white p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-gray-200 shadow-xs self-center">
              <button
                onClick={() => setVegPreference("all")}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                  vegPreference === "all" ? "bg-[#12121A] text-white" : "text-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegPreference("veg")}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  vegPreference === "veg" ? "bg-[#2E7D32] text-white" : "text-gray-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Veg</span>
              </button>
              <button
                onClick={() => setVegPreference("nonveg")}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  vegPreference === "nonveg" ? "bg-[#D32F2F] text-white" : "text-gray-600"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Quick Budget Fast-Pills (1-Line Horizontal Scroll on Mobile) */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1 pt-1 flex-nowrap">
            <span className="shrink-0 text-[9.5px] sm:text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FF6B35]" /> Quick Deals:
            </span>

            <button
              onClick={() => { setQuickBudget(199); setMaxPrice(199); }}
              className={`shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                quickBudget === 199
                  ? "bg-[#FF6B35] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#FF6B35]/40"
              }`}
            >
              ⚡ Under ₹199 (Fries, Chai, Juice, Dhokla)
            </button>

            <button
              onClick={() => { setQuickBudget(299); setMaxPrice(299); }}
              className={`shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                quickBudget === 299
                  ? "bg-[#FF6B35] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#FF6B35]/40"
              }`}
            >
              🔥 Under ₹299 (Burgers, Noodles, Dosa, Kathi Wraps)
            </button>

            <button
              onClick={() => handleQuickBudget(399)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                quickBudget === 399
                  ? "bg-[#FF6B35] text-white shadow-sm scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#FF6B35]/40"
              }`}
            >
              👑 Under ₹399 (Pizzas, Dal Makhani, Chilli Paneer)
            </button>

            {quickBudget && (
              <button
                onClick={() => { setQuickBudget(null); setMaxPrice(600); }}
                className="text-[11px] font-bold text-gray-400 hover:text-[#FF6B35] ml-1 cursor-pointer"
              >
                Clear Budget
              </button>
            )}
          </div>

          {/* Dietary Filters */}
          <div className="flex gap-1.5 justify-center flex-wrap pt-2">
            {["All", "Pure Veg", "Non-Veg", "Jain Friendly", "Desi Ghee Special", "Chef Special", "High Protein"].map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDiet === diet
                    ? "bg-[#FF6B35] text-white shadow-glow"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-xs"
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation Carousel with Floating Arrows & Snap Scrolling */}
      <section className="py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full sticky top-18 z-30">
        <div className="relative group/carousel">
          {/* Floating Left Arrow Button */}
          <button
            onClick={() => scrollCategory("left")}
            aria-label="Scroll categories left"
            className="flex absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200/90 items-center justify-center text-gray-700 hover:text-[#FF6B35] hover:scale-115 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Floating Right Arrow Button */}
          <button
            onClick={() => scrollCategory("right")}
            aria-label="Scroll categories right"
            className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200/90 items-center justify-center text-gray-700 hover:text-[#FF6B35] hover:scale-115 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Horizontal Scroll Container (Exact 9 whole cards in 1 viewport on desktop, smooth scroll for remaining) */}
          <div
            ref={categoryScrollRef}
            className="category-scroll-container w-full flex items-stretch gap-2 overflow-x-auto pb-2.5 pt-1.5 scroll-smooth snap-x snap-mandatory px-0.5"
          >
            {activeCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name || (selectedCategory === "All Items" && cat.id === "All Items");
              const count = categoryCounts[cat.name] || categoryCounts[cat.id] || (cat.id === "All Items" ? productsList.length : 0);

              return (
                <button
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.id === "All Items" ? "All Items" : cat.name)}
                  className={`group category-box-card shrink-0 snap-start w-[calc((100%-16px)/3)] sm:w-[calc((100%-24px)/4)] md:w-[calc((100%-40px)/6)] lg:w-[calc((100%-64px)/9)] xl:w-[calc((100%-64px)/9)] min-w-[90px] p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center cursor-pointer relative bg-gradient-to-b ${cat.bgGradient} ${cat.borderColor} ${
                    isSelected
                      ? "ring-2 ring-[#FF6B35] shadow-lg shadow-[#FF6B35]/25 is-active scale-102 bg-white z-10 font-black"
                      : "hover:border-[#FF6B35]/60 hover:shadow-sm"
                  }`}
                >
                  {/* Active Indicator Top Glow Dot */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35] shadow-glow animate-pulse" />
                  )}

                  {/* Animated Circular Icon Container */}
                  <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-black/5 flex items-center justify-center text-sm sm:text-base group-hover:scale-120 group-hover:rotate-6 transition-all duration-300 mb-1 shrink-0">
                    {cat.emoji}
                  </div>

                  {/* Category Name (2-line wrapping so name is readable without cutoffs) */}
                  <h4 className={`font-black text-[10px] sm:text-[11px] leading-tight text-center line-clamp-2 w-full px-0.5 min-h-[26px] flex items-center justify-center transition-colors ${
                    isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-[#FF6B35]"
                  }`}>
                    {cat.name}
                  </h4>

                  {/* Subtitle */}
                  <p className="text-[8px] text-gray-500 font-bold truncate mt-0.5 hidden sm:block w-full px-0.5">
                    {cat.subtitle}
                  </p>

                  {/* Active Count Pill */}
                  <span className={`text-[8.5px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-full mt-1 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#FF6B35] text-white shadow-xs"
                      : "bg-white/95 text-gray-600 group-hover:bg-[#FF6B35] group-hover:text-white"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-gray-500">
            Showing <strong className="text-gray-900 font-black">{filteredProducts.length}</strong> delicious creations in {selectedCategory}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchProductsAndCategories}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#FF6B35] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#FF6B35]" /> Refresh Menu
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B35] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8" id="menu-grid-items">
            {/* Animated Dishes Grid with Smooth Side Slide Effect */}
            <div
              key={`menu-page-grid-${selectedCategory}-${displayMode}-${currentPage}-${visibleCount}`}
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 animate-in fade-in-50 ${
                slideDirection === "next" ? "slide-in-from-right-6" : "slide-in-from-left-6"
              } duration-400`}
            >
              {currentDishes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ================= ULTRA-LUXURY "NEXT DISHES" & SLIDE CONTROLLER HUB ================= */}
            <div className="pt-6 sm:pt-10 pb-4 sm:pb-6 flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              
              {/* Primary Interactive Controller Capsule */}
              <div className="relative p-2 sm:p-3 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-2xl border border-orange-200/80 shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 max-w-2xl w-full">
                
                {/* 1. Previous Slide Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-full text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    currentPage === 1
                      ? "bg-gray-100/70 text-gray-300 border-gray-200/40 cursor-not-allowed opacity-40"
                      : "bg-white text-gray-700 hover:text-[#FF6B35] border-gray-200 hover:border-[#FF6B35]/40 shadow-xs hover:shadow-sm active:scale-95"
                  }`}
                  title="Previous 8 Dishes"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* 2. Interactive Numbered Page Capsules */}
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-xl sm:rounded-full bg-orange-50/80 border border-orange-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === currentPage;
                    const startIdx = (pageNum - 1) * itemsPerPage + 1;
                    const endIdx = Math.min(pageNum * itemsPerPage, filteredProducts.length);

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handleGoToPage(pageNum)}
                        className={`relative group w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-full text-[11px] sm:text-xs font-black transition-all duration-300 cursor-pointer flex items-center justify-center ${
                          isCurrent
                            ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white shadow-glow scale-108"
                            : "bg-white text-gray-700 hover:text-[#FF6B35] border border-orange-200/40 hover:shadow-xs"
                        }`}
                        title={`Page ${pageNum}: Dishes ${startIdx}-${endIdx}`}
                      >
                        <span>{pageNum}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Primary Next Dishes Action Button */}
                {currentPage < totalPages ? (
                  <button
                    onClick={handleNextPage}
                    className="relative group overflow-hidden w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] text-white font-black text-xs sm:text-sm shadow-glow hover:shadow-glow-lg hover:scale-103 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer"
                  >
                    {/* Shimmer Light Reflection Sweep */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
                    <span>Next Dishes</span>

                    <span className="bg-white/25 backdrop-blur-md px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black text-white">
                      +{Math.min(itemsPerPage, filteredProducts.length - currentPage * itemsPerPage)} More
                    </span>

                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleGoToPage(1)}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full bg-gray-900 hover:bg-black text-white hover:text-orange-300 font-black text-xs sm:text-sm shadow-xs hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                    <span>Back to Start (Page 1)</span>
                  </button>
                )}

              </div>

              {/* Secondary Navigation & Side Drawer Trigger Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                
                {/* Live Progress Pill */}
                <div className="px-4 py-2 rounded-full bg-white border border-gray-200/90 shadow-xs flex items-center gap-2 text-xs font-bold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> Dishes
                  </span>
                </div>

                {/* Open Side Drawer Button */}
                <button
                  onClick={() => setIsSideMenuOpen(true)}
                  className="px-5 py-2 rounded-full bg-white hover:bg-orange-50 text-[#FF6B35] border border-orange-200 font-black text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>Open Full Side Menu ({filteredProducts.length})</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </button>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200 shadow-soft-card max-w-md mx-auto space-y-3">
            <span className="text-5xl block mb-2">🔍</span>
            <h3 className="text-lg font-black text-gray-900 font-heading">No dishes matched your search</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Try searching for &ldquo;Smash Burger&rdquo;, &ldquo;Margherita&rdquo;, &ldquo;Fries&rdquo;, &ldquo;Cold Coffee&rdquo;, or &ldquo;Biryani&rdquo;
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Items");
                setSearchQuery("");
                setSelectedDiet("All");
                setVegPreference("all");
                setQuickBudget(null);
                setMaxPrice(600);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] text-white font-black text-xs shadow-glow hover:bg-[#E85620] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* Slide-Over Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        products={productsList}
        categories={categoriesList.map((c) => ({ id: c.name || c.id, name: c.name, emoji: c.emoji || "🍽️" }))}
      />

      <Footer />
    </main>
  );
}
