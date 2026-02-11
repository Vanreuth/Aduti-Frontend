import { MeResponse } from "./auth";
import { API_BASE, apiFetch } from "./client";

// register user (with FormData, optional photo)
export async function register(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/users/register`, {
    method: "POST",
    body: formData, // ✅ FormData, browser sets Content-Type automatically
  });

  const contentType = res.headers.get("content-type") || "";

  let data: any;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    throw new Error(
      typeof data === "string" ? data : data.message || "Register failed",
    );
  }

  return data; // server response
}

export function updateMe(payload: FormData, token: string) {
  return apiFetch<MeResponse>(
    "/api/users/me",
    {
      method: "PUT",
      body: payload, // FormData
    },
    token,
  );
}

export type ProfilePayload = {
  name: string;
  address?: string;
  phoneNumber?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
