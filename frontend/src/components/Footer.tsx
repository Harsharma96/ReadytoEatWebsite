"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  UtensilsCrossed, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  ShieldCheck,
  Award,
  Crown,
  ArrowRight
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { useCart } from "@/context/CartContext";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useCart();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to join VIP Club");
      }

      setIsSubmitting(false);
      setSubscribed(true);
      showToast("✨ Welcome to Shahi VIP Rasoi Club! Coupon DESI20 unlocked.");
      triggerConfetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      setIsSubmitting(false);
      setSubscribed(true);
      showToast("✨ Welcome to Shahi VIP Rasoi Club! Coupon DESI20 unlocked.");
      triggerConfetti({ particleCount: 50, spread: 60 });
    }
  };

  return (
    <footer className="bg-[#0B0D13] text-white pt-6 sm:pt-12 pb-6 relative overflow-hidden border-t border-white/5">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 relative z-10 space-y-4 sm:space-y-6">
        
        {/* ================= 1. VIP CLUB NEWSLETTER CARD (ULTRA-COMPACT) ================= */}
        <div className="rounded-2xl sm:rounded-[24px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-3.5 sm:p-5 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            
            <div className="text-center sm:text-left space-y-0.5 sm:space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[8.5px] sm:text-xs font-black border border-[#FF6B35]/30">
                <Crown className="w-2.5 h-2.5" />
                <span>SHAHI VIP RASOI CLUB</span>
              </div>
              <h3 className="text-xs sm:text-lg font-black font-heading tracking-tight text-white">
                Get ₹100 Off Your First Royal Order
              </h3>
              <p className="text-[9.5px] sm:text-xs text-gray-400">
                Enter your email to instantly unlock coupon <strong className="text-[#FFC94A]">DESI20</strong>.
              </p>
            </div>

            <div className="w-full sm:w-auto min-w-[260px] sm:min-w-[300px]">
              {subscribed ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-black flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Coupon <strong>DESI20</strong> Unlocked!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="relative flex items-center w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-3 pr-24 sm:pr-28 py-2 rounded-full bg-white/10 border border-white/15 text-white placeholder-gray-400 text-[10.5px] sm:text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D] hover:from-[#E85620] hover:to-[#E63956] text-white text-[10px] sm:text-xs font-black transition-all shadow-glow active:scale-95 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "..." : "Claim ₹100"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* ================= 2. 3-COLUMN ULTRA-COMPACT SIDE-BY-SIDE LINKS GRID ================= */}
        {/* All 3 columns side-by-side on mobile without awkward wrapping */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 py-2 border-b border-white/10 text-left">
          
          {/* Col 1: Explore Menu */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-white font-heading uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/menu" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  📜 Full Menu
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  📸 Gallery
                </Link>
              </li>
              <li>
                <Link href="/box" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  🍱 Feast Box
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  🛰️ GPS Track
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Royal Categories */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-white font-heading uppercase tracking-wider">
              Dishes
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/category/biryani-north-indian" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  👑 Biryani &amp; Curries
                </Link>
              </li>
              <li>
                <Link href="/category/burgers-wraps" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  🍔 Smash Burgers
                </Link>
              </li>
              <li>
                <Link href="/category/pizzas-garlic-breads" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  🍕 Truffle Pizza
                </Link>
              </li>
              <li>
                <Link href="/category/gujarati-thalis" className="hover:text-[#FF6B35] transition-colors truncate block py-0.5">
                  🟡 Shahi Thalis
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Purity Standards */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] sm:text-xs font-black text-white font-heading uppercase tracking-wider">
              Purity
            </h4>
            <ul className="space-y-1 text-[9.5px] sm:text-[11px] text-gray-400">
              <li className="flex items-center gap-1 text-gray-300 truncate">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>Cow Desi Ghee</span>
              </li>
              <li className="flex items-center gap-1 text-gray-300 truncate">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>75°C Hot Pods</span>
              </li>
              <li className="flex items-center gap-1 text-gray-300 truncate">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>Zero MSG / Palm</span>
              </li>
              <li className="flex items-center gap-1 text-gray-300 truncate">
                <Award className="w-2.5 h-2.5 text-[#FFC94A] shrink-0" />
                <span>Halal & Veg</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= 3. SIGNATURE BRAND & SOCIAL SECTION ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-center sm:text-left">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF4D6D] flex items-center justify-center text-white shadow-glow shrink-0">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black font-heading tracking-tight text-white">
                FOOD<span className="text-[#FF6B35]">EAT</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold ml-1.5">
                • Shahi Rasoi Kitchens
              </span>
            </div>
          </div>

          {/* Social Media Connect Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF6B35] hover:text-white text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xs border border-white/10 active:scale-90"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF6B35] hover:text-white text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xs border border-white/10 active:scale-90"
              title="Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF6B35] hover:text-white text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xs border border-white/10 active:scale-90"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF4D6D] hover:text-white text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xs border border-white/10 active:scale-90"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* ================= 4. COPYRIGHT & LEGAL BAR ================= */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[8.5px] sm:text-xs text-gray-500 gap-1.5 text-center sm:text-left">
          <p>© 2026 FoodEat Shahi Rasoi Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-gray-400">
            <Link href="/track" className="hover:text-white transition-colors font-bold text-[#FF6B35]">
              Track Order
            </Link>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <Link href="/contact" className="hover:text-white transition-colors">Concierge</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
