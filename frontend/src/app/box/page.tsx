"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomBundleBuilder } from "@/components/CustomBundleBuilder";
import { FlashOfferBanner } from "@/components/FlashOfferBanner";

export default function FeastBoxPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* Single Unified Luxury Custom Feast Box Studio */}
      <div className="pt-4 sm:pt-6">
        <CustomBundleBuilder />
      </div>

      {/* Flash Offer Banner */}
      <FlashOfferBanner />

      <Footer />
    </main>
  );
}
