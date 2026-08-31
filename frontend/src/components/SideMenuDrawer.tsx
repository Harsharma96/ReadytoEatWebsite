"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { 
  X, 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Star,
  Check,
  UtensilsCrossed,
  Filter
} from "lucide-react";

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Array<{ id: string; name: string; emoji: string }>;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  products,
  categories,
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const [selectedCat, setSelectedCat] = useState<string>("All Items");
  const [search, setSearch] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  // Filter products for side menu
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCat === "All Items" || p.category === selectedCat;
      const matchSearch = 
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()));
      const matchVeg = !vegOnly || p.isVeg;
      return matchCat && matchSearch && matchVeg;
    });
  }, [products, selectedCat, search, vegOnly]);

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-Over Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 rounded-l-[32px] sm:rounded-l-[40px] overflow-hidden border-l border-white/80">
          
          {/* ================= DRAWER TOP HEADER ================= */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#0B1220] via-[#162032] to-[#0B1220] text-white border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-glow">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black font-heading tracking-tight text-white">
                      Royal Side Menu & Quick Order
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6B35]/30 text-[#FF8A00] font-black border border-[#FF6B35]/40">
                      {products.length} Dishes
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    Order directly from this side panel with instant dispatch
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Close Side Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search dishes, burgers, biryanis, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-10 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-3 p-0.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scrollable) */}
            <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer border ${
                  vegOnly 
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-sm" 
                    : "bg-white/10 text-gray-300 border-white/15 hover:bg-white/20"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pure Veg Only</span>
              </button>

              {categories.map((cat) => {
                const isActive = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isActive
                        ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-glow"
                        : "bg-white/10 text-gray-300 border-white/15 hover:bg-white/20"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= DRAWER DISHES LIST ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F8FAFC]">
            {filtered.length > 0 ? (
              filtered.map((product) => {
                const cartItem = cart.find((item) => item.product.id === product.id && !item.isSubscription);
                const quantityInCart = cartItem ? cartItem.quantity : 0;
                const isOutOfStock = product.inStock === false;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-[#FF6B35]/40 shadow-xs hover:shadow-soft-card transition-all duration-200 flex items-center gap-3.5 sm:gap-4 group"
                  >
                    {/* Dish Photo */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-xs">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${
                          product.isVeg ? "border-emerald-600 bg-white" : "border-red-600 bg-white"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${product.isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
                        </span>
                      </div>
                    </div>

                    {/* Dish Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#FF6B35] bg-orange-50 px-2 py-0.2 rounded-md">
                          {product.category}
                        </span>
                        {product.spiceLevel && product.spiceLevel > 1 && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-orange-500" />
                            {product.spiceLevel === 3 ? "Extra Spicy" : "Medium Spice"}
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-xs sm:text-sm text-gray-900 leading-snug truncate">
                        {product.name}
                      </h4>

                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {product.shortDescription || product.fullDescription}
                      </p>

                      {/* Price & Add Stepper */}
                      <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-gray-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-black text-gray-900 font-heading">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through font-bold">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Cart Action Buttons */}
                        {isOutOfStock ? (
                          <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
                            Sold Out
                          </span>
                        ) : quantityInCart > 0 ? (
                          <div className="flex items-center gap-2 bg-[#FFF0E5] p-1 rounded-xl border border-[#FF6B35]/30">
                            <button
                              onClick={() => {
                                if (quantityInCart <= 1) removeFromCart(product.id);
                                else updateQuantity(product.id, quantityInCart - 1);
                              }}
                              className="w-6 h-6 rounded-lg bg-white text-[#FF6B35] font-black flex items-center justify-center shadow-xs hover:bg-[#FF6B35] hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-gray-900 w-4 text-center">
                              {quantityInCart}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                              className="w-6 h-6 rounded-lg bg-[#FF6B35] text-white font-black flex items-center justify-center shadow-xs hover:bg-[#E85620] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => addToCart(product, 1, false, e.clientX, e.clientY)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white text-xs font-black shadow-xs hover:shadow-glow flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-gray-200">
                <span className="text-3xl block">🔍</span>
                <h4 className="text-sm font-black text-gray-800">No dishes match criteria</h4>
                <p className="text-xs text-gray-400">Try clearing your search query or category filter above.</p>
                <button
                  onClick={() => {
                    setSelectedCat("All Items");
                    setSearch("");
                    setVegOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-black cursor-pointer mt-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* ================= DRAWER STICKY FOOTER / CHECKOUT BAR ================= */}
          <div className="p-4 sm:p-6 pb-[max(env(safe-area-inset-bottom),16px)] bg-white border-t border-gray-200/90 shadow-xl shrink-0">
            {totalCartCount > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center font-black text-[10px] sm:text-[11px]">
                      {totalCartCount}
                    </div>
                    <span className="text-gray-600 font-bold text-[11px] sm:text-xs">Dishes in Royal Bag</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-bold">Subtotal</span>
                    <span className="text-base sm:text-lg font-black text-gray-900 font-heading">₹{cartSubtotal}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs sm:text-sm shadow-glow flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>View Bag & Order (₹{cartSubtotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      setIsCheckoutOpen(true);
                    }}
                    className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-xs cursor-pointer active:scale-95 transition-all"
                    title="Direct Express Checkout"
                  >
                    <span>Instant Pay</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  <span>Select any dish to start your feast</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
