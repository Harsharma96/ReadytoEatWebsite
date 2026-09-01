"use client";

import React, { useState, useEffect } from "react";
import { OrderStatus } from "@/types";
import { 
  Bike, 
  MapPin, 
  Navigation, 
  Zap, 
  Phone, 
  ShieldCheck, 
  Radio, 
  Clock, 
  Sparkles,
  Compass
} from "lucide-react";

interface LiveOrderMapProps {
  orderStatus: OrderStatus;
  deliveryAddress: string;
  customerName: string;
  etaMinutes: number;
  courierName?: string;
  vehicle?: string;
}

export const LiveOrderMap: React.FC<LiveOrderMapProps> = ({
  orderStatus,
  deliveryAddress,
  customerName,
  etaMinutes,
  courierName = "Marco Silva",
  vehicle = "Electric Thermal Pod #08",
}) => {
  // Movement progression percentage (0 to 100)
  const [progress, setProgress] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(3.2);

  useEffect(() => {
    let baseProgress = 10;
    let baseSpeed = 0;
    let baseDistance = 3.8;

    if (orderStatus === "ORDER_RECEIVED") {
      baseProgress = 5;
      baseSpeed = 0;
      baseDistance = 3.8;
    } else if (orderStatus === "CHEF_PREPARING") {
      baseProgress = 15;
      baseSpeed = 0;
      baseDistance = 3.8;
    } else if (orderStatus === "WOOD_FIRED_BAKING") {
      baseProgress = 25;
      baseSpeed = 0;
      baseDistance = 3.5;
    } else if (orderStatus === "COURIER_DISPATCHED") {
      baseProgress = 65;
      baseSpeed = 28;
      baseDistance = 1.2;
    } else if (orderStatus === "DELIVERED") {
      baseProgress = 100;
      baseSpeed = 0;
      baseDistance = 0;
    }

    setProgress(baseProgress);
    setSpeed(baseSpeed);
    setDistanceKm(baseDistance);

    // If dispatched, animate micro-movements to feel alive
    if (orderStatus === "COURIER_DISPATCHED") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.4;
          return next > 95 ? 65 : next;
        });
        setSpeed(26 + Math.floor(Math.random() * 6));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [orderStatus]);

  // Compute SVG position along a curved bezier path
  // Start (Kitchen): x=80, y=320
  // Control 1: x=240, y=140
  // Control 2: x=460, y=380
  // End (Home): x=620, y=100
  const t = progress / 100;
  
  // Cubic Bezier interpolation: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
  const p0 = { x: 90, y: 280 };
  const p1 = { x: 260, y: 120 };
  const p2 = { x: 440, y: 340 };
  const p3 = { x: 610, y: 90 };

  const cx = Math.pow(1 - t, 3) * p0.x +
             3 * Math.pow(1 - t, 2) * t * p1.x +
             3 * (1 - t) * Math.pow(t, 2) * p2.x +
             Math.pow(t, 3) * p3.x;

  const cy = Math.pow(1 - t, 3) * p0.y +
             3 * Math.pow(1 - t, 2) * t * p1.y +
             3 * (1 - t) * Math.pow(t, 2) * p2.y +
             Math.pow(t, 3) * p3.y;

  return (
    <div className="rounded-[36px] bg-[#0B1220] border border-white/15 overflow-hidden shadow-2xl relative text-white space-y-4">
      
      {/* Top Map Header & Live Telemetry Bar */}
      <div className="p-5 sm:p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-heading">
                Live GPS Satellite Radar
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3ECF6E]/20 text-[#3ECF6E] text-[9px] font-black uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF6E] animate-ping" />
                Active Feed
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Kitchen Studio #04 ➔ {deliveryAddress}
            </p>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">Pod Speed</span>
            <span className="font-black text-[#FFC94A] font-mono">{speed} km/h</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">Distance</span>
            <span className="font-black text-[#3ECF6E] font-mono">{orderStatus === "DELIVERED" ? "0.0 km" : `${distanceKm.toFixed(1)} km`}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[9px] text-gray-400 block font-bold uppercase">Pod Temp</span>
            <span className="font-black text-[#FF6B35] font-mono">148.5°F</span>
          </div>
        </div>
      </div>

      {/* Interactive Vector Map Canvas */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-[#070D18] overflow-hidden select-none">
        
        {/* Map Grid Matrix Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Street Layout Vectors (Stylized Dark Map) */}
        <svg viewBox="0 0 700 400" className="w-full h-full preserve-3d">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#FFC94A" />
              <stop offset="100%" stopColor="#3ECF6E" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background City Streets & River Contours */}
          <path d="M 0,160 L 700,160" stroke="#152238" strokeWidth="12" fill="none" />
          <path d="M 0,310 L 700,310" stroke="#152238" strokeWidth="10" fill="none" />
          <path d="M 180,0 L 180,400" stroke="#152238" strokeWidth="12" fill="none" />
          <path d="M 380,0 L 380,400" stroke="#152238" strokeWidth="10" fill="none" />
          <path d="M 540,0 L 540,400" stroke="#152238" strokeWidth="8" fill="none" />
          
          {/* Secondary streets */}
          <path d="M 40,0 L 280,400" stroke="#0F172A" strokeWidth="4" fill="none" />
          <path d="M 320,0 L 600,400" stroke="#0F172A" strokeWidth="4" fill="none" />

          {/* Street Name Labels (Delhi / Indian Metro Grid) */}
          <text x="20" y="152" fill="#334155" fontSize="9" fontWeight="bold" letterSpacing="1">CONNAUGHT PLACE</text>
          <text x="400" y="302" fill="#334155" fontSize="9" fontWeight="bold" letterSpacing="1">BARAKHAMBA MARG</text>
          <text x="188" y="30" fill="#334155" fontSize="9" fontWeight="bold" letterSpacing="1">JANPATH AVENUE</text>
          <text x="388" y="380" fill="#334155" fontSize="9" fontWeight="bold" letterSpacing="1">KG MARG</text>

          {/* Background Path Track (Dashed) */}
          <path
            d="M 90,280 C 260,120 440,340 610,90"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="6"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Active Glowing Animated Trajectory Path */}
          <path
            d="M 90,280 C 260,120 440,340 610,90"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
            strokeDasharray="600"
            strokeDashoffset={600 - (progress / 100) * 600}
            className="transition-all duration-700 ease-out"
          />

          {/* 1. KITCHEN STUDIO BEACON */}
          <g transform="translate(90, 280)">
            <circle r="22" fill="#FF6B35" fillOpacity="0.15" className="animate-ping" />
            <circle r="14" fill="#FF6B35" />
            <circle r="6" fill="#ffffff" />
          </g>

          {/* 2. DESTINATION CUSTOMER HOUSE BEACON */}
          <g transform="translate(610, 90)">
            <circle r="24" fill="#3ECF6E" fillOpacity="0.2" className="animate-ping" />
            <circle r="14" fill="#3ECF6E" />
            <circle r="6" fill="#ffffff" />
          </g>
        </svg>

        {/* HTML Overlays on Top of Vector Map */}
        
        {/* Origin Label (Kitchen) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"
          style={{ left: "13%", top: "70%" }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-[#0B1220]/90 backdrop-blur-md border border-[#FF6B35]/40 text-center shadow-lg">
            <span className="text-[9px] text-[#FF6B35] font-black uppercase block">Origin Hub</span>
            <span className="text-[11px] font-black text-white whitespace-nowrap">🍳 Shahi Rasoi Hub #09</span>
          </div>
        </div>

        {/* Destination Label (Customer Destination) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"
          style={{ left: "87%", top: "22%" }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-[#0B1220]/90 backdrop-blur-md border border-[#3ECF6E]/40 text-center shadow-lg">
            <span className="text-[9px] text-[#3ECF6E] font-black uppercase block">Delivery Destination</span>
            <span className="text-[11px] font-black text-white whitespace-nowrap">🏠 {customerName}</span>
          </div>
        </div>

        {/* MOVING COURIER ELECTRIC POD */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 pointer-events-auto group cursor-pointer"
          style={{
            left: `${(cx / 700) * 100}%`,
            top: `${(cy / 400) * 100}%`,
          }}
        >
          {/* Pulsing Radar Ring */}
          <div className="absolute -inset-3 rounded-full bg-[#FF6B35]/30 animate-ping" />
          
          {/* Courier Pin Badge */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FFC94A] text-white flex items-center justify-center shadow-glow border-2 border-white transform transition-transform group-hover:scale-125">
            <Bike className="w-6 h-6 animate-bounce" />
          </div>

          {/* Floating Courier Popup Tag */}
          <div className="absolute left-1/2 -translate-x-1/2 top-14 whitespace-nowrap px-3 py-1.5 rounded-2xl bg-white text-[#0B1220] text-xs font-black shadow-2xl border border-gray-100 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF6B35] fill-[#FF6B35]" />
            <span>{courierName}</span>
            <span className="text-[10px] text-gray-400 font-bold">({etaMinutes}m ETA)</span>
          </div>
        </div>

      </div>

      {/* Courier Contact & Status Bottom Bar */}
      <div className="p-5 sm:p-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center text-xl flex-shrink-0">
            🚴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm">{courierName}</span>
              <span className="text-[10px] font-bold text-[#3ECF6E] bg-[#3ECF6E]/15 px-2 py-0.5 rounded-full">
                4.98 ★ Top Courier
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Assigned Vehicle: <strong>{vehicle}</strong>
            </p>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:+18008423328"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-[#3ECF6E]" />
            <span>Call Courier</span>
          </a>

          <div className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF8A00] font-black text-xs flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Tamper-Sealed Pod</span>
          </div>
        </div>
      </div>

    </div>
  );
};
