"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Loader2,
  ChefHat,
  Crown,
  ShieldAlert,
  CheckCircle2,
  Fingerprint,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer <= 0) {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
      return;
    }
    lockIntervalRef.current = setInterval(() => {
      setLockoutTimer((t) => {
        if (t <= 1) {
          clearInterval(lockIntervalRef.current!);
          setError("");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
    };
  }, [lockoutTimer]);

  // If already authenticated as admin, go straight to /admin
  useEffect(() => {
    const token = localStorage.getItem("foodeat_admin_token");
    const user = localStorage.getItem("foodeat_admin_user");
    if (token && user) {
      try {
        const u = JSON.parse(user);
        if (u.role === "admin") {
          router.replace("/admin");
        }
      } catch {}
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) return setError("Admin email is required.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(data.message || "Access granted! Redirecting...");
        localStorage.setItem("foodeat_admin_token", data.token);
        localStorage.setItem("foodeat_admin_user", JSON.stringify(data.user));
        sessionStorage.setItem("foodeat_admin_auth", "true");
        setTimeout(() => router.replace("/admin"), 800);
      } else {
        setError(data.message || "Authentication failed.");
        if (data.lockedUntil) {
          const secsLeft = Math.ceil((data.lockedUntil - Date.now()) / 1000);
          setLockoutTimer(secsLeft);
        }
        const match = data.message?.match(/(\d+) attempt/);
        if (match) setAttemptsLeft(parseInt(match[1]));
      }
    } catch {
      setError("Network error. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#07080F] flex relative overflow-hidden font-sans select-none">
      {/* ══ Ambient Lights ══ */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#FF6B35]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#FF8A00]/8 blur-[120px] pointer-events-none" />

      {/* ══ Left Decorative Brand Showcase (Desktop only) ══ */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-white/5 bg-gradient-to-br from-[#120B06] via-[#090A12] to-[#07080F]">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,107,53,0.4)] group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-black font-heading tracking-tight text-white flex items-center">
                FOOD<span className="text-[#FF6B35]">EAT</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.25em] text-[#FF8A00] uppercase block">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 space-y-8 max-w-md">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF6B35]/20 to-[#FF8A00]/10 border border-[#FF6B35]/30 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Crown className="w-10 h-10 text-[#FF6B35]" strokeWidth={1.75} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#3ECF6E] border-2 border-[#07080F] flex items-center justify-center shadow-xs">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight font-heading tracking-tight">
              Royal Kitchen
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-amber-400">
                Command Terminal
              </span>
            </h1>
            <p className="text-xs xl:text-sm text-gray-400 leading-relaxed font-medium">
              Real-time ticket dispatch, menu catalog management, sales telemetry, and guest inquiries in one secure panel.
            </p>
          </div>

          {/* Pillars List */}
          <div className="space-y-2.5 pt-2">
            {[
              { icon: "⚡", title: "Live Kitchen Tickets Feed", desc: "Real-time kitchen order state machine & dispatch" },
              { icon: "📊", title: "Sales & Financial Ledger", desc: "7-day revenue archive, UPI vs COD breakdowns" },
              { icon: "🛡️", title: "Encrypted Security Guard", desc: "JWT role verification with brute force protection" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xs hover:border-[#FF6B35]/30 transition-colors"
              >
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-black text-white font-heading">{item.title}</h4>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-gray-500 font-medium pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3ECF6E]" />
            <span>Server: REST API Online</span>
          </div>
          <span>v2.4.0 Live</span>
        </div>
      </div>

      {/* ══ Right Login Form Panel ══ */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile Top Brand */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,107,53,0.4)]">
                  <ChefHat className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-[#07080F] flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black font-heading text-white">
                  FOOD<span className="text-[#FF6B35]">EAT</span>
                </span>
                <span className="text-[9px] font-black tracking-[0.2em] text-[#FF8A00] uppercase block">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#3ECF6E] text-[10px] font-black uppercase tracking-wider mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF6E] animate-pulse" />
              <span>Admin Terminal Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Sign In to Admin
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
              Enter your authorized admin credentials.
            </p>
          </div>

          {/* Error Alert */}
          {error && !lockoutTimer && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-2xl bg-red-950/60 border border-red-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm text-red-300 font-bold block">{error}</span>
                {attemptsLeft !== null && attemptsLeft > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] text-red-400 font-medium">Attempts left:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-4 rounded-full transition-all ${
                          i < attemptsLeft ? "bg-red-400/40" : "bg-red-500 shadow-xs"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lockout Alert */}
          {lockoutTimer > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-950/50 border border-amber-500/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Console Locked
                  </h4>
                  <p className="text-xs text-amber-400/80">
                    Retry allowed in <strong className="text-white font-mono">{fmt(lockoutTimer)}</strong>
                  </p>
                </div>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#FF6B35] rounded-full transition-all"
                  style={{ width: `${(lockoutTimer / 900) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-[#3ECF6E] shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider">
                Admin Email
              </label>
              <div
                className={`relative flex items-center rounded-2xl bg-white/[0.04] border transition-all ${
                  focused === "email"
                    ? "border-[#FF6B35] shadow-[0_0_0_3px_rgba(255,107,53,0.15)] bg-white/[0.07]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Mail
                  className={`w-4 h-4 absolute left-4 transition-colors ${
                    focused === "email" ? "text-[#FF6B35]" : "text-gray-500"
                  }`}
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Admin@gmail.com"
                  value={email}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={lockoutTimer > 0 || loading}
                  className="w-full h-12 pl-11 pr-4 bg-transparent text-white placeholder-gray-600 text-xs sm:text-sm font-medium focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-[#FF6B35] hover:text-[#FF8A00] transition-colors"
                  tabIndex={-1}
                >
                  Forgot Password?
                </Link>
              </div>
              <div
                className={`relative flex items-center rounded-2xl bg-white/[0.04] border transition-all ${
                  focused === "password"
                    ? "border-[#FF6B35] shadow-[0_0_0_3px_rgba(255,107,53,0.15)] bg-white/[0.07]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Lock
                  className={`w-4 h-4 absolute left-4 transition-colors ${
                    focused === "password" ? "text-[#FF6B35]" : "text-gray-500"
                  }`}
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  value={password}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  disabled={lockoutTimer > 0 || loading}
                  className="w-full h-12 pl-11 pr-12 bg-transparent text-white placeholder-gray-600 text-xs sm:text-sm font-medium focus:outline-none disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="w-8 h-8 absolute right-2 text-gray-500 hover:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading || lockoutTimer > 0}
              className="w-full h-12 mt-2 rounded-2xl relative overflow-hidden group flex items-center justify-center gap-2 font-black text-xs sm:text-sm text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A00 50%, #FF6B35 100%)",
                backgroundSize: "200% 100%",
                boxShadow: "0 8px 30px rgba(255,107,53,0.35)",
              }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : lockoutTimer > 0 ? (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Locked ({fmt(lockoutTimer)})</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>Unlock Admin Terminal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Bottom Return Link */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Return to Main Website</span>
            </Link>
          </div>

          {/* Security footnote */}
          <p className="mt-4 text-center text-[10px] text-gray-600">
            Encrypted session · Unauthorized access attempts are monitored
          </p>
        </div>
      </div>
    </div>
  );
}
