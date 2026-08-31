"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { 
  Heart, 
  Star, 
  Plus, 
  Minus,
  Eye, 
  ChefHat,
  Clock,
  Flame,
  Sparkles
} from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart, openQuickView, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const isFavorited = isInWishlist(product.id);

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.product.id === product.id && !item.isSubscription);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, false, e.clientX, e.clientY);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (quantityInCart <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantityInCart - 1);
    }
  };

  const isOutOfStock = product.inStock === false;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full flex flex-col"
    >
      <div
        className={`group relative rounded-[16px] sm:rounded-[22px] bg-white p-2 sm:p-3 border transition-all duration-300 flex flex-col justify-between h-full overflow-hidden ${
          isOutOfStock 
            ? "border-red-200 bg-gray-50/90 opacity-80" 
            : "border-gray-200/80 hover:border-[#FF6B35]/40 shadow-soft-card hover:shadow-glow hover:-translate-y-1"
        }`}
      >
        {/* Soft Background Accent Glow */}
        <div 
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full filter blur-2xl transition-opacity duration-500 pointer-events-none opacity-0 group-hover:opacity-25"
          style={{ backgroundColor: product.accentColor || "#FF6B35" }}
        />

        {/* Top Section: Photo Window & Details */}
        <div className="relative z-10 space-y-1 sm:space-y-2">
          
          {/* Photo Frame */}
          <div 
            onClick={() => openQuickView(product)}
            className="relative aspect-[4/3] w-full rounded-[12px] sm:rounded-[16px] overflow-hidden cursor-pointer bg-gray-100 shadow-xs group/photo"
          >
            {/* Top Left: Category Badge */}
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-20 pointer-events-none">
              {isOutOfStock ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-gray-900/90 text-white shadow-xs">
                  Sold Out
                </span>
              ) : (
                <span 
                  className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs flex items-center gap-1 backdrop-blur-md"
                  style={{ backgroundColor: product.accentColor || "#FF6B35" }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span className="whitespace-nowrap">{product.badge || product.category}</span>
                </span>
              )}
            </div>

            {/* Top Right: Wishlist Heart */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-[#FF4D6D] shadow-xs transition-transform active:scale-90 cursor-pointer"
              title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorited ? "fill-[#FF4D6D] text-[#FF4D6D]" : "text-gray-600 hover:text-[#FF4D6D]"
                }`} 
              />
            </button>

            {/* Food Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transform transition-transform duration-500 ${
                isOutOfStock ? "grayscale contrast-75 opacity-60" : "group-hover/photo:scale-108"
              }`}
            />

            {/* Sold Out Dark Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
                <span className="px-3 py-1 rounded-full bg-gray-950/90 text-white font-bold text-xs uppercase tracking-wider shadow-md border border-white/20">
                  Currently Sold Out
                </span>
              </div>
            )}

            {/* Hover Quick View Button */}
            {!isOutOfStock && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#FF6B35]" />
                  Quick View
                </span>
              </div>
            )}

            {/* Bottom Left & Right Info Pills */}
            <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2 flex items-center justify-between pointer-events-none z-10">
              {product.nutrition?.calories ? (
                <span className="px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[7.5px] sm:text-[8.5px] font-black flex items-center gap-0.5">
                  <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-orange-400" />
                  <span>{product.nutrition.calories} kcal</span>
                </span>
              ) : <span />}

              {product.prepTimeMinutes && (
                <span className="px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[7.5px] sm:text-[8.5px] font-black flex items-center gap-0.5">
                  <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-300" />
                  <span>{product.prepTimeMinutes}m</span>
                </span>
              )}
            </div>
          </div>

          {/* Details: Veg Dot + Category + Star Rating */}
          <div className="flex items-center justify-between text-[8px] sm:text-[9.5px]">
            <div className="flex items-center gap-1 min-w-0">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 border flex items-center justify-center p-0.5 rounded-xs flex-shrink-0 ${
                product.isVeg !== false ? "border-green-600 bg-white" : "border-red-600 bg-white"
              }`}>
                <div className={`w-1 h-1 rounded-full ${
                  product.isVeg !== false ? "bg-green-600" : "bg-red-600"
                }`} />
              </div>
              <span className="font-black uppercase tracking-wider text-gray-400 truncate text-[8px] sm:text-[9.5px]">
                {product.cuisine || product.category}
              </span>
            </div>

            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/50 px-1 py-0.5 rounded-md flex-shrink-0">
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-[#FFC94A] text-[#FFC94A]" />
              <span className="font-black text-gray-900 text-[8px] sm:text-[9.5px]">{product.rating}</span>
            </div>
          </div>

          {/* Dish Name */}
          <h3 
            onClick={() => openQuickView(product)}
            className="text-[11px] sm:text-sm font-black text-gray-900 font-heading line-clamp-1 cursor-pointer hover:text-[#FF6B35] transition-colors leading-tight"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[9px] sm:text-[10.5px] text-gray-500 line-clamp-1 leading-tight">
            {product.shortDescription}
          </p>

        </div>

        {/* Bottom Section: Price & Compact Add/Stepper */}
        <div className="pt-1.5 sm:pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1 sm:gap-2 relative z-10 mt-1.5 sm:mt-2">
          
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-black text-gray-900 font-heading">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[8.5px] sm:text-[10px] text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[7.5px] sm:text-[8.5px] text-gray-400 font-bold block -mt-0.5">
              Fresh Hot
            </span>
          </div>

          {/* Add to Cart / Multi-Quantity Stepper */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[8.5px] sm:text-[10px] font-black bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
              Sold Out
            </button>
          ) : quantityInCart > 0 ? (
            /* Compact In-Cart Stepper [ - 1 + ] */
            <div className="flex items-center bg-[#0B1220] text-white rounded-md sm:rounded-xl p-0.5 shadow-xs">
              <button
                onClick={handleDecrement}
                className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-sm sm:rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-90"
                title="Reduce"
              >
                <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
              
              <span className="w-4.5 sm:w-6 text-center font-black text-[10px] sm:text-xs text-white">
                {quantityInCart}
              </span>

              <button
                onClick={handleIncrement}
                className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-sm sm:rounded-lg bg-[#FF6B35] hover:bg-[#FF8A00] flex items-center justify-center text-white transition-colors cursor-pointer active:scale-90"
                title="Add more"
              >
                <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
            </div>
          ) : (
            /* Compact + Add Button */
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[10px] sm:text-xs font-black transition-all duration-200 flex items-center gap-0.5 shadow-xs active:scale-90 cursor-pointer ${
                isAdding
                  ? "bg-[#3ECF6E] text-white scale-105"
                  : "bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white shadow-glow"
              }`}
            >
              {isAdding ? (
                <>
                  <ChefHat className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 animate-bounce" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
