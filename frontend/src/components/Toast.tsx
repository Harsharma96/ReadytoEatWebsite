"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Sparkles } from "lucide-react";

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div className="px-4 py-3 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-white/20 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-rose-400 animate-spin-slow" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
