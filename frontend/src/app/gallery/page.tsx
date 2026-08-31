"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Sparkles, 
  Instagram, 
  Heart, 
  X, 
  Clock, 
  ChefHat, 
  ShoppingBag,
  UtensilsCrossed,
  ArrowRight
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  likes: number;
  time: string;
  price: number;
  frameStyle: string;
  chefNote: string;
  ingredients: string[];
}

const COLLAGE_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "Awadhi Dum Gosht Biryani",
    category: "👑 Royal Dum",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85",
    likes: 4820,
    time: "4-Hour Dum",
    price: 349,
    frameStyle: "col-span-2 h-[140px] sm:h-[200px]",
    chefNote: "Slow-dum cooked in dough-sealed clay handis over gentle charcoal embers with aged Basmati and Kashmiri saffron.",
    ingredients: ["Aged Basmati", "Tender Lamb", "Kashmiri Kesar", "Vedic Desi Ghee", "Whole Awadhi Masalas"]
  },
  {
    id: 2,
    title: "Purani Dilli Butter Chicken",
    category: "🍲 Desi Ghee",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85",
    likes: 6240,
    time: "Slow Simmered",
    price: 329,
    frameStyle: "col-span-1 row-span-2 h-[208px] sm:h-[296px]",
    chefNote: "Charcoal-tandoor smoked chicken steeped in velvety vine-ripened tomato puree and artisanal churned white butter.",
    ingredients: ["Tandoori Chicken", "Vine Tomatoes", "Churned White Makkhan", "Cashew Silk", "Kasuri Methi"]
  },
  {
    id: 3,
    title: "Bukhara Dal Makhani",
    category: "🍲 Desi Ghee",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85",
    likes: 3950,
    time: "24-Hour Simmer",
    price: 249,
    frameStyle: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Black urad lentils slow-simmered continuously for 24 hours over charcoal ashes with fresh cow cream.",
    ingredients: ["Whole Black Urad", "Rajma", "Cow Ghee", "Fresh Malai Cream", "Garlic Embers"]
  },
  {
    id: 4,
    title: "Amritsari Paneer Tikka",
    category: "🔥 Clay Tandoor",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85",
    likes: 5120,
    time: "Charred Bhatti",
    price: 279,
    frameStyle: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Thick cubes of fresh malai paneer steeped in mustard oil, hung curd, and roasted carom seeds.",
    ingredients: ["Fresh Malai Paneer", "Cold Pressed Mustard", "Hung Curd", "Ajwain", "Degi Mirch"]
  },
  {
    id: 5,
    title: "24K Gold Shahi Gulab Jamun",
    category: "🍯 Shahi Mithai",
    image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=1000&q=85",
    likes: 7420,
    time: "Kesar Chashni",
    price: 199,
    frameStyle: "col-span-2 h-[135px] sm:h-[190px]",
    chefNote: "Khoya mawa dumplings stuffed with pistachio-cardamom praline, soaked in rose-saffron syrup with 24K gold leaf.",
    ingredients: ["Fresh Khoya Mawa", "Pistachio Praline", "Green Cardamom", "Kashmiri Saffron", "24K Gold Vark"]
  },
  {
    id: 6,
    title: "Kesar Pista Matka Lassi",
    category: "🥛 Kulhad",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=85",
    likes: 4310,
    time: "Fresh Churned",
    price: 129,
    frameStyle: "col-span-1 h-[115px] sm:h-[160px]",
    chefNote: "Thick malai curd churned with powdered green cardamom and saffron, served in chilled terracotta kulhads.",
    ingredients: ["Cultured Curd", "Thick Malai Layer", "Iranian Pistachio", "Saffron Drops", "Terracotta Kulhad"]
  },
  {
    id: 7,
    title: "Double Smash Burger",
    category: "🍔 Artisan Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    likes: 8150,
    time: "Crispy Smashed",
    price: 249,
    frameStyle: "col-span-1 h-[115px] sm:h-[160px]",
    chefNote: "Twin caramelized patties smashed crispy on a cast iron flat top with double aged cheddar on toasted brioche.",
    ingredients: ["Prime Patty", "Aged Cheddar", "Caramelized Onion", "Truffle Mayo", "Butter Brioche"]
  },
  {
    id: 8,
    title: "Wood-Fired Truffle Pizza",
    category: "🍕 Wood-Fired",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85",
    likes: 5930,
    time: "900°F Oak Wood",
    price: 389,
    frameStyle: "col-span-2 h-[140px] sm:h-[200px]",
    chefNote: "48-hour cold-fermented sourdough crust blistered at 900°F with fresh buffalo mozzarella and white truffle glaze.",
    ingredients: ["48-Hr Sourdough", "San Marzano Base", "Fresh Mozzarella", "Truffle Oil", "Fresh Basil"]
  },
  {
    id: 9,
    title: "Kakori Seekh Kebab",
    category: "🔥 Clay Tandoor",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85",
    likes: 6780,
    time: "Melt-In-Mouth",
    price: 369,
    frameStyle: "col-span-1 row-span-2 h-[208px] sm:h-[296px]",
    chefNote: "Minced lamb infused with raw papaya, roasted gram, and 24 secret royal aromatics, skewered over low coal heat.",
    ingredients: ["Finely Minced Lamb", "Raw Papaya", "Awadhi Rose Petals", "Charcoal Grill", "Mint Chutney"]
  },
  {
    id: 10,
    title: "Zafrani Shahi Paneer",
    category: "🍲 Desi Ghee",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85",
    likes: 4940,
    time: "Cashew Base",
    price: 299,
    frameStyle: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Grated and diced artisanal paneer cooked in a rich onion-tomato gravy with crushed cashews and saffron cream.",
    ingredients: ["Cottage Cheese", "Cashew Gravy", "Kashmiri Mirch", "Kasuri Methi", "Saffron Cream"]
  },
  {
    id: 11,
    title: "Malai Kulfi Falooda",
    category: "🍯 Shahi Mithai",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=85",
    likes: 5620,
    time: "Rabdi Churned",
    price: 169,
    frameStyle: "col-span-1 h-[100px] sm:h-[144px]",
    chefNote: "Slow-reduced rabdi kulfi topped with hand-pressed cornstarch falooda noodles and organic damask rose syrup.",
    ingredients: ["Rabdi Kulfi", "Corn Falooda", "Sabja Seeds", "Damask Rose Syrup", "Crushed Pistachio"]
  },
  {
    id: 12,
    title: "Crispy Peri-Peri Wings",
    category: "🍕 Starters",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=85",
    likes: 7100,
    time: "Golden Crisp",
    price: 269,
    frameStyle: "col-span-2 h-[135px] sm:h-[190px]",
    chefNote: "Buttermilk-brined chicken wings dredged in spiced flour and flash-fried to golden crunch with peri-peri dust.",
    ingredients: ["Buttermilk Brine", "Crisp Crumb", "Peri-Peri Seasoning", "Smoked Paprika", "Garlic Herb Dip"]
  }
];

export default function GalleryPage() {
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex flex-col selection:bg-[#FF6B35] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        
        {/* Background Gradients */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#FFC94A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto px-3 sm:px-6 relative z-10 space-y-3 sm:space-y-5">
          
          {/* ================= PAGE HEADER ================= */}
          <div className="text-center max-w-sm mx-auto space-y-1 sm:space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[8.5px] sm:text-xs font-black border border-[#FF6B35]/20 shadow-2xs">
              <Instagram className="w-2.5 h-2.5 text-[#FF6B35]" />
              <span>@FOODEAT.SHAHI • PHOTO COLLAGE</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1220] font-heading tracking-tight">
              Royal Culinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D]">Photo Collage</span>
            </h1>

            <p className="text-gray-500 text-[9.5px] sm:text-xs leading-none">
              Pure culinary visual art from our Shahi kitchen studios. Tap any photo for recipe details.
            </p>
          </div>

          {/* ================= GEOMETRIC PHOTO COLLAGE GRID (PROPORTIONATE & CLEAR) ================= */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {COLLAGE_ITEMS.map((item) => {
              const isLiked = likedItems[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className={`${item.frameStyle} group relative rounded-2xl overflow-hidden bg-gray-900 border-2 border-white shadow-soft-card hover:shadow-glow hover:border-[#FF6B35]/50 transition-all duration-300 cursor-pointer active:scale-98`}
                >
                  {/* Photo Frame with Proper Object Cover & Center */}
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
                      isLiked ? "bg-[#FF4D6D] text-white" : "bg-black/40 text-white hover:bg-black/60"
                    }`}
                    title="Like photo"
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? "fill-white" : ""}`} />
                  </button>

                  {/* Bottom Dish Name Overlay (Crystal Clear) */}
                  <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex items-end">
                    <span className="text-[10px] sm:text-xs font-black text-white truncate font-heading drop-shadow-md leading-tight">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= BOTTOM MENU ACTION BANNER ================= */}
          <div className="p-3 sm:p-5 rounded-2xl bg-[#0B1220] text-white flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xl border border-white/10 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-[8.5px] uppercase font-black tracking-widest text-[#FFC94A] flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-2.5 h-2.5" /> 100% Shahi Dispatch
              </span>
              <h3 className="text-xs sm:text-sm font-black font-heading text-white">
                Taste Any of These Royal Dishes at Home
              </h3>
            </div>

            <Link
              href="/menu"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <UtensilsCrossed className="w-3 h-3" />
              <span>Explore Chef Menu →</span>
            </Link>
          </div>

        </div>
      </main>

      {/* ================= INTERACTIVE PHOTO LIGHTBOX MODAL ================= */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-[22px] sm:rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-20 active:scale-90 shadow-md"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-Resolution Photo Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-950">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider">
                  {activeModalItem.category}
                </span>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-4 sm:p-5 space-y-3">
              
              {/* Header Title & Pricing */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-heading leading-tight">
                    {activeModalItem.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-bold">
                    <span className="text-[#FF6B35] font-black text-sm">₹{activeModalItem.price}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-600 text-[10.5px]">
                      <Clock className="w-3 h-3 text-gray-400" /> {activeModalItem.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleLike(e, activeModalItem.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 transition-all active:scale-90 shrink-0 ${
                    likedItems[activeModalItem.id]
                      ? "bg-[#FF4D6D] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedItems[activeModalItem.id] ? "fill-white" : ""}`} />
                  <span>{likedItems[activeModalItem.id] ? "Liked" : "Like"}</span>
                </button>
              </div>

              {/* Chef Craftsmanship Note */}
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/70 text-xs text-gray-700 font-medium leading-relaxed">
                <span className="font-black text-gray-900 block mb-0.5 flex items-center gap-1 text-[11px]">
                  <ChefHat className="w-3.5 h-3.5 text-[#FF6B35]" /> Master Khansama Craft Story:
                </span>
                {activeModalItem.chefNote}
              </div>

              {/* Key Heritage Ingredients */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                  Key Heritage Ingredients:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeModalItem.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold"
                    >
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                <Link
                  href="/menu"
                  onClick={() => setActiveModalItem(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs font-black shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Now from Menu (₹{activeModalItem.price})</span>
                </Link>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
