"use client";

import React from "react";
import { 
  Sprout, 
  Flame, 
  PackageOpen, 
  Clock3, 
  ShieldCheck, 
  Recycle,
  Sparkles,
  CheckCircle2,
  ChefHat
} from "lucide-react";

export const FarmToBowlProcess: React.FC = () => {
  const steps = [
    {
      stepNumber: "01",
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      title: "Heritage Farm Sourcing",
      tagline: "100% Pure Cow Desi Ghee & Spices",
      description: "Direct partnerships with single-estate spice farms in Wayanad, authentic Kashmiri saffron cultivators, and organic dairy gaushalas.",
      badge: "Zero Adulteration"
    },
    {
      stepNumber: "02",
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "Stone-Ground Sil-Batta Masalas",
      tagline: "Cold Crushed for Maximum Aroma",
      description: "Whole cardamom, mace, cinnamon, and deghi mirch stone-crushed at low RPM to retain precious natural aromatic oils and digestive qualities.",
      badge: "No Artificial Flavors"
    },
    {
      stepNumber: "03",
      icon: <Flame className="w-6 h-6 text-[#FF6B35]" />,
      title: "Clay Handi Slow Dum Cooking",
      tagline: "4 to 24 Hours on Charcoal Embers",
      description: "Sealed with fresh whole wheat dough to trap every drop of royal steam, allowing marinades to tenderize meats and infuse basmati rice.",
      badge: "Traditional Awadhi Craft"
    },
    {
      stepNumber: "04",
      icon: <Clock3 className="w-6 h-6 text-rose-500" />,
      title: "30-Min Thermal Pod Dispatch",
      tagline: "Piping Hot at 75°C to Your Door",
      description: "Dispatched in custom temperature-regulated thermal eco-pods so your Shahi Biryani and buttery naans arrive fresh from the tandoor.",
      badge: "Guaranteed Hot"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF6B35] bg-[#FFF0E5] px-3.5 py-1.5 rounded-full border border-[#FF6B35]/20">
            THE SHAHI RASOI METHOD
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 font-heading">
            From Sacred Soils to Your Royal Feast
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            No shortcuts, no palm oil, no artificial preservatives. We honor the royal culinary arts of India the way master chefs have prepared for centuries.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((item, idx) => (
            <div 
              key={idx}
              className="relative rounded-3xl p-6 sm:p-7 bg-slate-50/80 border border-gray-100/90 shadow-soft-card hover:shadow-glow-lg hover:border-orange-200 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Step number watermark */}
              <div className="absolute top-4 right-5 text-4xl font-black text-gray-200/70 font-heading select-none group-hover:text-orange-200 transition-colors">
                {item.stepNumber}
              </div>

              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Badge */}
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100/70 px-2.5 py-1 rounded-md mb-2 inline-block">
                  {item.badge}
                </span>

                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 font-heading mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-[#FF6B35] mb-3">
                  {item.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-200/60 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Shuddh & Pure Verified</span>
              </div>
            </div>
          ))}

        </div>

        {/* Sustainability Banner Callout */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#12121A] via-[#2A1E24] to-[#12121A] text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#FF6B35]/20 rounded-full blur-2xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold">
                <ChefHat className="w-3.5 h-3.5" /> TRADITIONAL EARTHENWARE & ECO PACKAGING
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading">
                Zero Plastic. Authentic Clay Handi & Biodegradable Boxes.
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Our royal biryanis are delivered in genuine reusable clay handis that retain natural earthen minerals. All packaging is 100% plastic-free, food-grade certified, and fully recyclable.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <p className="text-lg font-black text-amber-300 font-heading">100% Handcrafted</p>
                <p className="text-xs text-gray-300">Natural clay handi vessels</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <p className="text-lg font-black text-[#3ECF6E] font-heading">Zero Plastic</p>
                <p className="text-xs text-gray-300">Completely compostable cutlery & boxes</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
