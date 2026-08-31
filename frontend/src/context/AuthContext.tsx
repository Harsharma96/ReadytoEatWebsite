"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  loyaltyPoints?: number;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("foodeat_token");
    const storedUser = localStorage.getItem("foodeat_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("foodeat_token");
        localStorage.removeItem("foodeat_user");
      }
    }
    setIsLoading(false);
  }, []);

  const saveAuth = (t: string, u: AuthUser) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("foodeat_token", t);
    localStorage.setItem("foodeat_user", JSON.stringify(u));
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        saveAuth(data.token, data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Login failed." };
    } catch {
      return { success: false, message: "Network error. Please check your connection." };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (data.success) {
        saveAuth(data.token, data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed." };
    } catch {
      return { success: false, message: "Network error. Please check your connection." };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("foodeat_token");
    localStorage.removeItem("foodeat_user");
  }, []);

  const refreshProfile = useCallback(async () => {
    const storedToken = localStorage.getItem("foodeat_token");
    if (!storedToken) return;
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("foodeat_user", JSON.stringify(data.user));
      }
    } catch {
      // silent fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
