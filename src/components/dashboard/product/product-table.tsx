"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Edit, Eye, MoreHorizontal, Package, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import type { Category, Product } from "@/types/api";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  type ProductCreatePayload,
} from "@/lib/api/product";
import { getAllCategories } from "@/lib/api/category";

type ProductStatus = "Active" | "Inactive";

interface ProductRow {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  imageUrl?: string;
  brand?: string | null;
  description?: string | null;
  product: Product;
}

type VariantForm = {
  size: string;
  color: string;
  sku: string;
  stockQuantity: string;
  priceAdjustment: string;
  images: File[];
};

interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  price: string;
  brand: string;
  stock: string;
  status: ProductStatus;
  createdAt: string;
  variants: VariantForm[];
}

type CategoryOption = { label: string; value: string };

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

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
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
    status: product.isActive ? "Active" : "Inactive",
    createdAt: toDateInputValue(product.createdAt),
    imageUrl,
    brand: product.brand ?? null,
    description: product.description ?? null,
    product,
  };
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
  const [detailImage, setDetailImage] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    price: "",
    brand: "",
    stock: "",
    status: "Active",
    createdAt: new Date().toISOString().split("T")[0],
    variants: [
      {
        size: "",
        color: "",
        sku: "",
        stockQuantity: "",
        priceAdjustment: "0",
        images: [],
      },
    ],
  });

  const categoryFilter = filters.category ?? "All";
  const statusFilter = (filters.status ?? "All") as ProductStatus | "All";
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
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ],
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
    size: "",
    color: "",
    sku: "",
    stockQuantity: "",
    priceAdjustment: "0",
    images: [],
  });

  const detailImages = useMemo(() => {
    if (!detailProduct) return [];
    const urls: string[] = [];
    for (const variant of detailProduct.variants ?? []) {
      for (const image of variant.images ?? []) {
        if (image.imageUrl) urls.push(image.imageUrl);
      }
    }
    return urls;
  }, [detailProduct]);

  useEffect(() => {
    if (detailImages.length > 0) {
      setDetailImage((prev) => prev ?? detailImages[0]);
    } else {
      setDetailImage(null);
    }
  }, [detailImages, detailImage]);

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
      } catch (err: any) {
        if (!active) return;
        setError(err?.message ?? "Failed to load products");
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
    setFormData({
      name: "",
      sku: "",
      categoryId: "",
      description: "",
      price: "",
      brand: "",
      stock: "",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      variants: [createEmptyVariant()],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductRow) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormError(null);
    const productCategoryId = product.product.category?.id
      ? String(product.product.category.id)
      : "";
    const variants = (product.product.variants ?? []).map((variant) => ({
      size: variant.size ?? "",
      color: variant.color ?? "",
      sku: variant.sku ?? "",
      stockQuantity: String(variant.stockQuantity ?? ""),
      priceAdjustment: String(variant.priceAdjustment ?? 0),
      images: [],
    }));
    setFormData({
      name: product.name,
      sku: product.sku,
      categoryId: productCategoryId,
      description: product.description ?? "",
      price: String(product.price),
      brand: product.brand ?? "",
      stock: String(product.stock),
      status: product.status,
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
    setDetailImage(null);
    setIsDetailModalOpen(true);
    try {
      const data = await getProductById(product.id);
      if (!data) {
        throw new Error("Product not found");
      }
      setDetailProduct(data);
      setDetailImage(getPrimaryImage(data) ?? null);
    } catch (err: any) {
      setDetailError(err?.message ?? "Failed to load product details");
    } finally {
      setDetailLoading(false);
    }
  };

  const addVariant = () => {
    setFormData((prev) => {
      if (prev.variants.length >= 5) return prev;
      return { ...prev, variants: [...prev.variants, createEmptyVariant()] };
    });
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => {
      if (prev.variants.length <= 1) return prev;
      return {
        ...prev,
        variants: prev.variants.filter((_, idx) => idx !== index),
      };
    });
  };

  const updateVariant = (
    index: number,
    field: keyof VariantForm,
    value: string | File[],
  ) => {
    setFormData((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [field]: value } as VariantForm;
      return { ...prev, variants: next };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const baseProduct = selectedProduct?.product;
    const nextId =
      modalMode === "add" ? Date.now() : selectedProduct?.id ?? 1;

    if (modalMode === "add") {
      const categoryId = Number(formData.categoryId);
      if (!Number.isFinite(categoryId) || categoryId <= 0) {
        setFormError("Please select a category.");
        return;
      }

      const variantsPayload = formData.variants.map((variant, index) => {
        const fallbackSku =
          index === 0 ? formData.sku.trim().toUpperCase() : "";
        const fallbackStock =
          index === 0 ? toNumber(formData.stock, 0) : 0;
        const stockQuantityValue = variant.stockQuantity.trim()
          ? toNumber(variant.stockQuantity, 0)
          : fallbackStock;
        const skuValue = variant.sku.trim().toUpperCase() || fallbackSku;
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
        return;
      }

      if (!variantsPayload[0]?.sku) {
        setFormError("Each variant must include a SKU.");
        return;
      }

      const payload: ProductCreatePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: priceValue,
        brand: formData.brand.trim() || undefined,
        categoryId,
        variants: variantsPayload,
      };

      try {
        setIsSubmitting(true);
        await createProduct(
          payload,
          formData.variants.map((variant) => variant.images),
        );
        setIsModalOpen(false);
        setCurrentPage(1);
        setRefreshKey((prev) => prev + 1);
      } catch (err: any) {
        setFormError(err?.message ?? "Failed to create product");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const selectedCategory = categories.find(
      (category) => String(category.id) === formData.categoryId,
    );

    const nextProduct: ProductRow = {
      id: nextId,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category:
        categories.find((category) => String(category.id) === formData.categoryId)
          ?.name ?? "Uncategorized",
      price: toNumber(formData.price),
      stock: toNumber(formData.stock),
      status: formData.status,
      createdAt: formData.createdAt,
      imageUrl: baseProduct ? getPrimaryImage(baseProduct) ?? undefined : undefined,
      brand: baseProduct?.brand ?? null,
      description: baseProduct?.description ?? null,
      product: {
        id: baseProduct?.id ?? nextId,
        name: formData.name.trim(),
        description: formData.description.trim() || baseProduct?.description || "",
        price: toNumber(formData.price),
        brand: formData.brand.trim() || baseProduct?.brand || "",
        isActive: formData.status === "Active",
        createdAt: formData.createdAt,
        updatedAt: baseProduct?.updatedAt ?? null,
        category:
          selectedCategory ??
          baseProduct?.category ?? {
            id: 0,
            name: "Uncategorized",
            slug: "",
            description: null,
            isActive: true,
            createdAt: null,
            updatedAt: null,
            productCount: null,
          },
        variants: baseProduct?.variants ?? [],
      },
    };

    if (modalMode === "edit" && selectedProduct) {
      const categoryId = Number(formData.categoryId);
      if (!Number.isFinite(categoryId) || categoryId <= 0) {
        setFormError("Please select a category.");
        return;
      }

      const variantsPayload = formData.variants.map((variant, index) => {
        const fallbackSku =
          index === 0 ? formData.sku.trim().toUpperCase() : "";
        const fallbackStock =
          index === 0 ? toNumber(formData.stock, 0) : 0;
        const stockQuantityValue = variant.stockQuantity.trim()
          ? toNumber(variant.stockQuantity, 0)
          : fallbackStock;
        const skuValue = variant.sku.trim().toUpperCase() || fallbackSku;
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
        return;
      }

      if (!variantsPayload[0]?.sku) {
        setFormError("Each variant must include a SKU.");
        return;
      }

      const payload: ProductCreatePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: priceValue,
        brand: formData.brand.trim() || undefined,
        categoryId,
        variants: variantsPayload,
      };

      try {
        setIsSubmitting(true);
        await updateProduct(
          selectedProduct.id,
          payload,
          formData.variants.map((variant) => variant.images),
        );
        setIsModalOpen(false);
        setRefreshKey((prev) => prev + 1);
      } catch (err: any) {
        setFormError(err?.message ?? "Failed to update product");
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
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: ProductStatus) => {
    return status === "Active" ? "default" : "secondary";
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock <= 5) return "destructive";
    if (stock <= 15) return "secondary";
    return "outline";
  };

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                  <TableCell>{currencyFormatter.format(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock)}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                <TableCell colSpan={7} className="h-24 text-center">
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
            setDetailImage(null);
            setDetailError(null);
            setDetailLoading(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto">
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
              <div className="grid gap-6 lg:grid-cols-[200px,1fr]">
                <div className="space-y-3">
                  <div className="relative h-[240px] w-full max-w-[200px] overflow-hidden rounded-xl border bg-muted shadow-sm">
                    <Image
                      src={detailImage ?? "/product/placeholder.svg"}
                      alt={detailProduct.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  {detailImages.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {detailImages.map((image) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setDetailImage(image)}
                          className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-md border ${
                            detailImage === image
                              ? "ring-2 ring-primary"
                              : "hover:border-primary/60"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${detailProduct.name} thumbnail`}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {detailProduct.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            detailProduct.isActive ? "default" : "secondary"
                          }
                        >
                          {detailProduct.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {detailProduct.category?.name ?? "Uncategorized"}
                        </Badge>
                        <Badge variant="outline">
                          {detailProduct.brand || "No brand"}
                        </Badge>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 px-3 py-2 text-right">
                      <p className="text-xs text-muted-foreground">Base Price</p>
                      <p className="text-lg font-semibold">
                        {currencyFormatter.format(detailProduct.price)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                <div className="rounded-md border max-h-[240px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailProduct.variants && detailProduct.variants.length ? (
                        detailProduct.variants.map((variant) => (
                          <TableRow key={variant.id}>
                            <TableCell className="font-medium">
                              {variant.sku}
                            </TableCell>
                            <TableCell>{variant.size || "—"}</TableCell>
                            <TableCell>{variant.color || "—"}</TableCell>
                            <TableCell className="text-right">
                              {variant.stockQuantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {currencyFormatter.format(variant.finalPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  variant.isAvailable ? "default" : "secondary"
                                }
                              >
                                {variant.isAvailable ? "Available" : "Hidden"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
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
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
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
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? "Create a new product entry"
                : "Update product information"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {formError ? (
                <p className="text-sm text-destructive">{formError}</p>
              ) : null}

              <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">
                    Info
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="flex-1">
                    Variants
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
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
                        className="min-h-[90px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                              status: value as ProductStatus,
                            })
                          }
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sku">Default SKU (optional)</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          placeholder="Used if variant SKU is empty"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock">Default Stock (optional)</Label>
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          placeholder="Used if variant stock is empty"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 rounded-md border bg-muted/20 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Variants</p>
                          <p className="text-xs text-muted-foreground">
                            Add up to 5 variants. Images are optional.
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

                      <div className="space-y-4">
                        {formData.variants.map((variant, index) => (
                          <div
                            key={`variant-${index}`}
                            className="rounded-md border bg-background p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                Variant {index + 1}
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
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <div className="grid gap-2">
                                <Label>Size</Label>
                                <Input
                                  value={variant.size}
                                  onChange={(e) =>
                                    updateVariant(index, "size", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Color</Label>
                                <Input
                                  value={variant.color}
                                  onChange={(e) =>
                                    updateVariant(index, "color", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>SKU</Label>
                                <Input
                                  value={variant.sku}
                                  onChange={(e) =>
                                    updateVariant(index, "sku", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={variant.stockQuantity}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "stockQuantity",
                                      e.target.value,
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Price Adjustment</Label>
                                <Input
                                  type="number"
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
                              <div className="grid gap-2">
                                <Label>Images</Label>
                                <Input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "images",
                                      Array.from(e.target.files ?? []),
                                    )
                                  }
                                />
                                {variant.images.length > 0 ? (
                                  <p className="text-xs text-muted-foreground">
                                    {variant.images.length} file(s) selected
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : modalMode === "add"
                    ? "Add Product"
                    : "Save Changes"}
              </Button>
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
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
