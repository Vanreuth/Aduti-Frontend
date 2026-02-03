"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include", // ✅ sends httpOnly refresh cookie
      });

      if (!res.ok) {
        setAccessToken(null);
        return false;
      }

      const data = await res.json();
      // adjust field name to match your backend response:
      setAccessToken(data.access_token ?? data.accessToken ?? null);
      return true;
    } catch {
      setAccessToken(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAccessToken(null);
    }
  };

  // ✅ Restore session on page refresh (token stays in memory only, cookie refreshes it)
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, loading, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
