"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Sparkles, ArrowRight } from "lucide-react";

export default function TrackLookupPage() {
  const router = useRouter();
  const [orderInput, setOrderInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    const cleanId = orderInput.trim().replace(/^#/, "");
    router.push(`/track/${cleanId}`);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      <section className="pt-32 pb-20 max-w-xl mx-auto px-4 sm:px-6 w-full text-center space-y-6 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B35] text-xs font-black shadow-xs border border-[#FF6B35]/20 mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LIVE SATELLITE DISPATCH</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0B1220] font-heading tracking-tight">
          Track Your Feast
        </h1>

        <p className="text-gray-600 text-xs sm:text-sm">
          Enter your 5-digit Order ID (e.g., <strong>FE-83921</strong>) to view kitchen searing status, thermal sensor telemetry, and live courier ETA.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-md mx-auto w-full pt-2">
          <input
            type="text"
            required
            placeholder="Enter Order # (e.g. FE-83921)"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            className="w-full px-5 py-4 pl-12 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-soft-card"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-6" />

          <button
            type="submit"
            className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Track Live Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
