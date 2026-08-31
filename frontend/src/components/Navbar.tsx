"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  ChevronRight, 
  Sparkles, 
  UtensilsCrossed, 
  Heart,
  Bell,
  Star,
  CheckCircle2,
  Gift
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FeedbackModal } from "./FeedbackModal";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Check for any recently completed orders that need rating
  useEffect(() => {
    const checkNotification = () => {
      try {
        const saved = localStorage.getItem("foodeat_last_completed_order");
        if (saved) {
          const order = JSON.parse(saved);
          if (!order.hasRated) {
            setPendingOrder(order);
          }
        }
      } catch (e) {}
    };

    checkNotification();

    const handleOrderPlaced = (e: any) => {
      if (e.detail) {
        setPendingOrder(e.detail);
      }
    };

    window.addEventListener("foodeat:order_placed", handleOrderPlaced);
    return () => window.removeEventListener("foodeat:order_placed", handleOrderPlaced);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults: Product[] = searchQuery.trim() === "" 
    ? [] 
    : PRODUCTS.filter((p: Product) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 4);

  // Clean, customer-facing luxury navigation links (Pure typography - no icons)
  const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "Feast Box", href: "/box" },
    { name: "Gallery", href: "/gallery" },
    { name: "Trending", href: "/trending" },
    { name: "Reviews", href: "/reviews" },
    { name: "Our Story", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Floating Glass Navbar - Perfectly Proportionate & Zero Overflow */}
      <div className="sticky top-2 sm:top-3 z-40 px-2 sm:px-5 lg:px-8 w-full max-w-7xl mx-auto transition-all duration-300">
        <header 
          className={`w-full rounded-full transition-all duration-300 ${
            isScrolled 
              ? "bg-white/95 backdrop-blur-[36px] py-1.5 sm:py-2.5 px-2.5 sm:px-6 shadow-[0_12px_36px_rgba(255,107,53,0.18)] border border-[#FF6B35]/30 ring-1 ring-black/5" 
              : "bg-white/95 backdrop-blur-[24px] py-1.5 sm:py-3 px-2.5 sm:px-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/90 ring-1 ring-black/5"
          } flex items-center justify-between gap-1.5 sm:gap-4`}
        >
          {/* ================= Brand Logo ================= */}
          <NextLink href="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0 select-none">
            <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] flex items-center justify-center text-white shadow-glow transition-all duration-300 group-hover:scale-105">
              <UtensilsCrossed className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-black tracking-tight text-[#0B1220] flex items-center font-heading leading-none">
                FOOD<span className="text-[#FF6B35] group-hover:text-[#FF8A00] transition-colors">EAT</span>
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-emerald-700 mt-0.5 font-sans leading-none">
                Shahi Rasoi • Desi Ghee
              </span>
            </div>
          </NextLink>

          {/* ================= Clean Customer Nav Links (Desktop) ================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-[13px] font-black text-[#0B1220]/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NextLink
                  key={link.name}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap group cursor-pointer ${
                    isActive 
                      ? "text-[#FF6B35] bg-[#FFF0E5] font-black shadow-2xs" 
                      : "hover:text-[#FF6B35] hover:bg-orange-50/80"
                  }`}
                >
                  <span>{link.name}</span>
                </NextLink>
              );
            })}
          </nav>

          {/* ================= Right Utility Cluster (Fitted Perfectly Inside) ================= */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Desktop Search Trigger */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-full text-gray-700 hover:text-[#FF6B35] bg-slate-100/90 hover:bg-orange-50 border border-gray-200/80 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Search menu"
                aria-label="Search dishes"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {searchOpen && (
                <div className="absolute top-11 right-0 w-72 sm:w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#FF6B35]/20 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search Dum Biryani, Kebab..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all shadow-inner"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-56 overflow-y-auto">
                      {searchResults.map((item: Product) => (
                        <NextLink
                          key={item.id}
                          href="/menu"
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-orange-50/80 transition-colors group cursor-pointer"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-9 h-9 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900 truncate group-hover:text-[#FF6B35]">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold">
                              ₹{item.price} • {item.category}
                            </p>
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full text-gray-700 hover:text-[#FF6B35] bg-slate-100/90 hover:bg-orange-50 border border-gray-200/80 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {pendingOrder && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white rounded-full text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-glow animate-pulse">
                    1
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {notificationsOpen && (
                <div className="absolute top-10 sm:top-12 right-0 w-72 sm:w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#FF6B35]/20 p-3.5 sm:p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#FF6B35]" />
                      <h4 className="text-xs font-black text-gray-900 font-heading">Notifications</h4>
                    </div>
                    <span className="text-[10px] font-bold text-[#3ECF6E] bg-[#EAF9EF] px-2 py-0.5 rounded-full">
                      VIP Active
                    </span>
                  </div>

                  {pendingOrder ? (
                    <div className="p-3 rounded-2xl bg-[#FFF8F2] border border-[#FF6B35]/30 space-y-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Pending Review
                        </span>
                        <span className="text-[9px] font-black text-gray-400 font-mono">
                          #{pendingOrder.id}
                        </span>
                      </div>
                      <p className="text-xs font-black text-gray-900 leading-snug">
                        {pendingOrder.dishName}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Rate your feast experience & get 100 VIP Points credited!
                      </p>
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          setIsRatingModalOpen(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-glow flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        <span>⭐ Rate Order & Claim 100 Points</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-1 my-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3ECF6E] mx-auto" />
                      <p className="text-xs font-bold text-gray-800">All caught up!</p>
                      <p className="text-[10px] text-gray-400">You&apos;re earning VIP rewards on every royal feast.</p>
                    </div>
                  )}

                  {/* VIP Reward Banner */}
                  <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FFF0E5] to-[#FFE4D6] border border-[#FF6B35]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#FF6B35]" />
                      <div>
                        <p className="text-[10px] font-black text-gray-900">VIP Points Rewards</p>
                        <p className="text-[9px] text-gray-500 font-bold">100 Points = ₹100 Discount</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FF6B35] font-heading">+100 VIP</span>
                  </div>
                </div>
              )}
            </div>

            {/* Luxury Magnetic Bag Button (Compact on Mobile) */}
            <button
              id="cart-bag-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative group overflow-hidden flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-[11px] sm:text-xs shadow-[0_4px_16px_rgba(255,107,53,0.35)] transition-all duration-300 active:scale-95 shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-heading tracking-wide">Bag</span>
              {totalItems > 0 && (
                <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 bg-white text-[#FF6B35] rounded-full text-[8.5px] sm:text-[9.5px] font-black flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button (Fitted Inside Capsule) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-7 h-7 rounded-full text-gray-700 bg-slate-100/90 border border-gray-200/80 hover:bg-gray-200 transition-all active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5 text-gray-900" /> : <Menu className="w-3.5 h-3.5 text-gray-800" />}
            </button>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-[24px] bg-white/98 backdrop-blur-[36px] p-3.5 sm:p-4 space-y-2.5 shadow-2xl border border-[#FF6B35]/20 animate-in fade-in slide-in-from-top-3 duration-200">
            {/* Search Input for Mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search dishes, biryani..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Navigation List */}
            <div className="grid grid-cols-1 gap-1 text-xs font-black text-[#0B1220]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                      isActive 
                        ? "bg-[#FFF0E5] text-[#FF6B35] font-black shadow-2xs" 
                        : "hover:bg-slate-50 text-gray-800"
                    }`}
                  >
                    <span className="font-heading font-black tracking-tight text-[13px]">{link.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6B35]" : "text-gray-300"}`} />
                  </NextLink>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Review Rating Modal */}
      {isRatingModalOpen && (
        <FeedbackModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setPendingOrder(null);
          }}
        />
      )}
    </>
  );
};
