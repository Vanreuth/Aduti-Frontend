import { apiFetch } from "./client";
import type { UserProfile } from "@/types/user";

// register user
export function register(payload: any) {
  return apiFetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMe(payload: string, token: string) {
  return apiFetch(
    "/api/users/me",
    {
      method: "PUT",
      body: JSON.stringify(payload),
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
