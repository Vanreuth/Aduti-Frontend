export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdByUsername?: string | null;
  createdByPhoto: string | null;
  productCount: number | null;
};

export type ProductImage = {
  id: number;
  imageUrl: string;
  imageKey: string;
  uploadedAt: string | null;
};

export type ProductVariant = {
  id: number;
  name?: string;
  size?: string;
  color?: string;
  sku: string;
  stockQuantity: number;
  priceAdjustment?: number;
  additionalPrice?: number;
  finalPrice?: number;
  isAvailable?: boolean;
  createdAt: string | null;
  images: ProductImage[];
};

export type ProductLifecycleStatus =
  | "ACTIVE"
  | "COMING_SOON"
  | "OUT_OF_STOCK"
  | "DISCONTINUED";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  isActive: boolean;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  status?: ProductLifecycleStatus;
  availableDate?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdByUsername?: string | null;
  createdByPhoto?: string | null;
  category: Category;
  variants: ProductVariant[];
};

export type CreateProductData = {
  name: string;
  description: string;
}

export type ProductListData = {
  products: Product[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ProductDetailData = {
  product: Product;
  relatedProducts: Product[];
};

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

export type ProductCreatePayload = {
  name: string;
  description?: string;
  price: number;
  brand?: string;
  categoryId: number;
  isActive: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  status: ProductLifecycleStatus;
  availableDate?: string;
  variants: Array<{
    size: string;
    color: string;
    sku: string;
    stockQuantity: number;
    priceAdjustment: number;
  }>;
};

export type ProductUpdatePayload = Omit<ProductCreatePayload, "variants"> & {
  variants: Array<{
    id?: number;
    size: string;
    color: string;
    sku: string;
    stockQuantity: number;
    priceAdjustment: number;
  }>;
};
