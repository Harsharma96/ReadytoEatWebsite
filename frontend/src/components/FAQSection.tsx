"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the food stay piping hot during delivery?",
      answer: "We dispatch every order in specialized temperature-insulated thermal pods maintained at 75°C+. Your Awadhi Dum Biryani, clay handi curries, and tandoori naans arrive as fresh and steaming as they were when lifted from the bhatti."
    },
    {
      question: "Do you use 100% pure cow desi ghee and zero palm oil?",
      answer: "Strictly yes. We only use pure cow desi ghee, cold-pressed kachi ghani mustard oil, and authentic single-estate spices. We have a zero-tolerance policy against artificial colors, MSG, or palm oils."
    },
    {
      question: "Are the Biryanis cooked in genuine traditional clay handis?",
      answer: "Yes! Every single biryani is layered with long-grain aged basmati rice, saffron milk, and royal marinades, sealed with whole wheat dough (dum pukt), and cooked over slow charcoal embers in authentic earthen clay handis."
    },
    {
      question: "What Indian payment methods do you support?",
      answer: "We support instant 1-click UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), RuPay/Visa/Mastercard debit and credit cards, all major Indian NetBanking banks (SBI, HDFC, ICICI, Axis, Kotak), and Cash on Delivery (COD)."
    },
    {
      question: "How does the Live GPS Radar order tracking work?",
      answer: "As soon as your order is received, you get a unique tracking ID (e.g. FE-8492) that shows live real-time GPS telemetry from our Shahi Rasoi kitchen through chef prep, clay baking, and courier electric pod transit straight to your doorstep."
    },
    {
      question: "Can I customize a Shahi Thali or Grand Dawat box for family gatherings?",
      answer: "Yes! Use our interactive 'Build Shahi Thali' tool to bundle 2, 4, 6, or 8 royal dishes with instant discounts up to 25% plus complimentary dessert bowls."
    }
  ];

  return (
    <section className="py-4 sm:py-16 bg-[#FFF8F2] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFC94A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-6">
        
        {/* Header (Ultra-Compact) */}
        <div className="text-center space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
            <HelpCircle className="w-3 h-3" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
            Everything You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">Need to Know</span>
          </h2>
          
          <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug line-clamp-1">
            Questions about our royal dum cooking, desi ghee standards, or express thermal delivery?
          </p>
        </div>

        {/* Compact Accordion List */}
        <div className="space-y-2 sm:space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white border-orange-200/90 shadow-soft-card"
                    : "bg-white/80 border-orange-100/70 hover:border-orange-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-3 sm:p-4 text-left flex items-center justify-between gap-2.5 font-heading cursor-pointer active:scale-99 transition-transform"
                >
                  <span className="text-xs sm:text-sm font-black text-gray-900 leading-snug pr-2">
                    {faq.question}
                  </span>
                  
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 shadow-2xs ${
                    isOpen ? "bg-[#FF6B35] text-white rotate-180" : "bg-gray-100 text-gray-600"
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 text-[11px] sm:text-xs text-gray-600 leading-relaxed border-t border-orange-50 animate-in fade-in duration-200">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Micro Trust Strip */}
        <div className="p-2.5 rounded-xl bg-white border border-orange-100 flex items-center justify-between text-[8.5px] sm:text-xs text-gray-500 font-bold shadow-2xs">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Transparent Food Integrity
          </span>
          <span className="flex items-center gap-1 text-[#FF6B35] font-black">
            <Sparkles className="w-3 h-3" /> 24/7 Patron Support
          </span>
        </div>

      </div>
    </section>
  );
};
