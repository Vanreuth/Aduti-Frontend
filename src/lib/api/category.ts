import type { ApiResponse, Category } from "@/types/api";
import { api } from "@/lib/api/client";

export async function getAllCategories(): Promise<Category[]> {
  const json = await api<ApiResponse<Category[]>>(`/api/categories`);
  return json.data ?? [];
}
