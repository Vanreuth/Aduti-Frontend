import { apiFetch } from "./client";
import type { UserProfile } from "@/types/user";

// List all users
export function listUsers() {
  return apiFetch("/api/v1/users", { method: "GET" }) as Promise<UserProfile[]>;
}

// Create a new user profile (admin)
export function createUserProfile(payload: Partial<UserProfile>) {
  return apiFetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<UserProfile>;
}

// Update user profile by id
export function updateUserProfile(
  id: number | string,
  payload: Partial<UserProfile>,
) {
  return apiFetch(`/api/v1/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }) as Promise<UserProfile>;
}

// Delete user profile by id
export function deleteUserProfile(id: number | string) {
  return apiFetch(`/api/v1/users/${id}`, {
    method: "DELETE",
  }) as Promise<void>;
}
