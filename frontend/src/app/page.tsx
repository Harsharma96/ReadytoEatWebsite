"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PopularMarquee } from "@/components/PopularMarquee";
import { MenuSection } from "@/components/MenuSection";
import { ChefSpecialSection } from "@/components/ChefSpecialSection";
import { BentoSection } from "@/components/BentoSection";
import { FlashOfferBanner } from "@/components/FlashOfferBanner";
import { CustomBundleBuilder } from "@/components/CustomBundleBuilder";
import { NutritionalComparison } from "@/components/NutritionalComparison";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FoodGallerySection } from "@/components/FoodGallerySection";
import { ContactSection } from "@/components/ContactSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { LiquidWaveDivider } from "@/components/LiquidWaveDivider";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      {/* 1. Floating Glass Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* ── Divider ── */}
      <SectionDivider variant="flame" label="Trending Now" />

      {/* 3. Popular Trending Marquee */}
      <LiquidWaveDivider fillColor="#ffffff" />
      <PopularMarquee />
      <LiquidWaveDivider fillColor="#FFF8F2" isFlipped />

      {/* ── Divider ── */}
      <SectionDivider variant="crown" label="Royal Menu" />

      {/* 4. Featured Menu */}
      <LiquidWaveDivider fillColor="#FFF0E5" />
      <MenuSection />
      <LiquidWaveDivider fillColor="#FFF8F2" isFlipped />

      {/* ── Divider ── */}
      <SectionDivider variant="star" label="Chef Specials" />

      {/* 5. Chef Special Section */}
      <ChefSpecialSection />

      {/* ── Divider ── */}
      <SectionDivider variant="leaf" label="Why Choose Us" />

      {/* 6. Why Choose Us — Bento Grid */}
      <BentoSection />

      {/* ── Divider ── */}
      <SectionDivider variant="flame" label="Limited Offer" />

      {/* 7. Flash Offer Banner */}
      <FlashOfferBanner />

      {/* ── Divider ── */}
      <SectionDivider variant="crown" label="Build Your Feast" />

      {/* 8. Custom Feast Box Builder */}
      <CustomBundleBuilder />

      {/* ── Divider ── */}
      <SectionDivider variant="leaf" label="Pure & Healthy" />

      {/* 9. Nutritional Integrity */}
      <NutritionalComparison />

      {/* ── Divider ── */}
      <SectionDivider variant="star" label="Customer Love" />

      {/* 10. Reviews */}
      <ReviewsSection />

      {/* ── Divider ── */}
      <SectionDivider variant="drop" label="Food Gallery" />

      {/* 11. Food Gallery */}
      <FoodGallerySection />

      {/* ── Divider ── */}
      <SectionDivider variant="star" label="Get in Touch" />

      {/* 12. Contact Form */}
      <ContactSection />

      {/* ── Divider ── */}
      <SectionDivider variant="drop" label="FAQs" />

      {/* 13. FAQ */}
      <FAQSection />

      {/* 14. Footer */}
      <Footer />
    </main>
  );
}
