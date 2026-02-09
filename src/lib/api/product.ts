import type { ApiResponse, Product, ProductListData } from "@/types/api";
import { api } from "@/lib/api/client";

export type GetAllProductsParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string | Date;
  endDate?: string | Date;
};

function toDateParam(value?: string | Date) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toISOString().slice(0, 10);
}

export async function getAllProducts(params?: GetAllProductsParams) {
  const sp = new URLSearchParams({
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 12),
    sortBy: params?.sortBy ?? "id",
    direction: params?.direction ?? "DESC",
  });

  if (params?.search?.trim()) sp.set("search", params.search.trim());
  if (params?.category?.trim()) sp.set("category", params.category.trim());
  if (params?.minPrice !== undefined) sp.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) sp.set("maxPrice", String(params.maxPrice));

  const startDate = toDateParam(params?.startDate);
  const endDate = toDateParam(params?.endDate);
  if (startDate) sp.set("startDate", startDate);
  if (endDate) sp.set("endDate", endDate);

  const json = await api<ApiResponse<ProductListData>>(`/api/products?${sp}`);
  return json.data;
}

export async function getProductById(id: string | number) {
  const json = await api<ApiResponse<Product>>(`/api/products/${id}`);
  return json.data;
}




