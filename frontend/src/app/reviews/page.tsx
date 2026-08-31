"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Star, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Heart, 
  ThumbsUp, 
  MessageSquare, 
  ArrowRight,
  Filter,
  ShieldCheck
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  avatar: string;
  role: string;
  dish: string;
  category: string;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  likes: number;
  chefReply?: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: "r1",
    name: "Vikram Malhotra",
    avatar: "👨‍💼",
    role: "Verified Foodie • Bandra West",
    dish: "Double Smash Truffle Burger",
    category: "Burgers",
    rating: 5,
    date: "Yesterday",
    content: "The brioche bun was pillow-soft, and the double patty had that irresistible caramelized crust. Delivered in a thermal pod in 22 minutes steaming hot!",
    tags: ["Super Crispy", "Thermal Hot", "10/10 Bun"],
    likes: 48,
    chefReply: "Shukriya Vikram ji! Our brioche is baked fresh twice daily in our bakery studio.",
  },
  {
    id: "r2",
    name: "Ananya Sharma",
    avatar: "👩‍💻",
    role: "Verified Patron • Koramangala",
    dish: "Shahi Awadhi Dum Biryani",
    category: "Biryani",
    rating: 5,
    date: "2 days ago",
    content: "Opening the sealed clay handi released the most heavenly aroma of pure desi ghee and saffron. The long grain basmati was cooked to perfection.",
    tags: ["Authentic Dum", "Aromatic Kesar", "Clay Handi"],
    likes: 62,
    chefReply: "Honored Ananya! We slow-cook every handi over slow-burning coals for 3.5 hours.",
  },
  {
    id: "r3",
    name: "Rohan & Priya Mehta",
    avatar: "👫",
    role: "Feast Box Subscribers • South Delhi",
    dish: "Royal 4-Course Custom Feast Box",
    category: "Feast Box",
    rating: 5,
    date: "3 days ago",
    content: "We ordered the custom feast box for our anniversary dinner. The sourdough pizza was crisp, the dal makhani was rich and velvety, and the lava cake was pure heaven.",
    tags: ["Best Value", "Premium Packaging", "Anniversary Feast"],
    likes: 85,
  },
  {
    id: "r4",
    name: "Siddharth Joshi",
    avatar: "👨‍🍳",
    role: "Verified Food Critic • Ahmedabad",
    dish: "Surti Undhiyu & Ghee Phulka Thali",
    category: "Gujarati",
    rating: 5,
    date: "4 days ago",
    content: "As a Gujarati, finding authentic undhiyu without excess soda is rare. FoodEat's version is 100% pure desi ghee, authentic spices, and homestyle phulkas.",
    tags: ["Pure Sattvic", "Zero Soda", "Surti Heritage"],
    likes: 39,
  },
  {
    id: "r5",
    name: "Meera Sen",
    avatar: "👩‍🎨",
    role: "Verified Foodie • Indiranagar",
    dish: "Darjeeling Steamed Dim Sums",
    category: "Chinese",
    rating: 5,
    date: "5 days ago",
    content: "The translucent dumpling skin and juicy filling paired with the house fiery schezwan sauce is the best I have tasted in Bangalore.",
    tags: ["Juicy Filling", "Handmade Skin", "Fiery Dip"],
    likes: 29,
  },
  {
    id: "r6",
    name: "Karan Singhania",
    avatar: "🧑‍💼",
    role: "Verified Patron • Cyber City Gurgaon",
    dish: "Warm Belgian Molten Choco Lava",
    category: "Desserts",
    rating: 5,
    date: "6 days ago",
    content: "The warm chocolate literally flowed out when cut with a spoon. High quality couverture chocolate with zero artificial sweetness.",
    tags: ["Molten Center", "Belgian Chocolate", "Must Order"],
    likes: 74,
  },
];

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  const filteredReviews = REVIEWS_DATA.filter((r) => {
    if (selectedFilter === "All") return true;
    return r.category === selectedFilter;
  });

  const toggleLike = (id: string, initialLikes: number) => {
    setLikesState((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      return { ...prev, [id]: current + 1 };
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col relative z-10">
      <Navbar />

      {/* ================= 1. HERO BANNER ================= */}
      <section className="pt-28 pb-14 bg-gradient-to-b from-[#FFF0E5] via-[#FFE4D6] to-[#FFF8F2] relative overflow-hidden border-b border-black/5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 right-10 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B35] text-xs font-black shadow-xs border border-[#FF6B35]/20">
            <Star className="w-3.5 h-3.5 fill-[#FF6B35]" />
            <span>4.9 / 5 RATED BY 12,500+ ROYAL PATRONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1220] font-heading tracking-tight">
            Wall of Royal Love & Reviews
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Real stories from genuine food enthusiasts who trust FoodEat for their daily gourmet meals and grand celebrations.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-2xl sm:text-3xl font-black text-[#FF6B35] font-heading block">4.9 ★</span>
              <span className="text-[11px] font-bold text-gray-500">Overall Taste Score</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-2xl sm:text-3xl font-black text-[#3ECF6E] font-heading block">12,500+</span>
              <span className="text-[11px] font-bold text-gray-500">5-Star Reviews</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-2xl sm:text-3xl font-black text-[#FF8A00] font-heading block">99.4%</span>
              <span className="text-[11px] font-bold text-gray-500">On-Time Thermal Pods</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-soft-card">
              <span className="text-2xl sm:text-3xl font-black text-[#FF4D6D] font-heading block">86%</span>
              <span className="text-[11px] font-bold text-gray-500">Repeat Orders</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. CATEGORY FILTER STRIP ================= */}
      <section className="py-4 bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap pl-1">
              Filter By Dish:
            </span>

            {["All", "Burgers", "Biryani", "Feast Box", "Gujarati", "Chinese", "Desserts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedFilter === cat
                    ? "bg-[#FF6B35] text-white shadow-glow scale-105"
                    : "bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] border border-gray-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. REVIEWS MASONRY GRID ================= */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((r) => {
            const likesCount = likesState[r.id] !== undefined ? likesState[r.id] : r.likes;

            return (
              <div
                key={r.id}
                className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-soft-card flex flex-col justify-between space-y-5 hover:shadow-glow transition-all duration-300 relative"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#FFF0E5] flex items-center justify-center text-xl shadow-2xs border border-[#FF6B35]/20">
                        {r.avatar}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
                          <span>{r.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </h4>
                        <p className="text-[10px] font-bold text-gray-400">{r.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-gray-400">{r.date}</span>
                  </div>

                  {/* Stars & Dish Pill */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex text-[#FF8A00]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FF8A00]" />
                      ))}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF0E5] text-[#FF6B35] text-[10px] font-black">
                      {r.dish}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-gray-700 leading-relaxed pt-1">
                    &ldquo;{r.content}&rdquo;
                  </p>

                  {/* Tags */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    {r.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[9px] font-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Chef Reply if present */}
                  {r.chefReply && (
                    <div className="p-3 rounded-2xl bg-[#FFF8F2] border border-[#FF6B35]/15 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FF6B35]">
                        <Sparkles className="w-3 h-3" />
                        <span>Executive Chef Response</span>
                      </div>
                      <p className="text-[11px] text-gray-600 italic">
                        &ldquo;{r.chefReply}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Like Counter */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(r.id, r.likes)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF6B35] transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({likesCount})</span>
                  </button>

                  <Link
                    href={`/category/${r.category.toLowerCase()}`}
                    className="text-[10px] font-black text-[#FF6B35] hover:underline flex items-center gap-1"
                  >
                    <span>Order {r.category}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
