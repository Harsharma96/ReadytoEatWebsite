"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  itemsCount: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "burgers",
    name: "Burgers & Wraps",
    emoji: "🍔",
    itemsCount: "Smash & Crispy",
    color: "#FF6B35",
    bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
    borderColor: "border-[#FF6B35]/30",
  },
  {
    id: "pizzas",
    name: "Pizzas & Breads",
    emoji: "🍕",
    itemsCount: "Cheese Burst & Sourdough",
    color: "#FF4D6D",
    bgGradient: "from-[#FFE8EC] to-[#FFD5DC]",
    borderColor: "border-[#FF4D6D]/30",
  },
  {
    id: "snacks",
    name: "Snacks & Chaat",
    emoji: "🍟",
    itemsCount: "Peri Fries & Pani Puri",
    color: "#FF8A00",
    bgGradient: "from-[#FFF4E5] to-[#FFE6CC]",
    borderColor: "border-[#FF8A00]/30",
  },
  {
    id: "chinese",
    name: "Chinese & Momos",
    emoji: "🥢",
    itemsCount: "Noodles & Dim Sums",
    color: "#E85620",
    bgGradient: "from-[#FFF2EB] to-[#FCD1B8]",
    borderColor: "border-[#E85620]/30",
  },
  {
    id: "biryani",
    name: "Biryani & North Indian",
    emoji: "🍚",
    itemsCount: "Dum Biryani & Butter Chicken",
    color: "#D4A373",
    bgGradient: "from-[#FFFBF5] to-[#EFE1CE]",
    borderColor: "border-[#D4A373]/30",
  },
  {
    id: "gujarati",
    name: "Gujarati & Thalis",
    emoji: "🟡",
    itemsCount: "Undhiyu & Dhokla",
    color: "#FFC94A",
    bgGradient: "from-[#FFF9E6] to-[#FFEAB3]",
    borderColor: "border-[#FFC94A]/30",
  },
  {
    id: "south-indian",
    name: "South Indian",
    emoji: "🥥",
    itemsCount: "Ghee Dosa & Idli",
    color: "#3ECF6E",
    bgGradient: "from-[#EAF9EF] to-[#D5F5E0]",
    borderColor: "border-[#3ECF6E]/30",
  },
  {
    id: "desserts",
    name: "Desserts & Shakes",
    emoji: "🍰",
    itemsCount: "Choco Lava & Lassi",
    color: "#E0A96D",
    bgGradient: "from-[#FFF8F2] to-[#F5D8BF]",
    borderColor: "border-[#E0A96D]/30",
  },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FFF8F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-xs font-black border border-[#FF6B35]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE ALL FAVORITES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1220] font-heading">
              Cravings for Every Mood
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Smash Burgers, Cheese Burst Pizzas, Peri Peri Fries, Steamed Dim Sums, Royal Biryanis, Gujarati Thalis, and Molten Lava Cakes.
            </p>
          </div>

          <a
            href="#menu"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-black text-[#FF6B35] hover:text-[#E85620] transition-colors group"
          >
            <span>View Full Menu & Filters</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* Categories Horizontal Grid (8 items) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href="#menu"
              className={`group rounded-3xl p-5 bg-gradient-to-b ${cat.bgGradient} border ${cat.borderColor} text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow active:scale-95`}
            >
              {/* Circular Emoji Badge with Hover Rotation & Glow */}
              <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-3xl mb-3 shadow-xs group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300">
                {cat.emoji}
              </div>

              <div>
                <h3 className="text-xs font-black text-[#0B1220] font-heading group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-500 block mt-0.5 line-clamp-1">
                  {cat.itemsCount}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
