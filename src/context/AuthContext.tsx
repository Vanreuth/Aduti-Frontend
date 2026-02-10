"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginApi, type MeResponse } from "@/lib/api/auth";

type AuthContextType = {
  accessToken: string | null;
  user: MeResponse | null;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token on first mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
    setLoading(false);
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    setLoading(true);
    getMe(accessToken)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const login = async (data: { email: string; password: string }) => {
    const res = await loginApi(data as any);

    localStorage.setItem("accessToken", res.token);
    setAccessToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        logout,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
