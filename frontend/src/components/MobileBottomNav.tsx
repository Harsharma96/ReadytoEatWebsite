"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  ShieldAlert, 
  Layers, 
  Crown,
  Sparkles,
  Search
} from "lucide-react";
import Link from "next/link";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, subtotal, setIsCartOpen, setIsSideMenuOpen } = useCart();

  // If on admin page, show specialized kitchen quick tabs instead or keep minimal
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <nav 
        id="admin-mobile-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1220]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-3 py-2 pb-[max(env(safe-area-inset-bottom),8px)] flex items-center justify-between"
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all"
        >
          <Home className="w-4 h-4 text-orange-400" />
          <span>Store</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-black text-white uppercase tracking-wider font-heading">
            Live Kitchen Admin
          </span>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("kitchen-tickets-hub");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-black shadow-glow active:scale-95 transition-all"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Tickets</span>
        </button>
      </nav>
    );
  }

  const isHomeActive = pathname === "/";
  const isMenuActive = pathname === "/menu";

  return (
    <nav 
      id="mobile-bottom-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/92 backdrop-blur-2xl border-t border-orange-200/70 shadow-[0_-10px_35px_rgba(0,0,0,0.08)] px-2 pt-2 pb-[max(env(safe-area-inset-bottom),10px)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. HOME TAB */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
            isHomeActive 
              ? "text-[#FF6B35] font-black scale-105" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${isHomeActive ? "bg-orange-50 text-[#FF6B35]" : ""}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Home</span>
        </Link>

        {/* 2. MENU TAB */}
        <Link
          href="/menu"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
            isMenuActive 
              ? "text-[#FF6B35] font-black scale-105" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${isMenuActive ? "bg-orange-50 text-[#FF6B35]" : ""}`}>
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Dishes</span>
        </Link>

        {/* 3. CENTER ROYAL SIDE DRAWER BUTTON (HERO ACTION) */}
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="group relative -top-3 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
          title="Open Royal Side Menu"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] text-white flex items-center justify-center shadow-glow border-2 border-white">
            <Crown className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-[9.5px] font-black text-[#FF6B35] mt-0.5 uppercase tracking-wider">
            Side Menu
          </span>
        </button>

        {/* 4. BAG / CART TAB */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-gray-700 hover:text-[#FF6B35] transition-all duration-200 cursor-pointer relative active:scale-95"
        >
          <div className="relative p-1.5 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">
            {totalItems > 0 ? `₹${subtotal}` : "Bag"}
          </span>
        </button>

        {/* 5. KITCHEN ADMIN TAB */}
        <Link
          href="/admin"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-gray-500 hover:text-gray-900 transition-all duration-200"
          title="Hotel Kitchen Admin Portal"
        >
          <div className="p-1.5 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-gray-500" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Admin</span>
        </Link>

      </div>
    </nav>
  );
};
