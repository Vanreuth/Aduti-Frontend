export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  productCount?: number | null;
};

export type ProductImage = {
  id: number;
  imageUrl: string;
  imageKey: string;
  uploadedAt?: string | null;
};

export type ProductVariant = {
  id: number;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  priceAdjustment: number;
  finalPrice: number;
  isAvailable: boolean;
  createdAt?: string | null;
  images: ProductImage[];
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  category?: Category | null;
  variants?: ProductVariant[] | null;
};

export type ProductListData = {
  products: Product[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
