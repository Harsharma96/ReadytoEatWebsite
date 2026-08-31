"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { 
  X, 
  Star, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Clock, 
  Flame,
  Zap,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  Coffee,
  CheckCheck
} from "lucide-react";
import { CustomizationGroup } from "@/types/product";

export const QuickViewModal: React.FC = () => {
  const { 
    isQuickViewOpen, 
    closeQuickView, 
    quickViewProduct: product, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsCartOpen
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"customize" | "overview" | "nutrition" | "ingredients" | "reviews">("customize");

  // Interactive Customization State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Initialize customizations based on default options or category presets
  useEffect(() => {
    if (!product) return;

    setActiveImageIndex(0);
    setQuantity(1);

    const initialSelections: Record<string, string[]> = {};

    if (product.customizations && product.customizations.length > 0) {
      product.customizations.forEach((group) => {
        const defaultOpt = group.options.find((o) => o.isDefault) || (group.type === "single" ? group.options[0] : null);
        if (defaultOpt) {
          initialSelections[group.id] = [defaultOpt.id];
        } else {
          initialSelections[group.id] = [];
        }
      });
    } else {
      // Default fallbacks based on category
      if (product.category === "Burgers & Wraps") {
        initialSelections["bun"] = ["brioche"];
        initialSelections["addons"] = [];
      } else if (product.category === "Pizzas & Garlic Breads") {
        initialSelections["crust"] = ["cheese_burst"];
        initialSelections["toppings"] = [];
      } else if (product.category === "Chai, Coffee & Juices") {
        initialSelections["sugar"] = ["normal_sugar"];
        initialSelections["temp"] = ["chilled"];
      }
    }

    setSelectedOptions(initialSelections);
  }, [product]);



  if (!isQuickViewOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);

  // Dynamic Customizations List
  const defaultBurgerCustomizations: CustomizationGroup[] = [
    {
      id: "bun",
      title: "🍞 Choose Artisan Bun",
      type: "single",
      options: [
        { id: "brioche", name: "Butter Toasted Brioche Bun", price: 0, isDefault: true },
        { id: "multigrain", name: "Whole Wheat Multigrain Bun", price: 20 },
        { id: "charcoal", name: "Gluten-Free Charcoal Bun", price: 30 },
      ]
    },
    {
      id: "addons",
      title: "🧀 Cheese & Patty Upgrades",
      type: "multiple",
      options: [
        { id: "extra_cheese", name: "Extra Melted Cheddar Slice", price: 30 },
        { id: "extra_patty", name: "Add Extra Smashed Patty", price: 80 },
        { id: "grilled_onions", name: "Caramelized Butter Onions", price: 20 },
      ]
    },
    {
      id: "combo",
      title: "🍟 Make It A Meal Combo",
      type: "single",
      options: [
        { id: "no_combo", name: "Solo Dish", price: 0, isDefault: true },
        { id: "fries_coke", name: "Add Peri-Peri Fries + Cold Drink", price: 99 },
        { id: "nachos_shake", name: "Add Loaded Nachos + Thick Shake", price: 159 },
      ]
    }
  ];

  const defaultPizzaCustomizations: CustomizationGroup[] = [
    {
      id: "crust",
      title: "🍕 Crust Selection",
      type: "single",
      options: [
        { id: "cheese_burst", name: "Cheese Burst Liquid Core", price: 0, isDefault: true },
        { id: "thin_crust", name: "Ultra Thin Sourdough Crust", price: 0 },
        { id: "garlic_crust", name: "Stuffed Garlic Herb Crust", price: 49 },
      ]
    },
    {
      id: "toppings",
      title: "🧄 Extra Gourmet Dips & Add-ons",
      type: "multiple",
      options: [
        { id: "extra_mozzarella", name: "Extra Stringy Mozzarella", price: 49 },
        { id: "jalapeno_dip", name: "Cheesy Jalapeno Dip Cup", price: 39 },
        { id: "cold_drink", name: "Add Chilled Cold Drink (350ml)", price: 49 },
      ]
    }
  ];

  const defaultBeverageCustomizations: CustomizationGroup[] = [
    {
      id: "sugar",
      title: "🍬 Sweetness Preference",
      type: "single",
      options: [
        { id: "normal_sugar", name: "Classic Sweetness (100%)", price: 0, isDefault: true },
        { id: "less_sugar", name: "Mild Sweetness (50%)", price: 0 },
        { id: "zero_sugar", name: "Zero Sugar / Sugar-Free (0%)", price: 0 },
      ]
    },
    {
      id: "temp",
      title: "🧊 Serving Temperature",
      type: "single",
      options: [
        { id: "chilled", name: "Ice Cold with Crushed Ice", price: 0, isDefault: true },
        { id: "warm", name: "Steaming Hot in Thermal Cup", price: 0 },
      ]
    },
    {
      id: "milk_upgrade",
      title: "🥛 Milk & Boosters",
      type: "multiple",
      options: [
        { id: "oat_milk", name: "Switch to Organic Oat Milk", price: 40 },
        { id: "extra_shot", name: "Add Extra Espresso Shot / Kesar", price: 35 },
      ]
    }
  ];

  const defaultDessertCustomizations: CustomizationGroup[] = [
    {
      id: "serving_temp",
      title: "♨️ Serving Temperature & Style",
      type: "single",
      options: [
        { id: "piping_hot", name: "Piping Hot in Clay Matka", price: 0, isDefault: true },
        { id: "room_temp", name: "Classic Warm / Room Temp", price: 0 },
        { id: "chilled", name: "Chilled Saffron Style", price: 0 },
      ]
    },
    {
      id: "dry_fruits",
      title: "🌰 Royal Dry Fruit & Saffron Upgrades",
      type: "multiple",
      options: [
        { id: "extra_almonds", name: "Roasted Mamra Badam & Pista (+25g)", price: 35 },
        { id: "kesar_infusion", name: "Kashmiri Kesar Saffron Infusion", price: 40 },
        { id: "silver_vark", name: "100% Pure 24K Chandi Vark Foil", price: 25 },
      ]
    },
    {
      id: "dessert_combo",
      title: "🍨 Make It A Royal Dawat Combo",
      type: "single",
      options: [
        { id: "solo_dessert", name: "Solo Dish", price: 0, isDefault: true },
        { id: "rabdi_combo", name: "Add Shahi Malai Rabdi Cup", price: 69 },
        { id: "kulfi_combo", name: "Add Kesar Pista Matka Kulfi", price: 79 },
      ]
    }
  ];

  const defaultBiryaniCustomizations: CustomizationGroup[] = [
    {
      id: "portion",
      title: "🍚 Portion Size & Packing",
      type: "single",
      options: [
        { id: "single_handi", name: "Single Royal Portion (500g)", price: 0, isDefault: true },
        { id: "grand_handi", name: "Maharaja Family Handi (1kg)", price: 249 },
      ]
    },
    {
      id: "spice_level",
      title: "🌶️ Spice Tolerance Level",
      type: "single",
      options: [
        { id: "mild", name: "Mild Shahi Awadhi Flavor", price: 0 },
        { id: "medium", name: "Classic Medium Dum Spice", price: 0, isDefault: true },
        { id: "spicy", name: "Extra Spicy Hyderabadi Mirch", price: 0 },
      ]
    },
    {
      id: "accompaniments",
      title: "🍲 Dips & Accompaniments",
      type: "multiple",
      options: [
        { id: "burani_raita", name: "Extra Burani Garlic Raita", price: 35 },
        { id: "salan_gravy", name: "Extra Mirchi Ka Salan Gravy", price: 30 },
        { id: "boiled_egg", name: "Add Desi Ghee Golden Fried Eggs (2 pcs)", price: 40 },
      ]
    }
  ];

  const isDessert = 
    product.category?.toLowerCase().includes("dessert") || 
    product.category?.toLowerCase().includes("halwua") || 
    product.category?.toLowerCase().includes("mithai") ||
    product.name?.toLowerCase().includes("halwa") ||
    product.name?.toLowerCase().includes("haluwa");

  const isBiryani = 
    product.category?.toLowerCase().includes("biryani") || 
    product.category?.toLowerCase().includes("north") ||
    product.category?.toLowerCase().includes("thali") ||
    product.category?.toLowerCase().includes("gujarati");

  const activeCustomizations = product.customizations && product.customizations.length > 0
    ? product.customizations
    : product.category === "Burgers & Wraps"
    ? defaultBurgerCustomizations
    : product.category === "Pizzas & Garlic Breads"
    ? defaultPizzaCustomizations
    : product.category === "Chai, Coffee & Juices"
    ? defaultBeverageCustomizations
    : isDessert
    ? defaultDessertCustomizations
    : isBiryani
    ? defaultBiryaniCustomizations
    : defaultBurgerCustomizations;

  // Toggle single or multiple option selection (Supports 1-click Select & Deselect)
  const handleOptionToggle = (groupId: string, optionId: string, type: "single" | "multiple") => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (type === "single") {
        // If already selected, clicking it again DESELECTS it (unselects)!
        if (current.includes(optionId)) {
          return { ...prev, [groupId]: [] };
        }
        return { ...prev, [groupId]: [optionId] };
      } else {
        // Multiple choice: toggle on/off
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [groupId]: next };
      }
    });
  };

  // Calculate Extra Add-ons Price
  let extraCustomizationsTotal = 0;
  activeCustomizations.forEach((group) => {
    const selectedIds = selectedOptions[group.id] || [];
    group.options.forEach((opt) => {
      if (selectedIds.includes(opt.id)) {
        extraCustomizationsTotal += opt.price;
      }
    });
  });

  const basePrice = isSubscription ? Math.round(product.price * 0.85) : product.price;
  const unitPrice = basePrice + extraCustomizationsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    // Generate customization notes for cart
    const selectedLabels: string[] = [];
    activeCustomizations.forEach((g) => {
      const selectedIds = selectedOptions[g.id] || [];
      g.options.forEach((opt) => {
        if (selectedIds.includes(opt.id) && (opt.price > 0 || !opt.isDefault)) {
          selectedLabels.push(opt.name);
        }
      });
    });

    const customProduct = {
      ...product,
      price: unitPrice,
      shortDescription: selectedLabels.length > 0 
        ? `Customized: ${selectedLabels.join(" • ")}` 
        : product.shortDescription
    };

    addToCart(customProduct, quantity, isSubscription);
    closeQuickView();
    setIsCartOpen(true);
  };

  return (
    <div 
      onClick={closeQuickView}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150 touch-none overscroll-contain"
    >
      
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#FF6B35]/20 flex flex-col lg:flex-row max-h-[90vh] animate-in zoom-in-95 duration-150 touch-auto overscroll-contain"
      >
        
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center text-gray-500 shadow-md transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Badges */}
        <div className="lg:w-5/12 p-5 sm:p-7 bg-[#FFF8F2] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
          <div>
            {/* Main Image with Steam & Zoom */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-soft-card mb-3 group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Veg / Non-Veg & Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-black text-white shadow-md bg-[#FF6B35]">
                  {product.badge}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/95 text-gray-800 shadow-xs flex items-center gap-1.5 w-fit">
                  <div className={`w-2 h-2 rounded-full ${product.isVeg !== false ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span>{product.isVeg !== false ? "100% Pure Veg" : "Authentic Non-Veg"}</span>
                </span>
              </div>

              {/* Live Prep Time & Spice */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/75 text-white backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF6B35]" />
                  <span>{product.prepTimeMinutes || 15}m</span>
                </span>
                {product.spiceLevel && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/75 text-white backdrop-blur-md">
                    {"🌶️".repeat(product.spiceLevel)}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#FF6B35] scale-105 shadow-xs"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sourcing & Thermal Dispatch Badge */}
          <div className="grid grid-cols-2 gap-2 pt-4 text-[10px] font-black text-gray-700">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-gray-200">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Farm Fresh</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-gray-200">
              <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>25-Min Thermal Pod</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer, Tabs & Live Cart Button */}
        <div className="lg:w-7/12 p-4 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[80vh] lg:max-h-none no-scrollbar">
          
          <div className="space-y-4">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-[#FF6B35] uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {product.tagline}
              </p>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex border-b border-gray-100 gap-3 text-xs font-black overflow-x-auto no-scrollbar">
              {[
                { id: "customize", label: "✨ Choices & Add-ons" },
                { id: "overview", label: "Overview" },
                { id: "nutrition", label: "Nutrition" },
                { id: "ingredients", label: "Ingredients" },
                { id: "reviews", label: `Reviews (${product.reviewsList?.length || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2.5 transition-all whitespace-nowrap cursor-pointer relative ${
                    activeTab === tab.id
                      ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="text-xs leading-relaxed text-gray-600 min-h-[160px]">
              
              {/* ================= 1. INTERACTIVE CUSTOMIZER TAB ================= */}
              {activeTab === "customize" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-gray-500">
                      💡 Click any item to select, click again to <span className="text-[#FF6B35] font-black">deselect</span>
                    </span>
                    {Object.values(selectedOptions).some((arr) => arr && arr.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          const cleared: Record<string, string[]> = {};
                          activeCustomizations.forEach((g) => {
                            cleared[g.id] = [];
                          });
                          setSelectedOptions(cleared);
                        }}
                        className="text-[10px] font-black text-[#FF6B35] hover:text-[#E85620] cursor-pointer hover:underline"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                  
                  {activeCustomizations.map((group) => {
                    const selected = selectedOptions[group.id] || [];

                    return (
                      <div key={group.id} className="p-3.5 rounded-2xl bg-[#FFF8F2]/60 border border-[#FF6B35]/15 space-y-2.5">
                        
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900 text-xs">
                            {group.title}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {group.type === "single" ? "Single Choice (Click to toggle/deselect)" : "Optional Add-ons"}
                          </span>
                        </div>

                        {/* Options Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.options.map((opt) => {
                            const isChosen = selected.includes(opt.id);

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleOptionToggle(group.id, opt.id, group.type)}
                                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-98 ${
                                  isChosen
                                    ? "bg-[#12121A] text-white border-[#12121A] shadow-xs scale-101 ring-1 ring-[#FF6B35]/50"
                                    : "bg-white hover:bg-orange-50/50 text-gray-800 border-gray-200 hover:border-[#FF6B35]/40"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                                    isChosen ? "bg-[#FF6B35] text-white shadow-xs" : "border border-gray-300 bg-gray-50"
                                  }`}>
                                    {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="font-bold text-[11px] truncate">
                                    {opt.name}
                                  </span>
                                </div>

                                <span className={`text-[11px] font-black ml-1.5 shrink-0 ${
                                  isChosen ? "text-[#FF6B35]" : "text-gray-500"
                                }`}>
                                  {opt.price === 0 ? "Free" : `+₹${opt.price}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}

                  {extraCustomizationsTotal > 0 && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-xs">
                      <span>✓ Upgrades Applied:</span>
                      <span>+₹{extraCustomizationsTotal}</span>
                    </div>
                  )}

                </div>
              )}

              {/* ================= 2. OVERVIEW TAB ================= */}
              {activeTab === "overview" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p>{product.fullDescription}</p>
                  
                  <div className="space-y-1.5 pt-1">
                    <span className="font-black text-gray-900 block">Chef & Sourcing Highlights:</span>
                    {product.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-gray-600">
                        <Check className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FFF0E5] border border-[#FF6B35]/20 text-[#0B1220]">
                    <span className="font-black text-[#FF6B35]">Chef&apos;s Serving Tip: </span>
                    {product.servingSuggestion}
                  </div>
                </div>
              )}

              {/* ================= 3. NUTRITION TAB ================= */}
              {activeTab === "nutrition" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Calories</span>
                      <span className="text-sm font-black text-gray-900">{product.nutrition.calories} kcal</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Protein</span>
                      <span className="text-sm font-black text-emerald-700">{product.nutrition.protein}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Fiber</span>
                      <span className="text-sm font-black text-gray-900">{product.nutrition.fiber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 4. INGREDIENTS TAB ================= */}
              {activeTab === "ingredients" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <p className="font-bold text-gray-700">100% Authentic Sourcing:</p>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                        <span className="text-gray-800 font-medium">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ================= 5. REVIEWS TAB ================= */}
              {activeTab === "reviews" && (
                <div className="space-y-3 max-h-44 overflow-y-auto animate-in fade-in duration-200">
                  {product.reviewsList && product.reviewsList.length > 0 ? (
                    product.reviewsList.map((rev) => (
                      <div key={rev.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{rev.userName}</span>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-700 font-semibold">{rev.title}</p>
                        <p className="text-[11px] text-gray-600">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      Be the first to review this delicious dish!
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Pricing & Add to Cart Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-3 mt-4">
            
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 shadow-xs cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-rose-500 transition-colors cursor-pointer"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              {/* Add to Bag Button with Live Real-time Price */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`flex-1 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-between ${
                  product.inStock === false
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none"
                    : "bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white shadow-lg hover:shadow-glow active:scale-95 cursor-pointer"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock === false ? "Dish Out of Stock / Sold Out" : "Add to Bag"}</span>
                </span>
                <span className="font-heading font-black text-sm sm:text-base">
                  ₹{Math.round(totalPrice)}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
