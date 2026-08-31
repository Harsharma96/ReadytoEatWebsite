"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PopularMarquee } from "@/components/PopularMarquee";
import { FoodGallerySection } from "@/components/FoodGallerySection";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-[#FFF0E5] to-[#FFF8F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF4D6D] text-xs font-black shadow-xs border border-[#FF4D6D]/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LIVE ORDERS & TRENDING PLATES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            What Food Lovers Are Craving
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Real-time popular dishes ordered most frequently across our 12 kitchen studios today.
          </p>
        </div>
      </section>

      {/* 5-Column Pinterest Masonry */}
      <PopularMarquee />

      {/* Culinary Visual Gallery */}
      <FoodGallerySection />

      <Footer />
    </main>
  );
}
