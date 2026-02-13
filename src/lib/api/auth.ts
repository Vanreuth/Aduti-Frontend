// src/lib/api/auth.ts

import { apiFetch } from "./client";

export type MeResponse = {
  username: string;
  email: string;
  bio: string;
  photo: string | null;
  phoneNumber: string | null;
  address: string | null;
  roles?: string[];
  role?: string;
};

export type LoginResponse = {
  user: MeResponse;
};

export type LoginData = {
  username: string;
  password: string;
};

export async function loginApi(data: LoginData): Promise<LoginResponse | null> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return apiFetch<MeResponse>("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });
}

export async function logoutApi() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
