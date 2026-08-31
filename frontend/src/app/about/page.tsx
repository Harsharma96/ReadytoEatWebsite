"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BentoSection } from "@/components/BentoSection";
import { ChefSpecialSection } from "@/components/ChefSpecialSection";
import { NutritionalComparison } from "@/components/NutritionalComparison";
import { Sparkles, Award, ShieldCheck, HeartHandshake, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-[#FFF0E5] to-[#FFF8F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B35] text-xs font-black shadow-xs border border-[#FF6B35]/20">
            <Award className="w-3.5 h-3.5" />
            <span>👑 OUR ROYAL CULINARY MANIFESTO</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            The Heritage of Shahi Flavors
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            FoodEat was founded on a royal conviction: authentic century-old Indian recipes, 100% pure cow desi ghee, and clay handi cooking should be delivered fresh to your dining table.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-5 rounded-3xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-3xl sm:text-4xl font-black text-[#FF6B35] font-heading block">100%</span>
              <span className="text-xs font-bold text-gray-500">Pure Desi Ghee</span>
            </div>
            <div className="p-5 rounded-3xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-3xl sm:text-4xl font-black text-[#3ECF6E] font-heading block">24-Hr</span>
              <span className="text-xs font-bold text-gray-500">Slow Charcoal Dum</span>
            </div>
            <div className="p-5 rounded-3xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-3xl sm:text-4xl font-black text-[#FF8A00] font-heading block">25m</span>
              <span className="text-xs font-bold text-gray-500">Avg Thermal Delivery</span>
            </div>
            <div className="p-5 rounded-3xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-3xl sm:text-4xl font-black text-[#FF4D6D] font-heading block">4.9★</span>
              <span className="text-xs font-bold text-gray-500">Royal Patron Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chef Special Banner */}
      <ChefSpecialSection />

      {/* 6 Luxury Bento Grid */}
      <BentoSection />

      {/* Nutritional Comparison */}
      <NutritionalComparison />

      {/* CTA Card */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[40px] bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] p-10 sm:p-14 text-white text-center space-y-6 shadow-glow relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black font-heading">
            Taste the Craft for Yourself
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Order today and receive our seasonal chef drop delivered in sustainable zero-touch packaging.
          </p>
          <div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#0B1220] font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>Explore The Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
