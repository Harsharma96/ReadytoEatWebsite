"use client";

import React, { useState } from "react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/context/CartContext";
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Tag,
  Coins
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    toggleSubscription,
    clearCart, 
    subtotal, 
    discount, 
    shipping, 
    tax,
    gstPercent,
    isGstEnabled,
    taxName,
    finalTotal, 
    promoCode, 
    promoApplied, 
    applyPromoCode, 
    removePromoCode, 
    setIsCheckoutOpen 
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((s, i) => s + i.quantity, 0);
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message });
      setPromoInput("");
    } else {
      setPromoMessage({ text: res.message, error: true });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 rounded-l-[28px] overflow-hidden border-l border-white/80">
          
          {/* Top Header (Compact) */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-glow">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-900 font-heading leading-tight">
                  Your Royal Bag
                </h2>
                <span className="text-[9.5px] text-gray-400 font-bold block">
                  {totalItemsCount} {totalItemsCount === 1 ? "dish" : "dishes"} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all cursor-pointer active:scale-90"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Delivery Threshold Progress (Compact) */}
          <div className="px-4 py-2 bg-gradient-to-r from-[#FFF0E5] via-[#FFF8F2] to-[#FFF0E5] border-b border-orange-100/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black">
              <span className="flex items-center gap-1 text-gray-800">
                <Truck className="w-3 h-3 text-[#FF6B35]" />
                {freeShipRemaining <= 0 ? (
                  <span className="text-[#2E7D32] font-black">🎉 FREE Express Thermal Delivery Unlocked!</span>
                ) : (
                  <span>Add ₹{Math.round(freeShipRemaining)} for Free Delivery</span>
                )}
              </span>
              <span className="text-[9.5px] text-gray-500 font-bold">{Math.round(shipProgress)}%</span>
            </div>

            <div className="w-full h-1 bg-white rounded-full overflow-hidden p-0.5 border border-orange-200/60">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] rounded-full transition-all duration-300"
                style={{ width: `${shipProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items Scrollable List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF0E5] text-[#FF6B35] flex items-center justify-center mx-auto text-3xl shadow-inner">
                  🍲
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-gray-900 font-heading">
                    Your Bag is Empty
                  </h3>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    Add your favorite Awadhi Biryanis, Slow-Cooked Curries, and Tandoori Kebabs.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs font-black shadow-glow transition-all active:scale-95 cursor-pointer"
                >
                  Explore Royal Menu
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => {
                  const itemPrice = item.isSubscription
                    ? item.product.price * 0.85
                    : item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center gap-2.5 relative group hover:border-[#FF6B35]/40 transition-all"
                    >
                      {/* Dish Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                      />

                      {/* Dish Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-black text-gray-900 truncate leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subscription / Single toggle badge */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <button
                            onClick={() => toggleSubscription(item.product.id)}
                            className={`text-[8.5px] font-black px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                              item.isSubscription
                                ? "bg-orange-100 text-orange-800 font-black"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {item.isSubscription ? "✓ Tiffin (15% OFF)" : "Single Feast"}
                          </button>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs font-black text-gray-900 font-heading">
                            ₹{Math.round(itemPrice * item.quantity)}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 shadow-2xs cursor-pointer active:scale-90"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-5 text-center text-[11px] font-black text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 shadow-2xs cursor-pointer active:scale-90"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Promo Code Input Box */}
            {cart.length > 0 && (
              <div className="pt-1.5 pb-1">
                <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. DESI20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="w-full pl-7 pr-2 py-2 text-[11px] font-black tracking-wider uppercase rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                    <Tag className="w-3 h-3 text-gray-400 absolute left-2 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#12121A] hover:bg-[#FF6B35] text-white font-black text-[11px] transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {promoApplied && (
                  <div className="mt-1.5 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[10.5px] text-emerald-800 font-bold">
                    <span>🎉 Voucher &quot;{promoCode}&quot; Applied!</span>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700 font-black text-[9.5px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage && (
                  <p className={`text-[10px] font-bold mt-1 ${promoMessage.error ? "text-red-500" : "text-emerald-600"}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Summary & Checkout Button (Compact & Sleek) */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-gray-100 bg-white space-y-2 shrink-0">
              <div className="space-y-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{Math.round(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo / Tiffin Discount</span>
                    <span>-₹{Math.round(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Thermal Delivery Fee</span>
                  <span className="font-bold text-[#2E7D32]">
                    {shipping === 0 ? "FREE (Express)" : `₹${shipping}`}
                  </span>
                </div>

                {isGstEnabled && (
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>{taxName || `GST (${gstPercent}%)`}</span>
                      <span className="text-[8.5px] bg-orange-100/70 text-[#FF6B35] font-black px-1 rounded">
                        {gstPercent}%
                      </span>
                    </span>
                    <span className="font-bold text-gray-900">+₹{Math.round(tax)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-1.5 border-t border-gray-100 text-xs sm:text-sm font-black text-gray-900 font-heading">
                  <span>Grand Total</span>
                  <span className="text-[#FF6B35] text-sm sm:text-base">₹{Math.round(finalTotal)}</span>
                </div>
              </div>

              {/* VIP Reward Hint */}
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60">
                <Coins className="w-3 h-3 text-amber-600 shrink-0" />
                <span>You will earn <strong>+100 VIP Coins (₹100)</strong> on this order!</span>
              </div>

              {/* Proceed to Address Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs sm:text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Proceed to Delivery Address</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
