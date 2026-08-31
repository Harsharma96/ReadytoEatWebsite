"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Flame, 
  Clock, 
  Plus, 
  ChevronDown
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const { addToCart, openQuickView } = useCart();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPizzaHovered, setIsPizzaHovered] = useState(false);
  const [productsList, setProductsList] = useState(PRODUCTS);

  const fetchHeroProducts = () => {
    fetch(`/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length >= 2) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});
  };

  React.useEffect(() => {
    fetchHeroProducts();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "foodeat_menu_last_updated") {
        fetchHeroProducts();
      }
    };
    const handleFocus = () => {
      fetchHeroProducts();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const burgerProduct = productsList.find((p) => p.category?.toLowerCase().includes("burger")) || productsList[0] || PRODUCTS[0];
  const pizzaProduct = productsList.find((p) => p.category?.toLowerCase().includes("pizza")) || productsList[1] || PRODUCTS[1];

  // Mouse Parallax Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative flex flex-col justify-center overflow-hidden pt-4 pb-8 sm:py-16 lg:py-20 aurora-mesh-bg"
    >
      {/* Huge Transparent Watermark Text Behind Hero (8% Opacity) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-[#0B1220]/[0.08] select-none pointer-events-none whitespace-nowrap font-heading tracking-tighter leading-none z-0">
        FOOD EAT
      </div>

      {/* Mouse Follow Spotlight (Desktop only for max mobile performance) */}
      <div
        className="hidden md:block absolute pointer-events-none -z-0 w-[500px] h-[500px] rounded-full bg-radial from-[#FF6B35]/20 via-[#FF8A00]/10 to-transparent filter blur-3xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 120}px, ${mousePos.y * 120}px, 0)`,
          left: "calc(50% - 250px)",
          top: "calc(50% - 250px)",
        }}
      />

      {/* Liquid Ketchup / Sauce Splash Shimmer Behind Center Stage */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] pointer-events-none -z-0 opacity-85 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(-50%, -50%) translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)`,
        }}
      >
        <svg viewBox="0 0 600 500" className="w-full h-full filter drop-shadow-2xl">
          <defs>
            <linearGradient id="sauceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FF8A00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF4D6D" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <path
            fill="url(#sauceGradient)"
            d="M320,40 C420,20 520,90 540,190 C560,290 490,410 390,450 C290,490 140,460 70,370 C0,280 20,150 110,80 C200,10 220,60 320,40 Z"
          />
        </svg>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* ================= DESKTOP & TABLET HERO (md: and above) ================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Heading & CTAs (6 Cols) */}
          <div className="md:col-span-6 lg:col-span-7 space-y-5 lg:space-y-6 text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-[#FF6B35]/30 shadow-soft-card">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF6B35] animate-ping" />
              <span className="text-xs font-bold text-gray-900 tracking-normal">
                👑 Royal Indian Flavors • 30-Min Hot Handi Dispatch
              </span>
            </div>

            {/* Giant Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-black text-[#0B1220] leading-[1.04] tracking-tight font-heading">
              Shahi Taste. <br />
              <span className="gradient-text-hero">Royal Heritage.</span> <br />
              <span className="relative inline-block">
                Delivered Hot.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#FFC94A]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                  <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl font-normal leading-relaxed">
              Experience slow-cooked Awadhi Dum Biryanis, 24-hour charcoal-simmered Dal Makhani, and smoky tandoori kebabs made with 100% pure desi ghee.
            </p>

            {/* Micro Feature Highlights */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md text-left pt-1">
              <div className="glass-card p-3 rounded-2xl border border-white flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="text-xs font-black text-gray-900">30 Mins</p>
                  <p className="text-[9px] text-gray-500 font-bold">Fast Handi</p>
                </div>
              </div>
              <div className="glass-card p-3 rounded-2xl border border-white flex items-center gap-2">
                <span className="text-xl">🏺</span>
                <div>
                  <p className="text-xs font-black text-gray-900">100% Pure</p>
                  <p className="text-[9px] text-[#3ECF6E] font-bold">Desi Ghee</p>
                </div>
              </div>
              <div className="glass-card p-3 rounded-2xl border border-white flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs font-black text-gray-900">4.98 Rating</p>
                  <p className="text-[9px] text-[#FF8A00] font-bold">5,000+ Patrons</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#menu"
                className="px-8 py-4 rounded-2xl gradient-button-primary text-white font-black text-base transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95 btn-ripple shadow-glow"
              >
                <span>Explore Shahi Menu</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </a>

              <a
                href="#bundle-builder"
                className="px-6 py-4 rounded-2xl glass-card hover:bg-white text-gray-900 font-bold text-sm border border-white/80 shadow-soft-card hover:border-[#FF6B35]/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span>Build Shahi Thali (-25%)</span>
              </a>
            </div>

          </div>

          {/* RIGHT: Dual 3D Animated Floating Showcase (6 Cols) */}
          <div className="md:col-span-6 lg:col-span-5 relative perspective-stage flex items-center justify-center">
            
            {/* Primary Main Floating Dish Card */}
            <div 
              className="relative mx-auto max-w-sm w-full transition-transform duration-300 ease-out animate-float-slow"
              style={{
                transform: `rotateY(${mousePos.x * 16}deg) rotateX(${-mousePos.y * 16}deg)`,
              }}
            >
              {/* Outer Radiant Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF6B35]/30 via-[#FF8A00]/20 to-[#FF4D6D]/25 rounded-[3rem] blur-2xl -z-10 animate-pulse-glow" />

              {/* Main Card Container */}
              <div className="relative rounded-[2.5rem] glass-card p-6 shadow-2xl border border-white overflow-hidden group">
                
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#FFF0E5] text-[#FF6B35] tracking-wide border border-[#FF6B35]/30">
                    🔥 Chef Shahi Signature
                  </span>
                  <div className="flex items-center gap-1 text-xs font-black text-gray-800">
                    <Star className="w-3.5 h-3.5 fill-[#FFC94A] text-[#FFC94A]" />
                    <span>4.98</span>
                  </div>
                </div>

                {/* Center 3D Biryani Image */}
                <div 
                  onClick={() => openQuickView(burgerProduct)}
                  className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-gradient-to-br from-white to-orange-50/50 cursor-pointer shadow-md group"
                >
                  <img
                    src={burgerProduct.images[0]}
                    alt={burgerProduct.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Saffron & Desi Ghee Badge */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[11px] font-bold shadow-lg flex items-center gap-1">
                    <span>🍚 Kashmiri Saffron</span>
                    <span className="text-[#FFC94A] text-[9px] font-black">• Pure Desi Ghee</span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-gray-900 text-[11px] font-black shadow-lg">
                    ₹{burgerProduct.price}
                  </div>
                </div>

                {/* Name & Quick Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 font-heading">
                      {burgerProduct.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      Slow Handi Dum • Fragrant Zafran Basmati
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(burgerProduct, 1)}
                    className="p-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white shadow-glow hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Add to Royal Bag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Secondary Floating Mini Card (Pure Veg Badge on side) */}
            <div 
              onClick={() => openQuickView(pizzaProduct)}
              className="hidden lg:flex absolute -bottom-6 -left-12 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-xl items-center gap-3 animate-float-reverse cursor-pointer group hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-orange-50 shrink-0">
                <img src={pizzaProduct.images[0]} alt={pizzaProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left pr-2">
                <span className="text-[9px] font-black text-[#3ECF6E] bg-emerald-50 px-1.5 py-0.5 rounded uppercase">🌱 100% Veg</span>
                <p className="text-xs font-black text-gray-900 truncate max-w-[110px] mt-0.5">{pizzaProduct.name}</p>
                <p className="text-[10px] font-bold text-[#FF6B35]">₹{pizzaProduct.price}</p>
              </div>
            </div>

          </div>

        </div>

        {/* ================= MOBILE PHONE HERO (Side-by-Side Split View) ================= */}
        <div className="md:hidden space-y-3 pt-1">
          
          {/* Top Royal Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-[#FF6B35]/30 shadow-soft-card">
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B35] animate-ping" />
            <span className="text-[9.5px] font-black text-gray-900 uppercase tracking-wider">
              👑 ROYAL HERITAGE • 30-MIN HOT DISPATCH
            </span>
          </div>

          {/* Side-by-Side 2-Column Row: Left (Text & CTA) | Right (Animated Floating Dish) */}
          <div className="grid grid-cols-12 gap-2.5 items-center">
            
            {/* Left Side: Headline & Order Button (7 Cols) */}
            <div className="col-span-7 space-y-2 text-left pr-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] leading-[1.12] font-heading tracking-tight">
                Shahi Taste. <br />
                <span className="gradient-text-hero">Royal Heritage.</span> <br />
                <span className="relative inline-block text-[#0B1220]">
                  Delivered Hot.
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-[#FFC94A]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed font-medium">
                Awadhi Dum Biryanis & Dal Makhani cooked in 100% pure desi ghee.
              </p>

              <div className="pt-1 flex flex-col gap-1.5">
                <a
                  href="#menu"
                  className="w-full py-2.5 px-3 rounded-xl gradient-button-primary text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-glow"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#bundle-builder"
                  className="w-full py-1.5 px-2 rounded-xl bg-white/90 text-gray-800 font-bold text-[10.5px] border border-gray-200 text-center truncate active:scale-95 shadow-2xs hover:bg-white"
                >
                  Build Thali (-25%)
                </a>
              </div>
            </div>

            {/* Right Side: Animated Floating 3D Dish Showcase (5 Cols) */}
            <div className="col-span-5 relative flex justify-center">
              <div 
                onClick={() => openQuickView(burgerProduct)}
                className="relative w-full max-w-[165px] rounded-[24px] bg-white/95 backdrop-blur-xl p-2.5 shadow-[0_12px_35px_rgba(255,107,53,0.18)] border border-white group cursor-pointer animate-float-slow transition-all"
              >
                {/* Radiant Glow Halo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF6B35]/35 via-[#FF8A00]/25 to-[#FF4D6D]/20 rounded-[28px] blur-md -z-10 animate-pulse-glow" />

                {/* Top Badge Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black bg-[#FFF0E5] text-[#FF6B35] border border-[#FF6B35]/20">
                    🔥 Chef Pick
                  </span>
                  <span className="text-[9px] font-black text-gray-800 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-[#FFC94A] text-[#FFC94A]" /> 4.98
                  </span>
                </div>

                {/* Food Image Frame */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50/60 my-1 shadow-2xs">
                  <img
                    src={burgerProduct.images[0]}
                    alt={burgerProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Floating Saffron Desi Ghee Pill */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#FF6B35] text-white text-[7.5px] font-black tracking-wide shadow-xs">
                    Pure Ghee
                  </div>

                  {/* Floating Price */}
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[10px] font-black shadow-xs">
                    ₹{burgerProduct.price}
                  </div>
                </div>

                {/* Dish Name & Quick View Hint */}
                <div className="mt-1">
                  <p className="text-[11px] font-black text-gray-900 truncate leading-tight">
                    {burgerProduct.name}
                  </p>
                  <div className="flex items-center justify-between mt-0.5 text-[9px]">
                    <span className="text-gray-400 font-bold">Slow Dum</span>
                    <span className="text-[#FF6B35] font-black">+ View</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Micro Feature Highlights Bar */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="glass-card p-2 rounded-xl border border-white flex items-center justify-center gap-1.5 text-center shadow-xs">
              <span className="text-xs">⚡</span>
              <div>
                <p className="text-[10px] font-black text-gray-900 leading-tight">30 Mins</p>
                <p className="text-[8px] text-gray-500 font-bold">Fast Handi</p>
              </div>
            </div>
            <div className="glass-card p-2 rounded-xl border border-white flex items-center justify-center gap-1.5 text-center shadow-xs">
              <span className="text-xs">🏺</span>
              <div>
                <p className="text-[10px] font-black text-gray-900 leading-tight">100% Pure</p>
                <p className="text-[8px] text-[#3ECF6E] font-bold">Desi Ghee</p>
              </div>
            </div>
            <div className="glass-card p-2 rounded-xl border border-white flex items-center justify-center gap-1.5 text-center shadow-xs">
              <span className="text-xs">⭐</span>
              <div>
                <p className="text-[10px] font-black text-gray-900 leading-tight">4.98 ★</p>
                <p className="text-[8px] text-[#FF8A00] font-bold">5k+ Patrons</p>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="pt-6 sm:pt-10 text-center flex flex-col items-center justify-center">
          <a
            href="#trending"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-amber-300 font-bold text-xs shadow-lg transition-all active:scale-95 group"
          >
            <span>Scroll to Explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};
