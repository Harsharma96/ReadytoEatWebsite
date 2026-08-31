"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PRODUCTS, CATEGORIES, CATEGORY_EMOJIS, DIETARY_FILTERS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SideMenuDrawer } from "@/components/SideMenuDrawer";
import { 
  SlidersHorizontal, 
  Sparkles, 
  Search, 
  X, 
  Heart, 
  RotateCcw, 
  Flame, 
  Clock, 
  Zap, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Check,
  Layers,
  Grid,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

const QUICK_TRENDING_CHIPS = [
  { label: "🍔 Smash Burgers", query: "Burger" },
  { label: "🍕 Cheese Burst", query: "Pizza" },
  { label: "🍟 Peri Fries", query: "Fries" },
  { label: "🥢 Hakka Noodles", query: "Noodles" },
  { label: "🥟 Dim Sums", query: "Dim Sum" },
  { label: "🍚 Awadhi Biryani", query: "Biryani" },
  { label: "🟡 Gujarati Thali", query: "Thali" },
  { label: "☕ Kulhad Chai", query: "Chai" },
  { label: "🍰 Choco Lava", query: "Choco Lava" },
];

interface MenuCategoryConfig {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  bgGradient: string;
  borderColor: string;
  accent: string;
}

const MENU_CATEGORIES_CONFIG: MenuCategoryConfig[] = [
  {
    id: "All Items",
    name: "All Dishes",
    emoji: "🍽️",
    subtitle: "All Flavors",
    bgGradient: "from-[#FFF2E8] to-[#FFE5D3]",
    borderColor: "border-[#FF6B35]/40",
    accent: "#FF6B35",
  },
  {
    id: "Burgers & Wraps",
    name: "Burgers & Wraps",
    emoji: "🍔",
    subtitle: "Smash & Crispy",
    bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
    borderColor: "border-[#FF6B35]/40",
    accent: "#FF6B35",
  },
  {
    id: "Pizzas & Garlic Breads",
    name: "Pizzas & Breads",
    emoji: "🍕",
    subtitle: "Cheese Burst",
    bgGradient: "from-[#FFE8EC] to-[#FFD5DC]",
    borderColor: "border-[#FF4D6D]/40",
    accent: "#FF4D6D",
  },
  {
    id: "Snacks & Chaat",
    name: "Snacks & Chaat",
    emoji: "🍟",
    subtitle: "Peri Fries & Chaat",
    bgGradient: "from-[#FFF4E5] to-[#FFE6CC]",
    borderColor: "border-[#FF8A00]/40",
    accent: "#FF8A00",
  },
  {
    id: "Chinese & Momos",
    name: "Chinese & Momos",
    emoji: "🥢",
    subtitle: "Noodles & Dim Sum",
    bgGradient: "from-[#FFF2EB] to-[#FCD1B8]",
    borderColor: "border-[#E85620]/40",
    accent: "#E85620",
  },
  {
    id: "Biryani & North Indian",
    name: "Biryani & North",
    emoji: "🍚",
    subtitle: "Dum & Butter Curry",
    bgGradient: "from-[#FFFBF5] to-[#EFE1CE]",
    borderColor: "border-[#D4A373]/40",
    accent: "#D4A373",
  },
  {
    id: "Gujarati & Thalis",
    name: "Gujarati & Thalis",
    emoji: "🟡",
    subtitle: "Undhiyu & Dhokla",
    bgGradient: "from-[#FFF9E6] to-[#FFEAB3]",
    borderColor: "border-[#FFC94A]/50",
    accent: "#FFC94A",
  },
  {
    id: "South Indian",
    name: "South Indian",
    emoji: "🥥",
    subtitle: "Ghee Dosa & Idli",
    bgGradient: "from-[#EAF9EF] to-[#D5F5E0]",
    borderColor: "border-[#3ECF6E]/40",
    accent: "#3ECF6E",
  },
  {
    id: "Chai, Coffee & Juices",
    name: "Chai & Juices",
    emoji: "☕",
    subtitle: "Kulhad & Shakes",
    bgGradient: "from-[#F0FDF4] to-[#DCFCE7]",
    borderColor: "border-[#22C55E]/40",
    accent: "#22C55E",
  },
  {
    id: "Desserts & Shakes",
    name: "Shahi Desserts",
    emoji: "🍰",
    subtitle: "Choco Lava & Mithai",
    bgGradient: "from-[#FFF8F2] to-[#F5D8BF]",
    borderColor: "border-[#E0A96D]/40",
    accent: "#E0A96D",
  },
];

export const MenuSection: React.FC = () => {
  const { wishlist } = useCart();
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<MenuCategoryConfig[]>(MENU_CATEGORIES_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpice, setSelectedSpice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [quickBudget, setQuickBudget] = useState<number | null>(null);
  const [vegPreference, setVegPreference] = useState<"all" | "veg" | "nonveg">("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<"slide" | "grid">("slide");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const itemsPerPage = 8;
  const [categoryScrollProgress, setCategoryScrollProgress] = useState<number>(0);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setCategoryScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  };

  const scrollCategory = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    const clientWidth = categoryScrollRef.current.clientWidth;
    const scrollAmount = Math.max(260, clientWidth * 0.65);
    categoryScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Fetch live products and categories from backend
  const fetchMenuData = () => {
    fetch(`/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.error("MenuSection products fetch error:", err));

    fetch(`/api/categories?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const allOption: MenuCategoryConfig = {
            id: "All Items",
            name: "All Dishes",
            emoji: "🍽️",
            subtitle: "All Flavors",
            bgGradient: "from-[#FFF2E8] to-[#FFE5D3]",
            borderColor: "border-[#FF6B35]/40",
            accent: "#FF6B35",
          };
          const dynamicCats: MenuCategoryConfig[] = data.categories.map((c: any) => ({
            id: c.name,
            name: c.name,
            emoji: c.emoji || "🍽️",
            subtitle: c.subtitle || "Chef Special",
            bgGradient: c.bgGradient || "from-[#FFF0E5] to-[#FFE4D6]",
            borderColor: c.borderColor || "border-[#FF6B35]/40",
            accent: c.accent || "#FF6B35",
          }));
          setCategoriesList([allOption, ...dynamicCats]);
        }
      })
      .catch((err) => console.error("MenuSection categories fetch error:", err));
  };

  useEffect(() => {
    fetchMenuData();

    // Auto-refresh when menu changes in Admin or when user focuses window
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchMenuData();
      }
    };
    const handleFocus = () => {
      fetchMenuData();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setVisibleCount(8);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All Items");
    setSelectedDietary([]);
    setSearchQuery("");
    setSelectedSpice(null);
    setMaxPrice(600);
    setQuickBudget(null);
    setVegPreference("all");
    setShowWishlistOnly(false);
    setSortBy("featured");
    setVisibleCount(8);
  };

  const handleQuickBudget = (price: number) => {
    setVisibleCount(8);
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
        // Also map lowercase key for custom categories
        const lower = p.category.toLowerCase();
        if (lower !== p.category) {
          counts[lower] = (counts[lower] || 0) + 1;
        }
      }
    });
    return counts;
  }, [productsList]);

  // Main filter & sort logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category?.toLowerCase().includes(q);
        const matchesCuisine = product.cuisine?.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        const matchesIngredients = product.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesCuisine && !matchesTags && !matchesIngredients) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== "All Items") {
        const matchesCat =
          product.category === selectedCategory ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCat) return false;
      }

      // 3. Veg / Non-Veg Quick Toggle
      if (vegPreference === "veg" && product.isVeg === false) return false;
      if (vegPreference === "nonveg" && product.isVeg !== false) return false;

      // 4. Dietary Tags
      if (selectedDietary.length > 0) {
        const matchesAll = selectedDietary.every((diet) =>
          product.dietary && product.dietary.includes(diet as any)
        );
        if (!matchesAll) return false;
      }

      // 5. Spice Level
      if (selectedSpice !== null && product.spiceLevel !== selectedSpice) {
        return false;
      }

      // 6. Max Price Slider / Quick Budget
      if (product.price > maxPrice) {
        return false;
      }

      // 7. Wishlist
      if (showWishlistOnly && !wishlist.includes(product.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "time") return (a.prepTimeMinutes || 20) - (b.prepTimeMinutes || 20);
      if (sortBy === "calories-asc") return (a.nutrition?.calories || 0) - (b.nutrition?.calories || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [productsList, searchQuery, selectedCategory, vegPreference, selectedDietary, selectedSpice, maxPrice, showWishlistOnly, wishlist, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  // Reset page to 1 if current page becomes out of range
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
      const el = document.getElementById("menu-dishes-grid");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setSlideDirection("prev");
      setCurrentPage((prev) => prev - 1);
      const el = document.getElementById("menu-dishes-grid");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleGoToPage = (pageNum: number) => {
    setSlideDirection(pageNum > currentPage ? "next" : "prev");
    setCurrentPage(pageNum);
    const el = document.getElementById("menu-dishes-grid");
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
    const el = document.getElementById("menu-dishes-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeFiltersCount = 
    (selectedCategory !== "All Items" ? 1 : 0) +
    selectedDietary.length +
    (selectedSpice !== null ? 1 : 0) +
    (vegPreference !== "all" ? 1 : 0) +
    (maxPrice < 600 ? 1 : 0) +
    (showWishlistOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <section id="menu" className="py-6 sm:py-20 bg-gradient-to-b from-[#FFF8F2]/60 via-[#FFF5EB] to-[#FFF8F2] relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-12 left-10 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-80 h-80 bg-[#3ECF6E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-7">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[10px] sm:text-xs font-black border border-[#FF6B35]/20">
            <Sparkles className="w-3 h-3" />
            <span>CHEF ROYAL CRAFT MENU • {productsList.length}+ DISHES</span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-[#0B1220] font-heading tracking-tight">
            Order Everything You Crave
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto line-clamp-1 sm:line-clamp-none">
            Double Smash Burgers, Cheese Burst Pizzas, Peri-Peri Fries, Hakka Noodles, Sizzling Dim Sums, Royal Biryanis, Kulhad Chai, and Warm Choco Lava.
          </p>
        </div>

        {/* ================= 1. SEARCH, CHIPS & QUICK CONTROLS BAR ================= */}
        <div className="p-3 sm:p-5 rounded-[20px] sm:rounded-[28px] bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-soft-card space-y-2.5 sm:space-y-4">
          
          {/* Top Row: Search Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
            
            {/* Live Search Bar */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Burger, Pizza, Fries, Dim Sums, Biryani, Coffee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 sm:top-3 w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 text-xs transition-all cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg / All Toggle + Filter Button */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center bg-gray-100 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-gray-200 shadow-xs">
                <button
                  onClick={() => setVegPreference("all")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                    vegPreference === "all"
                      ? "bg-[#0B1220] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🍽️ All ({productsList.length})
                </button>
                
                <button
                  onClick={() => setVegPreference("veg")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    vegPreference === "veg"
                      ? "bg-[#2E7D32] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 border border-white" />
                  <span>Veg</span>
                </button>

                <button
                  onClick={() => setVegPreference("nonveg")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    vegPreference === "nonveg"
                      ? "bg-[#D32F2F] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Filter Drawer Toggle */}
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all border cursor-pointer ${
                  isFilterPanelOpen || activeFiltersCount > 0
                    ? "bg-[#FF6B35] text-white border-transparent shadow-glow"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white text-[#FF6B35] text-[8.5px] sm:text-[9px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Quick Keyword Chips (1-Line Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pt-1.5 border-t border-gray-100 flex-nowrap">
            <span className="shrink-0 text-[9.5px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B35]" /> Quick:
            </span>
            {QUICK_TRENDING_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setSearchQuery(chip.query)}
                className={`shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? "bg-[#FF6B35] text-white shadow-xs font-black"
                    : "bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#FF6B35] border border-gray-200/80"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Budget Fast-Pills (1-Line Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pt-1.5 border-t border-gray-100 flex-nowrap">
            <span className="shrink-0 text-[9.5px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-0.5 mr-1">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B35]" /> Budget:
            </span>

            {[
              { label: "⚡ Under ₹199", value: 199 },
              { label: "⭐ Under ₹299", value: 299 },
              { label: "🔥 Under ₹399", value: 399 },
              { label: "👑 Royal Feasts ₹400+", value: 600 },
            ].map((tier) => (
              <button
                key={tier.label}
                onClick={() => {
                  setQuickBudget(tier.value);
                  setMaxPrice(tier.value);
                }}
                className={`shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  quickBudget === tier.value
                    ? "bg-[#0B1220] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#FF6B35]/40"
                }`}
              >
                {tier.label}
              </button>
            ))}

            {quickBudget && (
              <button
                onClick={() => { setQuickBudget(null); setMaxPrice(600); }}
                className="shrink-0 text-[10px] sm:text-[11px] font-bold text-gray-400 hover:text-[#FF6B35] ml-1 cursor-pointer whitespace-nowrap"
              >
                Clear Budget
              </button>
            )}
          </div>

          {/* ================= ADVANCED EXPANDABLE FILTER DRAWER ================= */}
          {isFilterPanelOpen && (
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* Dietary Tags */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-500 block uppercase tracking-wider">
                  Dietary Preferences
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DIETARY_FILTERS.map((diet) => {
                    const isSelected = selectedDietary.includes(diet);
                    return (
                      <button
                        key={diet}
                        onClick={() => toggleDietary(diet)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#2E7D32] text-white shadow-xs"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected ? `✓ ${diet}` : `+ ${diet}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spice Level & Price Slider */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black text-gray-500 block uppercase tracking-wider mb-1">
                    Spice Tolerance Level
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedSpice(null)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                        selectedSpice === null
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-600 border border-gray-200"
                      }`}
                    >
                      All
                    </button>
                    {[1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedSpice(selectedSpice === lvl ? null : lvl)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                          selectedSpice === lvl
                            ? "bg-[#FF6B35] text-white shadow-xs"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span>{"🌶️".repeat(lvl)}</span>
                        <span className="text-[9px] font-black">{lvl === 1 ? "Mild" : lvl === 2 ? "Med" : "Hot"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-0.5">
                    <span>Budget Slider</span>
                    <span className="text-[#FF6B35] font-black">Up to ₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="600"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setQuickBudget(null);
                    }}
                    className="w-full accent-[#FF6B35] cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Sort Options & Wishlist */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-gray-500 block uppercase tracking-wider">
                  Sort Dishes By
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-xs cursor-pointer"
                >
                  <option value="featured">⭐ Chef Bestsellers</option>
                  <option value="price-asc">💰 Price: Low to High</option>
                  <option value="price-desc">💎 Price: High to Low</option>
                  <option value="rating">🌟 Highest Rating (4.9+)</option>
                  <option value="time">⏱️ Fastest Prep (5-15 min)</option>
                  <option value="calories-asc">🥗 Lowest Calories</option>
                </select>

                {wishlist.length > 0 && (
                  <button
                    onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      showWishlistOnly
                        ? "bg-[#FF4D6D] text-white shadow-xs"
                        : "bg-[#FFE4E9] text-[#FF4D6D] border border-[#FF4D6D]/30"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? "fill-white" : "fill-[#FF4D6D]"}`} />
                    <span>Saved Wishlist ({wishlist.length})</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Active Filter Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 flex-wrap text-xs">
              <span className="text-gray-400 font-bold text-[11px]">Active filters:</span>
              
              {selectedCategory !== "All Items" && (
                <span className="inline-flex items-center gap-1 bg-[#FFF0E5] text-[#FF6B35] px-2 py-0.5 rounded-lg font-black border border-[#FF6B35]/20 text-[11px]">
                  <span>{CATEGORY_EMOJIS[selectedCategory] || "🍽️"}</span>
                  <span>{selectedCategory}</span>
                  <X className="w-3 h-3 cursor-pointer hover:scale-120 ml-0.5" onClick={() => setSelectedCategory("All Items")} />
                </span>
              )}

              {vegPreference !== "all" && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-white text-[11px] ${
                  vegPreference === "veg" ? "bg-[#2E7D32]" : "bg-[#D32F2F]"
                }`}>
                  <span>{vegPreference === "veg" ? "🌱 Pure Veg" : "🍗 Non-Veg"}</span>
                  <X className="w-3 h-3 cursor-pointer hover:scale-120 ml-0.5" onClick={() => setVegPreference("all")} />
                </span>
              )}

              {selectedDietary.map((diet) => (
                <span key={diet} className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-lg font-black border border-[#2E7D32]/20 text-[11px]">
                  <span>{diet}</span>
                  <X className="w-3 h-3 cursor-pointer hover:scale-120 ml-0.5" onClick={() => toggleDietary(diet)} />
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[#FF6B35] hover:text-[#E85620] font-black ml-auto cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

        </div>

        {/* ================= 2. ANIMATED FULL-WIDTH LUXURY CATEGORY SCROLLER ================= */}
        <div className="relative w-full px-5 sm:px-8">
          
          {/* Floating Left Arrow Button */}
          <button
            onClick={() => scrollCategory("left")}
            aria-label="Scroll categories left"
            className="flex absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200/90 items-center justify-center text-gray-700 hover:text-[#FF6B35] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Floating Right Arrow Button */}
          <button
            onClick={() => scrollCategory("right")}
            aria-label="Scroll categories right"
            className="flex absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200/90 items-center justify-center text-gray-700 hover:text-[#FF6B35] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Horizontal Scroll Container (Compact, Sleek Category Chips) */}
          <div
            ref={categoryScrollRef}
            onScroll={handleCategoryScroll}
            className="category-scroll-container w-full flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth snap-x snap-mandatory px-0.5"
          >
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || (cat.id === "All Items" ? productsList.length : 0);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(8);
                  }}
                  className={`group category-box-card shrink-0 snap-start w-[calc((100%-16px)/3.5)] sm:w-[calc((100%-24px)/4)] md:w-[calc((100%-40px)/6)] lg:w-[calc((100%-64px)/9)] min-w-[76px] sm:min-w-[90px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-between text-center cursor-pointer relative bg-gradient-to-b ${cat.bgGradient} ${cat.borderColor} ${
                    isSelected
                      ? "ring-2 ring-[#FF6B35] shadow-md shadow-[#FF6B35]/20 is-active scale-102 bg-white z-10 font-black"
                      : "hover:border-[#FF6B35]/60 hover:shadow-xs"
                  }`}
                >
                  {/* Active Indicator Top Glow Dot */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF6B35] shadow-glow animate-pulse" />
                  )}

                  {/* Animated Circular Icon Container */}
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-2xs border border-black/5 flex items-center justify-center text-xs sm:text-base group-hover:scale-115 transition-all duration-300 mb-0.5 shrink-0">
                    {cat.emoji}
                  </div>

                  {/* Category Name (Accessible Span instead of H4) */}
                  <span 
                    className={`font-bold text-xs leading-tight text-center block w-full px-0.5 transition-colors line-clamp-1 ${
                      isSelected ? "text-gray-900 font-extrabold" : "text-gray-800 group-hover:text-[#FF6B35]"
                    }`}
                    title={cat.name}
                  >
                    {cat.name}
                  </span>

                  {/* Subtitle */}
                  <span className="text-[10px] text-gray-500 font-medium truncate mt-0.5 hidden sm:block w-full px-0.5">
                    {cat.subtitle}
                  </span>

                  {/* Active Count Pill */}
                  <span className={`text-[7.5px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full mt-0.5 transition-all duration-200 ${
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

        {/* Results Counter & Telemetry */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-800">
              Showing <span className="text-[#FF6B35] font-black">{filteredProducts.length}</span> of {productsList.length} Dishes
            </span>
            {selectedCategory !== "All Items" && (
              <span className="text-xs text-gray-400 font-bold">
                in {selectedCategory}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-400 font-bold hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Thermal Pod 25-Min Dispatch</span>
          </div>
        </div>

        {/* ================= 3. COMPACT 4-COLUMN PRODUCT GRID ================= */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8" id="menu-dishes-grid">
            {/* Animated Grid Container with Smooth Side Slide Effect */}
            <div
              key={`menu-grid-${selectedCategory}-${displayMode}-${currentPage}-${visibleCount}`}
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 animate-in fade-in-50 ${
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
          <div className="rounded-[28px] bg-white p-10 text-center max-w-md mx-auto border border-gray-200 space-y-3 shadow-soft-card animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-[#FFF0E5] text-[#FF6B35] flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-black text-gray-900 font-heading">
              No Dishes Found
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn&apos;t find any plates matching your active criteria. Try clearing your search or resetting filters.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs font-black hover:shadow-glow transition-all cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setSelectedCategory("All Items")}
                className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
              >
                All Cuisines
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Slide-Over Side Menu Drawer Component */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        products={productsList}
        categories={categoriesList.map((c) => ({ id: c.id, name: c.name, emoji: c.emoji }))}
      />
    </section>
  );
};
