"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { 
  Send, 
  Sparkles, 
  Phone, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  Crown
} from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";

export const ContactSection: React.FC = () => {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occasion: "Private Chef Dining / Catering",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.occasion,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      setIsSubmitting(false);
      setSubmitted(true);
      showToast("✨ Inquiry sent! Chef concierge will contact you within 15 minutes.");
      triggerConfetti({ particleCount: 60, spread: 70 });
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Failed to connect to server. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-4 sm:py-16 bg-[#FFF8F2] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFC94A]/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
          
          {/* Left Column: Concierge Info (Ultra-Compact) */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-4 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[9px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
              <Crown className="w-3 h-3 text-[#FF6B35]" />
              <span>ROYAL CHEF CONCIERGE & DAWAT CATERING</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight leading-tight">
              Planning a Grand Dawat <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">or Royal Gathering?</span>
            </h2>

            <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug line-clamp-2 max-w-lg mx-auto lg:mx-0 font-medium">
              Bespoke handi menus crafted by master ustads for royal weddings, grand family dawats, and corporate celebrations.
            </p>

            {/* 2 Mini Contact Strip Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-1 max-w-lg mx-auto lg:mx-0">
              
              <div className="p-2.5 rounded-xl bg-white/95 border border-orange-100 shadow-2xs flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0E5] text-[#FF6B35] flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">+91 98765 43210 • 1800-DESI-EAT</p>
                  <p className="text-xs text-gray-500 font-medium">24/7 Shahi Dawat Concierge Line</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/95 border border-emerald-100 shadow-2xs flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#EAF9EF] text-[#2E7D32] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-black text-gray-900 truncate">Royal Kitchen Hubs</p>
                  <p className="text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold truncate">Delhi (CP) • Mumbai (Bandra) • Bengaluru</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Compact Glass Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl sm:rounded-[2rem] bg-white/95 backdrop-blur-xl p-4 sm:p-7 border border-orange-100/90 shadow-soft-card relative overflow-hidden">
              
              {submitted ? (
                <div className="text-center py-6 sm:py-8 space-y-2.5 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-[#EAF9EF] text-[#2E7D32] flex items-center justify-center mx-auto text-2xl shadow-xs">
                    ✨
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-gray-900 font-heading">
                    Inquiry Stored in Concierge System!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
                    Thank you {formData.name}. Our master chef concierge will contact you within 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", occasion: "Private Chef Dining / Catering", message: "" });
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-black hover:bg-[#FF6B35] transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5 text-left">
                  {errorMsg && (
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider block mb-1">
                        Email / Phone
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="email@domain.com or phone"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider block mb-1">
                        Occasion Type
                      </label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all shadow-2xs cursor-pointer"
                      >
                        <option value="Private Chef Dining / Catering">👑 Private Chef / Catering</option>
                        <option value="Wedding / Grand Dawat">💍 Wedding / Grand Dawat</option>
                        <option value="Corporate Feast & Lunch">🏢 Corporate Feast</option>
                        <option value="Custom Dietary Consultation">🥗 Dietary & Allergens</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider block mb-1">
                      Guest Count & Special Requests
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Guest count, date, location, or favorite dishes..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-2xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D] hover:from-[#E85620] hover:to-[#E63956] text-white font-black text-xs sm:text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Connecting to Concierge...</span>
                    ) : (
                      <>
                        <span>Submit Concierge Request</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
