"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Instagram, 
  Heart, 
  X, 
  ArrowRight,
  ChefHat
} from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  likes: string;
  frameClass: string;
  chefNote: string;
}

const PREVIEW_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "Awadhi Dum Gosht Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85",
    category: "👑 Handi Dum",
    likes: "4.8k",
    frameClass: "col-span-2 h-[140px] sm:h-[190px]",
    chefNote: "Slow-dum cooked for 4 hours with fragrant aged Basmati and whole Kashmiri saffron in sealed earthen handis."
  },
  {
    id: 2,
    title: "Purani Dilli Butter Chicken",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85",
    category: "🍲 Desi Ghee",
    likes: "6.2k",
    frameClass: "col-span-1 row-span-2 h-[208px] sm:h-[296px]",
    chefNote: "Charcoal-smoked chicken steeped in velvety vine-ripened tomato & white butter gravy."
  },
  {
    id: 3,
    title: "Bukhara Dal Makhani",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85",
    category: "⏳ Slow Simmered",
    likes: "3.9k",
    frameClass: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Simmered continuously over gentle coal embers with fresh churned white butter."
  },
  {
    id: 4,
    title: "Amritsari Paneer Tikka",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85",
    category: "🔥 Clay Tandoor",
    likes: "5.1k",
    frameClass: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Marinated in yellow mustard & hung curd, charred to perfection in earthen clay bhatti."
  },
  {
    id: 5,
    title: "24K Gold Shahi Gulab Jamun",
    image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=1000&q=85",
    category: "🍯 Royal Mithai",
    likes: "7.4k",
    frameClass: "col-span-2 h-[135px] sm:h-[180px]",
    chefNote: "Stuffed with pistachio and green cardamom, soaked in saffron syrup with edible 24K gold leaf."
  }
];

export const FoodGallerySection: React.FC = () => {
  const [activeItemModal, setActiveItemModal] = useState<GalleryItem | null>(null);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-4 sm:py-16 bg-gradient-to-b from-[#FFF8F2] via-white to-[#FFF8F2] relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-5 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFC94A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl md:max-w-6xl lg:max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-3 sm:space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-sm md:max-w-xl mx-auto space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[8.5px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
            <Instagram className="w-3 h-3 text-[#FF6B35]" />
            <span>@FOODEAT.SHAHI • CULINARY SHOWCASE</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
            <span>Royal Culinary Photo Collage</span>
          </h2>
          
          <p className="text-gray-500 text-[10.5px] sm:text-sm leading-snug">
            Pure culinary visual art from our Shahi kitchen studios. Tap to preview or explore our master khansama creations.
          </p>
        </div>

        {/* ================= 1. MOBILE PHONE COLLAGE GRID (md:hidden - UNCHANGED) ================= */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:hidden">
          {PREVIEW_GALLERY_ITEMS.map((item) => {
            const liked = isLiked[item.id];

            return (
              <div
                key={item.id}
                onClick={() => setActiveItemModal(item)}
                className={`${item.frameClass} group relative rounded-2xl overflow-hidden bg-gray-900 border-2 border-white shadow-soft-card hover:shadow-glow hover:border-[#FF6B35]/50 transition-all duration-300 cursor-pointer active:scale-97`}
              >
                {/* Photo Frame */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Top-Right Floating Heart Button */}
                <button
                  onClick={(e) => toggleLike(e, item.id)}
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-75 cursor-pointer shadow-xs ${
                    liked ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                  title="Like photo"
                >
                  <Heart className={`w-3 h-3 ${liked ? "fill-white" : ""}`} />
                </button>

                {/* Bottom Dish Name Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex items-end">
                  <span className="text-[10px] font-black text-white truncate font-heading drop-shadow-md leading-tight">
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 2. DESKTOP LUXURY BENTO MOSAIC (hidden md:grid) ================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 lg:gap-5">
          {/* Top Row: 7 Cols (Biryani) + 5 Cols (Butter Chicken) */}
          <div
            onClick={() => setActiveItemModal(PREVIEW_GALLERY_ITEMS[0])}
            className="md:col-span-7 h-[300px] lg:h-[360px] group relative rounded-3xl overflow-hidden bg-gray-950 border-2 border-white shadow-xl hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            <img
              src={PREVIEW_GALLERY_ITEMS[0].image}
              alt={PREVIEW_GALLERY_ITEMS[0].title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-black text-white uppercase tracking-wider border border-white/15">
                  {PREVIEW_GALLERY_ITEMS[0].category}
                </span>
                <button
                  onClick={(e) => toggleLike(e, PREVIEW_GALLERY_ITEMS[0].id)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isLiked[PREVIEW_GALLERY_ITEMS[0].id] ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[PREVIEW_GALLERY_ITEMS[0].id] ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-black text-white font-heading">
                  {PREVIEW_GALLERY_ITEMS[0].title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-1">
                  {PREVIEW_GALLERY_ITEMS[0].chefNote}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveItemModal(PREVIEW_GALLERY_ITEMS[1])}
            className="md:col-span-5 h-[300px] lg:h-[360px] group relative rounded-3xl overflow-hidden bg-gray-950 border-2 border-white shadow-xl hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            <img
              src={PREVIEW_GALLERY_ITEMS[1].image}
              alt={PREVIEW_GALLERY_ITEMS[1].title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-black text-white uppercase tracking-wider border border-white/15">
                  {PREVIEW_GALLERY_ITEMS[1].category}
                </span>
                <button
                  onClick={(e) => toggleLike(e, PREVIEW_GALLERY_ITEMS[1].id)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isLiked[PREVIEW_GALLERY_ITEMS[1].id] ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[PREVIEW_GALLERY_ITEMS[1].id] ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-black text-white font-heading">
                  {PREVIEW_GALLERY_ITEMS[1].title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-1">
                  {PREVIEW_GALLERY_ITEMS[1].chefNote}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Equal Columns (Dal Makhani, Paneer Tikka, Gulab Jamun) */}
          <div
            onClick={() => setActiveItemModal(PREVIEW_GALLERY_ITEMS[2])}
            className="md:col-span-4 h-[240px] lg:h-[280px] group relative rounded-3xl overflow-hidden bg-gray-950 border-2 border-white shadow-xl hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            <img
              src={PREVIEW_GALLERY_ITEMS[2].image}
              alt={PREVIEW_GALLERY_ITEMS[2].title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-black text-white uppercase tracking-wider border border-white/15">
                  {PREVIEW_GALLERY_ITEMS[2].category}
                </span>
                <button
                  onClick={(e) => toggleLike(e, PREVIEW_GALLERY_ITEMS[2].id)}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isLiked[PREVIEW_GALLERY_ITEMS[2].id] ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked[PREVIEW_GALLERY_ITEMS[2].id] ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="text-base lg:text-lg font-black text-white font-heading">
                  {PREVIEW_GALLERY_ITEMS[2].title}
                </h3>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveItemModal(PREVIEW_GALLERY_ITEMS[3])}
            className="md:col-span-4 h-[240px] lg:h-[280px] group relative rounded-3xl overflow-hidden bg-gray-950 border-2 border-white shadow-xl hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            <img
              src={PREVIEW_GALLERY_ITEMS[3].image}
              alt={PREVIEW_GALLERY_ITEMS[3].title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-black text-white uppercase tracking-wider border border-white/15">
                  {PREVIEW_GALLERY_ITEMS[3].category}
                </span>
                <button
                  onClick={(e) => toggleLike(e, PREVIEW_GALLERY_ITEMS[3].id)}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isLiked[PREVIEW_GALLERY_ITEMS[3].id] ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked[PREVIEW_GALLERY_ITEMS[3].id] ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="text-base lg:text-lg font-black text-white font-heading">
                  {PREVIEW_GALLERY_ITEMS[3].title}
                </h3>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveItemModal(PREVIEW_GALLERY_ITEMS[4])}
            className="md:col-span-4 h-[240px] lg:h-[280px] group relative rounded-3xl overflow-hidden bg-gray-950 border-2 border-white shadow-xl hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            <img
              src={PREVIEW_GALLERY_ITEMS[4].image}
              alt={PREVIEW_GALLERY_ITEMS[4].title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-black text-white uppercase tracking-wider border border-white/15">
                  {PREVIEW_GALLERY_ITEMS[4].category}
                </span>
                <button
                  onClick={(e) => toggleLike(e, PREVIEW_GALLERY_ITEMS[4].id)}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isLiked[PREVIEW_GALLERY_ITEMS[4].id] ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked[PREVIEW_GALLERY_ITEMS[4].id] ? "fill-white" : ""}`} />
                </button>
              </div>

              <div>
                <h3 className="text-base lg:text-lg font-black text-white font-heading">
                  {PREVIEW_GALLERY_ITEMS[4].title}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DIRECT "MORE / VIEW FULL GALLERY PAGE" ACTION ================= */}
        <div className="flex justify-center pt-2 sm:pt-4">
          <Link
            href="/gallery"
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs sm:text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Open Full Gallery Page (12+ HD Drops)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* ================= INTERACTIVE PHOTO LIGHTBOX MODAL ================= */}
      {activeItemModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveItemModal(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-[22px] sm:rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-20 active:scale-90 shadow-md"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-Resolution Photo Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
              <img 
                src={activeItemModal.image} 
                alt={activeItemModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider">
                  {activeItemModal.category}
                </span>
              </div>
            </div>

            {/* Modal Details Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-heading leading-tight">
                    {activeItemModal.title}
                  </h3>
                  <span className="text-[10px] text-[#FF6B35] font-black block mt-0.5">
                    ❤️ {activeItemModal.likes} Food Lovers Liked This Drop
                  </span>
                </div>

                <button
                  onClick={(e) => toggleLike(e, activeItemModal.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 transition-all active:scale-90 ${
                    isLiked[activeItemModal.id] 
                      ? "bg-[#FF4D6D] text-white shadow-xs" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked[activeItemModal.id] ? "fill-white" : ""}`} />
                  <span>{isLiked[activeItemModal.id] ? "Liked" : "Like"}</span>
                </button>
              </div>

              {/* Chef Craftsmanship Note */}
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs text-gray-700 font-medium leading-relaxed">
                <span className="font-black text-gray-900 block mb-0.5 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-[#FF6B35]" /> Master Khansama Craft:
                </span>
                {activeItemModal.chefNote}
              </div>

              {/* Actions Bar */}
              <div className="pt-1 flex items-center gap-2">
                <Link
                  href="/gallery"
                  onClick={() => setActiveItemModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs font-black shadow-glow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Open Full Gallery Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setActiveItemModal(null)}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
