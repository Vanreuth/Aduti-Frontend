"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FilterSidebar,
  SearchHeader,
  EmptyState,
  FiltersPanel,
  ProductGrid,
  ShopLoading,
  priceRanges,
} from "@/components/shop";
import type { ProductListData } from "@/types/api";
import { getAllProducts } from "@/lib/api/product";
import { getAllCategories } from "@/lib/api/category";

import { motion, AnimatePresence } from "framer-motion";
import { fadeUpItem } from "@/lib/utils";


type SortBy = "featured" | "price-low" | "price-high" | "newest";

export const ShopContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || "";
  const urlCategoryParam = (searchParams.get("category") || "all")
    .trim()
    .toLowerCase();

  const initialSortBy = useMemo<SortBy>(() => {
    if (filterParam === "new") return "newest";
    if (filterParam === "price-low") return "price-low";
    if (filterParam === "price-high") return "price-high";
    return "featured";
  }, [filterParam]);

  // Data states
  const [pageData, setPageData] = useState<ProductListData>({
    products: [],
    pageNumber: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState(0);
  const [categorySlug, setCategorySlug] = useState<string>(urlCategoryParam || "all");
  const [sizeValue, setSizeValue] = useState<string>("all");
  const [colorValue, setColorValue] = useState<string>("all");
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ label: string; value: string }>
  >([{ label: "All", value: "all" }]);
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const updateCategoryParam = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!slug || slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
      router.replace(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    setCategorySlug(urlCategoryParam || "all");
    setPage(0);
  }, [urlCategoryParam]);

  // Debounce search input
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(localQuery.trim());
    }, 350);
    return () => clearTimeout(handle);
  }, [localQuery]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const categories = await getAllCategories();
        if (!alive) return;
        const activeCategories = categories
          .filter((category) => category.isActive)
          .map((category) => ({
            label: category.name,
            value: category.slug,
          }));
        setCategoryOptions([{ label: "All", value: "all" }, ...activeCategories]);
      } catch {
        if (!alive) return;
        setCategoryOptions([{ label: "All", value: "all" }]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    let mounted = true;

    const categoryFilter =
      categorySlug && categorySlug !== "all" ? categorySlug : undefined;
    const sizeFilter =
      sizeValue && sizeValue !== "all" ? sizeValue : undefined;
    const colorFilter =
      colorValue && colorValue !== "all" ? colorValue : undefined;
    const range = priceRanges[priceRange];
    const minPrice = range.min > 0 ? range.min : undefined;
    const maxPrice =
      range.max < Number.MAX_SAFE_INTEGER ? range.max : undefined;

    const sortConfig = (() => {
      if (sortBy === "price-low") return { sortBy: "price", direction: "ASC" as const };
      if (sortBy === "price-high") return { sortBy: "price", direction: "DESC" as const };
      if (sortBy === "newest") return { sortBy: "createdAt", direction: "DESC" as const };
      return { sortBy: "id", direction: "DESC" as const };
    })();

    setFetching(true);
    setError(null);

    (async () => {
      try {
        const products = await getAllProducts({
          page,
          size: pageSize,
          sortBy: sortConfig.sortBy,
          direction: sortConfig.direction,
          search: debouncedQuery || undefined,
          category: categoryFilter,
          sizeValue: sizeFilter,
          color: colorFilter,
          minPrice,
          maxPrice,
        });

        if (!mounted) return;
        setPageData(products);
      } catch (e: unknown) {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Failed to load products");
        }
      } finally {
        if (mounted) {
          setFetching(false);
          setProductsLoaded(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [
    page,
    pageSize,
    debouncedQuery,
    priceRange,
    categorySlug,
    sizeValue,
    colorValue,
    sortBy,
  ]);

  const sizeOptions = useMemo(() => {
    const values = new Set<string>();
    for (const product of pageData.products) {
      for (const variant of product.variants ?? []) {
        if (variant.size) values.add(String(variant.size));
      }
    }
    if (sizeValue && sizeValue !== "all") values.add(sizeValue);
    return [{ label: "All", value: "all" }].concat(
      Array.from(values)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ label: value, value })),
    );
  }, [pageData.products, sizeValue]);

  const colorOptions = useMemo(() => {
    const values = new Set<string>();
    for (const product of pageData.products) {
      for (const variant of product.variants ?? []) {
        if (variant.color) values.add(String(variant.color));
      }
    }
    if (colorValue && colorValue !== "all") values.add(colorValue);
    return [{ label: "All", value: "all" }].concat(
      Array.from(values)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ label: value, value })),
    );
  }, [pageData.products, colorValue]);

  const handleReset = () => {
    setPriceRange(0);
    setCategorySlug("all");
    setSizeValue("all");
    setColorValue("all");
    setSortBy("featured");
    setPage(0);
    updateCategoryParam("all");
  };

  const handleClearAll = () => {
    setLocalQuery("");
    setDebouncedQuery("");
    setPriceRange(0);
    setCategorySlug("all");
    setSizeValue("all");
    setColorValue("all");
    setSortBy("featured");
    setPage(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("category");
    const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    router.replace(newUrl, { scroll: false });
  };

  const clearSearch = () => {
    setLocalQuery("");
    setDebouncedQuery("");
    setPage(0);
    if (searchParams.has("search")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
      router.replace(newUrl);
    }
  };

  const gridKey = `${debouncedQuery}|${priceRange}|${sortBy}|${page}|${pageData.products.length}`;

  const isInitialLoading = !productsLoaded;
  const totalResults = pageData.totalElements ?? pageData.products.length;
  const totalPages = Math.max(1, pageData.totalPages ?? 1);
  const currentPage = pageData.pageNumber ?? page;
  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;
  const pageStart = totalResults === 0 ? 0 : currentPage * pageSize + 1;
  const pageEnd =
    totalResults === 0
      ? 0
      : Math.min(
          totalResults,
          pageStart + Math.max(0, pageData.products.length - 1),
        );
  const resultsLabel =
    totalResults === 0
      ? "No results"
      : `Showing ${pageStart}-${pageEnd} of ${totalResults}`;

  const sortLabels: Record<SortBy, string> = {
    featured: "Featured",
    newest: "Newest",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
  };

  const activeFilters = [
    debouncedQuery
      ? {
          id: "search",
          label: `Search: ${debouncedQuery}`,
          onRemove: clearSearch,
        }
      : null,
    categorySlug && categorySlug !== "all"
      ? {
          id: "category",
          label:
            categoryOptions.find((option) => option.value === categorySlug)
              ?.label ?? "Category",
          onRemove: () => {
            setCategorySlug("all");
            setPage(0);
          },
        }
      : null,
    sizeValue && sizeValue !== "all"
      ? {
          id: "size",
          label:
            sizeOptions.find((option) => option.value === sizeValue)?.label ??
            "Size",
          onRemove: () => {
            setSizeValue("all");
            setPage(0);
          },
        }
      : null,
    colorValue && colorValue !== "all"
      ? {
          id: "color",
          label:
            colorOptions.find((option) => option.value === colorValue)?.label ??
            "Color",
          onRemove: () => {
            setColorValue("all");
            setPage(0);
          },
        }
      : null,
    priceRange > 0
      ? {
          id: "price",
          label: priceRanges[priceRange]?.label ?? "Price",
          onRemove: () => {
            setPriceRange(0);
            setPage(0);
          },
        }
      : null,
    sortBy !== "featured"
      ? {
          id: "sort",
          label: `Sort: ${sortLabels[sortBy]}`,
          onRemove: () => {
            setSortBy("featured");
            setPage(0);
          },
        }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    label: string;
    onRemove: () => void;
  }>;

  const activeFilterCount =
    (priceRange > 0 ? 1 : 0) +
    (categorySlug !== "all" ? 1 : 0) +
    (sizeValue !== "all" ? 1 : 0) +
    (colorValue !== "all" ? 1 : 0);

  if (isInitialLoading) {
    return <ShopLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-md w-full">
          <p className="font-semibold text-zinc-900">Failed to load shop</p>
          <p className="text-sm text-zinc-600 mt-2">{error}</p>
          <Button className="mt-4 w-full" onClick={() => location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div variants={fadeUpItem} initial="hidden" animate="show">
        <SearchHeader
          title="Shop"
          subtitle="Discover new arrivals, timeless basics, and statement pieces."
          query={localQuery}
          sortBy={sortBy}
          resultsCount={totalResults}
          resultsLabel={resultsLabel}
          filters={activeFilters}
          onClearAll={activeFilters.length > 0 ? handleClearAll : undefined}
          isUpdating={fetching}
          onQueryChange={(value) => {
            setLocalQuery(value);
            setPage(0);
          }}
          onSortChange={(value) => {
            setSortBy(value);
            setPage(0);
          }}
          onClear={clearSearch}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FiltersPanel activeCount={activeFilterCount}>
            <FilterSidebar
              categories={categoryOptions}
              categorySlug={categorySlug}
              sizeOptions={sizeOptions}
              sizeValue={sizeValue}
              onSizeChange={(value) => {
                setSizeValue(value);
                setPage(0);
              }}
              colorOptions={colorOptions}
              colorValue={colorValue}
              onColorChange={(value) => {
                setColorValue(value);
                setPage(0);
              }}
              onCategoryChange={(slug) => {
                setCategorySlug(slug);
                setPage(0);
                updateCategoryParam(slug);
              }}
              priceRange={priceRange}
              onPriceRangeChange={(idx) => {
                setPriceRange(idx);
                setPage(0);
              }}
              onReset={handleReset}
            />
          </FiltersPanel>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {pageData.products.length === 0 && !fetching ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EmptyState onClearFilters={handleClearAll} />
                </motion.div>
              ) : (
                <motion.div
                  key={gridKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductGrid
                    products={pageData.products}
                    isUpdating={fetching}
                    animated
                    animationKey={gridKey}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirstPage || fetching}
              >
                Previous
              </Button>

              <div className="text-sm text-zinc-600">
                Page {Math.min(currentPage + 1, totalPages)} of {totalPages}
              </div>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={isLastPage || fetching}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
