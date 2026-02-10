import type {
  ApiResponse,
  Product,
  ProductDetailData,
  ProductListData,
} from "@/types/api";
import { API_BASE, api } from "@/lib/api/client";

export type GetAllProductsParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
  search?: string;
  category?: string;
  sizeValue?: string;
  color?: string;
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
  if (params?.category?.trim()) sp.set("categorySlug", params.category.trim());
  if (params?.sizeValue?.trim()) sp.set("sizeValue", params.sizeValue.trim());
  if (params?.color?.trim()) sp.set("color", params.color.trim());
  if (params?.minPrice !== undefined) sp.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) sp.set("maxPrice", String(params.maxPrice));

  const startDate = toDateParam(params?.startDate);
  const endDate = toDateParam(params?.endDate);
  if (startDate) sp.set("startDate", startDate);
  if (endDate) sp.set("endDate", endDate);

  const json = await api<ApiResponse<ProductListData>>(`/api/products?${sp}`);
  return json.data;
}

type ProductDetailResponse = Product | ProductDetailData;

export async function getProductById(id: string | number) {
  const json = await api<ApiResponse<ProductDetailResponse>>(
    `/api/products/${id}`,
  );
  if (json.data && "product" in json.data) {
    return json.data.product;
  }
  return json.data;
}

export async function getProductDetail(id: string | number) {
  const json = await api<ApiResponse<ProductDetailResponse>>(
    `/api/products/${id}`,
  );
  if (json.data && "product" in json.data) {
    return {
      product: json.data.product,
      relatedProducts: json.data.relatedProducts ?? [],
    };
  }
  return { product: json.data, relatedProducts: [] };
}

export type ProductCreatePayload = {
  name: string;
  description?: string;
  price: number;
  brand?: string;
  categoryId: number;
  variants: Array<{
    size: string;
    color: string;
    sku: string;
    stockQuantity: number;
    priceAdjustment: number;
  }>;
};

export type ProductUpdatePayload = ProductCreatePayload;

export async function createProduct(
  payload: ProductCreatePayload,
  variantImages: File[][],
) {
  if (!API_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const formData = new FormData();
  formData.append("product", JSON.stringify(payload));

  variantImages.forEach((files, index) => {
    files.forEach((file) => {
      formData.append(`variant_${index}_images`, file);
    });
  });

  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as ApiResponse<Product>;
}

export async function updateProduct(
  id: number,
  payload: ProductUpdatePayload,
  variantImages: File[][],
) {
  if (!API_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const formData = new FormData();
  formData.append("product", JSON.stringify(payload));

  variantImages.slice(0, 4).forEach((files, index) => {
    files.forEach((file) => {
      formData.append(`variant_${index}_images`, file);
    });
  });

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as ApiResponse<Product>;
}

export async function deleteProduct(id: number) {
  if (!API_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as ApiResponse<null>;
}


