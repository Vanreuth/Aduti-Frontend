import type { ApiResponse } from "@/types/api";
import { api, apiFetch } from "@/lib/api/client";
import type {
  GetAllProductsParams,
  Product,
  ProductCreatePayload,
  ProductDetailData,
  ProductListData,
  ProductUpdatePayload,
} from "@/types/product";

function toDateParam(value?: string | Date) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toISOString().slice(0, 10);
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toLocalDateTimeString(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
  )}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(
    date.getSeconds(),
  )}`;
}

function toBackendDateTime(value?: string) {
  if (!value?.trim()) return undefined;

  const normalized = value.trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return toLocalDateTimeString(date);
}

type VariantFiles = Array<File[] | undefined>;

type VariantInput = {
  id?: number;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  priceAdjustment: number;
};

function normalizeVariantForBackend(variant: VariantInput) {
  return {
    ...(typeof variant.id === "number" ? { id: variant.id } : {}),
    size: variant.size.trim(),
    color: variant.color.trim(),
    sku: variant.sku.trim().toUpperCase(),
    stockQuantity: variant.stockQuantity,
    priceAdjustment: Number(variant.priceAdjustment ?? 0),
  };
}

function normalizeProductPayload(
  payload: ProductCreatePayload | ProductUpdatePayload,
) {
  return {
    name: payload.name,
    description: payload.description,
    price: payload.price,
    brand: payload.brand,
    categoryId: payload.categoryId,
    isActive: payload.isActive,
    isFeatured: payload.isFeatured,
    featuredOrder: payload.featuredOrder,
    status: payload.status,
    availableDate: toBackendDateTime(payload.availableDate),
    variants: payload.variants.map(normalizeVariantForBackend),
  };
}

function appendVariantImages(
  formData: FormData,
  variantImages?: VariantFiles,
  maxVariantCount = 5,
) {
  if (!variantImages?.length) return;

  for (let variantIndex = 0; variantIndex < variantImages.length; variantIndex += 1) {
    if (variantIndex >= maxVariantCount) break;
    const files = variantImages[variantIndex];
    if (!files?.length) continue;

    for (const file of files) {
      formData.append(`variant_${variantIndex}_images`, file);
    }
  }
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
  if (params?.minPrice !== undefined)
    sp.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined)
    sp.set("maxPrice", String(params.maxPrice));

  const startDate = toDateParam(params?.startDate);
  const endDate = toDateParam(params?.endDate);
  if (startDate) sp.set("startDate", startDate);
  if (endDate) sp.set("endDate", endDate);

  const json = await api<ApiResponse<ProductListData>>(`/api/products?${sp}`);
  return json.data;
}

export async function getBestSellers(limit: number = 12) {
  const sp = new URLSearchParams({ limit: String(limit) });
  const json = await api<ApiResponse<Product[]>>(`/api/products/best-sellers?${sp}`);
  return json.data ?? [];
}

export async function getFeaturedProducts(limit?: number) {
  const json = await api<ApiResponse<Product[]>>("/api/products/featured");
  const products = json.data ?? [];
  return limit === undefined ? products : products.slice(0, Math.max(0, limit));
}

export async function getComingSoonProducts(limit?: number) {
  const json = await api<ApiResponse<Product[]>>("/api/products/coming-soon");
  const products = json.data ?? [];
  return limit === undefined ? products : products.slice(0, Math.max(0, limit));
}

type ProductDetailResponse = Product | ProductDetailData;

export async function getProductById(id: string | number) {
  const encodedId = encodeURIComponent(String(id));
  const json = await api<ApiResponse<ProductDetailResponse>>(
    `/api/products/${encodedId}`,
  );
  if (json.data && typeof json.data === "object" && "product" in json.data) {
    return (json.data as ProductDetailData).product;
  }
  return json.data as Product;
}

export async function getProductDetail(id: string | number) {
  const encodedId = encodeURIComponent(String(id));
  const json = await api<ApiResponse<ProductDetailResponse>>(
    `/api/products/${encodedId}`,
  );

  if (json.data && typeof json.data === "object" && "product" in json.data) {
    const data = json.data as ProductDetailData;
    return { product: data.product, relatedProducts: data.relatedProducts ?? [] };
  }

  return { product: json.data as Product, relatedProducts: [] };
}

/** ✅ Cookie auth: no accessToken param */
export async function createProduct(
  payload: ProductCreatePayload,
  variantImages?: VariantFiles,
) {
  const normalizedPayload = normalizeProductPayload(payload);
  const formData = new FormData();
  formData.append("product", JSON.stringify(normalizedPayload));
  appendVariantImages(formData, variantImages, 5);

  return apiFetch<ApiResponse<Product>>("/api/products", {
    method: "POST",
    body: formData,
  });
}

/** ✅ Cookie auth: no accessToken param */
export async function updateProduct(
  id: number,
  payload: ProductUpdatePayload,
  variantImages?: VariantFiles,
) {
  const encodedId = encodeURIComponent(String(id));
  const normalizedPayload = normalizeProductPayload(payload);

  const formData = new FormData();
  formData.append("product", JSON.stringify(normalizedPayload));
  appendVariantImages(formData, variantImages, 4);

  return apiFetch<ApiResponse<Product>>(`/api/products/${encodedId}`, {
    method: "PUT",
    body: formData,
  });
}

export async function updateProductFeatured(id: number, featured: boolean, order?: number) {
  const encodedId = encodeURIComponent(String(id));
  const sp = new URLSearchParams({ featured: String(featured) });
  if (order !== undefined) sp.set("order", String(order));

  return apiFetch<ApiResponse<Product>>(
    `/api/admin/products/${encodedId}/featured?${sp}`,
    { method: "PUT" },
  );
}

export async function updateProductStatus(
  id: number,
  status: string,
  availableDate?: string,
) {
  const encodedId = encodeURIComponent(String(id));
  const sp = new URLSearchParams({ status });

  const backendAvailableDate = toBackendDateTime(availableDate);
  if (backendAvailableDate) sp.set("availableDate", backendAvailableDate);

  return apiFetch<ApiResponse<Product>>(
    `/api/admin/products/${encodedId}/status?${sp}`,
    { method: "PUT" },
  );
}

export async function deleteProduct(id: number) {
  const encodedId = encodeURIComponent(String(id));
  return apiFetch<ApiResponse<null>>(`/api/products/${encodedId}`, {
    method: "DELETE",
  });
}
