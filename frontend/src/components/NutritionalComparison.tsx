"use client";

import React, { useState } from "react";
import { 
  Check, 
  X, 
  Sparkles, 
  Crown, 
  Flame, 
  Leaf, 
  Clock, 
  Flower2, 
  ShieldCheck, 
  BadgeCheck,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface ComparisonItemData {
  id: number;
  feature: string;
  shortTitle: string;
  vsText: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  pureVibe: { text: string; highlight: string };
  others: string;
  storeFrozen: { text: string };
  cafeBowl: { text: string };
  detailTitle: string;
  detailBadge: string;
  foodEatPoints: string[];
  commercialFlaws: string[];
  healthImpact: string;
}

const COMPARISON_ROWS: ComparisonItemData[] = [
  {
    id: 1,
    feature: "Cooking Fat & Medium",
    shortTitle: "100% Pure Cow Desi Ghee",
    vsText: "vs Palm Oil",
    icon: Flame,
    iconBg: "from-[#FF6B35] to-[#FF8A00]",
    pureVibe: { text: "100% Pure Cow Desi Ghee & Cold-Pressed Mustard Oil", highlight: "Zero Palm" },
    others: "Refined Palm Oil & Vanaspati (Trans Fats)",
    storeFrozen: { text: "Refined Palm Oil & Hydrogenated Vanaspati (Trans Fats)" },
    cafeBowl: { text: "Re-used commercial seed oils & chemical preservatives" },
    detailTitle: "100% Vedic Desi Ghee vs Industrial Palm Oil",
    detailBadge: "👑 0% PALM OIL • ZERO TRANS FATS",
    foodEatPoints: [
      "100% Pure A2 Cow Desi Ghee slow-churned from organic dairy farms",
      "Cold-pressed Kachi Ghani mustard oil with natural rich antioxidants",
      "Strict zero reuse policy: Fresh healthy medium for every single batch"
    ],
    commercialFlaws: [
      "Heavy use of cheap refined palm oil and hydrogenated Vanaspati",
      "Multiple reheat cycles producing harmful oxidative free radicals",
      "Synthetic chemical emulsifiers and artificial anti-foaming agents"
    ],
    healthImpact: "Improves digestion, supports heart vitality, and gives authentic royal aromas without post-meal heaviness."
  },
  {
    id: 2,
    feature: "Spices Purity",
    shortTitle: "Awadhi Whole Spices",
    vsText: "vs Synthetic MSG",
    icon: Leaf,
    iconBg: "from-[#2E7D32] to-[#3ECF6E]",
    pureVibe: { text: "Stone-Ground Awadhi Whole Spices", highlight: "Stone Ground" },
    others: "Synthetic flavorings, MSG & bulk paste bases",
    storeFrozen: { text: "Artificial synthetic flavoring & MSG flavor enhancers" },
    cafeBowl: { text: "Commercial bulk chemical paste bases & stabilizers" },
    detailTitle: "Single-Estate Whole Spices vs Synthetic Enhancers",
    detailBadge: "🌿 100% NATURAL • 0% SYNTHETIC MSG",
    foodEatPoints: [
      "Whole aromatic spices slow-roasted and stone-ground in small kitchen batches",
      "Direct single-estate sourcing from Kerala & Awadh heritage spice gardens",
      "Zero artificial flavor essences, MSG enhancers, or chemical stabilizers"
    ],
    commercialFlaws: [
      "Bulk pre-packaged paste bases laced with chemical acidity regulators",
      "Heavy reliance on synthetic MSG to mask low-grade base ingredients",
      "Artificial colorants and flavor boosters that irritate sensitive stomachs"
    ],
    healthImpact: "Natural anti-inflammatory benefits, rich essential phytonutrients, and authentic deep Mughlai flavor."
  },
  {
    id: 3,
    feature: "Biryani Dum",
    shortTitle: "Charcoal Handi Dum",
    vsText: "vs Microwave",
    icon: Crown,
    iconBg: "from-[#FF9800] to-[#FFC94A]",
    pureVibe: { text: "4-Hour Charcoal Clay Handi Slow Dum", highlight: "Handi Dum" },
    others: "Pre-boiled white rice mixed with artificial gravy",
    storeFrozen: { text: "Microwave heated frozen plastic pouches" },
    cafeBowl: { text: "Pre-boiled stale white rice mixed with gravy" },
    detailTitle: "4-Hour Earthen Handi Dum vs Fast-Food Microwave",
    detailBadge: "🏺 4-HOUR CHARCOAL SLOW DUM",
    foodEatPoints: [
      "Authentic clay handis sealed with whole-wheat dough to trap aromatic steam",
      "Slow-cooked over natural charcoal embers for 4 continuous hours",
      "Aged long-grain Basmati rice infused with bone/paneer natural broths"
    ],
    commercialFlaws: [
      "Pre-boiled leftover white rice quickly stirred with commercial gravies",
      "Frozen plastic pouches reheated in commercial microwaves",
      "Loss of grain texture, dry meat/paneer, and greasy artificial gravies"
    ],
    healthImpact: "Retains wholesome grain nutrients, natural moisture, and unmatched melt-in-mouth royal texture."
  },
  {
    id: 4,
    feature: "Dal Makhani",
    shortTitle: "24-Hour Simmer",
    vsText: "vs 15-Min Starch",
    icon: Clock,
    iconBg: "from-[#6366F1] to-[#818CF8]",
    pureVibe: { text: "24-Hour Charcoal Simmer with White Butter", highlight: "24-Hr Slow" },
    others: "15-min pressure cook with cornstarch thickeners",
    storeFrozen: { text: "Pressure cooked in 15 mins with cornstarch thickeners" },
    cafeBowl: { text: "Instant flour-thickened paste with artificial cream" },
    detailTitle: "24-Hour Charcoal Simmer vs Instant Starch Pastes",
    detailBadge: "🧈 24-HOUR MAKHANI CRAFTSMANSHIP",
    foodEatPoints: [
      "Black urad lentils slow-simmered for 24 continuous hours over low embers",
      "Finished exclusively with fresh artisanal white makkhan (churned butter)",
      "Zero added cornstarch, zero flour, and 100% natural velvety creaminess"
    ],
    commercialFlaws: [
      "Quick 15-minute pressure cooking with heavy cornstarch thickeners",
      "Artificial synthetic dairy creams and palm oil based white spreads",
      "Watery base mixed with artificial tomato puree and vinegar"
    ],
    healthImpact: "High natural protein absorption, gentle on the gut, and ultra-smooth authentic buttery richness."
  },
  {
    id: 5,
    feature: "Pure Saffron",
    shortTitle: "Kashmiri Kesar",
    vsText: "vs Yellow Dye",
    icon: Flower2,
    iconBg: "from-[#EC4899] to-[#F472B6]",
    pureVibe: { text: "Grade-A Kashmiri Kesar Threads", highlight: "Kashmiri" },
    others: "Artificial yellow chemical food dye (Tartrazine)",
    storeFrozen: { text: "Synthetic yellow food dye (Tartrazine E102)" },
    cafeBowl: { text: "Artificial chemical essence & food colorings" },
    detailTitle: "Grade-A Kashmiri Kesar vs Toxic Yellow Dye (E102)",
    detailBadge: "🌸 100% CERTIFIED KASHMIRI KESAR",
    foodEatPoints: [
      "Authentic GI-tagged Kashmiri saffron threads handpicked from Pampore",
      "Infused in pure warm cow milk for natural golden hue and royal fragrance",
      "Organic Kannauj damask rose water and natural royal attars"
    ],
    commercialFlaws: [
      "Synthetic chemical dye Tartrazine (E102) and Sunset Yellow",
      "Artificial chemical fragrances with synthetic aftertaste",
      "Zero real saffron or botanical flower extracts"
    ],
    healthImpact: "Natural mood booster, rich in crocin antioxidants, and gentle on children and elders."
  },
  {
    id: 6,
    feature: "Average Meal Value",
    shortTitle: "Michelin Gourmet",
    vsText: "vs 5-Star Markup",
    icon: BadgeCheck,
    iconBg: "from-[#F59E0B] to-[#FBBF24]",
    pureVibe: { text: "₹249 - ₹499 (Michelin Chef Handcrafted)", highlight: "Best Value" },
    others: "₹1,200+ at 5-Star Hotels or ₹250 frozen pouch",
    storeFrozen: { text: "₹220 - ₹280 (Preservative Pouch with Low Nutrition)" },
    cafeBowl: { text: "₹1,200 - ₹2,500 (Overpriced 5-Star Hotel Pricing)" },
    detailTitle: "Royal Handcrafted Gourmet at Everyday Transparent Prices",
    detailBadge: "💎 TRUE GOURMET VALUE",
    foodEatPoints: [
      "Cloud-kitchen direct model eliminating 5-star hotel real estate markups",
      "Generous royal portion sizes packed in thermal eco-friendly handis",
      "Transparent pricing: 100% premium quality starting at just ₹249"
    ],
    commercialFlaws: [
      "5-star hotel menus charge ₹1,500+ for standard dal and biryani",
      "Frozen supermarket meals cost ₹250 for tiny 180g preservative pouches",
      "Overpriced delivery chains with hidden convenience fees"
    ],
    healthImpact: "Exceptional culinary luxury accessible for your daily meals and family feasts without budget strain."
  }
];

export const NutritionalComparison: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ComparisonItemData | null>(null);

  const handleOpenMenu = () => {
    setSelectedItem(null);
    const el = document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="nutrition-comparison" className="py-4 sm:py-16 bg-gradient-to-b from-[#FFF8F2] via-[#FFF5EC] to-[#FFF8F2] relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-10 left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#3ECF6E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
            <Crown className="w-3 h-3 text-[#FF6B35]" />
            <span>PURITY & INTEGRITY MATRIX</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
            Pure Desi Craft <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">vs Commercial Food</span>
          </h2>
          
          <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug line-clamp-1">
            FoodEat Shahi Rasoi compared against regular commercial diners & frozen meals.
          </p>
        </div>

        {/* ================= MOBILE-FIRST ASYMMETRIC BENTO COLLAGE (< md) ================= */}
        <div className="md:hidden space-y-2.5">
          
          <div className="grid grid-cols-2 gap-2">
            
            {/* Card 1: Top Hero Highlight Banner (Col Span 2) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[0])}
              className="col-span-2 rounded-[14px] bg-gradient-to-r from-[#FFF5EC] via-[#FFF9F5] to-white p-2.5 border border-orange-200/80 shadow-2xs hover:shadow-glow flex items-center justify-between cursor-pointer active:scale-98 transition-all h-[66px]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#0B1220] font-heading truncate">
                      Cooking Fat & Medium
                    </h4>
                    <span className="text-[7px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full shrink-0">
                      ✓ Zero Palm
                    </span>
                  </div>
                  <p className="text-[8.5px] font-bold text-gray-500 truncate">
                    100% Vedic Desi Ghee vs Refined Palm Oils
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-1.5">
                <span className="inline-flex items-center gap-0.5 bg-[#FF6B35] text-white px-2 py-1 rounded-full font-black text-[7.5px] shadow-xs">
                  More <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            {/* Card 2: Spices Purity (Col Span 1) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[1])}
              className="col-span-1 rounded-[14px] bg-gradient-to-br from-[#F5FDF7] via-white to-[#EBF9EE] p-2.5 border border-emerald-100/90 shadow-2xs hover:shadow-glow flex flex-col justify-between cursor-pointer active:scale-97 transition-all h-[105px]"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-6 h-6 rounded-lg bg-[#EAF9EF] text-[#2E7D32] flex items-center justify-center shrink-0 shadow-2xs">
                  <Leaf className="w-3 h-3" />
                </div>
                <span className="text-[7px] font-black uppercase text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-full truncate">
                  ✓ Stone Ground
                </span>
              </div>

              <div>
                <h4 className="text-[11.5px] font-black text-[#0B1220] font-heading leading-tight truncate">
                  Spices Purity
                </h4>
                <p className="text-[8.5px] font-bold text-gray-500 leading-tight truncate mt-0.5">
                  Awadhi Whole Spices
                </p>
              </div>

              <div className="pt-1 border-t border-emerald-100/80 flex items-center justify-between text-[7.5px] font-bold">
                <span className="text-gray-400 truncate max-w-[55px]">vs MSG Paste</span>
                <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-[#2E7D32] px-1.5 py-0.2 rounded-full font-black text-[7.5px]">
                  More <ChevronRight className="w-2 h-2" />
                </span>
              </div>
            </div>

            {/* Card 3: Biryani Dum (Col Span 1) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[2])}
              className="col-span-1 rounded-[14px] bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFF8E8] p-2.5 border border-amber-100/90 shadow-2xs hover:shadow-glow flex flex-col justify-between cursor-pointer active:scale-97 transition-all h-[105px]"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-6 h-6 rounded-lg bg-[#FFF8E8] text-[#FF9800] flex items-center justify-center shrink-0 shadow-2xs">
                  <Crown className="w-3 h-3" />
                </div>
                <span className="text-[7px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full truncate">
                  ✓ Handi Dum
                </span>
              </div>

              <div>
                <h4 className="text-[11.5px] font-black text-[#0B1220] font-heading leading-tight truncate">
                  Biryani Dum
                </h4>
                <p className="text-[8.5px] font-bold text-gray-500 leading-tight truncate mt-0.5">
                  4-Hr Charcoal Dum
                </p>
              </div>

              <div className="pt-1 border-t border-amber-100/80 flex items-center justify-between text-[7.5px] font-bold">
                <span className="text-gray-400 truncate max-w-[55px]">vs Microwave</span>
                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-black text-[7.5px]">
                  More <ChevronRight className="w-2 h-2" />
                </span>
              </div>
            </div>

            {/* Card 4: Dal Makhani (Col Span 1) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[3])}
              className="col-span-1 rounded-[14px] bg-gradient-to-br from-[#F5F5FF] via-white to-[#EBF0FF] p-2.5 border border-indigo-100/90 shadow-2xs hover:shadow-glow flex flex-col justify-between cursor-pointer active:scale-97 transition-all h-[105px]"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-3 h-3" />
                </div>
                <span className="text-[7px] font-black uppercase text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-full truncate">
                  ✓ 24-Hr Slow
                </span>
              </div>

              <div>
                <h4 className="text-[11.5px] font-black text-[#0B1220] font-heading leading-tight truncate">
                  Dal Makhani
                </h4>
                <p className="text-[8.5px] font-bold text-gray-500 leading-tight truncate mt-0.5">
                  24-Hour Charcoal Simmer
                </p>
              </div>

              <div className="pt-1 border-t border-indigo-100/80 flex items-center justify-between text-[7.5px] font-bold">
                <span className="text-gray-400 truncate max-w-[55px]">vs 15m Starch</span>
                <span className="inline-flex items-center gap-0.5 bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-black text-[7.5px]">
                  More <ChevronRight className="w-2 h-2" />
                </span>
              </div>
            </div>

            {/* Card 5: Pure Saffron (Col Span 1) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[4])}
              className="col-span-1 rounded-[14px] bg-gradient-to-br from-[#FFF5F9] via-white to-[#FFEBF3] p-2.5 border border-pink-100/90 shadow-2xs hover:shadow-glow flex flex-col justify-between cursor-pointer active:scale-97 transition-all h-[105px]"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-6 h-6 rounded-lg bg-[#FDF2F8] text-[#EC4899] flex items-center justify-center shrink-0 shadow-2xs">
                  <Flower2 className="w-3 h-3" />
                </div>
                <span className="text-[7px] font-black uppercase text-pink-700 bg-pink-100 px-1.5 py-0.2 rounded-full truncate">
                  ✓ Kashmiri
                </span>
              </div>

              <div>
                <h4 className="text-[11.5px] font-black text-[#0B1220] font-heading leading-tight truncate">
                  Pure Saffron
                </h4>
                <p className="text-[8.5px] font-bold text-gray-500 leading-tight truncate mt-0.5">
                  Grade-A Kashmiri Kesar
                </p>
              </div>

              <div className="pt-1 border-t border-pink-100/80 flex items-center justify-between text-[7.5px] font-bold">
                <span className="text-gray-400 truncate max-w-[55px]">vs Yellow Dye</span>
                <span className="inline-flex items-center gap-0.5 bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full font-black text-[7.5px]">
                  More <ChevronRight className="w-2 h-2" />
                </span>
              </div>
            </div>

            {/* Card 6: Bottom Value Highlight Banner (Col Span 2) */}
            <div 
              onClick={() => setSelectedItem(COMPARISON_ROWS[5])}
              className="col-span-2 rounded-[14px] bg-gradient-to-r from-[#FFFDF5] via-[#FFF9ED] to-white p-2.5 border border-amber-200/80 shadow-2xs hover:shadow-glow flex items-center justify-between cursor-pointer active:scale-98 transition-all h-[66px]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-[#0B1220] font-heading truncate">
                      Average Meal Value
                    </h4>
                    <span className="text-[7px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-full shrink-0">
                      ✓ Best Value
                    </span>
                  </div>
                  <p className="text-[8.5px] font-bold text-gray-500 truncate">
                    ₹249+ Gourmet Feast vs ₹1,200+ 5-Star Hotel Markups
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-1.5">
                <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white px-2 py-1 rounded-full font-black text-[7.5px] shadow-xs">
                  More <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

          </div>

          {/* Mobile Trust Strip */}
          <div className="p-2.5 rounded-xl bg-[#0B1220] text-white flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3ECF6E] shrink-0" />
              <span className="text-[9px] font-black text-white truncate">
                100% Shuddh Certified • Zero Palm Oil
              </span>
            </div>
            <span className="text-[8.5px] font-black text-[#FFC94A] shrink-0 flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2 h-2" /> FSSAI 5-Star
            </span>
          </div>

        </div>

        {/* ================= DESKTOP GRAND TABLE (>= md) ================= */}
        <div className="hidden md:block rounded-[28px] bg-white border border-orange-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Table Header */}
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 lg:p-5 text-xs font-black text-gray-400 uppercase tracking-wider w-[28%] bg-gray-50/70">
                    Quality Standard
                  </th>
                  
                  {/* FoodEat Column (Winner Highlight) */}
                  <th className="p-4 lg:p-5 bg-gradient-to-br from-[#FF6B35] to-[#FF4D6D] text-white w-[38%] relative shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white inline-flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 text-[#FFC94A]" /> Shahi Standard
                        </span>
                        <span className="text-xl font-black font-heading tracking-tight block">FoodEat™</span>
                        <p className="text-xs text-orange-100 font-medium">100% Shuddh & Pure Gourmet</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Crown className="w-4 h-4 text-[#FFC94A]" />
                      </div>
                    </div>
                  </th>

                  {/* Supermarket Frozen Column */}
                  <th className="p-4 lg:p-5 text-gray-800 bg-gray-50/90 w-[17%] border-r border-gray-100">
                    <span className="text-xs font-bold text-gray-900 block">Frozen Supermarket</span>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Commercial Ready Packs</p>
                  </th>

                  {/* Commercial Diners Column */}
                  <th className="p-4 lg:p-5 text-gray-800 bg-gray-50/90 w-[17%]">
                    <span className="text-xs font-bold text-gray-900 block">Commercial Diners</span>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Bulk Fast-Food Gravies</p>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100 text-xs">
                {COMPARISON_ROWS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedItem(row)}
                      className="hover:bg-orange-50/30 transition-colors group cursor-pointer"
                    >
                      
                      {/* Metric Name */}
                      <td className="p-4 font-black text-gray-900 bg-gray-50/40">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100/70 text-[#FF6B35] flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-heading text-xs font-black">{row.feature}</span>
                          </div>
                          <span className="text-[9px] font-black text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity">
                            Details →
                          </span>
                        </div>
                      </td>

                      {/* FoodEat Value (Highlighted Winner Cell) */}
                      <td className="p-4 bg-gradient-to-r from-orange-50/70 via-orange-50/50 to-orange-50/70 border-x-2 border-orange-200">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#3ECF6E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-xs leading-snug">
                              {row.pureVibe.text}
                            </p>
                            <span className="inline-block mt-0.5 text-[9px] font-black text-[#2E7D32] bg-[#EAF9EF] px-1.5 py-0.2 rounded border border-[#3ECF6E]/30">
                              ✓ {row.pureVibe.highlight}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Supermarket Value */}
                      <td className="p-4 text-gray-500 font-bold border-r border-gray-100 bg-gray-50/20">
                        <div className="flex items-start gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-tight text-gray-600 text-[11px]">{row.storeFrozen.text}</span>
                        </div>
                      </td>

                      {/* Commercial Diner Value */}
                      <td className="p-4 text-gray-500 font-bold bg-gray-50/20">
                        <div className="flex items-start gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-tight text-gray-600 text-[11px]">{row.cafeBowl.text}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Trust Banner */}
          <div className="p-4 bg-[#0B1220] text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3ECF6E] shrink-0" />
              <span className="text-xs font-black tracking-wide">
                FoodEat™ 100% Shuddh Certified: Zero Palm Oil • Zero Vanaspati • Earthen Clay Dum
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
              <span className="flex items-center gap-1 text-[#FFC94A]">
                <Sparkles className="w-3 h-3 text-[#FFC94A]" /> FSSAI Approved
              </span>
              <span>•</span>
              <span className="text-[#3ECF6E]">#10020011005829</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= INTERACTIVE PURITY DETAIL MODAL ("MORE" POPUP) ================= */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl border border-gray-100 p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 text-left"
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

            {/* Header */}
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

            {/* Head-to-Head Comparison Box */}
            <div className="space-y-2 pt-1">
              
              {/* FoodEat Winner Standard */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EAF9EF] to-[#F3FCF6] border-2 border-[#3ECF6E]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black text-[#2E7D32] flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#3ECF6E]" /> FoodEat™ Purity Benchmark
                  </span>
                  <span className="text-[9px] font-black text-white bg-[#2E7D32] px-2 py-0.5 rounded-full shadow-2xs">
                    ✓ Certified
                  </span>
                </div>
                <div className="space-y-1.5">
                  {selectedItem.foodEatPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5 stroke-[3]" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Diners Flaws */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Commercial Market Standard
                  </span>
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    ✕ Compromised
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedItem.commercialFlaws.map((flaw, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10.5px] sm:text-xs text-gray-500 font-medium">
                      <X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                      <span>{flaw}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Health & Digestive Impact */}
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/60 text-[11px] sm:text-xs text-gray-700 font-medium leading-relaxed">
              <strong className="text-gray-900 block font-black mb-0.5">🌟 Health & Taste Impact:</strong>
              {selectedItem.healthImpact}
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2.5">
              <button
                onClick={handleOpenMenu}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs sm:text-sm font-black shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Taste Pure Dishes</span>
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
