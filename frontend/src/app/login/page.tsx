"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07080F] flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/70 text-sm font-bold">
        <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
        <span>Redirecting to Admin Portal...</span>
      </div>
    </div>
  );
}
