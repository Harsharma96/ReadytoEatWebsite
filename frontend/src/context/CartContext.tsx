"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
  frequency?: "weekly" | "biweekly" | "monthly";
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, isSubscription?: boolean, clientX?: number, clientY?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSubscription: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  gstPercent: number;
  isGstEnabled: boolean;
  taxName: string;
  finalTotal: number;
  promoCode: string;
  promoApplied: boolean;
  promoDiscountPercent: number;
  activePromo: { code: string; discountPercent?: number; description: string } | null;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  showToast: (msg: string) => void;
  
  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;

  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Toast Notification
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const FREE_SHIPPING_THRESHOLD = 499.0;
export const FREE_GIFT_THRESHOLD = 999.0;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [activePromo, setActivePromo] = useState<{ code: string; discountPercent?: number; description: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Store & GST settings from Admin
  const [gstPercent, setGstPercent] = useState<number>(5);
  const [isGstEnabled, setIsGstEnabled] = useState<boolean>(true);
  const [taxName, setTaxName] = useState<string>("GST (5%)");
  const [freeShipThreshold, setFreeShipThreshold] = useState<number>(FREE_SHIPPING_THRESHOLD);
  const [stdDeliveryFee, setStdDeliveryFee] = useState<number>(49.0);

  // Fetch store settings & active promo from backend
  const fetchSettingsAndPromo = () => {
    fetch(`/api/settings?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setGstPercent(Number(data.settings.gstPercent) || 5);
          setIsGstEnabled(data.settings.isGstEnabled !== false);
          setTaxName(data.settings.taxName || `GST (${data.settings.gstPercent || 5}%)`);
          if (data.settings.freeDeliveryThreshold) {
            setFreeShipThreshold(Number(data.settings.freeDeliveryThreshold));
          }
          if (data.settings.standardDeliveryFee !== undefined) {
            setStdDeliveryFee(Number(data.settings.standardDeliveryFee));
          }
        }
      })
      .catch(() => {});

    fetch(`/api/admin/stats?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.promos)) {
          const firstActive = data.promos.find((p: any) => p.isActive);
          setActivePromo(firstActive || null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettingsAndPromo();
  }, []);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pv_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("pv_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("pv_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("pv_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1, isSubscription = false, clientX?: number, clientY?: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, isSubscription }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          isSubscription,
          frequency: isSubscription ? "weekly" : undefined,
        },
      ];
    });

    // Determine representative emoji
    const emoji =
      product.category.includes("Burger") ? "🍔" :
      product.category.includes("Pizza") ? "🍕" :
      product.category.includes("Pasta") ? "🍝" :
      product.category.includes("Bowl") ? "🥗" :
      product.category.includes("Drink") ? "🥤" : "🍰";

    if (typeof window !== "undefined") {
      const event = new CustomEvent("foodEatFlyToCart", {
        detail: {
          emoji,
          x: clientX || window.innerWidth / 2,
          y: clientY || window.innerHeight / 2,
        },
      });
      window.dispatchEvent(event);
    }

    showToast(`Added "${product.name}" to your bag! ✨`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSubscription = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              isSubscription: !item.isSubscription,
              frequency: !item.isSubscription ? "weekly" : undefined,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to your wishlist! 💖");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Dynamic promo validation with backend DB
  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: "Please enter a promo code." };

    try {
      const currentSubtotal = cart.reduce((sum, item) => {
        const itemPrice = item.isSubscription ? item.product.price * 0.85 : item.product.price;
        return sum + itemPrice * item.quantity;
      }, 0);

      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, subtotal: currentSubtotal || 50 }),
      });
      const data = await res.json();

      if (data.success && data.valid) {
        setPromoCode(cleanCode);
        const percent = currentSubtotal > 0 ? Math.round((data.discount / currentSubtotal) * 100) : 20;
        setPromoDiscountPercent(percent || 20);
        setPromoApplied(true);
        showToast(`🎉 Promo ${cleanCode} applied! (${data.message})`);
        return { success: true, message: data.message };
      } else {
        setPromoCode("");
        setPromoDiscountPercent(0);
        setPromoApplied(false);
        const msg = data.message || "Invalid or expired promo code.";
        showToast(`❌ ${msg}`);
        return { success: false, message: msg };
      }
    } catch (err) {
      return { success: false, message: "Failed to validate promo code." };
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setPromoDiscountPercent(0);
    setPromoApplied(false);
  };

  // Computations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    // 15% auto-discount if item is subscribed
    const itemPrice = item.isSubscription
      ? item.product.price * 0.85
      : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const discount = promoDiscountPercent > 0 ? (subtotal * promoDiscountPercent) / 100 : 0;
  
  const isFreeShipFromPromo = promoCode === "FREESHIP";
  const shipping =
    subtotal === 0 || subtotal >= freeShipThreshold || isFreeShipFromPromo
      ? 0
      : stdDeliveryFee;

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = isGstEnabled ? Math.round((taxableAmount * gstPercent) / 100) : 0;
  const finalTotal = Math.max(0, taxableAmount + shipping + tax);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSubscription,
        clearCart,
        totalItems,
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
        promoDiscountPercent,
        activePromo,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        isQuickViewOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isQuizOpen,
        setIsQuizOpen,
        isSideMenuOpen,
        setIsSideMenuOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
