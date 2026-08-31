"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { FAQSection } from "@/components/FAQSection";
import { Sparkles, MessageSquare, PhoneCall, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-[#FFF0E5] to-[#FFF8F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B35] text-xs font-black shadow-xs border border-[#FF6B35]/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>KITCHEN CONCIERGE & SUPPORT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            Connect with Our Team
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Questions regarding catering, corporate dietary plans, or private chef dining? We respond within 15 minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-left">
            <div className="p-5 rounded-3xl bg-white border border-white shadow-soft-card flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#FF6B35] flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Direct Hotline</span>
                <span className="text-xs font-black text-gray-900">+1 (800) 458-FOOD</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-white shadow-soft-card flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF9EF] text-[#3ECF6E] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">VIP Concierge</span>
                <span className="text-xs font-black text-gray-900">chef@foodeat.io</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-white shadow-soft-card flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE4E9] text-[#FF4D6D] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Head Kitchen</span>
                <span className="text-xs font-black text-gray-900">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Contact Form */}
      <ContactSection />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </main>
  );
}
