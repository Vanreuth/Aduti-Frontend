import type { ApiResponse, Category } from "@/types/api";
import { apiFetch, api } from "@/lib/api/client";

export async function getAllCategories(): Promise<Category[]> {
  const json = await api<ApiResponse<Category[]>>("/api/categories");
  return json.data;
}

export async function getCategoryById(id: string | number): Promise<Category> {
  const json = await api<ApiResponse<Category>>(`/api/categories/${id}`);
  return json.data;
}

export type CategoryRequestPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export async function createCategory(payload: CategoryRequestPayload) {
  const json = await apiFetch<ApiResponse<Category>>("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateCategory(
  id: number,
  payload: CategoryRequestPayload,
) {
  const json = await apiFetch<ApiResponse<Category>>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function deleteCategory(id: number) {
  const json = await apiFetch<ApiResponse<null>>(`/api/categories/${id}`, {
    method: "DELETE",
  });
  return json.data;
}
