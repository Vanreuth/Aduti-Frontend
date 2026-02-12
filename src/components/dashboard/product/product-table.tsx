"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Edit, Eye, MoreHorizontal, Package, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import {
  TableFilters,
  type TableFilterConfig,
} from "@/components/dashboard/table-filters";
import type {
  Category,
  Product,
  ProductCreatePayload,
  ProductLifecycleStatus,
  ProductUpdatePayload,
} from "@/types/product";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "@/lib/api/product";
import { getAllCategories } from "@/lib/api/category";
import { toast } from "sonner";

interface ProductRow {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductLifecycleStatus;
  createdAt: string;
  createdByUsername?: string | null;
  createdByPhoto?: string | null;
  imageUrl?: string;
  brand?: string | null;
  description?: string | null;
  product: Product;
}

type VariantForm = {
  id?: number;
  size: string;
  color: string;
  sku: string;
  stockQuantity: string;
  priceAdjustment: string;
  images: File[];
  existingImageUrls: string[];
};

interface ProductFormData {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  brand: string;
  status: ProductLifecycleStatus;
  isActive: boolean;
  isFeatured: boolean;
  featuredOrder: string;
  availableDate: string;
  createdAt: string;
  variants: VariantForm[];
}

type CategoryOption = { label: string; value: string };
const productStatuses: ProductLifecycleStatus[] = [
  "ACTIVE",
  "COMING_SOON",
  "OUT_OF_STOCK",
  "DISCONTINUED",
];
const variantSizePattern = /^[a-zA-Z0-9\s./-]+$/;
const variantColorPattern = /^[a-zA-Z0-9\s#()-]+$/;
const variantSkuPattern = /^[A-Z0-9-_]+$/;
const variantPriceAdjustmentPattern = /^-?\d{1,5}(?:\.\d{1,2})?$/;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function toNumber(value: string, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toOptionalNumber(value?: string) {
  if (!value?.trim()) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function toOptionalInt(value?: string) {
  const num = toOptionalNumber(value);
  if (num === undefined) return undefined;
  return Math.trunc(num);
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function toDateTimeLocalInputValue(value?: string | null) {
  if (!value) return "";

  const normalized = value.trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
    return normalized.slice(0, 16);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function toStatusLabel(status: ProductLifecycleStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function splitVariantLabel(label?: string) {
  const normalized = (label ?? "").trim();
  if (!normalized) return { size: "", color: "" };

  const slashParts = normalized
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (slashParts.length >= 2) {
    return { size: slashParts[0], color: slashParts.slice(1).join(" / ") };
  }

  const dashParts = normalized
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);
  if (dashParts.length >= 2) {
    return { size: dashParts[0], color: dashParts.slice(1).join(" - ") };
  }

  return { size: normalized, color: "" };
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function getPrimaryImage(product: Product) {
  for (const variant of product.variants ?? []) {
    for (const image of variant.images ?? []) {
      if (image.imageUrl) return image.imageUrl;
    }
  }
  return null;
}

function toProductRow(product: Product): ProductRow {
  const variants = product.variants ?? [];
  const primaryVariant = variants[0];
  const stock = variants.reduce(
    (sum, variant) => sum + (variant.stockQuantity ?? 0),
    0,
  );
  const imageUrl = getPrimaryImage(product) ?? undefined;

  return {
    id: product.id,
    name: product.name,
    sku: primaryVariant?.sku ?? "",
    category: product.category?.name ?? "Uncategorized",
    price: product.price,
    stock,
    status: product.status ?? (product.isActive ? "ACTIVE" : "DISCONTINUED"),
    createdAt: toDateInputValue(product.createdAt),
    createdByUsername: product.createdByUsername ?? null,
    createdByPhoto: product.createdByPhoto ?? null,
    imageUrl,
    brand: product.brand ?? null,
    description: product.description ?? null,
    product,
  };
}

function getVariantTabValue(index: number) {
  return `variant-${index}`;
}

export default function ProductDataTable() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "All",
    status: "All",
    sizeValue: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null,
  );
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailCarouselApi, setDetailCarouselApi] = useState<
    CarouselApi | undefined
  >(undefined);
  const [detailActiveImageIndex, setDetailActiveImageIndex] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formTab, setFormTab] = useState("general");
  const [variantTab, setVariantTab] = useState("variant-0");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    brand: "",
    status: "ACTIVE",
    isActive: true,
    isFeatured: false,
    featuredOrder: "",
    availableDate: "",
    createdAt: new Date().toISOString().split("T")[0],
    variants: [
      {
        id: undefined,
        size: "",
        color: "",
        sku: "",
        stockQuantity: "",
        priceAdjustment: "0",
        images: [],
        existingImageUrls: [],
      },
    ],
  });

  const categoryFilter = filters.category ?? "All";
  const statusFilter = (filters.status ?? "All") as ProductLifecycleStatus | "All";
  const sizeValueFilter = filters.sizeValue ?? "";
  const colorFilter = filters.color ?? "";
  const minPriceFilter = filters.minPrice ?? "";
  const maxPriceFilter = filters.maxPrice ?? "";

  const activeFiltersCount = useMemo(() => {
    const baseCount = Object.values(filters).filter(
      (value) => value && value !== "All",
    ).length;
    const dateCount = dateRange.from || dateRange.to ? 1 : 0;
    return baseCount + dateCount;
  }, [filters, dateRange.from, dateRange.to]);

  const filterConfig = useMemo<TableFilterConfig[]>(
    () => [
      {
        key: "category",
        label: "Category",
        type: "select",
        options: categoryOptions,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: productStatuses.map((status) => ({
          label: toStatusLabel(status),
          value: status,
        })),
      },
      {
        key: "sizeValue",
        label: "Size",
        type: "text",
        placeholder: "e.g. L",
      },
      {
        key: "color",
        label: "Color",
        type: "text",
        placeholder: "e.g. Blue",
      },
      {
        key: "minPrice",
        label: "Min Price",
        type: "number",
        placeholder: "0",
      },
      {
        key: "maxPrice",
        label: "Max Price",
        type: "number",
        placeholder: "1000",
      },
      {
        key: "createdAt",
        label: "Created Date",
        type: "daterange",
      },
    ],
    [categoryOptions],
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      status: "All",
      sizeValue: "",
      color: "",
      minPrice: "",
      maxPrice: "",
    });
    setDateRange({ from: "", to: "" });
  };

  const createEmptyVariant = (): VariantForm => ({
    id: undefined,
    size: "",
    color: "",
    sku: "",
    stockQuantity: "",
    priceAdjustment: "0",
    images: [],
    existingImageUrls: [],
  });

  const detailImages = useMemo(() => {
    if (!detailProduct) return [];
    const urls: string[] = [];
    for (const variant of detailProduct.variants ?? []) {
      for (const image of variant.images ?? []) {
        if (image.imageUrl) urls.push(image.imageUrl);
      }
    }
    return Array.from(new Set(urls));
  }, [detailProduct]);

  useEffect(() => {
    if (!detailImages.length) {
      setDetailActiveImageIndex(0);
      return;
    }
    const maxIndex = detailImages.length - 1;
    setDetailActiveImageIndex((prev) => Math.min(prev, maxIndex));
  }, [detailImages]);

  useEffect(() => {
    if (!detailCarouselApi) return;

    const onSelect = () => {
      setDetailActiveImageIndex(detailCarouselApi.selectedScrollSnap());
    };

    onSelect();
    detailCarouselApi.on("select", onSelect);
    detailCarouselApi.on("reInit", onSelect);

    return () => {
      detailCarouselApi.off("select", onSelect);
      detailCarouselApi.off("reInit", onSelect);
    };
  }, [detailCarouselApi]);

  useEffect(() => {
    if (!detailCarouselApi || !detailImages.length) return;
    detailCarouselApi.scrollTo(detailActiveImageIndex, true);
  }, [detailActiveImageIndex, detailCarouselApi, detailImages.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    categoryFilter,
    statusFilter,
    sizeValueFilter,
    colorFilter,
    minPriceFilter,
    maxPriceFilter,
    dateRange.from,
    dateRange.to,
    pageSize,
  ]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const categories = await getAllCategories();
        if (!active) return;
        setCategories(categories);
        const options = categories.map((category) => ({
          label: category.name,
          value: category.slug,
        }));
        setCategoryOptions(options);
      } catch {
        if (!active) return;
        setCategories([]);
        setCategoryOptions([]);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      categoryOptions.length > 0 &&
      categoryFilter !== "All" &&
      !categoryOptions.some((option) => option.value === categoryFilter)
    ) {
      setFilters((prev) => ({ ...prev, category: "All" }));
    }
  }, [categoryOptions, categoryFilter]);

  useEffect(() => {
    let active = true;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllProducts({
          page: Math.max(0, currentPage - 1),
          size: pageSize,
          sortBy: "id",
          direction: "DESC",
          search: debouncedSearch || undefined,
          category: categoryFilter !== "All" ? categoryFilter : undefined,
          sizeValue: sizeValueFilter || undefined,
          color: colorFilter || undefined,
          minPrice: toOptionalNumber(minPriceFilter),
          maxPrice: toOptionalNumber(maxPriceFilter),
          startDate: dateRange.from || undefined,
          endDate: dateRange.to || undefined,
        });

        if (!active) return;
        setProducts((data.products ?? []).map(toProductRow));
        setTotalPages(Math.max(1, data.totalPages ?? 1));
      } catch (err: unknown) {
        if (!active) return;
        setError(getErrorMessage(err, "Failed to load products"));
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    categoryFilter,
    sizeValueFilter,
    colorFilter,
    minPriceFilter,
    maxPriceFilter,
    dateRange.from,
    dateRange.to,
    refreshKey,
  ]);

  const filteredProducts = useMemo(() => {
    if (statusFilter === "All") return products;
    return products.filter((product) => product.status === statusFilter);
  }, [products, statusFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setFormError(null);
    setFormTab("general");
    setVariantTab(getVariantTabValue(0));
    setFormData({
      name: "",
      categoryId: "",
      description: "",
      price: "",
      brand: "",
      status: "ACTIVE",
      isActive: true,
      isFeatured: false,
      featuredOrder: "",
      availableDate: "",
      createdAt: new Date().toISOString().split("T")[0],
      variants: [createEmptyVariant()],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductRow) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormError(null);
    setFormTab("general");
    setVariantTab(getVariantTabValue(0));
    const productCategoryId = product.product.category?.id
      ? String(product.product.category.id)
      : "";
    const variants = (product.product.variants ?? []).map((variant) => {
      const fallback = splitVariantLabel(variant.name);
      return {
        id: variant.id,
        size: variant.size?.trim() || fallback.size,
        color: variant.color?.trim() || fallback.color,
        sku: variant.sku ?? "",
        stockQuantity: String(variant.stockQuantity ?? ""),
        priceAdjustment: String(
          variant.priceAdjustment ?? variant.additionalPrice ?? 0,
        ),
        images: [],
        existingImageUrls: (variant.images ?? [])
          .map((image) => image.imageUrl)
          .filter(Boolean),
      };
    });
    setFormData({
      name: product.name,
      categoryId: productCategoryId,
      description: product.description ?? "",
      price: String(product.price),
      brand: product.brand ?? "",
      status: product.status,
      isActive: product.product.isActive ?? true,
      isFeatured: Boolean(product.product.isFeatured),
      featuredOrder:
        product.product.featuredOrder !== null &&
        product.product.featuredOrder !== undefined
          ? String(product.product.featuredOrder)
          : "",
      availableDate: toDateTimeLocalInputValue(product.product.availableDate),
      createdAt: product.createdAt,
      variants: variants.length > 0 ? variants : [createEmptyVariant()],
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: ProductRow) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = async (product: ProductRow) => {
    setSelectedProduct(product);
    setDetailLoading(true);
    setDetailError(null);
    setDetailProduct(null);
    setDetailActiveImageIndex(0);
    setIsDetailModalOpen(true);
    try {
      const data = await getProductById(product.id);
      if (!data) {
        throw new Error("Product not found");
      }
      setDetailProduct(data);
      setDetailActiveImageIndex(0);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load product details");
      setDetailError(message);
      toast.error("Failed to load product details", {
        description: message,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const addVariant = () => {
    setFormData((prev) => {
      if (prev.variants.length >= 5) return prev;
      const nextVariants = [...prev.variants, createEmptyVariant()];
      setVariantTab(getVariantTabValue(nextVariants.length - 1));
      return { ...prev, variants: nextVariants };
    });
    setFormTab("variants");
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;

    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));

    setVariantTab((prev) => {
      const activeIndex = Number.parseInt(prev.replace("variant-", ""), 10);
      if (Number.isNaN(activeIndex)) return getVariantTabValue(0);
      if (activeIndex === index)
        return getVariantTabValue(Math.max(0, index - 1));
      if (activeIndex > index) return getVariantTabValue(activeIndex - 1);
      return prev;
    });
  };

  const updateVariant = (
    index: number,
    field: "size" | "color" | "sku" | "stockQuantity" | "priceAdjustment",
    value: string,
  ) => {
    setFormData((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [field]: value } as VariantForm;
      return { ...prev, variants: next };
    });
  };

  const updateVariantImages = (index: number, files: FileList | null) => {
    setFormData((prev) => {
      const next = [...prev.variants];
      next[index] = {
        ...next[index],
        images: files ? Array.from(files) : [],
      };
      return { ...prev, variants: next };
    });
  };

  useEffect(() => {
    const activeIndex = Number.parseInt(variantTab.replace("variant-", ""), 10);
    if (Number.isNaN(activeIndex) || activeIndex < 0) {
      setVariantTab(getVariantTabValue(0));
      return;
    }
    if (activeIndex >= formData.variants.length) {
      setVariantTab(
        getVariantTabValue(Math.max(0, formData.variants.length - 1)),
      );
    }
  }, [formData.variants.length, variantTab]);

  const validateVariants = () => {
    const seenSkus = new Set<string>();

    for (let index = 0; index < formData.variants.length; index += 1) {
      const variant = formData.variants[index];
      const sizeValue = variant.size.trim();
      if (!sizeValue) {
        return {
          index,
          message: `Variant ${index + 1}: size is required.`,
        };
      }
      if (sizeValue.length > 50 || !variantSizePattern.test(sizeValue)) {
        return {
          index,
          message: `Variant ${index + 1}: invalid size format.`,
        };
      }

      const colorValue = variant.color.trim();
      if (!colorValue) {
        return {
          index,
          message: `Variant ${index + 1}: color is required.`,
        };
      }
      if (
        colorValue.length < 2 ||
        colorValue.length > 50 ||
        !variantColorPattern.test(colorValue)
      ) {
        return {
          index,
          message: `Variant ${index + 1}: invalid color format.`,
        };
      }

      const skuValue = variant.sku.trim().toUpperCase();
      if (!skuValue) {
        return {
          index,
          message: `Variant ${index + 1}: SKU is required.`,
        };
      }
      if (seenSkus.has(skuValue)) {
        return {
          index,
          message: `Variant ${index + 1}: duplicate SKU (${skuValue}) in form.`,
        };
      }
      if (
        skuValue.length < 3 ||
        skuValue.length > 100 ||
        !variantSkuPattern.test(skuValue)
      ) {
        return {
          index,
          message: `Variant ${index + 1}: SKU format is invalid.`,
        };
      }
      seenSkus.add(skuValue);

      const stockInput = variant.stockQuantity.trim();
      const stockValue = toNumber(stockInput, -1);
      if (!Number.isInteger(stockValue) || stockValue < 0 || stockValue > 999999) {
        return {
          index,
          message: `Variant ${index + 1}: stock is required and must be 0 to 999,999.`,
        };
      }

      const priceAdjustmentValue = variant.priceAdjustment.trim() || "0";
      const parsedPriceAdjustment = Number(priceAdjustmentValue);
      if (
        !Number.isFinite(parsedPriceAdjustment) ||
        parsedPriceAdjustment < -99999.99 ||
        parsedPriceAdjustment > 99999.99 ||
        !variantPriceAdjustmentPattern.test(priceAdjustmentValue)
      ) {
        return {
          index,
          message: `Variant ${index + 1}: price adjustment must be between -99,999.99 and 99,999.99 with max 2 decimals.`,
        };
      }
    }

    return null;
  };

  const variantMetrics = useMemo(() => {
    const basePrice = toNumber(formData.price, 0);
    if (!formData.variants.length) {
      return {
        totalStock: 0,
        minPrice: basePrice,
        maxPrice: basePrice,
      };
    }

    let totalStock = 0;
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = Number.NEGATIVE_INFINITY;

    formData.variants.forEach((variant) => {
      const stockInput = variant.stockQuantity.trim();
      totalStock += Math.max(0, toNumber(stockInput, 0));

      const candidatePrice = basePrice + toNumber(variant.priceAdjustment, 0);
      minPrice = Math.min(minPrice, candidatePrice);
      maxPrice = Math.max(maxPrice, candidatePrice);
    });

    return {
      totalStock,
      minPrice: Number.isFinite(minPrice) ? minPrice : basePrice,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : basePrice,
    };
  }, [formData.price, formData.variants]);

  const variantImagePreviews = useMemo(() => {
    if (typeof window === "undefined") {
      return formData.variants.map(() => []);
    }

    return formData.variants.map((variant) =>
      variant.images.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    );
  }, [formData.variants]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      for (const previews of variantImagePreviews) {
        for (const preview of previews) {
          URL.revokeObjectURL(preview.url);
        }
      }
    };
  }, [variantImagePreviews]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (modalMode === "add") {
      const categoryId = Number(formData.categoryId);
      if (!Number.isFinite(categoryId) || categoryId <= 0) {
        setFormError("Please select a category.");
        setFormTab("general");
        return;
      }

      const variantValidation = validateVariants();
      if (variantValidation) {
        setFormError(variantValidation.message);
        setFormTab("variants");
        setVariantTab(getVariantTabValue(variantValidation.index));
        return;
      }

      const variantsPayload = formData.variants.map((variant) => {
        const stockQuantityValue = toNumber(variant.stockQuantity, 0);
        const skuValue = variant.sku.trim().toUpperCase();
        return {
          size: variant.size.trim(),
          color: variant.color.trim(),
          sku: skuValue,
          stockQuantity: stockQuantityValue,
          priceAdjustment: toNumber(variant.priceAdjustment, 0),
        };
      });

      const priceValue = toNumber(formData.price);
      if (priceValue <= 0) {
        setFormError("Base price must be greater than 0.");
        setFormTab("pricing");
        return;
      }

      const payload: ProductCreatePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: priceValue,
        brand: formData.brand.trim() || undefined,
        categoryId,
        isActive: true,
        isFeatured: false,
        featuredOrder: undefined,
        status: "ACTIVE",
        availableDate: undefined,
        variants: variantsPayload,
      };
      const variantImages = formData.variants.map((variant) => variant.images);

      try {
        setIsSubmitting(true);
        await createProduct(payload, variantImages);
        setIsModalOpen(false);
        setCurrentPage(1);
        setRefreshKey((prev) => prev + 1);
        toast.success("Product created", {
          description: `${payload.name} has been added successfully.`,
        });
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to create product");
        setFormError(message);
        toast.error("Create product failed", {
          description: message,
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (modalMode === "edit" && selectedProduct) {
      const categoryId = Number(formData.categoryId);
      if (!Number.isFinite(categoryId) || categoryId <= 0) {
        setFormError("Please select a category.");
        setFormTab("general");
        return;
      }

      const variantValidation = validateVariants();
      if (variantValidation) {
        setFormError(variantValidation.message);
        setFormTab("variants");
        setVariantTab(getVariantTabValue(variantValidation.index));
        return;
      }

      const variantsPayload = formData.variants.map((variant) => {
        const stockQuantityValue = toNumber(variant.stockQuantity, 0);
        const skuValue = variant.sku.trim().toUpperCase();
        return {
          size: variant.size.trim(),
          color: variant.color.trim(),
          sku: skuValue,
          stockQuantity: stockQuantityValue,
          priceAdjustment: toNumber(variant.priceAdjustment, 0),
        };
      });

      const priceValue = toNumber(formData.price);
      if (priceValue <= 0) {
        setFormError("Base price must be greater than 0.");
        setFormTab("pricing");
        return;
      }

      if (formData.status === "COMING_SOON" && !formData.availableDate.trim()) {
        setFormError("Available date is required for coming soon products.");
        setFormTab("pricing");
        return;
      }

      const featuredOrder = toOptionalInt(formData.featuredOrder);
      if (formData.isFeatured && featuredOrder !== undefined && featuredOrder <= 0) {
        setFormError("Featured order must be greater than 0.");
        setFormTab("pricing");
        return;
      }

      const payload: ProductUpdatePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: priceValue,
        brand: formData.brand.trim() || undefined,
        categoryId,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        featuredOrder: formData.isFeatured ? featuredOrder : undefined,
        status: formData.status,
        availableDate:
          formData.status === "COMING_SOON"
            ? formData.availableDate
            : undefined,
        variants: variantsPayload.map((variant, index) => {
          const variantId = formData.variants[index]?.id;
          return typeof variantId === "number"
            ? { id: variantId, ...variant }
            : variant;
        }),
      };
      const variantImages = formData.variants.map((variant) => variant.images);

      try {
        setIsSubmitting(true);
        await updateProduct(selectedProduct.id, payload, variantImages);
        setIsModalOpen(false);
        setRefreshKey((prev) => prev + 1);
        toast.success("Product updated", {
          description: `${payload.name} has been updated successfully.`,
        });
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to update product");
        setFormError(message);
        toast.error("Update product failed", {
          description: message,
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setRefreshKey((prev) => prev + 1);
      toast.success("Product deleted", {
        description: `${selectedProduct.name} has been deleted.`,
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete product");
      setError(message);
      toast.error("Delete product failed", {
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: ProductLifecycleStatus) => {
    if (status === "ACTIVE") return "default";
    if (status === "OUT_OF_STOCK") return "destructive";
    return "secondary";
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock <= 5) return "destructive";
    if (stock <= 15) return "secondary";
    return "outline";
  };

  const detailPrimaryImage =
    detailImages[detailActiveImageIndex] ?? "/product/placeholder.svg";

  return (
    <div className="w-full space-y-4">
      <TableFilters
        title="Products"
        description="Track inventory, pricing, and availability"
        searchPlaceholder="Search products..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        headerActions={
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        activeFiltersCount={activeFiltersCount}
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        onNumberFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={clearFilters}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => openDetailModal(product)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.brand || "No brand"}</span>
                          <span className="text-muted-foreground/60">•</span>
                          <span>{product.sku || "No SKU"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock)}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {toStatusLabel(product.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {product.createdByPhoto ? (
                        <img
                          src={product.createdByPhoto}
                          alt={product.createdByUsername || "User"}
                          className="h-7 w-7 rounded-full border object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
                          {(product.createdByUsername || "?").slice(0, 2)}
                        </div>
                      )}
                      <span>{product.createdByUsername || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(product);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(product);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(product);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open);
          if (!open) {
            setDetailProduct(null);
            setDetailCarouselApi(undefined);
            setDetailActiveImageIndex(0);
            setDetailError(null);
            setDetailLoading(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Review product information, images, and variants.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center rounded-md border bg-muted/40 py-16 text-sm text-muted-foreground">
              Loading product details...
            </div>
          ) : detailError ? (
            <div className="flex items-center justify-center rounded-md border border-destructive/40 bg-destructive/5 py-10 text-sm text-destructive">
              {detailError}
            </div>
          ) : detailProduct ? (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
                <div className="space-y-3">
                  {detailImages.length > 0 ? (
                    <div className="space-y-3">
                      <Carousel
                        setApi={setDetailCarouselApi}
                        opts={{ loop: detailImages.length > 1 }}
                        className="mx-10"
                      >
                        <CarouselContent>
                          {detailImages.map((image, index) => (
                            <CarouselItem key={`${image}-${index}`}>
                              <div className="relative h-[45vh] w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
                                <Image
                                  src={image}
                                  alt={`${detailProduct.name} image ${index + 1}`}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                                  className="object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {detailImages.length > 1 ? (
                          <>
                            <CarouselPrevious className="-left-9 h-9 w-9" />
                            <CarouselNext className="-right-9 h-9 w-9" />
                          </>
                        ) : null}
                      </Carousel>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{detailImages.length} image(s)</span>
                        <span>
                          {detailActiveImageIndex + 1} / {detailImages.length}
                        </span>
                      </div>

                      {detailImages.length > 1 ? (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {detailImages.map((image, index) => (
                            <button
                              key={`${image}-thumb-${index}`}
                              type="button"
                              onClick={() => {
                                setDetailActiveImageIndex(index);
                                detailCarouselApi?.scrollTo(index);
                              }}
                              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border transition ${
                                detailActiveImageIndex === index
                                  ? "ring-2 ring-primary"
                                  : "hover:border-primary/60"
                              }`}
                            >
                              <Image
                                src={image}
                                alt={`${detailProduct.name} thumbnail ${index + 1}`}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
                      <Image
                        src={detailPrimaryImage}
                        alt={detailProduct.name}
                        fill
                        sizes="(max-width: 640px) 80vw, 300px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {detailProduct.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(
                            detailProduct.status ??
                              (detailProduct.isActive
                                ? "ACTIVE"
                                : "DISCONTINUED"),
                          )}
                        >
                          {toStatusLabel(
                            detailProduct.status ??
                              (detailProduct.isActive
                                ? "ACTIVE"
                                : "DISCONTINUED"),
                          )}
                        </Badge>
                        {detailProduct.isFeatured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : null}
                        <Badge variant="outline">
                          {detailProduct.category?.name ?? "Uncategorized"}
                        </Badge>
                        <Badge variant="outline">
                          {detailProduct.brand || "No brand"}
                        </Badge>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 px-3 py-2 text-right">
                      <p className="text-xs text-muted-foreground">
                        Base Price
                      </p>
                      <p className="text-lg font-semibold">
                        {currencyFormatter.format(detailProduct.price)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {detailProduct.description || "No description provided."}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {formatDate(detailProduct.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="font-medium">
                        {formatDate(detailProduct.updatedAt)}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Variants</p>
                      <p className="font-medium">
                        {detailProduct.variants?.length ?? 0}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Total Stock
                      </p>
                      <p className="font-medium">
                        {(detailProduct.variants ?? []).reduce(
                          (sum, variant) => sum + (variant.stockQuantity ?? 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Variants</h4>
                  <span className="text-xs text-muted-foreground">
                    {detailProduct.variants?.length ?? 0} variants
                  </span>
                </div>
                <div className="max-h-[280px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailProduct.variants &&
                      detailProduct.variants.length ? (
                        detailProduct.variants.map((variant) => {
                          const isVariantAvailable =
                            variant.isAvailable ?? variant.stockQuantity > 0;

                          return (
                            <TableRow key={variant.id}>
                              <TableCell className="font-medium">
                                {variant.sku}
                              </TableCell>
                              <TableCell>
                                {variant.name ||
                                  [variant.size, variant.color]
                                    .filter(Boolean)
                                    .join(" / ") ||
                                  "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                {variant.stockQuantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {currencyFormatter.format(
                                  variant.finalPrice ??
                                    detailProduct.price +
                                      (variant.additionalPrice ??
                                        variant.priceAdjustment ??
                                        0),
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant={
                                    isVariantAvailable
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {isVariantAvailable ? "Available" : "Hidden"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No variants available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No product selected.
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedProduct) {
                  openEditModal(selectedProduct);
                } else if (detailProduct) {
                  openEditModal(toProductRow(detailProduct));
                }
                setIsDetailModalOpen(false);
              }}
              disabled={detailLoading || !!detailError || !detailProduct}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedProduct) {
                  openDeleteModal(selectedProduct);
                } else if (detailProduct) {
                  openDeleteModal(toProductRow(detailProduct));
                }
                setIsDetailModalOpen(false);
              }}
              disabled={detailLoading || !!detailError || !detailProduct}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setFormError(null);
            setIsSubmitting(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? "Create a new product with variants, pricing, and media."
                : "Update product information, variant setup, and media."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-4">
              {formError ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              ) : null}

              <Tabs
                value={formTab}
                onValueChange={setFormTab}
                className="space-y-4"
              >
                <TabsList className="grid h-auto w-full grid-cols-3">
                  <TabsTrigger value="general" className="py-2">
                    General
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="py-2">
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="py-2">
                    Variants
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                          placeholder="Optional"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select
                          value={formData.categoryId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, categoryId: value })
                          }
                        >
                          <SelectTrigger id="categoryId">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No categories
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/10 p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Add a short product description"
                        className="min-h-[110px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    {modalMode === "add" ? (
                      <p className="mb-3 text-xs text-muted-foreground">
                        New products are created as Active and not Featured by default.
                        You can change status and featured settings after creation.
                      </p>
                    ) : null}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Base Price</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              status: value as ProductLifecycleStatus,
                            })
                          }
                          disabled={modalMode === "add"}
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {productStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {toStatusLabel(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="isActive">Active</Label>
                        <Select
                          value={String(formData.isActive)}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              isActive: value === "true",
                            })
                          }
                          disabled={modalMode === "add"}
                        >
                          <SelectTrigger id="isActive">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="isFeatured">Featured</Label>
                        <Select
                          value={String(formData.isFeatured)}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              isFeatured: value === "true",
                            })
                          }
                          disabled={modalMode === "add"}
                        >
                          <SelectTrigger id="isFeatured">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">No</SelectItem>
                            <SelectItem value="true">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="featuredOrder">Featured Order</Label>
                        <Input
                          id="featuredOrder"
                          type="number"
                          min="1"
                          step="1"
                          value={formData.featuredOrder}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              featuredOrder: e.target.value,
                            })
                          }
                          placeholder={
                            modalMode === "add"
                              ? "Set after creation"
                              : "Optional rank (1, 2, 3...)"
                          }
                          disabled={modalMode === "add" || !formData.isFeatured}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="availableDate">Available Date</Label>
                        <Input
                          id="availableDate"
                          type="datetime-local"
                          value={formData.availableDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              availableDate: e.target.value,
                            })
                          }
                          disabled={
                            modalMode === "add" ||
                            formData.status !== "COMING_SOON"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md border bg-muted/10 p-3">
                      <p className="text-xs text-muted-foreground">Variants</p>
                      <p className="text-lg font-semibold">
                        {formData.variants.length}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/10 p-3">
                      <p className="text-xs text-muted-foreground">
                        Total Stock
                      </p>
                      <p className="text-lg font-semibold">
                        {variantMetrics.totalStock}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/10 p-3">
                      <p className="text-xs text-muted-foreground">
                        Price Range
                      </p>
                      <p className="text-sm font-semibold">
                        {currencyFormatter.format(variantMetrics.minPrice)} -{" "}
                        {currencyFormatter.format(variantMetrics.maxPrice)}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">Variant Setup</p>
                        <p className="text-xs text-muted-foreground">
                          Add up to 5 variants with pricing and stock details.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                        disabled={formData.variants.length >= 5}
                      >
                        Add Variant
                      </Button>
                    </div>
                  </div>

                  <Tabs
                    value={variantTab}
                    onValueChange={setVariantTab}
                    className="space-y-4"
                  >
                    <div className="overflow-x-auto pb-1">
                      <TabsList className="h-auto w-max min-w-full gap-1 p-1">
                        {formData.variants.map((_, index) => (
                          <TabsTrigger
                            key={getVariantTabValue(index)}
                            value={getVariantTabValue(index)}
                            className="min-w-[120px] py-2"
                          >
                            Variant {index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    {formData.variants.map((variant, index) => (
                      <TabsContent
                        key={`variant-content-${index}`}
                        value={getVariantTabValue(index)}
                      >
                        <div className="space-y-4 rounded-lg border bg-background p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              Variant {index + 1} Details
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(index)}
                              disabled={formData.variants.length === 1}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                              <Label>Size</Label>
                              <Input
                                value={variant.size}
                                maxLength={50}
                                onChange={(e) =>
                                  updateVariant(index, "size", e.target.value)
                                }
                                placeholder="e.g. M, XL, 42"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Color</Label>
                              <Input
                                value={variant.color}
                                maxLength={50}
                                onChange={(e) =>
                                  updateVariant(index, "color", e.target.value)
                                }
                                placeholder="e.g. Black, #FFFFFF"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>SKU</Label>
                              <Input
                                value={variant.sku}
                                maxLength={100}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "sku",
                                    e.target.value.toUpperCase(),
                                  )
                                }
                                placeholder={
                                  index === 0
                                    ? "Falls back to default SKU if empty"
                                    : "Required"
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                min="0"
                                max="999999"
                                step="1"
                                value={variant.stockQuantity}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "stockQuantity",
                                    e.target.value,
                                  )
                                }
                                placeholder={
                                  index === 0
                                    ? "Falls back to default stock if empty"
                                    : "0"
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Price Adjustment</Label>
                              <Input
                                type="number"
                                min="-99999.99"
                                max="99999.99"
                                step="0.01"
                                value={variant.priceAdjustment}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "priceAdjustment",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="grid gap-2 sm:col-span-2">
                              <Label htmlFor={`variant-images-${index}`}>
                                Variant Images
                              </Label>
                              <Input
                                id={`variant-images-${index}`}
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={modalMode === "edit" && index >= 4}
                                onChange={(e) =>
                                  updateVariantImages(index, e.target.files)
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                {modalMode === "edit" && index >= 4
                                  ? "Image upload is available for variants 1-4 only during update."
                                  : "Upload new images for this variant."}
                              </p>
                              {variant.images.length > 0 ? (
                                <div className="space-y-2 rounded-md border bg-muted/10 p-3">
                                  <p className="text-xs font-medium text-foreground">
                                    New image(s): {variant.images.length}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {variantImagePreviews[index]?.map(
                                      (preview, previewIndex) => (
                                        <div
                                          key={`${preview.name}-${previewIndex}`}
                                          className="overflow-hidden rounded-md border bg-background"
                                        >
                                          <img
                                            src={preview.url}
                                            alt={preview.name}
                                            className="h-24 w-full object-cover"
                                          />
                                          <p className="truncate px-2 py-1 text-[10px] text-muted-foreground">
                                            {preview.name}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}
                              {modalMode === "edit" &&
                              variant.existingImageUrls.length > 0 ? (
                                <div className="space-y-2 rounded-md border bg-muted/10 p-3">
                                  <p className="text-xs font-medium text-foreground">
                                    Existing image(s):{" "}
                                    {variant.existingImageUrls.length}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {variant.existingImageUrls.map(
                                      (imageUrl, existingIndex) => (
                                        <div
                                          key={`${imageUrl}-${existingIndex}`}
                                          className="overflow-hidden rounded-md border bg-background"
                                        >
                                          <img
                                            src={imageUrl}
                                            alt={`Existing variant image ${existingIndex + 1}`}
                                            className="h-24 w-full object-cover"
                                          />
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="rounded-md border bg-muted/10 px-3 py-2 text-xs text-muted-foreground">
                            Final price preview:{" "}
                            <span className="font-semibold text-foreground">
                              {currencyFormatter.format(
                                toNumber(formData.price, 0) +
                                  toNumber(variant.priceAdjustment, 0),
                              )}
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {formData.variants.length}/5 variants configured
              </p>
              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 sm:flex-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "add"
                      ? "Add Product"
                      : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedProduct?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
