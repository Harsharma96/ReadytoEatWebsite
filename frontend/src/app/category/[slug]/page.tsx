"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, CATEGORY_EMOJIS, DIETARY_FILTERS } from "@/data/products";
import { Product } from "@/types/product";
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowLeft, 
  RefreshCw, 
  X, 
  RotateCcw, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Award,
  Share2,
  Check
} from "lucide-react";

interface CategoryMeta {
  name: string;
  emoji: string;
  title: string;
  tagline: string;
  bannerBadge: string;
  bgGradient: string;
  borderColor: string;
  accent: string;
  highlights: string[];
}

const CATEGORY_REGISTRY: Record<string, CategoryMeta> = {
  "burgers-wraps": {
    name: "Burgers & Wraps",
    emoji: "🍔",
    title: "Artisanal Smash Burgers & Toasted Wraps",
    tagline: "Crisp golden patties, caramelized onions, smoked paprika glaze, and warm toasted brioche buns.",
    bannerBadge: "100% FRESHLY SMASHED & GRILLED",
    bgGradient: "from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2]",
    borderColor: "border-[#FF6B35]/40",
    accent: "#FF6B35",
    highlights: ["Double Smash Patties", "Melted Cheddar & Mozzarella", "Brioche & Whole Wheat Rolls", "Peri-Peri Dusted"],
  },
  "pizzas-garlic-breads": {
    name: "Pizzas & Garlic Breads",
    emoji: "🍕",
    title: "Wood-Fired Sourdough Pizzas & Cheesy Breads",
    tagline: "48-hour fermented sourdough crust, San Marzano tomato purée, and pure Fior di Latte mozzarella.",
    bannerBadge: "WOOD-FIRED 450°C CRUST",
    bgGradient: "from-[#FFE8EC] via-[#FFD5DC] to-[#FFF8F2]",
    borderColor: "border-[#FF4D6D]/40",
    accent: "#FF4D6D",
    highlights: ["Hand-Stretched Sourdough", "Herb Garlic Butter", "Cheese Burst Lava", "Fresh Italian Basil"],
  },
  "snacks-chaat": {
    name: "Snacks & Chaat",
    emoji: "🍟",
    title: "Crispy Peri Fries, Nachos & Street Chaats",
    tagline: "Spiced French fries, loaded Mexican nachos, tangy Dahi Puri, and crunchy savory delights.",
    bannerBadge: "CRUNCHY & SIZZLING FRESH",
    bgGradient: "from-[#FFF4E5] via-[#FFE6CC] to-[#FFF8F2]",
    borderColor: "border-[#FF8A00]/40",
    accent: "#FF8A00",
    highlights: ["Signature Peri-Peri Mix", "Creamy Cheese Dips", "Kolkata & Delhi Chaat", "Fresh Guacamole & Salsa"],
  },
  "chinese-momos": {
    name: "Chinese & Momos",
    emoji: "🥢",
    title: "Wok-Tossed Hakka Noodles & Sizzling Dim Sums",
    tagline: "Darjeeling steamed momos, crispy Schezwan spring rolls, and authentic high-flame wok creations.",
    bannerBadge: "HIGH WOK HEI FLAVORS",
    bgGradient: "from-[#FFF2EB] via-[#FCD1B8] to-[#FFF8F2]",
    borderColor: "border-[#E85620]/40",
    accent: "#E85620",
    highlights: ["Handmade Dim Sum Skins", "Fiery Schezwan Dips", "Wok Tossed Gravies", "Crunchy Wontons"],
  },
  "biryani-north-indian": {
    name: "Biryani & North Indian",
    emoji: "🍚",
    title: "Royal Awadhi Dum Biryani & Shahi Gravies",
    tagline: "Aged Daawat Basmati rice cooked in sealed clay handis, rich Dal Makhani, and velvety Paneer Butter Masala.",
    bannerBadge: "SLOW DUM COOKED OVER COAL",
    bgGradient: "from-[#FFFBF5] via-[#EFE1CE] to-[#FFF8F2]",
    borderColor: "border-[#D4A373]/40",
    accent: "#D4A373",
    highlights: ["24-Month Aged Basmati", "Pure Desi Ghee Dal Makhani", "Kesar & Rose Water Aromas", "Tandoor Charred Naans"],
  },
  "gujarati-thalis": {
    name: "Gujarati & Thalis",
    emoji: "🟡",
    title: "Authentic Gujarati Thali & Heritage Rasoi",
    tagline: "Heritage Surti Undhiyu, spongy nylon Dhokla, sweet-savory Gujarati Dal, and warm Ghee Phulkas.",
    bannerBadge: "PURE SATTVIC & DESI GHEE",
    bgGradient: "from-[#FFF9E6] via-[#FFEAB3] to-[#FFF8F2]",
    borderColor: "border-[#FFC94A]/50",
    accent: "#FFC94A",
    highlights: ["Kathiyawadi & Surti Dishes", "100% Pure Desi Ghee", "Zero Soda / Chemical Free", "Fresh Homemade Farsan"],
  },
  "south-indian": {
    name: "South Indian",
    emoji: "🥥",
    title: "Crispy Ghee Roast Dosa, Soft Idlis & Vada",
    tagline: "Stone-ground fermented rice batters, Podi Ghee Roast, freshly grated coconut chutney, and piping hot sambar.",
    bannerBadge: "TRADITIONAL STONE GROUND BATTER",
    bgGradient: "from-[#E8F8F0] via-[#D0F2DF] to-[#FFF8F2]",
    borderColor: "border-[#3ECF6E]/40",
    accent: "#3ECF6E",
    highlights: ["Pure A2 Ghee Roast", "Stone-Ground Batters", "Fresh Coconut & Tomato Dips", "Authentic Udupi Sambar"],
  },
  "chai-coffee-juices": {
    name: "Chai, Coffee & Juices",
    emoji: "☕",
    title: "Kulhad Masala Chai, Cold Brews & Fresh Juices",
    tagline: "Cardamom and ginger steeped clay pot chai, artisanal Arabica cold coffee, and 100% cold-pressed fruit juices.",
    bannerBadge: "BREWED FRESH TO YOUR ORDER",
    bgGradient: "from-[#F5EFFE] via-[#E9DCFC] to-[#FFF8F2]",
    borderColor: "border-[#9C6ADE]/40",
    accent: "#9C6ADE",
    highlights: ["Clay Kulhad Aroma", "Single-Origin Arabica", "Zero Added Preservatives", "Cold-Pressed Daily"],
  },
  "desserts-shakes": {
    name: "Desserts & Shakes",
    emoji: "🍰",
    title: "Warm Choco Lava, Kesar Rasmalai & Shakes",
    tagline: "Warm Belgian molten chocolate cakes, saffron milk rasmalai, gulab jamuns, and creamy thick shakes.",
    bannerBadge: "INDULGENT SWEET CELEBRATIONS",
    bgGradient: "from-[#FFF0F7] via-[#FCDDEE] to-[#FFF8F2]",
    borderColor: "border-[#FF5E97]/40",
    accent: "#FF5E97",
    highlights: ["Belgian Couverture Chocolate", "Kashmiri Kesar Infused", "Fresh Thick Shakes", "Served Warm & Fresh"],
  },
};

// Helper to normalize any category string to registry key
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[&]/g, "")
    .replace(/[,]/g, "")
    .replace(/[\s+]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export default function CategoryDedicatedPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || "burgers-wraps";
  const slug = rawSlug.toLowerCase();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [vegPreference, setVegPreference] = useState<"all" | "veg" | "nonveg">("all");
  const [quickBudget, setQuickBudget] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Fetch live products & categories
  const fetchLiveCatalog = async () => {
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
      console.error("Error fetching live category data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCatalog();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchLiveCatalog();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Match category meta
  const meta: CategoryMeta = useMemo(() => {
    if (CATEGORY_REGISTRY[slug]) {
      return CATEGORY_REGISTRY[slug];
    }

    // Try finding by name match in registry or live list
    const foundRegistryKey = Object.keys(CATEGORY_REGISTRY).find((key) => {
      const item = CATEGORY_REGISTRY[key];
      return slugify(item.name) === slug || key.includes(slug) || slug.includes(key);
    });

    if (foundRegistryKey) {
      return CATEGORY_REGISTRY[foundRegistryKey];
    }

    // Check dynamic categories from database
    const dynamicCat = categoriesList.find((c) => slugify(c.name) === slug || slugify(c.id) === slug);
    if (dynamicCat) {
      return {
        name: dynamicCat.name,
        emoji: dynamicCat.emoji || CATEGORY_EMOJIS[dynamicCat.name] || "🍲",
        title: `${dynamicCat.name} Culinary Collection`,
        tagline: dynamicCat.subtitle || "Handcrafted fresh recipes curated with royal kitchen standards.",
        bannerBadge: "ROYAL CHEF SPECIAL SELECTION",
        bgGradient: dynamicCat.bgGradient || "from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2]",
        borderColor: dynamicCat.borderColor || "border-[#FF6B35]/40",
        accent: dynamicCat.accent || "#FF6B35",
        highlights: ["100% Fresh Ingredients", "Thermal Pod Dispatch", "Custom Spice Levels", "Chef Recommended"],
      };
    }

    // Default Fallback
    const formattedName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      name: formattedName,
      emoji: CATEGORY_EMOJIS[formattedName] || "🍽️",
      title: `${formattedName} Signature Plates`,
      tagline: "Authentic royal kitchen recipes prepared fresh for you every day.",
      bannerBadge: "CHEF ROYAL FLAVORS",
      bgGradient: "from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2]",
      borderColor: "border-[#FF6B35]/40",
      accent: "#FF6B35",
      highlights: ["Freshly Prepared", "Thermal Insulated Pack", "25-Min Guarantee", "Artisanal Taste"],
    };
  }, [slug, categoriesList]);

  // Filter products for this specific category
  const filteredCategoryProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category Match
      const pCatSlug = slugify(product.category || "");
      const targetSlug = slugify(meta.name);

      const matchesCat =
        pCatSlug === targetSlug ||
        pCatSlug.includes(slug) ||
        slug.includes(pCatSlug) ||
        product.category?.toLowerCase() === meta.name.toLowerCase();

      if (!matchesCat) return false;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.tags?.some((t) => t.toLowerCase().includes(q)) ||
          product.shortDescription?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Dietary
      if (selectedDiet !== "All") {
        if (!product.dietary || !product.dietary.includes(selectedDiet as any)) {
          return false;
        }
      }

      // Veg preference
      if (vegPreference === "veg" && product.isVeg === false) return false;
      if (vegPreference === "nonveg" && product.isVeg !== false) return false;

      // Max price
      if (product.price > maxPrice) return false;

      return true;
    });
  }, [productsList, meta.name, slug, searchQuery, selectedDiet, vegPreference, maxPrice]);

  const visibleDishes = useMemo(() => {
    return filteredCategoryProducts.slice(0, visibleCount);
  }, [filteredCategoryProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredCategoryProducts.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredCategoryProducts.length);
  };

  const handleCollapse = () => {
    setVisibleCount(8);
    const el = document.getElementById("category-dishes-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* ================= 1. DEDICATED THEMATIC HERO BANNER ================= */}
      <section className={`pt-28 pb-14 bg-gradient-to-b ${meta.bgGradient} relative overflow-hidden border-b border-black/5`}>
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 right-10 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-2 mb-6 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/menu" className="hover:text-[#FF6B35] transition-colors">Menu</Link>
              <span>/</span>
              <span className="text-gray-900 font-black">{meta.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-700 text-xs font-black shadow-2xs border border-black/5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-gray-600" />
                    <span>Share Category</span>
                  </>
                )}
              </button>

              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B1220] text-white text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Menu</span>
              </Link>
            </div>
          </div>

          {/* Hero Header Content */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Animated Emoji & Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5">
              <span className="text-xl animate-bounce">{meta.emoji}</span>
              <span className="text-xs font-black text-gray-900 tracking-wide">{meta.bannerBadge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              <span className="text-xs font-bold text-gray-500">{filteredCategoryProducts.length} Specialties</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
              {meta.title}
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {meta.tagline}
            </p>

            {/* Highlights Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              {meta.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/85 backdrop-blur-md text-[11px] font-black text-gray-800 border border-black/5 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-[#FF6B35]" />
                  <span>{h}</span>
                </span>
              ))}
            </div>

          </div>

          {/* Instant Category Search & Veg Filter */}
          <div className="max-w-2xl mx-auto pt-8 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Search inside ${meta.name} (e.g. Cheese, Paneer, Spicy, Butter...)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 pl-11 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 3-Way Veg Filter */}
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm shrink-0">
              <button
                onClick={() => setVegPreference("all")}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  vegPreference === "all" ? "bg-[#0B1220] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegPreference("veg")}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  vegPreference === "veg" ? "bg-[#3ECF6E] text-white shadow-xs" : "text-gray-600 hover:text-[#3ECF6E]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white" />
                <span>Veg</span>
              </button>
              <button
                onClick={() => setVegPreference("nonveg")}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  vegPreference === "nonveg" ? "bg-[#FF4D6D] text-white shadow-xs" : "text-gray-600 hover:text-[#FF4D6D]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block border border-white" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Dietary Chips */}
          <div className="flex gap-1.5 justify-center flex-wrap pt-4">
            {["All", "Pure Veg", "Non-Veg", "Jain Friendly", "Desi Ghee Special", "Chef Special", "High Protein"].map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDiet === diet
                    ? "bg-[#FF6B35] text-white shadow-glow"
                    : "bg-white/90 text-gray-700 hover:bg-white border border-black/5 shadow-2xs"
                }`}
              >
                {diet}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 2. OTHER RELATED CATEGORIES MINI STRIP ================= */}
      <section className="py-4 bg-white/70 backdrop-blur-md border-b border-gray-200/80 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap pl-1">
              Explore Cuisines:
            </span>

            {Object.keys(CATEGORY_REGISTRY).map((catKey) => {
              const catItem = CATEGORY_REGISTRY[catKey];
              const isCurrent = catKey === slug || slugify(catItem.name) === slug;

              return (
                <Link
                  key={catKey}
                  href={`/category/${catKey}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isCurrent
                      ? "bg-[#FF6B35] text-white shadow-glow scale-105"
                      : "bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] border border-gray-200/60"
                  }`}
                >
                  <span>{catItem.emoji}</span>
                  <span>{catItem.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 3. DISHES GRID & ANIMATED LOAD MORE ================= */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1" id="category-dishes-grid">
        
        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-gray-800">
              Showing <span className="text-[#FF6B35] font-black">{Math.min(visibleCount, filteredCategoryProducts.length)}</span> of <span className="text-gray-900 font-black">{filteredCategoryProducts.length}</span> Handcrafted Dishes in {meta.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchLiveCatalog}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#FF6B35] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#FF6B35]" /> Refresh
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredCategoryProducts.length > 0 ? (
          <div className="space-y-8">
            <div
              key={`category-grid-${slug}-${visibleCount}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-400"
            >
              {visibleDishes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ================= LUXURY ANIMATED LOAD MORE CONTROLLER ================= */}
            {filteredCategoryProducts.length > 8 && (
              <div className="pt-8 pb-4 flex flex-col items-center justify-center space-y-4">
                
                {/* Visual Progress Bar Tracker */}
                <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
                  <div className="flex items-center justify-between text-xs font-black text-gray-700 px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>Showing {Math.min(visibleCount, filteredCategoryProducts.length)} of {filteredCategoryProducts.length} {meta.name}</span>
                    </span>
                    <span className="text-[#FF6B35] font-black">
                      {Math.round((Math.min(visibleCount, filteredCategoryProducts.length) / filteredCategoryProducts.length) * 100)}%
                    </span>
                  </div>
                  
                  {/* Animated Progress Track */}
                  <div className="w-full h-2 rounded-full bg-[#FFF0E5] overflow-hidden p-0.5 border border-[#FF6B35]/20 shadow-2xs">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] transition-all duration-500 shadow-glow"
                      style={{
                        width: `${(Math.min(visibleCount, filteredCategoryProducts.length) / filteredCategoryProducts.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Animated Interactive Buttons */}
                {visibleCount < filteredCategoryProducts.length ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {/* Glowing Animated Main Expand Button */}
                    <button
                      onClick={handleLoadMore}
                      className="relative group overflow-hidden px-8 py-4 rounded-3xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] text-white font-black text-sm sm:text-base shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      {/* Shimmer Light Reflection Sweep */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                      {/* Animated Sparkle Icon */}
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>

                      {/* Text */}
                      <span>Explore More {meta.name}</span>

                      {/* Badge */}
                      <span className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black border border-white/30 text-white shadow-xs">
                        +{Math.min(8, filteredCategoryProducts.length - visibleCount)} More
                      </span>

                      {/* Bouncing Arrow */}
                      <ChevronDown className="w-5 h-5 text-white group-hover:translate-y-1 transition-transform duration-300" />
                    </button>

                    {/* Quick View All Button */}
                    <button
                      onClick={handleShowAll}
                      className="px-5 py-3.5 rounded-2xl bg-white hover:bg-orange-50/80 text-gray-700 hover:text-[#FF6B35] font-black text-xs border border-gray-200 hover:border-[#FF6B35]/40 shadow-soft-card hover:shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <span>View All ({filteredCategoryProducts.length})</span>
                      <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <div className="px-6 py-3.5 rounded-2xl bg-white/95 border border-emerald-200 shadow-soft-card flex items-center gap-2 text-xs font-black text-emerald-800 animate-in zoom-in-95 duration-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>🎉 All {filteredCategoryProducts.length} {meta.name} Creations Unlocked!</span>
                    </div>

                    <button
                      onClick={handleCollapse}
                      className="px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 font-black text-xs shadow-soft-card transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Collapse to 8 Dishes</span>
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200 shadow-soft-card max-w-md mx-auto space-y-3">
            <span className="text-5xl block mb-2">{meta.emoji}</span>
            <h3 className="text-lg font-black text-gray-900 font-heading">No {meta.name} matched your filter</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Try adjusting your dietary or price filters to see delicious options.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiet("All");
                setVegPreference("all");
                setQuickBudget(null);
                setMaxPrice(600);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] text-white font-black text-xs shadow-glow hover:bg-[#E85620] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* ================= 4. CHEF PROMISE & GUARANTEE STRIP ================= */}
      <section className="py-12 bg-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#FFF8F2] border border-[#FF6B35]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center text-xl shrink-0 shadow-glow">
                🔥
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">100% Freshly Cooked</h4>
                <p className="text-xs text-gray-500 mt-0.5">Prepared on order in our certified kitchen studios.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF8F2] border border-[#FF6B35]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3ECF6E] text-white flex items-center justify-center text-xl shrink-0 shadow-glow">
                ⚡
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">25-Min Thermal Dispatch</h4>
                <p className="text-xs text-gray-500 mt-0.5">Insulated pods preserve crispiness & piping hot steam.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF8F2] border border-[#FF6B35]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center text-xl shrink-0 shadow-glow">
                👑
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">Master Chef Craft</h4>
                <p className="text-xs text-gray-500 mt-0.5">Ancestral spices & heritage culinary traditions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
