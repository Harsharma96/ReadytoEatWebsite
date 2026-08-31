"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  KeyRound,
  RefreshCw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Please enter your email address.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setResendCooldown(60);
        if (data.devOtp) {
          // Dev mode: auto-fill OTP
          const digits = data.devOtp.split("");
          setOtp(digits);
        }
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) return setError("Please enter the 6-digit OTP.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("reset");
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
        setTimeout(() => router.push("/admin/login"), 2500);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setResendCooldown(60);
        if (data.devOtp) {
          setOtp(data.devOtp.split(""));
        }
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Progress steps ────────────────────────────────────────────────────────
  const steps = [
    { key: "email", label: "Email", icon: Mail },
    { key: "otp", label: "OTP", icon: Shield },
    { key: "reset", label: "Reset", icon: KeyRound },
  ];

  const stepIndex = step === "done" ? 3 : steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {["🔑", "🛡️", "🔒", "✨", "🍛", "👑"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-xl opacity-10 animate-bounce"
            style={{
              left: `${(i * 16 + 4) % 90}%`,
              top: `${(i * 14 + 6) % 85}%`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex flex-col items-center gap-2.5 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center shadow-2xl shadow-[#FF6B35]/40 group-hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black font-heading tracking-tight text-white">
                FOOD<span className="text-[#FF6B35]">EAT</span>
              </h1>
              <p className="text-[9px] font-black tracking-[0.3em] text-[#FF8A00] uppercase mt-0.5">Royal Rasoi</p>
            </div>
          </Link>
        </div>

        {/* Progress Indicator */}
        {step !== "done" && (
          <div className="flex items-center gap-1 mb-6 px-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === stepIndex;
              const isDone = i < stepIndex;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDone
                          ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                          : isActive
                          ? "bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] shadow-lg shadow-[#FF6B35]/30"
                          : "bg-white/[0.08] border border-white/10"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} />
                      )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? "text-[#FF8A00]" : isDone ? "text-emerald-400" : "text-gray-600"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-1 mt-[-10px] transition-all ${i < stepIndex ? "bg-emerald-500/60" : "bg-white/10"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-2xl">

          {/* ── Step 1: Email ─────────────────────────────────────────── */}
          {step === "email" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-white font-heading">Forgot Your Password?</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  No worries! Enter your email and we'll send you a reset OTP.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 animate-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-300 font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:border-[#FF6B35]/60 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-sm shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending OTP...</span></>
                  ) : (
                    <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: OTP ───────────────────────────────────────────── */}
          {step === "otp" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-white font-heading">Enter the OTP</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  We sent a 6-digit code to{" "}
                  <span className="text-[#FF8A00] font-black">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 animate-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-300 font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                {/* OTP boxes */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 text-center text-xl font-black rounded-xl border transition-all duration-200 focus:outline-none ${
                        digit
                          ? "bg-[#FF6B35]/15 border-[#FF6B35]/60 text-white shadow-md shadow-[#FF6B35]/10"
                          : "bg-white/[0.06] border-white/10 text-gray-400 focus:border-[#FF6B35]/50"
                      }`}
                      style={{ height: "52px" }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-sm shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
                  ) : (
                    <><span>Verify OTP</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {/* Resend */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); }}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 font-bold transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className={`flex items-center gap-1.5 text-xs font-black transition-colors ${resendCooldown > 0 ? "text-gray-600 cursor-not-allowed" : "text-[#FF6B35] hover:text-[#FF8A00]"}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Step 3: Reset ─────────────────────────────────────────── */}
          {step === "reset" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-white font-heading">Create New Password</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  Choose a strong new password for your account.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 animate-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-300 font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                      className="w-full h-12 pl-10 pr-11 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:border-[#FF6B35]/60 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      className={`w-full h-12 pl-10 pr-11 rounded-xl bg-white/[0.06] border text-white placeholder:text-gray-600 text-sm font-medium focus:outline-none transition-all ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-500/50"
                          : confirmPassword && confirmPassword === newPassword
                          ? "border-emerald-500/50"
                          : "border-white/10 focus:border-[#FF6B35]/60"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-sm shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Resetting...</span></>
                  ) : (
                    <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── Done ─────────────────────────────────────────────────── */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white font-heading mb-2">Password Reset!</h2>
              <p className="text-sm text-gray-400 font-medium mb-1">Your password has been successfully updated.</p>
              <p className="text-xs text-gray-600">Redirecting you to login...</p>
              <div className="mt-5">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-sm shadow-lg"
                >
                  Go to Admin Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {step !== "done" && (
          <div className="text-center mt-5">
            <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 font-bold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
