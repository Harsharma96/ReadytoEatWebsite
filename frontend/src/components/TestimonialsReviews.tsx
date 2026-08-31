"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, Quote, Sparkles, ThumbsUp, Heart } from "lucide-react";

export const TestimonialsReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Chef Ranveer Kapoor",
      role: "Royal Awadhi Culinary Historian",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      title: "The authentic Awadhi dum technique has been revived",
      comment: "The aroma of pure desi ghee, charcoal dum, and genuine Kashmiri saffron hits you the moment the dough seal on the clay handi is broken. Truly royal culinary heritage.",
      verified: true,
      favoriteDish: "Shahi Awadhi Dum Gosht Biryani",
      likes: 184
    },
    {
      id: 2,
      name: "Ananya Sengupta",
      role: "Senior Food Critic & Columnist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      title: "Old Delhi nostalgia with 5-star hygiene",
      comment: "The Purani Dilli Butter Chicken and crisp tandoori garlic butter naan are unmatchable. You can taste the purity of tomatoes and whole spices without any artificial red food dye.",
      verified: true,
      favoriteDish: "Purani Dilli Butter Chicken",
      likes: 142
    },
    {
      id: 3,
      name: "Dr. Rajiv Nambiar",
      role: "Ayurvedic & Holistic Nutritionist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      title: "Zero palm oil. Pure 24-hr earthenware simmering",
      comment: "Finding a delivery kitchen that honors traditional 24-hour slow cooking for Dal Makhani with 100% cow desi ghee and zero heavy hydrogenated fats is rare. FoodEat is the gold benchmark.",
      verified: true,
      favoriteDish: "Bukhara 24-Hr Dal Makhani",
      likes: 119
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#FFF8F2] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#FFC94A]/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8E1] text-amber-900 text-xs font-black border border-[#FFC94A]/30">
            <Star className="w-3.5 h-3.5 fill-[#FFC94A] text-[#FFC94A]" />
            <span>4.98 / 5.0 RATED BY OVER 4,800+ ROYAL PATRONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 font-heading">
            Praised by India's Top Chefs & Culinary Connoisseurs
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover why food historians, master ustads, and discerning families choose FoodEat for every celebration.
          </p>
        </div>

        {/* Review Glass Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-[2.5rem] glass-card p-8 border border-white/90 shadow-soft-card hover:shadow-glow hover:border-[#FF6B35]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-1 text-[#FFC94A]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFC94A]" />
                  ))}
                </div>

                <h4 className="text-base font-black text-gray-900 font-heading">
                  "{rev.title}"
                </h4>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Favorite Dish Tag */}
                <div className="pt-2">
                  <span className="text-[11px] font-black text-[#FF6B35] bg-[#FFF0E5] px-3 py-1 rounded-xl inline-block border border-[#FF6B35]/20">
                    👑 Loves: {rev.favoriteDish}
                  </span>
                </div>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h5 className="text-xs font-black text-gray-900">{rev.name}</h5>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold">{rev.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>{rev.likes}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Press Ribbon */}
        <div className="mt-16 pt-12 border-t border-gray-200/60 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
            Celebrated Across National Media & Culinary Guides
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-black tracking-tighter text-gray-900">THE TIMES OF INDIA</span>
            <span className="text-xl font-extrabold tracking-widest text-gray-900">Hindustan Times</span>
            <span className="text-xl font-black tracking-tight text-gray-900">INDIA TODAY</span>
            <span className="text-xl font-serif italic font-black text-gray-900">BBC Good Food</span>
            <span className="text-xl font-black uppercase text-gray-900">NDTV Food</span>
          </div>
        </div>

      </div>
    </section>
  );
};
