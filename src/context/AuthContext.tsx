"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getMe,
  loginApi,
  logout as logoutApi,
  type MeResponse,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  accessToken: string | null;
  user: MeResponse | null;
  setAccessToken: (token: string | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setAccessToken(token);
  }, []);

  // Fetch user whenever accessToken changes
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getMe(accessToken)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await loginApi(credentials);
    setAccessToken(response.token);
    localStorage.setItem("accessToken", response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await logoutApi(); // call backend
    } catch (err) {
      console.error("Server logout failed", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      router.push("/"); // ✅ use useRouter
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        loading,
        setAccessToken,
      }}
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
