"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Leaf, 
  Zap, 
  Award, 
  ChefHat, 
  CheckCircle2, 
  Clock3, 
  Utensils, 
  PackageCheck, 
  Flame, 
  ShieldCheck, 
  Star, 
  Heart, 
  X, 
  ChevronRight, 
  ArrowUpRight 
} from "lucide-react";

interface BentoItemData {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  badge: string;
  badgeStyle: string;
  title: string;
  shortDesc: string;
  footer: string;
  detailTitle: string;
  detailBadge: string;
  detailDesc: string;
  highlights: { label: string; val: string }[];
  bulletPoints: string[];
}

const BENTO_CARDS: BentoItemData[] = [
  {
    id: 1,
    icon: Zap,
    iconBg: "from-[#FF6B35] to-[#FF8A00]",
    badge: "25-Min Hot",
    badgeStyle: "text-[#FF6B35] bg-orange-100/80 border-orange-200",
    title: "Thermal Express",
    shortDesc: "Heated thermal pods for 100% sizzling delivery.",
    footer: "⏱️ 24m Avg",
    detailTitle: "Lightning Fast Hot Thermal Delivery",
    detailBadge: "🔥 25-MIN HOT PROMISE",
    detailDesc: "Smart AI routing paired with electric heated thermal delivery pods ensures every biryani, burger, and wood-fired pizza arrives piping hot directly to your doorstep within 25 minutes.",
    highlights: [
      { label: "Avg Delivery Time", val: "24 Mins" },
      { label: "Food Packaging", val: "Clay Handi & Thermal Pod" },
      { label: "Heat Guarantee", val: "100% Sizzling Hot" }
    ],
    bulletPoints: [
      "Real-time live GPS rider tracking with minute-by-minute ETA updates",
      "Specially insulated heated thermal delivery bags maintaining 75°C+",
      "Zero delay policy: If delayed beyond 35 mins, instant compensation voucher"
    ]
  },
  {
    id: 2,
    icon: ChefHat,
    iconBg: "from-[#FF9800] to-[#FFC94A]",
    badge: "A2 Ghee",
    badgeStyle: "text-amber-700 bg-amber-100/80 border-amber-200",
    title: "Pure Cow Ghee",
    shortDesc: "Slow-cooked in handis with pure Kashmiri saffron.",
    footer: "🏺 4-Hr Dum",
    detailTitle: "100% Pure Cow Desi Ghee & Royal Dum",
    detailBadge: "👑 ROYAL SHAHI RECIPES",
    detailDesc: "Master khansamas craft our heritage gravies, curries, and biryanis exclusively in 100% pure A2 Vedic cow desi ghee and fragrant whole Kashmiri saffron threads.",
    highlights: [
      { label: "Cooking Technique", val: "4-Hour Charcoal Dum" },
      { label: "Ghee Purity", val: "100% Pure A2 Cow Desi Ghee" },
      { label: "Health Standard", val: "Zero Palm Oils & Trans Fats" }
    ],
    bulletPoints: [
      "Hand-ground aromatic Awadhi & Mughlai whole spices ground daily",
      "Natural earthen clay handis preserving authentic rich earthen flavors",
      "Slow-dum sealed with fresh whole-wheat dough to lock in aromas"
    ]
  },
  {
    id: 3,
    icon: Leaf,
    iconBg: "from-[#2E7D32] to-[#3ECF6E]",
    badge: "Organic",
    badgeStyle: "text-[#2E7D32] bg-emerald-100/80 border-emerald-200",
    title: "Farm Fresh",
    shortDesc: "Hand-harvested daily from certified local farms.",
    footer: "🌱 0g Seed Oils",
    detailTitle: "Farm Fresh & 100% Organic Produce",
    detailBadge: "🌱 100% PURE & REGENERATIVE",
    detailDesc: "We partner with local organic hydroponic and regenerative farms to harvest fresh crisp vegetables, artisanal paneer, and prime cuts every single morning.",
    highlights: [
      { label: "Produce Harvest", val: "Harvested Daily < 6 AM" },
      { label: "Cooking Oils", val: "Cold-Pressed Mustard & Ghee" },
      { label: "Pesticide Test", val: "0% Residue Certified" }
    ],
    bulletPoints: [
      "Farm-to-table direct sourcing with no prolonged cold storage",
      "Triple-washed hydroponic herbs, micro-greens, and farm greens",
      "Rich in natural micronutrients, natural enzymes, and gut-friendly antioxidants"
    ]
  },
  {
    id: 4,
    icon: PackageCheck,
    iconBg: "from-teal-600 to-teal-400",
    badge: "Zero Plastic",
    badgeStyle: "text-teal-700 bg-teal-100/80 border-teal-200",
    title: "Eco Packaging",
    shortDesc: "100% sugarcane compostable pods.",
    footer: "🛡️ Compostable",
    detailTitle: "Eco-Luxury 100% Biodegradable Packaging",
    detailBadge: "🌍 0% SINGLE-USE PLASTIC",
    detailDesc: "All our delivery packaging is crafted from 100% natural sugarcane bagasse and plant-based fibers that keep food fresh and naturally compost within 90 days.",
    highlights: [
      { label: "Packaging Material", val: "Sugarcane Bagasse & Clay" },
      { label: "Decomposition", val: "100% Composts in 90 Days" },
      { label: "Safety", val: "100% Food-Grade Non-Toxic" }
    ],
    bulletPoints: [
      "Earthen reusable terracotta handis for all royal biryanis and dal",
      "Leak-proof, microwave-safe natural unbleached compostable meal trays",
      "Carbon-neutral packaging boxes printed with non-toxic soy inks"
    ]
  },
  {
    id: 5,
    icon: Award,
    iconBg: "from-[#E63956] to-[#FF4D6D]",
    badge: "Award Winning",
    badgeStyle: "text-[#E63956] bg-rose-100/80 border-rose-200",
    title: "Loved by 50k+ Foodies",
    shortDesc: "Rated 4.9/5 stars with double sanitized kitchens.",
    footer: "⭐ 4.98 Rating",
    detailTitle: "5-Star Culinary Kitchens & 50,000+ Loyal Diners",
    detailBadge: "🏆 FSSAI 5-STAR CERTIFIED",
    detailDesc: "Recognized as Delhi NCR's top premium cloud kitchen with over 50,000 satisfied food enthusiasts and unmatched 5-star hygiene benchmarks.",
    highlights: [
      { label: "Customer Rating", val: "4.92 / 5.0 (18,400+ Reviews)" },
      { label: "Kitchen Hygiene", val: "FSSAI 5-Star Clean Certified" },
      { label: "Chef Experience", val: "15+ Yrs Master Khansamas" }
    ],
    bulletPoints: [
      "Hourly kitchen sanitization and live temperature-monitored prep stations",
      "Exclusive chef-curated small batches to preserve authentic royal taste",
      "99.4% customer satisfaction and repeat order rate across Delhi NCR"
    ]
  }
];

export const BentoSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<BentoItemData | null>(null);

  const handleOpenMenu = () => {
    setSelectedItem(null);
    const el = document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-4 sm:py-16 bg-gradient-to-b from-[#FFF8F2] via-white to-[#FFF8F2] relative overflow-hidden">
      
      {/* Ambient Moving Glow Orbs */}
      <div className="absolute top-1/4 left-5 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-5 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] bg-[#3ECF6E]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[8.5px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            <span>CULINARY EXCELLENCE</span>
          </div>
          
          <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
            Why Food Lovers Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">FoodEat</span>
          </h2>
          
          <p className="text-gray-500 text-[10px] sm:text-sm leading-snug line-clamp-1">
            Royal mastery, 100% farm-fresh purity, and thermal hot express delivery.
          </p>
        </div>

        {/* ================= 5-CARD COMPACT BENTO COLLAGE ================= */}
        {/* Mobile: 2x2 Grid (4 Compact Uniform Cards) + 1 Bottom Sleek Highlight Card */}
        {/* Desktop: Luxury 12-Column Asymmetric Bento */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-5">
          
          {/* Card 1: 25-Min Thermal Express */}
          <div 
            onClick={() => setSelectedItem(BENTO_CARDS[0])}
            className="col-span-1 md:col-span-6 lg:col-span-7 rounded-[14px] sm:rounded-[24px] bg-gradient-to-br from-[#FFF9F5] via-[#FFF5ED] to-white p-2.5 sm:p-6 border border-[#FF6B35]/25 shadow-2xs hover:shadow-glow hover:border-[#FF6B35]/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between text-left cursor-pointer active:scale-97 h-[110px] sm:h-auto"
          >
            <div className="space-y-1 sm:space-y-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-3 h-3 sm:w-5 sm:h-5 fill-white" />
                </div>
                <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[9.5px] font-black uppercase text-[#FF6B35] bg-orange-100/90 border border-orange-200 px-1.5 py-0.2 rounded-full">
                  <Flame className="w-2 h-2 fill-[#FF6B35] animate-pulse" />
                  <span>25-Min Hot</span>
                </span>
              </div>

              <div>
                <h3 className="text-[11.5px] sm:text-xl font-black text-[#0B1220] font-heading leading-tight truncate group-hover:text-[#FF6B35] transition-colors">
                  Thermal Express
                </h3>
                <p className="text-[8.5px] sm:text-xs text-gray-500 leading-tight truncate mt-0.5">
                  Heated pods for 100% sizzling delivery.
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2.5 border-t border-orange-100/80 flex items-center justify-between text-[8px] sm:text-xs font-black text-[#FF6B35] relative z-10">
              <span className="flex items-center gap-0.5 text-gray-600">
                <Clock3 className="w-2.5 h-2.5 text-[#FF6B35]" /> 24m Avg
              </span>
              <span className="inline-flex items-center gap-0.5 bg-[#FF6B35]/10 text-[#FF6B35] px-1.5 py-0.2 rounded-full font-black text-[7.5px] sm:text-xs group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                More <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 2: 100% Pure Cow Desi Ghee */}
          <div 
            onClick={() => setSelectedItem(BENTO_CARDS[1])}
            className="col-span-1 md:col-span-6 lg:col-span-5 rounded-[14px] sm:rounded-[24px] bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E8] to-white p-2.5 sm:p-6 border border-[#FFC94A]/30 shadow-2xs hover:shadow-glow hover:border-[#FFC94A]/60 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between text-left cursor-pointer active:scale-97 h-[110px] sm:h-auto"
          >
            <div className="space-y-1 sm:space-y-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#FF9800] to-[#FFC94A] text-white flex items-center justify-center shadow-xs">
                  <ChefHat className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[9.5px] font-black uppercase text-amber-700 bg-amber-100/90 border border-amber-200 px-1.5 py-0.2 rounded-full">
                  <Sparkles className="w-2 h-2 text-amber-600" />
                  <span>A2 Ghee</span>
                </span>
              </div>

              <div>
                <h3 className="text-[11.5px] sm:text-lg font-black text-[#0B1220] font-heading leading-tight truncate group-hover:text-amber-600 transition-colors">
                  Pure Cow Ghee
                </h3>
                <p className="text-[8.5px] sm:text-xs text-gray-500 leading-tight truncate mt-0.5">
                  Slow-cooked with Kashmiri saffron.
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2.5 border-t border-amber-100/80 flex items-center justify-between text-[8px] sm:text-xs font-bold text-amber-800 relative z-10">
              <span className="flex items-center gap-0.5 font-black text-gray-600">
                <Utensils className="w-2.5 h-2.5 text-amber-600" /> 4-Hr Dum
              </span>
              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-black text-[7.5px] sm:text-xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                More <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Farm Fresh & Organic */}
          <div 
            onClick={() => setSelectedItem(BENTO_CARDS[2])}
            className="col-span-1 md:col-span-6 lg:col-span-4 rounded-[14px] sm:rounded-[24px] bg-gradient-to-br from-[#F6FDF8] via-[#EDFAF0] to-white p-2.5 sm:p-6 border border-[#3ECF6E]/25 shadow-2xs hover:shadow-glow-fresh hover:border-[#3ECF6E]/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between text-left cursor-pointer active:scale-97 h-[110px] sm:h-auto"
          >
            <div className="space-y-1 sm:space-y-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#3ECF6E] text-white flex items-center justify-center shadow-xs">
                  <Leaf className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[7px] sm:text-[9.5px] font-black uppercase text-[#2E7D32] bg-emerald-100/90 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                  Organic
                </span>
              </div>

              <div>
                <h3 className="text-[11.5px] sm:text-base font-black text-[#0B1220] font-heading leading-tight truncate group-hover:text-[#2E7D32] transition-colors">
                  Farm Fresh
                </h3>
                <p className="text-[8.5px] sm:text-xs text-gray-500 leading-tight truncate mt-0.5">
                  Hand-harvested daily from local farms.
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2.5 border-t border-emerald-100/80 flex items-center justify-between text-[8px] sm:text-xs font-black text-[#2E7D32] relative z-10">
              <span className="text-gray-600 font-bold">0g Seed Oils</span>
              <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-[#2E7D32] px-1.5 py-0.2 rounded-full font-black text-[7.5px] sm:text-xs group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                More <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Eco Biodegradable Packaging */}
          <div 
            onClick={() => setSelectedItem(BENTO_CARDS[3])}
            className="col-span-1 md:col-span-6 lg:col-span-4 rounded-[14px] sm:rounded-[24px] bg-gradient-to-br from-[#F4FCFC] via-[#E8F8F8] to-white p-2.5 sm:p-6 border border-teal-200/50 shadow-2xs hover:shadow-glow hover:border-teal-300 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between text-left cursor-pointer active:scale-97 h-[110px] sm:h-auto"
          >
            <div className="space-y-1 sm:space-y-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center shadow-xs">
                  <PackageCheck className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[7px] sm:text-[9.5px] font-black uppercase text-teal-700 bg-teal-100/90 border border-teal-200 px-1.5 py-0.2 rounded-full">
                  Zero Plastic
                </span>
              </div>

              <div>
                <h3 className="text-[11.5px] sm:text-base font-black text-[#0B1220] font-heading leading-tight truncate group-hover:text-teal-700 transition-colors">
                  Eco Packaging
                </h3>
                <p className="text-[8.5px] sm:text-xs text-gray-500 leading-tight truncate mt-0.5">
                  100% sugarcane compostable pods.
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-2.5 border-t border-teal-100/80 flex items-center justify-between text-[8px] sm:text-xs font-black text-teal-700 relative z-10">
              <span className="text-gray-600 font-bold">Compostable</span>
              <span className="inline-flex items-center gap-0.5 bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-black text-[7.5px] sm:text-xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                More <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 5: 5-Star Kitchen & 50,000+ Foodies (Col Span 2 on Mobile, 4 on Desktop) */}
          <div 
            onClick={() => setSelectedItem(BENTO_CARDS[4])}
            className="col-span-2 md:col-span-6 lg:col-span-4 rounded-[14px] sm:rounded-[24px] bg-gradient-to-br from-[#FFF5F7] via-[#FFEBF0] to-white p-2.5 sm:p-5 border border-rose-200/50 shadow-2xs hover:shadow-glow hover:border-rose-300 transition-all duration-300 relative overflow-hidden group flex items-center justify-between text-left cursor-pointer active:scale-98 h-[64px] sm:h-auto"
          >
            <div className="flex items-center gap-2.5 relative z-10 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#E63956] to-[#FF4D6D] text-white flex items-center justify-center shadow-xs shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-base font-bold text-gray-900 font-heading leading-snug group-hover:text-[#FF6B35] transition-colors">
                    Loved by 50k+ Foodies
                  </h3>
                  <span className="text-[9px] font-bold uppercase text-rose-700 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded-full shrink-0 hidden xs:inline-block">
                    Award
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-normal line-clamp-1">
                  Rated 4.9/5 stars with FSSAI sanitized kitchens.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[8px] sm:text-xs font-black text-gray-800 flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-md border border-rose-100 shadow-2xs">
                <Star className="w-2.5 h-2.5 fill-[#FFC94A] text-[#FFC94A]" /> 4.98
              </span>
              <span className="inline-flex items-center gap-0.5 bg-[#E63956] text-white px-2 py-1 rounded-full font-black text-[7.5px] sm:text-xs shadow-xs group-hover:scale-105 transition-transform">
                More <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= INTERACTIVE DETAIL MODAL ("MORE" POPUP) ================= */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl border border-gray-100 p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer z-20 active:scale-90"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Badge */}
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${selectedItem.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                <selectedItem.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5 pr-8">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase text-[#FF6B35] bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{selectedItem.detailBadge}</span>
                </span>
                <h3 className="text-base sm:text-xl font-black text-[#0B1220] font-heading leading-tight">
                  {selectedItem.detailTitle}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium bg-orange-50/40 p-3 rounded-xl border border-orange-100/60">
              {selectedItem.detailDesc}
            </p>

            {/* 3 Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {selectedItem.highlights.map((h, i) => (
                <div key={i} className="p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 text-center">
                  <span className="text-[7.5px] sm:text-[9px] text-gray-400 block font-bold uppercase truncate">{h.label}</span>
                  <span className="text-[11px] sm:text-xs font-black text-gray-900 block truncate mt-0.5">{h.val}</span>
                </div>
              ))}
            </div>

            {/* Bullet Points */}
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <h4 className="text-[11px] sm:text-xs font-black text-gray-900 uppercase tracking-wider">
                Key Craftsmanship Highlights:
              </h4>
              <div className="space-y-1.5">
                {selectedItem.bulletPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3ECF6E] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5">
              <button
                onClick={handleOpenMenu}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs sm:text-sm font-black shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Explore Craft Dishes</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
