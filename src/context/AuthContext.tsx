"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { me, type MeResponse } from "@/lib/api/auth";

type AuthContextType = {
  accessToken: string | null;
  user: MeResponse | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // whenever token changes, load /me
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!accessToken) {
          setUser(null);
          return;
        }
        const profile = await me(accessToken);
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, setAccessToken, loading, logout }}
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
